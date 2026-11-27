import { useState } from "react";
import ManageProduct from "./ManageProduct";
import ManageCategory from "./ManageCategories";
import ManageSetting from "./ManageSettings";
import ManageReviews from "./ManageReviews";

function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("products");

  const tabs = [
    { id: "products", label: "Products", icon: "🍽️" },
    { id: "categories", label: "Categories", icon: "📂" },
    { id: "settings", label: "Settings", icon: "⚙️" },
    { id: "reviews", label: "Reviews", icon: "⭐" },
  ];

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-logo">FC KITCHEN</div>
        <p className="admin-subtitle">ADMIN PANEL</p>

        <nav className="admin-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={activeTab === tab.id ? "active" : ""}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <button className="admin-logout" onClick={onLogout}>
          Logout
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <p className="admin-subtitle">WELCOME BACK</p>
            <h1>
              {tabs.find((tab) => tab.id === activeTab)?.label}
            </h1>
          </div>
          <span className="admin-status">Admin Panel</span>
        </header>

        <section className="admin-content">
          {activeTab === "products" && <ManageProduct />}
          {activeTab === "categories" && <ManageCategory />}
          {activeTab === "settings" && <ManageSetting />}
          {activeTab === "reviews" && <ManageReviews />}
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;