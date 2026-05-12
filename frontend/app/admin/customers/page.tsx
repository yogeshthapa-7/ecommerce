"use client"
import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, UserCheck, UserX, Plus, TrendingUp, Award } from "lucide-react"
import axios from "axios"
import { AdminConfirmDialog, AdminModal, PageBody, PageHeader, adminPanel, adminTable, adminHeaderCell, adminCell, fieldClass, iconButton, labelClass, primaryButton, StatusBadge } from "@/components/admin/AdminSurface"

const CustomersPage = () => {
  const [customers, setCustomers] = useState<any[]>([])

  // State for Modal handling
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | number | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | number | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "Active"
  })

  // 2. Fetch Data
  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/customers`)
      setCustomers(res.data.customers || [])
    } catch (err) {
      console.error("Error fetching customers:", err)
      setCustomers([])
    }
  }

  // 3. HANDLERS

  // Delete Customer
  const handleDelete = async (id: string | number) => {
    const token = localStorage.getItem("token")
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/customers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCustomers(prev => prev.filter(c => (c._id || c.id) !== id))
    } catch (err) {
      console.error("Error deleting customer:", err)
    } finally {
      setDeleteTargetId(null)
    }
  }

  // Toggle Ban/Active Status
  const handleStatusToggle = async (id: string | number, currentStatus: string) => {
    const token = localStorage.getItem("token")
    try {
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${id}/status`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCustomers(prev => prev.map(c => (c._id || c.id) === id ? res.data : c))
    } catch (err) {
      console.error("Error toggling customer status:", err)
    }
  }

  // Open Modal for Adding
  const handleOpenAdd = () => {
    setEditingId(null)
    setFormData({ name: "", email: "", phone: "", status: "Active" })
    setIsModalOpen(true)
  }

  // Open Modal for Editing
  const handleOpenEdit = (customer: any) => {
    setEditingId(customer._id || customer.id)
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      status: customer.status
    })
    setIsModalOpen(true)
  }

  // Save (Add or Edit)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    const token = localStorage.getItem("token")
    const config = { headers: { Authorization: `Bearer ${token}` } }

    try {
      if (editingId) {
        const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/customers/${editingId}`, formData, config)
        setCustomers(prev => prev.map(c => (c._id || c.id) === editingId ? res.data : c))
      } else {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/customers`, formData, config)
        setCustomers(prev => [res.data, ...prev])
      }
      setIsModalOpen(false)
    } catch (err) {
      console.error("Error saving customer:", err)
    }
  }

  const topCustomers = (Array.isArray(customers) ? customers : [])
    .filter(c => c.status === "Active")
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-[#080808]">
      <PageHeader
        title="Customers"
        label="Customer Management"
        description={`${Array.isArray(customers) ? customers.length : 0} total members across active, inactive, and banned segments.`}
        action={
          <button onClick={handleOpenAdd} className={primaryButton}>
            <Plus size={18} />
            Add Customer
          </button>
        }
      />

      {/* MAIN CONTENT */}
      <PageBody>
        <div className="space-y-6">
          {/* CUSTOMER INSIGHTS */}
<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
  {/* Top Customers Card */}
  <div className="relative overflow-hidden rounded-2xl border border-lime-300/20 bg-lime-300/10 p-6 text-white">
    <div className="relative z-10">
      <div className="flex items-center gap-2 mb-4">
        <Award size={24} className="text-white" />
        <h2 className="text-xl font-black uppercase tracking-tight">
          Top Performers
        </h2>
      </div>

      <div className="space-y-3">
        {topCustomers.length > 0 ? topCustomers.map((customer, idx) => (
          <div
            key={customer._id || customer.id}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/25 p-3"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-black font-black text-sm">
              {idx + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate">{customer.name}</p>
              <p className="text-xs text-white/70">{customer.orders} orders</p>
            </div>
            <div className="text-right">
              <p className="font-black text-lg">${(customer.totalSpent ?? 0).toLocaleString()}</p>
            </div>
          </div>
        )) : (
          <p className="text-white/70 text-sm">No active customers yet.</p>
        )}
      </div>
    </div>
  </div>

  {/* Stats Card */}
  <div className={`${adminPanel} p-6`}>
    <h3 className="text-lg font-black text-white uppercase tracking-tight mb-4">
      Quick Stats
    </h3>

    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-gray-400 text-sm font-medium">Active</span>
        <div className="flex items-center gap-2">
          <span className="text-white font-black text-lg">
            {(Array.isArray(customers) ? customers : []).filter(c => c.status === "Active").length}
          </span>
          <TrendingUp size={16} className="text-green-400" />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-gray-400 text-sm font-medium">Inactive</span>
        <span className="text-white font-black text-lg">
          {(Array.isArray(customers) ? customers : []).filter(c => c.status === "Inactive").length}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-gray-400 text-sm font-medium">Banned</span>
        <span className="text-white font-black text-lg">
          {(Array.isArray(customers) ? customers : []).filter(c => c.status === "Banned").length}
        </span>
      </div>
    </div>
  </div>

  {/* CTA Card */}
  <div className="relative hidden min-h-[220px] overflow-hidden rounded-2xl border border-white/10 md:block">
    <img
      src="https://wallpapers-clan.com/wp-content/uploads/2025/11/nike-logo-neon-gradient-sneaker-wallpaper-preview.jpg"
      alt="Nike Background"
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

    <div className="relative z-10 p-6 h-full flex flex-col justify-end">
      <h3 className="text-3xl font-black text-white leading-tight tracking-tighter mb-2">
        JUST<br />DO IT.
      </h3>
      <p className="text-gray-300 text-sm font-medium">
        Build lasting relationships with your customers.
      </p>
    </div>
  </div>
</div>

          {/* CUSTOMERS TABLE */}
          <div>
            <div className={`${adminPanel} overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className={adminTable}>
                  <thead>
                    <tr>
                      <th className={adminHeaderCell}>
                        Name
                      </th>
                      <th className={`${adminHeaderCell} hidden md:table-cell`}>
                        Email
                      </th>
                      <th className={`${adminHeaderCell} hidden xl:table-cell`}>
                        Phone
                      </th>
                      <th className={adminHeaderCell}>
                        Orders
                      </th>
                      <th className={adminHeaderCell}>
                        Spent
                      </th>
                      <th className={adminHeaderCell}>
                        Status
                      </th>
                      <th className={adminHeaderCell}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(!Array.isArray(customers) || customers.length === 0) ? (
                      <tr key="empty-customers">
                        <td colSpan={7} className="px-4 py-8 text-center text-white/35">
                          No customers found. Add one to get started.
                        </td>
                      </tr>
                    ) : (Array.isArray(customers) ? customers.map((customer, idx) => (
                      <tr
                        key={customer._id || customer.id || idx}
                        className="group transition-colors hover:bg-white/[0.04]"
                      >
                        <td className={`${adminCell} max-w-[150px] sm:max-w-[200px]`}>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 shrink-0 rounded-xl bg-white flex items-center justify-center text-black font-black text-sm">
                              {customer.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                            </div>
                            <span className="text-white font-bold text-sm truncate" title={customer.name}>
                              {customer.name}
                            </span>
                          </div>
                        </td>
                        <td className={`${adminCell} hidden md:table-cell max-w-[150px] lg:max-w-[200px]`}>
                          <span className="text-gray-400 text-sm truncate block" title={customer.email}>
                            {customer.email}
                          </span>
                        </td>
                        <td className={`${adminCell} hidden xl:table-cell`}>
                          <span className="text-gray-400 text-sm">
                            {customer.phone}
                          </span>
                        </td>
                        <td className={adminCell}>
                          <span className="text-white font-bold text-sm">
                            {customer.orders}
                          </span>
                        </td>
                        <td className={adminCell}>
                          <span className="text-white font-bold text-sm">
                            ${(customer.totalSpent ?? 0).toLocaleString()}
                          </span>
                        </td>
                        <td className={adminCell}>
                          <StatusBadge status={customer.status} />
                        </td>
                        <td className={adminCell}>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleOpenEdit(customer)}
                              className={iconButton}
                            >
                              <Edit size={14} />
                            </button>

                            <button
                              onClick={() => handleStatusToggle(customer._id || customer.id, customer.status)}
                              className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${customer.status === "Banned"
                                ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400 hover:text-black"
                                : "border-red-400/30 bg-red-400/10 text-red-300 hover:bg-red-500 hover:text-white"
                                }`}
                              title={customer.status === "Banned" ? "Unban User" : "Ban User"}
                            >
                              {customer.status === "Banned" ? <UserCheck size={14} /> : <UserX size={14} />}
                            </button>

                            <button
                              onClick={() => setDeleteTargetId(customer._id || customer.id)}
                              className={iconButton}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : null)}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </PageBody>

      <AdminModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        eyebrow="Customer Editor"
        title={editingId ? "Edit Customer" : "Add Customer"}
        subtitle="Create or update customer details without leaving the dashboard."
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
              form="customer-form"
              className="inline-flex flex-1 items-center justify-center rounded-xl bg-white px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-black transition-colors hover:bg-lime-300"
            >
              {editingId ? "Update" : "Create"}
            </Button>
          </>
        }
      >
        <form id="customer-form" onSubmit={handleSave} className="space-y-4">
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className={fieldClass}
                  placeholder="e.g. Michael Jordan"
                />
              </div>

              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className={fieldClass}
                  placeholder="e.g. mj@bulls.com"
                />
              </div>

              <div>
                <label className={labelClass}>Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className={fieldClass}
                  placeholder="e.g. +1 234 567 890"
                />
              </div>

              <div>
                <label className={labelClass}>Status</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  className={`${fieldClass} appearance-none`}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Banned">Banned</option>
                </select>
              </div>
        </form>
      </AdminModal>

      <AdminConfirmDialog
        open={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId !== null) {
            handleDelete(deleteTargetId)
          }
        }}
        title="Delete Customer"
        message="This customer record will be removed from the admin dashboard. This action cannot be undone."
        confirmLabel="Delete"
      />
    </div>
  )
}

export default CustomersPage
