import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react"

const Categories = () => {
  const categories = [
    {
      id: "1",
      name: "Shoes",
      image:
        "https://static.nike.com/a/images/t_web_pdp_936_v2/f_auto/47b7945e-a379-4c24-b9df-98f4eef178e5/NIKE+AIR+MAX+PLUS.png",
      products: 42,
      status: "Active",
    },
    {
      id: "2",
      name: "Hoodies",
      image:
        "https://cdn.media.amplience.net/i/frasersdev/53101203_o?fmt=auto&upscale=false&w=767&h=767&sm=scaleFit&$h-ttl$",
      products: 18,
      status: "Active",
    },
    {
      id: "3",
      name: "Bags",
      image:
        "https://i8.amplience.net/i/jpl/jd_ANZ0126710_a?qlt=92",
      products: 10,
      status: "Hidden",
    },
    {
      id: "4",
      name: "Shorts",
      image:
        "https://soccerpost.com/cdn/shop/products/nike_park_iii_shorts_apparel.jpg?v=1740753668&width=1047",
      products: 20,
      status: "Active",
    },
     {
      id: "5",
      name: "Jerseys",
      image:
        "https://thesoccerfactory.com/cdn/shop/files/NikeParkVIIMens-Black.jpg?v=1752063507&width=1000",
      products: 22,
      status: "Active",
    },
    {
      id: "6",
      name: "Tops",
      image:
        "https://cdn-images.farfetch-contents.com/23/02/90/79/23029079_53346247_1000.jpg",
      products: 26,
      status: "Active",
    },
    {
      id: "7",
      name: "Leggings",
      image:
        "https://www.goaliemonkey.com/media/catalog/product/cache/a848536da192a0c5bb969d0898e6ec13/n/i/nike-undergarmets-just-do-it-power-training-tights-wmn_1.jpg",
      products: 13,
      status: "Active",
    },
    {
      id: "8",
      name: "Gym-Bra",
      image:
        "https://www.nikys-sports.com/cdn/shop/files/AURORA_DJ8523-010_PHSFH001-2000.jpg?v=1686777182",
      products: 10,
      status: "Active",
    },
  ]

  return (
    <div className="min-h-screen bg-black pb-12">
      {/* HEADER SECTION */}
      <div className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black px-6 pt-12 pb-8">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative z-10">
          {/* Breadcrumb style tag */}
          <div className="inline-block mb-3 px-4 py-1 bg-white text-black text-xs font-black tracking-widest uppercase rounded-full">
            Product Management
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1 className="text-6xl md:text-7xl font-black text-white leading-none tracking-tighter mb-3">
                CATEGORIES
              </h1>
              <p className="text-xl text-gray-400 font-medium">
                Manage your product collections
              </p>
            </div>

            <Button className="group bg-white text-black hover:bg-gray-200 font-black text-sm uppercase tracking-wider px-8 py-6 rounded-full transition-all hover:scale-105">
              <Plus size={20} className="mr-2" />
              Add Category
            </Button>
          </div>
        </div>
      </div>

      {/* CATEGORIES GRID */}
      <div className="px-6 mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <Card
              key={cat.id}
              className="group relative overflow-hidden border-0 bg-gradient-to-br from-gray-900 to-black hover:scale-105 transition-all duration-300 cursor-pointer"
              style={{
                animation: `slideUp 0.6s ease-out ${idx * 0.05}s backwards`,
              }}
            >
              {/* Image container with overlay */}
              <div className="relative aspect-square overflow-hidden bg-gray-800">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Status badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-sm ${
                      cat.status === "Active"
                        ? "bg-green-500/30 text-green-300 border border-green-500/50"
                        : "bg-gray-500/30 text-gray-300 border border-gray-500/50"
                    }`}
                  >
                    {cat.status === "Active" ? <Eye size={12} /> : <EyeOff size={12} />}
                    {cat.status}
                  </span>
                </div>

                {/* Quick action buttons on hover */}
                <div className="absolute inset-x-4 bottom-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-white text-black font-bold text-xs uppercase py-2 rounded-lg hover:bg-gray-200 transition-colors">
                    <Edit size={14} />
                    Edit
                  </button>
                  <button className="flex items-center justify-center gap-2 bg-red-600 text-white font-bold text-xs uppercase px-3 py-2 rounded-lg hover:bg-red-700 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-black text-white tracking-tight uppercase">
                    {cat.name}
                  </h3>
                </div>
                
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <span className="font-bold">{cat.products}</span>
                    <span className="font-medium">Products</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      ` }} />
    </div>
  )
}

export default Categories