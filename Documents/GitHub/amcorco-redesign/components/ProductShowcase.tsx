'use client';

import { motion } from 'framer-motion';
import { Beaker, Leaf, Droplets, Shield } from 'lucide-react';

export default function ProductShowcase() {
  return (
    <section className="section-padding bg-gradient-to-br from-primary-50 to-accent-50">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Product Image/Visual */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-square bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl shadow-2xl flex items-center justify-center">
              <div className="text-white text-center p-8">
                <Beaker size={120} className="mx-auto mb-4" />
                <h3 className="text-3xl font-bold mb-2">Amcor Sorbe</h3>
                <p className="text-lg opacity-90">Plant-Based Solution</p>
              </div>
            </div>
            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center space-x-2">
                <Leaf className="text-accent-500" size={24} />
                <div>
                  <div className="font-bold text-sm">100%</div>
                  <div className="text-xs text-gray-600">Natural</div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center space-x-2">
                <Shield className="text-primary-500" size={24} />
                <div>
                  <div className="font-bold text-sm">EPA</div>
                  <div className="text-xs text-gray-600">Approved</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-lg mb-6">
              Meet <span className="gradient-text">Amcor Sorbe</span>
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Manufactured from the dry stalk of a unique plant, Amcor Sorbe is a revolutionary 
              absorbent product designed for oil spills on land, water, or hard surfaces.
            </p>

            <div className="space-y-4 mb-8">
              {[
                {
                  icon: Droplets,
                  title: 'Superior Absorption',
                  description: 'Absorbs up to 10x its weight in oil and hydrocarbons',
                },
                {
                  icon: Leaf,
                  title: 'Bioremediation',
                  description: 'Plant feeds on hydrocarbons, promoting natural cleanup',
                },
                {
                  icon: Shield,
                  title: 'Safe & Non-Toxic',
                  description: 'No harmful chemicals, safe for humans and wildlife',
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-white shadow-md flex items-center justify-center flex-shrink-0">
                    <item.icon className="text-primary-500" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/products" className="btn-primary">
                View Product Details
              </a>
              <a href="/contact" className="btn-outline">
                Request Sample
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}