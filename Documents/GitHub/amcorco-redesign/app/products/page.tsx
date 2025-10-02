import { Metadata } from 'next';
import ProductShowcase from '@/components/ProductShowcase';
import HowItWorks from '@/components/HowItWorks';

export const metadata: Metadata = {
  title: 'Amcor Sorbe - Revolutionary Oil Spill Remediation Product',
  description: 'Discover Amcor Sorbe, our plant-based oil spill cleanup solution. Learn about product specifications, applications, and technical details.',
};

export default function ProductsPage() {
  return (
    <div>
      {/* Hero Section for Products */}
      <section className="section-padding gradient-bg relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-300 rounded-full filter blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-xl text-white mb-6">
              Amcor <span className="gradient-text bg-gradient-to-r from-accent-400 to-secondary-400 bg-clip-text text-transparent">Sorbe</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Revolutionary plant-based absorbent technology for oil spill remediation.
              Safer, faster, and more effective than traditional cleanup methods.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              {[
                { value: '10x', label: 'Absorption Rate' },
                { value: '100%', label: 'Biodegradable' },
                { value: '98%', label: 'Success Rate' },
                { value: 'EPA', label: 'Approved' },
              ].map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product Details */}
      <ProductShowcase />

      {/* How It Works */}
      <HowItWorks />

      {/* Technical Specifications */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-lg mb-12 text-center">Technical Specifications</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="heading-md mb-6">Product Properties</h3>
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-medium">Absorption Capacity</span>
                    <span className="text-gray-600">Up to 10x its weight</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-medium">Biodegradability</span>
                    <span className="text-gray-600">100% biodegradable</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-medium">Toxicity</span>
                    <span className="text-gray-600">Non-toxic to humans/wildlife</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-medium">Flammability</span>
                    <span className="text-gray-600">Reduces fire risk</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="heading-md mb-6">Applications</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="text-accent-500 mr-3">✓</span>
                    <span>Oil spills (land & sea)</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-accent-500 mr-3">✓</span>
                    <span>Soil remediation</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-accent-500 mr-3">✓</span>
                    <span>Industrial cleanup</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-accent-500 mr-3">✓</span>
                    <span>Fire prevention</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-accent-500 mr-3">✓</span>
                    <span>Agricultural enhancement</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 text-center">
              <a href="/contact" className="btn-primary mr-4">
                Request Product Demo
              </a>
              <a href="/portal" className="btn-outline">
                View Safety Data Sheet
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}