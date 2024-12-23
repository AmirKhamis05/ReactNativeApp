import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
  Linking,
} from "react-native";
import { auth } from "../firebase/firebase";
import { useNavigation } from "@react-navigation/native";

const BlogList = ({ blogs, title, handleDelete }) => {
  const userId = auth.currentUser?.uid;
  const navigation = useNavigation();

  const handleEdit = (blog) => {
    navigation.navigate("editBlog", {
      blogId: blog.id,
      title: blog.title,
      body: blog.body,
      author: blog.author,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {blogs.map((blog) => (
        <View style={styles.blogPreview} key={blog.id}>
          <Text style={styles.blogTitle}>Title: {blog.title}</Text>
          <Text style={styles.blogBody}>Content: {blog.body}</Text>
          <Text style={styles.author}>Written by: {blog.author}</Text>
          {blog.userId == userId && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.deleteButton, { marginHorizontal: 10 }]}
                onPress={() => handleDelete(blog.id)}
              >
                <Text style={styles.deleteText}>Delete Blog</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleEdit(blog)}
              >
                <Text style={styles.deleteText}>Edit Blog</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  blogPreview: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
  },
  blogTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  author: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "#f1356d",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
  },
  blogBody: {
    color: "#666",
    fontSize: 14,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row", // Arrange children in a row
    alignItems: "center", // Center buttons vertically
    marginTop: 10, // Optional: add some space above the buttons
  },
});

export default BlogList;
