import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";

export default function SplashScreen() {
  const router = useRouter();
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate the progress bar
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start();

    // Navigate to login after 3 seconds
    const timer = setTimeout(() => {
      router.replace("login");
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["30%", "100%"],
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.splashText}>Splash Screen</Text>

      {/* Blue gradient background area */}
      <View style={styles.gradientBox} />

      {/* Center Content */}
      <View style={styles.centerContent}>
        {/* Logo Box with Image */}
        <View style={styles.logoBox}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logoImage}
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>VaraLagbe</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>Find Your Home, Easier.</Text>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Animated.View
            style={[styles.progressBar, { width: progressWidth }]}
          />
        </View>
      </View>

      {/* Bottom Content */}
      <View style={styles.bottomContent}>
        <View style={styles.verifiedBadge}>
          <Text style={styles.checkmark}>✓</Text>
          <Text style={styles.verifiedText}>VERIFIED LISTINGS ONLY</Text>
        </View>
        <Text style={styles.copyright}>© 2024 VaraLagbe Bangladesh</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F9FB",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  splashText: {
    fontSize: 12,
    color: "#C0C0C0",
    fontWeight: "400",
  },
  gradientBox: {
    position: "absolute",
    top: 60,
    right: -50,
    width: 50,
    height: 150,
    backgroundColor: "#E3F5FF",
    borderRadius: 100,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoBox: {
    width: 80,
    height: 80,
    backgroundColor: "#fff",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  logoImage: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },
  logoText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#007B8A",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
    fontWeight: "400",
  },
  progressContainer: {
    width: 200,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 20,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#007B8A",
    borderRadius: 2,
  },
  bottomContent: {
    alignItems: "center",
    gap: 8,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  checkmark: {
    fontSize: 10,
    color: "#007B8A",
    fontWeight: "bold",
  },
  verifiedText: {
    fontSize: 10,
    color: "#007B8A",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  copyright: {
    fontSize: 10,
    color: "#B0B0B0",
    fontWeight: "400",
  },
});
