import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { useColorScheme } from "../hooks/useColorScheme";

export default function BookingScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Static booking data
  const bookingData = {
    id: "BK123456",
    property: {
      id: "P1",
      title: "Luxury 3BHK Apartment",
      image: require("../../assets/images/dhanmodi.jpg"),
      type: "PREMIUM STAY",
    },
    dates: {
      checkIn: "Oct 12 - Oct 15, 2023",
      guests: "4 Adults, 2 Children",
    },
    price: {
      amount: 45500,
      currency: "BDT",
      payment: "Securely processed via Slotcommerz",
    },
    host: {
      name: "Anisur Rahman",
      avatar: require("../../assets/images/banani.jpeg"),
      rating: 4.9,
      reviews: 128,
      verified: true,
    },
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
        <TouchableOpacity style={styles.closeButton}>
          <MaterialCommunityIcons
            name="close"
            size={24}
            color={isDark ? "#fff" : "#333"}
          />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Booking Confirmed</ThemedText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Confirmation Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.checkIconBg}>
            <MaterialCommunityIcons name="check" size={40} color="#fff" />
          </View>
        </View>

        {/* Success Message */}
        <ThemedText style={styles.successMessage}>
          You&apos;re all set!
        </ThemedText>
        <ThemedText
          style={[
            styles.successSubtext,
            {
              color: isDark ? "#9CA3AF" : "#4B5563",
            },
          ]}
        >
          Your reservation at the {bookingData.property.title} has been
          confirmed.
        </ThemedText>

        {/* Property Card */}
        <View
          style={[
            styles.propertyCard,
            {
              backgroundColor: isDark ? "#1F2937" : "#F3F4F6",
              borderColor: isDark ? "#374151" : "#E5E7EB",
            },
          ]}
        >
          <View style={styles.propertyImageContainer}>
            <Image
              source={bookingData.property.image}
              style={styles.propertyImage}
              resizeMode="cover"
            />
            <View style={styles.typeBadge}>
              <ThemedText style={styles.typeText}>
                {bookingData.property.type}
              </ThemedText>
            </View>
          </View>
          <View style={styles.propertyInfo}>
            <ThemedText style={styles.propertyName}>
              {bookingData.property.title}
            </ThemedText>
          </View>
        </View>

        {/* Reservation Info Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>RESERVATION INFO</ThemedText>

          <View
            style={[
              styles.infoRow,
              {
                borderBottomColor: isDark ? "#374151" : "#E5E7EB",
              },
            ]}
          >
            <View style={styles.infoItem}>
              <MaterialCommunityIcons
                name="calendar"
                size={20}
                color={isDark ? "#4DB8C4" : "#007B8A"}
              />
              <View style={styles.infoText}>
                <ThemedText
                  style={[
                    styles.infoLabel,
                    {
                      color: isDark ? "#9CA3AF" : "#6B7280",
                    },
                  ]}
                >
                  Dates
                </ThemedText>
                <ThemedText style={styles.infoValue}>
                  {bookingData.dates.checkIn}
                </ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons
                name="account-multiple"
                size={20}
                color={isDark ? "#4DB8C4" : "#007B8A"}
              />
              <View style={styles.infoText}>
                <ThemedText
                  style={[
                    styles.infoLabel,
                    {
                      color: isDark ? "#9CA3AF" : "#6B7280",
                    },
                  ]}
                >
                  Guests
                </ThemedText>
                <ThemedText style={styles.infoValue}>
                  {bookingData.dates.guests}
                </ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Amount Paid Section */}
        <View
          style={[
            styles.amountSection,
            {
              backgroundColor: isDark ? "#134E4A" : "#0D9488",
            },
          ]}
        >
          <ThemedText style={styles.amountLabel}>TOTAL AMOUNT PAID</ThemedText>
          <ThemedText style={styles.amountValue}>
            {bookingData.price.currency}{" "}
            {bookingData.price.amount.toLocaleString()}
          </ThemedText>
          <View style={styles.securityInfo}>
            <MaterialCommunityIcons
              name="shield-check"
              size={16}
              color="#fff"
            />
            <ThemedText style={styles.securityText}>
              {bookingData.price.payment}
            </ThemedText>
          </View>
        </View>

        {/* Host Section */}
        <View
          style={[
            styles.hostSection,
            {
              backgroundColor: isDark ? "#1F2937" : "#F3F4F6",
              borderColor: isDark ? "#374151" : "#E5E7EB",
            },
          ]}
        >
          <ThemedText style={styles.hostSectionTitle}>Booking Host</ThemedText>

          <View style={styles.hostInfo}>
            <Image source={bookingData.host.avatar} style={styles.hostAvatar} />
            <View style={styles.hostDetails}>
              <View style={styles.hostNameRow}>
                <ThemedText style={styles.hostName}>
                  {bookingData.host.name}
                </ThemedText>
                {bookingData.host.verified && (
                  <View style={styles.verifiedBadge}>
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={14}
                      color="#4CAF50"
                    />
                    <ThemedText style={styles.verifiedText}>
                      Verified
                    </ThemedText>
                  </View>
                )}
              </View>
              <View style={styles.ratingRow}>
                <MaterialCommunityIcons name="star" size={14} color="#FFD700" />
                <ThemedText style={styles.ratingText}>
                  {bookingData.host.rating} ({bookingData.host.reviews} reviews)
                </ThemedText>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.messageButton,
              {
                borderColor: isDark ? "#14B8A6" : "#0D9488",
              },
            ]}
          >
            <MaterialCommunityIcons
              name="message-outline"
              size={18}
              color={isDark ? "#4DB8C4" : "#007B8A"}
            />
            <ThemedText
              style={[
                styles.messageButtonText,
                {
                  color: isDark ? "#4DB8C4" : "#007B8A",
                },
              ]}
            >
              Message Host
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              {
                backgroundColor: isDark ? "#0D9488" : "#0D9488",
              },
            ]}
          >
            <ThemedText style={styles.primaryButtonText}>
              View Booking Details
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.secondaryButton,
              {
                borderColor: isDark ? "#374151" : "#D1D5DB",
              },
            ]}
          >
            <MaterialCommunityIcons
              name="download"
              size={18}
              color={isDark ? "#fff" : "#333"}
            />
            <ThemedText style={styles.secondaryButtonText}>
              Download Receipt
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  closeButton: {
    padding: 4,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  checkIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#22C55E",
    justifyContent: "center",
    alignItems: "center",
  },
  successMessage: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  successSubtext: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  propertyCard: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
    borderWidth: 1,
  },
  propertyImageContainer: {
    position: "relative",
    width: "100%",
    height: 144,
  },
  propertyImage: {
    width: "100%",
    height: "100%",
  },
  typeBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "#F97316",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  typeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  propertyInfo: {
    padding: 12,
  },
  propertyName: {
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#9CA3AF",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  amountSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: "center",
  },
  amountLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(255,255,255,0.8)",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 36,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  securityInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  securityText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
    marginLeft: 6,
  },
  hostSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
  },
  hostSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 16,
  },
  hostInfo: {
    flexDirection: "row",
    marginBottom: 16,
  },
  hostAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  hostDetails: {
    flex: 1,
    justifyContent: "center",
  },
  hostNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  hostName: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#4CAF50",
    marginLeft: 2,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  messageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
  },
  messageButtonText: {
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
  },
  buttonsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  primaryButton: {
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    flexDirection: "row",
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 6,
  },
});
