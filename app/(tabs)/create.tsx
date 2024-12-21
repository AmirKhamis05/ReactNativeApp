import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
// import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { database, auth } from "../firebase/firebase"; // Firebase Realtime DB
import { ref, push, get } from "firebase/database";
import { useRouter } from "expo-router";

const Create = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState("");
  const [isPending, setIsPending] = useState(false);
  const userId = auth.currentUser?.uid;
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    const fetchAuthor = async () => {
      if (!userId) {
        router.push("/auth/signIn");
      }

      try {
        const snapshot = await get(ref(database, `users/${userId}/Username`));
        if (snapshot.exists()) {
          setAuthor(snapshot.val()); // Correctly set the author as the username string
        } else {
          console.error("No user data found");
        }
      } catch (error) {
        console.error("Error fetching author:", error);
      }
    };

    fetchAuthor();
  }, [userId]);

  const handleSubmit = () => {
    const blog = { title, body, author, userId };

    setIsPending(true);

    push(ref(database, "blogs/"), blog)
      .then(() => {
        console.log("New blog added");
        setTitle("");
        setBody("");
        setAuthor("");
        setIsPending(false);
        navigation.navigate("index");
      })
      .catch((error) => {
        console.error("Error adding blog:", error);
        setIsPending(false);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add a New Blog</Text>

      <Text style={styles.label}>Blog Title:</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={(text) => setTitle(text)}
      />

      <Text style={styles.label}>Blog Body:</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={body}
        onChangeText={(text) => setBody(text)}
        multiline
      />

      {/* <Text style={styles.label}>Blog Author:</Text>
      <TextInput
        style={[styles.input]}
        value={author}
        onChangeText={(text) => setAuthor(text)}
        multiline
      /> */}

      {isPending ? (
        <ActivityIndicator size="large" color="#f1356d" />
      ) : (
        <Button title="Submit" onPress={handleSubmit} color="#f1356d" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
  },
});

export default Create;
