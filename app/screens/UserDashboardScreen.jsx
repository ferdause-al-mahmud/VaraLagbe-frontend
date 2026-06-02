import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedView } from "../components/ThemedView";
import { getAuthSession } from "../utils/authSession";

const SAVED_SEARCHES = [
  {
    id: "gulshan",
    title: "Gulshan 2",
    detail: "3+ BHK Apartments",
    icon: "map-marker",
    color: "#94E5F2",
  },
  {
    id: "dhanmondi",
    title: "Dhanmondi",
    detail: "Studio Lofts",
    icon: "home",
    color: "#F6C77F",
  },
  {
    id: "mirpur",
    title: "Mirpur DOHS",
    detail: "Under Tk 30,000",
    icon: "currency-usd",
    color: "#74E391",
  },
];

const ACTIVITIES = [
  {
    id: "inquiry",
    title: "Your inquiry for Lakeview Penthouse was responded to.",
    time: "2 hours ago",
    icon: "message-image",
    color: "#DDECEF",
  },
  {
    id: "verified",
    title: "Verification document approved. Your profile is now Trusted.",
    time: "Yesterday",
    icon: "check-circle",
    color: "#DFF2EA",
  },
];

const MESSAGES = [
  {
    id: "host",
    name: "Asif Rahman (Host)",
    time: "10:45 AM",
    preview: "Yes, the keys will be in the loc...",
    meta: "The Nordic Suite",
    icon: "account-tie",
    color: "#092C36",
  },
  {
    id: "support",
    name: "BashaFinder Support",
    time: "8:12 AM",
    preview: "Your refund for the cancelled v...",
    meta: "",
    icon: "face-man",
    color: "#8BD5D0",
  },
];

function getFirstName(user) {
  return user?.fullName?.trim()?.split(/\s+/)[0] || "Tasneem";
}

export default function UserDashboardScreen() {
  const router = useRouter();
  const { user } = getAuthSession();
  const firstName = getFirstName(user);

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.menuButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="menu" size={24} color="#08324A" />
          </TouchableOpacity>
          <Text style={styles.brand}>BashaFinder</Text>
          <TouchableOpacity
            style={styles.avatar}
            onPress={() => router.push("/tabs/profile")}
          >
            <MaterialCommunityIcons name="face-woman" size={30} color="#F7B279" />
          </TouchableOpacity>
        </View>

        <View style={styles.greeting}>
          <Text style={styles.greetingTitle}>Hello, {firstName}</Text>
          <Text style={styles.greetingText}>Find your next sanctuary in Dhaka.</Text>
        </View>

        <TouchableOpacity
          style={styles.exploreButton}
          activeOpacity={0.88}
          onPress={() => router.push("/tabs/search")}
        >
          <View style={styles.exploreLeft}>
            <View style={styles.compass}>
              <MaterialCommunityIcons name="compass" size={16} color="#064F60" />
            </View>
            <Text style={styles.exploreText}>Explore Properties</Text>
          </View>
          <MaterialCommunityIcons name="arrow-right" size={26} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.shortcutRow}>
          <TouchableOpacity style={styles.shortcutCard} activeOpacity={0.86}>
            <MaterialCommunityIcons name="calendar-blank" size={25} color="#08324A" />
            <Text style={styles.shortcutText}>My Bookings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.shortcutCard}
            activeOpacity={0.86}
            onPress={() => router.push("/tabs/favorites")}
          >
            <MaterialCommunityIcons name="heart" size={25} color="#5A3300" />
            <Text style={styles.shortcutText}>Favorites</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.reservationCard}>
          <View style={styles.reservationImageWrap}>
            <Image
              source={require("../../assets/images/home2.png")}
              style={styles.reservationImage}
            />
            <View style={styles.statusPill}>
              <Text style={styles.statusText}>UPCOMING</Text>
            </View>
          </View>
          <View style={styles.reservationBody}>
            <Text style={styles.overline}>ACTIVE RESERVATION</Text>
            <Text style={styles.reservationTitle}>The Nordic Suite, Banani</Text>
            <View style={styles.dateRow}>
              <MaterialCommunityIcons name="calendar-star" size={14} color="#163240" />
              <Text style={styles.dateText}>Oct 24 - Oct 29, 2023</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.paymentRow}>
              <View>
                <Text style={styles.paymentLabel}>Total Payment</Text>
                <Text style={styles.paymentValue}>৳45,000</Text>
              </View>
              <TouchableOpacity style={styles.detailsButton} activeOpacity={0.86}>
                <Text style={styles.detailsText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.sectionBar}>
          <Text style={styles.sectionTitle}>Continue Searching</Text>
          <TouchableOpacity>
            <Text style={styles.clearText}>Clear all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchGrid}>
          {SAVED_SEARCHES.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.searchChip}
              activeOpacity={0.86}
              onPress={() => router.push("/tabs/search")}
            >
              <View style={[styles.searchIcon, { backgroundColor: item.color }]}>
                <MaterialCommunityIcons name={item.icon} size={22} color="#123640" />
              </View>
              <View style={styles.searchCopy}>
                <Text style={styles.searchTitle}>{item.title}</Text>
                <Text style={styles.searchDetail}>{item.detail}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.activityHeading}>Recent Activity</Text>
        <View style={styles.activityList}>
          {ACTIVITIES.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: activity.color }]}>
                <MaterialCommunityIcons
                  name={activity.icon}
                  size={22}
                  color={activity.id === "verified" ? "#0A7A39" : "#0C4A60"}
                />
              </View>
              <View style={styles.activityCopy}>
                <Text style={styles.activityText}>
                  {activity.id === "verified" ? (
                    <>
                      Verification document approved. Your profile is now{" "}
                      <Text style={styles.boldText}>Trusted.</Text>
                    </>
                  ) : (
                    activity.title
                  )}
                </Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.messagesCard}>
          <View style={styles.messagesHeader}>
            <Text style={styles.messagesTitle}>Unread Messages</Text>
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>3 NEW</Text>
            </View>
          </View>

          {MESSAGES.map((message) => (
            <View key={message.id} style={styles.messageRow}>
              <View style={[styles.messageAvatar, { backgroundColor: message.color }]}>
                <MaterialCommunityIcons name={message.icon} size={31} color="#FFFFFF" />
              </View>
              <View style={styles.onlineDot} />
              <View style={styles.messageCopy}>
                <View style={styles.messageTop}>
                  <Text style={styles.messageName}>{message.name}</Text>
                  <Text style={styles.messageTime}>{message.time}</Text>
                </View>
                <Text style={styles.messagePreview}>{message.preview}</Text>
                {message.meta ? (
                  <View style={styles.messageMeta}>
                    <MaterialCommunityIcons name="office-building" size={12} color="#064F60" />
                    <Text style={styles.messageMetaText}>{message.meta}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.inboxButton} activeOpacity={0.86}>
            <Text style={styles.inboxText}>Go to Inbox</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={[styles.navItem, styles.navActive]}>
          <MaterialCommunityIcons name="home" size={22} color="#064F60" />
          <Text style={styles.navTextActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/tabs/search")}>
          <MaterialCommunityIcons name="magnify" size={24} color="#516884" />
          <Text style={styles.navText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="calendar" size={23} color="#516884" />
          <Text style={styles.navText}>Bookings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/tabs/profile")}>
          <MaterialCommunityIcons name="account" size={22} color="#516884" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5FAFC",
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 112,
  },
  topBar: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 42,
  },
  menuButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  brand: {
    flex: 1,
    fontSize: 20,
    fontWeight: "800",
    color: "#08324A",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 3,
    borderColor: "#08324A",
    backgroundColor: "#F1A987",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  greeting: {
    marginBottom: 31,
  },
  greetingTitle: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900",
    color: "#090D10",
  },
  greetingText: {
    fontSize: 17,
    lineHeight: 24,
    color: "#171E24",
  },
  exploreButton: {
    minHeight: 68,
    borderRadius: 14,
    backgroundColor: "#064F60",
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  exploreLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  compass: {
    width: 21,
    height: 21,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  exploreText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  shortcutRow: {
    flexDirection: "row",
    gap: 18,
    marginBottom: 28,
  },
  shortcutCard: {
    flex: 1,
    minHeight: 78,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  shortcutText: {
    fontSize: 15,
    color: "#101417",
  },
  reservationCard: {
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    marginBottom: 43,
    shadowColor: "#0D2730",
    shadowOpacity: 0.07,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
  reservationImageWrap: {
    height: 185,
    backgroundColor: "#DCE5E5",
  },
  reservationImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  statusPill: {
    position: "absolute",
    top: 14,
    left: 14,
    borderRadius: 999,
    backgroundColor: "#91F5A8",
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: "#044327",
  },
  reservationBody: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 26,
  },
  overline: {
    fontSize: 12,
    letterSpacing: 2.2,
    fontWeight: "800",
    color: "#4C210B",
    marginBottom: 11,
  },
  reservationTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "800",
    color: "#070B0F",
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  dateText: {
    fontSize: 15,
    color: "#1E2B35",
  },
  divider: {
    height: 1,
    backgroundColor: "#EDF1F3",
    marginTop: 24,
    marginBottom: 17,
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  paymentLabel: {
    fontSize: 12,
    color: "#59656C",
    marginBottom: 3,
  },
  paymentValue: {
    fontSize: 18,
    fontWeight: "500",
    color: "#064F60",
  },
  detailsButton: {
    minWidth: 112,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#E5E8EA",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  detailsText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#04080B",
  },
  sectionBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#070B0F",
  },
  clearText: {
    fontSize: 14,
    color: "#001B2E",
  },
  searchGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 13,
    marginBottom: 42,
  },
  searchChip: {
    width: "47.8%",
    minHeight: 64,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#0D2730",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  searchIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },
  searchCopy: {
    flex: 1,
    minWidth: 0,
  },
  searchTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#11171B",
  },
  searchDetail: {
    marginTop: 2,
    fontSize: 10,
    color: "#4D5961",
  },
  activityHeading: {
    fontSize: 20,
    fontWeight: "800",
    color: "#070B0F",
    marginBottom: 18,
  },
  activityList: {
    gap: 18,
    marginBottom: 35,
  },
  activityItem: {
    minHeight: 83,
    borderRadius: 18,
    backgroundColor: "#F8FBFC",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  activityIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
  },
  activityCopy: {
    flex: 1,
  },
  activityText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#11171B",
  },
  boldText: {
    fontWeight: "900",
  },
  activityTime: {
    marginTop: 4,
    fontSize: 12,
    color: "#63717A",
  },
  messagesCard: {
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 27,
    shadowColor: "#0D2730",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  messagesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  messagesTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#070B0F",
  },
  newBadge: {
    borderRadius: 999,
    backgroundColor: "#C5161D",
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  newBadgeText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  messageRow: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  messageAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
    overflow: "hidden",
  },
  onlineDot: {
    position: "absolute",
    left: 43,
    bottom: 6,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#087D2F",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  messageCopy: {
    flex: 1,
    minWidth: 0,
  },
  messageTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  messageName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: "#0F1519",
  },
  messageTime: {
    fontSize: 10,
    color: "#54636D",
  },
  messagePreview: {
    marginTop: 3,
    fontSize: 15,
    color: "#0F1519",
  },
  messageMeta: {
    marginTop: 7,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  messageMetaText: {
    fontSize: 11,
    color: "#09384B",
  },
  inboxButton: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#B7CAD2",
    alignItems: "center",
    justifyContent: "center",
  },
  inboxText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#00283D",
  },
  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 81,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 22,
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: "#0D2730",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -3 },
    elevation: 8,
  },
  navItem: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
  },
  navActive: {
    backgroundColor: "#DDECEF",
  },
  navText: {
    marginTop: 2,
    fontSize: 10,
    color: "#516884",
  },
  navTextActive: {
    marginTop: 2,
    fontSize: 10,
    color: "#064F60",
    fontWeight: "700",
  },
});
