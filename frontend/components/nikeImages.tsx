import InteractiveBentoGallery from "@/components/ui/interactive-bento-gallery"
import Link from "next/link"

const mediaItems = [
  {
    id: 1,
    type: "image",
    title: "Nike Air Max 270",
    desc: "Maximum air cushioning for all-day comfort",
    url: "https://i.pinimg.com/736x/37/cd/93/37cd9342417c0c486ae065bb5f6ebf82.jpg",
    span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2",
  },
  {
    id: 2,
    type: "image",
    title: "Nike Air Force 1",
    desc: "Iconic classic style since 1982",
    url: "https://w0.peakpx.com/wallpaper/1014/539/HD-wallpaper-black-white-nike-shoe-in-black-white-background-nike.jpg",
    span: "md:col-span-2 md:row-span-2 col-span-1 sm:col-span-2 sm:row-span-2",
  },
  {
    id: 3,
    type: "image",
    title: "Nike Best Collection",
    desc: "Premium sneaker lineup for every occasion",
    url: "https://media.gq.com/photos/5a39548550c0930b83d7950d/16:9/w_2560%2Cc_limit/nike-2017-best-sneakers.jpg",
    span: "md:col-span-1 md:row-span-3 sm:col-span-2 sm:row-span-2 ",
  },
  {
    id: 4,
    type: "image",
    title: "Nike Air Zoom",
    desc: "Futuristic running performance technology",
    url: "https://png.pngtree.com/thumb_back/fh260/background/20251020/pngtree-nike-air-zoom-running-shoe-with-a-futuristic-design-and-reflective-image_19927057.webp",
    span: "md:col-span-2 md:row-span-2 sm:col-span-1 sm:row-span-2 ",
  },
  {
    id: 5,
    type: "image",
    title: "Nike Dunk Low",
    desc: "Retro basketball design reimagined",
    url: "https://wallpaperswide.com/download/nike_sneakers-wallpaper-1680x1050.jpg",
    span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2 ",
  },
  {
    id: 6,
    type: "image",
    title: "Nike React Infinity",
    desc: "Revolutionary comfort for every run",
    url: "https://images.wallpapersden.com/image/download/nike-sport-shoes_Z2loZ2eUmZqaraWkpJRmbmdlrWZlbWU.jpg",
    span: "md:col-span-2 md:row-span-2 sm:col-span-1 sm:row-span-2 ",
  },
  {
    id: 7,
    type: "image",
    title: "Nike Jordan 1",
    desc: "Legendary basketball heritage style",
    url: "https://cdn.wallpapersafari.com/26/22/w4KimN.jpg",
    span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2 ",
  },
]

export function BentoGridGalleryDemo() {
  return (
    // Updated background to a deep radial gradient for a premium look
    <div className="min-h-screen overflow-y-auto bg-[#0a0a0a] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1a1a1a] via-[#0a0a0a] to-[#000000]">
      
      <div className="max-w-7xl mx-auto px-4 py-16">
        <header className="mb-12">
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">
            Fast Forward <span className="text-gray-500">/</span> Style
          </h2>
          <div className="h-1 w-20 bg-white mt-4 mb-6"></div>
          <p className="max-w-2xl text-lg md:text-xl font-medium text-gray-400 leading-tight">
            PUSHING THE BOUNDARIES OF SPORT AND STYLE. EXPLORE THE LATEST INNOVATIONS IN FOOTWEAR.
          </p>
        </header>

        <section className="rounded-xl overflow-hidden shadow-2xl shadow-white/5">
          <InteractiveBentoGallery
            mediaItems={mediaItems}
          />
        </section>

        <footer className="mt-20 pb-10 border-t border-white/10 pt-10 flex justify-between items-center">
            <span className="text-xs font-bold tracking-[0.3em] text-white/40 uppercase">Nike Digital Exhibit / 2024</span>
            <button className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors">
                <Link href="nike/products">SHOP COLLECTION
                </Link>
            </button>
        </footer>
      </div>
    </div>
  )
}