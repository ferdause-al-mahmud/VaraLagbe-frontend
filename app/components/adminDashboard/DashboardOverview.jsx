import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { QueueItem } from "./AdminCards";
import { colors, styles } from "./adminTheme";

function formatNumber(value) {
  return Number(value || 0).toLocaleString();
}

function formatMoney(value) {
  return `BDT ${Number(value || 0).toLocaleString()}`;
}

export default function DashboardOverview({ title, analytics = {}, loading }) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const revenueBars = analytics.monthlyRevenue?.length
    ? analytics.monthlyRevenue
    : Array.from({ length: 7 }, (_, index) => ({ label: index, value: 0 }));
  const maxRevenue = Math.max(...revenueBars.map((item) => item.value || 0), 1);

  return (
    <View>
      <Text style={styles.dateText}>{today}</Text>
      <Text style={styles.pageTitle}>{loading ? "Loading dashboard..." : title}</Text>

      <View style={styles.bigMetricCard}>
        <MaterialCommunityIcons
          name="office-building"
          size={23}
          color={colors.teal}
        />
        <Text style={styles.metricLabel}>Total Listings</Text>
        <Text style={styles.metricValue}>{formatNumber(analytics.totalListings)}</Text>
        <Text style={styles.growthText}>
          {formatNumber(analytics.pendingListings)} pending, {formatNumber(analytics.flaggedListings)} flagged
        </Text>
      </View>

      <View style={styles.metricGrid}>
        <View style={styles.smallMetricCard}>
          <MaterialCommunityIcons
            name="account-multiple-outline"
            size={23}
            color={colors.teal}
          />
          <Text style={styles.metricLabel}>Active Users</Text>
          <Text style={styles.smallMetricValue}>{formatNumber(analytics.activeUsers)}</Text>
        </View>
        <View style={[styles.smallMetricCard, styles.pendingCard]}>
          <MaterialCommunityIcons
            name="shield-check-outline"
            size={23}
            color={colors.ink}
          />
          <Text style={styles.metricLabel}>Pending NID</Text>
          <Text style={styles.smallMetricValue}>{formatNumber(analytics.pendingNid)}</Text>
        </View>
      </View>

      <View style={styles.sectionHeadingRow}>
        <Text style={styles.sectionTitle}>Revenue Growth</Text>
        <TouchableOpacity style={styles.periodChip} activeOpacity={0.75}>
          <Text style={styles.periodText}>Monthly</Text>
          <Ionicons name="chevron-down" size={12} color={colors.muted} />
        </TouchableOpacity>
      </View>

      <View style={styles.revenueCard}>
        <Text style={styles.revenueLabel}>Total Revenue</Text>
        <Text style={styles.revenueValue}>{formatMoney(analytics.totalRevenue)}</Text>
        <View style={styles.chart}>
          {revenueBars.map((item, index) => (
            <View
              key={`${item.label}-${index}`}
              style={[
                styles.chartBar,
                {
                  height: 18 + Math.round(((item.value || 0) / maxRevenue) * 74),
                  opacity: 0.36 + index * 0.09,
                },
              ]}
            />
          ))}
        </View>
      </View>

      <Text style={[styles.sectionTitle, styles.queueTitle]}>
        Verification Queue
      </Text>
      {analytics.verificationQueue?.length ? (
        analytics.verificationQueue.map((item) => (
          <QueueItem
            key={`${item.type}-${item.id}`}
            avatar={item.avatar}
            name={item.name}
            detail={item.detail}
          />
        ))
      ) : (
        <Text style={styles.dateText}>No pending verification items.</Text>
      )}
    </View>
  );
}
