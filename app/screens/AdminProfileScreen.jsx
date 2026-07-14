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
import {
  clearAuthSession,
  getAuthSession,
  setAuthSession,
} from "../utils/authSession";
import { API_BASE_URL } from "../config/api";

function showMessage(title, message) {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    window.alert(`${title}\n\n${message}`);
    return;
  }

  Alert.alert(title, message);
}

function getInitials(name) {
  if (!name) return "AD";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function getJoinedText(user) {
  const date = new Date(user?.createdAt || Date.now());
  if (Number.isNaN(date.getTime())) return "Admin account";

  return `Admin since ${date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })}`;
}

export default function AdminProfileScreen() {
  const router = useRouter();
  const [admin, setAdmin] = useState(() => getAuthSession().user);
  const [fullName, setFullName] = useState(admin?.fullName || "");
  const [email, setEmail] = useState(admin?.email || "");
  const [phone, setPhone] = useState(admin?.phone || "");
  const [cityDistrict, setCityDistrict] = useState(
    admin?.address?.cityDistrict || "",
  );
  const [isSaving, setIsSaving] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const initials = useMemo(
    () => getInitials(admin?.fullName),
    [admin?.fullName],
  );

  const applyAdmin = useCallback((user) => {
    setAdmin(user);
    setFullName(user?.fullName || "");
    setEmail(user?.email || "");
    setPhone(user?.phone || "");
    setCityDistrict(user?.address?.cityDistrict || "");
  }, []);

  const loadAdminProfile = useCallback(async () => {
    const session = getAuthSession();

    if (!session?.token) {
      router.replace("/login");
      return;
    }

    if (session.user?.role && session.user.role !== "admin") {
      router.replace(
        session.user.role === "owner" ? "/owner-profile" : "/tabs/profile",
      );
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load admin profile.");
      }

      const user = data.data;
      if (user?.role !== "admin") {
        setAuthSession({ token: session.token, user });
        router.replace(
          user?.role === "owner" ? "/owner-profile" : "/tabs/profile",
        );
        return;
      }

      applyAdmin(user);
      setAuthSession({ token: session.token, user });
    } catch (error) {
      showMessage(
        "Profile Error",
        error.message || "Could not load admin profile.",
      );
    }
  }, [applyAdmin, router]);

  useFocusEffect(
    useCallback(() => {
      loadAdminProfile();
    }, [loadAdminProfile]),
  );

  const handleSave = async () => {
    const session = getAuthSession();
    if (!session?.token) {
      router.replace("/login");
      return;
    }

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      showMessage("Validation Error", "Name, email, and phone are required.");
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
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          address: {
            ...(admin?.address || {}),
            cityDistrict: cityDistrict.trim(),
          },
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update admin profile.");
      }

      applyAdmin(data.data);
      setAuthSession({ token: session.token, user: data.data });
      setShowEditor(false);
      showMessage("Success", "Admin profile updated successfully.");
    } catch (error) {
      showMessage(
        "Update Failed",
        error.message || "Could not save admin profile.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    router.replace("/login");
  };

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.replace("/admin-dashboard")}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color="#005A67"
            />
          </TouchableOpacity>
          <Text style={styles.brand}>Admin Profile</Text>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setShowEditor((value) => !value)}
          >
            <MaterialCommunityIcons
              name="account-edit"
              size={23}
              color="#005A67"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.rolePill}>
            <MaterialCommunityIcons
              name="shield-crown"
              size={15}
              color="#FFFFFF"
            />
            <Text style={styles.rolePillText}>ADMIN ACCESS</Text>
          </View>

          <View style={styles.avatarRing}>
            <View style={styles.avatarInner}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          </View>

          <Text style={styles.name}>{admin?.fullName || "Admin"}</Text>
          <Text style={styles.meta}>{admin?.email || "admin account"}</Text>
          <Text style={styles.joined}>{getJoinedText(admin)}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons
              name="account-group"
              size={26}
              color="#005A67"
            />
            <Text style={styles.statValue}>Users</Text>
            <Text style={styles.statLabel}>Manage accounts</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons
              name="file-check"
              size={26}
              color="#007A45"
            />
            <Text style={styles.statValue}>Content</Text>
            <Text style={styles.statLabel}>Moderate listings</Text>
          </View>
        </View>

        {showEditor ? (
          <View style={styles.editorCard}>
            <Text style={styles.sectionTitle}>Admin Details</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Full name"
              placeholderTextColor="#8B989C"
              editable={!isSaving}
            />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email address"
              placeholderTextColor="#8B989C"
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!isSaving}
            />
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone number"
              placeholderTextColor="#8B989C"
              keyboardType="phone-pad"
              editable={!isSaving}
            />
            <TextInput
              style={styles.input}
              value={cityDistrict}
              onChangeText={setCityDistrict}
              placeholder="City / District"
              placeholderTextColor="#8B989C"
              editable={!isSaving}
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={isSaving}
            >
              <Text style={styles.saveButtonText}>
                {isSaving ? "Saving..." : "Save Admin Profile"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <Text style={styles.sectionTitle}>Admin Controls</Text>
        <View style={styles.menuCard}>
          <AdminRow
            icon="view-dashboard"
            title="Admin Dashboard"
            detail="Analytics, users, content, and inbox"
            onPress={() => router.replace("/admin-dashboard")}
          />
          <AdminRow
            icon="account-multiple-check"
            title="User Management"
            detail="Open dashboard user tab"
            onPress={() =>
              router.replace({
                pathname: "/admin-dashboard",
                params: { tab: "users" },
              })
            }
          />
          <AdminRow
            icon="file-document-edit"
            title="Content Moderation"
            detail="Open dashboard content tab"
            onPress={() =>
              router.replace({
                pathname: "/admin-dashboard",
                params: { tab: "content" },
              })
            }
          />
          <AdminRow
            icon="logout"
            title="Sign Out"
            detail="End this admin session"
            danger
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

function AdminRow({ icon, title, detail, danger, onPress }) {
  return (
    <TouchableOpacity
      style={styles.menuRow}
      activeOpacity={0.82}
      onPress={onPress}
    >
      <View style={[styles.menuIcon, danger && styles.menuIconDanger]}>
        <MaterialCommunityIcons
          name={icon}
          size={22}
          color={danger ? "#B82025" : "#005A67"}
        />
      </View>
      <View style={styles.menuCopy}>
        <Text style={[styles.menuTitle, danger && styles.dangerText]}>
          {title}
        </Text>
        <Text style={styles.menuDetail}>{detail}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={25} color="#7D878F" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F8F8",
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 42,
  },
  topBar: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E7EEF0",
  },
  brand: {
    flex: 1,
    textAlign: "center",
    color: "#063F52",
    fontSize: 20,
    fontWeight: "900",
  },
  profileCard: {
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingVertical: 26,
    alignItems: "center",
    marginBottom: 18,
    shadowColor: "#0B3440",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  rolePill: {
    alignSelf: "flex-end",
    height: 28,
    borderRadius: 14,
    paddingHorizontal: 12,
    backgroundColor: "#005A67",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 16,
  },
  rolePillText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
  },
  avatarRing: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 4,
    borderColor: "#8EF2A8",
    padding: 5,
    marginBottom: 18,
  },
  avatarInner: {
    flex: 1,
    borderRadius: 50,
    backgroundColor: "#172125",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
  },
  name: {
    fontSize: 28,
    fontWeight: "900",
    color: "#070B0F",
    textAlign: "center",
  },
  meta: {
    marginTop: 5,
    fontSize: 14,
    color: "#536367",
  },
  joined: {
    marginTop: 8,
    fontSize: 13,
    color: "#007A45",
    fontWeight: "800",
  },
  statsRow: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 22,
  },
  statCard: {
    flex: 1,
    minHeight: 112,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    padding: 16,
    justifyContent: "center",
  },
  statValue: {
    marginTop: 12,
    fontSize: 19,
    color: "#172125",
    fontWeight: "900",
  },
  statLabel: {
    marginTop: 4,
    fontSize: 12,
    color: "#6F7F84",
  },
  sectionTitle: {
    color: "#172125",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 12,
  },
  editorCard: {
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    padding: 18,
    marginBottom: 22,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DCE3E8",
    paddingHorizontal: 13,
    marginBottom: 11,
    color: "#172125",
    backgroundColor: "#FAFBFB",
  },
  saveButton: {
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#005A67",
    marginTop: 4,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
  menuCard: {
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  menuRow: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF1F2",
  },
  menuIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#DFF5F2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },
  menuIconDanger: {
    backgroundColor: "#FFD8D8",
  },
  menuCopy: {
    flex: 1,
  },
  menuTitle: {
    color: "#172125",
    fontSize: 15,
    fontWeight: "900",
  },
  dangerText: {
    color: "#B82025",
  },
  menuDetail: {
    marginTop: 3,
    color: "#6F7F84",
    fontSize: 12,
  },
});
