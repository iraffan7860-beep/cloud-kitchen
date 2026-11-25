import { useEffect, useState } from "react";

const API_URL = "https://cloud-kitchen-1-x5q3.onrender.com/api";

function ManageCategory() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const getToken = () => localStorage.getItem("fc-admin-token");

  const getCategoryList = (data) =>
    data.categories || data.data?.categories || data.data || [];

  const loadCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load categories.");
      }

      setCategories(getCategoryList(data));
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const url = editingId
        ? `${API_URL}/categories/${editingId}`
        : `${API_URL}/categories`;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ name, description }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save category.");
      }

      setName("");
      setDescription("");
      setEditingId(null);
      setMessage(editingId ? "Category updated!" : "Category added!");
      await loadCategories();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setName(category.name || "");
    setDescription(category.description || "");
    setMessage("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete category.");
      }

      setMessage("Category deleted.");
      await loadCategories();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <section style={styles.container}>
      <h2 style={styles.heading}>Manage Categories</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          style={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          required
        />

        <textarea
          style={styles.input}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Category description"
          rows="3"
        />

        <div style={styles.actions}>
          <button style={styles.button} disabled={loading}>
            {loading
              ? "Saving..."
              : editingId
              ? "Update Category"
              : "Add Category"}
          </button>

          {editingId && (
            <button
              type="button"
              style={styles.cancel}
              onClick={() => {
                setEditingId(null);
                setName("");
                setDescription("");
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {message && <p style={styles.message}>{message}</p>}

      <h3 style={styles.subheading}>Existing Categories</h3>

      {categories.map((category) => (
        <div key={category._id} style={styles.item}>
          <div>
            <strong style={styles.name}>{category.name}</strong>
            <p style={styles.description}>{category.description}</p>
          </div>

          <div style={styles.actions}>
            <button
              style={styles.edit}
              onClick={() => handleEdit(category)}
            >
              Edit
            </button>

            <button
              style={styles.delete}
              onClick={() => handleDelete(category._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}

const styles = {
  container: {
    background: "#211812",
    color: "#f5eee3",
    padding: "25px",
    borderRadius: "10px",
  },
  heading: { color: "#e4c98c" },
  subheading: { color: "#e4c98c", marginTop: "30px" },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  input: {
    padding: "12px",
    background: "#17110e",
    color: "white",
    border: "1px solid #80643e",
    borderRadius: "5px",
  },
  actions: { display: "flex", gap: "10px", flexWrap: "wrap" },
  button: {
    padding: "11px 18px",
    background: "#c6a15b",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  cancel: {
    padding: "11px 18px",
    background: "#555",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  message: { color: "#e4c98c" },
  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    padding: "15px 0",
    borderBottom: "1px solid #59432d",
    flexWrap: "wrap",
  },
  name: { color: "#e4c98c" },
  description: { color: "#c8b9a5", marginBottom: 0 },
  edit: {
    padding: "8px 13px",
    background: "#80643e",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  delete: {
    padding: "8px 13px",
    background: "#8b3434",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default ManageCategory;