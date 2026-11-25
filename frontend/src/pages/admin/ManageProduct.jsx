import { useEffect, useState } from "react";

const API_URL = "https://cloud-kitchen-1-x5q3.onrender.com/api";

function ManageProduct() {
  const emptyForm = {
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    isAvailable: true,
    isFeatured: false,
    sortOrder: 0,
  };

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const getToken = () => localStorage.getItem("fc-admin-token");

  const getList = (data, key) =>
    data[key] || data.data?.[key] || data.data || [];

  const loadData = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${getToken()}`,
      };

     const [productResponse, categoryResponse] = await Promise.all([
  fetch(`${API_URL}/products`, { headers }),
  fetch(`${API_URL}/categories/public`, { headers }),
]); 

      const productData = await productResponse.json();
      const categoryData = await categoryResponse.json();

      if (!productResponse.ok) {
        throw new Error(productData.message || "Unable to load products.");
      }

      if (!categoryResponse.ok) {
        throw new Error(categoryData.message || "Unable to load categories.");
      }

      setProducts(getList(productData, "products"));
      setCategories(getList(categoryData, "categories"));
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const url = editingId
        ? `${API_URL}/products/${editingId}`
        : `${API_URL}/products`;

      const payload = {
        ...form,
        price: Number(form.price),
        sortOrder: Number(form.sortOrder),
      };

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save product.");
      }

      setForm(emptyForm);
      setEditingId(null);
      setMessage(editingId ? "Product updated!" : "Product added!");
      await loadData();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);

    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      image: product.image || "",
      category: product.category?._id || product.category || "",
      isAvailable: product.isAvailable ?? true,
      isFeatured: product.isFeatured ?? false,
      sortOrder: product.sortOrder ?? 0,
    });

    setMessage("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete product.");
      }

      setMessage("Product deleted.");
      await loadData();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
  };

  return (
    <section style={styles.container}>
      <h2 style={styles.heading}>Manage Products</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product name"
          required
          style={styles.input}
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Product description"
          rows="3"
          style={styles.input}
        />

        <input
          name="price"
          type="number"
          min="0"
          step="0.01"
          value={form.price}
          onChange={handleChange}
          placeholder="Price in rupees"
          required
          style={styles.input}
        />

        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Product image URL"
          style={styles.input}
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          style={styles.input}
        >
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>

        <input
          name="sortOrder"
          type="number"
          value={form.sortOrder}
          onChange={handleChange}
          placeholder="Display order"
          style={styles.input}
        />

        <label style={styles.checkbox}>
          <input
            type="checkbox"
            name="isAvailable"
            checked={form.isAvailable}
            onChange={handleChange}
          />
          Available for customers
        </label>

        <label style={styles.checkbox}>
          <input
            type="checkbox"
            name="isFeatured"
            checked={form.isFeatured}
            onChange={handleChange}
          />
          Featured product
        </label>

        <div style={styles.actions}>
          <button style={styles.button} disabled={loading}>
            {loading
              ? "Saving..."
              : editingId
              ? "Update Product"
              : "Add Product"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              style={styles.cancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {message && <p style={styles.message}>{message}</p>}

      <h3 style={styles.subheading}>All Products</h3>

      <div style={styles.list}>
        {products.map((product) => (
          <article key={product._id} style={styles.item}>
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                style={styles.image}
              />
            )}

            <div style={{ flex: 1 }}>
              <strong style={styles.name}>{product.name}</strong>
              <p style={styles.description}>
                ₹{product.price} ·{" "}
                {product.category?.name || "Category"}
              </p>
              <small>
                {product.isAvailable ? "Available" : "Unavailable"}
              </small>
            </div>

            <div style={styles.actions}>
              <button
                style={styles.edit}
                onClick={() => handleEdit(product)}
              >
                Edit
              </button>

              <button
                style={styles.delete}
                onClick={() => handleDelete(product._id)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
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
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    background: "#17110e",
    color: "white",
    border: "1px solid #80643e",
    borderRadius: "5px",
  },
  checkbox: { display: "flex", gap: "10px", alignItems: "center" },
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
  list: { display: "flex", flexDirection: "column" },
  item: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "15px 0",
    borderBottom: "1px solid #59432d",
    flexWrap: "wrap",
  },
  image: {
    width: "75px",
    height: "75px",
    objectFit: "cover",
    borderRadius: "7px",
  },
  name: { color: "#e4c98c" },
  description: { color: "#c8b9a5", margin: "6px 0" },
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


export default ManageProduct;