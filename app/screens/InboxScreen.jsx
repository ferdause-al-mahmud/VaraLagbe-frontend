import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedView } from "../components/ThemedView";
import { getAuthSession } from "../utils/authSession";

const INBOX_TABS = ["All", "Unread", "Archive"];

const SAMPLE_MESSAGES = [
  {
    id: "1",
    senderName: "Anisur Rahman",
    senderRole: "Host",
    propertyName: "Luxury 3BHK Dhanmondi",
    lastMessage: "is the parking space included in...",
    timestamp: "2m ago",
    avatar: { initials: "AR", color: "#D4A574" },
    isUnread: true,
    onlineStatus: true,
  },
  {
    id: "2",
    senderName: "Farhana K.",
    senderRole: "Host",
    propertyName: "Studio Apartment Gulshan 2",
    lastMessage: "The keys are with the security guard...",
    timestamp: "1h ago",
    avatar: { initials: "FK", color: "#E8B4B8" },
    isUnread: false,
    onlineStatus: false,
  },
  {
    id: "3",
    senderName: "Imtiaz Ahmed",
    senderRole: "Tenant",
    propertyName: "Modern Duplex in Banani",
    lastMessage: "Thank you for the visit. I'll let you kn...",
    timestamp: "Yesterday",
    avatar: { initials: "IA", color: "#8BD5D0" },
    isUnread: false,
    onlineStatus: true,
  },
  {
    id: "4",
    senderName: "Nabila J.",
    senderRole: "Tenant",
    propertyName: "Cozy Room near Bashundhara R/A",
    lastMessage: "Is the internet connection high speed?",
    timestamp: "2 days ago",
    avatar: { initials: "NJ", color: "#F6C77F" },
    isUnread: false,
    onlineStatus: false,
  },
  {
    id: "5",
    senderName: "Zayed Khan",
    senderRole: "Host",
    propertyName: "Purbachal Penthouse",
    lastMessage: "Great, looking forward to seeing you...",
    timestamp: "Mon",
    avatar: { initials: "ZK", color: "#94E5F2" },
    isUnread: false,
    onlineStatus: false,
  },
];

export default function InboxScreen() {
  const router = useRouter();
  const { user } = getAuthSession();
  const [activeTab, setActiveTab] = useState("All");
  const [searchText, setSearchText] = useState("");

  const filteredMessages = SAMPLE_MESSAGES.filter((msg) => {
    const matchesSearch =
      msg.senderName.toLowerCase().includes(searchText.toLowerCase()) ||
      msg.propertyName.toLowerCase().includes(searchText.toLowerCase());

    if (activeTab === "Unread") return msg.isUnread && matchesSearch;
    if (activeTab === "Archive") return false; // Archive functionality can be added later
    return matchesSearch;
  });

  const renderMessageItem = ({ item }) => (
    <TouchableOpacity style={styles.messageRow} activeOpacity={0.7}>
      <View style={styles.avatarContainer}>
        <View
          style={[styles.messageAvatar, { backgroundColor: item.avatar.color }]}
        >
          <Text style={styles.avatarText}>{item.avatar.initials}</Text>
        </View>
        {item.onlineStatus && <View style={styles.onlineDot} />}
      </View>

      <View style={styles.messageCopy}>
        <View style={styles.messageTop}>
          <View style={styles.senderInfo}>
            <Text style={styles.messageName}>{item.senderName}</Text>
            <Text style={styles.senderRole}>({item.senderRole})</Text>
          </View>
          <Text style={styles.messageTime}>{item.timestamp}</Text>
        </View>
        <View style={styles.propertyTag}>
          <MaterialCommunityIcons
            name="office-building"
            size={12}
            color="#064F60"
          />
          <Text style={styles.propertyName}>{item.propertyName}</Text>
        </View>
        <View style={styles.messagePreviewRow}>
          <Text style={styles.messagePreview} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.isUnread && <View style={styles.unreadDot} />}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#0D9488" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inbox</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <MaterialCommunityIcons
            name="bell-outline"
            size={22}
            color="#0D9488"
          />
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <MaterialCommunityIcons
          name="magnify"
          size={20}
          color="#9CA3AF"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations..."
          placeholderTextColor="#9CA3AF"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <View style={styles.tabsContainer}>
        {INBOX_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabLabel,
                activeTab === tab && styles.tabLabelActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredMessages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="message-outline"
            size={56}
            color="#D1D5DB"
          />
          <Text style={styles.emptyTitle}>No messages</Text>
          <Text style={styles.emptySubtitle}>
            {searchText
              ? "Try a different search"
              : "Your inbox is empty. Start a conversation!"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredMessages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.messagesList}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: "800",
    color: "#090D10",
  },
  notificationButton: {
    position: "relative",
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationBadge: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 14,
    marginBottom: 16,
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1F2937",
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 10,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
  },
  tabActive: {
    backgroundColor: "#064F60",
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  tabLabelActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  messagesList: {
    paddingHorizontal: 16,
  },
  messageRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 2,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 14,
  },
  messageAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  onlineDot: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#10B981",
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
    marginBottom: 6,
  },
  senderInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  messageName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F1519",
  },
  senderRole: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  messageTime: {
    fontSize: 12,
    color: "#9CA3AF",
    marginLeft: 8,
  },
  propertyTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  propertyName: {
    fontSize: 12,
    color: "#064F60",
    fontWeight: "500",
  },
  messagePreviewRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  messagePreview: {
    flex: 1,
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3B82F6",
    marginLeft: 10,
    flexShrink: 0,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 14,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 6,
    textAlign: "center",
  },
});
