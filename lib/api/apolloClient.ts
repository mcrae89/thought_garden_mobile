import { ApolloClient, InMemoryCache } from "@apollo/client";
import Constants from "expo-constants";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

export const client = new ApolloClient({
  uri: apiUrl, // replace with LAN IP of your backend
  cache: new InMemoryCache(),
});
