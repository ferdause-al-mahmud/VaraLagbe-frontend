import { Stack } from "expo-router";
// Safely stringify console outputs to avoid LogBox render crashes
if (typeof global !== "undefined" && typeof console !== "undefined") {
  const levels = ["log", "info", "warn", "error", "debug"];
  levels.forEach((lvl) => {
    const original = console[lvl] && console[lvl].bind(console);
    if (!original) return;
    console[lvl] = (...args) => {
      try {
        const safe = args.map((a) => {
          if (typeof a === "string") return a;
          if (a && a.$$typeof) return "[React Element]";
          try {
            return typeof a === "object" ? JSON.stringify(a) : String(a);
          } catch (_e) {
            return String(a);
          }
        });
        original(...safe);
      } catch (e) {
        original("[console wrapper error]", String(e));
      }
    };
  });
}
import Toast from "react-native-toast-message";
import { Colors } from "./constants/colors";
import { useColorScheme } from "./hooks/useColorScheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen
          name="splash"
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
            animationEnabled: true,
          }}
        />
        <Stack.Screen
          name="signup"
          options={{
            headerShown: false,
            animationEnabled: true,
          }}
        />
        <Stack.Screen
          name="tabs"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="property-details"
          options={{
            headerShown: false,
            animationEnabled: true,
          }}
        />
        <Stack.Screen
          name="dashboard"
          options={{
            headerShown: false,
            animationEnabled: true,
          }}
        />
        <Stack.Screen
          name="user-dashboard"
          options={{
            headerShown: false,
            animationEnabled: true,
          }}
        />
        <Stack.Screen
          name="owner-profile"
          options={{
            headerShown: false,
            animationEnabled: true,
          }}
        />
        <Stack.Screen
          name="add-property"
          options={{
            headerShown: false,
            animationEnabled: true,
          }}
        />
        <Stack.Screen
          name="update-property"
          options={{
            headerShown: false,
            animationEnabled: true,
          }}
        />
        <Stack.Screen
          name="admin-profile"
          options={{
            headerShown: false,
            animationEnabled: true,
          }}
        />

        <Stack.Screen
          name="admin-dashboard"
          options={{
            headerShown: false,
            animationEnabled: true,
          }}
        />
        <Stack.Screen
          name="inbox"
          options={{
            headerShown: false,
            animationEnabled: true,
          }}
        />
      </Stack>
      <Toast />
    </>
  );
}
