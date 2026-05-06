"use client"
import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Pagination from "@/components/ui/pagination"
import { 
  Plus, Edit, Trash2, Eye, Package2, X, ZoomIn, 
  CheckCircle, AlertCircle, ChevronDown, ChevronUp,
  Tag, Info, Layers, Globe, DollarSign
} from "lucide-react"
import axios from "axios"
const ProductsPage = () => {
  const [products, setProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [expandedId, setExpandedId] = useState(null) // Added for expansion logic
  // Modals State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewingImage, setViewingImage] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [editingId, setEditingId] = useState(null)
  // Toast State
  const [toast, setToast] = useState({ show: false, message: "", type: "success" })
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "Shoes",
    gender: "Unisex",
    price: "",
    stock: 0,
    status: "active",
    image_url: "",
    description: "",
    colors: [],
    sizes: [],
    reviews_count: 0,
    in_stock: true
  })
  const [sizesInput, setSizesInput] = useState("")
  const [newColor, setNewColor] = useState({ name: "", image_url: "" })
  useEffect(() => {
    fetchProducts()
  }, [currentPage])
  const fetchProducts = async (page = currentPage) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products?showAll=true&page=${page}&limit=10`)
      setProducts(res.data.products || [])
      setPagination(res.data.pagination || null)
    } catch (err) {
      console.error("Error fetching products:", err)
      setProducts([])
      setPagination(null)
      showToast("Failed to fetch products", "error")
    }
  }

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000)
  }
  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }
  const handleDelete = (e, product) => {
    e.stopPropagation() // Prevent row expansion when clicking delete
    setDeleteConfirm(product)
  }
  const confirmDelete = async () => {
    try {
      const id = deleteConfirm._id || deleteConfirm.id;
      const token = localStorage.getItem("token")
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      await fetchProducts(currentPage)
      showToast("Product deleted successfully", "success")
    } catch (err) {
      console.error("Error deleting product:", err)
      showToast("Failed to delete product", "error")
    } finally {
      setDeleteConfirm(null)
    }
  }
  const handleOpenAdd = () => {
    setEditingId(null)
    setSizesInput("")
    setNewColor({ name: "", image_url: "" })
    setFormData({
      name: "", category: "Shoes", gender: "Unisex", price: "", stock: 0,
      status: "active", image_url: "", description: "", colors: [],
      sizes: [], reviews_count: 0, in_stock: true
    })
    setIsModalOpen(true)
  }
  const handleOpenEdit = (e, product) => {
    e.stopPropagation() // Prevent row expansion when clicking edit
    setEditingId(product._id || product.id)
    setSizesInput((product.sizes || []).join(", "))
    setNewColor({ name: "", image_url: "" })
    setFormData({
      name: product.name,
      category: product.category,
      gender: product.gender || "Unisex",
      price: product.price,
      stock: product.sizes?.length || 0,
      status: product.status,
      image_url: product.image_url,
      description: product.description || "",
      colors: product.colors || [],
      sizes: product.sizes || [],
      reviews_count: product.reviews_count || 0,
      in_stock: product.in_stock !== undefined ? product.in_stock : true
    })
    setIsModalOpen(true)
  }
  const handleSizesChange = (value) => {
    setSizesInput(value)
    setFormData(prev => ({
      ...prev,
      sizes: value.split(",").map(size => size.trim()).filter(Boolean)
    }))
  }
  const addColor = () => {
    const colorName = newColor.name.trim()
    const imageUrl = newColor.image_url.trim()

    if (!colorName || !imageUrl) {
      showToast("Add both color name and image URL", "error")
      return
    }

    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, { name: colorName, image_url: imageUrl }]
    }))
    setNewColor({ name: "", image_url: "" })
  }
  const removeColor = (index) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }))
  }
  const handleSave = async (e) => {
    e.preventDefault()
    const displayImage = formData.image_url || "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b1bcbca4-e853-4df7-b329-5be3c61ee057/dunk-low-retro-mens-shoes-bc160F.png"
    const productData = {
      name: formData.name,
      category: formData.category,
      gender: formData.gender,
      price: parseFloat(formData.price),
      status: formData.status,
      image_url: displayImage,
      description: formData.description,
      in_stock: formData.in_stock,
      sizes: formData.sizes,
      colors: formData.colors,
      reviews_count: parseInt(formData.reviews_count) || 0
    }
    const token = localStorage.getItem("token")
    const config = { headers: { Authorization: `Bearer ${token}` } }
    try {
      if (editingId) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/products/${editingId}`, productData, config)
        await fetchProducts(currentPage)
        showToast("Product updated successfully", "success")
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/products`, productData, config)
        if (currentPage === 1) {
          await fetchProducts(1)
        } else {
          setCurrentPage(1)
        }
        showToast("Product added successfully", "success")
      }
      setIsModalOpen(false)
    } catch (err) {
      console.error("Error saving product:", err)
      showToast("Failed to save product", "error")
    }
  }
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* TOAST */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-top-2 fade-in duration-300">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border ${toast.type === "success" ? "bg-green-500/90 border-green-400" : "bg-red-500/90 border-red-400"} backdrop-blur-sm text-white`}>
            {toast.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-bold">{toast.message}</span>
          </div>
        </div>
      )}
      {/* HEADER */}
      <div className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black px-6 pt-12 pb-8">
        <div className="relative z-10">
          <div className="inline-block mb-3 px-4 py-1 bg-white text-black text-xs font-black tracking-widest uppercase rounded-full">Inventory Management</div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1 className="text-6xl md:text-7xl font-black text-white leading-none tracking-tighter mb-3">PRODUCTS</h1>
              <p className="text-xl text-gray-400 font-medium">Manage your Nike product catalog</p>
            </div>
            <Button onClick={handleOpenAdd} className="group bg-white text-black hover:bg-gray-200 font-black text-sm uppercase tracking-wider px-8 py-6 rounded-full transition-all hover:scale-105">
              <Plus size={20} className="mr-2" /> Add Product
            </Button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="px-6 py-8">
        <div className="space-y-6">
          {/* FEATURE IMAGE */}
          <div className="relative overflow-hidden rounded-2xl min-h-[240px] border border-gray-800">
            <img src="https://w0.peakpx.com/wallpaper/142/362/HD-wallpaper-nike-brand-logo-cool-cloud.jpg" alt="Nike Background" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
            <div className="relative z-10 p-6 sm:p-8 min-h-[240px] flex flex-col justify-end">
              <h2 className="text-5xl sm:text-6xl font-black text-white leading-tight tracking-tighter mb-3">
                JUST <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">DO IT.</span>
              </h2>
              <p className="text-gray-300 text-base font-medium max-w-lg">Sleek control of your Nike inventory.</p>
            </div>
          </div>

          {/* PRODUCTS TABLE */}
          <div className="w-full">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border border-gray-800">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800 bg-black/40">
                      <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider hidden md:table-cell">Category</th>
                      <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(!Array.isArray(products) || products.length === 0) ? (
                      <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">No products available in the catalog.</td></tr>
                    ) : (
                    products.map((product, idx) => {
                      const pId = product._id || product.id;
                      const isExpanded = expandedId === pId;

                      return (
                        <React.Fragment key={pId || idx}>
                          {/* MAIN ROW */}
                          <tr 
                            onClick={() => toggleExpand(pId)}
                            className={`border-b border-gray-800 hover:bg-gray-800/30 transition-all cursor-pointer group ${isExpanded ? 'bg-gray-800/20' : ''}`}
                          >
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-4">
                                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0 border border-gray-700">
                                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div>
                                  <span className="text-white font-bold text-base block mb-0.5">{product.name}</span>
                                  <span className="text-gray-500 text-xs font-medium tracking-wide uppercase">{product.gender}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5 hidden md:table-cell text-gray-400 font-medium">{product.category}</td>
                            <td className="px-6 py-5">
                              <span className="text-white font-black text-base">${product.price.toFixed(2)}</span>
                            </td>
                            <td className="px-6 py-5">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${product.in_stock ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                                {product.in_stock ? "In Stock" : "Out of Stock"}
                              </span>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <button onClick={(e) => handleOpenEdit(e, product)} className="p-2.5 bg-gray-800 hover:bg-white hover:text-black text-gray-400 rounded-xl transition-all shadow-sm">
                                  <Edit size={16} />
                                </button>
                                <button onClick={(e) => handleDelete(e, product)} className="p-2.5 bg-gray-800 hover:bg-red-600 hover:text-white text-gray-400 rounded-xl transition-all shadow-sm">
                                  <Trash2 size={16} />
                                </button>
                                {isExpanded ? <ChevronUp size={20} className="text-gray-600 ml-2" /> : <ChevronDown size={20} className="text-gray-600 ml-2" />}
                              </div>
                            </td>
                          </tr>

                          {/* EXPANDED DETAIL VIEW */}
                          {isExpanded && (
                            <tr className="bg-gray-900/50 border-b border-gray-800 animate-in fade-in slide-in-from-top-2 duration-300">
                              <td colSpan={5} className="px-8 py-10">
                                <div className="flex flex-col lg:flex-row gap-12 items-start">
                                  <div className="w-full lg:w-1/3 aspect-square rounded-3xl overflow-hidden bg-black border border-gray-800 shadow-2xl group/image relative">
                                    <img src={product.image_url} alt={product.name} className="w-full h-full object-contain p-4" />
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); setViewingImage(product.image_url); }}
                                      className="absolute bottom-4 right-4 p-3 bg-white/10 hover:bg-white text-white hover:text-black rounded-full backdrop-blur-md transition-all opacity-0 group-hover/image:opacity-100"
                                    >
                                      <ZoomIn size={20} />
                                    </button>
                                  </div>

                                  <div className="flex-1 w-full space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12">
                                      <div className="space-y-1">
                                        <span className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest"><Info size={14} className="text-gray-600" /> Product Name</span>
                                        <p className="text-white font-bold text-lg border-b border-gray-800 pb-2">{product.name}</p>
                                      </div>
                                      <div className="space-y-1">
                                        <span className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest"><DollarSign size={14} className="text-gray-600" /> Price</span>
                                        <p className="text-white font-black text-lg border-b border-gray-800 pb-2">${product.price.toFixed(2)}</p>
                                      </div>
                                      <div className="space-y-1">
                                        <span className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest"><Package2 size={14} className="text-gray-600" /> Sizes</span>
                                        <p className="text-white font-bold text-lg border-b border-gray-800 pb-2">{product.sizes?.length > 0 ? product.sizes.join(' — ') : "N/A"}</p>
                                      </div>
                                      <div className="space-y-1">
                                        <span className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest"><Tag size={14} className="text-gray-600" /> ID Number</span>
                                        <p className="text-gray-400 font-mono text-sm border-b border-gray-800 pb-2 uppercase">{pId.slice(-8)}...</p>
                                      </div>
                                      <div className="space-y-1">
                                        <span className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest"><Layers size={14} className="text-gray-600" /> Category</span>
                                        <p className="text-white font-bold text-lg border-b border-gray-800 pb-2">{product.category}</p>
                                      </div>
                                      <div className="space-y-1">
                                        <span className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest"><Globe size={14} className="text-gray-600" /> Made In</span>
                                        <p className="text-white font-bold text-lg border-b border-gray-800 pb-2">USA / Imported</p>
                                      </div>
                                    </div>
                                    <div className="space-y-6 pt-4">
                                      <div className="space-y-2">
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Description</span>
                                        <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">{product.description || "No description provided."}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    }))}
                  </tbody>
                </table>
              </div>
            </div>
            {pagination && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={(page) => {
                  setExpandedId(null)
                  setCurrentPage(page)
                }}
              />
            )}
          </div>
        </div>
      </div>


      {/* DELETE CONFIRMATION POPUP */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">Delete Product?</h2>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete <span className="font-bold text-white">"{deleteConfirm.name}"</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 bg-gray-800 text-white hover:bg-gray-700 font-bold py-3 rounded-xl transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-500 text-white hover:bg-red-600 font-bold py-3 rounded-xl transition-colors"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FORM MODAL - EXPANDED WITH ALL FIELDS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl p-6 relative shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
            <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">{editingId ? "Edit Product" : "New Product"}</h2>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>

              {/* Category, Gender, Status */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors appearance-none"
                  >
                    <option value="Shoes">Shoes</option>
                    <option value="Bags">Bags</option>
                    <option value="Hoodies">Hoodies</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors appearance-none"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Status *</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors appearance-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Price and In Stock Toggle */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">In Stock</label>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, in_stock: !formData.in_stock })}
                    className={`relative inline-flex h-10 w-full items-center rounded-full transition-colors focus:outline-none ${formData.in_stock ? 'bg-green-500' : 'bg-red-500'}`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${formData.in_stock ? 'translate-x-10' : 'translate-x-1'}`}
                    />
                    <span className={`absolute left-3 text-xs font-bold ${formData.in_stock ? 'text-white' : 'text-white'}`}>
                      {formData.in_stock ? 'YES' : 'NO'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Main Image URL</label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                  rows="3"
                  placeholder="Product description..."
                />
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Available Sizes</label>
                <input
                  type="text"
                  value={sizesInput}
                  onChange={(e) => handleSizesChange(e.target.value)}
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                  placeholder="Enter sizes separated by commas (e.g., 7, 8, 9, 10, 11)"
                />
                {formData.sizes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.sizes.map((size, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-800 text-white rounded-full text-xs">
                        {size}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Colors Section */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Product Colors</label>

                {/* Existing Colors */}
                {formData.colors.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {formData.colors.map((color, index) => (
                      <div key={index} className="flex items-center gap-2 bg-black border border-gray-800 rounded-lg p-3">
                        <div className="flex-1">
                          <div className="text-white text-sm font-bold">{color.name}</div>
                          <div className="text-gray-500 text-xs truncate">{color.image_url}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeColor(index)}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add New Color */}
                <div className="grid grid-cols-[1fr_2fr_auto] gap-2">
                  <input
                    type="text"
                    value={newColor.name}
                    onChange={e => setNewColor({ ...newColor, name: e.target.value })}
                    className="bg-black border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white transition-colors text-sm"
                    placeholder="Color name"
                  />
                  <input
                    type="text"
                    value={newColor.image_url}
                    onChange={e => setNewColor({ ...newColor, image_url: e.target.value })}
                    className="bg-black border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white transition-colors text-sm"
                    placeholder="Image URL"
                  />
                  <button
                    type="button"
                    onClick={addColor}
                    className="px-4 py-2 bg-white text-black hover:bg-gray-200 font-bold rounded-lg transition-colors text-sm"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Reviews Count */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Reviews Count</label>
                <input
                  type="number"
                  value={formData.reviews_count}
                  onChange={e => setFormData({ ...formData, reviews_count: e.target.value })}
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                  placeholder="0"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex gap-3">
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-800 text-white hover:bg-gray-700 font-bold py-6 rounded-xl transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-white text-black hover:bg-gray-200 font-black uppercase tracking-wider py-6 rounded-xl transition-colors"
                >
                  {editingId ? "Update Product" : "Create Product"}
                </Button>
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

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      ` }} />
    </div>
  )
}

export default ProductsPage
