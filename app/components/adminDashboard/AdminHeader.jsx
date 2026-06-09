import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { avatars } from "./adminData";
import { colors, styles } from "./adminTheme";

export default function AdminHeader({ onMenuPress }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.iconButton}
        activeOpacity={0.7}
        onPress={onMenuPress}
      >
        <Ionicons name="menu" size={24} color={colors.tealDark} />
      </TouchableOpacity>
      <Text style={styles.brand}>Admin Curator</Text>
      <View style={styles.headerSpacer} />
      <Image source={{ uri: avatars.admin }} style={styles.adminAvatar} />
    </View>
  );
}
