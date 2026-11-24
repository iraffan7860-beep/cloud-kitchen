import { useState } from "react";
import { useCart } from "../context/CartContext";

function MenuSection({
  products = [],
  categories = [],
  loading = false,
}) {
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter(
          (product) =>
            product.category?.name === activeCategory ||
            product.category === activeCategory
        );

  const openCart = () => {
    document.querySelector(".nav-cart")?.click();
  };

  return (
    <section className="menu-section" id="menu">
      <div className="section-heading">
        <span>MADE WITH LOVE</span>
        <h2>Explore Our Food</h2>

        <p className="delivery-offer">
          Free Delivery on Orders Above ₹100!
        </p>
      </div>

      <div className="category-list">
        <button
          className={activeCategory === "All" ? "active" : ""}
          onClick={() => setActiveCategory("All")}
        >
          All
        </button>

        {categories.map((category) => (
          <button
            key={category._id}
            className={
              activeCategory === category.name ? "active" : ""
            }
            onClick={() => setActiveCategory(category.name)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="menu-message">Loading delicious food...</p>
      ) : filteredProducts.length === 0 ? (
        <p className="menu-message">
          No products available in this category.
        </p>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <article className="product-card" key={product._id}>
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
              ) : (
                <div className="product-image-placeholder">
                  FC Kitchen
                </div>
              )}

              <div className="product-info">
                <h3>{product.name}</h3>

                <p>{product.description}</p>

                <div className="product-bottom">
                  <strong>₹{product.price}</strong>

                  <button
                    onClick={() => {
                      addToCart(product);
                    }}
                    disabled={!product.isAvailable}
                  >
                    {product.isAvailable ? "Add +" : "Unavailable"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <button className="view-cart-button" onClick={openCart}>
        View Your Cart
      </button>
    </section>
  );
}

export default MenuSection;