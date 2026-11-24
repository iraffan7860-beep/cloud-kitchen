import { useEffect, useState } from "react";

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      style={{
        position: "fixed",
        bottom: "25px",
        right: "25px",
        zIndex: 1000,
        width: "45px",
        height: "45px",
        border: "1px solid #c6a15b",
        borderRadius: "50%",
        background: "#211813",
        color: "#e4c98c",
        fontSize: "22px",
        cursor: "pointer",
        boxShadow: "0 5px 20px rgba(0,0,0,0.4)",
      }}
    >
      ↑
    </button>
  );
}

export default BackToTop;