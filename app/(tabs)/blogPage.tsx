import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { get, ref, remove } from "firebase/database";
import { auth, database } from "../firebase/firebase";
import Navbar from "../components/NavBar";
import { useRouter } from "expo-router";

const SingleBlog = () => {
  const router = useRouter();
  const route = useRoute();
  const { blogId, title, body, author, userId } = route.params;
  const currentUserId = auth.currentUser?.uid;
  const [authorData, setAuthorData] = useState({});

  // Fetch Author Data
  useEffect(() => {
    const fetchAuthorData = async () => {
      if (userId) {
        try {
          const snapshot = await get(ref(database, `users/${userId}`));
          if (snapshot.exists()) {
            setAuthorData(snapshot.val());
          }
        } catch (error) {
          console.error("Error fetching author data:", error);
        }
      }
    };

    fetchAuthorData();
  }, [userId]);

  const handleEdit = () => {
    router.push({
      pathname: "/editBlog",
      params: {
        blogId: blogId,
        title: title,
        body: body,
        author: author,
      },
    });
  };

  const handleDelete = (id) => {
    const blogRef = ref(database, `blogs/${id}`);
    remove(blogRef)
      .then(() => {
        console.log(`Blog with ID ${id} deleted successfully.`);
      })
      .catch((error) => {
        console.error("Error deleting blog:", error);
      });
  };

  return (
    <>
      <Navbar currentDashBoard={"main"} />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Blog Details */}
        <View style={styles.blogCard}>
          <Text style={styles.blogTitle}>{title}</Text>
          <Text style={styles.blogBody}>{body}</Text>
          <Text style={styles.blogAuthor}>Written by: {author}</Text>
          {currentUserId == userId && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.deleteButton]}
                onPress={() => handleDelete(blogId)}
              >
                <Text style={styles.deleteText}>Delete Blog</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.deleteButton, { marginHorizontal: 10 }]}
                onPress={() => handleEdit()}
              >
                <Text style={styles.deleteText}>Edit Blog</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Author Profile */}
        <View style={styles.authorCard}>
          <Image
            source={require("../../assets/images/profile/pfp.png")}
            style={styles.profileImage}
          />
          <Text style={styles.username}>{authorData.Username || "Guest"}</Text>
          <Text style={styles.subtitle}>Blogging Enthusiast</Text>
          <Text style={styles.description}>
            {authorData.Description || "No description available."}
          </Text>
          {currentUserId === userId && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.outlineButton}
                onPress={() => router.push("/(tabs)/profile")}
              >
                <Text style={styles.outlineButtonText}>Go To Profile</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    gap: 20,
    height: "100%",
  },
  blogCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  blogTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  blogBody: {
    fontSize: 16,
    color: "#444",
    marginBottom: 10,
    lineHeight: 22,
  },
  blogAuthor: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  authorCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#444",
    textAlign: "center",
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
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: "#6f42c1",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
  },
  outlineButtonText: {
    color: "#6f42c1",
    fontWeight: "bold",
  },
});

export default SingleBlog;
