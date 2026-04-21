import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { Colors } from "../constants/colors";
import { useColorScheme } from "../hooks/useColorScheme";

const API_BASE_URL = "http://localhost:5000";

const filters = [
  { id: "1", name: "Flats", icon: "home" },
  { id: "2", name: "Houses", icon: "home-outline" },
  { id: "3", name: "Villas", icon: "castle" },
  { id: "4", name: "Shops", icon: "shopping" },
];

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const isDark = colorScheme === "dark";
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/properties`);
      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }
      const data = await response.json();

      // Transform API data to component format
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
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <ThemedText style={styles.welcome}>Welcome</ThemedText>
            <ThemedText style={styles.userName} type="title">
              VaraLagbe
            </ThemedText>
          </View>
          <TouchableOpacity
            style={[styles.notificationIcon, { backgroundColor: colors.tint }]}
          >
            <MaterialCommunityIcons name="bell" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color={colors.border}
          />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search areas or property types..."
            placeholderTextColor="#666"
          />
          <TouchableOpacity
            style={[styles.filterBtn, { backgroundColor: colors.tint }]}
          >
            <MaterialCommunityIcons name="tune" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterButton,
                  filter.id === "1" && [
                    styles.filterButtonActive,
                    { backgroundColor: colors.tint },
                  ],
                ]}
              >
                <MaterialCommunityIcons
                  name={filter.icon}
                  size={16}
                  color={filter.id === "1" ? "#fff" : colors.tint}
                />
                <Text
                  style={[
                    styles.filterText,
                    filter.id === "1" && styles.filterTextActive,
                  ]}
                >
                  {filter.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recommended Section */}
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Recommended for you
          </ThemedText>
          <TouchableOpacity>
            <ThemedText style={[styles.seeAll, { color: colors.tint }]}>
              See all
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Property Cards */}
        <View style={styles.propertiesContainer}>
          {loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={colors.tint} />
            </View>
          ) : error ? (
            <View style={styles.centerContainer}>
              <ThemedText style={styles.errorText}>
                Error loading properties
              </ThemedText>
              <TouchableOpacity
                onPress={fetchProperties}
                style={[styles.retryButton, { backgroundColor: colors.tint }]}
              >
                <ThemedText style={{ color: "#fff" }}>Retry</ThemedText>
              </TouchableOpacity>
            </View>
          ) : properties.length > 0 ? (
            properties.map((property) => (
              <PropertyCard key={property.id} item={property} />
            ))
          ) : (
            <View style={styles.centerContainer}>
              <ThemedText>No properties found</ThemedText>
            </View>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  welcome: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
  },
  notificationIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
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
  filterSection: {
    marginBottom: 24,
  },
  filterScroll: {
    paddingHorizontal: 20,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  filterButtonActive: {
    borderColor: "transparent",
  },
  filterText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
  },
  filterTextActive: {
    color: "#fff",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  seeAll: {
    fontSize: 12,
    fontWeight: "600",
  },
  propertiesContainer: {
    paddingHorizontal: 20,
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
    centerContainer: {
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 40,
    },
    errorText: {
      fontSize: 14,
      marginBottom: 16,
      color: "#d32f2f",
    },
    retryButton: {
      paddingHorizontal: 24,
      paddingVertical: 10,
      borderRadius: 8,
      marginTop: 8,
    },
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
});
