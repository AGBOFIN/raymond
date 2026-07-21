'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Award } from 'lucide-react';

export default function About({ content }: { content: any }) {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Photo */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://res.cloudinary.com/g36grm5h/image/upload/v1784570514/WhatsApp_Image_2026-07-20_at_17.58.18_q0sxfa.jpg"
                alt="NYADJO Yao Raymond - Kinésithérapeute"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent"></div>
            </div>
            
            {/* Credential Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="absolute -bottom-4 -right-4 bg-blue-600 text-white p-4 rounded-xl shadow-xl"
            >
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6" />
                <span className="font-semibold">Kinésithérapeute</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                À propos du kinésithérapeute
              </h2>
              <div className="w-20 h-1 bg-blue-600 rounded"></div>
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-2xl font-semibold text-blue-600"
            >
              {content?.therapist_name || 'NYADJO Yao Raymond'}
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg text-gray-600 leading-relaxed"
            >
              {content?.therapist_bio || 'Kinésithérapeute passionné par la réadaptation fonctionnelle et la rééducation sportive. Je m\'engage à accompagner chaque patient vers une récupération optimale grâce à un suivi personnalisé et à des techniques modernes.'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl border border-blue-100"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Formation</h4>
                  <p className="text-gray-700">{content?.therapist_education || 'Licence Professionnelle en Sciences de la Santé'}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Mention:</span> {content?.therapist_mention || 'Réadaptation'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Établissement:</span> {content?.therapist_school || 'École Nationale des Auxiliaires Médicaux (ENAM)'}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
