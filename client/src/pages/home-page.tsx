
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/home/hero-section";
import ServiceCategories from "@/components/home/service-categories";
import EventTypes from "@/components/home/event-types";
import FeaturedProviders from "@/components/home/featured-providers";
import Testimonials from "@/components/home/testimonials";
import CTASection from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ServiceCategories />
        <EventTypes />
        <FeaturedProviders />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
