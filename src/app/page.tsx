import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import WhyChooseUs from '@/components/WhyChooseUs';
import Gallery from '@/components/Gallery';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default async function Home() {
  // Fetch content from API
  const contentRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/content`, {
    cache: 'no-store'
  });
  const content = await contentRes.json();

  // Fetch services from API
  const servicesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/services`, {
    cache: 'no-store'
  });
  const services = await servicesRes.json();

  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero content={content} />
      <About content={content} />
      <Services services={services} />
      <WhyChooseUs />
      <Gallery />
      <Testimonials />
      <Contact content={content} />
      <Footer content={content} />
    </main>
  );
}
