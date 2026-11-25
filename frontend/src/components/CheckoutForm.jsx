
import { useState } from "react";
import { useCart } from "../context/CartContext";

const API_URL = import.meta.env.VITE_API_URL || "http://https://fc-kitchen-bds4.onrender.com";

function CheckoutForm({ onBack }) {
  const { cart, cartCount, cartTotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    orderType: "Delivery",
    address: "",
    instructions: ""
  });

  const [orderOpened, setOrderOpened] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleWhatsAppOrder = () => {
    if (
      !formData.customerName.trim() ||
      !formData.phone.trim() ||
      (formData.orderType === "Delivery" && !formData.address.trim())
    ) {
      alert("Please fill all required details.");
      return;
    }

    if (!cart || cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const orderItems = cart
      .map((item) => {
        return `${item.name} x ${item.quantity} - ₹${
          item.price * item.quantity
        }`;
      })
      .join("\n");

    const message = `
*FC KITCHEN ORDER*

Customer: ${formData.customerName}
Phone: ${formData.phone}
Order Type: ${formData.orderType}

${formData.orderType === "Delivery"
  ? `Address: ${formData.address}`
  : ""}

*ORDER ITEMS*
${orderItems}

Total Items: ${cartCount}
Total Amount: ₹${cartTotal}

Instructions: ${formData.instructions || "None"}
`;

    const whatsappNumber = "916300612693";

    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappURL, "_blank");
    setOrderOpened(true);
  };

  const handleReceivedOrder = () => {
    setShowReview(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!review.trim()) {
      setError("Please write your review.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/testimonials`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customerName: formData.customerName,
          rating,
          review: review.trim()
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to submit review.");
      }

      setReviewSubmitted(true);
      clearCart();

    } catch (error) {
      setError(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (reviewSubmitted) {
    return (
      <div className="checkout-form">
        <div className="review-success">
          <h2>Thank You!</h2>
          <p>Your review has been submitted successfully.</p>
          <p>It will appear on our website after admin approval.</p>

          <button onClick={onBack}>
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-form">
      <h2>Checkout</h2>

      {!showReview ? (
        <>
          <div className="checkout-details">
            <label>Customer Name *</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />

            <label>Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
            />

            <label>Order Type *</label>
            <select
              name="orderType"
              value={formData.orderType}
              onChange={handleChange}
            >
              <option value="Delivery">Delivery</option>
              <option value="Pickup">Pickup</option>
            </select>

            {formData.orderType === "Delivery" && (
              <>
                <label>Delivery Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter delivery address"
                  required
                />
              </>
            )}

            <label>Special Instructions</label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              placeholder="Any special instructions?"
            />
          </div>

          <div className="checkout-summary">
            <h3>Order Summary</h3>

            {cart?.map((item) => (
              <p key={item._id || item.id}>
                {item.name} x {item.quantity} — ₹
                {item.price * item.quantity}
              </p>
            ))}

            <h3>Total: ₹{cartTotal}</h3>
          </div>

          {!orderOpened ? (
            <button onClick={handleWhatsAppOrder}>
              Place Order on WhatsApp
            </button>
          ) : (
            <button onClick={handleReceivedOrder}>
              I Received My Order
            </button>
          )}

          <button onClick={onBack}>
            Back
          </button>
        </>
      ) : (
        <form onSubmit={handleReviewSubmit} className="review-form">
          <h2>Share Your Experience</h2>
          <p>How was your experience with FC Kitchen?</p>

          <div className="review-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                style={{
                  color: star <= rating ? "#f5a623" : "#ccc",
                  fontSize: "32px",
                  background: "none",
                  border: "none",
                  cursor: "pointer"
                }}
                aria-label={`${star} star${star > 1 ? "s" : ""}`}
              >
                ★
              </button>
            ))}
          </div>

          <p>{rating} out of 5 stars</p>

          <label>Write Your Review</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Tell us about your experience..."
            rows="5"
            required
          />

          {error && <p className="error-message">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}
    </div>
  );
}

export default CheckoutForm;
