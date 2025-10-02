'use client';

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useState } from 'react';

const videos = [
  {
    id: 1,
    title: 'AmCorCo Oil Remediation Agent',
    description: 'See how Amcor Sorbe effectively absorbs and remediates oil spills.',
    thumbnail: 'from-blue-500 to-cyan-500',
    duration: '2:45',
  },
  {
    id: 2,
    title: 'Soil Treatment Demonstration',
    description: 'Watch the soil enhancement process with Amcor Sorbe.',
    thumbnail: 'from-green-500 to-emerald-500',
    duration: '3:12',
  },
  {
    id: 3,
    title: 'Fire Prevention Technology',
    description: 'Learn how vapor suppression prevents fire hazards.',
    thumbnail: 'from-orange-500 to-red-500',
    duration: '2:30',
  },
  {
    id: 4,
    title: 'Marine Application Case Study',
    description: 'Real-world offshore oil spill cleanup success story.',
    thumbnail: 'from-indigo-500 to-blue-500',
    duration: '4:15',
  },
];

export default function VideoGallery() {
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);

  return (
    <section id="videos" className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg mb-4">
            See <span className="gradient-text">It In Action</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Watch our demonstration videos to see the remarkable effectiveness of Amcor Sorbe 
            in various real-world applications.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => setSelectedVideo(video.id)}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                {/* Video Thumbnail */}
                <div className={`aspect-video bg-gradient-to-br ${video.thumbnail} flex items-center justify-center relative`}>
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="text-primary-600 ml-1" size={32} fill="currentColor" />
                    </div>
                  </div>
                  
                  {/* Duration Badge */}
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-medium">
                    {video.duration}
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-gray-600">{video.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Video Modal Placeholder */}
        {selectedVideo && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-4 max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                <p className="text-white">Video Player Placeholder - Video ID: {selectedVideo}</p>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="mt-4 btn-outline w-full"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-gray-600 mb-6">
            Want to see a live demonstration at your facility?
          </p>
          <a href="/contact" className="btn-primary">
            Schedule On-Site Demo
          </a>
        </motion.div>
      </div>
    </section>
  );
}