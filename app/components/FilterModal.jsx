import React, { useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import Slider from "@react-native-community/slider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";
import { useColorScheme } from "../hooks/useColorScheme";

const PROPERTY_TYPES = ["Entire Flat", "Private Room", "Shared Seat", "Sublet"];

const AMENITIES = [
  { name: "High-speed Wi-Fi", icon: "wifi" },
  { name: "24/7 Security", icon: "shield-check" },
  { name: "Generator Backup", icon: "flash" },
  { name: "AC", icon: "snowflake" },
  { name: "Meal Facility", icon: "silverware-fork-knife" },
];

const LOCATIONS = [
  { name: "Dhanmondi", image: require("../../assets/images/dhanmodi.jpg") },
  { name: "Banani", image: require("../../assets/images/banani.jpeg") },
  { name: "Gulshan", image: require("../../assets/images/gulshan.jpg") },
  { name: "Uttara", image: require("../../assets/images/uttara.jpg") },
];

export default function FilterModal({
  visible,
  onClose,
  onApplyFilters,
  initialFilters = {},
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const isDark = colorScheme === "dark";

  const [priceRange, setPriceRange] = useState([
    initialFilters.minPrice || 1000,
    initialFilters.maxPrice || 100000,
  ]);
  const [selectedTypes, setSelectedTypes] = useState(
    initialFilters.propertyType || [],
  );
  const [selectedAmenities, setSelectedAmenities] = useState(
    initialFilters.amenities || [],
  );
  const [selectedLocations, setSelectedLocations] = useState(
    initialFilters.location || [],
  );

  const handlePriceChange = (value, index) => {
    const newRange = [...priceRange];
    newRange[index] = value;
    // Ensure min doesn't exceed max and max doesn't go below min
    if (index === 0 && value <= newRange[1]) {
      setPriceRange(newRange);
    } else if (index === 1 && value >= newRange[0]) {
      setPriceRange(newRange);
    }
  };

  const togglePropertyType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity],
    );
  };

  const toggleLocation = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((l) => l !== location)
        : [...prev, location],
    );
  };

  const handleResetAll = () => {
    setPriceRange([1000, 100000]);
    setSelectedTypes([]);
    setSelectedAmenities([]);
    setSelectedLocations([]);
  };

  const handleApplyFilters = () => {
    const filters = {
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      propertyType: selectedTypes.length > 0 ? selectedTypes : undefined,
      amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
      location: selectedLocations.length > 0 ? selectedLocations : undefined,
    };
    onApplyFilters(filters);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? colors.background : "#f8f8f8" },
        ]}
      >
        {/* Header */}
        <View
          style={[
            styles.header,
            { backgroundColor: isDark ? colors.cardBackground : "#fff" },
          ]}
        >
          <TouchableOpacity onPress={onClose}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={28}
              color={isDark ? "#fff" : "#333"}
            />
          </TouchableOpacity>
          <Text
            style={[styles.headerTitle, { color: isDark ? "#fff" : "#333" }]}
          >
            Filters
          </Text>
          <TouchableOpacity onPress={handleResetAll}>
            <MaterialCommunityIcons name="refresh" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Price Range Section */}
          <View
            style={[
              styles.section,
              { backgroundColor: isDark ? colors.cardBackground : "#fff" },
            ]}
          >
            <Text
              style={[styles.sectionTitle, { color: isDark ? "#fff" : "#333" }]}
            >
              Price Range
            </Text>
            <Text style={styles.priceText}>
              ৳{priceRange[0].toLocaleString()} - ৳
              {priceRange[1].toLocaleString()}+
            </Text>

            {/* Min Price Slider */}
            <View style={styles.sliderContainer}>
              <Text style={styles.priceLabel}>Minimum</Text>
              <Slider
                style={styles.slider}
                minimumValue={1000}
                maximumValue={100000}
                step={1000}
                value={priceRange[0]}
                onValueChange={(value) => handlePriceChange(value, 0)}
                minimumTrackTintColor="#007AFF"
                maximumTrackTintColor="#e0e0e0"
              />
              <Text style={styles.priceValue}>
                ৳{priceRange[0].toLocaleString()}
              </Text>
            </View>

            {/* Max Price Slider */}
            <View style={styles.sliderContainer}>
              <Text style={styles.priceLabel}>Maximum</Text>
              <Slider
                style={styles.slider}
                minimumValue={1000}
                maximumValue={100000}
                step={1000}
                value={priceRange[1]}
                onValueChange={(value) => handlePriceChange(value, 1)}
                minimumTrackTintColor="#007AFF"
                maximumTrackTintColor="#e0e0e0"
              />
              <Text style={styles.priceValue}>
                ৳{priceRange[1].toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Property Type Section */}
          <View
            style={[
              styles.section,
              { backgroundColor: isDark ? colors.cardBackground : "#fff" },
            ]}
          >
            <Text
              style={[styles.sectionTitle, { color: isDark ? "#fff" : "#333" }]}
            >
              Property Type
            </Text>
            <View style={styles.typeButtonsContainer}>
              {PROPERTY_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    selectedTypes.includes(type)
                      ? styles.typeButtonActive
                      : {
                          backgroundColor: isDark ? "#333" : "#e8e8e8",
                        },
                  ]}
                  onPress={() => togglePropertyType(type)}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      selectedTypes.includes(type)
                        ? styles.typeButtonTextActive
                        : { color: isDark ? "#fff" : "#666" },
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Amenities Section */}
          <View
            style={[
              styles.section,
              { backgroundColor: isDark ? colors.cardBackground : "#fff" },
            ]}
          >
            <Text
              style={[styles.sectionTitle, { color: isDark ? "#fff" : "#333" }]}
            >
              Amenities
            </Text>
            {AMENITIES.map((amenity) => (
              <TouchableOpacity
                key={amenity.name}
                style={styles.amenityRow}
                onPress={() => toggleAmenity(amenity.name)}
              >
                <View style={styles.amenityLeft}>
                  <MaterialCommunityIcons
                    name={amenity.icon}
                    size={20}
                    color={isDark ? "#fff" : "#666"}
                  />
                  <Text
                    style={[
                      styles.amenityText,
                      { color: isDark ? "#fff" : "#333" },
                    ]}
                  >
                    {amenity.name}
                  </Text>
                </View>
                <View
                  style={[
                    styles.checkbox,
                    selectedAmenities.includes(amenity.name)
                      ? styles.checkboxActive
                      : { borderColor: isDark ? "#555" : "#ddd" },
                  ]}
                >
                  {selectedAmenities.includes(amenity.name) && (
                    <MaterialCommunityIcons
                      name="check"
                      size={16}
                      color="#fff"
                    />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Location Section */}
          <View
            style={[
              styles.section,
              { backgroundColor: isDark ? colors.cardBackground : "#fff" },
            ]}
          >
            <Text
              style={[styles.sectionTitle, { color: isDark ? "#fff" : "#333" }]}
            >
              Location
            </Text>
            <View style={styles.locationGrid}>
              {LOCATIONS.map((location) => (
                <TouchableOpacity
                  key={location.name}
                  style={[
                    styles.locationCard,
                    selectedLocations.includes(location.name)
                      ? styles.locationCardActive
                      : {},
                  ]}
                  onPress={() => toggleLocation(location.name)}
                >
                  <Image source={location.image} style={styles.locationImage} />
                  {selectedLocations.includes(location.name) && (
                    <View style={styles.locationCheckIcon}>
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={28}
                        color="#fff"
                      />
                    </View>
                  )}
                  <Text style={styles.locationName}>{location.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Footer Buttons */}
        <View
          style={[
            styles.footer,
            { backgroundColor: isDark ? colors.cardBackground : "#fff" },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.resetButton,
              { backgroundColor: isDark ? "#333" : "#e8e8e8" },
            ]}
            onPress={handleResetAll}
          >
            <Text
              style={[
                styles.resetButtonText,
                { color: isDark ? "#fff" : "#333" },
              ]}
            >
              Reset All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApplyFilters}
          >
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
    paddingVertical: 12,
  },
  section: {
    marginHorizontal: 12,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  priceText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#007AFF",
    marginBottom: 16,
  },
  sliderContainer: {
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 8,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  priceValue: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  typeButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "transparent",
  },
  typeButtonActive: {
    backgroundColor: "#007AFF",
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  typeButtonTextActive: {
    color: "#fff",
  },
  amenityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  amenityLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  amenityText: {
    fontSize: 14,
    fontWeight: "500",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  locationGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  locationCard: {
    width: "48%",
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  locationCardActive: {
    borderWidth: 3,
    borderColor: "#007AFF",
  },
  locationImage: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
  },
  locationCheckIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 14,
  },
  locationName: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    color: "#fff",
    padding: 8,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  resetButton: {
    flex: 0.4,
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  applyButton: {
    flex: 0.6,
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
