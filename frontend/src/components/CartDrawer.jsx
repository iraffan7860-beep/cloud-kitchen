import { useCart } from "../context/CartContext";

function CartDrawer({ isOpen, onClose, onCheckout }) {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    cartCount,
    cartTotal,
  } = useCart();

  const formatPrice = (price) => `₹${Number(price || 0).toFixed(0)}`;

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        background: "rgba(0,0,0,0.75)",
      }}
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          height: "100%",
          width: "min(420px, 100%)",
          background: "#211813",
          borderLeft: "1px solid #c6a15b",
          padding: "25px",
          overflowY: "auto",
          color: "#f5eee3",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(198,161,91,0.3)",
            paddingBottom: "18px",
          }}
        >
          <h2 style={{ color: "#e4c98c", fontFamily: "'Playfair Display', serif" }}>
            Your Cart
          </h2>

          <button
            onClick={onClose}
            aria-label="Close cart"
            style={{
              background: "transparent",
              border: "none",
              color: "#e4c98c",
              fontSize: "25px",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        {cart.length === 0 ? (
          <div style={{ textAlign: "center", padding: "55px 10px" }}>
            <div style={{ fontSize: "45px" }}>🛒</div>
            <h3 style={{ color: "#e4c98c", marginTop: "15px" }}>
              Your Cart is Empty
            </h3>
            <p style={{ color: "#b7a99a", marginTop: "10px" }}>
              Add something delicious from our menu!
            </p>
            <button
              onClick={onClose}
              style={buttonStyle}
            >
              Explore Menu
            </button>
          </div>
        ) : (
          <>
            {cart.map((item) => (
              <div
                key={item._id}
                style={{
                  padding: "20px 0",
                  borderBottom: "1px solid rgba(198,161,91,0.2)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                  <div>
                    <h4 style={{ color: "#e4c98c" }}>{item.name}</h4>
                    <p style={{ color: "#b7a99a", marginTop: "5px" }}>
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  <strong>{formatPrice(item.price * item.quantity)}</strong>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    marginTop: "15px",
                  }}
                >
                  <button
                    onClick={() => updateQuantity(item._id, -1)}
                    style={quantityStyle}
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() => updateQuantity(item._id, 1)}
                    style={quantityStyle}
                  >
                    +
                  </button>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    style={{
                      marginLeft: "auto",
                      color: "#d98b7e",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div style={{ marginTop: "25px" }}>
              <p style={{ color: "#b7a99a", fontSize: "13px" }}>
                Total Items: {cartCount}
              </p>

              <p style={{ color: "#9bd6a5", fontSize: "13px", marginTop: "10px" }}>
                Free Delivery on Orders Above ₹100!
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: "1px solid rgba(198,161,91,0.3)",
                  paddingTop: "18px",
                  marginTop: "18px",
                  color: "#e4c98c",
                  fontSize: "19px",
                  fontWeight: "bold",
                }}
              >
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>

              <button
                onClick={onCheckout}
                style={{
                  ...buttonStyle,
                  width: "100%",
                  marginTop: "25px",
                }}
              >
                Proceed to Checkout →
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

const buttonStyle = {
  background: "#c6a15b",
  color: "#17110e",
  border: "none",
  padding: "13px 20px",
  marginTop: "20px",
  fontWeight: "bold",
  cursor: "pointer",
};

const quantityStyle = {
  background: "transparent",
  border: "1px solid #c6a15b",
  color: "#e4c98c",
  width: "30px",
  height: "30px",
  cursor: "pointer",
};

export default CartDrawer;