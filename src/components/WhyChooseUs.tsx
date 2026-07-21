'use client';

import { motion } from 'framer-motion';
import { UserCheck, Zap, Shield, Heart } from 'lucide-react';

const advantages = [
  {
    icon: UserCheck,
    title: 'Suivi personnalisé',
    description: 'Un accompagnement adapté à chaque patient pour des résultats optimaux'
  },
  {
    icon: Zap,
    title: 'Techniques modernes',
    description: 'Utilisation des dernières méthodes de rééducation et de réadaptation'
  },
  {
    icon: Shield,
    title: 'Accompagnement professionnel',
    description: 'Une expertise médicale qualifiée pour votre sécurité et votre confort'
  },
  {
    icon: Heart,
    title: 'Bien-être du patient',
    description: 'Approche centrée sur votre santé et votre qualité de vie'
  }
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-white">
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
            Pourquoi choisir Rehab Connect ?
          </h2>
          <div className="w-20 h-1 bg-blue-600 rounded mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Notre engagement envers votre santé et votre bien-être
          </p>
        </motion.div>

        {/* Advantages Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                  className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow"
                >
                  <Icon className="w-10 h-10 text-white" />
                </motion.div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {advantage.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {advantage.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
