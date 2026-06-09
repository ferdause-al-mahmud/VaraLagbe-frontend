import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { useColorScheme } from "../hooks/useColorScheme";
import { getAuthSession, setAuthSession } from "../utils/authSession";
import { showToast } from "../utils/toast";
const API_BASE_URL = "http://localhost:5000";

export default function UpdatePropertyScreen() {
  const router = useRouter();
  const { propertyId } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [loading, setLoading] = useState(false);
  const [isLoadingProperty, setIsLoadingProperty] = useState(true);
  const [validationErrors, setValidationErrors] = useState({});
  const [profile, setProfile] = useState(null);
  const [propertyData, setPropertyData] = useState({
    property_type: "",
    title: "",
    price: "",
    description: "",
    location: {
      area: "",
      city: "",
      country: "Bangladesh",
    },
    specs: {
      bedrooms: "",
      bathrooms: "",
      area_sqft: "",
      balconies: "",
    },
    amenities: [],
    images: [],
  });

  const loadProfile = useCallback(async () => {
    const session = getAuthSession();

    if (!session.token) {
      setIsLoadingProperty(false);
      showToast("Login Required", "Please log in to update properties.");
      router.replace("/login");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load profile.");
      }

      const user = data.data;

      // Check if user is an owner
      if (user.role !== "owner") {
        showToast(
          "Access Denied",
          "Only property owners can update listings.",
          "error",
        );
        router.replace("/tabs/home");
        return;
      }

      setProfile(user);
      setAuthSession({ token: session.token, user });
    } catch (error) {
      showToast(
        "Profile Error",
        error.message || "Could not load your profile.",
      );
    }
  }, [router]);

  const loadPropertyData = useCallback(async () => {
    const session = getAuthSession();

    if (!session.token) {
      setIsLoadingProperty(false);
      showToast("Error", "Authentication required");
      router.back();
      return;
    }

    if (!propertyId) {
      setIsLoadingProperty(false);
      showToast("Error", "Property ID not found");
      router.back();
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/properties/${propertyId}`,
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load property");
      }

      const property = data.data;

      // Pre-fill the form with existing property data
      setPropertyData({
        property_type: property.property_type || "",
        title: property.title || "",
        price: property.price?.monthly_rent?.toString() || "",
        description: property.description || "",
        location: {
          area: property.location?.area || "",
          city: property.location?.city || "",
          country: property.location?.country || "Bangladesh",
        },
        specs: {
          bedrooms: property.specs?.bedrooms?.toString() || "",
          bathrooms: property.specs?.bathrooms?.toString() || "",
          area_sqft: property.specs?.area_sqft?.toString() || "",
          balconies: property.specs?.balconies?.toString() || "",
        },
        amenities: property.amenities || [],
        images: property.images || [],
      });
    } catch (error) {
      console.error("Property load error:", error);
      showToast(
        "✗ Error",
        error.message || "Could not load property details",
        "error",
      );
      router.back();
    } finally {
      setIsLoadingProperty(false);
    }
  }, [propertyId, router]);

  useEffect(() => {
    loadProfile();
    loadPropertyData();
  }, [loadProfile, loadPropertyData]);

  if (isLoadingProperty) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0D9488" />
      </View>
    );
  }

  const commonAmenities = [
    "Wi-Fi",
    "Security",
    "Elevator",
    "Parking",
    "Gym",
    "Pool",
    "Balcony",
    "Garden",
  ];

  const handlePropertyTypeSelect = (type) => {
    setPropertyData({ ...propertyData, property_type: type });
  };

  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setPropertyData({
        ...propertyData,
        [parent]: {
          ...propertyData[parent],
          [child]: value,
        },
      });
    } else {
      setPropertyData({ ...propertyData, [field]: value });
    }
  };

  const toggleAmenity = (amenity) => {
    setPropertyData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handlePhotoUpload = async () => {
    Alert.alert(
      "Photo Update",
      "Photo updates are available on mobile app. You can submit with existing photos.",
    );
  };

  const handleSubmit = async () => {
    const errors = {};

    // Validation with error tracking
    if (!propertyData.property_type.trim()) {
      errors.property_type = "Please select a property type";
    }
    if (!propertyData.title.trim()) {
      errors.title = "Please enter a property title";
    }
    if (!propertyData.price.trim()) {
      errors.price = "Please enter a price";
    }
    if (!propertyData.location.area.trim()) {
      errors.area = "Please enter property location";
    }
    if (!propertyData.location.city.trim()) {
      errors.city = "Please enter city";
    }
    if (!propertyData.description.trim()) {
      errors.description = "Please add a description";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      const errorList = Object.values(errors).join("\n");
      showToast("Validation Error", errorList, "error");
      return;
    }

    setValidationErrors({});
    setLoading(true);

    try {
      const session = getAuthSession();

      if (!session?.token) {
        showToast(
          "Error",
          "Authentication token not found. Please log in again.",
          "error",
        );
        setLoading(false);
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      };

      const payload = {
        property_type: propertyData.property_type,
        title: propertyData.title,
        description: propertyData.description,
        location: propertyData.location,
        price: parseInt(propertyData.price) || 0,
        specs: {
          bedrooms: propertyData.specs.bedrooms
            ? parseInt(propertyData.specs.bedrooms)
            : undefined,
          bathrooms: propertyData.specs.bathrooms
            ? parseInt(propertyData.specs.bathrooms)
            : undefined,
          area_sqft: propertyData.specs.area_sqft
            ? parseInt(propertyData.specs.area_sqft)
            : undefined,
          balconies: propertyData.specs.balconies
            ? parseInt(propertyData.specs.balconies)
            : undefined,
        },
        amenities: propertyData.amenities,
        images: propertyData.images,
      };

      const response = await fetch(
        `${API_BASE_URL}/api/properties/${propertyId}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (data.success) {
        showToast("✓ Success", "Property updated successfully!", "success");

        // Navigate to property details after a short delay
        setTimeout(() => {
          router.push({
            pathname: "/property-details",
            params: { propertyId: propertyId },
          });
        }, 1500);
      } else {
        const errorMessage =
          data.message ||
          "Failed to update property. Please check your details and try again.";
        showToast("✗ Error", errorMessage, "error");
      }
    } catch (error) {
      console.error("Update error:", error);
      showToast(
        "✗ Error",
        error.message || "An error occurred. Please try again.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            borderBottomColor: isDark ? "#374151" : "#E5E7EB",
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={isDark ? "#fff" : "#333"}
          />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Update Property</ThemedText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Property Type */}
        <ThemedText style={styles.sectionTitle}>Property Type</ThemedText>
        {validationErrors.property_type && (
          <ThemedText style={styles.errorText}>
            {validationErrors.property_type}
          </ThemedText>
        )}

        <View style={styles.propertyTypeContainer}>
          {[
            { key: "flat", label: "Entire Flat", icon: "home" },
            { key: "room", label: "Private Room", icon: "door" },
            { key: "seat", label: "Shared Seat", icon: "chair-rolling" },
            { key: "sublet", label: "Sublet", icon: "office-building" },
          ].map((type) => (
            <TouchableOpacity
              key={type.key}
              style={[
                styles.propertyTypeButton,
                {
                  backgroundColor:
                    propertyData.property_type === type.label
                      ? "#0D9488"
                      : isDark
                        ? "#1F2937"
                        : "#F3F4F6",
                  borderColor:
                    propertyData.property_type === type.label
                      ? "#0D9488"
                      : isDark
                        ? "#374151"
                        : "#E5E7EB",
                },
              ]}
              onPress={() => handlePropertyTypeSelect(type.label)}
            >
              <MaterialCommunityIcons
                name={type.icon}
                size={24}
                color={
                  propertyData.property_type === type.label
                    ? "#fff"
                    : isDark
                      ? "#D1D5DB"
                      : "#6B7280"
                }
              />
              <ThemedText
                style={[
                  styles.propertyTypeLabel,
                  {
                    color:
                      propertyData.property_type === type.label
                        ? "#fff"
                        : isDark
                          ? "#D1D5DB"
                          : "#6B7280",
                  },
                ]}
              >
                {type.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Title */}
        <ThemedText style={styles.sectionTitle}>Title</ThemedText>
        {validationErrors.title && (
          <ThemedText style={styles.errorText}>
            {validationErrors.title}
          </ThemedText>
        )}
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark ? "#1F2937" : "#F3F4F6",
              color: isDark ? "#fff" : "#333",
              borderColor: isDark ? "#374151" : "#E5E7EB",
            },
          ]}
          placeholder="e.g. Spacious 3BHK in Dhanmondi"
          placeholderTextColor={isDark ? "#9CA3AF" : "#9CA3AF"}
          value={propertyData.title}
          onChangeText={(text) => handleInputChange("title", text)}
        />

        {/* Price */}
        <ThemedText style={styles.sectionTitle}>Price (BDT / Month)</ThemedText>
        {validationErrors.price && (
          <ThemedText style={styles.errorText}>
            {validationErrors.price}
          </ThemedText>
        )}
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark ? "#1F2937" : "#F3F4F6",
              color: isDark ? "#fff" : "#333",
              borderColor: isDark ? "#374151" : "#E5E7EB",
            },
          ]}
          placeholder="e.g. 50,000"
          placeholderTextColor={isDark ? "#9CA3AF" : "#9CA3AF"}
          keyboardType="numeric"
          value={propertyData.price}
          onChangeText={(text) => handleInputChange("price", text)}
        />

        {/* Specs */}
        <ThemedText style={styles.sectionTitle}>Property Specs</ThemedText>
        <View style={styles.specsRow}>
          <TextInput
            style={[
              styles.input,
              styles.specInput,
              {
                backgroundColor: isDark ? "#1F2937" : "#F3F4F6",
                color: isDark ? "#fff" : "#333",
                borderColor: isDark ? "#374151" : "#E5E7EB",
              },
            ]}
            placeholder="Bedrooms"
            placeholderTextColor={isDark ? "#9CA3AF" : "#9CA3AF"}
            keyboardType="numeric"
            value={propertyData.specs.bedrooms}
            onChangeText={(text) => handleInputChange("specs.bedrooms", text)}
          />
          <TextInput
            style={[
              styles.input,
              styles.specInput,
              {
                backgroundColor: isDark ? "#1F2937" : "#F3F4F6",
                color: isDark ? "#fff" : "#333",
                borderColor: isDark ? "#374151" : "#E5E7EB",
              },
            ]}
            placeholder="Bathrooms"
            placeholderTextColor={isDark ? "#9CA3AF" : "#9CA3AF"}
            keyboardType="numeric"
            value={propertyData.specs.bathrooms}
            onChangeText={(text) => handleInputChange("specs.bathrooms", text)}
          />
        </View>
        <View style={styles.specsRow}>
          <TextInput
            style={[
              styles.input,
              styles.specInput,
              {
                backgroundColor: isDark ? "#1F2937" : "#F3F4F6",
                color: isDark ? "#fff" : "#333",
                borderColor: isDark ? "#374151" : "#E5E7EB",
              },
            ]}
            placeholder="Area (sqft)"
            placeholderTextColor={isDark ? "#9CA3AF" : "#9CA3AF"}
            keyboardType="numeric"
            value={propertyData.specs.area_sqft}
            onChangeText={(text) => handleInputChange("specs.area_sqft", text)}
          />
          <TextInput
            style={[
              styles.input,
              styles.specInput,
              {
                backgroundColor: isDark ? "#1F2937" : "#F3F4F6",
                color: isDark ? "#fff" : "#333",
                borderColor: isDark ? "#374151" : "#E5E7EB",
              },
            ]}
            placeholder="Balconies"
            placeholderTextColor={isDark ? "#9CA3AF" : "#9CA3AF"}
            keyboardType="numeric"
            value={propertyData.specs.balconies}
            onChangeText={(text) => handleInputChange("specs.balconies", text)}
          />
        </View>

        {/* Amenities */}
        <ThemedText style={styles.sectionTitle}>Amenities</ThemedText>
        <View style={styles.amenitiesContainer}>
          {commonAmenities.map((amenity) => (
            <TouchableOpacity
              key={amenity}
              style={[
                styles.amenityButton,
                {
                  backgroundColor: propertyData.amenities.includes(amenity)
                    ? "#0D9488"
                    : isDark
                      ? "#1F2937"
                      : "#F3F4F6",
                  borderColor: propertyData.amenities.includes(amenity)
                    ? "#0D9488"
                    : isDark
                      ? "#374151"
                      : "#E5E7EB",
                },
              ]}
              onPress={() => toggleAmenity(amenity)}
            >
              <ThemedText
                style={[
                  styles.amenityText,
                  {
                    color: propertyData.amenities.includes(amenity)
                      ? "#fff"
                      : isDark
                        ? "#D1D5DB"
                        : "#6B7280",
                  },
                ]}
              >
                {amenity}
              </ThemedText>
              {propertyData.amenities.includes(amenity) && (
                <MaterialCommunityIcons
                  name="check"
                  size={16}
                  color="#fff"
                  style={{ marginLeft: 6 }}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Location */}
        <ThemedText style={styles.sectionTitle}>Location</ThemedText>
        {validationErrors.area && (
          <ThemedText style={styles.errorText}>
            {validationErrors.area}
          </ThemedText>
        )}
        <TextInput
          style={[
            styles.input,
            validationErrors.area && styles.inputError,
            {
              backgroundColor: isDark ? "#1F2937" : "#F3F4F6",
              color: isDark ? "#fff" : "#333",
              borderColor: validationErrors.area
                ? "#DC2626"
                : isDark
                  ? "#374151"
                  : "#E5E7EB",
            },
          ]}
          placeholder="Area/Street"
          placeholderTextColor={isDark ? "#9CA3AF" : "#9CA3AF"}
          value={propertyData.location.area}
          onChangeText={(text) => {
            handleInputChange("location.area", text);
            setValidationErrors({ ...validationErrors, area: "" });
          }}
        />

        {validationErrors.city && (
          <ThemedText style={styles.errorText}>
            {validationErrors.city}
          </ThemedText>
        )}
        <TextInput
          style={[
            styles.input,
            validationErrors.city && styles.inputError,
            {
              backgroundColor: isDark ? "#1F2937" : "#F3F4F6",
              color: isDark ? "#fff" : "#333",
              borderColor: validationErrors.city
                ? "#DC2626"
                : isDark
                  ? "#374151"
                  : "#E5E7EB",
            },
          ]}
          placeholder="City"
          placeholderTextColor={isDark ? "#9CA3AF" : "#9CA3AF"}
          value={propertyData.location.city}
          onChangeText={(text) => {
            handleInputChange("location.city", text);
            setValidationErrors({ ...validationErrors, city: "" });
          }}
        />

        {/* Photos */}
        <ThemedText style={styles.sectionTitle}>Property Photos</ThemedText>
        <TouchableOpacity
          style={[
            styles.photoUploadButton,
            {
              backgroundColor: isDark ? "#1F2937" : "#F3F4F6",
              borderColor: isDark ? "#374151" : "#E5E7EB",
            },
          ]}
          onPress={handlePhotoUpload}
        >
          <MaterialCommunityIcons
            name="camera-plus"
            size={32}
            color={isDark ? "#0D9488" : "#0D9488"}
          />
          <ThemedText style={styles.photoButtonText}>
            {propertyData.images.length > 0
              ? `${propertyData.images.length} photo${propertyData.images.length !== 1 ? "s" : ""} uploaded`
              : "No Photos"}
          </ThemedText>
          <ThemedText style={styles.photoSubText}>
            Photo updates available on mobile
          </ThemedText>
        </TouchableOpacity>

        {/* Description */}
        <ThemedText style={styles.sectionTitle}>Description</ThemedText>
        {validationErrors.description && (
          <ThemedText style={styles.errorText}>
            {validationErrors.description}
          </ThemedText>
        )}
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            {
              backgroundColor: isDark ? "#1F2937" : "#F3F4F6",
              color: isDark ? "#fff" : "#333",
              borderColor: isDark ? "#374151" : "#E5E7EB",
            },
          ]}
          placeholder="Tell potential tenants about the neighborhood, security and amenities..."
          placeholderTextColor={isDark ? "#9CA3AF" : "#9CA3AF"}
          multiline
          numberOfLines={4}
          value={propertyData.description}
          onChangeText={(text) => handleInputChange("description", text)}
        />
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.createButtonText}>
              Update Property
            </ThemedText>
          )}
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  backButton: {
    padding: 4,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 120,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 20,
  },
  propertyTypeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  propertyTypeButton: {
    flex: 1,
    minWidth: "48%",
    borderRadius: 12,
    borderWidth: 2,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  propertyTypeLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 8,
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 16,
  },
  textArea: {
    textAlignVertical: "top",
    minHeight: 100,
    paddingTop: 12,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  createButton: {
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#0D9488",
    alignItems: "center",
    justifyContent: "center",
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  photoUploadButton: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 12,
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    gap: 8,
  },
  photoButtonText: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
  photoSubText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
  specsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  specInput: {
    flex: 1,
    marginBottom: 0,
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  amenityButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  amenityText: {
    fontSize: 12,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 12,
    color: "#DC2626",
    marginBottom: 8,
    fontWeight: "500",
  },
  inputError: {
    borderColor: "#DC2626",
  },
});
