import About from "@/components/About";
import Barbers from "@/components/Barbers";
import BookBar from "@/components/BookBar";
import Concierge from "@/components/Concierge";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import Locations from "@/components/Locations";
import Marquee from "@/components/Marquee";
import Offer from "@/components/Offer";
import Reviews from "@/components/Reviews";
import Services from "@/components/Services";
import SiteHeader from "@/components/SiteHeader";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Marquee />
        <About />
        <Services />
        <Gallery />
        <Barbers />
        <Locations />
        <Reviews />
        <Faq />
        <Offer />
      </main>
      <Footer />
      <Concierge />
      <BookBar />
    </>
  );
}
