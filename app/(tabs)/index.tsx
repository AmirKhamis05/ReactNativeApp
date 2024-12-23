import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Linking,
  Platform,
} from "react-native";
import BlogList from "../components/BlogList";
import { database } from "../firebase/firebase";
import { ref, onValue, remove } from "firebase/database";
import { ScrollView } from "react-native-gesture-handler";
import AppButton from "../components/ExternalLinkButton";
import Navbar from "../components/NavBar";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const blogsRef = ref(database, "blogs/");
    const unsubscribe = onValue(blogsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const blogsArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setBlogs(blogsArray);
      } else {
        setBlogs([]);
      }
      setIsPending(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = (id) => {
    const blogRef = ref(database, `blogs/${id}`);
    remove(blogRef)
      .then(() => {
        console.log(`Blog with ID ${id} deleted successfully.`);
        setBlogs(blogs.filter((blog) => blog.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting blog:", error);
        setError("Failed to delete blog. Please try again.");
      });
  };

  const openLink = () => {
    Linking.openURL("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  };

  return (
    <>
      <Navbar currentDashBoard="main" />
      <View style={styles.container}>
        {error && <Text style={styles.error}>{error}</Text>}
        {isPending && <ActivityIndicator size="large" color="#f1356d" />}
        <ScrollView>
          {blogs.length !== 0 ? (
            <BlogList
              blogs={blogs}
              title="Blog List"
              handleDelete={handleDelete}
            />
          ) : (
            <Text style={styles.emptyContainer}>No blogs found.</Text>
          )}

          <View style={styles.buttonContainer}>
            <AppButton title="Nostalgia" onPress={openLink} />
          </View>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start", // Keep content aligned to the top
    backgroundColor: "#fff",
  },
  buttonContainer: {
    alignItems: "center", // Center the button horizontally
    marginTop: 20, // Add some space above the button
  },
  error: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
  },
  emptyContainer: {
    justifyContent: "center",
    fontSize: 24,
    color: "#666",
    fontWeight: "bold",
  },
});

export default Home;
