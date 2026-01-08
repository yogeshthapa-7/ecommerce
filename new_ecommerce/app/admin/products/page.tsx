"use client"
import React from "react"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, Eye, Package2 } from "lucide-react"

const ProductsPage = () => {
  const products = [
    { 
      id: "1", 
      name: "Nike Air Max 270", 
      category: "Shoes", 
      price: 180, 
      stock: 24, 
      status: "Active", 
      image: "https://image-cdn.hypb.st/https%3A%2F%2Fhypebeast.com%2Fimage%2F2020%2F03%2Fsize-nike-air-max-95-20-for-20-release-date-info-0.jpg?w=960&cbr=1&q=90&fit=max", 
    }, 
    { 
      id: "2", 
      name: "Nike Tech Fleece Hoodie", 
      category: "Hoodies", 
      price: 120, 
      stock: 0, 
      status: "Out of Stock", 
      image: "https://images.prodirectsport.com/ProductImages/Main/1029527_Main_1954523.jpg", 
    }, 
    { 
      id: "3", 
      name: "Nike Utility Backpack", 
      category: "Bags", 
      price: 95, 
      stock: 15, 
      status: "Draft", 
      image: "https://i5.walmartimages.com/seo/Nike-Utility-Elite-Training-Backpack-BLACK-BLACK-ENIGMA-STONE_a1907b5d-bbcd-4171-a4a2-9c89a533f32d.89440c0fddb1cd830b062b007741d9cc.jpeg", 
    }, 
    { 
      id: "4", 
      name: "Nike Air Force 1", 
      category: "Shoes", 
      price: 150, 
      stock: 30, 
      status: "Active", 
      image: "https://image-cdn.hypb.st/https%3A%2F%2Fhypebeast.com%2Fimage%2F2015%2F10%2Fnike-air-force-1-07-lv8-croc-1.jpg?q=75&w=800&cbr=1&fit=max", 
    }, 
    { 
      id: "5", 
      name: "Nike React Infinity Run", 
      category: "Shoes", 
      price: 190, 
      stock: 12, 
      status: "Active", 
      image: "https://believeintherun.com/wp-content/uploads/2022/05/nike-react-infinity-run-flyknit-3-cover.jpg", 
    }, 
    { 
      id: "6", 
      name: "Nike Dri-FIT Training Hoodie", 
      category: "Hoodies", 
      price: 110, 
      stock: 20, 
      status: "Active", 
      image: "https://www.bfgcdn.com/1500_1500_90/008-1410-0211/nike-primary-dri-fit-uv-training-hoodie.jpg", 
    }, 
    { 
      id: "7", 
      name: "Nike Sportswear Club Hoodie", 
      category: "Hoodies", 
      price: 95, 
      stock: 0, 
      status: "Out of Stock", 
      image: "https://www.lax.com/cdn/shop/files/nike-mens-nsw-club-hoodie-fz-bb-apparel-tops-nike-bv2645-071-xl-charcoal-071-942408.png?v=1723145409", 
    }, 
    { 
      id: "8", 
      name: "Nike Brasilia Training Backpack", 
      category: "Bags", 
      price: 85, 
      stock: 18, 
      status: "Active", 
      image: "https://www.misterrunning.com/images/2021-media/nike-brasilia-95-zaino-da-allenamento-black-white-dh7709-010_A.jpg", 
    },
  ]

  return (
    <div className="min-h-screen bg-black">
      {/* HEADER SECTION */}
      <div className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black px-6 pt-12 pb-8">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative z-10">
          <div className="inline-block mb-3 px-4 py-1 bg-white text-black text-xs font-black tracking-widest uppercase rounded-full">
            Inventory Management
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1 className="text-6xl md:text-7xl font-black text-white leading-none tracking-tighter mb-3">
                PRODUCTS
              </h1>
              <p className="text-xl text-gray-400 font-medium">
                Manage your Nike product catalog
              </p>
            </div>

            <Button className="group bg-white text-black hover:bg-gray-200 font-black text-sm uppercase tracking-wider px-8 py-6 rounded-full transition-all hover:scale-105">
              <Plus size={20} className="mr-2" />
              Add Product
            </Button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PRODUCTS TABLE */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border border-gray-800">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="px-4 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider hidden md:table-cell">
                        Category
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, idx) => (
                      <tr
                        key={product.id}
                        className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors group"
                        style={{ animation: `fadeIn 0.4s ease-out ${idx * 0.05}s backwards` }}
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                            <span className="text-white font-bold text-sm">
                              {product.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 hidden md:table-cell">
                          <span className="text-gray-400 text-sm">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-white font-bold text-sm">
                            ${product.price}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <Package2 size={14} className="text-gray-500" />
                            <span className={`text-sm font-bold ${
                              product.stock === 0 ? 'text-red-400' : 'text-white'
                            }`}>
                              {product.stock}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                              product.status === "Active"
                                ? "bg-green-500/20 text-green-400 border border-green-500/50"
                                : product.status === "Out of Stock"
                                ? "bg-red-500/20 text-red-400 border border-red-500/50"
                                : "bg-gray-500/20 text-gray-400 border border-gray-500/50"
                            }`}
                          >
                            {product.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <button className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
                              <Eye size={14} />
                            </button>
                            <button className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
                              <Edit size={14} />
                            </button>
                            <button className="p-2 bg-gray-800 hover:bg-red-600 text-white rounded-lg transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* SIDEBAR - NIKE PANEL */}
          <div className="relative overflow-hidden rounded-2xl">
            <img
              src="https://w0.peakpx.com/wallpaper/142/362/HD-wallpaper-nike-brand-logo-cool-cloud.jpg"
              alt="Nike Background"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
            
            <div className="relative z-10 p-6 min-h-[400px] flex flex-col justify-end">
              <h2 className="text-5xl font-black text-white leading-tight tracking-tighter mb-3">
                JUST<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
                  DO IT.
                </span>
              </h2>
              <p className="text-gray-300 text-base font-medium max-w-xs">
                Sleek control of your Nike inventory, pricing, and availability.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      ` }} />
    </div>
  )
}

export default ProductsPage