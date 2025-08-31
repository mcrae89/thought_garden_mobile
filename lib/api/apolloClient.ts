import { ApolloClient, InMemoryCache, HttpLink, from, ApolloLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { Observable } from "@apollo/client/utilities";
import Constants from "expo-constants";
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "../auth/tokens";
import { isJwtExpiringSoon } from "../auth/jwt";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

// Standard HTTP link
const httpLink = new HttpLink({
  uri: apiUrl,
  fetch,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

// Attach Authorization header (sanitizes accidental "Bearer " in storage)
const authLink = setContext(async (_, { headers }) => {
  let token = await getAccessToken();
  if (token?.startsWith("Bearer ")) token = token.slice(7);
  return { headers: { ...headers, ...(token ? { Authorization: `Bearer ${token}` } : {}) } };
});

// ---- refresh machinery ----
const REFRESH_GQL = `
  mutation Refresh($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) { accessToken refreshToken }
  }
`;

let refreshing = false;
let waiters: Array<() => void> = [];

async function runRefresh(): Promise<boolean> {
  const rt = await getRefreshToken();
  if (!rt) return false;

  const res = await fetch(apiUrl!, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query: REFRESH_GQL, variables: { refreshToken: rt } }),
  });

  if (!res.ok) return false;

  const json = await res.json();
  const payload = json?.data?.refreshToken;
  if (!payload?.accessToken || !payload?.refreshToken) return false;

  await setTokens(payload.accessToken, payload.refreshToken);
  return true;
}

// Pre-emptive: if token expiring soon, refresh first, then send the op
const preemptiveLink = new ApolloLink((operation, forward) => new Observable(observer => {
  (async () => {
    const token = await getAccessToken();
    if (token && isJwtExpiringSoon(token, 60_000)) {
      if (!refreshing) {
        refreshing = true;
        const ok = await runRefresh();
        refreshing = false;
        waiters.forEach(fn => fn()); waiters = [];
        if (!ok) await clearTokens();
      } else {
        await new Promise<void>(res => { waiters.push(res); });
      }
    }
    forward!(operation).subscribe({
      next: observer.next.bind(observer),
      error: observer.error.bind(observer),
      complete: observer.complete.bind(observer),
    });
  })();
}));

// Reactive: if server still says unauth, refresh then retry
const refreshLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  const authError = graphQLErrors?.some(e => e?.extensions?.code === "AUTH_NOT_AUTHENTICATED") || (networkError as any)?.statusCode === 401;
  if (!authError) return;
  if (!refreshing) {
    refreshing = true;
    (async () => {
      const ok = await runRefresh();
      refreshing = false;
      waiters.forEach(fn => fn()); waiters = [];
      if (!ok) await clearTokens();
    })();
  }
  return new Observable(observer => {
    waiters.push(() => {
      forward!(operation).subscribe({
        next: observer.next.bind(observer),
        error: observer.error.bind(observer),
        complete: observer.complete.bind(observer),
      });
    });
  });
});

export const client = new ApolloClient({
  link: from([preemptiveLink, refreshLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});