import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ThemedView } from "../components/ThemedView";

const LISTINGS = [
  {
    id: "elysian-heights",
    title: "Elysian Heights Penthouse",
    location: "Gulshan 2, Dhaka",
    rent: "৳85,000",
    type: "3 BHK",
    status: "AVAILABLE",
    active: true,
    image: require("../../assets/images/gulshan.jpg"),
  },
  {
    id: "urban-oasis",
    title: "Urban Oasis Studio",
    location: "Banani Road 11, Dhaka",
    rent: "৳32,000",
    type: "Studio",
    status: "OCCUPIED",
    active: false,
    image: require("../../assets/images/banani.jpeg"),
  },
  {
    id: "dhanmondi-lakeview",
    title: "Dhanmondi Lakeview Loft",
    location: "Dhanmondi 12/A, Dhaka",
    rent: "৳45,000",
    type: "2 BHK",
    status: "AVAILABLE",
    active: true,
    image: require("../../assets/images/dhanmodi.jpg"),
  },
];

export default function OwnerDashboardScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="menu" size={24} color="#08232C" />
          </TouchableOpacity>
          <Text style={styles.brandText}>VaraLagbe</Text>
          <TouchableOpacity style={styles.avatar} onPress={() => router.push("/owner-profile")}>
            <MaterialCommunityIcons name="account-tie" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.eyebrow}>OWNER DASHBOARD</Text>
        <Text style={styles.title}>My Listings</Text>

        <TouchableOpacity style={styles.postButton} activeOpacity={0.88}>
          <MaterialCommunityIcons name="plus-circle" size={22} color="#FFFFFF" />
          <Text style={styles.postButtonText}>Post New Property</Text>
        </TouchableOpacity>

        <View style={styles.totalCard}>
          <Text style={styles.metricLabelDark}>Total Assets</Text>
          <Text style={styles.totalValue}>12</Text>
        </View>

        <View style={styles.revenueCard}>
          <View>
            <Text style={styles.metricLabelLight}>Monthly Revenue</Text>
            <Text style={styles.revenueValue}>৳142k</Text>
          </View>
          <MaterialCommunityIcons
            name="cash-multiple"
            size={62}
            color="rgba(0, 55, 70, 0.34)"
          />
        </View>

        <View style={styles.occupancyCard}>
          <Text style={styles.metricLabelDark}>Active Occupancy</Text>
          <Text style={styles.occupancyValue}>92%</Text>
        </View>

        {LISTINGS.map((listing) => (
          <View key={listing.id} style={styles.listingCard}>
            <View style={styles.imageWrap}>
              <Image source={listing.image} style={styles.listingImage} />
              <View
                style={[
                  styles.statusPill,
                  listing.active ? styles.availablePill : styles.occupiedPill,
                ]}
              >
                <Text style={styles.statusPillText}>{listing.status}</Text>
              </View>
            </View>

            <View style={styles.listingBody}>
              <Text style={styles.listingTitle}>{listing.title}</Text>
              <View style={styles.locationRow}>
                <MaterialCommunityIcons name="map-marker" size={13} color="#27343A" />
                <Text style={styles.locationText}>{listing.location}</Text>
              </View>

              <View style={styles.statusRow}>
                <Text style={styles.smallLabel}>STATUS</Text>
                <View style={styles.switchTrack}>
                  <View
                    style={[
                      styles.switchThumb,
                      listing.active ? styles.switchOn : styles.switchOff,
                    ]}
                  />
                </View>
              </View>

              <View style={styles.listingFooter}>
                <View style={styles.listingMeta}>
                  <View style={styles.detailBlock}>
                    <Text style={styles.smallLabel}>RENT</Text>
                    <Text style={styles.detailValue} numberOfLines={1}>
                      {listing.rent}
                    </Text>
                  </View>
                  <View style={styles.detailBlock}>
                    <Text style={styles.smallLabel}>TYPE</Text>
                    <Text style={styles.detailValue} numberOfLines={1}>
                      {listing.type}
                    </Text>
                  </View>
                </View>
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.actionButton}>
                    <MaterialCommunityIcons name="pencil" size={20} color="#17262C" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <MaterialCommunityIcons
                      name="trash-can-outline"
                      size={21}
                      color="#17262C"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <MaterialCommunityIcons name="view-dashboard" size={22} color="#FFFFFF" />
          <Text style={styles.navTextActive}>DASHBOARD</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="plus-circle" size={21} color="#233138" />
          <Text style={styles.navText}>ADD NEW</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="message" size={20} color="#233138" />
          <Text style={styles.navText}>MESSAGES</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/owner-profile")}>
          <MaterialCommunityIcons name="account" size={20} color="#233138" />
          <Text style={styles.navText}>PROFILE</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F4F8F9",
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 100,
  },
  topBar: {
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  iconButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  brandText: {
    flex: 1,
    fontSize: 16,
    fontStyle: "italic",
    fontWeight: "700",
    color: "#08232C",
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#0B5D72",
    borderWidth: 2,
    borderColor: "#08232C",
    alignItems: "center",
    justifyContent: "center",
  },
  eyebrow: {
    fontSize: 11,
    color: "#4B5B62",
    letterSpacing: 3,
    marginBottom: 7,
  },
  title: {
    fontSize: 29,
    fontWeight: "800",
    color: "#050D10",
    marginBottom: 18,
  },
  postButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#075B6B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    marginBottom: 42,
    shadowColor: "#032C35",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  postButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  totalCard: {
    minHeight: 122,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 26,
    justifyContent: "center",
    marginBottom: 28,
  },
  metricLabelDark: {
    fontSize: 14,
    color: "#20343B",
    marginBottom: 8,
  },
  metricLabelLight: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.68)",
    marginBottom: 8,
  },
  totalValue: {
    fontSize: 36,
    fontWeight: "800",
    color: "#005367",
  },
  revenueCard: {
    minHeight: 92,
    borderRadius: 14,
    backgroundColor: "#075B6B",
    paddingHorizontal: 26,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
    overflow: "hidden",
  },
  revenueValue: {
    fontSize: 32,
    fontWeight: "800",
    color: "#A6D2DB",
  },
  occupancyCard: {
    minHeight: 122,
    borderRadius: 15,
    backgroundColor: "#8AF0A0",
    paddingHorizontal: 26,
    justifyContent: "center",
    marginBottom: 50,
  },
  occupancyValue: {
    fontSize: 36,
    fontWeight: "900",
    color: "#075D31",
  },
  listingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 34,
  },
  imageWrap: {
    height: 214,
    backgroundColor: "#D9E5E8",
  },
  listingImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  statusPill: {
    position: "absolute",
    top: 18,
    left: 18,
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 5,
  },
  availablePill: {
    backgroundColor: "#A4F57F",
  },
  occupiedPill: {
    backgroundColor: "#E8EEF1",
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: "#0B1B20",
  },
  listingBody: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 22,
  },
  listingTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0A1114",
    marginBottom: 7,
    lineHeight: 26,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 21,
  },
  locationText: {
    fontSize: 13,
    color: "#3D4B51",
  },
  statusRow: {
    height: 42,
    borderRadius: 21,
    backgroundColor: "#EFF2F4",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  smallLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.3,
    color: "#1D2D33",
  },
  switchTrack: {
    width: 48,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#BAC5CA",
    marginLeft: 18,
    justifyContent: "center",
  },
  switchThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
  },
  switchOn: {
    alignSelf: "flex-end",
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#0A7A39",
  },
  switchOff: {
    alignSelf: "flex-start",
  },
  listingFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },
  listingMeta: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    gap: 18,
  },
  detailBlock: {
    flex: 1,
    minWidth: 0,
  },
  detailValue: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "800",
    color: "#0A1114",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
    flexShrink: 0,
  },
  actionButton: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#E9EEF1",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 70,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E4EAED",
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navItem: {
    minWidth: 62,
    height: 58,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  navItemActive: {
    minWidth: 104,
    backgroundColor: "#08667A",
  },
  navText: {
    marginTop: 4,
    fontSize: 9,
    color: "#18282F",
    fontWeight: "700",
  },
  navTextActive: {
    marginTop: 4,
    fontSize: 9,
    color: "#FFFFFF",
    fontWeight: "800",
  },
});
