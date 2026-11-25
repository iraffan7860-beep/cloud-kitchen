
import { useState } from "react";
import ManageProduct from "../components/ManageProduct";
import ManageCategory from "../components/ManageCategory";
import ManageSetting from "../components/ManageSetting";
import ManageReviews from "../components/ManageReviews";

function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("products");

  const tabs = [
    { id: "products", label: "Products" },
    { id: "categories", label: "Categories" },
    { id: "settings", label: "Settings" },
    { id: "reviews", label: "Reviews" },
  ];

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <h1>FC Kitchen Admin</h1>
        <button style={styles.logout} onClick={onLogout}>
          Logout
        </button>
      </header>

      <nav style={styles.nav}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              ...styles.tab,
              ...(activeTab === tab.id ? styles.activeTab : {}),
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <section style={styles.content}>
        {activeTab === "products" && <ManageProduct />}
        {activeTab === "categories" && <ManageCategory />}
        {activeTab === "settings" && <ManageSetting />}
        {activeTab === "reviews" && <ManageReviews />}
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#17110e",
    color: "#f5eee3",
    padding: "20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    color: "#e4c98c",
  },
  nav: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    margin: "25px 0",
  },
  tab: {
    padding: "12px 20px",
    background: "#302219",
    color: "#eee0c9",
    border: "1px solid #80643e",
    borderRadius: "6px",
    cursor: "pointer",
  },
  activeTab: {
    background: "#c6a15b",
    color: "#17110e",
    fontWeight: "bold",
  },
  content: {
    maxWidth: "1100px",
    margin: "auto",
  },
  logout: {
    padding: "10px 18px",
    background: "#8b3434",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default AdminDashboard;
