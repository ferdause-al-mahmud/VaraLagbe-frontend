import { Text } from "react-native";
import { Colors } from "../constants/colors";
import { useColorScheme } from "../hooks/useColorScheme";

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}) {
  const colorScheme = useColorScheme();
  const color = colorScheme === "dark" ? darkColor : lightColor;

  const textColor = color || Colors[colorScheme ?? "light"].text;

  const fontSizeMap = {
    default: 16,
    title: 32,
    subtitle: 20,
    link: 16,
  };

  const fontWeightMap = {
    default: "400",
    title: "700",
    subtitle: "600",
    link: "600",
  };

  return (
    <Text
      {...rest}
      style={[
        {
          color: textColor,
          fontSize: fontSizeMap[type],
          fontWeight: fontWeightMap[type],
        },
        style,
      ]}
    />
  );
}
