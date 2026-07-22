import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import WhyChooseUs from '@/components/WhyChooseUs';
import Gallery from '@/components/Gallery';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import db from '@/lib/db';

export default async function Home() {
  // Fetch content directly from database
  let content = {};
  try {
    const stmt = db.prepare('SELECT key, value FROM site_content');
    const contentRows = stmt.all();
    content = contentRows.reduce((acc: Record<string, string>, row: any) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
  } catch (error) {
    console.error('Error fetching content:', error);
    // Fallback to empty object
  }

  // Fetch services directly from database
  let services: any[] = [];
  try {
    const stmt = db.prepare('SELECT * FROM services ORDER BY order_index');
    services = stmt.all();
  } catch (error) {
    console.error('Error fetching services:', error);
    // Fallback to empty array
  }

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
