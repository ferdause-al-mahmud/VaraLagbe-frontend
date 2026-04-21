import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { Colors } from "../constants/colors";
import { useColorScheme } from "../hooks/useColorScheme";

const API_BASE_URL = "http://localhost:5000";
const { width } = Dimensions.get("window");

export default function PropertyDetailsScreen() {
  const router = useRouter();
  const { propertyId } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const isDark = colorScheme === "dark";

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchPropertyDetails();
  }, [propertyId]);

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/properties/${propertyId}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch property details");
      }
      const data = await response.json();
      setProperty(data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching property details:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.tint} />
        </View>
      </ThemedView>
    );
  }

  if (error || !property) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.centerContainer}>
          <ThemedText style={styles.errorText}>
            {error || "Property not found"}
          </ThemedText>
          <TouchableOpacity
            onPress={fetchPropertyDetails}
            style={[styles.retryButton, { backgroundColor: colors.tint }]}
          >
            <ThemedText style={{ color: "#fff" }}>Retry</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  const images =
    property.images && property.images.length > 0
      ? property.images
      : [require("../../assets/images/home1.png")];

  const onScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setActiveImageIndex(currentIndex);
  };

  const ImageGallery = () => (
    <View>
      <FlatList
        data={images}
        renderItem={({ item }) => (
          <Image
            source={typeof item === "string" ? { uri: item } : item}
            style={[styles.galleryImage, { width }]}
            resizeMode="cover"
          />
        )}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        onScroll={onScroll}
        showsHorizontalScrollIndicator={false}
      />
      {images.length > 1 && (
        <View style={styles.dotsContainer}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === activeImageIndex
                      ? colors.tint
                      : "rgba(255,255,255,0.5)",
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.galleryContainer}>
          <ImageGallery />

          {/* Header Icons */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.push("/tabs/home");
              }
            }}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <MaterialCommunityIcons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite ? "#FF5252" : "#fff"}
            />
          </TouchableOpacity>

          {/* Status Badge */}
          <View
            style={[
              styles.statusBadge,
              property.availability === "Available Now"
                ? styles.availableBadge
                : styles.comingSoonBadge,
            ]}
          >
            <Text style={styles.statusText}>{property.availability}</Text>
          </View>

          {/* Image Counter */}
          {images.length > 1 && (
            <View style={styles.imageCounter}>
              <Text style={styles.imageCountText}>
                {activeImageIndex + 1}/{images.length}
              </Text>
            </View>
          )}
        </View>

        {/* Property Info */}
        <View style={styles.contentContainer}>
          {/* Title and Price */}
          <View style={styles.titleSection}>
            <View style={styles.titleRow}>
              <ThemedText style={styles.title} type="title">
                {property.title}
              </ThemedText>
              {property.verified && (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={20}
                  color={colors.tint}
                />
              )}
            </View>

            <View style={styles.priceRow}>
              <ThemedText style={[styles.price, { color: colors.tint }]}>
                ৳{property.price.monthly_rent.toLocaleString()}
                <Text style={styles.priceUnit}>/month</Text>
              </ThemedText>
            </View>
          </View>

          {/* Location */}
          <View style={styles.section}>
            <View style={styles.locationContainer}>
              <MaterialCommunityIcons
                name="map-marker"
                size={18}
                color={colors.tint}
              />
              <View style={{ marginLeft: 10, flex: 1 }}>
                <ThemedText style={styles.sectionLabel}>Location</ThemedText>
                <ThemedText style={styles.sectionValue}>
                  {property.location.area}, {property.location.city}
                  {property.location.country
                    ? `, ${property.location.country}`
                    : ""}
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Rating */}
          {property.rating && (
            <View style={styles.section}>
              <View style={styles.ratingContainer}>
                <View style={styles.ratingStars}>
                  <MaterialCommunityIcons
                    name="star"
                    size={18}
                    color="#FFC107"
                  />
                  <ThemedText style={styles.ratingText}>
                    {property.rating.toFixed(1)}
                  </ThemedText>
                  <ThemedText style={styles.reviewsText}>
                    ({property.reviews} reviews)
                  </ThemedText>
                </View>
              </View>
            </View>
          )}

          {/* Specs */}
          {property.specs && (
            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Property Specs
              </ThemedText>
              <View style={styles.specsGrid}>
                {property.specs.bedrooms && (
                  <View style={styles.specCard}>
                    <MaterialCommunityIcons
                      name="door"
                      size={24}
                      color={colors.tint}
                    />
                    <ThemedText style={styles.specValue}>
                      {property.specs.bedrooms}
                    </ThemedText>
                    <ThemedText style={styles.specLabel}>Bedrooms</ThemedText>
                  </View>
                )}
                {property.specs.bathrooms && (
                  <View style={styles.specCard}>
                    <MaterialCommunityIcons
                      name="water"
                      size={24}
                      color={colors.tint}
                    />
                    <ThemedText style={styles.specValue}>
                      {property.specs.bathrooms}
                    </ThemedText>
                    <ThemedText style={styles.specLabel}>Bathrooms</ThemedText>
                  </View>
                )}
                {property.specs.area_sqft && (
                  <View style={styles.specCard}>
                    <MaterialCommunityIcons
                      name="ruler-square"
                      size={24}
                      color={colors.tint}
                    />
                    <ThemedText style={styles.specValue}>
                      {property.specs.area_sqft}
                    </ThemedText>
                    <ThemedText style={styles.specLabel}>Sq Ft</ThemedText>
                  </View>
                )}
                {property.specs.balconies && (
                  <View style={styles.specCard}>
                    <MaterialCommunityIcons
                      name="window-closed"
                      size={24}
                      color={colors.tint}
                    />
                    <ThemedText style={styles.specValue}>
                      {property.specs.balconies}
                    </ThemedText>
                    <ThemedText style={styles.specLabel}>Balconies</ThemedText>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Description */}
          {property.description && (
            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                About this property
              </ThemedText>
              <ThemedText style={styles.descriptionText}>
                {property.description}
              </ThemedText>
            </View>
          )}

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Premium Amenities
              </ThemedText>
              <View style={styles.amenitiesContainer}>
                {property.amenities.map((amenity, index) => (
                  <View key={index} style={styles.amenityItem}>
                    <View
                      style={[
                        styles.amenityIconContainer,
                        {
                          backgroundColor: isDark
                            ? "rgba(0,0,0,0.3)"
                            : "rgba(0,0,0,0.05)",
                        },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={24}
                        color={colors.tint}
                      />
                    </View>
                    <ThemedText style={styles.amenityItemText}>
                      {amenity}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Host Info */}
          {property.host && (
            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Host Information
              </ThemedText>
              <View
                style={[
                  styles.hostCard,
                  {
                    backgroundColor: isDark ? colors.cardBackground : "#f9f9f9",
                  },
                ]}
              >
                {property.host.avatar && (
                  <Image
                    source={{ uri: property.host.avatar }}
                    style={styles.hostAvatar}
                  />
                )}
                <View style={styles.hostInfo}>
                  <ThemedText type="subtitle" style={styles.hostName}>
                    {property.host.name}
                  </ThemedText>
                  {property.host.verified_host && (
                    <View style={styles.verifiedBadge}>
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={12}
                        color="#4CAF50"
                      />
                      <ThemedText style={styles.verifiedText}>
                        Verified Host
                      </ThemedText>
                    </View>
                  )}
                  <ThemedText style={styles.hostMeta}>
                    Response rate: {property.host.response_rate}%
                  </ThemedText>
                </View>
              </View>
            </View>
          )}

          {/* Contact Button */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[styles.contactButton, { backgroundColor: colors.tint }]}
            >
              <MaterialCommunityIcons name="phone" size={20} color="#fff" />
              <ThemedText style={styles.contactButtonText}>
                Contact Host
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.messageButton,
                {
                  borderColor: colors.tint,
                  backgroundColor: isDark ? colors.cardBackground : "#f9f9f9",
                },
              ]}
            >
              <MaterialCommunityIcons
                name="message"
                size={20}
                color={colors.tint}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  },
  galleryContainer: {
    position: "relative",
    width: "100%",
    height: 300,
  },
  galleryImage: {
    height: 300,
  },
  dotsContainer: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  backButton: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 44,
    height: 44,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 44,
    height: 44,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  statusBadge: {
    position: "absolute",
    bottom: 50,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 10,
  },
  availableBadge: {
    backgroundColor: "#4CAF50",
  },
  comingSoonBadge: {
    backgroundColor: "#FF9800",
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  imageCounter: {
    position: "absolute",
    bottom: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 8,
  },
  imageCountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  titleSection: {
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    flex: 1,
  },
  priceRow: {
    marginTop: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
  },
  priceUnit: {
    fontSize: 12,
    fontWeight: "400",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#999",
  },
  sectionValue: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingStars: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "700",
  },
  reviewsText: {
    fontSize: 12,
    color: "#999",
  },
  specsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  specCard: {
    width: "48%",
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "rgba(0,0,0,0.02)",
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  specValue: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 8,
  },
  specLabel: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#666",
  },
  amenitiesContainer: {
    flexDirection: "column",
    gap: 12,
  },
  amenityItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  amenityIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  amenityItemText: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  hostCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  hostAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  hostInfo: {
    flex: 1,
  },
  hostName: {
    fontSize: 14,
    fontWeight: "600",
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  verifiedText: {
    fontSize: 11,
    color: "#4CAF50",
    fontWeight: "600",
  },
  hostMeta: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  actionContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  contactButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  contactButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  messageButton: {
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 2,
  },
});
