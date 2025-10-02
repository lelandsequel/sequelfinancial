'use client';

import { motion } from 'framer-motion';
import { Droplet, Zap, CheckCircle } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Droplet,
    title: 'Apply Amcor Sorbe',
    description: 'Spread the plant-based absorbent material directly onto the oil spill or contaminated area.',
  },
  {
    number: '02',
    icon: Zap,
    title: 'Rapid Absorption',
    description: 'The material immediately absorbs oil and hydrocarbons while suppressing harmful vapor fumes.',
  },
  {
    number: '03',
    icon: CheckCircle,
    title: 'Natural Bioremediation',
    description: 'Microorganisms break down the absorbed oil, converting it to H₂O, CO₂, and harmless proteins.',
  },
];

export default function HowItWorks() {
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
            How <span className="gradient-text">It Works</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our three-step process makes oil spill cleanup faster, safer, and more effective than traditional methods.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connection Lines */}
          <div className="hidden md:block absolute top-1/4 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-200 via-accent-200 to-secondary-200" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow relative z-10">
                {/* Step Number */}
                <div className="absolute -top-6 left-8">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {step.number}
                  </div>
                </div>

                {/* Icon */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center mb-6 mt-4">
                  <step.icon className="text-primary-600" size={32} />
                </div>

                {/* Content */}
                <h3 className="heading-sm mb-3 text-gray-900">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Video Demo CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-8">
            <div className="text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                See It In Action
              </h3>
              <p className="text-gray-600 mb-4">
                Watch our demonstration videos to see the remarkable effectiveness of Amcor Sorbe.
              </p>
              <a href="#videos" className="btn-primary">
                Watch Demo Videos
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}