// App.tsx
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { ApolloProvider } from "@apollo/client";
import { SafeAreaProvider } from "react-native-safe-area-context"; // + add
import { client } from "./lib/api/apolloClient";
import { getAccessToken } from "./lib/auth/tokens";
import AuthScreen from "./app/screens/AuthScreen";
import ProfileScreen from "./app/screens/ProfileScreen";

export default function App() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => setAuthed(!!(await getAccessToken())))();
  }, []);

  return (
    <ApolloProvider client={client}>
      <SafeAreaProvider> {/* + wrap */}
        {authed === null ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator />
          </View>
        ) : authed ? (
          <ProfileScreen onLogout={() => setAuthed(false)} />
        ) : (
          <AuthScreen onAuthed={() => setAuthed(true)} />
        )}
      </SafeAreaProvider> {/* + wrap */}
    </ApolloProvider>
  );
}
