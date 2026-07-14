import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { adminSidebarItems, adminUtilityItems } from "./adminData";
import { colors, styles } from "./adminTheme";

export default function AdminSidebar({
  activeTab,
  onClose,
  onGoHome,
  onSelectTab,
}) {
  return (
    <View style={styles.sidebarOverlay}>
      <TouchableOpacity
        style={styles.sidebarBackdrop}
        activeOpacity={1}
        onPress={onClose}
      />
      <View style={styles.sidebarPanel}>
        <View style={styles.sidebarTop}>
          <Text style={styles.sidebarEyebrow}>ADMIN MENU</Text>
          <TouchableOpacity style={styles.sidebarClose} onPress={onClose}>
            <Ionicons name="close" size={22} color={colors.ink} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.sidebarHomeButton}
          activeOpacity={0.82}
          onPress={onGoHome}
        >
          <MaterialCommunityIcons name="home" size={22} color="#fff" />
          <Text style={styles.sidebarHomeText}>Go Home</Text>
        </TouchableOpacity>

        <View style={styles.sidebarSection}>
          {adminSidebarItems.map((item) => {
            const selected = item.key === activeTab;

            return (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.sidebarItem,
                  selected && styles.sidebarItemActive,
                ]}
                activeOpacity={0.78}
                onPress={() => onSelectTab(item.key)}
              >
                <View
                  style={[
                    styles.sidebarItemIcon,
                    selected && styles.sidebarItemIconActive,
                  ]}
                >
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={20}
                    color={selected ? "#fff" : colors.tealDark}
                  />
                </View>
                <View style={styles.sidebarItemCopy}>
                  <Text style={styles.sidebarItemTitle}>{item.label}</Text>
                  <Text style={styles.sidebarItemDetail}>{item.detail}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.sidebarSection}>
          {adminUtilityItems.map((item) => (
            <SidebarStaticItem
              key={item.label}
              icon={item.icon}
              label={item.label}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

function SidebarStaticItem({ icon, label }) {
  return (
    <TouchableOpacity style={styles.sidebarStaticItem} activeOpacity={0.74}>
      <MaterialCommunityIcons name={icon} size={20} color="#536367" />
      <Text style={styles.sidebarStaticText}>{label}</Text>
    </TouchableOpacity>
  );
}
