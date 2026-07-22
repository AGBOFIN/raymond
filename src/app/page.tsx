import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import WhyChooseUs from '@/components/WhyChooseUs';
import Gallery from '@/components/Gallery';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

export default async function Home() {
  // Fetch content from Supabase
  let content = {};
  try {
    const { data: contentData } = await supabase
      .from('site_content')
      .select('key, value');
    content = contentData?.reduce((acc: Record<string, string>, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {}) || {};
  } catch (error) {
    console.error('Error fetching content:', error);
  }

  // Fetch services from Supabase
  let services: any[] = [];
  try {
    const { data: servicesData } = await supabase
      .from('services')
      .select('*')
      .order('order_index');
    services = servicesData || [];
  } catch (error) {
    console.error('Error fetching services:', error);
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
