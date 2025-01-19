import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";
import { database, auth } from "../firebase/firebase";
import { ref, set, get, query, orderByChild, equalTo } from "firebase/database";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const handleSignUp = async () => {
    if (
      !username.trim() ||
      !email.trim() ||
      !password.trim() ||
      !description.trim()
    ) {
      if (Platform.OS === "web") {
        window.alert("Missing Information, Please fill out all fields.");
      } else {
        Alert.alert("Missing Information", "Please fill out all fields.");
      }
      return;
    }

    try {
      const usernameQuery = query(
        ref(database, "users"),
        orderByChild("Username"),
        equalTo(username)
      );

      const snapshot = await get(usernameQuery);
      if (snapshot.exists()) {
        if (Platform.OS === "web") {
          window.alert("Username is already taken. Please choose another.");
        } else {
          Alert.alert("Invalid Username", "Username is already taken.");
        }
        return;
      }

      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredentials.user;
      const uid = user.uid;

      await set(ref(database, "users/" + uid), {
        Username: username,
        Email: email,
        Description: description,
      });

      router.replace("/");
    } catch (error: any) {
      if (Platform.OS === "web") {
        window.alert("Sign Up Failed " + error.message);
      } else {
        Alert.alert("Sign Up Failed", error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#aaa"
        onChangeText={setUsername}
        value={username}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Description"
        placeholderTextColor="#aaa"
        onChangeText={setDescription}
        value={description}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/auth/signIn")}>
        <Text style={styles.link}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1c1c1e",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    color: "#fff",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#28a745",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  link: {
    color: "#007bff",
    marginTop: 10,
  },
});
