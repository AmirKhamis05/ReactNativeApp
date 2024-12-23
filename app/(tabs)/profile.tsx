import { useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import Navbar from "../components/NavBar";
import { database, auth } from "../firebase/firebase";
import { get, ref } from "firebase/database";
import { useRouter } from "expo-router";

const ProfileCard = () => {
  const userId = auth.currentUser?.uid;
  const router = useRouter();
  const [userData, setUserData] = useState({});

  const handleEdit = () => {
    router.push("/(tabs)/editProfile");
  };

  useEffect(() => {
    const fetchAuthor = async () => {
      if (!userId) {
        router.push("/auth/signIn");
      }

      try {
        const snapshot = await get(ref(database, `users/${userId}`));
        if (snapshot.exists()) {
          setUserData(snapshot.val()); // Correctly set the author as the username string
        } else {
          console.error("No user data found");
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
      <View style={styles.container}>
        <View style={styles.card}>
          {/* Profile Image */}
          <View style={styles.imageContainer}>
            <Image
              source={require("../../assets/images/profile/pfp.png")} // Replace with the correct path
              style={styles.profileImage}
            />
          </View>

          {/* User Information */}
          <View style={styles.infoContainer}>
            <Text style={styles.userBadge}>User</Text>
            <Text style={styles.username}>{userData.Username || "Guest"}</Text>
            <Text style={styles.subtitle}>Blogging Enthusiast</Text>

            {/* User Description */}
            <View style={styles.descriptionContainer}>
              <Text style={styles.description}>
                <Text style={styles.boldText}>Description:</Text>{" "}
                {userData.Description || "No description available."}
              </Text>
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.outlineButton}
                onPress={() => handleEdit()}
              >
                <Text style={styles.outlineButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export const options = {
  headerShown: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
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
  },
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
