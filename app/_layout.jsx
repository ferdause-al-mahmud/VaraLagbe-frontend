import { Stack } from "expo-router";
import { Colors } from "./constants/colors";
import { useColorScheme } from "./hooks/useColorScheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
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
        name="tabs"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
