import { Stack } from "expo-router";
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
      </Stack>
      <Toast />
    </>
  );
}
