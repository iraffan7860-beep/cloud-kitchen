import { useEffect, useState } from "react";

const API_URL = "http://https://fc-kitchen-bds4.onrender.com/api";

function ManageSetting() {
  const [form, setForm] = useState({
    brandName: "FC Kitchen",
    tagline: "",
    phone: "",
    email: "",
    instagramUrl: "",
    address: "",
    mapsUrl: "",
    deliveryRadiusKm: 5,
    deliveryCharge: 0,
    openingTime: "07:00",
    closingTime: "00:00",
    isAvailable: true,
    availabilityMessage: "Today we are not accepting orders.",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const getToken = () => localStorage.getItem("fc-admin-token");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch(`${API_URL}/settings`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load settings.");
        }

        const settings = data.settings || data.data?.settings || data.data;

        if (settings) {
          setForm((previous) => ({
            ...previous,
            ...settings,
            deliveryRadiusKm: settings.deliveryRadiusKm ?? 5,
            deliveryCharge: settings.deliveryCharge ?? 0,
            isAvailable: settings.isAvailable ?? true,
            availabilityMessage:
              settings.availabilityMessage ??
              "Today we are not accepting orders.",
          }));
        }
      } catch (error) {
        setMessage(error.message);
      }
    };

    loadSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        ...form,
        deliveryRadiusKm: Number(form.deliveryRadiusKm),
        deliveryCharge: Number(form.deliveryCharge),
      };

      const response = await fetch(`${API_URL}/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update settings.");
      }

      setMessage("FC Kitchen settings updated successfully!");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: "Brand Name", name: "brandName", type: "text" },
    { label: "Tagline", name: "tagline", type: "text" },
    { label: "Phone Number", name: "phone", type: "tel" },
    { label: "Email Address", name: "email", type: "email" },
    { label: "Instagram URL", name: "instagramUrl", type: "url" },
    { label: "Full Address", name: "address", type: "text" },
    { label: "Google Maps URL", name: "mapsUrl", type: "url" },
    {
      label: "Delivery Radius (KM)",
      name: "deliveryRadiusKm",
      type: "number",
    },
    {
      label: "Delivery Charge (₹)",
      name: "deliveryCharge",
      type: "number",
    },
    { label: "Opening Time", name: "openingTime", type: "time" },
    { label: "Closing Time", name: "closingTime", type: "time" },
  ];

  return (
    <section style={styles.container}>
      <h2 style={styles.heading}>Website Settings</h2>

      <p style={styles.subtitle}>
        Manage your FC Kitchen business information.
      </p>

      {/* Kitchen Availability */}
      <div style={styles.availabilityBox}>
        <h3 style={styles.availabilityHeading}>
          Kitchen Availability
        </h3>

        <label style={styles.availabilityToggle}>
          <input
            type="checkbox"
            name="isAvailable"
            checked={form.isAvailable}
            onChange={handleChange}
          />

          <span>
            {form.isAvailable
              ? "Accepting Orders"
              : "Not Accepting Orders"}
          </span>
        </label>

        <p style={styles.availabilityInfo}>
          {form.isAvailable
            ? "Customers can place orders when the website is ready for ordering."
            : "Customers will see your unavailable message."}
        </p>

        <label style={styles.label}>
          Customer Announcement
        </label>

        <textarea
          name="availabilityMessage"
          value={form.availabilityMessage}
          onChange={handleChange}
          placeholder="Write a message for your customers..."
          rows={3}
          style={styles.input}
        />
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        {fields.map((field) => (
          <div key={field.name} style={styles.field}>
            <label style={styles.label}>{field.label}</label>

            <input
              type={field.type}
              name={field.name}
              value={form[field.name] ?? ""}
              onChange={handleChange}
              min={field.type === "number" ? 0 : undefined}
              required={["brandName", "phone", "email"].includes(
                field.name
              )}
              style={styles.input}
            />
          </div>
        ))}

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </form>

      {message && <p style={styles.message}>{message}</p>}
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
  heading: { color: "#e4c98c" },
  subtitle: { color: "#c8b9a5" },

  availabilityBox: {
    padding: "18px",
    marginBottom: "25px",
    border: "1px solid #80643e",
    borderRadius: "8px",
    background: "#17110e",
  },

  availabilityHeading: {
    color: "#e4c98c",
    marginTop: 0,
  },

  availabilityToggle: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: "bold",
    padding: "10px 0",
    cursor: "pointer",
  },

  availabilityInfo: {
    color: "#c8b9a5",
    fontSize: "14px",
    marginBottom: "15px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "17px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  label: { color: "#e4c98c" },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    background: "#17110e",
    color: "white",
    border: "1px solid #80643e",
    borderRadius: "5px",
    fontFamily: "inherit",
  },

  button: {
    padding: "13px",
    background: "#c6a15b",
    color: "#17110e",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  message: { color: "#e4c98c" },
};

export default ManageSetting;