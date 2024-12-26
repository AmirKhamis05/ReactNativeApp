import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";

export default function Navbar({ currentDashBoard }: any) {
  const router = useRouter();

  const onHomePress = () => {
    router.push("/");
  };

  const onProfilePress = () => {
    router.push("/(tabs)/profile");
  };

  const onSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/auth/signIn");
    } catch (error) {
      console.log("Issue with sign out", error);
    }
  };

  const dynamicNavStyle = {
    paddingTop: Platform.OS !== "web" ? StatusBar.currentHeight || 0 : 0,
    backgroundColor: "#222",
  };

  return (
    <View style={[styles.navContainer, dynamicNavStyle]}>
      {currentDashBoard === "main" && (
        <View style={styles.navbar}>
          {/* Website Name */}
          <TouchableOpacity onPress={onHomePress}>
            <Text style={styles.title}>Personal Blogs</Text>
          </TouchableOpacity>

          {/* Profile Option */}
          <TouchableOpacity onPress={onProfilePress}>
            <Text style={styles.profile}>Profile</Text>
          </TouchableOpacity>
        </View>
      )}

      {currentDashBoard === "profile" && (
        <View style={styles.navbar}>
          {/* Website Name */}
          <TouchableOpacity onPress={onHomePress}>
            <Text style={styles.title}>Personal Blogs</Text>
          </TouchableOpacity>

          {/* Profile Option */}
          <TouchableOpacity onPress={onSignOut}>
            <Text style={styles.profile}>Signout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  navContainer: {
    backgroundColor: "#fff", // White background for testing
    width: "100%", // Full-width navbar
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10, // Adjust padding as needed
    paddingHorizontal: 15,
    backgroundColor: "#222", // Dark navbar color
    height: 60, // Explicit height for navbar
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  title: {
    fontSize: 18,
    color: "#fff", // White text
    fontWeight: "bold",
  },
  profile: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e90ff", // Blue text for profile
  },
});
