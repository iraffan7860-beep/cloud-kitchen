import { useEffect, useState } from "react";

import {
  getProducts,
  getCategories,
  getSettings,
} from "./services/api";

import { useCart } from "./context/CartContext";

import CheckoutForm from "./components/CheckoutForm";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";

import AdminLogin from "./pages/admin/AdminLogin";
import ManageCategory from "./pages/admin/ManageCategories";
import ManageProduct from "./pages/admin/ManageProduct";
import ManageSetting from "./pages/admin/ManageSettings";

const API_URL = "https://cloud-kitchen-1-x5q3.onrender.com/api";

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState({});

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPath, setCurrentPath] = useState(
    window.location.pathname
  );

  const [adminToken, setAdminToken] = useState(
    localStorage.getItem("fc-admin-token")
  );

  const [adminChecking, setAdminChecking] = useState(true);
  const [adminPage, setAdminPage] = useState("overview");

  const { addToCart, cartCount } = useCart();

  const navigate = (path) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Browser navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Old cart route
  useEffect(() => {
    if (currentPath === "/cart") {
      window.history.replaceState({}, "", "/");
      setCurrentPath("/");
    }
  }, [currentPath]);

  // Verify admin login
  useEffect(() => {
    const checkAdmin = async () => {
      if (!currentPath.startsWith("/admin")) {
        setAdminChecking(false);
        return;
      }

      if (currentPath === "/admin/login") {
        setAdminChecking(false);
        return;
      }

      const token = localStorage.getItem("fc-admin-token");

      if (!token) {
        setAdminToken(null);
        setAdminChecking(false);
        navigate("/admin/login");
        return;
      }

      setAdminChecking(true);

      try {
        const response = await fetch(`${API_URL}/admin/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Admin session expired.");
        }

        setAdminToken(token);
      } catch {
        localStorage.removeItem("fc-admin-token");
        setAdminToken(null);
        navigate("/admin/login");
      } finally {
        setAdminChecking(false);
      }
    };

    checkAdmin();
  }, [currentPath]);

  // Load public website data only
  useEffect(() => {
    if (
      currentPath.startsWith("/admin")
    ) {
      setLoading(false);
      return;
    }

    const loadWebsite = async () => {
      try {
        const [productData, categoryData, settingsData] =
          await Promise.all([
            getProducts(),
            getCategories(),
            getSettings(),
          ]);

        setProducts(
          Array.isArray(productData)
            ? productData
            : productData.products || []
        );

        setCategories(
          Array.isArray(categoryData)
            ? categoryData
            : categoryData.categories || []
        );

        setSettings(settingsData.settings || settingsData || {});
      } catch {
        setError("Unable to load the menu. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    loadWebsite();
  }, [currentPath]);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => {
          const categoryName =
            typeof product.category === "object"
              ? product.category?.name
              : categories.find(
                  (category) => category._id === product.category
                )?.name;

          return categoryName === selectedCategory;
        });

  const formatPrice = (price) =>
    `₹${Number(price || 0).toFixed(0)}`;

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const instagramUrl =
    settings.instagramUrl ||
    "https://www.instagram.com/castle_cafe_.8811/";

  const phone = settings.phone || "6300612693";

  // ADMIN LOGIN
  if (currentPath === "/admin/login") {
    return (
      <AdminLogin
        onLogin={(token) => {
          setAdminToken(token);
          setAdminPage("overview");
          navigate("/admin");
        }}
      />
    );
  }

  // ADMIN DASHBOARD
  if (currentPath.startsWith("/admin")) {
    if (adminChecking) {
      return (
        <div style={adminStyles.loading}>
          Checking admin access...
        </div>
      );
    }

    if (!adminToken) {
      return null;
    }

    const logout = () => {
      localStorage.removeItem("fc-admin-token");
      setAdminToken(null);
      setAdminPage("overview");
      navigate("/admin/login");
    };

    const renderAdminPage = () => {
      switch (adminPage) {
        case "products":
          return <ManageProduct />;

        case "categories":
          return <ManageCategory />;

        case "settings":
          return <ManageSetting />;

        default:
          return (
            <div style={adminStyles.welcome}>
              <p style={adminStyles.eyebrow}>FC KITCHEN ADMIN</p>
              <h1>Welcome to Dashboard</h1>
              <p>
                Manage your kitchen products, categories and
                website settings from here.
              </p>

              <div style={adminStyles.cards}>
                <button
                  onClick={() => setAdminPage("products")}
                  style={adminStyles.card}
                >
                  <span>🍽️</span>
                  <strong>Manage Products</strong>
                  <small>Add, edit and delete products</small>
                </button>

                <button
                  onClick={() => setAdminPage("categories")}
                  style={adminStyles.card}
                >
                  <span>📂</span>
                  <strong>Manage Categories</strong>
                  <small>Organise your food menu</small>
                </button>

                <button
                  onClick={() => setAdminPage("settings")}
                  style={adminStyles.card}
                >
                  <span>⚙️</span>
                  <strong>Website Settings</strong>
                  <small>Update business information</small>
                </button>
              </div>

              <div style={adminStyles.notice}>
                <strong>Orders:</strong> Customer orders currently
                go through WhatsApp. They are not yet stored in
                the database.
              </div>
            </div>
          );
      }
    };

    return (
      <div style={adminStyles.layout}>
        <aside style={adminStyles.sidebar}>
          <h2 style={adminStyles.logo}>
            FC <span>KITCHEN</span>
          </h2>

          <p style={adminStyles.adminLabel}>ADMIN PANEL</p>

          {[
            { id: "overview", label: "Dashboard", icon: "⌂" },
            { id: "products", label: "Manage Products", icon: "🍽️" },
            { id: "categories", label: "Manage Categories", icon: "📂" },
            { id: "settings", label: "Website Settings", icon: "⚙️" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setAdminPage(item.id)}
              style={{
                ...adminStyles.navButton,
                ...(adminPage === item.id
                  ? adminStyles.activeNav
                  : {}),
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}

          <button
            onClick={() => navigate("/")}
            style={adminStyles.navButton}
          >
            ↗ View Website
          </button>

          <button
            onClick={logout}
            style={adminStyles.logout}
          >
            Logout
          </button>
        </aside>

        <main style={adminStyles.main}>
          <header style={adminStyles.topbar}>
            <div>
              <p style={adminStyles.eyebrow}>FC KITCHEN</p>
              <h2>
                {adminPage === "overview"
                  ? "Dashboard"
                  : adminPage === "products"
                  ? "Manage Products"
                  : adminPage === "categories"
                  ? "Manage Categories"
                  : "Website Settings"}
              </h2>
            </div>
            <span style={adminStyles.status}>Admin Panel</span>
          </header>

          {renderAdminPage()}
        </main>
      </div>
    );
  }

  // CHECKOUT PAGE
  if (currentPath === "/checkout") {
    return (
      <div className="website">
        <header className="navbar">
          <a
            href="/"
            className="logo"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            FC <span>KITCHEN</span>
          </a>

          <button
            className="nav-cart"
            onClick={() => navigate("/")}
          >
            Back to Menu
          </button>
        </header>

        <CheckoutForm
          settings={settings}
          onBack={() => navigate("/")}
        />

        <Footer settings={settings} />
        <BackToTop />
      </div>
    );
  }

  // HOMEPAGE
  return (
    <div className="website">
      <Navbar
        onCheckout={() => navigate("/checkout")}
      />

      <section className="hero" id="home">
        <div className="hero-content">
          <p className="eyebrow">WELCOME TO FC KITCHEN</p>

          <h1>
            A Taste Like Home
            <br />
            <span>in Every Bite.</span>
          </h1>

          <p className="hero-description">
            Freshly prepared food, delicious flavours and happiness
            served with every order.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={() => scrollToSection("menu")}
            >
              Explore Menu
            </button>

            <button
              className="secondary-btn"
              onClick={() => {
                document.querySelector(".nav-cart")?.click();
              }}
            >
              View Cart ({cartCount})
            </button>
          </div>
        </div>
      </section>

      <section className="find-section" id="find-kitchen">
        <div className="find-content">
          <p className="eyebrow">COME SAY HELLO</p>
          <h2>Find FC Kitchen</h2>

          <p className="find-description">
            We'd love to hear from you! Have a question or craving
            something delicious? Get in touch with us.
          </p>

          <div className="find-details">
            <div className="find-detail">
              <span className="detail-icon">⌖</span>
              <div>
                <h3>Our Location</h3>
                <a
                  href={
                    settings.mapsUrl ||
                    "https://maps.app.goo.gl/6c4n4LfbwiU7robb7?g_st=ac"
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="location-link"
                >
                  {settings.address ||
                    "Khizra Enclave, Fatima Castle, Hyderabad, India"}
                  ↗
                </a>
              </div>
            </div>

            <div className="find-detail">
              <span className="detail-icon">☎</span>
              <div>
                <h3>Call Us</h3>
                <a href={`tel:${phone}`}>{phone}</a>
              </div>
            </div>

            <div className="find-detail">
              <span className="detail-icon">◷</span>
              <div>
                <h3>Opening Hours</h3>
                <p>
                  {settings.openingTime || "07:00"} –{" "}
                  {settings.closingTime || "00:00"}
                </p>
              </div>
            </div>
          </div>

          <div className="find-buttons">
            <a
              href={
                settings.mapsUrl ||
                "https://maps.app.goo.gl/6c4n4LfbwiU7robb7?g_st=ac"
              }
              target="_blank"
              rel="noreferrer"
              className="primary-btn"
            >
              Get Directions ↗
            </a>

            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="secondary-btn"
            >
              Visit Our Instagram
            </a>
          </div>
        </div>

        <div className="find-visual">
          <div className="find-visual-inner">
            <span>FC</span>
            <small>KITCHEN</small>
            <p>A Taste Like Home in Every Bite.</p>
          </div>
        </div>
      </section>

      <section className="intro-section" id="welcome">
        <p className="eyebrow">A LITTLE ABOUT OUR KITCHEN</p>
        <h2>Welcome to FC Kitchen</h2>

        <p>
          Bringing you delicious food with quality ingredients,
          fresh preparation and a homemade touch. Every bite is
          made to bring a little happiness to your day.
        </p>
      </section>

      <section className="menu-section" id="menu">
        <div className="section-heading">
          <p className="eyebrow">MADE FOR YOUR CRAVINGS</p>
          <h2>Explore Our Food</h2>

          <p className="delivery-offer">
            Free Delivery on Orders Above ₹100!
          </p>

          <p>
            Find your favourite and add it to your cart.
          </p>
        </div>

        <div className="category-filters">
          <button
            className={selectedCategory === "All" ? "active" : ""}
            onClick={() => setSelectedCategory("All")}
          >
            All
          </button>

          {categories.map((category) => (
            <button
              key={category._id}
              className={
                selectedCategory === category.name ? "active" : ""
              }
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="status-message">
            Loading delicious food...
          </p>
        ) : error ? (
          <p className="status-message error-message">
            {error}
          </p>
        ) : filteredProducts.length === 0 ? (
          <p className="status-message">
            No products available.
          </p>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article
                className="product-card"
                key={product._id}
              >
                <div className="product-image">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                    />
                  ) : (
                    <div className="image-placeholder">
                      <span>FC</span>
                      <small>KITCHEN</small>
                    </div>
                  )}
                </div>

                <div className="product-info">
                  <h3>{product.name}</h3>

                  <p className="product-description">
                    {product.description ||
                      "Freshly prepared with love."}
                  </p>

                  <div className="product-bottom">
                    <strong>{formatPrice(product.price)}</strong>

                    <button
                      className="add-cart-btn"
                      disabled={product.isAvailable === false}
                      onClick={() => addToCart(product)}
                    >
                      {product.isAvailable === false
                        ? "Unavailable"
                        : "+ Add"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="menu-cart-link">
          <button
            className="primary-btn"
            onClick={() => {
              document.querySelector(".nav-cart")?.click();
            }}
          >
            View Your Cart ({cartCount})
          </button>
        </div>
      </section>

      <Footer settings={settings} />
      <BackToTop />
    </div>
  );
}

const adminStyles = {
  layout: {
    minHeight: "100vh",
    display: "flex",
    background: "#17110e",
    color: "#f5eee3",
    fontFamily: "Arial, sans-serif",
  },
  sidebar: {
    width: "250px",
    minWidth: "220px",
    background: "#211812",
    padding: "25px 15px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    borderRight: "1px solid #59432d",
  },
  logo: {
    color: "#e4c98c",
    fontFamily: "Georgia, serif",
    textAlign: "center",
    marginBottom: "20px",
  },
  adminLabel: {
    color: "#a98b5c",
    fontSize: "11px",
    letterSpacing: "2px",
    paddingLeft: "10px",
  },
  navButton: {
    padding: "13px",
    background: "transparent",
    color: "#f5eee3",
    border: "1px solid transparent",
    borderRadius: "6px",
    textAlign: "left",
    cursor: "pointer",
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  activeNav: {
    background: "#493622",
    border: "1px solid #c6a15b",
    color: "#e4c98c",
  },
  logout: {
    marginTop: "auto",
    padding: "12px",
    background: "#6d3028",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  main: {
    flex: 1,
    padding: "30px",
    minWidth: 0,
  },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap",
    borderBottom: "1px solid #59432d",
    paddingBottom: "20px",
    marginBottom: "30px",
  },
  eyebrow: {
    color: "#c6a15b",
    letterSpacing: "2px",
    fontSize: "11px",
  },
  status: {
    color: "#e4c98c",
    border: "1px solid #80643e",
    padding: "8px 13px",
    borderRadius: "20px",
    fontSize: "12px",
  },
  welcome: {
    background: "#211812",
    padding: "30px",
    borderRadius: "10px",
    border: "1px solid #59432d",
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "15px",
    marginTop: "25px",
  },
  card: {
    background: "#302217",
    border: "1px solid #80643e",
    color: "#f5eee3",
    padding: "22px",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    textAlign: "left",
    cursor: "pointer",
  },
  notice: {
    marginTop: "25px",
    padding: "15px",
    background: "#302217",
    borderLeft: "3px solid #c6a15b",
    color: "#e4c98c",
  },
  loading: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "#17110e",
    color: "#e4c98c",
  },
};

export default App;