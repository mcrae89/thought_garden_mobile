import * as SecureStore from "expo-secure-store";

export async function setTokens(access: string, refresh: string) {
  await SecureStore.setItemAsync("accessToken", access);
  await SecureStore.setItemAsync("refreshToken", refresh);
}

export async function getAccessToken() {
  return SecureStore.getItemAsync("accessToken");
}

export async function getRefreshToken() {
  return SecureStore.getItemAsync("refreshToken");
}

export async function clearTokens() {
  await SecureStore.deleteItemAsync("accessToken");
  await SecureStore.deleteItemAsync("refreshToken");
}
