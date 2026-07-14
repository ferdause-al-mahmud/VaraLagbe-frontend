import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, styles as adminStyles } from "./adminTheme";

const INBOX_MESSAGES = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
    id: 5,
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

export default function AdminInbox() {
  const renderMessageItem = ({ item }) => (
    <TouchableOpacity style={localStyles.messageRow} activeOpacity={0.7}>
      <View style={localStyles.avatarContainer}>
        <View
          style={[
            localStyles.messageAvatar,
            { backgroundColor: item.avatar.color },
          ]}
        >
          <Text style={localStyles.avatarText}>{item.avatar.initials}</Text>
        </View>
        {item.onlineStatus && <View style={localStyles.onlineDot} />}
      </View>

      <View style={localStyles.messageCopy}>
        <View style={localStyles.messageTop}>
          <View style={localStyles.senderInfo}>
            <Text style={localStyles.messageName}>{item.senderName}</Text>
            <Text style={localStyles.senderRole}>({item.senderRole})</Text>
          </View>
          <Text style={localStyles.messageTime}>{item.timestamp}</Text>
        </View>
        <View style={localStyles.propertyTag}>
          <MaterialCommunityIcons
            name="office-building"
            size={12}
            color="#064F60"
          />
          <Text style={localStyles.propertyName}>{item.propertyName}</Text>
        </View>
        <View style={localStyles.messagePreviewRow}>
          <Text style={localStyles.messagePreview} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.isUnread && <View style={localStyles.unreadDot} />}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={localStyles.container}>
      <View style={localStyles.searchContainer}>
        <MaterialCommunityIcons
          name="magnify"
          size={20}
          color="#9CA3AF"
          style={localStyles.searchIcon}
        />
        <TextInput
          style={localStyles.searchInput}
          placeholder="Search conversations..."
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {INBOX_MESSAGES.length === 0 ? (
        <View style={localStyles.emptyContainer}>
          <MaterialCommunityIcons
            name="message-outline"
            size={56}
            color="#D1D5DB"
          />
          <Text style={localStyles.emptyTitle}>No messages</Text>
          <Text style={localStyles.emptySubtitle}>
            Your inbox is empty. Start a conversation!
          </Text>
        </View>
      ) : (
        <FlatList
          data={INBOX_MESSAGES}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={localStyles.messagesList}
          scrollEnabled={false}
        />
      )}
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FAFC",
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
  messagesList: {
    paddingHorizontal: 12,
  },
  messageRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 8,
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
