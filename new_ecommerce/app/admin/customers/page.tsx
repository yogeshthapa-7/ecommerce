"use client"
import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, UserCheck, UserX, Plus, TrendingUp, Award, X } from "lucide-react"
import axios from "axios"

// 1. MOCK DATA (To make the app usable immediately)
const MOCK_DATA = [
  { id: 1, name: "Michael Jordan", email: "air@jordan.com", phone: "+1 234 567 890", orders: 23, totalSpent: 4500, status: "Active" },
  { id: 2, name: "Serena Williams", email: "serena@tennis.com", phone: "+1 987 654 321", orders: 15, totalSpent: 3200, status: "Active" },
  { id: 3, name: "LeBron James", email: "king@lakers.com", phone: "+1 555 666 777", orders: 10, totalSpent: 2800, status: "Inactive" },
  { id: 4, name: "Travis Scott", email: "cactus@jack.com", phone: "+1 444 333 222", orders: 5, totalSpent: 1500, status: "Banned" },
]

const CustomersPage = () => {
  const [customers, setCustomers] = useState([])
  
  // State for Modal handling
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "Active"
  })

  // 2. Fetch Data (Simulated or Real)
  useEffect(() => {
    // In a real app, keep your axios call. 
    // For this demo, we simulate a fetch if the list is empty.
    if (customers.length === 0) {
      setCustomers(MOCK_DATA) 
    }
    
    // Original API call preserved (optional):
  axios.get("/api/customers").then(res => setCustomers(res.data)).catch(err => console.log("Using mock data"))
  }, [])

  // 3. HANDLERS

  // Delete Customer
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      setCustomers(prev => prev.filter(c => c.id !== id))
      // axios.delete(`/api/customers/${id}`)
    }
  }

  // Toggle Ban/Active Status
  const handleStatusToggle = (id, currentStatus) => {
    const newStatus = currentStatus === "Banned" ? "Active" : "Banned"
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c))
    // axios.patch(`/api/customers/${id}`, { status: newStatus })
  }

  // Open Modal for Adding
  const handleOpenAdd = () => {
    setEditingId(null)
    setFormData({ name: "", email: "", phone: "", status: "Active" })
    setIsModalOpen(true)
  }

  // Open Modal for Editing
  const handleOpenEdit = (customer) => {
    setEditingId(customer.id)
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      status: customer.status
    })
    setIsModalOpen(true)
  }

  // Save (Add or Edit)
  const handleSave = (e) => {
    e.preventDefault()
    
    if (editingId) {
      // Edit logic
      setCustomers(prev => prev.map(c => c.id === editingId ? { ...c, ...formData } : c))
    } else {
      // Add logic
      const newCustomer = {
        id: Date.now(), // Generate random ID
        ...formData,
        orders: 0,
        totalSpent: 0
      }
      setCustomers(prev => [newCustomer, ...prev])
    }
    
    setIsModalOpen(false)
  }

  const topCustomers = customers
    .filter(c => c.status === "Active")
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-black">
      {/* HEADER SECTION */}
      <div className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black px-6 pt-12 pb-8">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative z-10">
          <div className="inline-block mb-3 px-4 py-1 bg-white text-black text-xs font-black tracking-widest uppercase rounded-full">
            Customer Management
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1 className="text-6xl md:text-7xl font-black text-white leading-none tracking-tighter mb-3">
                CUSTOMERS
              </h1>
              <p className="text-xl text-gray-400 font-medium">
                {customers.length} Total Members
              </p>
            </div>

            <Button 
              onClick={handleOpenAdd}
              className="group bg-white text-black hover:bg-gray-200 font-black text-sm uppercase tracking-wider px-8 py-6 rounded-full transition-all hover:scale-105"
            >
              <Plus size={20} className="mr-2" />
              Add Customer
            </Button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CUSTOMERS TABLE */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border border-gray-800">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="px-4 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider hidden md:table-cell">
                        Email
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider hidden xl:table-cell">
                        Phone
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">
                        Orders
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">
                        Spent
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
                    {customers.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                          No customers found. Add one to get started.
                        </td>
                      </tr>
                    ) : customers.map((customer, idx) => (
                      <tr
                        key={customer.id}
                        className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors group"
                        style={{
                          animation: `fadeIn 0.4s ease-out ${idx * 0.05}s backwards`,
                        }}
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-black text-sm">
                              {customer.name.split(' ').map(n => n[0]).join('').substring(0,2)}
                            </div>
                            <span className="text-white font-bold text-sm">
                              {customer.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 hidden md:table-cell">
                          <span className="text-gray-400 text-sm">
                            {customer.email}
                          </span>
                        </td>
                        <td className="px-4 py-4 hidden xl:table-cell">
                          <span className="text-gray-400 text-sm">
                            {customer.phone}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-white font-bold text-sm">
                            {customer.orders}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-white font-bold text-sm">
                            ${customer.totalSpent.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                              customer.status === "Active"
                                ? "bg-green-500/20 text-green-400 border border-green-500/50"
                                : customer.status === "Inactive"
                                ? "bg-gray-500/20 text-gray-400 border border-gray-500/50"
                                : "bg-red-500/20 text-red-400 border border-red-500/50"
                            }`}
                          >
                            {customer.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleOpenEdit(customer)}
                              className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                            >
                              <Edit size={14} />
                            </button>
                            
                            <button 
                              onClick={() => handleStatusToggle(customer.id, customer.status)}
                              className={`p-2 rounded-lg transition-colors text-white ${
                                customer.status === "Banned" 
                                  ? "bg-green-600 hover:bg-green-700" 
                                  : "bg-red-600 hover:bg-red-700"
                              }`}
                              title={customer.status === "Banned" ? "Unban User" : "Ban User"}
                            >
                              {customer.status === "Banned" ? <UserCheck size={14} /> : <UserX size={14} />}
                            </button>

                            <button 
                              onClick={() => handleDelete(customer.id)}
                              className="p-2 bg-gray-800 hover:bg-red-600 text-white rounded-lg transition-colors"
                            >
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

          {/* SIDEBAR - TOP CUSTOMERS */}
          <div className="space-y-6">
            {/* Top Customers Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 rounded-2xl p-6 text-white">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Award size={24} className="text-white" />
                  <h2 className="text-xl font-black uppercase tracking-tight">
                    Top Performers
                  </h2>
                </div>
                
                <div className="space-y-4">
                  {topCustomers.length > 0 ? topCustomers.map((customer, idx) => (
                    <div
                      key={customer.id}
                      className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20"
                      style={{
                        animation: `slideRight 0.5s ease-out ${idx * 0.1}s backwards`,
                      }}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-orange-600 font-black text-sm">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm">{customer.name}</p>
                        <p className="text-xs text-white/70">{customer.orders} orders</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-lg">${customer.totalSpent.toLocaleString()}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-white/70 text-sm">No active customers yet.</p>
                  )}
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            </div>

            {/* Stats Card */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-gray-800">
              <h3 className="text-lg font-black text-white uppercase tracking-tight mb-4">
                Quick Stats
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm font-medium">Active</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-black text-lg">
                      {customers.filter(c => c.status === "Active").length}
                    </span>
                    <TrendingUp size={16} className="text-green-400" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm font-medium">Inactive</span>
                  <span className="text-white font-black text-lg">
                    {customers.filter(c => c.status === "Inactive").length}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm font-medium">Banned</span>
                  <span className="text-white font-black text-lg">
                    {customers.filter(c => c.status === "Banned").length}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Card */}
            <div className="relative overflow-hidden rounded-2xl hidden md:block">
              <img
                src="https://wallpapers-clan.com/wp-content/uploads/2025/11/nike-logo-neon-gradient-sneaker-wallpaper-preview.jpg"
                alt="Nike Background"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
              
              <div className="relative z-10 p-6 min-h-[200px] flex flex-col justify-end">
                <h3 className="text-3xl font-black text-white leading-tight tracking-tighter mb-2">
                  JUST<br />DO IT.
                </h3>
                <p className="text-gray-300 text-sm font-medium">
                  Build lasting relationships with your customers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MODAL COMPONENT (Built-in for functionality without external deps) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">
              {editingId ? "Edit Customer" : "Add Customer"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                  placeholder="e.g. Michael Jordan"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                  placeholder="e.g. mj@bulls.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Phone</label>
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                  placeholder="e.g. +1 234 567 890"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Status</label>
                <select 
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors appearance-none"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Banned">Banned</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <Button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-800 text-white hover:bg-gray-700 font-bold py-6 rounded-xl"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-white text-black hover:bg-gray-200 font-black uppercase tracking-wider py-6 rounded-xl"
                >
                  {editingId ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      ` }} />
    </div>
  )
}

export default CustomersPage