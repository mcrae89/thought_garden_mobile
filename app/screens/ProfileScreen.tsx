import React from "react";
import { View, Text, Button, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@apollo/client";
import { GET_PROFILE } from "../../lib/api/operations";
import { useAuth } from "../../lib/hooks/useAuth";

function Center({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 16 }}>
        {children}
      </View>
    </SafeAreaView>
  );
}

export default function ProfileScreen({ onLogout }: { onLogout: () => void }) {
  const { data, loading, error } = useQuery(GET_PROFILE);
  const { logout } = useAuth();

  if (loading) return <Center><ActivityIndicator /></Center>;

  if (error) {
    return <Center><Text>Error: {String(error.message)}</Text></Center>;
  }

  const u =
  data?.profile?.[0]     // when the field is a list (IQueryable<User>)
  ?? data?.getProfile    // if your schema exposes a single object
  ?? null;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 16, gap: 8 }}>
        <Text style={{ fontSize: 20, fontWeight: "600" }}>Welcome</Text>
        <Text>Account #: {u?.id}</Text>
        <Text>UserName: {u?.userName}</Text>
        <Text>Email: {u?.email}</Text>
        <Text>Role: {u?.role}</Text>
        <Button title="Log out" onPress={async () => { await logout(); onLogout(); }} />
      </View>
    </SafeAreaView>
  );
}
