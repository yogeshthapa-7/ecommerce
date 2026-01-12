"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ChevronRight,
  Play,
  Award,
  Zap,
  Globe,
  Heart,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import EcomNavbar from '@/components/ecomnavbar';
import EcomFooter from '@/components/ecomfooter';

const ExplorePage = () => {
  const [selectedTab, setSelectedTab] = useState('Featured');

  const tabs = ['Featured', 'Innovation', 'Athletes', 'Sustainability', 'Culture'];

  const featuredCollections = [
    {
      title: 'Air Technology',
      subtitle: 'Revolutionary Cushioning',
      description: 'Experience the evolution of Air cushioning technology that has defined comfort for decades.',
      image: 'https://www.sneakerfiles.com/wp-content/uploads/2024/11/nike-air-max-muse-black-metallic-silver-FV1920-001.jpg',
      badge: 'Innovation',
      link: '/nike/products',
    },
    {
      title: 'Jordan Legacy',
      subtitle: 'From Court to Culture',
      description: "Explore the iconic sneaker line that transcends basketball and defines streetwear excellence.",
      image: 'https://stuffmagazine.fr/wp-content/uploads/2023/04/Air-Jordan-6-Black-Infrared1.jpg',
      badge: 'Heritage',
      link: '/nike/products',
    },
    {
      title: 'Dri-FIT Technology',
      subtitle: 'Moisture Management',
      description: 'Stay dry and comfortable with advanced fabric technology designed for peak performance.',
      image: 'https://images.footballfanatics.com/baltimore-orioles/mens-nike-black-baltimore-orioles-authentic-collection-performance-pullover-hoodie_ss5_p-201716071+pv-2+u-acaphcqvjxaw2kddtql6+v-gckyjeqlagznvrbrphbt.jpg?_hv=2&w=600',
      badge: 'Performance',
      link: '/nike/products',
    },
  ];

  const stories = [
    {
      title: 'The Future of Running',
      category: 'Innovation',
      image: 'https://media.gq-magazine.co.uk/photos/67334c214ed46d433b25de24/16:9/w_2560%2Cc_limit/Nike-AF1.jpg',
      date: 'Jan 2026',
      readTime: '5 min read',
    },
    {
      title: 'Sustainability Goals 2026',
      category: 'Environment',
      image: 'https://www.mistertennis.com/images/2022-media-10/U_NIKE_BRASILIA_9-5-BLACKBLACKWHITE-do9193-010_C.jpg',
      date: 'Dec 2025',
      readTime: '8 min read',
    },
    {
      title: 'Athlete Spotlight Series',
      category: 'Community',
      image: 'https://static.ftshp.digital/img/p/1/2/9/7/7/9/8/1297798-full_product.jpg',
      date: 'Dec 2025',
      readTime: '6 min read',
    },
  ];

  const innovations = [
    {
      icon: Zap,
      title: 'React Foam',
      description: 'Lightweight, durable cushioning that returns energy with every step.',
    },
    {
      icon: Award,
      title: 'Flyknit',
      description: 'Precision-engineered fabric for a sock-like fit with minimal waste.',
    },
    {
      icon: Globe,
      title: 'Nike Grind',
      description: 'Recycled materials giving new life to worn-out shoes and manufacturing scraps.',
    },
    {
      icon: Heart,
      title: 'Nike Fit',
      description: 'AI-powered shoe fitting technology for the perfect size every time.',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <EcomNavbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-500/20 via-black to-black"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center space-y-6">
            <div className="inline-block px-4 py-2 bg-red-500 rounded-full text-sm font-bold mb-4">
              Explore Nike
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              WHERE <span className="text-red-500">INNOVATION</span>
              <br />
              MEETS INSPIRATION
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Discover the stories, technologies, and athletes that drive us forward.
              From groundbreaking innovations to cultural movements, explore what makes Nike iconic.
            </p>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <section className="sticky top-20 z-40 bg-black/95 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-6 py-2 rounded-full font-bold whitespace-nowrap transition-all ${
                  selectedTab === tab
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-3">
              Featured Collections
            </h2>
            <p className="text-gray-400 text-lg">
              Dive deep into the technologies and designs that define Nike
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredCollections.map((collection, idx) => (
              <div
                key={idx}
                className="group relative bg-gradient-to-b from-gray-900 to-black rounded-2xl overflow-hidden border border-gray-800 hover:border-red-500/50 transition-all hover:-translate-y-2"
              >
                <div className="aspect-[4/3] overflow-hidden bg-gray-800">
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    {collection.badge}
                  </span>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-2xl font-black">{collection.title}</h3>
                  <p className="text-red-400 font-bold text-sm">
                    {collection.subtitle}
                  </p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {collection.description}
                  </p>
                  <Link href={collection.link}>
                    <Button className="w-full bg-white text-black font-bold hover:bg-red-500 rounded-full group-hover:bg-red-500 group-hover:text-white transition-colors cursor-pointer mt-4">
                      Explore Now
                      <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video/Interactive Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-red-500/10 border border-red-500 rounded-full text-sm font-bold text-red-500">
                Watch Now
              </div>
              <h2 className="text-4xl md:text-5xl font-black leading-tight">
                The Science of
                <br />
                <span className="text-red-500">Performance</span>
              </h2>
              <p className="text-xl text-gray-400 leading-relaxed">
                Go behind the scenes at the Nike Sport Research Lab where innovation
                meets human performance. Discover how we test, iterate, and perfect
                every product.
              </p>
              <Button
                size="lg"
                className="bg-red-500 text-white font-bold hover:bg-red-600 px-8 py-6 rounded-full group cursor-pointer"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Documentary
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-red-500/30 to-gray-800 rounded-2xl overflow-hidden border border-gray-700 flex items-center justify-center group cursor-pointer hover:border-red-500 transition-all">
                <img
                  src="https://img3.wallspic.com/crops/5/5/2/6/4/146255/146255-shoe-black-darkness-nike-graphic_design-3840x2160.jpg"
                  alt="Video Thumbnail"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-black ml-1" fill="black" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Innovation Grid */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-3">
              Innovation at Nike
            </h2>
            <p className="text-gray-400 text-lg">
              Technologies that push boundaries and redefine possibilities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {innovations.map((innovation, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-b from-gray-900 to-black rounded-2xl p-6 border border-gray-800 hover:border-red-500/50 transition-all hover:-translate-y-2 space-y-4"
              >
                <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                  <innovation.icon className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-xl font-black">{innovation.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {innovation.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stories & Articles */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-3">
                Latest Stories
              </h2>
              <p className="text-gray-400 text-lg">
                News, insights, and inspiration from the Nike universe
              </p>
            </div>
            <Button
              variant="ghost"
              className="hidden md:flex items-center hover:text-red-400 group"
            >
              View All Stories
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stories.map((story, idx) => (
              <div
                key={idx}
                className="group cursor-pointer bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-red-500/20 transition-all hover:-translate-y-2"
              >
                <div className="aspect-[16/10] overflow-hidden bg-gray-800">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded font-bold">
                      {story.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {story.date}
                    </span>
                    <span>• {story.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-red-400 transition-colors">
                    {story.title}
                  </h3>
                  <button className="flex items-center text-red-500 font-bold group-hover:gap-2 transition-all">
                    Read More
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-transparent"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            Ready to Experience
            <br />
            <span className="text-red-500">The Innovation?</span>
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Shop the latest collections featuring cutting-edge technology
          </p>
          <Link href="/nike/products">
            <Button
              size="lg"
              className="bg-red-500 text-white font-bold hover:bg-red-600 px-8 py-6 rounded-full group cursor-pointer"
            >
              Shop Now
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      <EcomFooter />
    </div>
  );
};

export default ExplorePage;