import Hero from "../components/Hero";
import FindUs from "../components/FindUs";
import WelcomeSection from "../components/WelcomeSection";
import MenuSection from "../components/MenuSection";
import ReviewSection from "../components/ReviewSection";
import Footer from "../components/Footer";

function HomePage({
  products = [],
  categories = [],
  settings = {},
  loading = false,
}) {
  return (
    <>
      <Hero />

      <FindUs settings={settings} />

      <WelcomeSection />

      <MenuSection
        products={products}
        categories={categories}
        loading={loading}
      />

      <ReviewSection />

      <Footer settings={settings} />
    </>
  );
}

export default HomePage;