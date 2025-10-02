import Hero from '@/components/Hero';
import Features from '@/components/Features';
import ProductShowcase from '@/components/ProductShowcase';
import Applications from '@/components/Applications';
import HowItWorks from '@/components/HowItWorks';
import VideoGallery from '@/components/VideoGallery';
import ContactCTA from '@/components/ContactCTA';

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <ProductShowcase />
      <HowItWorks />
      <Applications />
      <VideoGallery />
      <ContactCTA />
    </>
  );
}
