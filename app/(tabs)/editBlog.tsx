import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { database, auth } from "../firebase/firebase"; // Firebase Realtime DB
import { ref, get, update } from "firebase/database";

const EditBlog = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Get the passed parameters
  const {
    blogId,
    title: initialTitle,
    body: initialBody,
    author: initialAuthor,
  } = route.params || {};

  const [title, setTitle] = useState(initialTitle || "");
  const [body, setBody] = useState(initialBody || "");
  const [author, setAuthor] = useState(initialAuthor || "");
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (!auth.currentUser?.uid) {
      navigation.navigate("auth/signIn");
    }
  }, []);

  const handleEdit = () => {
    const updatedBlog = { title, body, author };

    setIsPending(true);

    update(ref(database, `blogs/${blogId}`), updatedBlog)
      .then(() => {
        console.log("Blog updated successfully");
        setIsPending(false);
        navigation.navigate("index");
      })
      .catch((error) => {
        console.error("Error updating blog:", error);
        setIsPending(false);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Edit Blog</Text>

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

      {isPending ? (
        <ActivityIndicator size="large" color="#f1356d" />
      ) : (
        <Button title="Save Changes" onPress={handleEdit} color="#f1356d" />
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
});

export default EditBlog;
