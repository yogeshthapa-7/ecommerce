"use client"
import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, Eye, Package2, X, ZoomIn } from "lucide-react"
import axios from "axios"

const ProductsPage = () => {
  const [products, setProducts] = useState([])
  
  // Modals State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewingImage, setViewingImage] = useState(null) // State for Image Popup
  const [editingId, setEditingId] = useState(null)
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "Shoes",
    price: "",
    stock: 0,
    status: "active",
    image_url: "",
    description: "",
    colors: [],
    sizes: [],
    rating: 0,
    reviews_count: 0
  })

  // Initialize Data
  useEffect(() => {
    axios.get("/api/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error("Error fetching products:", err))
  }, [])

  // Handlers
  const handleDelete = (id) => {
    if (confirm("Delete this product from inventory?")) {
      setProducts(prev => prev.filter(p => p.id !== id))
    }
  }

  const handleOpenAdd = () => {
    setEditingId(null)
    setFormData({ 
      name: "", 
      category: "Shoes", 
      price: "", 
      stock: 0, 
      status: "active", 
      image_url: "",
      description: "",
      colors: [],
      sizes: [],
      rating: 0,
      reviews_count: 0
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (product) => {
    setEditingId(product.id)
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.sizes?.length || 0,
      status: product.status,
      image_url: product.image_url,
      description: product.description || "",
      colors: product.colors || [],
      sizes: product.sizes || [],
      rating: product.rating || 0,
      reviews_count: product.reviews_count || 0
    })
    setIsModalOpen(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    const displayImage = formData.image_url || "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b1bcbca4-e853-4df7-b329-5be3c61ee057/dunk-low-retro-mens-shoes-bc160F.png"
    let finalStatus = formData.status
    if (!formData.in_stock) finalStatus = "inactive"

    if (editingId) {
      setProducts(prev => prev.map(p => p.id === editingId ? {
        ...p, 
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        status: finalStatus,
        image_url: displayImage,
        description: formData.description,
        in_stock: formData.stock > 0,
        sizes: formData.sizes,
        colors: formData.colors,
        rating: formData.rating,
        reviews_count: formData.reviews_count
      } : p))
    } else {
      const newProduct = {
        id: `nk-${String(Date.now()).slice(-3)}`,
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        status: finalStatus,
        currency: "$",
        rating: parseFloat(formData.rating) || 0,
        reviews_count: parseInt(formData.reviews_count) || 0,
        colors: formData.colors,
        description: formData.description,
        image_url: displayImage,
        in_stock: formData.stock > 0,
        sizes: formData.sizes
      }
      setProducts(prev => [newProduct, ...prev])
    }
    setIsModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-black">
      {/* HEADER SECTION */}
      <div className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black px-6 pt-12 pb-8">
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

            <Button 
              onClick={handleOpenAdd}
              className="group bg-white text-black hover:bg-gray-200 font-black text-sm uppercase tracking-wider px-8 py-6 rounded-full transition-all hover:scale-105"
            >
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
                      <th className="px-4 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Product</th>
                      <th className="px-4 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider hidden md:table-cell">Category</th>
                      <th className="px-4 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Price</th>
                      <th className="px-4 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Rating</th>
                      <th className="px-4 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length === 0 ? (
                      <tr><td colSpan="6" className="px-4 py-8 text-center text-gray-500">No products.</td></tr>
                    ) : products.map((product, idx) => (
                      <tr
                        key={product.id}
                        className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors group"
                        style={{ animation: `fadeIn 0.4s ease-out ${idx * 0.05}s backwards` }}
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div 
                              className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0 cursor-pointer"
                              onClick={() => setViewingImage(product.image_url)}
                            >
                              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <span className="text-white font-bold text-sm">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 hidden md:table-cell"><span className="text-gray-400 text-sm">{product.category}</span></td>
                        <td className="px-4 py-4"><span className="text-white font-bold text-sm">${product.price.toFixed(2)}</span></td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-400 text-sm font-bold">{product.rating}</span>
                            <span className="text-gray-500 text-xs">({product.reviews_count})</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                            product.status === "active" && product.in_stock ? "bg-green-500/20 text-green-400 border border-green-500/50" :
                            !product.in_stock ? "bg-red-500/20 text-red-400 border border-red-500/50" :
                            "bg-gray-500/20 text-gray-400 border border-gray-500/50"
                          }`}>{product.in_stock ? "Active" : "Out of Stock"}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => setViewingImage(product.image_url)}
                              className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors group/eye relative"
                              title="View Image"
                            >
                              <Eye size={14} />
                            </button>

                            <button onClick={() => handleOpenEdit(product)} className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
                              <Edit size={14} />
                            </button>
                            <button onClick={() => handleDelete(product.id)} className="p-2 bg-gray-800 hover:bg-red-600 text-white rounded-lg transition-colors">
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

          {/* SIDEBAR */}
          <div className="relative overflow-hidden rounded-2xl hidden lg:block">
            <img src="https://w0.peakpx.com/wallpaper/142/362/HD-wallpaper-nike-brand-logo-cool-cloud.jpg" alt="Nike Background" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
            <div className="relative z-10 p-6 min-h-[400px] flex flex-col justify-end">
              <h2 className="text-5xl font-black text-white leading-tight tracking-tighter mb-3">
                JUST<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">DO IT.</span>
              </h2>
              <p className="text-gray-300 text-base font-medium max-w-xs">Sleek control of your Nike inventory.</p>
            </div>
          </div>
        </div>
      </div>

      {/* FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6 relative shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
            <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">{editingId ? "Edit Product" : "New Product"}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Product Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors appearance-none">
                    <option value="Shoes">Shoes</option>
                    <option value="Bags">Bags</option>
                    <option value="Hoodies">Hoodies</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors appearance-none">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Price ($)</label>
                  <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Stock Available</label>
                  <input type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Image URL</label>
                <input type="text" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors" rows="3" />
              </div>
              <div className="pt-4 flex gap-3">
                <Button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-800 text-white hover:bg-gray-700 font-bold py-6 rounded-xl transition-colors">Cancel</Button>
                <Button type="submit" className="flex-1 bg-white text-black hover:bg-gray-200 font-black uppercase tracking-wider py-6 rounded-xl transition-colors">{editingId ? "Update" : "Create"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IMAGE PREVIEW MODAL */}
      {viewingImage && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setViewingImage(null)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center p-2">
            
            <button 
              onClick={() => setViewingImage(null)}
              className="absolute -top-12 right-0 md:top-4 md:right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-all"
            >
              <X size={24} />
            </button>

            <div 
              className="relative overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={viewingImage} 
                alt="Product Preview" 
                className="max-h-[80vh] w-auto object-contain bg-gray-900"
              />
            </div>
            
            <p className="mt-4 text-gray-400 text-sm font-medium">Click outside to close</p>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      ` }} />
    </div>
  )
}

export default ProductsPage