"use client"
import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Edit, Trash2, Eye, EyeOff, X, Save, Image as ImageIcon } from "lucide-react"
import axios from "axios"
import BarGraph from "@/components/bargraph"

// Mock data to initialize (so the page isn't empty if the API fails)
const INITIAL_DATA = [
  { id: 1, name: "Streetwear", image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&q=80&w=500", status: "Active", products: 120 },
  { id: 2, name: "Footwear", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=500", status: "Active", products: 85 },
  { id: 3, name: "Accessories", image: "https://images.unsplash.com/photo-1523293188086-b15bc2936be8?auto=format&fit=crop&q=80&w=500", status: "Inactive", products: 42 },
]

const Categories = () => {
  const [categories, setCategories] = useState(INITIAL_DATA)
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  
  // Form State
  const [currentId, setCurrentId] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    status: "Active",
    products: 0
  })

  // Fetch data (keeps your original logic, but falls back to mock data)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/categories")
        if (res.data && res.data.length > 0) {
          setCategories(res.data)
        }
      } catch (error) {
        console.log("Using mock data as API is not available yet")
      }
    }
    fetchData()
  }, [])

  // --- HANDLERS ---

  // 1. Handle Delete
  const handleDelete = (id, e) => {
    e.stopPropagation() // Prevent clicking the card
    if (window.confirm("Are you sure you want to delete this category?")) {
      setCategories(prev => prev.filter(cat => cat.id !== id))
      // Add axios.delete(`/api/categories/${id}`) here for backend
    }
  }

  // 2. Open Add Modal
  const openAddModal = () => {
    setIsEditing(false)
    setFormData({ name: "", image: "", status: "Active", products: 0 })
    setIsModalOpen(true)
  }

  // 3. Open Edit Modal
  const openEditModal = (cat, e) => {
    e.stopPropagation()
    setIsEditing(true)
    setCurrentId(cat.id)
    setFormData({
      name: cat.name,
      image: cat.image,
      status: cat.status,
      products: cat.products
    })
    setIsModalOpen(true)
  }

  // 4. Handle Form Submit
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.name) return alert("Name is required")

    // Default image if empty
    const imageToUse = formData.image.trim() !== "" 
      ? formData.image 
      : "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=500"

    if (isEditing) {
      // Update existing
      setCategories(prev => prev.map(cat => 
        cat.id === currentId ? { ...cat, ...formData, image: imageToUse } : cat
      ))
      // Add axios.put here
    } else {
      // Create new
      const newCat = {
        id: Date.now(), // simple random ID
        ...formData,
        image: imageToUse
      }
      setCategories(prev => [...prev, newCat])
      // Add axios.post here
    }

    setIsModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-black pb-12">
      {/* HEADER SECTION */}
      <div className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black px-6 pt-12 pb-8">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative z-10">
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

            <Button 
              onClick={openAddModal}
              className="group bg-white text-black hover:bg-gray-200 font-black text-sm uppercase tracking-wider px-8 py-6 rounded-full transition-all hover:scale-105"
            >
              <Plus size={20} className="mr-2" />
              Add Category
            </Button>
          </div>
        </div>
      </div>

      {/* CATEGORIES GRID */}
      <div className="px-6 mt-8">
        {categories.length === 0 ? (
           <div className="text-center text-gray-500 py-12">No categories found. Click "Add Category" to start.</div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <Card
              key={cat.id}
              className="group relative overflow-hidden border-0 bg-gradient-to-br from-gray-900 to-black hover:scale-105 transition-all duration-300 cursor-pointer"
              style={{
                animation: `slideUp 0.6s ease-out ${idx * 0.05}s backwards`,
              }}
            >
              <div className="relative aspect-square overflow-hidden bg-gray-800">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
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

                <div className="absolute inset-x-4 bottom-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                  <button 
                    onClick={(e) => openEditModal(cat, e)}
                    className="flex-1 flex items-center justify-center gap-2 bg-white text-black font-bold text-xs uppercase py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                  <button 
                    onClick={(e) => handleDelete(cat.id, e)}
                    className="flex items-center justify-center gap-2 bg-red-600 text-white font-bold text-xs uppercase px-3 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

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
        )}
      </div>

      {/* --- MODAL / DIALOG --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-sm bg-black/60 animate-in fade-in duration-200">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                {isEditing ? "Edit Category" : "New Category"}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-white transition-colors font-medium"
                  placeholder="e.g. Streetwear"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon size={12} /> Image URL
                </label>
                <input 
                  type="text" 
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-white transition-colors text-sm"
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-white transition-colors text-sm appearance-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Products Count</label>
                  <input 
                    type="number" 
                    value={formData.products}
                    onChange={(e) => setFormData({...formData, products: parseInt(e.target.value) || 0})}
                    className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-white transition-colors text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <Button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-6 rounded-xl"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-white hover:bg-gray-200 text-black font-black py-6 rounded-xl uppercase tracking-wider"
                >
                  <Save size={18} className="mr-2" />
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

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