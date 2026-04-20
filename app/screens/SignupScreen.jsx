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

export default function SignupScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [nidFile, setNidFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      Alert.alert("Validation Error", "Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Validation Error", "Passwords do not match");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Validation Error", "Password must be at least 8 characters");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Validation Error", "Please enter a valid email address");
      return;
    }

    const phoneRegex = /^01[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert(
        "Validation Error",
        "Please enter a valid Bangladesh phone number",
      );
      return;
    }

    if (!agreed) {
      Alert.alert(
        "Validation Error",
        "Please agree to the Terms and Conditions",
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          password,
          confirmPassword,
          agreed,
          nidFile: nidFile || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Signup Failed", data.message || "Signup failed. Please try again.");
        return;
      }

      router.replace("/login");
    } catch (error) {
      Alert.alert("Error", error.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleNIDUpload = () => {
    Alert.alert("Upload NID", "File picker implementation coming soon");
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
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Create Account
          </Text>
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
              name="account-plus"
              size={40}
              color={colors.tint}
            />
          </View>
          <Text style={[styles.welcomeTitle, { color: colors.text }]}>Join Us Today</Text>
          <Text style={[styles.welcomeSubtitle, { color: colors.text }]}>
            Create your account to access premium property rental services in
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
            <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
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
                name="account"
                size={20}
                color={colors.tint}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="John Doe"
                placeholderTextColor="#999"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
          </View>

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
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Phone Number</Text>
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
                name="phone"
                size={20}
                color={colors.tint}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="01XXXXXXXXX"
                placeholderTextColor="#999"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Password</Text>
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
                placeholderTextColor="#999"
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

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Confirm Password</Text>
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
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <MaterialCommunityIcons
                  name={showConfirmPassword ? "eye" : "eye-off"}
                  size={20}
                  color={colors.tint}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              National ID (NID) Verification Optional
            </Text>
            <TouchableOpacity
              style={[
                styles.nidUploadBox,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
              onPress={handleNIDUpload}
            >
              <MaterialCommunityIcons
                name="id-card"
                size={40}
                color={colors.tint}
              />
              <Text style={[styles.nidUploadTitle, { color: colors.text }]}>
                {nidFile
                  ? nidFile.name || String(nidFile)
                  : "Upload NID for Verification (Optional)"}
              </Text>
              <Text
                style={[
                  styles.nidUploadSubtext,
                  { color: colors.text, opacity: 0.6 },
                ]}
              >
                JPEG, PNG or PDF (Optional)
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.termsContainer}>
            <TouchableOpacity
              style={[
                styles.checkbox,
                {
                  backgroundColor: agreed ? colors.tint : colors.background,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setAgreed(!agreed)}
            >
              {agreed && (
                <MaterialCommunityIcons
                  name="check"
                  size={16}
                  color="#FFFFFF"
                />
              )}
            </TouchableOpacity>
            <Text style={[styles.termsText, { color: colors.text }]}>
              I agree to the{" "}
              <Text style={[styles.termsLink, { color: colors.tint }]}>
                Terms and Conditions
              </Text>
            </Text>
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
            style={[styles.signUpButton, { backgroundColor: colors.tint }]}
            onPress={handleSignUp}
            disabled={isLoading}
          >
            <Text style={styles.signUpButtonText}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Text>
          </TouchableOpacity>

          <Text style={[styles.orText, { color: colors.text, opacity: 0.5 }]}> 
            OR LOGIN INSTEAD
          </Text>

          <TouchableOpacity
            style={[
              styles.loginButton,
              {
                backgroundColor: "transparent",
                borderColor: colors.tint,
                borderWidth: 2,
              },
            ]}
            onPress={handleLogin}
          >
            <Text style={[styles.loginButtonText, { color: colors.tint }]}>Login</Text>
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
    marginBottom: 16,
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
  nidUploadBox: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 8,
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  nidUploadTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    textAlign: "center",
  },
  nidUploadSubtext: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  termsText: {
    fontSize: 13,
    flex: 1,
  },
  termsLink: {
    fontWeight: "600",
    textDecorationLine: "underline",
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
  signUpButton: {
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  signUpButtonText: {
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
  loginButton: {
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
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
