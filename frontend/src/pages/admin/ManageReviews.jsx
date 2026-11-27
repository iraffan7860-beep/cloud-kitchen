
import { useEffect, useState } from "react";

const API_URL = "https://https://fc-kitchen-bds4.onrender.com/api";

function ManageReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const getToken = () => localStorage.getItem("fc-admin-token");

  const loadReviews = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/testimonials`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load reviews.");
      }

      setReviews(
        data.testimonials || data.data?.testimonials || data.data || []
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const approveReview = async (id) => {
    try {
      const response = await fetch(`${API_URL}/testimonials/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ isApproved: true }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to approve review.");
      }

      setMessage("Review approved successfully!");
      await loadReviews();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/testimonials/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete review.");
      }

      setMessage("Review deleted successfully!");
      await loadReviews();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <section style={styles.container}>
      <h2 style={styles.heading}>Manage Customer Reviews</h2>

      {message && <p style={styles.message}>{message}</p>}

      {loading ? (
        <p>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p>No customer reviews yet.</p>
      ) : (
        <>
          <p style={styles.count}>
            Total Reviews: {reviews.length}
          </p>

          {reviews.map((item) => (
            <article key={item._id} style={styles.card}>
              <div style={styles.top}>
                <div>
                  <h3 style={styles.name}>{item.customerName}</h3>

                  <p style={styles.stars}>
                    {"★".repeat(item.rating)}
                    <span style={styles.emptyStars}>
                      {"★".repeat(5 - item.rating)}
                    </span>
                  </p>
                </div>

                <span
                  style={{
                    ...styles.status,
                    background: item.isApproved ? "#245b35" : "#805c24",
                  }}
                >
                  {item.isApproved ? "Approved" : "Pending"}
                </span>
              </div>

              <p style={styles.review}>{item.review}</p>

              <div style={styles.actions}>
                {!item.isApproved && (
                  <button
                    style={styles.approve}
                    onClick={() => approveReview(item._id)}
                  >
                    Approve
                  </button>
                )}

                <button
                  style={styles.delete}
                  onClick={() => deleteReview(item._id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </>
      )}

      <button style={styles.refresh} onClick={loadReviews}>
        Refresh Reviews
      </button>
    </section>
  );
}

const styles = {
  container: {
    background: "#211812",
    color: "#f5eee3",
    padding: "25px",
    borderRadius: "10px",
  },
  heading: {
    color: "#e4c98c",
  },
  message: {
    color: "#e4c98c",
  },
  count: {
    color: "#c8b9a5",
  },
  card: {
    background: "#17110e",
    border: "1px solid #80643e",
    borderRadius: "8px",
    padding: "18px",
    marginBottom: "15px",
  },
  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  name: {
    color: "#e4c98c",
    margin: 0,
  },
  stars: {
    color: "#f5b942",
    fontSize: "20px",
    margin: "7px 0",
  },
  emptyStars: {
    color: "#665b4d",
  },
  status: {
    color: "white",
    padding: "6px 10px",
    borderRadius: "5px",
    fontSize: "12px",
  },
  review: {
    color: "#eee0c9",
    lineHeight: 1.6,
  },
  actions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  approve: {
    background: "#347747",
    color: "white",
    padding: "9px 16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  delete: {
    background: "#8b3434",
    color: "white",
    padding: "9px 16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  refresh: {
    marginTop: "15px",
    background: "#c6a15b",
    color: "#17110e",
    padding: "11px 18px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default ManageReviews;
