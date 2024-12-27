import { auth, database } from "../firebase/firebase";
import { remove, ref, get, push, set } from "firebase/database";

/* ==========================
    🔄 BLOG FUNCTIONS
========================== */

/**
 * Deletes a blog post by ID.
 * @param {string} id - The ID of the blog to delete.
 * @param {Function} setBlogs - State setter for blogs.
 * @param {Function} setError - State setter for error messages.
 * @param {Array} blogs - Current list of blogs.
 */
const handleDelete = (id, setBlogs, setError, blogs) => {
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

/**
 * Adds a new blog post to the database.
 * @param {Object} blogData - The blog details.
 * @param {Function} setSuccess - State setter for success messages.
 * @param {Function} setError - State setter for error messages.
 */
const handleAddBlog = (blogData, setSuccess, setError) => {
  const blogRef = push(ref(database, "blogs"));
  set(blogRef, blogData)
    .then(() => {
      console.log("Blog added successfully.");
      setSuccess("Blog added successfully!");
    })
    .catch((error) => {
      console.error("Error adding blog:", error);
      setError("Failed to add blog. Please try again.");
    });
};

/**
 * Fetches a single blog post by ID.
 * @param {string} id - The ID of the blog to fetch.
 * @returns {Promise<Object|null>} - The blog data or null if not found.
 */
const fetchBlogById = async (id) => {
  try {
    const snapshot = await get(ref(database, `blogs/${id}`));
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error("Error fetching blog:", error);
    throw error;
  }
};

/* ==========================
    🔐 AUTH FUNCTIONS
========================== */

/**
 * Gets the currently authenticated user's ID.
 * @returns {string|null} - The user ID or null if not authenticated.
 */
const getCurrentUserId = () => {
  return auth.currentUser?.uid || null;
};

/**
 * Logs out the current user.
 */
const handleLogout = async () => {
  try {
    await auth.signOut();
    console.log("User signed out successfully.");
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

/* ==========================
    📚 EXPORT ALL FUNCTIONS
========================== */

export {
  handleDelete,
  handleAddBlog,
  fetchBlogById,
  getCurrentUserId,
  handleLogout,
};
