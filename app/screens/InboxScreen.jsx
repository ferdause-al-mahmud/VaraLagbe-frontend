import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedView } from "../components/ThemedView";
import { getAuthSession, getAuthUserId } from "../utils/authSession";
import { API_BASE_URL } from "../config/api";
const INBOX_TABS = ["All", "Unread", "Archive"];

function initials(name = "VL") {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "VL"
  );
}

function formatTime(value) {
  if (!value) return "";
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function InboxScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [startedKey, setStartedKey] = useState(null);

  const currentUserId = getAuthUserId();

  const authFetch = useCallback(
    async (path, options = {}) => {
      const liveSession = getAuthSession();
      if (!liveSession?.token) {
        router.replace("/login");
        throw new Error("Login required");
      }

      const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${liveSession.token}`,
          ...(options.headers || {}),
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Request failed");
      return data.data;
    },
    [router],
  );

  const loadConversations = useCallback(
    async ({ silent = false } = {}) => {
      if (!silent) setLoading(true);
      try {
        const data = await authFetch("/api/chats");
        setConversations(data || []);
        if (selectedChat?.id) {
          const updated = data?.find((chat) => chat.id === selectedChat.id);
          if (updated) setSelectedChat(updated);
        }
      } catch (error) {
        console.error("Load chats error:", error);
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [authFetch, selectedChat?.id],
  );

  const openChat = useCallback(
    async (chat) => {
      setSelectedChat(chat);
      try {
        const data = await authFetch(`/api/chats/${chat.id}`);
        setSelectedChat(data);
        await authFetch(`/api/chats/${chat.id}/read`, { method: "PATCH" });
        loadConversations({ silent: true });
      } catch (error) {
        console.error("Open chat error:", error);
      }
    },
    [authFetch, loadConversations],
  );

  useEffect(() => {
    loadConversations();
    const intervalId = setInterval(
      () => loadConversations({ silent: true }),
      5000,
    );
    return () => clearInterval(intervalId);
  }, [loadConversations]);

  useEffect(() => {
    const participantId = params.participantId || params.ownerId;
    const propertyId = params.propertyId || "";
    const key = participantId ? `${participantId}-${propertyId}` : null;

    if (!participantId || key === startedKey) return;

    setStartedKey(key);
    authFetch("/api/chats/start", {
      method: "POST",
      body: JSON.stringify({
        participantId,
        propertyId,
        propertyTitle: params.propertyTitle || "Property conversation",
      }),
    })
      .then((chat) => {
        setSelectedChat(chat);
        loadConversations({ silent: true });
      })
      .catch((error) => console.error("Start chat error:", error));
  }, [
    authFetch,
    loadConversations,
    params.ownerId,
    params.participantId,
    params.propertyId,
    params.propertyTitle,
    startedKey,
  ]);

  const filteredMessages = useMemo(
    () =>
      conversations.filter((chat) => {
        const name = chat.participant?.name || "";
        const propertyName = chat.propertyTitle || "";
        const matchesSearch =
          name.toLowerCase().includes(searchText.toLowerCase()) ||
          propertyName.toLowerCase().includes(searchText.toLowerCase());

        if (activeTab === "Unread")
          return chat.unreadCount > 0 && matchesSearch;
        if (activeTab === "Archive") return false;
        return matchesSearch;
      }),
    [activeTab, conversations, searchText],
  );

  const sendMessage = async () => {
    if (!selectedChat?.id || !draft.trim()) return;
    setSending(true);
    try {
      const data = await authFetch(`/api/chats/${selectedChat.id}/messages`, {
        method: "POST",
        body: JSON.stringify({ text: draft.trim() }),
      });
      setSelectedChat(data);
      setDraft("");
      loadConversations({ silent: true });
    } catch (error) {
      console.error("Send message error:", error);
    } finally {
      setSending(false);
    }
  };

  const renderMessageItem = ({ item }) => {
    const name = item.participant?.name || "Unknown";
    const role =
      item.participant?.role === "owner"
        ? "Owner"
        : item.participant?.role === "admin"
          ? "Admin"
          : "Tenant";
    return (
      <TouchableOpacity
        style={styles.messageRow}
        activeOpacity={0.7}
        onPress={() => openChat(item)}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.messageAvatar}>
            <Text style={styles.avatarText}>{initials(name)}</Text>
          </View>
          {item.unreadCount > 0 && <View style={styles.onlineDot} />}
        </View>

        <View style={styles.messageCopy}>
          <View style={styles.messageTop}>
            <View style={styles.senderInfo}>
              <Text style={styles.messageName}>{name}</Text>
              <Text style={styles.senderRole}>({role})</Text>
            </View>
            <Text style={styles.messageTime}>
              {formatTime(item.lastMessageAt)}
            </Text>
          </View>
          <View style={styles.propertyTag}>
            <MaterialCommunityIcons
              name="office-building"
              size={12}
              color="#064F60"
            />
            <Text style={styles.propertyName}>{item.propertyTitle}</Text>
          </View>
          <View style={styles.messagePreviewRow}>
            <Text style={styles.messagePreview} numberOfLines={1}>
              {item.lastMessage}
            </Text>
            {item.unreadCount > 0 && <View style={styles.unreadDot} />}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderConversation = () => {
    const name = selectedChat.participant?.name || "Conversation";
    return (
      <View style={styles.chatPanel}>
        <View style={styles.chatHeader}>
          <TouchableOpacity
            onPress={() => setSelectedChat(null)}
            style={styles.chatBackButton}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={22}
              color="#0D9488"
            />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.chatTitle}>{name}</Text>
            <Text style={styles.chatSubtitle}>
              {selectedChat.propertyTitle}
            </Text>
          </View>
        </View>

        <ScrollView
          style={styles.chatMessages}
          contentContainerStyle={styles.chatMessageContent}
        >
          {(selectedChat.messages || []).map((message) => {
            const mine =
              String(message.senderId?._id || message.senderId) ===
              String(currentUserId);
            return (
              <View
                key={message._id || message.createdAt}
                style={[
                  styles.bubble,
                  mine ? styles.myBubble : styles.theirBubble,
                ]}
              >
                <Text style={[styles.bubbleText, mine && styles.myBubbleText]}>
                  {message.text}
                </Text>
                <Text style={[styles.bubbleTime, mine && styles.myBubbleTime]}>
                  {formatTime(message.createdAt)}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.composer}>
          <TextInput
            style={styles.composerInput}
            placeholder="Write a message..."
            placeholderTextColor="#9CA3AF"
            value={draft}
            onChangeText={setDraft}
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={sendMessage}
            disabled={sending || !draft.trim()}
          >
            {sending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <MaterialCommunityIcons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (selectedChat) {
    return (
      <ThemedView style={styles.screen}>{renderConversation()}</ThemedView>
    );
  }

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
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => loadConversations()}
        >
          <MaterialCommunityIcons name="refresh" size={22} color="#0D9488" />
          {!!conversations.reduce(
            (sum, chat) => sum + (chat.unreadCount || 0),
            0,
          ) && (
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>
                {conversations.reduce(
                  (sum, chat) => sum + (chat.unreadCount || 0),
                  0,
                )}
              </Text>
            </View>
          )}
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

      {loading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#0D9488" />
        </View>
      ) : filteredMessages.length === 0 ? (
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
              : "Message an owner from a property page."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredMessages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
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
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
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
    paddingBottom: 24,
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
    backgroundColor: "#0D9488",
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
  chatPanel: {
    flex: 1,
    backgroundColor: "#F5FAFC",
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  chatBackButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F1519",
  },
  chatSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  chatMessages: {
    flex: 1,
  },
  chatMessageContent: {
    padding: 16,
    paddingBottom: 24,
  },
  bubble: {
    maxWidth: "82%",
    borderRadius: 14,
    paddingHorizontal: 13,
    paddingVertical: 10,
    marginBottom: 10,
  },
  myBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#0D9488",
  },
  theirBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#1F2937",
  },
  myBubbleText: {
    color: "#FFFFFF",
  },
  bubbleTime: {
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 5,
    alignSelf: "flex-end",
  },
  myBubbleTime: {
    color: "rgba(255,255,255,0.75)",
  },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
    gap: 10,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  composerInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 110,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#0D9488",
    alignItems: "center",
    justifyContent: "center",
  },
});
