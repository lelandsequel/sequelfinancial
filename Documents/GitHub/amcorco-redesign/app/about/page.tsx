import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About AmCorCo - Revolutionary Oil Remediation Technology',
  description: 'Learn about American Conservation Oil Remediation Co. USA and our mission to provide eco-friendly oil spill cleanup solutions.',
};

export default function AboutPage() {
  return (
    <div className="section-padding">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <h1 className="heading-lg mb-8 text-center">About AmCorCo</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              American Conservation Oil Remediation Co. USA is a Houston-based company dedicated to
              providing revolutionary, eco-friendly solutions for oil spill remediation and environmental cleanup.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="card">
                <h3 className="heading-md mb-4">Our Mission</h3>
                <p className="text-gray-600">
                  To develop and provide innovative, plant-based technologies that effectively clean up
                  oil spills while protecting the environment and human health.
                </p>
              </div>

              <div className="card">
                <h3 className="heading-md mb-4">Our Vision</h3>
                <p className="text-gray-600">
                  A world where oil spills and chemical contamination can be remediated quickly,
                  safely, and without harming the environment.
                </p>
              </div>
            </div>

            <div className="bg-primary-50 rounded-2xl p-8 mb-8">
              <h3 className="heading-md mb-4">Why Choose AmCorCo?</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-accent-500 mr-3">✓</span>
                  <span>Plant-based, biodegradable technology</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-500 mr-3">✓</span>
                  <span>Featured in Engineering 10 Magazine</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-500 mr-3">✓</span>
                  <span>15+ years of industry experience</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-500 mr-3">✓</span>
                  <span>98% success rate in remediation</span>
                </li>
              </ul>
            </div>

            <div className="text-center">
              <a href="/contact" className="btn-primary">
                Get In Touch
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}