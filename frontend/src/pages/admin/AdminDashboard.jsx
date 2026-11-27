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
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-logo">FC Kitchen</div>
        <p className="admin-subtitle">ADMIN PANEL</p>

        <nav className="admin-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={activeTab === tab.id ? "active" : ""}
              onClick={() => setActiveTab(tab.id)}
            >
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