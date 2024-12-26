import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Navbar from "../components/NavBar";
import { database, auth } from "../firebase/firebase";
import { get, ref, remove, onValue } from "firebase/database";
import { useRouter } from "expo-router";
import ProfileBlogList from "../components/ProfileBlogList";

const ProfileCard = () => {
  const userId = auth.currentUser?.uid;
  const router = useRouter();
  const [userData, setUserData] = useState({});
  const [blogs, setBlogs] = useState([]);
  const [isPending, setIsPending] = useState(true);

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
    remove(blogRef).then(() => {
      setBlogs(blogs.filter((blog) => blog.id !== id));
    });
  };

  useEffect(() => {
    const fetchAuthor = async () => {
      if (!userId) {
        router.push("/auth/signIn");
      }

      try {
        const snapshot = await get(ref(database, `users/${userId}`));
        if (snapshot.exists()) {
          setUserData(snapshot.val());
        }
      } catch (error) {
        console.error("Error fetching author:", error);
      }
    };

    fetchAuthor();
  }, [userId]);

  return (
    <>
      <Navbar currentDashBoard={"profile"} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.card}>
            <View style={styles.imageContainer}>
              <Image
                source={require("../../assets/images/profile/pfp.png")}
                style={styles.profileImage}
              />
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.userBadge}>User</Text>
              <Text style={styles.username}>
                {userData.Username || "Guest"}
              </Text>
              <Text style={styles.subtitle}>Blogging Enthusiast</Text>
              <View style={styles.descriptionContainer}>
                <Text style={styles.description}>
                  <Text style={styles.boldText}>Description:</Text>{" "}
                  {userData.Description || "No description available."}
                </Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.outlineButton}
                  onPress={() => router.push("/(tabs)/editProfile")}
                >
                  <Text style={styles.outlineButtonText}>Edit Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Blog List */}
          <View style={styles.blogsContainer}>
            {blogs.length !== 0 ? (
              <ProfileBlogList
                blogs={blogs}
                title="Blog List"
                handleDelete={handleDelete}
              />
            ) : (
              <Text style={styles.emptyContainer}>No blogs found.</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    alignItems: "center",
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20, // Space between the profile card and the blog list
  },
  blogsContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
  },
  emptyContainer: {
    textAlign: "center",
    fontSize: 18,
    color: "#666",
    fontWeight: "bold",
  },
  /* Rest of your styles remain the same */
  imageContainer: {
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  infoContainer: {
    alignItems: "center",
  },
  userBadge: {
    backgroundColor: "#6c757d",
    color: "#fff",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
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
    marginBottom: 15,
  },
  descriptionContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
  },
  boldText: {
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
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
  primaryButton: {
    backgroundColor: "#6f42c1",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ProfileCard;

export const options = {
  headerShown: false,
};
