import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { auth } from "../firebase/firebase";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";

const ProfileBlogList = ({ blogs, title, handleDelete }) => {
  const userId = auth.currentUser?.uid; // Get the logged-in user's ID
  const navigation = useNavigation();
  const router = useRouter();

  const handleEdit = (blog) => {
    router.push({
      pathname: "/(tabs)/editBlog",
      params: {
        blogId: blog.id,
        title: blog.title,
        body: blog.body,
        author: blog.author,
      },
    });
  };

  const handleViewBlog = (blog) => {
    router.push({
      pathname: "/blogPage",
      params: {
        blogId: blog.id,
        title: blog.title,
        body: blog.body,
        author: blog.author,
        userId: blog.userId,
      },
    });
  };

  // Filter blogs to include only those authored by the logged-in user
  const userBlogs = blogs.filter((blog) => blog.userId === userId);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {userBlogs.map((blog) => (
        <View style={styles.blogPreview} key={blog.id}>
          <Text style={styles.blogTitle}>Title: {blog.title}</Text>
          <Text style={styles.blogBody}>Content: {blog.body}</Text>
          <Text style={styles.author}>Written by: {blog.author}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(blog.id)}
            >
              <Text style={styles.deleteText}>Delete Blog</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.deleteButton, { marginHorizontal: 10 }]}
              onPress={() => handleEdit(blog)}
            >
              <Text style={styles.deleteText}>Edit Blog</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleViewBlog(blog)}
            >
              <Text style={styles.deleteText}>View Blog</Text>
            </TouchableOpacity>
          </View>
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
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
});

export default ProfileBlogList;
