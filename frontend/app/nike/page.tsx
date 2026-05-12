"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  CircleDot,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import EcomFooter from "@/components/ecomfooter";
import EcomNavbar from "@/components/ecomnavbar";

const heroImage =
  "https://img3.wallspic.com/crops/5/5/2/6/4/146255/146255-shoe-black-darkness-nike-graphic_design-3840x2160.jpg";

const featuredShoes = [
  {
    name: "Air Force 1",
    desc: "Clean leather, court heritage, everyday rotation.",
    price: "$110",
    img: "https://media.gq-magazine.co.uk/photos/67334c214ed46d433b25de24/16:9/w_2560%2Cc_limit/Nike-AF1.jpg",
  },
  {
    name: "Air Max Muse",
    desc: "Sculpted cushioning with a sharper street profile.",
    price: "$160",
    img: "https://www.sneakerfiles.com/wp-content/uploads/2024/11/nike-air-max-muse-black-metallic-silver-FV1920-001.jpg",
  },
  {
    name: "Jordan Retro",
    desc: "A performance icon rebuilt for the modern closet.",
    price: "$200",
    img: "https://stuffmagazine.fr/wp-content/uploads/2023/04/Air-Jordan-6-Black-Infrared1.jpg",
  },
];

const apparel = [
  {
    name: "Tech Fleece Hoodie",
    desc: "Soft structure, warm build, clean athletic shape.",
    category: "Women",
    img: "https://www.nike.sa/dw/image/v2/BDVB_PRD/on/demandware.static/-/Sites-akeneo-master-catalog/default/dw32a2a3a8/nk/fd8/3/6/9/0/0/fd836900_3fea_4982_8b44_a453ed9ec64a.jpg?sw=700&sh=700&sm=fit&q=100&strip=false",
  },
  {
    name: "Performance Hoodie",
    desc: "Layer-ready comfort for training days and off days.",
    category: "Men",
    img: "https://images.footballfanatics.com/baltimore-orioles/mens-nike-black-baltimore-orioles-authentic-collection-performance-pullover-hoodie_ss5_p-201716071+pv-2+u-acaphcqvjxaw2kddtql6+v-gckyjeqlagznvrbrphbt.jpg?_hv=2&w=600",
  },
];

const accessories = [
  {
    name: "Brasilia",
    desc: "Durable daily carry",
    img: "https://www.mistertennis.com/images/2022-media-10/U_NIKE_BRASILIA_9-5-BLACKBLACKWHITE-do9193-010_C.jpg",
  },
  {
    name: "Utility Elite",
    desc: "Organized performance storage",
    img: "https://media-www.atmosphere.ca/product/div-01-hardgoods/dpt-56-bags/sdpt-14-packs/333114432/nike-utility-elite-backpack-black-ns--b5e00ffd-ff05-4807-8f35-ff64ac70d43d-jpgrendition.jpg?imdensity=1&imwidth=1244&impolicy=mZoom",
  },
  {
    name: "Heritage",
    desc: "Classic campus profile",
    img: "https://www.uberprints.com/content/products/flat/800x800/nkba5879_1_obsd.jpg",
  },
  {
    name: "Aura",
    desc: "Compact and polished",
    img: "https://static.ftshp.digital/img/p/1/2/9/7/7/9/8/1297798-full_product.jpg",
  },
];

const stats = [
  { value: "10M+", label: "Active athletes" },
  { value: "500+", label: "Global stores" },
  { value: "4.9", label: "Average rating" },
  { value: "50+", label: "Years of sport" },
];

const serviceNotes = [
  {
    icon: PackageCheck,
    title: "Fast Dispatch",
    body: "Priority handling on new-season footwear and essential gear.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Checkout",
    body: "Protected payment flow from sign-in to final order confirmation.",
  },
  {
    icon: Sparkles,
    title: "Fresh Drops",
    body: "Rotating edits for shoes, hoodies, bags, and seasonal essentials.",
  },
];

const NikeHomePage = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black font-sans text-white">
      <EcomNavbar />

      <section className="relative flex min-h-[92vh] items-center overflow-hidden">
        <Image
          src={heroImage}
          alt="Black Nike sneaker on a dark studio background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.94)_0%,rgba(0,0,0,0.72)_42%,rgba(0,0,0,0.24)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black to-transparent" />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-end gap-12 px-6 pb-14 pt-28 lg:grid-cols-[1.05fr_0.95fr] lg:pb-20">
          <div className="max-w-3xl">
            <h1 className="text-[4.8rem] font-black uppercase leading-[0.78] tracking-normal text-white sm:text-8xl lg:text-[8.6rem]">
              Move
              <span className="block text-zinc-500">Different</span>
            </h1>
            <p className="mt-8 max-w-xl text-base leading-8 text-zinc-300 md:text-lg">
              Premium footwear, apparel, and training gear built for everyday
              pace. Clean silhouettes, real performance, and a sharper shopping
              experience.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/nike/products"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-black uppercase text-black transition-colors hover:bg-zinc-200"
              >
                Shop Collection
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/nike/explore"
                className="inline-flex h-14 items-center justify-center rounded-full border border-white/25 px-7 text-sm font-black uppercase text-white transition-colors hover:border-white hover:bg-white/10"
              >
                Explore Nike
              </Link>
            </div>
          </div>

          <div className="hidden rounded-[2rem] border border-white/10 bg-black/70 p-5 shadow-2xl shadow-black/50 lg:block">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-xs font-black uppercase text-zinc-500">
                  New Season
                </p>
                <h2 className="mt-1 text-2xl font-black">Studio edit</h2>
              </div>
              <Star className="h-5 w-5 fill-white text-white" />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-5">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-white/[0.07] p-4">
                  <p className="text-3xl font-black">{stat.value}</p>
                  <p className="mt-2 text-xs font-bold uppercase text-zinc-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-zinc-950">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-6 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="py-8 md:py-10">
              <p className="text-4xl font-black tracking-normal md:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-xs font-black uppercase text-zinc-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative bg-black py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase text-red-400">
                Footwear rotation
              </p>
              <h2 className="mt-3 text-4xl font-black leading-none md:text-6xl">
                Featured Footwear
              </h2>
            </div>
            <Link
              href="/nike/products"
              className="inline-flex items-center gap-2 text-sm font-black uppercase text-zinc-300 transition-colors hover:text-white"
            >
              View all products
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {featuredShoes.map((product) => (
              <Link
                key={product.name}
                href="/nike/products"
                className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-zinc-950 transition-colors hover:border-white/30"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900">
                  <Image
                    src={product.img}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
                <div className="flex items-end justify-between gap-4 p-5">
                  <div>
                    <h3 className="text-2xl font-black">{product.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      {product.desc}
                    </p>
                  </div>
                  <p className="text-xl font-black">{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-zinc-100 py-20 text-black md:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase text-zinc-500">
              Limited edit
            </p>
            <h2 className="mt-4 text-5xl font-black uppercase leading-[0.88] tracking-normal md:text-7xl">
              Built for the city.
              <span className="block text-zinc-500">Ready for pace.</span>
            </h2>
            <p className="mt-7 max-w-lg text-base leading-8 text-zinc-600">
              Lightweight layers, sculpted cushioning, and durable everyday
              carry pieces come together in one refined Nike shop experience.
            </p>
            <Link
              href="/nike/products"
              className="mt-8 inline-flex h-14 items-center justify-center gap-2 rounded-full bg-black px-7 text-sm font-black uppercase text-white transition-colors hover:bg-zinc-800"
            >
              Discover Collection
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] bg-black">
            <Image
              src="https://www.sneakerfiles.com/wp-content/uploads/2024/11/nike-air-max-muse-black-metallic-silver-FV1920-001.jpg"
              alt="Black and silver Nike Air Max Muse"
              fill
              className="object-contain p-8"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black uppercase">
              <CircleDot className="h-3.5 w-3.5 fill-red-500 text-red-500" />
              Air Max Muse
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black py-20 md:py-28 [contain-intrinsic-size:760px] [content-visibility:auto]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-black uppercase text-red-400">
              Apparel system
            </p>
            <h2 className="mt-3 text-4xl font-black leading-none md:text-6xl">
              Premium Apparel
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {apparel.map((product) => (
              <Link
                key={product.name}
                href="/nike/products"
                className="group grid overflow-hidden rounded-[1.5rem] border border-white/10 bg-zinc-950 transition-colors hover:border-white/30 sm:grid-cols-[0.9fr_1.1fr]"
              >
                <div className="relative min-h-72 bg-zinc-900">
                  <Image
                    src={product.img}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="flex min-h-72 flex-col justify-between p-6">
                  <span className="w-fit rounded-full border border-white/10 px-3 py-1 text-xs font-black uppercase text-zinc-400">
                    {product.category}
                  </span>
                  <div>
                    <h3 className="text-3xl font-black">{product.name}</h3>
                    <p className="mt-3 text-sm leading-6 text-zinc-400">
                      {product.desc}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-zinc-950 py-20 md:py-24 [contain-intrinsic-size:720px] [content-visibility:auto]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase text-red-400">
                Gear and carry
              </p>
              <h2 className="mt-3 text-4xl font-black leading-none md:text-6xl">
                Accessories
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-zinc-500">
              Focused storage pieces for gym days, school days, and every move
              in between.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {accessories.map((product) => (
              <Link
                key={product.name}
                href="/nike/products"
                className="group overflow-hidden rounded-[1.25rem] border border-white/10 bg-black transition-colors hover:border-white/30"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900">
                  <Image
                    src={product.img}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-black">{product.name}</h3>
                  <p className="mt-2 text-sm text-zinc-500">{product.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black py-20 md:py-24 [contain-intrinsic-size:520px] [content-visibility:auto]">
        <div className="mx-auto grid max-w-7xl gap-5 px-6 md:grid-cols-3">
          {serviceNotes.map((item) => (
            <div
              key={item.title}
              className="rounded-[1.5rem] border border-white/10 bg-zinc-950 p-6"
            >
              <item.icon className="h-7 w-7 text-red-400" />
              <h3 className="mt-6 text-2xl font-black">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-500">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-zinc-100 py-20 text-black md:py-28">
        <div className="mx-auto flex max-w-5xl flex-col items-center px-6 text-center">
          <h2 className="max-w-4xl text-5xl font-black uppercase leading-[0.9] tracking-normal md:text-7xl">
            Stay ready for the next drop.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-600">
            Sign in for your saved cart, faster checkout, and fresh collection
            updates from the Nike shop.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex h-14 items-center justify-center rounded-full bg-black px-8 text-sm font-black uppercase text-white transition-colors hover:bg-zinc-800"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex h-14 items-center justify-center rounded-full border border-black/20 px-8 text-sm font-black uppercase text-black transition-colors hover:border-black hover:bg-black/5"
            >
              Join Us
            </Link>
          </div>
        </div>
      </section>

      <EcomFooter />
    </div>
  );
};

export default NikeHomePage;
