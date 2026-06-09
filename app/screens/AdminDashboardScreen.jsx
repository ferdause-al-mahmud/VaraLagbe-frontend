import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from "react-native";
import AdminBottomTabs from "../components/adminDashboard/AdminBottomTabs";
import AdminHeader from "../components/adminDashboard/AdminHeader";
import AdminSidebar from "../components/adminDashboard/AdminSidebar";
import ContentModeration from "../components/adminDashboard/ContentModeration";
import DashboardOverview from "../components/adminDashboard/DashboardOverview";
import UserManagement from "../components/adminDashboard/UserManagement";
import { colors, styles } from "../components/adminDashboard/adminTheme";

export default function AdminDashboardScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const title = useMemo(() => {
    if (activeTab === "users") return "User Management";
    if (activeTab === "content") return "Content Moderation";
    return "Overview Dashboard";
  }, [activeTab]);

  const showFab = activeTab === "content" || activeTab === "users";

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
      <View style={styles.phone}>
        <AdminHeader onMenuPress={() => setSidebarOpen(true)} />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === "dashboard" && <DashboardOverview title={title} />}
          {activeTab === "content" && <ContentModeration />}
          {activeTab === "users" && <UserManagement />}
        </ScrollView>

        {showFab && (
          <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
            <Ionicons
              name={activeTab === "users" ? "person-add-outline" : "add"}
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
              router.push("/tabs/home");
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
