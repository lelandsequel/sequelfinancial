import { Metadata } from 'next';
import Applications from '@/components/Applications';

export const metadata: Metadata = {
  title: 'Applications - AmCorCo Oil Spill Remediation Solutions',
  description: 'Explore diverse applications of Amcor Sorbe technology: oil spills, soil treatment, fire prevention, industrial cleanup, and more.',
};

export default function ApplicationsPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="section-padding gradient-bg relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-300 rounded-full filter blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-xl text-white mb-6">
              Versatile <span className="gradient-text bg-gradient-to-r from-accent-400 to-secondary-400 bg-clip-text text-transparent">Applications</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              From oil spills to agricultural enhancement, Amcor Sorbe provides effective solutions
              across multiple industries and environmental challenges.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                'Oil Spills',
                'Soil Treatment',
                'Fire Prevention',
                'Industrial Cleanup',
                'Marine Applications',
                'Wastewater Treatment',
              ].map((app, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="text-sm font-medium text-white">{app}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Applications Grid */}
      <Applications />

      {/* Detailed Applications */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <h2 className="heading-lg mb-12 text-center">Application Details</h2>

            <div className="space-y-16">
              {[
                {
                  id: 'oil-spills',
                  title: 'Oil Spills (Land & Sea)',
                  description: 'Amcor Sorbe is specifically designed for rapid oil spill cleanup on both land and water surfaces.',
                  benefits: [
                    'Absorbs up to 10x its weight in oil',
                    'Suppresses vapor fumes to reduce fire risk',
                    'Floats on water for easy collection',
                    'Biodegradable and environmentally safe',
                  ],
                  process: [
                    'Apply directly to spill area',
                    'Material absorbs oil immediately',
                    'Collect saturated material',
                    'Natural bioremediation occurs',
                  ],
                },
                {
                  id: 'soil-treatment',
                  title: 'Soil Remediation',
                  description: 'Enhances soil quality and promotes natural bioremediation of contaminated soil.',
                  benefits: [
                    'Provides essential nutrients to soil',
                    'Promotes healthy microbial activity',
                    'Improves soil structure and fertility',
                    'Safe for agricultural use',
                  ],
                  process: [
                    'Spread evenly over contaminated area',
                    'Work into topsoil layer',
                    'Allow natural bioremediation',
                    'Monitor soil quality improvement',
                  ],
                },
                {
                  id: 'fire-prevention',
                  title: 'Fire Prevention',
                  description: 'Reduces flammability by suppressing vapor fumes from gasoline, diesel, and other fuels.',
                  benefits: [
                    'Neutralizes flammable vapors',
                    'Reduces fire risk during cleanup',
                    'Safe for use around ignition sources',
                    'Effective on multiple fuel types',
                  ],
                  process: [
                    'Apply to fuel spill area',
                    'Vapor suppression begins immediately',
                    'Reduces ignition risk',
                    'Safe for hot work operations',
                  ],
                },
              ].map((app, index) => (
                <div key={index} id={app.id} className="scroll-mt-24">
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                      <h3 className="heading-lg mb-4">{app.title}</h3>
                      <p className="text-lg text-gray-700 mb-6">{app.description}</p>

                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Key Benefits:</h4>
                        <ul className="space-y-2">
                          {app.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-start">
                              <span className="text-accent-500 mr-3 mt-1">✓</span>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="card">
                      <h4 className="font-semibold text-gray-900 mb-4">Application Process:</h4>
                      <ol className="space-y-3">
                        {app.process.map((step, i) => (
                          <li key={i} className="flex items-start">
                            <span className="bg-primary-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5 flex-shrink-0">
                              {i + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <p className="text-lg text-gray-600 mb-6">
                Need a custom solution for your specific application?
              </p>
              <a href="/contact" className="btn-primary">
                Discuss Your Requirements
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}