'use client';

import { motion } from 'framer-motion';
import { Waves, Sprout, Flame, Factory, Ship, Building } from 'lucide-react';

const applications = [
  {
    icon: Waves,
    title: 'Oil Spills',
    description: 'Land and sea oil spill cleanup with rapid absorption and vapor suppression.',
    image: 'from-blue-500 to-cyan-600',
  },
  {
    icon: Sprout,
    title: 'Soil Treatment',
    description: 'Agricultural soil enhancement with essential nutrients and oxygen delivery.',
    image: 'from-green-500 to-emerald-600',
  },
  {
    icon: Flame,
    title: 'Fire Prevention',
    description: 'Vapor fume suppression to neutralize flammable gasoline and diesel emissions.',
    image: 'from-orange-500 to-red-600',
  },
  {
    icon: Factory,
    title: 'Industrial Cleanup',
    description: 'Hard surface chemical spill cleanup in manufacturing and industrial facilities.',
    image: 'from-gray-500 to-slate-600',
  },
  {
    icon: Ship,
    title: 'Marine Applications',
    description: 'Offshore drilling and maritime spill response with floating absorbent technology.',
    image: 'from-indigo-500 to-blue-600',
  },
  {
    icon: Building,
    title: 'Wastewater Treatment',
    description: 'Municipal and industrial wastewater oil and hydrocarbon removal systems.',
    image: 'from-teal-500 to-cyan-600',
  },
];

export default function Applications() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg mb-4">
            Versatile <span className="gradient-text">Applications</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From oil spills to agricultural enhancement, Amcor Sorbe provides effective solutions 
            across multiple industries and use cases.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${app.image} opacity-90 group-hover:opacity-100 transition-opacity`} />
                
                {/* Content */}
                <div className="relative p-8 h-full flex flex-col">
                  <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <app.icon className="text-white" size={28} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">{app.title}</h3>
                  <p className="text-white/90 leading-relaxed flex-grow">{app.description}</p>
                  
                  <div className="mt-6">
                    <a
                      href={`/applications#${app.title.toLowerCase().replace(/\s+/g, '-')}`}
                      className="inline-flex items-center text-white font-semibold hover:underline"
                    >
                      Learn More
                      <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-gray-600 mb-6">
            Need a custom solution for your specific application?
          </p>
          <a href="/contact" className="btn-primary">
            Discuss Your Requirements
          </a>
        </motion.div>
      </div>
    </section>
  );
}