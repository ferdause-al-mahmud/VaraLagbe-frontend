import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Text,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { Colors } from "../constants/colors";
import { useColorScheme } from "../hooks/useColorScheme";
import FilterModal from "../components/FilterModal";

const API_BASE_URL = "http://localhost:5000";

export default function SearchScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const isDark = colorScheme === "dark";

  const [searchQuery, setSearchQuery] = useState("");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({});

  const fetchProperties = async (filters = {}) => {
    try {
      setLoading(true);
      // Build query parameters
      const queryParams = new URLSearchParams();

      if (searchQuery) queryParams.append("search", searchQuery);
      if (filters.minPrice) queryParams.append("minPrice", filters.minPrice);
      if (filters.maxPrice) queryParams.append("maxPrice", filters.maxPrice);
      if (filters.propertyType) {
        filters.propertyType.forEach((type) =>
          queryParams.append("propertyType", type),
        );
      }
      if (filters.amenities) {
        filters.amenities.forEach((amenity) =>
          queryParams.append("amenities", amenity),
        );
      }
      if (filters.location) {
        filters.location.forEach((location) =>
          queryParams.append("location", location),
        );
      }

      const url = `${API_BASE_URL}/api/properties/search/filter?${queryParams.toString()}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }
      const data = await response.json();

      // Transform API data
      const transformedData = data.data.map((property) => ({
        id: property._id || property.id,
        title: property.title,
        location: `${property.location.area}, ${property.location.city}`,
        price: property.price.monthly_rent.toLocaleString(),
        rating: property.rating?.toString() || "4.5",
        reviews: property.reviews?.toString() || "0",
        image: property.images?.[0]
          ? { uri: property.images[0] }
          : require("../../assets/images/home1.png"),
        status: property.availability,
        beds: property.specs?.bedrooms?.toString() || "N/A",
        baths: property.specs?.bathrooms?.toString() || "N/A",
      }));

      setProperties(transformedData);
    } catch (err) {
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (filters) => {
    setCurrentFilters(filters);
    fetchProperties(filters);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const PropertyCard = ({ item }) => (
    <TouchableOpacity
      onPress={() => router.push(`/property-details?propertyId=${item.id}`)}
      style={[
        styles.propertyCard,
        { backgroundColor: isDark ? colors.cardBackground : "#fff" },
      ]}
    >
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image
          source={item.image}
          style={styles.propertyImage}
          resizeMode="cover"
        />

        {/* Heart Icon */}
        <TouchableOpacity style={styles.heartIcon}>
          <MaterialCommunityIcons name="heart-outline" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Status Badge */}
        <View
          style={[
            styles.statusBadge,
            item.status === "Available Now"
              ? styles.availableBadge
              : styles.comingSoonBadge,
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      {/* Card Content */}
      <View style={styles.cardContent}>
        {/* Title and Rating */}
        <View style={styles.titleRow}>
          <ThemedText style={styles.propertyTitle} type="subtitle">
            {item.title}
          </ThemedText>
          <View style={styles.ratingContainer}>
            <MaterialCommunityIcons name="star" size={14} color="#FFC107" />
            <Text style={[styles.rating, { color: colors.text }]}>
              {item.rating}
            </Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.locationRow}>
          <MaterialCommunityIcons
            name="map-marker"
            size={14}
            color={colors.border}
          />
          <ThemedText style={styles.location}>{item.location}</ThemedText>
        </View>

        {/* Price and Details */}
        <View style={styles.priceDetailsRow}>
          <ThemedText style={[styles.price, { color: colors.tint }]}>
            ৳{item.price}
            <Text style={styles.priceUnit}>/month</Text>
          </ThemedText>
          <View style={styles.detailsRow}>
            <View style={styles.detail}>
              <MaterialCommunityIcons
                name="door"
                size={12}
                color={colors.border}
              />
              <Text style={[styles.detailText, { color: colors.text }]}>
                {item.beds}
              </Text>
            </View>
            <View style={styles.detail}>
              <MaterialCommunityIcons
                name="water"
                size={12}
                color={colors.border}
              />
              <Text style={[styles.detailText, { color: colors.text }]}>
                {item.baths}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          Search Properties
        </ThemedText>
      </View>

      {/* Search and Filter Bar */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons
          name="magnify"
          size={20}
          color={colors.border}
        />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search by area or keyword..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={handleSearch}
          onSubmitEditing={() => fetchProperties(currentFilters)}
        />
        <TouchableOpacity
          style={[styles.filterBtn, { backgroundColor: colors.tint }]}
          onPress={() => setFilterModalVisible(true)}
        >
          <MaterialCommunityIcons name="tune" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Results */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.tint} />
          </View>
        ) : properties.length > 0 ? (
          <View style={styles.propertiesContainer}>
            <ThemedText style={styles.resultCount}>
              {properties.length} properties found
            </ThemedText>
            {properties.map((property) => (
              <PropertyCard key={property.id} item={property} />
            ))}
          </View>
        ) : searchQuery ? (
          <View style={styles.centerContainer}>
            <MaterialCommunityIcons
              name="magnify"
              size={48}
              color={colors.border}
            />
            <ThemedText style={styles.noResultsText}>
              No properties found for &quot;{searchQuery}&quot;
            </ThemedText>
            <ThemedText style={styles.noResultsSubtext}>
              Try adjusting your search or filters
            </ThemedText>
          </View>
        ) : (
          <View style={styles.centerContainer}>
            <MaterialCommunityIcons
              name="magnify"
              size={48}
              color={colors.border}
            />
            <ThemedText style={styles.noResultsText}>
              Start Searching
            </ThemedText>
            <ThemedText style={styles.noResultsSubtext}>
              Search for properties or use filters
            </ThemedText>
          </View>
        )}
      </ScrollView>

      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApplyFilters={handleApplyFilters}
        initialFilters={currentFilters}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  propertiesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  resultCount: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 16,
    color: "#999",
  },
  propertyCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 180,
    backgroundColor: "#f0f0f0",
  },
  propertyImage: {
    width: "100%",
    height: "100%",
  },
  heartIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  statusBadge: {
    position: "absolute",
    bottom: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  availableBadge: {
    backgroundColor: "#4CAF50",
  },
  comingSoonBadge: {
    backgroundColor: "#FF9800",
  },
  statusText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  cardContent: {
    padding: 12,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  propertyTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
  },
  rating: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "600",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  location: {
    marginLeft: 6,
    fontSize: 12,
    color: "#999",
  },
  priceDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
  },
  priceUnit: {
    fontSize: 12,
    fontWeight: "400",
  },
  detailsRow: {
    flexDirection: "row",
    gap: 12,
  },
  detail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    fontWeight: "500",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
  },
});
