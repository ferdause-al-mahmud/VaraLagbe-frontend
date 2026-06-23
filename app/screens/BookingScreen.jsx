import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { useColorScheme } from "../hooks/useColorScheme";
import { getAuthSession } from "../utils/authSession";

const API_BASE_URL = "http://localhost:5000";
const fallbackImage = require("../../assets/images/dhanmodi.jpg");

function formatDateRange(checkInDate, checkOutDate) {
  if (!checkInDate || !checkOutDate) return "Dates unavailable";

  const options = { month: "short", day: "numeric", year: "numeric" };
  const checkIn = new Date(checkInDate).toLocaleDateString("en-US", options);
  const checkOut = new Date(checkOutDate).toLocaleDateString("en-US", options);
  return `${checkIn} - ${checkOut}`;
}

function formatGuests(guests) {
  const adults = guests?.adults || 0;
  const children = guests?.children || 0;
  const adultLabel = `${adults} adult${adults === 1 ? "" : "s"}`;
  const childLabel = `${children} child${children === 1 ? "" : "ren"}`;
  return children > 0 ? `${adultLabel}, ${childLabel}` : adultLabel;
}

function getImageSource(uri) {
  return uri ? { uri } : fallbackImage;
}

export default function BookingScreen() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [booking, setBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBookings = useCallback(async () => {
    const session = getAuthSession();

    if (!bookingId && !session?.user) {
      router.replace("/login");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = bookingId
        ? `${API_BASE_URL}/api/bookings/${bookingId}`
        : `${API_BASE_URL}/api/bookings/user/${session.user._id || session.user.id}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load bookings.");
      }

      if (bookingId) {
        setBooking(data.data);
        setBookings([]);
      } else {
        setBookings(data.data || []);
        setBooking(null);
      }
    } catch (err) {
      setError(err.message || "Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  }, [bookingId, router]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const BookingCard = ({ item, compact = false }) => (
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
          source={getImageSource(item.propertyImage)}
          style={styles.propertyImage}
          resizeMode="cover"
        />
        <View style={styles.typeBadge}>
          <ThemedText style={styles.typeText}>
            {item.propertyType || "BOOKING"}
          </ThemedText>
        </View>
      </View>
      <View style={styles.propertyInfo}>
        <View style={styles.bookingTitleRow}>
          <ThemedText style={styles.propertyName}>
            {item.propertyTitle}
          </ThemedText>
          <View style={styles.statusPill}>
            <ThemedText style={styles.statusPillText}>
              {item.bookingStatus}
            </ThemedText>
          </View>
        </View>
        <ThemedText style={styles.metaText}>{item.bookingId}</ThemedText>
        <View style={styles.inlineMeta}>
          <MaterialCommunityIcons
            name="calendar"
            size={17}
            color={isDark ? "#4DB8C4" : "#007B8A"}
          />
          <ThemedText style={styles.infoValue}>
            {formatDateRange(item.checkInDate, item.checkOutDate)}
          </ThemedText>
        </View>
        <View style={styles.inlineMeta}>
          <MaterialCommunityIcons
            name="account-multiple"
            size={17}
            color={isDark ? "#4DB8C4" : "#007B8A"}
          />
          <ThemedText style={styles.infoValue}>{formatGuests(item.guests)}</ThemedText>
        </View>
        <View style={styles.cardFooterRow}>
          <ThemedText style={styles.hostText}>Host: {item.hostName}</ThemedText>
          <ThemedText style={styles.cardAmount}>
            {item.price?.currency || "BDT"} {item.price?.totalAmount?.toLocaleString() || 0}
          </ThemedText>
        </View>
        {compact && (
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => router.push(`/tabs/booking?bookingId=${item._id}`)}
          >
            <ThemedText style={styles.detailsButtonText}>View Details</ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderConfirmation = () => (
    <>
      <View style={styles.iconContainer}>
        <View style={styles.checkIconBg}>
          <MaterialCommunityIcons name="check" size={40} color="#fff" />
        </View>
      </View>

      <ThemedText style={styles.successMessage}>Booking Confirmed</ThemedText>
      <ThemedText
        style={[
          styles.successSubtext,
          {
            color: isDark ? "#9CA3AF" : "#4B5563",
          },
        ]}
      >
        Your reservation at {booking.propertyTitle} has been confirmed.
      </ThemedText>

      <BookingCard item={booking} />

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
          {booking.price?.currency || "BDT"} {booking.price?.totalAmount?.toLocaleString() || 0}
        </ThemedText>
        <View style={styles.securityInfo}>
          <MaterialCommunityIcons name="shield-check" size={16} color="#fff" />
          <ThemedText style={styles.securityText}>
            Securely processed via {booking.payment?.method || "Slotcommerz"}
          </ThemedText>
        </View>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => router.replace("/tabs/home")}
      >
        <ThemedText style={styles.primaryButtonText}>Back to Home</ThemedText>
      </TouchableOpacity>
    </>
  );

  const renderBookingList = () => (
    <>
      <ThemedText style={styles.pageTitle}>My Bookings</ThemedText>
      {bookings.length > 0 ? (
        bookings.map((item) => (
          <BookingCard key={item._id} item={item} compact />
        ))
      ) : (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name="calendar-search"
            size={48}
            color={isDark ? "#4DB8C4" : "#007B8A"}
          />
          <ThemedText style={styles.emptyTitle}>No bookings yet</ThemedText>
          <ThemedText style={styles.emptyText}>
            Confirm a property booking and it will appear here.
          </ThemedText>
        </View>
      )}
    </>
  );

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.header,
          {
            borderBottomColor: isDark ? "#374151" : "#E5E7EB",
          },
        ]}
      >
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <MaterialCommunityIcons
            name={bookingId ? "close" : "arrow-left"}
            size={24}
            color={isDark ? "#fff" : "#333"}
          />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>
          {bookingId ? "Booking Confirmed" : "Bookings"}
        </ThemedText>
        <TouchableOpacity style={styles.closeButton} onPress={loadBookings}>
          <MaterialCommunityIcons
            name="refresh"
            size={22}
            color={isDark ? "#fff" : "#333"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={isDark ? "#4DB8C4" : "#007B8A"} />
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
            <TouchableOpacity style={styles.primaryButton} onPress={loadBookings}>
              <ThemedText style={styles.primaryButtonText}>Retry</ThemedText>
            </TouchableOpacity>
          </View>
        ) : bookingId && booking ? (
          renderConfirmation()
        ) : (
          renderBookingList()
        )}
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
    width: 32,
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: 40,
  },
  centerContainer: {
    minHeight: 320,
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
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
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  successSubtext: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
  },
  propertyCard: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
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
  bookingTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  propertyName: {
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
  },
  statusPill: {
    backgroundColor: "#DCFCE7",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusPillText: {
    color: "#15803D",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  metaText: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
    marginBottom: 10,
  },
  inlineMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  cardFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginTop: 14,
  },
  hostText: {
    fontSize: 12,
    color: "#777",
    flex: 1,
  },
  cardAmount: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0D9488",
  },
  amountSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
  },
  amountLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(255,255,255,0.8)",
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 34,
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
  primaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0D9488",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  detailsButton: {
    marginTop: 14,
    paddingVertical: 11,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#0D9488",
  },
  detailsButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  emptyState: {
    minHeight: 320,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 14,
  },
  emptyText: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  errorText: {
    fontSize: 14,
    color: "#DC2626",
    textAlign: "center",
  },
});
