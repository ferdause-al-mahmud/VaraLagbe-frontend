import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from "react-native";
import AdminBottomTabs from "../components/adminDashboard/AdminBottomTabs";
import AdminHeader from "../components/adminDashboard/AdminHeader";
import AdminInbox from "../components/adminDashboard/AdminInbox";
import AdminSidebar from "../components/adminDashboard/AdminSidebar";
import ContentModeration from "../components/adminDashboard/ContentModeration";
import DashboardOverview from "../components/adminDashboard/DashboardOverview";
import UserManagement from "../components/adminDashboard/UserManagement";
import { colors, styles } from "../components/adminDashboard/adminTheme";
import { getAuthSession } from "../utils/authSession";
import { API_BASE_URL } from "../config/api";

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { tab } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [analytics, setAnalytics] = useState({});
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [contentFilter, setContentFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const title = useMemo(() => {
    if (activeTab === "users") return "User Management";
    if (activeTab === "content") return "Content Moderation";
    if (activeTab === "inbox") return "Inbox Messages";
    return "Overview Dashboard";
  }, [activeTab]);

  const authFetch = useCallback(
    async (path, options = {}) => {
      const session = getAuthSession();
      if (!session?.token || session.user?.role !== "admin") {
        router.replace("/login");
        throw new Error("Admin login required");
      }

      const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
          ...(options.headers || {}),
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Request failed");
      return data.data;
    },
    [router],
  );

  const loadDashboard = useCallback(async () => {
    const data = await authFetch("/api/admin/dashboard");
    setAnalytics(data || {});
  }, [authFetch]);

  const loadUsers = useCallback(
    async (search = "") => {
      const query = search ? `?search=${encodeURIComponent(search)}` : "";
      const data = await authFetch(`/api/admin/users${query}`);
      setUsers(data || []);
    },
    [authFetch],
  );

  const loadContent = useCallback(
    async (filter = contentFilter, search = "") => {
      const params = new URLSearchParams();
      params.set("status", filter);
      if (search) params.set("search", search);
      const data = await authFetch(`/api/admin/content?${params.toString()}`);
      setListings(data || []);
    },
    [authFetch, contentFilter],
  );

  const refreshActiveTab = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === "dashboard") await loadDashboard();
      if (activeTab === "users") await loadUsers();
      if (activeTab === "content") await loadContent();
    } catch (error) {
      console.error("Admin dashboard load error:", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, loadContent, loadDashboard, loadUsers]);

  useEffect(() => {
    refreshActiveTab();
  }, [refreshActiveTab]);

  const handleUserAction = async (userId, action) => {
    try {
      await authFetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({
          nidVerificationStatus: action === "approve" ? "verified" : "rejected",
          status: action === "reject" ? "pending" : "active",
        }),
      });
      await Promise.all([loadUsers(), loadDashboard()]);
    } catch (error) {
      console.error("User action failed:", error);
    }
  };

  const handleContentAction = async (listingId, action) => {
    try {
      await authFetch(`/api/admin/content/${listingId}`, {
        method: "PATCH",
        body: JSON.stringify({ action }),
      });
      await Promise.all([loadContent(contentFilter), loadDashboard()]);
    } catch (error) {
      console.error("Content action failed:", error);
    }
  };

  const handleFilter = (filter) => {
    setContentFilter(filter);
    loadContent(filter);
  };

  const showFab = activeTab === "content" || activeTab === "users";

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
      <View style={styles.phone}>
        <AdminHeader
          onMenuPress={() => setSidebarOpen(true)}
          onProfilePress={() => router.push("/admin-profile")}
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === "dashboard" && (
            <DashboardOverview
              title={title}
              analytics={analytics}
              loading={loading}
            />
          )}
          {activeTab === "content" && (
            <ContentModeration
              listings={listings}
              activeFilter={contentFilter}
              loading={loading}
              onFilter={handleFilter}
              onSearch={(search) => loadContent(contentFilter, search)}
              onAction={handleContentAction}
            />
          )}
          {activeTab === "users" && (
            <UserManagement
              users={users}
              pendingCount={
                analytics.pendingNid ||
                users.filter((user) => user.nidVerificationStatus === "pending")
                  .length
              }
              loading={loading}
              onSearch={loadUsers}
              onAction={handleUserAction}
            />
          )}
          {activeTab === "inbox" && <AdminInbox />}
        </ScrollView>

        {showFab && (
          <TouchableOpacity
            style={styles.fab}
            activeOpacity={0.85}
            onPress={refreshActiveTab}
          >
            <Ionicons
              name={activeTab === "users" ? "refresh" : "sync"}
              size={25}
              color="#fff"
            />
          </TouchableOpacity>
        )}

        {sidebarOpen && (
          <AdminSidebar
            activeTab={activeTab}
            onClose={() => setSidebarOpen(false)}
            onGoHome={() => {
              setSidebarOpen(false);
              router.push("/admin-dashboard");
            }}
            onSelectTab={(tab) => {
              setActiveTab(tab);
              setSidebarOpen(false);
            }}
          />
        )}

        <AdminBottomTabs activeTab={activeTab} onChange={setActiveTab} />
      </View>
    </SafeAreaView>
  );
}
