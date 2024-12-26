import { auth, database } from "../firebase/firebase";
import { remove, ref, get, push, set } from "firebase/database";


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

export default handleDelete;


