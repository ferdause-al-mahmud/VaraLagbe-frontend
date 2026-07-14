import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { UserCard } from "./AdminCards";
import { colors, styles } from "./adminTheme";

function mapUser(user) {
  const nidStatus = user.nidVerificationStatus || "not_submitted";
  const verified = nidStatus === "verified";
  const pending = nidStatus === "pending";

  return {
    id: user.id || user._id,
    name: user.name || user.fullName || "Unknown User",
    role: user.role === "owner" ? "PROPERTY OWNER" : user.role === "admin" ? "ADMIN" : "RENTER",
    status: verified ? "VERIFIED" : pending ? "PENDING" : user.status === "suspended" ? "SUSPENDED" : "UNVERIFIED",
    avatar: user.avatar,
    metaTitle: pending ? "NID Verification" : verified ? "Account Healthy" : "NID Status",
    metaSubtitle: pending ? "Submitted for review" : user.email,
    metaText: pending || user.nidFile ? "View NID" : "",
  };
}

export default function UserManagement({ users = [], pendingCount = 0, loading, onSearch, onAction }) {
  return (
    <View>
      <View style={[styles.searchBox, styles.userSearch]}>
        <Ionicons name="search" size={18} color="#46565b" />
        <TextInput
          placeholder="Search users..."
          placeholderTextColor="#8b989c"
          style={styles.searchInput}
          onChangeText={onSearch}
        />
      </View>

      <View style={styles.reviewPanel}>
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewTitle}>Verification Queue</Text>
          <View style={styles.pendingPill}>
            <Text style={styles.pendingPillText}>{pendingCount} PENDING</Text>
          </View>
        </View>
        <Text style={styles.reviewCopy}>
          Review submitted NID details and keep account access clean for renters and property owners.
        </Text>
        <TouchableOpacity style={styles.reviewButton} activeOpacity={0.8}>
          <MaterialCommunityIcons
            name="shield-check-outline"
            size={18}
            color={colors.tealDark}
          />
          <Text style={styles.reviewButtonText}>Review Queue</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeadingRow}>
        <Text style={styles.sectionTitle}>All Users</Text>
        <Ionicons name="filter" size={20} color="#34464b" />
      </View>

      {loading ? (
        <Text style={styles.dateText}>Loading users...</Text>
      ) : users.length ? (
        users.map((user) => (
          <UserCard key={user.id || user._id} user={mapUser(user)} onAction={onAction} />
        ))
      ) : (
        <Text style={styles.dateText}>No users found.</Text>
      )}
    </View>
  );
}
