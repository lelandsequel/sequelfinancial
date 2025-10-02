import { Metadata } from 'next';
import VideoGallery from '@/components/VideoGallery';

export const metadata: Metadata = {
  title: 'Resources - AmCorCo Documentation, Videos & Case Studies',
  description: 'Access AmCorCo resources including product documentation, demonstration videos, case studies, and technical information.',
};

export default function ResourcesPage() {
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
              Resource <span className="gradient-text bg-gradient-to-r from-accent-400 to-secondary-400 bg-clip-text text-transparent">Center</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Access comprehensive documentation, videos, case studies, and technical information
              to help you understand and implement Amcor Sorbe solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Video Gallery */}
      <VideoGallery />

      {/* Resources Grid */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <h2 className="heading-lg mb-12 text-center">Documentation & Resources</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Product Specifications',
                  description: 'Detailed technical specifications and performance data',
                  icon: '📋',
                  href: '/products#specs',
                },
                {
                  title: 'Safety Data Sheet',
                  description: 'Complete SDS information (requires authentication)',
                  icon: '⚠️',
                  href: '/portal',
                },
                {
                  title: 'Application Guides',
                  description: 'Step-by-step guides for different use cases',
                  icon: '📖',
                  href: '/applications',
                },
                {
                  title: 'Case Studies',
                  description: 'Real-world success stories and results',
                  icon: '📊',
                  href: '#case-studies',
                },
                {
                  title: 'FAQ',
                  description: 'Frequently asked questions and answers',
                  icon: '❓',
                  href: '#faq',
                },
                {
                  title: 'Contact Support',
                  description: 'Get help from our technical team',
                  icon: '📞',
                  href: '/contact',
                },
              ].map((resource, index) => (
                <a
                  key={index}
                  href={resource.href}
                  className="card group hover:scale-105 transition-transform"
                >
                  <div className="text-4xl mb-4">{resource.icon}</div>
                  <h3 className="heading-sm mb-2 group-hover:text-primary-600 transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{resource.description}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-lg mb-12 text-center">Frequently Asked Questions</h2>

            <div className="space-y-6">
              {[
                {
                  question: 'How does Amcor Sorbe work?',
                  answer: 'Amcor Sorbe is made from a unique plant stalk that naturally absorbs oil and hydrocarbons. The plant material feeds on these substances, converting them to H₂O and CO₂ through bioremediation.',
                },
                {
                  question: 'Is Amcor Sorbe safe for the environment?',
                  answer: 'Yes, Amcor Sorbe is 100% biodegradable and environmentally friendly. It actually improves soil quality and promotes healthy microbial activity.',
                },
                {
                  question: 'How much oil can Amcor Sorbe absorb?',
                  answer: 'Amcor Sorbe can absorb up to 10 times its weight in oil and hydrocarbons, making it highly effective for spill cleanup.',
                },
                {
                  question: 'Is Amcor Sorbe flammable?',
                  answer: 'No, Amcor Sorbe suppresses vapor fumes and reduces the flammability of fuels, making it safer than traditional absorbents.',
                },
                {
                  question: 'What types of spills can Amcor Sorbe handle?',
                  answer: 'Amcor Sorbe works on oil spills, chemical spills, soil contamination, and can even be used for fire prevention and agricultural soil enhancement.',
                },
              ].map((faq, index) => (
                <div key={index} className="card">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-lg text-gray-600 mb-6">
                Still have questions? Our team is here to help.
              </p>
              <a href="/contact" className="btn-primary">
                Contact Our Experts
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}