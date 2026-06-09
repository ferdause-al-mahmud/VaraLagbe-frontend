import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { listings } from "./adminData";
import { ListingCard } from "./AdminCards";
import { colors, styles } from "./adminTheme";

const filters = ["All Items", "Live (124)", "Flagged (8)", "Pending"];

export default function ContentModeration() {
  return (
    <View>
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#46565b" />
          <TextInput
            editable={false}
            placeholder="Search property or owner..."
            placeholderTextColor="#8b989c"
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity style={styles.filterButton} activeOpacity={0.75}>
          <Ionicons name="filter" size={22} color={colors.tealDark} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterPills}
      >
        {filters.map((filter, index) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterPill,
              index === 0 && styles.filterPillActive,
              index === 1 && styles.filterPillLive,
              index === 2 && styles.filterPillFlagged,
            ]}
            activeOpacity={0.75}
          >
            <Text
              style={[
                styles.filterPillText,
                index === 0 && styles.filterPillTextActive,
                index === 1 && styles.filterPillTextLive,
                index === 2 && styles.filterPillTextFlagged,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </View>
  );
}
