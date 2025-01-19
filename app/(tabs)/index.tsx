import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Linking,
} from "react-native";
import BlogList from "../components/BlogList";
import { database } from "../firebase/firebase";
import { ref, onValue, remove } from "firebase/database";
import { ScrollView } from "react-native-gesture-handler";
import AppButton from "../components/ExternalLinkButton";
import Navbar from "../components/NavBar";
import SearchBar from "../components/SearchBar";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
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
        setFilteredBlogs(blogsArray); // Initially show all blogs
      } else {
        setBlogs([]);
        setFilteredBlogs([]);
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
        setFilteredBlogs(filteredBlogs.filter((blog) => blog.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting blog:", error);
        setError("Failed to delete blog. Please try again.");
      });
  };

  const handleFilter = (filteredData) => {
    setFilteredBlogs(filteredData);
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
        <SearchBar
          data={blogs}
          searchKeys={["title", "body", "author"]}
          onFilter={handleFilter}
          currentDashBoard={"main"}
        />
        <ScrollView>
          {filteredBlogs.length !== 0 ? (
            <BlogList
              blogs={filteredBlogs}
              title="Blog List"
              handleDelete={handleDelete}
            />
          ) : (
            <Text style={styles.emptyContainer}>No blogs found.</Text>
          )}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
    backgroundColor: "#fff",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 20,
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
