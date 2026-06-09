import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { tabs } from "./adminData";
import { styles } from "./adminTheme";

export default function AdminBottomTabs({ activeTab, onChange }) {
  return (
    <View style={styles.bottomShell}>
      {tabs.map((tab) => {
        const active = tab.key === activeTab;

        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabButton, active && styles.tabButtonActive]}
            onPress={() => onChange(tab.key)}
            activeOpacity={0.75}
          >
            <MaterialCommunityIcons
              name={tab.icon}
              size={21}
              color={active ? "#fff" : "#24363b"}
            />
            <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
