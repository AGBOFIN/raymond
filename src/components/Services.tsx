'use client';

import { motion } from 'framer-motion';
import { Activity, HeartPulse, Bone, Hand } from 'lucide-react';

const iconMap: Record<string, any> = {
  Activity,
  HeartPulse,
  Bone,
  Hand,
};

export default function Services({ services }: { services: any[] }) {
  const defaultServices = [
    { title: 'Réadaptation fonctionnelle', description: 'Programmes personnalisés pour restaurer vos capacités motrices', icon: 'Activity' },
    { title: 'Rééducation sportive', description: 'Traitement spécialisé pour les athlètes et sportifs', icon: 'HeartPulse' },
    { title: 'Rééducation post-opératoire', description: 'Suivi adapté après chirurgie pour une récupération optimale', icon: 'Bone' },
    { title: 'Massages thérapeutiques', description: 'Techniques manuelles pour soulager la douleur et détendre', icon: 'Hand' },
  ];

  const servicesList = services && services.length > 0 ? services : defaultServices;

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Nos Services
          </h2>
          <div className="w-20 h-1 bg-blue-600 rounded mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Des soins de kinésithérapie adaptés à vos besoins pour une récupération optimale
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {servicesList.map((service, index) => {
            const Icon = iconMap[service.icon] || Activity;
            
            return (
              <motion.div
                key={service.id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
