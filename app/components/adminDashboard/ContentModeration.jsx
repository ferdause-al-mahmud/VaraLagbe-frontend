import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ListingCard } from "./AdminCards";
import { colors, styles } from "./adminTheme";

const filters = [
  { label: "All Items", value: "all" },
  { label: "Live", value: "live" },
  { label: "Flagged", value: "flagged" },
  { label: "Pending", value: "pending" },
];

export default function ContentModeration({ listings = [], activeFilter = "all", loading, onFilter, onSearch, onAction }) {
  return (
    <View>
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#46565b" />
          <TextInput
            placeholder="Search property or owner..."
            placeholderTextColor="#8b989c"
            style={styles.searchInput}
            onChangeText={onSearch}
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
        {filters.map((filter, index) => {
          const selected = activeFilter === filter.value;
          return (
            <TouchableOpacity
              key={filter.value}
              style={[
                styles.filterPill,
                selected && styles.filterPillActive,
                !selected && index === 1 && styles.filterPillLive,
                !selected && index === 2 && styles.filterPillFlagged,
              ]}
              activeOpacity={0.75}
              onPress={() => onFilter?.(filter.value)}
            >
              <Text
                style={[
                  styles.filterPillText,
                  selected && styles.filterPillTextActive,
                  !selected && index === 1 && styles.filterPillTextLive,
                  !selected && index === 2 && styles.filterPillTextFlagged,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {loading ? (
        <Text style={styles.dateText}>Loading listings...</Text>
      ) : listings.length ? (
        listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} onAction={onAction} />
        ))
      ) : (
        <Text style={styles.dateText}>No listings found.</Text>
      )}
    </View>
  );
}
