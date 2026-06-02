import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ThemedView } from "../components/ThemedView";

const DASHBOARD_STATS = [
  {
    id: "bookings",
    label: "Bookings",
    value: "02",
    icon: "calendar-check",
    tint: "#0C4A60",
  },
  {
    id: "favorites",
    label: "Favorites",
    value: "08",
    icon: "heart",
    tint: "#C61D1D",
  },
  {
    id: "alerts",
    label: "Alerts",
    value: "03",
    icon: "bell-ring",
    tint: "#B7791F",
  },
];

const RECENT_ACTIVITY = [
  {
    id: "viewing",
    title: "Viewing scheduled",
    detail: "Gulshan Lakeview Apartment",
    icon: "home-clock",
  },
  {
    id: "saved",
    title: "Saved search updated",
    detail: "2 BHK under Tk 45,000 in Dhanmondi",
    icon: "magnify",
  },
  {
    id: "message",
    title: "Owner replied",
    detail: "Urban Oasis Studio is available this week",
    icon: "message-text",
  },
];

export default function UserDashboardScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={26} color="#0C4A60" />
          </TouchableOpacity>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>USER DASHBOARD</Text>
            <Text style={styles.title}>My Rental Hub</Text>
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="bell" size={24} color="#0C4A60" />
          </TouchableOpacity>
        </View>

        <View style={styles.heroPanel}>
          <View style={styles.heroIcon}>
            <MaterialCommunityIcons name="home-heart" size={34} color="#FFFFFF" />
          </View>
          <Text style={styles.heroTitle}>Find, save, and manage your next home.</Text>
          <Text style={styles.heroText}>
            Track viewings, favorite listings, and saved search alerts from one place.
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.88}
            onPress={() => router.push("/tabs/search")}
          >
            <MaterialCommunityIcons name="magnify" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Search Properties</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          {DASHBOARD_STATS.map((stat) => (
            <View key={stat.id} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: `${stat.tint}18` }]}>
                <MaterialCommunityIcons name={stat.icon} size={22} color={stat.tint} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionRow}
            activeOpacity={0.88}
            onPress={() => router.push("/tabs/favorites")}
          >
            <View style={styles.actionLeft}>
              <MaterialCommunityIcons name="heart-outline" size={24} color="#0C4A60" />
              <Text style={styles.actionText}>View favorites</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={26} color="#7D878F" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionRow}
            activeOpacity={0.88}
            onPress={() => router.push("/tabs/profile")}
          >
            <View style={styles.actionLeft}>
              <MaterialCommunityIcons name="account-cog" size={24} color="#0C4A60" />
              <Text style={styles.actionText}>Update profile</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={26} color="#7D878F" />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
        </View>

        <View style={styles.activityList}>
          {RECENT_ACTIVITY.map((activity) => (
            <View key={activity.id} style={styles.activityRow}>
              <View style={styles.activityIcon}>
                <MaterialCommunityIcons
                  name={activity.icon}
                  size={22}
                  color="#0C4A60"
                />
              </View>
              <View style={styles.activityCopy}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityDetail}>{activity.detail}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F4F7F8",
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 30,
    paddingBottom: 34,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCopy: {
    flex: 1,
    marginHorizontal: 14,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    color: "#637179",
    marginBottom: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#10181C",
  },
  heroPanel: {
    borderRadius: 24,
    backgroundColor: "#0C4A60",
    padding: 22,
    marginBottom: 22,
  },
  heroIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  heroTitle: {
    fontSize: 24,
    lineHeight: 31,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  heroText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#D5E8EE",
    marginBottom: 20,
  },
  primaryButton: {
    height: 50,
    borderRadius: 14,
    backgroundColor: "#0A7A39",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 26,
  },
  statCard: {
    flex: 1,
    minHeight: 126,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    padding: 14,
    justifyContent: "space-between",
  },
  statIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#10181C",
  },
  statLabel: {
    fontSize: 12,
    color: "#59666E",
    fontWeight: "700",
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#10181C",
  },
  actions: {
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    marginBottom: 26,
  },
  actionRow: {
    minHeight: 66,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#EEF1F3",
  },
  actionLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#151B1E",
  },
  activityList: {
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    paddingVertical: 4,
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#EAF2F5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  activityCopy: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#10181C",
    marginBottom: 4,
  },
  activityDetail: {
    fontSize: 13,
    lineHeight: 18,
    color: "#59666E",
  },
});
