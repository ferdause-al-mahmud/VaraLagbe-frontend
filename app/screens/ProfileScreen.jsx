import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Platform,
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

function showMessage(title, message) {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    window.alert(`${title}\n\n${message}`);
    return;
  }

  Alert.alert(title, message);
}

function getInitials(name) {
  if (!name) return "VL";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [thanaUpazila, setThanaUpazila] = useState("");
  const [cityDistrict, setCityDistrict] = useState("");
  const [addressOptional, setAddressOptional] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);

  const applyProfile = useCallback((user) => {
    setProfile(user);
    setFullName(user?.fullName ?? "");
    setEmail(user?.email ?? "");
    setPhone(user?.phone ?? "");
    setStreetAddress(user?.address?.streetAddress ?? "");
    setThanaUpazila(user?.address?.thanaUpazila ?? "");
    setCityDistrict(user?.address?.cityDistrict ?? "");
    setAddressOptional(user?.address?.optional ?? "");
  }, []);

  const loadProfile = useCallback(async () => {
    const session = getAuthSession();

    if (!session.token) {
      setIsLoading(false);
      showMessage("Login Required", "Please log in to view your profile.");
      router.replace("/login");
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
        throw new Error(data.message || "Failed to load profile.");
      }

      const user = data.data;
      applyProfile(user);
      setAuthSession({ token: session.token, user });
    } catch (error) {
      showMessage("Profile Error", error.message || "Could not load your profile.");
    } finally {
      setIsLoading(false);
    }
  }, [applyProfile, router]);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile]),
  );

  const favoritesCount = Array.isArray(profile?.favorites)
    ? profile.favorites.length
    : 0;
  const bookingsCount = 0;
  const savedSearchesCount = 0;
  const locationText =
    profile?.address?.cityDistrict?.trim() ||
    profile?.address?.thanaUpazila?.trim() ||
    "Add your address";
  const initials = useMemo(() => getInitials(profile?.fullName), [profile?.fullName]);

  const handleSave = async () => {
    const session = getAuthSession();

    if (!session.token) {
      showMessage("Login Required", "Please log in again.");
      router.replace("/login");
      return;
    }

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPhone) {
      showMessage("Validation Error", "Name, email, and phone are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      showMessage("Validation Error", "Please enter a valid email address.");
      return;
    }

    const phoneRegex = /^01[0-9]{9}$/;
    if (!phoneRegex.test(trimmedPhone)) {
      showMessage(
        "Validation Error",
        "Please enter a valid Bangladesh phone number.",
      );
      return;
    }

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
          address: {
            streetAddress: streetAddress.trim(),
            thanaUpazila: thanaUpazila.trim(),
            cityDistrict: cityDistrict.trim(),
            optional: addressOptional.trim(),
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile.");
      }

      const user = data.data;
      applyProfile(user);
      setAuthSession({ token: session.token, user });
      setShowPersonalInfo(false);
      showMessage("Success", "Profile updated successfully.");
    } catch (error) {
      showMessage("Update Failed", error.message || "Could not save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePlaceholderPress = (label) => {
    showMessage(label, "This section will be connected next.");
  };

  const handleLogout = () => {
    clearAuthSession();
    router.replace("/login");
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: "#F4F7F8" }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <MaterialCommunityIcons name="arrow-left" size={28} color="#0C4A60" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity
            onPress={() => setShowPersonalInfo((current) => !current)}
            style={styles.iconButton}
          >
            <MaterialCommunityIcons name="cog" size={28} color="#0C4A60" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileTop}>
          <View style={styles.avatarShell}>
            <View style={styles.avatarRing}>
              <View style={styles.avatarInner}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
            </View>
            <View style={styles.verifiedBadge}>
              <MaterialCommunityIcons name="check-decagram" size={20} color="#FFFFFF" />
            </View>
          </View>

          <Text style={styles.nameText}>
            {profile?.fullName || (isLoading ? "Loading..." : "Your Name")}
          </Text>

          <View style={styles.locationRow}>
            <MaterialCommunityIcons name="map-marker" size={20} color="#46525C" />
            <Text style={styles.locationText}>{locationText}</Text>
          </View>
        </View>

        <View style={styles.trustCard}>
          <View style={styles.trustIconWrap}>
            <MaterialCommunityIcons name="shield-account" size={28} color="#0A7A39" />
          </View>
          <View style={styles.trustCopy}>
            <Text style={styles.trustTitle}>Trust Status: Verified</Text>
            <Text style={styles.trustText}>
              {profile?.phone
                ? "Your identity and mobile number have been verified for secure transactions."
                : "Complete your profile details to strengthen trust and secure transactions."}
            </Text>
          </View>
          <MaterialCommunityIcons name="check-circle" size={28} color="#0A7A39" />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="calendar-month" size={28} color="#0C4A60" />
            <Text style={styles.statNumber}>{String(bookingsCount).padStart(2, "0")}</Text>
            <Text style={styles.statLabel}>My Bookings</Text>
          </View>

          <View style={styles.statCard}>
            <MaterialCommunityIcons name="heart" size={28} color="#C61D1D" />
            <Text style={styles.statNumber}>{String(favoritesCount).padStart(2, "0")}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
        </View>

        <View style={styles.favoritesEmptyCard}>
          <Text style={styles.favoritesEmptyTitle}>Favorites</Text>
          <Text style={styles.favoritesEmptyText}>
            {favoritesCount > 0
              ? `${favoritesCount} favorites are available from the backend and will be shown here as cards soon.`
              : "There are no favorites yet."}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.savedSearchCard}
          onPress={() => handlePlaceholderPress("Saved Searches")}
          activeOpacity={0.9}
        >
          <View style={styles.savedSearchIcon}>
            <MaterialCommunityIcons name="magnify" size={28} color="#0C4A60" />
          </View>
          <View style={styles.savedSearchCopy}>
            <Text style={styles.savedSearchTitle}>Saved Searches</Text>
            <Text style={styles.savedSearchText}>
              {savedSearchesCount} active search alerts
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={30} color="#7D878F" />
        </TouchableOpacity>

        <Text style={styles.sectionHeading}>Account Settings</Text>

        <View style={styles.settingsCard}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setShowPersonalInfo((current) => !current)}
          >
            <View style={styles.settingLeft}>
              <MaterialCommunityIcons name="account" size={24} color="#46525C" />
              <Text style={styles.settingText}>Personal Information</Text>
            </View>
            <MaterialCommunityIcons
              name={showPersonalInfo ? "chevron-up" : "chevron-right"}
              size={28}
              color="#7D878F"
            />
          </TouchableOpacity>

          {showPersonalInfo ? (
            <View style={styles.editorWrap}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Your full name"
                  placeholderTextColor="#9AA3AA"
                  editable={!isLoading && !isSaving}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="name@example.com"
                  placeholderTextColor="#9AA3AA"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!isLoading && !isSaving}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Phone</Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="01XXXXXXXXX"
                  placeholderTextColor="#9AA3AA"
                  keyboardType="phone-pad"
                  editable={!isLoading && !isSaving}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Street Address</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={streetAddress}
                  onChangeText={setStreetAddress}
                  placeholder="House, road, area"
                  placeholderTextColor="#9AA3AA"
                  multiline
                  textAlignVertical="top"
                  editable={!isLoading && !isSaving}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Thana / Upazila</Text>
                <TextInput
                  style={styles.input}
                  value={thanaUpazila}
                  onChangeText={setThanaUpazila}
                  placeholder="Thana or Upazila"
                  placeholderTextColor="#9AA3AA"
                  editable={!isLoading && !isSaving}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>City / District</Text>
                <TextInput
                  style={styles.input}
                  value={cityDistrict}
                  onChangeText={setCityDistrict}
                  placeholder="City or District"
                  placeholderTextColor="#9AA3AA"
                  editable={!isLoading && !isSaving}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Optional</Text>
                <TextInput
                  style={styles.input}
                  value={addressOptional}
                  onChangeText={setAddressOptional}
                  placeholder="Landmark, apartment, note"
                  placeholderTextColor="#9AA3AA"
                  editable={!isLoading && !isSaving}
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  { opacity: isLoading || isSaving ? 0.7 : 1 },
                ]}
                onPress={handleSave}
                disabled={isLoading || isSaving}
              >
                <Text style={styles.saveButtonText}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => handlePlaceholderPress("Payment Methods")}
          >
            <View style={styles.settingLeft}>
              <MaterialCommunityIcons name="cash-multiple" size={24} color="#46525C" />
              <Text style={styles.settingText}>Payment Methods</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={28} color="#7D878F" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => handlePlaceholderPress("Notification Settings")}
          >
            <View style={styles.settingLeft}>
              <MaterialCommunityIcons name="bell" size={24} color="#46525C" />
              <Text style={styles.settingText}>Notification Settings</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={28} color="#7D878F" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => handlePlaceholderPress("Help & Support")}
          >
            <View style={styles.settingLeft}>
              <MaterialCommunityIcons name="help-circle" size={24} color="#46525C" />
              <Text style={styles.settingText}>Help & Support</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={28} color="#7D878F" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutRow} onPress={handleLogout}>
            <View style={styles.settingLeft}>
              <MaterialCommunityIcons name="logout" size={24} color="#CF2E2E" />
              <Text style={styles.logoutText}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footerBrand}>
          <Text style={styles.footerBrandTitle}>VARALAGBE</Text>
          <Text style={styles.footerBrandText}>
            VERSION 2.4.0 | CURATED RENTAL EXPERIENCE
          </Text>
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
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 36,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    marginLeft: 10,
    fontSize: 22,
    fontWeight: "500",
    color: "#0C4A60",
  },
  profileTop: {
    alignItems: "center",
    marginBottom: 28,
  },
  avatarShell: {
    position: "relative",
    marginBottom: 18,
  },
  avatarRing: {
    width: 126,
    height: 126,
    borderRadius: 63,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0A1620",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  avatarInner: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: "#252632",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "700",
  },
  verifiedBadge: {
    position: "absolute",
    right: -2,
    bottom: 6,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#0A7A39",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  nameText: {
    fontSize: 26,
    fontWeight: "700",
    color: "#12181C",
    marginBottom: 8,
    textAlign: "center",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 15,
    color: "#46525C",
  },
  trustCard: {
    backgroundColor: "#D8F4DE",
    borderWidth: 1,
    borderColor: "#B9EAC4",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },
  trustIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#0A7A39",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  trustCopy: {
    flex: 1,
    marginRight: 10,
  },
  trustTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0A7A39",
    marginBottom: 6,
  },
  trustText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#294038",
  },
  statsRow: {
    flexDirection: "row",
    gap: 18,
    marginBottom: 18,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingHorizontal: 24,
    paddingVertical: 22,
    shadowColor: "#0A1620",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "700",
    color: "#101518",
    marginTop: 22,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 14,
    color: "#2A3136",
  },
  savedSearchCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 24,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    shadowColor: "#0A1620",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  savedSearchIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F0F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  savedSearchCopy: {
    flex: 1,
  },
  savedSearchTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#12181C",
    marginBottom: 4,
  },
  savedSearchText: {
    fontSize: 14,
    color: "#5B666E",
  },
  favoritesEmptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 22,
    marginBottom: 22,
    shadowColor: "#0A1620",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  favoritesEmptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#12181C",
    marginBottom: 6,
  },
  favoritesEmptyText: {
    fontSize: 14,
    color: "#5B666E",
    lineHeight: 20,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#12181C",
    marginBottom: 14,
    marginLeft: 4,
  },
  settingsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    overflow: "hidden",
    shadowColor: "#0A1620",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    paddingVertical: 22,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF1F3",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  settingText: {
    fontSize: 17,
    color: "#151B1E",
    fontWeight: "500",
  },
  editorWrap: {
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 22,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF1F3",
    backgroundColor: "#FAFBFB",
  },
  formGroup: {
    marginTop: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#384148",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCE3E8",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#13191C",
  },
  textArea: {
    minHeight: 92,
  },
  helperText: {
    marginTop: 6,
    fontSize: 12,
    color: "#6E7A83",
  },
  saveButton: {
    marginTop: 18,
    backgroundColor: "#0C4A60",
    height: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  logoutRow: {
    paddingHorizontal: 22,
    paddingVertical: 24,
  },
  logoutText: {
    fontSize: 17,
    color: "#CF2E2E",
    fontWeight: "500",
  },
  footerBrand: {
    alignItems: "center",
    paddingTop: 34,
    paddingBottom: 12,
  },
  footerBrandTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#C9DDE5",
    marginBottom: 8,
  },
  footerBrandText: {
    fontSize: 13,
    letterSpacing: 1,
    color: "#7E8E98",
    textAlign: "center",
  },
});
