import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { users } from "./adminData";
import { UserCard } from "./AdminCards";
import { colors, styles } from "./adminTheme";

export default function UserManagement() {
  return (
    <View>
      <View style={[styles.searchBox, styles.userSearch]}>
        <Ionicons name="search" size={18} color="#46565b" />
        <TextInput
          editable={false}
          placeholder="Search curated users..."
          placeholderTextColor="#8b989c"
          style={styles.searchInput}
        />
      </View>

      <View style={styles.reviewPanel}>
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewTitle}>Verification Queue</Text>
          <View style={styles.pendingPill}>
            <Text style={styles.pendingPillText}>8 PENDING</Text>
          </View>
        </View>
        <Text style={styles.reviewCopy}>
          High-priority NID verifications require editorial approval to maintain
          listing integrity.
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

      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </View>
  );
}
