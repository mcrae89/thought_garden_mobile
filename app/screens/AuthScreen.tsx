import React, { useMemo, useState } from "react";
import {
  View, Text, TextInput, Button, TouchableOpacity, KeyboardAvoidingView,
  Platform, TouchableWithoutFeedback, Keyboard, Alert
} from "react-native";
import { useAuth } from "../../lib/hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";

type Mode = "login" | "register";

export default function AuthScreen({ onAuthed }: { onAuthed: () => void }) {
  const [mode, setMode] = useState<Mode>("login");
  const { login, register, state } = useAuth();

  // form fields
  const [username, setUsername] = useState("admin"); // only used in register mode
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loading = state.login.loading || state.register.loading;

  const canSubmit = useMemo(() => {
    const emailOk = /\S+@\S+\.\S+/.test(email);
    const passOk = password.length >= 8;
    const userOk = mode === "login" ? true : username.trim().length >= 3;
    return emailOk && passOk && userOk && !loading;
  }, [email, password, username, mode, loading]);

  const handleSubmit = async () => {
    try {
      if (mode === "login") {
        await login(email.trim(), password);
      } else {
        await register(username.trim(), email.trim(), password);
      }
      onAuthed();
    } catch (e: any) {
      const msg = e?.message || "Something went wrong";
      Alert.alert("Error", msg);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
            {/* Mode switch */}
            <View style={{ flexDirection: "row", gap: 12, marginBottom: 16, alignSelf: "center" }}>
              <TabButton label="Log in" active={mode === "login"} onPress={() => setMode("login")} />
              <TabButton label="Create account" active={mode === "register"} onPress={() => setMode("register")} />
            </View>

            {/* Inputs */}
            <View style={{ gap: 12 }}>
              {mode === "register" && (
                <LabeledInput
                  label="Username"
                  value={username}
                  onChangeText={setUsername}
                  placeholder="yourname"
                  autoCapitalize="none"
                  autoCorrect={false}
                  importantForAutofill="yes"
                  autoComplete="username"
                />
              )}
              <LabeledInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                importantForAutofill="yes"
                autoComplete="email"
              />
              <LabeledInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                autoComplete="password"
                rightAction={
                  <TouchableOpacity onPress={() => setShowPassword(s => !s)}>
                    <Text style={{ paddingHorizontal: 8 }}>{showPassword ? "Hide" : "Show"}</Text>
                  </TouchableOpacity>
                }
              />
              <Button
                title={loading ? (mode === "login" ? "Signing in…" : "Creating…") : (mode === "login" ? "Sign in" : "Create account")}
                onPress={handleSubmit}
                disabled={!canSubmit}
              />
            </View>

            {/* Helper */}
            <Text style={{ marginTop: 12, fontSize: 12, color: "#666" }}>
              Password must be at least 8 characters.
            </Text>
            {(state.login.error || state.register.error) && (
              <Text style={{ marginTop: 8, color: "crimson" }}>
                {String(state.login.error?.message || state.register.error?.message)}
              </Text>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function TabButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: active }}>
      <Text style={{
        paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8,
        backgroundColor: active ? "#222" : "#eee", color: active ? "#fff" : "#222"
      }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function LabeledInput(props: any) {
  const { label, rightAction, style, ...rest } = props;
  return (
    <View>
      <Text style={{ marginBottom: 6, color: "#444" }}>{label}</Text>
      <View style={{
        flexDirection: "row", alignItems: "center",
        borderWidth: 1, borderColor: "#ccc", borderRadius: 10, paddingHorizontal: 10
      }}>
        <TextInput style={{ flex: 1, paddingVertical: 10 }} {...rest} />
        {rightAction}
      </View>
    </View>
  );
}
