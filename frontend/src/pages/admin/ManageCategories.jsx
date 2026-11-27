import { useEffect, useState } from "react";

const API_URL = "https://fc-kitchen-bds4.onrender.com/api";

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

      const wasEditing = Boolean(editingId);

      setName("");
      setDescription("");
      setEditingId(null);
      setMessage(wasEditing ? "Category updated!" : "Category added!");

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

  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setMessage("");
  };

  return (
    <section className="manage-category">
      <h2 className="manage-category-heading">Manage Categories</h2>

      <form onSubmit={handleSubmit} className="category-form">
        <input
          className="category-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          required
        />

        <textarea
          className="category-input category-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Category description"
          rows="3"
        />

        <div className="category-actions">
          <button
            className="category-button"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : editingId
              ? "Update Category"
              : "Add Category"}
          </button>

          {editingId && (
            <button
              type="button"
              className="category-cancel"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {message && (
        <p className="category-message">{message}</p>
      )}

      <h3 className="category-subheading">
        Existing Categories
      </h3>

      <div className="category-list">
        {categories.map((category) => (
          <div className="category-item" key={category._id}>
            <div className="category-item-info">
              <strong className="category-name">
                {category.name}
              </strong>

              <p className="category-description">
                {category.description}
              </p>
            </div>

            <div className="category-actions">
              <button
                className="category-edit"
                onClick={() => handleEdit(category)}
              >
                Edit
              </button>

              <button
                className="category-delete"
                onClick={() => handleDelete(category._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ManageCategory;