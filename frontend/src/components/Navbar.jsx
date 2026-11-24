import { useState } from "react";
import FoodCart from "./FoodCart";
import CartDrawer from "./CartDrawer";

function Navbar({ onCheckout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const handleCheckout = () => {
    setCartOpen(false);
    onCheckout?.();
  };

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Find Us", href: "#find-kitchen" },

    { label: "Menu", href: "#menu" },
  ];

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: "#17110e",
          borderBottom: "1px solid rgba(198,161,91,0.35)",
          padding: "15px 6%",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <a
            href="#home"
            style={{
              textDecoration: "none",
              color: "#e4c98c",
              fontFamily: "'Playfair Display', serif",
              fontSize: "27px",
              fontWeight: "bold",
            }}
          >
            FC Kitchen
          </a>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
            style={{
              display: "none",
              background: "transparent",
              border: "1px solid #c6a15b",
              color: "#e4c98c",
              padding: "8px 12px",
            }}
            className="mobile-menu-button"
          >
            ☰
          </button>

          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "25px",
              flexWrap: "wrap",
            }}
            className={menuOpen ? "fc-nav-open" : "fc-nav"}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  color: "#f5eee3",
                  textDecoration: "none",
                  fontSize: "13px",
                  letterSpacing: "1px",
                }}
              >
                {link.label}
              </a>
            ))}

            <FoodCart onClick={() => setCartOpen(true)} />
          </nav>
        </div>
      </header>

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={handleCheckout}
      />
    </>
  );
}

export default Navbar;