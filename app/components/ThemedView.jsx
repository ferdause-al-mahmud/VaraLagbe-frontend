import { View } from "react-native";
import { Colors } from "../constants/colors";
import { useColorScheme } from "../hooks/useColorScheme";

export function ThemedView({ style, lightColor, darkColor, ...rest }) {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === "dark" ? darkColor : lightColor;

  const bg = backgroundColor || Colors[colorScheme ?? "light"].background;

  return <View {...rest} style={[{ backgroundColor: bg }, style]} />;
}
