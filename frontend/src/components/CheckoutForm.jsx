import { useState } from "react";
import { useCart } from "../context/CartContext";

function CheckoutForm({ settings, onBack }) {
  const { cart, cartCount, cartTotal } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [orderType, setOrderType] = useState("Delivery");
  const [address, setAddress] = useState("");
  const [instructions, setInstructions] = useState("");
  const [error, setError] = useState("");
  const [showFreeDeliveryPopup, setShowFreeDeliveryPopup] = useState(false);

  const formatPrice = (price) => `₹${Number(price || 0).toFixed(0)}`;

  // Free delivery applies only when subtotal is ABOVE ₹100.
  const isFreeDelivery = cartTotal > 100;

  // Use the delivery charge saved in admin settings.
  const configuredDeliveryCharge = Number(settings?.deliveryCharge || 0);

  const deliveryCharge =
    orderType === "Delivery" && !isFreeDelivery
      ? configuredDeliveryCharge
      : 0;

  const grandTotal = cartTotal + deliveryCharge;

  const handleOrderTypeChange = (event) => {
    const selectedType = event.target.value;

    setOrderType(selectedType);
    setError("");

    if (selectedType === "Delivery" && cartTotal > 100) {
      setShowFreeDeliveryPopup(true);
    }
  };

  const placeOrder = (event) => {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (orderType === "Delivery" && !address.trim()) {
      setError("Please enter your delivery address.");
      return;
    }

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    const itemsMessage = cart
      .map(
        (item) =>
          `• ${item.name} x ${item.quantity} = ${formatPrice(
            item.price * item.quantity
          )}`
      )
      .join("\n");

    const deliveryMessage =
      orderType === "Pickup"
        ? "Delivery Charge: ₹0 (Self Pickup)"
        : isFreeDelivery
        ? "Delivery Charge: FREE"
        : configuredDeliveryCharge > 0
        ? `Delivery Charge: ${formatPrice(deliveryCharge)}`
        : "Delivery Charge: To be confirmed by FC Kitchen";

    const totalMessage =
      orderType === "Delivery" &&
      !isFreeDelivery &&
      configuredDeliveryCharge <= 0
        ? "Total Before Delivery Charge: " + formatPrice(cartTotal)
        : "Grand Total: " + formatPrice(grandTotal);

    const message = `
*NEW ORDER - FC KITCHEN*

*Customer Details*
Name: ${name.trim()}
Phone: ${phone.trim()}
Order Type: ${orderType}
${orderType === "Delivery" ? `Address: ${address.trim()}` : ""}

*Order Items*
${itemsMessage}

*Total Items:* ${cartCount}
*Subtotal:* ${formatPrice(cartTotal)}
${deliveryMessage}
${totalMessage}

*Special Instructions:*
${instructions.trim() || "None"}

Please confirm my order. Thank you!
`.trim();

    const businessPhone = String(
      settings?.phone || "6300612693"
    ).replace(/\D/g, "");

    const whatsappNumber =
      businessPhone.length === 10
        ? `91${businessPhone}`
        : businessPhone;

    const whatsappURL =
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank", "noopener,noreferrer");
  };

  const inputStyle = {
    width: "100%",
    padding: "13px",
    marginTop: "8px",
    background: "#17110e",
    border: "1px solid rgba(198,161,91,0.35)",
    color: "#f5eee3",
    borderRadius: "3px",
    outline: "none",
    fontFamily: "inherit",
  };

  const labelStyle = {
    display: "block",
    color: "#e4c98c",
    fontSize: "13px",
    marginTop: "18px",
  };

  return (
    <section
      style={{
        padding: "65px 7%",
        background: "#17110e",
        minHeight: "70vh",
      }}
    >
      <div style={{ maxWidth: "850px", margin: "auto" }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            background: "transparent",
            border: "1px solid #c6a15b",
            color: "#e4c98c",
            padding: "10px 18px",
            cursor: "pointer",
            marginBottom: "25px",
          }}
        >
          ← Back to Cart
        </button>

        <div style={{ textAlign: "center", marginBottom: "35px" }}>
          <p className="eyebrow">ALMOST THERE</p>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "36px",
              color: "#f5eee3",
            }}
          >
            Complete Your Order
          </h2>
          <p style={{ color: "#b7a99a", marginTop: "10px" }}>
            Enter your details to continue on WhatsApp.
          </p>
        </div>

        <form
          onSubmit={placeOrder}
          style={{
            background: "#211813",
            border: "1px solid rgba(198,161,91,0.25)",
            padding: "25px",
            borderRadius: "5px",
          }}
        >
          <h3 style={{ color: "#e4c98c" }}>Customer Details</h3>

          <label style={labelStyle}>
            Full Name *
            <input
              style={inputStyle}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </label>

          <label style={labelStyle}>
            Phone Number *
            <input
              style={inputStyle}
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              placeholder="10-digit mobile number"
              required
            />
          </label>

          <label style={labelStyle}>
            Order Type *
            <select
              style={inputStyle}
              value={orderType}
              onChange={handleOrderTypeChange}
            >
              <option value="Delivery">Home Delivery</option>
              <option value="Pickup">Self Pickup</option>
            </select>
          </label>

          {orderType === "Delivery" && (
            <label style={labelStyle}>
              Delivery Address *
              <textarea
                style={{ ...inputStyle, minHeight: "90px", resize: "vertical" }}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your complete delivery address"
                required
              />
            </label>
          )}

          <label style={labelStyle}>
            Special Instructions (Optional)
            <textarea
              style={{ ...inputStyle, minHeight: "85px", resize: "vertical" }}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Example: Less spicy, no onions..."
            />
          </label>

          <div
            style={{
              marginTop: "30px",
              padding: "20px",
              background: "#17110e",
              border: "1px solid rgba(198,161,91,0.25)",
            }}
          >
            <h3 style={{ color: "#e4c98c", marginBottom: "15px" }}>
              Order Summary
            </h3>

            <p style={{ color: "#e4c98c", fontSize: "13px", marginBottom: "18px" }}>
              Free Delivery on Orders Above ₹100!
            </p>

            {cart.map((item) => (
              <div
                key={item._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "12px",
                  marginBottom: "12px",
                  color: "#b7a99a",
                  fontSize: "13px",
                }}
              >
                <span>{item.name} × {item.quantity}</span>
                <strong style={{ color: "#f5eee3" }}>
                  {formatPrice(item.price * item.quantity)}
                </strong>
              </div>
            ))}

            <div
              style={{
                borderTop: "1px solid rgba(198,161,91,0.25)",
                paddingTop: "15px",
                marginTop: "15px",
                display: "flex",
                justifyContent: "space-between",
                color: "#b7a99a",
                fontSize: "14px",
              }}
            >
              <span>Subtotal</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "12px",
                color: isFreeDelivery && orderType === "Delivery"
                  ? "#9bd6a5"
                  : "#b7a99a",
                fontSize: "14px",
              }}
            >
              <span>Delivery Charge</span>
              <strong>
                {orderType === "Pickup"
                  ? "₹0"
                  : isFreeDelivery
                  ? "FREE"
                  : configuredDeliveryCharge > 0
                  ? formatPrice(deliveryCharge)
                  : "To be confirmed"}
              </strong>
            </div>

            <div
              style={{
                borderTop: "1px solid rgba(198,161,91,0.25)",
                paddingTop: "15px",
                marginTop: "15px",
                display: "flex",
                justifyContent: "space-between",
                color: "#e4c98c",
                fontSize: "18px",
                fontWeight: "700",
              }}
            >
              <span>
                {orderType === "Delivery" &&
                !isFreeDelivery &&
                configuredDeliveryCharge <= 0
                  ? "Subtotal"
                  : "Grand Total"}
              </span>
              <span>{formatPrice(grandTotal)}</span>
            </div>

            {orderType === "Delivery" && isFreeDelivery && (
              <p style={{ color: "#9bd6a5", fontSize: "12px", marginTop: "12px" }}>
                Congratulations! Your delivery is free.
              </p>
            )}

            {orderType === "Delivery" &&
              !isFreeDelivery &&
              configuredDeliveryCharge <= 0 && (
                <p style={{ color: "#b7a99a", fontSize: "11px", marginTop: "12px" }}>
                  Delivery charge will be confirmed by FC Kitchen.
                </p>
              )}
          </div>

          {error && (
            <p style={{ color: "#ff9a8b", marginTop: "18px", fontSize: "13px" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            className="checkout-btn"
            style={{ marginTop: "22px" }}
          >
            Place Order on WhatsApp
          </button>
        </form>
      </div>

      {showFreeDeliveryPopup && (
        <div
          onClick={() => setShowFreeDeliveryPopup(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="free-delivery-title"
            style={{
              width: "100%",
              maxWidth: "400px",
              padding: "35px 25px",
              textAlign: "center",
              background: "#211813",
              border: "1px solid #c6a15b",
              borderRadius: "8px",
              boxShadow: "0 15px 50px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ fontSize: "45px", marginBottom: "12px" }}>
              🎉
            </div>

            <p
              style={{
                color: "#b7a99a",
                letterSpacing: "3px",
                fontSize: "11px",
              }}
            >
              A LITTLE SURPRISE FROM FC KITCHEN
            </p>

            <h2
              id="free-delivery-title"
              style={{
                color: "#e4c98c",
                fontFamily: "'Playfair Display', serif",
                fontSize: "30px",
                margin: "12px 0",
              }}
            >
              YOU GOT FREE DELIVERY!
            </h2>

            <p style={{ color: "#f5eee3", lineHeight: "1.7" }}>
              Your order is above ₹100. Delivery charges are on us!
            </p>

            <button
              type="button"
              onClick={() => setShowFreeDeliveryPopup(false)}
              style={{
                marginTop: "25px",
                padding: "12px 25px",
                background: "#c6a15b",
                border: "none",
                color: "#17110e",
                fontWeight: "700",
                cursor: "pointer",
                borderRadius: "3px",
              }}
            >
              YAY! CONTINUE
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default CheckoutForm;