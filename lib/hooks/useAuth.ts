import { useMutation } from "@apollo/client";
import { LOGIN, REGISTER } from "../api/operations";
import { setTokens, clearTokens } from "../auth/tokens";

export function useAuth() {
  const [loginMut, loginState] = useMutation(LOGIN);
  const [registerMut, registerState] = useMutation(REGISTER);

  const login = async (email: string, password: string) => {
    const { data } = await loginMut({ variables: { email, password } });
    const { accessToken, refreshToken } = data.loginUser;
    await setTokens(accessToken, refreshToken);
  };

  const register = async (username: string, email: string, password: string) => {
    await registerMut({ variables: { username, email, password } });
    // best UX: immediately log in after register
    await login(email, password);
  };

  const logout = async () => { await clearTokens(); };

  return { login, register, logout, state: { login: loginState, register: registerState } };
}
