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
import AdminDashboard from "./pages/admin/AdminDashboard";

const API_URL = "https://fc-kitchen-backend.onrender.com/api";

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

  const {
    addToCart,
    updateQuantity,
    cart,
    cartCount,
  } = useCart();

  const isKitchenClosed = settings.isAvailable === false;

  // Navigation
  const navigate = (path) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToCheckout = () => {
    if (isKitchenClosed || loading) return;
    navigate("/checkout");
  };

  const handleViewCart = () => {
    if (cartCount > 0) {
      goToCheckout();
    }
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

  // Load public website data
  useEffect(() => {
    if (currentPath.startsWith("/admin")) {
      setLoading(false);
      return;
    }

    setLoading(true);

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

        console.log("SETTINGS DATA:", settingsData);
      } catch {
        setError("Unable to load the menu. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    loadWebsite();
  }, [currentPath]);

  // Filter products
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
      navigate("/admin/login");
    };

    return <AdminDashboard onLogout={logout} />;
  }

  // CHECKOUT PAGE
  if (currentPath === "/checkout") {
    if (loading) {
      return (
        <div style={adminStyles.loading}>
          Loading FC Kitchen...
        </div>
      );
    }

    if (isKitchenClosed) {
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
      <Navbar onCheckout={goToCheckout} />

      <section
        className={`hero ${isKitchenClosed ? "hero-closed" : ""}`}
        id="home"
      >
        {isKitchenClosed ? (
          <div className="kitchen-closed-banner">
            <div className="closed-ribbon">
              <span className="closed-dot"></span>
              TEMPORARILY CLOSED
            </div>

            <h2>WE'RE CLOSED RIGHT NOW</h2>

            <p>
              {settings.availabilityMessage ||
                "We're not accepting orders right now. Please visit again soon!"}
            </p>

            <span className="closed-status">
              NOT ACCEPTING ORDERS
            </span>
          </div>
        ) : (
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
                onClick={handleViewCart}
              >
                View Cart ({cartCount})
              </button>
            </div>
          </div>
        )}
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
            {filteredProducts.map((product) => {
              const cartItem = cart.find(
                (item) => item._id === product._id
              );

              const quantity = cartItem?.quantity || 0;

              return (
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

                      {product.isAvailable === false ||
                      isKitchenClosed ? (
                        <button
                          className="add-cart-btn"
                          disabled
                        >
                          {isKitchenClosed
                            ? "Kitchen Closed"
                            : "Unavailable"}
                        </button>
                      ) : quantity === 0 ? (
                        <button
                          className="add-cart-btn"
                          onClick={() => addToCart(product)}
                        >
                          + Add
                        </button>
                      ) : (
                        <div className="quantity-control">
                          <button
                            type="button"
                            aria-label={`Decrease ${product.name} quantity`}
                            onClick={() =>
                              updateQuantity(product._id, -1)
                            }
                          >
                            −
                          </button>

                          <span>{quantity}</span>

                          <button
                            type="button"
                            aria-label={`Increase ${product.name} quantity`}
                            onClick={() =>
                              updateQuantity(product._id, 1)
                            }
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="menu-cart-link">
          <button
            className="primary-btn"
            onClick={handleViewCart}
            disabled={isKitchenClosed || cartCount === 0}
          >
            {isKitchenClosed
              ? "Kitchen Closed"
              : `View Your Cart (${cartCount})`}
          </button>
        </div>
      </section>

      {/* STICKY VIEW CART BUTTON */}
      {cartCount > 0 && !isKitchenClosed && (
        <div className="sticky-cart-bar">
          <button onClick={handleViewCart}>
            <span>
              {cartCount} {cartCount === 1 ? "Item" : "Items"} Added
            </span>

            <strong>View Cart →</strong>
          </button>
        </div>
      )}

      <Footer settings={settings} />
      <BackToTop />
    </div>
  );
}

const adminStyles = {
  loading: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "#17110e",
    color: "#e4c98c",
  },
};

export default App;