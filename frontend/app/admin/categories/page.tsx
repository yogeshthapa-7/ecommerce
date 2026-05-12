"use client"
import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Edit, Trash2, Eye, EyeOff, Save, Image as ImageIcon, CheckCircle, AlertCircle } from "lucide-react"
import axios from "axios"
import { AdminConfirmDialog, AdminModal, PageBody, PageHeader, adminPanel, fieldClass, labelClass, primaryButton } from "@/components/admin/AdminSurface"

type Category = {
  _id?: string
  id?: string
  name: string
  image?: string
  status?: string
  products?: number
  isGhost?: boolean
  inStock?: boolean
}

const getCategoryId = (cat: Category) => cat._id || cat.id || ""
const getCategoryKey = (cat: Category, index: number) =>
  getCategoryId(cat) || `${cat.name || "category"}-${index}`

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([])

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "success",
  })

  // Form State
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    status: "Active",
    products: 0,
    isGhost: false,
    inStock: true
  })

  // Fetch data
  useEffect(() => {
    fetchCategories()
  }, [])

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type })
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" })
    }, 3000)
  }

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
      const categoryData = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.categories)
          ? res.data.categories
          : []
      setCategories(categoryData)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  // --- HANDLERS ---

  // 1. Handle Delete
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`)
      setCategories(prev => prev.filter(cat => getCategoryId(cat) !== id))
      showToast("Category deleted successfully")
    } catch (error) {
      console.error("Error deleting category:", error)
      showToast("Error deleting category", "error")
    } finally {
      setDeleteTarget(null)
    }
  }

  // 2. Open Add Modal
  const openAddModal = () => {
    setIsEditing(false)
    setFormData({ name: "", image: "", status: "Active", products: 0, isGhost: false, inStock: true })
    setIsModalOpen(true)
  }

  // 3. Open Edit Modal
  const openEditModal = (cat: any, e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(true)
    setCurrentId(getCategoryId(cat))
    setFormData({
      name: cat.name,
      image: cat.image || "",
      status: cat.status || "Active",
      products: cat.products || 0,
      isGhost: !!cat.isGhost,
      inStock: cat.inStock !== undefined ? cat.inStock : true
    })
    setIsModalOpen(true)
  }

  // 4. Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name) {
      showToast("Name is required", "error")
      return
    }

    const imageToUse = formData.image.trim() !== ""
      ? formData.image
      : "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=500"

    const { products, isGhost, ...submitData } = formData;
    const categoryData = {
      ...submitData,
      image: imageToUse
    }

    try {
      if (isEditing && currentId && currentId !== 'undefined') {
        const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/categories/${currentId}`, categoryData)
        setCategories(prev => prev.map(cat =>
          getCategoryId(cat) === currentId ? res.data : cat
        ))
        showToast("Category updated successfully")
      } else {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/categories`, categoryData)
        setCategories(prev => [...prev.filter(c => c.name !== res.data.name), res.data])
        showToast("Category added successfully")
      }
      setIsModalOpen(false)
    } catch (err: any) {
      console.error("Error saving category:", err)
      showToast(err.response?.data?.message || "Error saving category", "error")
    }
  }

  return (
    <div className="min-h-screen bg-[#080808] pb-12">
      {toast.show ? (
        <div className="fixed right-4 top-4 z-[100] animate-in slide-in-from-top-2 fade-in duration-300">
          <div className={`flex items-center gap-3 rounded-xl border px-6 py-4 text-white shadow-2xl ${toast.type === "success" ? "border-emerald-400/40 bg-emerald-500/90" : "border-red-400/40 bg-red-500/90"}`}>
            {toast.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-bold">{toast.message}</span>
          </div>
        </div>
      ) : null}

      <PageHeader
        title="Categories"
        label="Product Management"
        description="Manage collection visibility, imagery, and stock status without slowing down the catalog view."
        action={
          <button onClick={openAddModal} className={primaryButton}>
            <Plus size={18} />
            Add Category
          </button>
        }
      />

      {/* CATEGORIES GRID */}
      <PageBody>
        {categories.length === 0 ? (
          <div className="py-12 text-center text-white/35">No categories found. Click "Add Category" to start.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((cat, index) => (
              <Card
                key={getCategoryKey(cat, index)}
                className={`${adminPanel} group relative cursor-pointer overflow-hidden border-white/10 bg-[#111111] transition-colors hover:border-white/20`}
              >
                <div className="relative aspect-square overflow-hidden bg-gray-800">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent opacity-90" />

                  <div className="absolute top-4 right-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-sm ${cat.status === "Active"
                        ? "bg-green-500/30 text-green-300 border border-green-500/50"
                        : "bg-gray-500/30 text-gray-300 border border-gray-500/50"
                        }`}
                    >
                      {cat.status === "Active" ? <Eye size={12} /> : <EyeOff size={12} />}
                      {cat.status}
                    </span>
                  </div>

                  <div className="absolute inset-x-4 bottom-4 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <button
                      onClick={(e) => openEditModal(cat, e)}
                      className="flex-1 flex items-center justify-center gap-2 bg-white text-black font-bold text-xs uppercase py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Edit size={14} />
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteTarget(cat)
                      }}
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
      </PageBody>

      <AdminModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        eyebrow="Category Editor"
        title={isEditing ? "Edit Category" : "New Category"}
        subtitle="Adjust collection identity, image, and visibility in one clean panel."
        maxWidthClass="max-w-xl"
        footer={
          <>
            <Button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="inline-flex flex-1 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-white transition-colors hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="category-form"
              className="inline-flex flex-1 items-center justify-center rounded-xl bg-white px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-black transition-colors hover:bg-lime-300"
            >
              <Save size={18} className="mr-2" />
              Save Changes
            </Button>
          </>
        }
      >
        <form id="category-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className={labelClass}>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={fieldClass}
                  placeholder="e.g. Streetwear"
                />
              </div>

              <div className="space-y-2">
                <label className={`${labelClass} flex items-center gap-2`}>
                  <ImageIcon size={12} /> Image URL
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className={fieldClass}
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className={labelClass}>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className={`${fieldClass} appearance-none`}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Products Count</label>
                  <input
                    type="number"
                    value={formData.products}
                    onChange={(e) => setFormData({ ...formData, products: parseInt(e.target.value) || 0 })}
                    className={fieldClass}
                  />
                </div>
              </div>

              {/* In Stock Toggle */}
              <div className="flex items-center justify-between p-4 bg-black border border-gray-800 rounded-lg">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">In Stock</label>
                  <p className="text-sm text-gray-500">
                    {formData.inStock ? "Products are available" : "Products are out of stock"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, inStock: !formData.inStock })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${formData.inStock ? 'bg-green-500' : 'bg-red-500'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.inStock ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              </div>
        </form>
      </AdminModal>

      <AdminConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            handleDelete(getCategoryId(deleteTarget))
          }
        }}
        title="Delete Category"
        message={`This will remove ${deleteTarget?.name || "this category"} from the admin catalog view. This action cannot be undone.`}
        confirmLabel="Delete"
      />

    </div>
  )
}

export default Categories
