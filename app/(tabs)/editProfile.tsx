import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { database, auth } from "../firebase/firebase";
import { ref, get, update } from "firebase/database";
import { useRouter } from "expo-router";

export default function EditProfile() {
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [isPending, setIsPending] = useState(false);
  const userId = auth.currentUser?.uid;
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) {
        router.push("/auth/signIn");
        return;
      }

      try {
        const snapshot = await get(ref(database, `users/${userId}`));
        if (snapshot.exists()) {
          const data = snapshot.val();
          setUsername(data.Username);
          setDescription(data.Description);
        } else {
          Alert.alert("Profile Error", "No user data found.");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        Alert.alert("Error", "Failed to load profile data.");
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleUpdateProfile = async () => {
    if (!username.trim() || !description.trim()) {
      Alert.alert(
        "Validation Error",
        "Username and Description cannot be empty."
      );
      return;
    }

    setIsPending(true);

    try {
      await update(ref(database, `users/${userId}`), {
        Username: username,
        Description: description,
      });

      Alert.alert("Success", "Profile updated successfully!");
      router.replace("/(tabs)/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <Text style={styles.label}>Username:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        value={username}
        onChangeText={setUsername}
      />

      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Enter your description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {isPending ? (
        <ActivityIndicator size="large" color="#6f42c1" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#6f42c1",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
