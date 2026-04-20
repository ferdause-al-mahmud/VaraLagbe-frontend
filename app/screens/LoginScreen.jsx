import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedView } from "../components/ThemedView";
import { Colors } from "../constants/colors";
import { useColorScheme } from "../hooks/useColorScheme";

const API_BASE_URL = "http://localhost:5000";

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Validation Error", "Please fill in all required fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Validation Error", "Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Login Failed", data.message || "Login failed. Please try again.");
        return;
      }

      router.replace("/tabs");
    } catch (error) {
      Alert.alert("Error", error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    router.push("/signup");
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Login / Sign Up</Text>
          <Text style={[styles.brandTitle, { color: colors.tint }]}>VaraLagbe</Text>
        </View>

        <View style={styles.welcomeSection}>
          <View
            style={[
              styles.securityBadge,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <MaterialCommunityIcons
              name="shield-check"
              size={40}
              color={colors.tint}
            />
          </View>
          <Text style={[styles.welcomeTitle, { color: colors.text }]}>Welcome Back</Text>
          <Text style={[styles.welcomeSubtitle, { color: colors.text }]}> 
            Securely access the most trusted property rental platform in
            Bangladesh.
          </Text>
        </View>

        <View
          style={[
            styles.formContainer,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Email Address</Text>
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="email"
                size={20}
                color={colors.tint}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="name@example.com"
                placeholderTextColor={colorScheme === "dark" ? "#999" : "#999"}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <View style={styles.passwordHeader}>
              <Text style={[styles.label, { color: colors.text }]}>Password</Text>
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={[styles.forgotLink, { color: colors.tint }]}>Forgot?</Text>
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="lock"
                size={20}
                color={colors.tint}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="********"
                placeholderTextColor={colorScheme === "dark" ? "#999" : "#999"}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <MaterialCommunityIcons
                  name={showPassword ? "eye" : "eye-off"}
                  size={20}
                  color={colors.tint}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={[
              styles.securityNotice,
              { backgroundColor: colors.background },
            ]}
          >
            <MaterialCommunityIcons
              name="shield-check"
              size={20}
              color={colors.tint}
            />
            <Text style={[styles.securityText, { color: colors.text }]}> 
              YOUR DATA IS ENCRYPTED AND HANDLED SECURELY
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: colors.tint }]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>

          <Text style={[styles.orText, { color: colors.text, opacity: 0.5 }]}>OR JOIN US</Text>

          <TouchableOpacity
            style={[
              styles.signUpButton,
              {
                backgroundColor: "transparent",
                borderColor: colors.tint,
                borderWidth: 2,
              },
            ]}
            onPress={handleSignUp}
          >
            <Text style={[styles.signUpButtonText, { color: colors.tint }]}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerBadges}>
          <View style={styles.badge}>
            <MaterialCommunityIcons
              name="shield-check"
              size={24}
              color={colors.tint}
            />
            <Text style={[styles.badgeText, { color: colors.text }]}>VERIFIED</Text>
          </View>
          <View style={styles.badge}>
            <MaterialCommunityIcons name="lock" size={24} color={colors.tint} />
            <Text style={[styles.badgeText, { color: colors.text }]}>SECURE</Text>
          </View>
          <View style={styles.badge}>
            <MaterialCommunityIcons
              name="headset"
              size={24}
              color={colors.tint}
            />
            <Text style={[styles.badgeText, { color: colors.text }]}>24/7 CARE</Text>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  welcomeSection: {
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  securityBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.7,
    lineHeight: 20,
  },
  formContainer: {
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  eyeIcon: {
    padding: 8,
    marginLeft: 8,
  },
  passwordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  forgotLink: {
    fontSize: 12,
    fontWeight: "500",
  },
  securityNotice: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  securityText: {
    fontSize: 11,
    fontWeight: "500",
    marginLeft: 8,
    flex: 1,
  },
  loginButton: {
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  orText: {
    textAlign: "center",
    fontSize: 12,
    marginBottom: 12,
    fontWeight: "500",
  },
  signUpButton: {
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  footerBadges: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  badge: {
    alignItems: "center",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "500",
    marginTop: 4,
    textAlign: "center",
  },
});
