import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { avatars } from "./adminData";
import { QueueItem } from "./AdminCards";
import { colors, styles } from "./adminTheme";

export default function DashboardOverview({ title }) {
  return (
    <View>
      <Text style={styles.dateText}>Monday, October 23</Text>
      <Text style={styles.pageTitle}>{title}</Text>

      <View style={styles.bigMetricCard}>
        <MaterialCommunityIcons
          name="office-building"
          size={23}
          color={colors.teal}
        />
        <Text style={styles.metricLabel}>Total Listings</Text>
        <Text style={styles.metricValue}>1,284</Text>
        <Text style={styles.growthText}>+12% from last month</Text>
      </View>

      <View style={styles.metricGrid}>
        <View style={styles.smallMetricCard}>
          <MaterialCommunityIcons
            name="account-multiple-outline"
            size={23}
            color={colors.teal}
          />
          <Text style={styles.metricLabel}>Active Users</Text>
          <Text style={styles.smallMetricValue}>8,432</Text>
        </View>
        <View style={[styles.smallMetricCard, styles.pendingCard]}>
          <MaterialCommunityIcons
            name="shield-check-outline"
            size={23}
            color={colors.ink}
          />
          <Text style={styles.metricLabel}>Pending NID</Text>
          <Text style={styles.smallMetricValue}>42</Text>
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
        <Text style={styles.revenueLabel}>Total Revenue (OCT)</Text>
        <Text style={styles.revenueValue}>{"\u09f3 842,500"}</Text>
        <View style={styles.chart}>
          {[34, 48, 58, 50, 68, 82, 91].map((height, index) => (
            <View
              key={height + index}
              style={[
                styles.chartBar,
                {
                  height,
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
      <QueueItem
        avatar={avatars.tanvir}
        name="Tanvir Ahmed"
        detail="Host Verification Requested"
      />
      <QueueItem
        avatar={avatars.maliha}
        name="Maliha Khan"
        detail="Listing #492 Review Pending"
      />
    </View>
  );
}
