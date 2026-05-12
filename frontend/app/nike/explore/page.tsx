"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  Award,
  Calendar,
  ChevronRight,
  Globe,
  Heart,
  Play,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import EcomNavbar from "@/components/ecomnavbar";
import EcomFooter from "@/components/ecomfooter";

const tabs = ["Featured", "Innovation", "Athletes", "Sustainability", "Culture"];

const tabDetails: Record<string, { title: string; description: string }> = {
  Featured: {
    title: "A curated view of Nike performance culture.",
    description:
      "Start with the newest stories, signature product ideas, and the design thinking behind every collection.",
  },
  Innovation: {
    title: "Built in labs. Proven in motion.",
    description:
      "Explore material systems, cushioning platforms, and research-led details that shape the feel of Nike gear.",
  },
  Athletes: {
    title: "Performance stories from the people who move sport forward.",
    description:
      "Follow athlete-led insight, training moments, and signature decisions that influence the product line.",
  },
  Sustainability: {
    title: "Lower impact materials with a sharper product standard.",
    description:
      "See how circular design, Nike Grind, and engineered knits can reduce waste without losing performance.",
  },
  Culture: {
    title: "The moments where sport becomes style.",
    description:
      "Track the footwear, apparel, and creative partnerships that keep Nike connected to everyday culture.",
  },
};

const featuredCollections = [
  {
    title: "Air Technology",
    subtitle: "Revolutionary Cushioning",
    description:
      "Experience the evolution of Air cushioning technology that has defined comfort for decades.",
    image:
      "https://www.sneakerfiles.com/wp-content/uploads/2024/11/nike-air-max-muse-black-metallic-silver-FV1920-001.jpg",
    badge: "Innovation",
    link: "/nike/products",
  },
  {
    title: "Jordan Legacy",
    subtitle: "From Court to Culture",
    description:
      "Explore the iconic sneaker line that transcends basketball and defines streetwear excellence.",
    image:
      "https://stuffmagazine.fr/wp-content/uploads/2023/04/Air-Jordan-6-Black-Infrared1.jpg",
    badge: "Heritage",
    link: "/nike/products",
  },
  {
    title: "Dri-FIT Technology",
    subtitle: "Moisture Management",
    description:
      "Stay dry and comfortable with advanced fabric technology designed for peak performance.",
    image:
      "https://images.footballfanatics.com/baltimore-orioles/mens-nike-black-baltimore-orioles-authentic-collection-performance-pullover-hoodie_ss5_p-201716071+pv-2+u-acaphcqvjxaw2kddtql6+v-gckyjeqlagznvrbrphbt.jpg?_hv=2&w=600",
    badge: "Performance",
    link: "/nike/products",
  },
];

const stories = [
  {
    title: "The Future of Running",
    category: "Innovation",
    image:
      "https://media.gq-magazine.co.uk/photos/67334c214ed46d433b25de24/16:9/w_2560%2Cc_limit/Nike-AF1.jpg",
    date: "Jan 2026",
    readTime: "5 min read",
  },
  {
    title: "Sustainability Goals 2026",
    category: "Environment",
    image:
      "https://www.mistertennis.com/images/2022-media-10/U_NIKE_BRASILIA_9-5-BLACKBLACKWHITE-do9193-010_C.jpg",
    date: "Dec 2025",
    readTime: "8 min read",
  },
  {
    title: "Athlete Spotlight Series",
    category: "Community",
    image: "https://static.ftshp.digital/img/p/1/2/9/7/7/9/8/1297798-full_product.jpg",
    date: "Dec 2025",
    readTime: "6 min read",
  },
];

const innovations = [
  {
    icon: Zap,
    title: "React Foam",
    description: "Lightweight, durable cushioning that returns energy with every step.",
  },
  {
    icon: Award,
    title: "Flyknit",
    description: "Precision-engineered fabric for a sock-like fit with minimal waste.",
  },
  {
    icon: Globe,
    title: "Nike Grind",
    description: "Recycled materials giving new life to worn-out shoes and manufacturing scraps.",
  },
  {
    icon: Heart,
    title: "Nike Fit",
    description: "AI-powered shoe fitting technology for the perfect size every time.",
  },
];

const proofPoints = [
  { value: "04", label: "research-led systems" },
  { value: "365", label: "days of sport culture" },
  { value: "01", label: "connected Nike universe" },
];

const glassPanel =
  "border border-white/12 bg-white/[0.075] shadow-[0_18px_44px_rgba(0,0,0,0.28)]";

const ExplorePage = () => {
  const [selectedTab, setSelectedTab] = useState("Featured");
  const activeTab = tabDetails[selectedTab];

  return (
    <div className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <EcomNavbar />

      <main>
        <section className="relative min-h-[92vh] overflow-hidden pt-28">
          <img
            src="https://media.gq-magazine.co.uk/photos/67334c214ed46d433b25de24/16:9/w_2560%2Cc_limit/Nike-AF1.jpg"
            alt="Nike footwear editorial"
            className="absolute inset-0 h-full w-full object-cover opacity-65"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_14%,rgba(255,255,255,0.28),transparent_28%),linear-gradient(115deg,rgba(0,0,0,0.94)_0%,rgba(0,0,0,0.72)_42%,rgba(0,0,0,0.28)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050505] to-transparent" />

          <div className="relative z-10 mx-auto flex min-h-[calc(92vh-7rem)] max-w-7xl flex-col justify-end px-5 pb-10 sm:px-6 lg:px-8">
            <div className="grid items-end gap-8 lg:grid-cols-[1.08fr_0.92fr]">
              <div className="max-w-4xl">
                <p className="mb-5 text-xs font-semibold uppercase tracking-[0.42em] text-white/60">
                  Nike Explore
                </p>
                <h1 className="max-w-5xl text-5xl font-black uppercase leading-[0.92] tracking-normal text-white sm:text-6xl lg:text-8xl">
                  Where Sport Becomes Design Intelligence.
                </h1>
                <p className="mt-7 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
                  Discover the stories, technologies, athletes, and cultural signals that drive Nike
                  forward, from lab-tested innovation to everyday icons.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link href="/nike/products">
                    <Button className="h-12 rounded-full bg-white px-7 text-sm font-black uppercase tracking-[0.16em] text-black hover:bg-white/88">
                      Shop the edit
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="h-12 rounded-full border-white/25 bg-white/12 px-7 text-sm font-black uppercase tracking-[0.16em] text-white hover:bg-white/16"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Watch story
                  </Button>
                </div>
              </div>

              <div className={`${glassPanel} rounded-[2rem] p-5 sm:p-6`}>
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/46">
                      Current focus
                    </p>
                    <h2 className="mt-2 text-2xl font-black uppercase leading-none">
                      {selectedTab}
                    </h2>
                  </div>
                  <Sparkles className="h-6 w-6 text-white/70" />
                </div>
                <p className="mt-6 text-xl font-semibold leading-7 text-white">
                  {activeTab.title}
                </p>
                <p className="mt-4 text-sm leading-6 text-white/58">{activeTab.description}</p>
                <div className="mt-7 grid grid-cols-3 gap-3">
                  {proofPoints.map((point) => (
                    <div
                      key={point.label}
                      className="rounded-2xl border border-white/10 bg-black/28 p-4"
                    >
                      <p className="text-2xl font-black">{point.value}</p>
                      <p className="mt-2 text-[0.66rem] font-bold uppercase leading-4 tracking-[0.18em] text-white/46">
                        {point.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="sticky top-16 z-40 border-y border-white/10 bg-black/88 shadow-[0_10px_30px_rgba(0,0,0,0.24)]">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="flex gap-2 overflow-x-auto py-4">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`min-h-10 whitespace-nowrap rounded-full border px-5 text-xs font-black uppercase tracking-[0.18em] transition-colors ${
                    selectedTab === tab
                      ? "border-white bg-white text-black"
                      : "border-white/12 bg-white/[0.06] text-white/58 hover:border-white/28 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="relative py-20 [contain-intrinsic-size:760px] [content-visibility:auto]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(255,255,255,0.12),transparent_26%),linear-gradient(180deg,#050505_0%,#101010_100%)]" />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className={`${glassPanel} grid overflow-hidden rounded-[2rem] lg:grid-cols-[0.88fr_1.12fr]`}>
              <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.32em] text-white/46">
                    Research lab
                  </p>
                  <h2 className="mt-5 text-4xl font-black uppercase leading-none sm:text-5xl">
                    The Science of Performance
                  </h2>
                  <p className="mt-6 max-w-xl text-base leading-7 text-white/62">
                    Go behind the scenes at the Nike Sport Research Lab where innovation meets human
                    performance. See how products are tested, iterated, and refined.
                  </p>
                </div>
                <Button className="mt-8 h-12 w-fit rounded-full bg-white px-7 text-sm font-black uppercase tracking-[0.16em] text-black hover:bg-white/88">
                  <Play className="mr-2 h-4 w-4" />
                  Watch documentary
                </Button>
              </div>

              <div className="relative min-h-[320px] border-t border-white/10 bg-black/40 lg:border-l lg:border-t-0">
                <video
                  className="h-full min-h-[320px] w-full object-cover opacity-90"
                  controls
                  preload="metadata"
                  poster="https://img3.wallspic.com/crops/5/5/2/6/4/146255/146255-shoe-black-darkness-nike-graphic_design-3840x2160.jpg"
                >
                  <source src="/Documentary.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="pointer-events-none absolute left-5 top-5 rounded-full border border-white/12 bg-black/70 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white/72">
                  Documentary
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-20 [contain-intrinsic-size:820px] [content-visibility:auto]">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.32em] text-white/40">
                  Collections
                </p>
                <h2 className="mt-3 text-4xl font-black uppercase leading-none sm:text-5xl">
                  Featured Systems
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-white/55">
                Dive into the technologies, materials, and silhouettes that define the Nike product
                language.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              {featuredCollections.map((collection) => (
                <article
                  key={collection.title}
                  className={`${glassPanel} group overflow-hidden rounded-[1.75rem] transition-colors hover:border-white/24`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
                    <img
                      src={collection.image}
                      alt={collection.title}
                      className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-85"
                      decoding="async"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/12 to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full border border-white/16 bg-black/72 px-3 py-1.5 text-[0.66rem] font-black uppercase tracking-[0.18em] text-white/74">
                      {collection.badge}
                    </span>
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-white/44">
                      {collection.subtitle}
                    </p>
                    <h3 className="mt-3 text-2xl font-black uppercase">{collection.title}</h3>
                    <p className="mt-4 min-h-20 text-sm leading-6 text-white/58">
                      {collection.description}
                    </p>
                    <Link href={collection.link}>
                      <Button className="mt-6 h-11 w-full rounded-full bg-white text-xs font-black uppercase tracking-[0.16em] text-black hover:bg-white/88">
                        Explore now
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative py-20 [contain-intrinsic-size:620px] [content-visibility:auto]">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#050505_0%,#151515_48%,#050505_100%)]" />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
              <div className="lg:sticky lg:top-36">
                <p className="text-xs font-black uppercase tracking-[0.32em] text-white/40">
                  Innovation
                </p>
                <h2 className="mt-3 text-4xl font-black uppercase leading-none sm:text-5xl">
                  Engineered to Disappear Into Motion.
                </h2>
                <p className="mt-6 text-sm leading-6 text-white/55">
                  The best technology should feel invisible once the run, lift, match, or commute
                  starts.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {innovations.map((innovation) => (
                  <article
                    key={innovation.title}
                    className={`${glassPanel} rounded-[1.5rem] p-6 transition-colors hover:border-white/24`}
                  >
                    <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.07]">
                      <innovation.icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-black uppercase">{innovation.title}</h3>
                    <p className="mt-4 text-sm leading-6 text-white/56">{innovation.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-20 [contain-intrinsic-size:760px] [content-visibility:auto]">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.32em] text-white/40">
                  Journal
                </p>
                <h2 className="mt-3 text-4xl font-black uppercase leading-none sm:text-5xl">
                  Latest Stories
                </h2>
              </div>
              <Button
                variant="ghost"
                className="w-fit rounded-full border border-white/12 bg-white/[0.06] px-5 text-xs font-black uppercase tracking-[0.16em] text-white hover:bg-white/12"
              >
                View all stories
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {stories.map((story) => (
                <article
                  key={story.title}
                  className={`${glassPanel} group cursor-pointer overflow-hidden rounded-[1.75rem] transition-colors hover:border-white/24`}
                >
                  <div className="aspect-[16/10] overflow-hidden bg-white/5">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-85"
                      decoding="async"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.14em] text-white/46">
                      <span className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-white/68">
                        {story.category}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {story.date}
                      </span>
                      <span>&middot; {story.readTime}</span>
                    </div>
                    <h3 className="mt-5 text-xl font-black uppercase leading-tight transition-colors group-hover:text-white/72">
                      {story.title}
                    </h3>
                    <button className="mt-6 flex items-center text-xs font-black uppercase tracking-[0.16em] text-white/72 transition-colors group-hover:text-white">
                      Read more
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-24 [contain-intrinsic-size:520px] [content-visibility:auto]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.16),transparent_30%),linear-gradient(180deg,#050505_0%,#111_100%)]" />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className={`${glassPanel} overflow-hidden rounded-[2rem] p-6 sm:p-10 lg:p-12`}>
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.32em] text-white/40">
                    Shop the result
                  </p>
                  <h2 className="mt-4 max-w-3xl text-4xl font-black uppercase leading-none sm:text-6xl">
                    Ready to Experience the Innovation?
                  </h2>
                  <p className="mt-6 max-w-xl text-sm leading-6 text-white/55">
                    Shop the latest collections featuring cutting-edge technology and Nike's most
                    recognizable design systems.
                  </p>
                </div>
                <Link href="/nike/products">
                  <Button className="h-12 rounded-full bg-white px-7 text-sm font-black uppercase tracking-[0.16em] text-black hover:bg-white/88">
                    Shop now
                    <TrendingUp className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <EcomFooter />
    </div>
  );
};

export default ExplorePage;
