import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ThemedView } from "../components/ThemedView";
import {
  clearAuthSession,
  getAuthSession,
  setAuthSession,
} from "../utils/authSession";

const API_BASE_URL = "http://localhost:5000";

const REVIEWS = [
  {
    id: "farhana",
    name: "Farhana Yasmin",
    property: "TENANT AT GULSHAN LAKEVIEW",
    quote:
      "Anwar bhai is an exceptional landlord. Very responsive to maintenance requests and maintained the property perfectly. Highly recommend his listings for peace of mind.",
    icon: "face-woman",
    color: "#116B5B",
  },
  {
    id: "imtiaz",
    name: "Imtiaz Ahmed",
    property: "TENANT AT BANANI HEIGHTS",
    quote:
      "Professional and transparent. The rental process was smooth without any hidden costs. Very helpful with local neighborhood insights as well.",
    icon: "face-man",
    color: "#7B4A22",
  },
];

function getOwnerName(user) {
  return user?.fullName?.trim() || user?.name?.trim() || "Owner";
}

function getInitials(name) {
  if (!name) return "O";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function getMemberSince(user) {
  const joinedDate = user?.createdAt || user?.created_at || user?.joinedAt;

  if (!joinedDate) {
    return "Member since February 2021";
  }

  const date = new Date(joinedDate);

  if (Number.isNaN(date.getTime())) {
    return "Member since February 2021";
  }

  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][date.getMonth()];

  return `Member since ${month} ${date.getFullYear()}`;
}

function getPropertyCount(user) {
  if (Array.isArray(user?.properties)) return user.properties.length;
  if (Array.isArray(user?.listings)) return user.listings.length;
  if (typeof user?.propertyCount === "number") return user.propertyCount;
  if (typeof user?.totalProperties === "number") return user.totalProperties;

  return 12;
}

function getOwnerRating(user) {
  const rating = user?.rating || user?.averageRating || user?.ownerRating;

  if (typeof rating === "number") {
    return `${rating.toFixed(1)}/5`;
  }

  return rating || "4.9/5";
}

function getVerificationStatus(user) {
  if (user?.nidVerified || user?.verificationStatus === "authenticated") {
    return "Status: Authenticated";
  }

  return user?.verificationStatus
    ? `Status: ${user.verificationStatus}`
    : "Status: Authenticated";
}

export default function OwnerProfileScreen() {
  const router = useRouter();
  const [owner, setOwner] = useState(() => getAuthSession().user);
  const ownerName = getOwnerName(owner);
  const ownerInitials = getInitials(ownerName);
  const memberSince = getMemberSince(owner);
  const propertyCount = getPropertyCount(owner);
  const ownerRating = getOwnerRating(owner);
  const verificationStatus = getVerificationStatus(owner);

  const loadOwnerProfile = useCallback(async () => {
    const session = getAuthSession();

    if (!session.token) {
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
        throw new Error(data.message || "Failed to load owner profile.");
      }

      const user = data.data;

      if (user?.role !== "owner") {
        setAuthSession({ token: session.token, user });
        router.replace("/tabs/profile");
        return;
      }

      setOwner(user);
      setAuthSession({ token: session.token, user });
    } catch (_error) {
      setOwner(session.user);
    }
  }, [router]);

  useFocusEffect(
    useCallback(() => {
      loadOwnerProfile();
    }, [loadOwnerProfile]),
  );

  const handleSignOut = () => {
    clearAuthSession();
    router.replace("/login");
  };

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.menuButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="menu" size={27} color="#062D43" />
          </TouchableOpacity>
          <Text style={styles.brand}>VaraLagbe</Text>
          <View style={styles.topAvatar}>
            <MaterialCommunityIcons name="account-tie" size={31} color="#11181C" />
          </View>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.verifiedPill}>
            <MaterialCommunityIcons name="shield-check" size={14} color="#3B240B" />
            <Text style={styles.verifiedText}>VERIFIED OWNER</Text>
          </View>

          <View style={styles.ownerAvatarRing}>
            <View style={styles.ownerAvatar}>
              <Text style={styles.ownerAvatarText}>{ownerInitials}</Text>
            </View>
          </View>

          <Text style={styles.ownerName}>{ownerName}</Text>
          <Text style={styles.memberText}>{memberSince}</Text>

          <View style={styles.metricRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>PROPERTIES</Text>
              <Text style={styles.metricValue}>{propertyCount}</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>RATING</Text>
              <Text style={styles.metricValue}>{ownerRating}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Account & Security</Text>
        <View style={styles.securityCard}>
          <TouchableOpacity style={styles.securityRow} activeOpacity={0.86}>
            <View style={styles.securityIcon}>
              <MaterialCommunityIcons name="card-account-details" size={23} color="#063F52" />
            </View>
            <View style={styles.securityCopy}>
              <Text style={styles.securityTitle}>NID Verification</Text>
              <Text style={styles.securityStatus}>{verificationStatus}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={28} color="#B9C4CB" />
          </TouchableOpacity>

          <View style={styles.securityDivider} />

          <View style={styles.securityRow}>
            <View style={styles.securityIcon}>
              <MaterialCommunityIcons name="lock-clock" size={23} color="#063F52" />
            </View>
            <View style={styles.securityCopy}>
              <Text style={styles.securityTitle}>Security</Text>
              <Text style={styles.securitySubtext}>Update password or 2FA</Text>
            </View>
            <TouchableOpacity activeOpacity={0.82}>
              <Text style={styles.resetText}>Reset Password</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.reviewsHeader}>
          <Text style={styles.sectionTitle}>My Reviews</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>VIEW ALL</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.reviewsList}>
          {REVIEWS.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewUserRow}>
                <View style={[styles.reviewAvatar, { backgroundColor: review.color }]}>
                  <MaterialCommunityIcons name={review.icon} size={35} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={styles.reviewName}>{review.name}</Text>
                  <Text style={styles.reviewProperty}>{review.property}</Text>
                </View>
              </View>

              <View style={styles.starRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <MaterialCommunityIcons
                    key={star}
                    name="star"
                    size={16}
                    color="#5B340B"
                  />
                ))}
              </View>

              <Text style={styles.reviewQuote}>
                <Text>&quot;</Text>
                {review.quote}
                <Text>&quot;</Text>
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.signOutButton}
          activeOpacity={0.86}
          onPress={handleSignOut}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/dashboard")}>
          <MaterialCommunityIcons name="view-dashboard" size={23} color="#1F2D33" />
          <Text style={styles.navText}>DASHBOARD</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="plus-circle" size={24} color="#1F2D33" />
          <Text style={styles.navText}>ADD NEW</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="message" size={24} color="#1F2D33" />
          <Text style={styles.navText}>MESSAGES</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navActive]}>
          <MaterialCommunityIcons name="account" size={24} color="#FFFFFF" />
          <Text style={styles.navTextActive}>PROFILE</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5FAFC",
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 118,
  },
  topBar: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 42,
  },
  menuButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  brand: {
    flex: 1,
    textAlign: "center",
    fontSize: 19,
    fontWeight: "800",
    fontStyle: "italic",
    color: "#063F52",
  },
  topAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: "#071015",
    backgroundColor: "#F1A987",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  profileCard: {
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 27,
    alignItems: "center",
    marginBottom: 42,
    shadowColor: "#0D2730",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  verifiedPill: {
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFD7AD",
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    alignSelf: "flex-end",
    marginBottom: 14,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.2,
    color: "#3B240B",
  },
  ownerAvatarRing: {
    width: 106,
    height: 106,
    borderRadius: 53,
    borderWidth: 4,
    borderColor: "#00704A",
    padding: 5,
    marginBottom: 24,
  },
  ownerAvatar: {
    flex: 1,
    borderRadius: 48,
    backgroundColor: "#1D313B",
    alignItems: "center",
    justifyContent: "center",
  },
  ownerAvatarText: {
    color: "#FFFFFF",
    fontSize: 33,
    fontWeight: "900",
  },
  ownerName: {
    fontSize: 29,
    lineHeight: 36,
    fontWeight: "900",
    color: "#070B0F",
    textAlign: "center",
  },
  memberText: {
    fontSize: 16,
    color: "#252C34",
    marginTop: 4,
    marginBottom: 27,
  },
  metricRow: {
    width: "100%",
    flexDirection: "row",
    gap: 18,
  },
  metricCard: {
    flex: 1,
    minHeight: 75,
    borderRadius: 11,
    backgroundColor: "#F0F2F3",
    alignItems: "center",
    justifyContent: "center",
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2,
    color: "#202930",
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#063F52",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#070B0F",
  },
  securityCard: {
    borderRadius: 18,
    backgroundColor: "#F0F4F6",
    overflow: "hidden",
    marginTop: 18,
    marginBottom: 44,
  },
  securityRow: {
    minHeight: 80,
    paddingHorizontal: 27,
    flexDirection: "row",
    alignItems: "center",
  },
  securityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
  },
  securityCopy: {
    flex: 1,
    minWidth: 0,
  },
  securityTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0A1115",
  },
  securityStatus: {
    marginTop: 2,
    fontSize: 14,
    color: "#007A36",
  },
  securitySubtext: {
    marginTop: 2,
    fontSize: 14,
    color: "#1D252B",
  },
  securityDivider: {
    height: 1,
    backgroundColor: "#E5EBEE",
  },
  resetText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#063F52",
    borderBottomWidth: 1,
    borderBottomColor: "#063F52",
    paddingBottom: 2,
  },
  reviewsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 27,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 2,
    color: "#063F52",
  },
  reviewsList: {
    gap: 26,
    marginBottom: 51,
  },
  reviewCard: {
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 28,
    paddingVertical: 34,
  },
  reviewUserRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 26,
  },
  reviewAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    overflow: "hidden",
  },
  reviewName: {
    fontSize: 17,
    fontWeight: "800",
    color: "#11171B",
  },
  reviewProperty: {
    marginTop: 3,
    fontSize: 11,
    color: "#4C5359",
  },
  starRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 24,
  },
  reviewQuote: {
    fontSize: 16,
    lineHeight: 27,
    fontStyle: "italic",
    color: "#151B1E",
  },
  signOutButton: {
    height: 64,
    borderRadius: 15,
    backgroundColor: "#FFD0CC",
    alignItems: "center",
    justifyContent: "center",
  },
  signOutText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#B40000",
  },
  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 85,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 22,
    paddingTop: 8,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    shadowColor: "#0D2730",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
  },
  navItem: {
    minWidth: 66,
    height: 65,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  navActive: {
    minWidth: 83,
    backgroundColor: "#086A7D",
  },
  navText: {
    marginTop: 5,
    fontSize: 10,
    fontWeight: "800",
    color: "#1E2B31",
  },
  navTextActive: {
    marginTop: 5,
    fontSize: 10,
    fontWeight: "900",
    color: "#FFFFFF",
  },
});
