'use client';

import { motion } from 'framer-motion';
import { Droplet, Leaf, Shield, Zap, Recycle, Award } from 'lucide-react';

const features = [
  {
    icon: Droplet,
    title: 'Oil Spill Treatment',
    description: 'Absorbs hazardous chemicals and efficiently suppresses vapor fumes to neutralize flammability of gasoline, diesel, and jet fuel.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Leaf,
    title: 'Soil Treatment',
    description: 'Provides essential nutrients, oxygen, and promotes healthy soil bioremediation for agricultural and environmental applications.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Shield,
    title: 'Fire Prevention',
    description: 'Suppresses vapor fumes to neutralize emissions from gasoline, diesel, and other flammable substances, preventing fire hazards.',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: Zap,
    title: 'Fast Acting',
    description: 'Cleans up pollution faster, cheaper, and better than traditional methods. Immediate absorption and remediation.',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Recycle,
    title: 'Eco-Friendly',
    description: 'Converts chemicals into carbon and water. Excess converts to protein that naturally breaks down without harming the environment.',
    color: 'from-teal-500 to-green-500',
  },
  {
    icon: Award,
    title: 'Proven Results',
    description: 'Featured in Engineering 10 magazine. Trusted by industries worldwide for superior cleanup performance and safety.',
    color: 'from-purple-500 to-pink-500',
  },
];

export default function Features() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg mb-4">
            Why Choose <span className="gradient-text">AmCorCo</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our revolutionary plant-based technology provides a wide range of use cases 
            while delivering high-quality, environmentally responsible results.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card group hover:scale-105"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="text-white" size={28} />
              </div>
              <h3 className="heading-sm mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <a href="/products" className="btn-primary">
              Learn More About Our Products
            </a>
            <a href="/contact" className="btn-outline">
              Schedule a Meeting
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}