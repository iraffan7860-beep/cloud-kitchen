function Footer({ settings = {} }) {
  const phone = settings.phone || "6300612693";
  const email = settings.email || "iraffan7860@gmail.com";
  const instagram =
    settings.instagramUrl ||
    "https://www.instagram.com/castle_cafe_.8811/";

  const mapsUrl =
    settings.mapsUrl ||
    "https://maps.app.goo.gl/6c4n4LfbwiU7robb7?g_st=ac";

  const address =
    settings.address ||
    "Hyderabad, Telangana, India";

  return (
    <footer
      style={{
        background: "#110c09",
        color: "#b7a99a",
        padding: "55px 7% 20px",
        borderTop: "1px solid rgba(198,161,91,0.35)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "35px",
        }}
      >
        <div>
          <h2
            style={{
              color: "#e4c98c",
              fontFamily: "'Playfair Display', serif",
              fontSize: "29px",
            }}
          >
            FC Kitchen
          </h2>

          <p style={{ lineHeight: "1.8", marginTop: "15px" }}>
            A Taste Like Home in Every Bite.
          </p>

          <p style={{ marginTop: "15px", fontSize: "13px" }}>
            Delicious moments, freshly prepared for you.
          </p>
        </div>

        <div>
          <h3 style={headingStyle}>Quick Links</h3>

          {[
            ["Home", "#home"],
            ["Find Us", "#find-kitchen"],
            ["Welcome", "#welcome"],
            ["Our Menu", "#menu"],
          ].map(([label, href]) => (
            <a key={label} href={href} style={linkStyle}>
              {label}
            </a>
          ))}
        </div>

        <div>
          <h3 style={headingStyle}>Contact Us</h3>

          <a href={`tel:${phone}`} style={linkStyle}>
            Phone: {phone}
          </a>

          <a href={`mailto:${email}`} style={linkStyle}>
            Email: {email}
          </a>

          <a
            href={instagram}
            target="_blank"
            rel="noreferrer"
            style={linkStyle}
          >
            Instagram
          </a>
        </div>

        <div>
          <h3 style={headingStyle}>Visit FC Kitchen</h3>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            style={linkStyle}
          >
            {address}
          </a>

          <p style={{ marginTop: "12px", fontSize: "13px", lineHeight: "1.8" }}>
            Opening Hours: {settings.openingTime || "7 AM"} –{" "}
            {settings.closingTime || "12 AM"}
          </p>

          <p style={{ marginTop: "10px", fontSize: "13px" }}>
            Delivery within 5 km
          </p>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1200px",
          margin: "45px auto 0",
          borderTop: "1px solid rgba(198,161,91,0.2)",
          paddingTop: "20px",
          textAlign: "center",
          fontSize: "12px",
        }}
      >
        © {new Date().getFullYear()} FC Kitchen. All Rights Reserved.
      </div>
    </footer>
  );
}

const headingStyle = {
  color: "#e4c98c",
  fontFamily: "'Playfair Display', serif",
  marginBottom: "18px",
};

const linkStyle = {
  display: "block",
  color: "#b7a99a",
  textDecoration: "none",
  marginBottom: "13px",
  fontSize: "13px",
  lineHeight: "1.7",
};

export default Footer;