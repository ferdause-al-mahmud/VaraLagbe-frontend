import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
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
import {
  clearAuthSession,
  getAuthSession,
  setAuthSession,
} from "../utils/authSession";

const API_BASE_URL = "http://localhost:5000";

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [favoritesInput, setFavoritesInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const applyProfile = useCallback((user) => {
    setProfile(user);
    setFullName(user?.fullName ?? "");
    setEmail(user?.email ?? "");
    setPhone(user?.phone ?? "");
    setAddress(user?.address ?? "");
    setFavoritesInput(Array.isArray(user?.favorites) ? user.favorites.join(", ") : "");
  }, []);

  const loadProfile = useCallback(async () => {
    const session = getAuthSession();

    if (!session.token) {
      setIsLoading(false);
      Alert.alert("Login Required", "Please log in to view your profile.", [
        {
          text: "OK",
          onPress: () => router.replace("/login"),
        },
      ]);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load profile");
      }

      const user = data.data;
      applyProfile(user);
      setAuthSession({ token: session.token, user });
    } catch (error) {
      Alert.alert("Profile Error", error.message || "Could not load your profile.");
    } finally {
      setIsLoading(false);
    }
  }, [applyProfile, router]);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile]),
  );

  const handleSave = async () => {
    const session = getAuthSession();

    if (!session.token) {
      Alert.alert("Login Required", "Please log in again.");
      router.replace("/login");
      return;
    }

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPhone) {
      Alert.alert("Validation Error", "Name, email, and phone are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      Alert.alert("Validation Error", "Please enter a valid email address.");
      return;
    }

    const phoneRegex = /^01[0-9]{9}$/;
    if (!phoneRegex.test(trimmedPhone)) {
      Alert.alert("Validation Error", "Please enter a valid Bangladesh phone number.");
      return;
    }

    const favorites = favoritesInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    setIsSaving(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({
          fullName: trimmedName,
          email: trimmedEmail,
          phone: trimmedPhone,
          address: address.trim(),
          favorites,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      const user = data.data;
      applyProfile(user);
      setAuthSession({ token: session.token, user });
      Alert.alert("Success", "Profile updated successfully.");
    } catch (error) {
      Alert.alert("Update Failed", error.message || "Could not save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    router.replace("/login");
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={[styles.avatar, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <MaterialCommunityIcons name="account" size={48} color={colors.tint} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>
            {profile?.fullName || "Your Profile"}
          </Text>
          <Text style={[styles.subtitle, { color: colors.text }]}>
            Manage your personal details, address, and saved favorites.
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Account Details</Text>
            {isLoading ? (
              <Text style={[styles.statusText, { color: colors.tint }]}>Loading...</Text>
            ) : null}
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
            <TextInput
              style={[
                styles.input,
                { color: colors.text, backgroundColor: colors.background, borderColor: colors.border },
              ]}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Your full name"
              placeholderTextColor="#999"
              editable={!isLoading && !isSaving}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Email</Text>
            <TextInput
              style={[
                styles.input,
                { color: colors.text, backgroundColor: colors.background, borderColor: colors.border },
              ]}
              value={email}
              onChangeText={setEmail}
              placeholder="name@example.com"
              placeholderTextColor="#999"
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!isLoading && !isSaving}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Phone</Text>
            <TextInput
              style={[
                styles.input,
                { color: colors.text, backgroundColor: colors.background, borderColor: colors.border },
              ]}
              value={phone}
              onChangeText={setPhone}
              placeholder="01XXXXXXXXX"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              editable={!isLoading && !isSaving}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Address</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                { color: colors.text, backgroundColor: colors.background, borderColor: colors.border },
              ]}
              value={address}
              onChangeText={setAddress}
              placeholder="Add your address"
              placeholderTextColor="#999"
              multiline
              textAlignVertical="top"
              editable={!isLoading && !isSaving}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Favorites</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                { color: colors.text, backgroundColor: colors.background, borderColor: colors.border },
              ]}
              value={favoritesInput}
              onChangeText={setFavoritesInput}
              placeholder="Comma-separated property IDs"
              placeholderTextColor="#999"
              multiline
              textAlignVertical="top"
              editable={!isLoading && !isSaving}
            />
            <Text style={[styles.helperText, { color: colors.text }]}>
              Separate multiple favorites with commas.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.tint, opacity: isLoading ? 0.6 : 1 }]}
            onPress={handleSave}
            disabled={isLoading || isSaving}
          >
            <Text style={styles.primaryButtonText}>
              {isSaving ? "Saving..." : "Save Profile"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.infoRow, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <MaterialCommunityIcons name="heart-outline" size={22} color={colors.tint} />
          <View style={styles.infoCopy}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>Saved Favorites</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {Array.isArray(profile?.favorites) ? profile.favorites.length : 0} properties
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: colors.error }]}
          onPress={handleLogout}
        >
          <MaterialCommunityIcons name="logout" size={18} color={colors.error} />
          <Text style={[styles.secondaryButtonText, { color: colors.error }]}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
  },
  hero: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
    textAlign: "center",
    maxWidth: 280,
  },
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
  },
  formGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  textArea: {
    minHeight: 96,
  },
  helperText: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 6,
  },
  primaryButton: {
    height: 50,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  infoCopy: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 13,
    opacity: 0.7,
  },
  secondaryButton: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
});
