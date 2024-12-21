import React from "react";
import { View, StyleSheet, Pressable, Text, Platform } from "react-native";

const AppButton = ({ onPress, title }) => (
  <View style={styles.buttonContainer}>
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: pressed ? "lightyellow" : "#f1356d" }, // Change background color on press
      ]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  buttonContainer: {
    width: Platform.OS === "web" ? "auto" : "100%", // Full width on mobile, auto on web
    alignItems: Platform.OS === "web" ? "center" : "flex-start", // Center on web, left-aligned on mobile
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  button: {
    width: "100%", // Full width for the button itself
    padding: 12,
    borderWidth: 1,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});

export default AppButton;
