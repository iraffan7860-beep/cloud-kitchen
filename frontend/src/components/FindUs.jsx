function FindUs({ settings = {} }) {
  const phone = settings.phone || "6300612693";

  const address =
    settings.address ||
    "Plot No. 5, Khizra Enclave, Alkapur Road, Ibrahim Bagh, Hyderabad, Telangana, India.";

  const mapsUrl =
    settings.mapsUrl ||
    "https://maps.app.goo.gl/6c4n4LfbwiU7robb7?g_st=ac";

  const instagramUrl =
    settings.instagramUrl ||
    "https://www.instagram.com/castle_cafe_.8811/";

  return (
    <section className="find-section" id="find-kitchen">
      <div className="section-heading">
        <span>COME VISIT US</span>
        <h2>Find FC Kitchen</h2>
        <p>We'd love to hear from you!</p>
      </div>

      <div className="find-grid">
        <div className="find-card">
          <span>📍</span>
          <h3>Our Location</h3>
          <p>{address}</p>
          <a href={mapsUrl} target="_blank" rel="noreferrer">
            Get Directions →
          </a>
        </div>

        <div className="find-card">
          <span>📞</span>
          <h3>Call Us</h3>
          <p>{phone}</p>
          <a href={`tel:${phone}`}>Call Now →</a>
        </div>

        <div className="find-card">
          <span>📷</span>
          <h3>Instagram</h3>
          <p>Follow us for delicious updates.</p>
          <a href={instagramUrl} target="_blank" rel="noreferrer">
            Visit Instagram →
          </a>
        </div>

        <div className="find-card">
          <span>🕒</span>
          <h3>Opening Hours</h3>
          <p>
            {settings.openingTime || "07:00"} –{" "}
            {settings.closingTime || "00:00"}
          </p>
          <p>Delivery available within 5 km.</p>
        </div>
      </div>
    </section>
  );
}

export default FindUs;