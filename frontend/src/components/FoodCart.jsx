import { useCart } from "../context/CartContext";

function FoodCart({ onClick }) {
  const { cartCount } = useCart();

  return (
    <button
      className="nav-cart"
      onClick={onClick}
      aria-label={`Open cart, ${cartCount} items`}
      style={{
        position: "relative",
        background: "transparent",
        border: "1px solid #c6a15b",
        color: "#e4c98c",
        padding: "9px 15px",
        cursor: "pointer",
        fontSize: "18px",
      }}
    >
      🛒 Cart

      {cartCount > 0 && (
        <span
          style={{
            position: "absolute",
            top: "-9px",
            right: "-9px",
            background: "#c6a15b",
            color: "#17110e",
            borderRadius: "50%",
            minWidth: "20px",
            height: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "11px",
            fontWeight: "bold",
          }}
        >
          {cartCount}
        </span>
      )}
    </button>
  );
}

export default FoodCart;