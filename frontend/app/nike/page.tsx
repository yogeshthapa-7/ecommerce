"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Menu,
  X,
  ShoppingBag,
  Search,
  ChevronRight,
  Star,
  TrendingUp,
  Award,
  Users,
} from 'lucide-react';
import EcomNavbar from '@/components/ecomnavbar';
import EcomFooter from '@/components/ecomfooter';
import ChatBubble from '@/components/ui/chatbubble';
import AssistantChat from '@/components/ui/assistantchat';

const NikeHomePage = () => {

  return (

    <div className="relative min-h-screen bg-black text-white font-sans overflow-x-hidden">

      <EcomNavbar />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://img3.wallspic.com/crops/5/5/2/6/4/146255/146255-shoe-black-darkness-nike-graphic_design-3840x2160.jpg"
          alt="Nike Background"
          className="absolute inset-0 h-full w-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="space-y-8 animate-fade-in">
            <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-sm font-medium mb-4">
              New Season Collection
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-none tracking-tighter">
              JUST
              <br />
              <span className="text-red-500 inline-block hover:scale-105 transition-transform">
                DO
              </span>{' '}
              IT
            </h1>

            <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed">
              Discover the latest innovations in athletic footwear and apparel.
              Engineered for champions, designed for everyone.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/nike/products">
                <Button
                  size="lg"
                  className="bg-white text-black font-bold px-8 py-6 text-base hover:bg-gray-200 transition-all hover:scale-105 group rounded-full cursor-pointer"
                >
                  Shop Collection
                  <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/nike/explore">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-black px-8 py-6 text-base hover:bg-white hover:text-black transition-all hover:scale-105 font-bold rounded-full cursor-pointer"
                >
                  Explore More
                </Button>
              </Link>
            </div>
          </div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronRight className="w-6 h-6 rotate-90 text-white/50" />
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, value: '10M+', label: 'Active Athletes' },
              { icon: Award, value: '500+', label: 'Global Stores' },
              { icon: Star, value: '4.9', label: 'Customer Rating' },
              { icon: TrendingUp, value: '50+', label: 'Years Legacy' },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="text-center space-y-3 hover:scale-105 transition-transform"
              >
                <stat.icon className="w-10 h-10 mx-auto text-red-500" />
                <div className="text-4xl font-black">{stat.value}</div>
                <div className="text-sm text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED SHOES */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-3">
                Featured Footwear
              </h2>
              <p className="text-gray-400">
                Step into greatness with our iconic collections
              </p>
            </div>
            <Link href="/nike/products">
              <Button
                variant="ghost"
                className="hidden md:flex items-center hover:text-red-400 group"
              >
                View All
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Air Force 1',
                desc: 'Timeless streetwear icon',
                price: '$110',
                img: 'https://media.gq-magazine.co.uk/photos/67334c214ed46d433b25de24/16:9/w_2560%2Cc_limit/Nike-AF1.jpg',
              },
              {
                name: 'Air Max',
                desc: 'Cushioning redefined',
                price: '$160',
                img: 'https://www.sneakerfiles.com/wp-content/uploads/2024/11/nike-air-max-muse-black-metallic-silver-FV1920-001.jpg',
              },
              {
                name: 'Jordan',
                desc: 'Legendary performance',
                price: '$200',
                img: 'https://stuffmagazine.fr/wp-content/uploads/2023/04/Air-Jordan-6-Black-Infrared1.jpg',
              },
            ].map((product, idx) => (
              <div
                key={idx}
                className="group relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-red-500/20 transition-all hover:-translate-y-2"
              >
                <div className="aspect-[4/3] overflow-hidden bg-gray-800">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 space-y-3 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold">{product.name}</h3>
                    <span className="text-xl font-black">{product.price}</span>
                  </div>
                  <p className="text-gray-400 text-sm">{product.desc}</p>

                </div>
                <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  NEW
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED BANNER */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 relative z-10">
              <div className="inline-block px-4 py-2 bg-red-500 rounded-full text-sm font-bold">
                Limited Edition
              </div>
              <h2 className="text-5xl md:text-6xl font-black leading-tight">
                Performance
                <br />
                Meets Style
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                Experience cutting-edge technology combined with iconic design.
                Engineered for athletes, crafted for everyone.
              </p>
              <Link href="/nike/products">
                <Button
                  size="lg"
                  className="bg-red-500 text-white font-bold hover:bg-red-600 px-8 py-6 rounded-full group cursor-pointer"
                >
                  Discover Collection
                  <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-red-500/30 to-transparent rounded-full absolute -top-20 -right-20 blur-3xl"></div>
              <img
                src="https://www.sneakerfiles.com/wp-content/uploads/2024/11/nike-air-max-muse-black-metallic-silver-FV1920-001.jpg"
                alt="Featured Product"
                className="relative z-10 w-full h-auto transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* APPAREL SECTION */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-3">
              Premium Apparel
            </h2>
            <p className="text-gray-400">
              Comfort and style for every occasion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: 'Tech Fleece Hoodie',
                desc: 'Premium comfort for women',
                category: 'Women',
                img: 'https://www.nike.sa/dw/image/v2/BDVB_PRD/on/demandware.static/-/Sites-akeneo-master-catalog/default/dw32a2a3a8/nk/fd8/3/6/9/0/0/fd836900_3fea_4982_8b44_a453ed9ec64a.jpg?sw=700&sh=700&sm=fit&q=100&strip=false',
              },
              {
                name: 'Performance Hoodie',
                desc: 'Essential everyday wear for men',
                category: 'Men',
                img: 'https://images.footballfanatics.com/baltimore-orioles/mens-nike-black-baltimore-orioles-authentic-collection-performance-pullover-hoodie_ss5_p-201716071+pv-2+u-acaphcqvjxaw2kddtql6+v-gckyjeqlagznvrbrphbt.jpg?_hv=2&w=600',
              },
            ].map((product, idx) => (

              <div
                key={idx}
                className="group relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-red-500/20 transition-all hover:-translate-y-2"
              >
                <div className="aspect-[16/10] overflow-hidden bg-gray-800 flex items-center justify-center">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-4/5 h-4/5 object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 space-y-3 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold">{product.name}</h3>
                    <span className="text-sm font-bold text-red-500 px-3 py-1 bg-red-500/10 rounded-full">
                      {product.category}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{product.desc}</p>

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BAGS SECTION */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-3">
              Gear & Accessories
            </h2>
            <p className="text-gray-400">Carry your essentials in style</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Brasilia',
                desc: 'Durable and spacious',
                img: 'https://www.mistertennis.com/images/2022-media-10/U_NIKE_BRASILIA_9-5-BLACKBLACKWHITE-do9193-010_C.jpg',
              },
              {
                name: 'Utility Elite',
                desc: 'Versatile performance',
                img: 'https://media-www.atmosphere.ca/product/div-01-hardgoods/dpt-56-bags/sdpt-14-packs/333114432/nike-utility-elite-backpack-black-ns--b5e00ffd-ff05-4807-8f35-ff64ac70d43d-jpgrendition.jpg?imdensity=1&imwidth=1244&impolicy=mZoom',
              },
              {
                name: 'Heritage',
                desc: 'Classic style',
                img: 'https://www.uberprints.com/content/products/flat/800x800/nkba5879_1_obsd.jpg',
              },
              {
                name: 'Aura',
                desc: 'Sleek and functional',
                img: 'https://static.ftshp.digital/img/p/1/2/9/7/7/9/8/1297798-full_product.jpg',
              },
            ].map((product, idx) => (
              <div
                key={idx}
                className="group relative bg-gradient-to-b from-gray-900 to-black rounded-2xl overflow-hidden border border-gray-800 hover:border-red-500/50 transition-all hover:-translate-y-2"
              >
                <div className="aspect-[3/4] overflow-hidden bg-gray-900">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="text-lg font-bold">{product.name}</h3>
                  <p className="text-gray-400 text-sm">{product.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Stay in the Game
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Get the latest drops, exclusive offers, and insider news
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto justify-center items-center">
            <Link href="/login">
              <Button
                size="lg"
                className="bg-red-500 text-white m-auto font-bold hover:bg-red-600 px-8 py-4 rounded-full whitespace-nowrap cursor-pointer"
              >
                Sign In
              </Button>
            </Link>

            <Link href="/register">
              <Button
                size="lg"
                className="bg-red-500 text-white m-auto font-bold hover:bg-red-600 px-8 py-4 rounded-full whitespace-nowrap cursor-pointer"
              >
                Join Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <EcomFooter />

    </div>
  );
};

export default NikeHomePage;