"use client"
import React, { useEffect, useState } from "react"
import { Edit, Trash2, Package, DollarSign, XCircle, TrendingUp, Plus, X } from "lucide-react"
import axios from "axios"

// 1. MOCK DATA
const MOCK_ORDERS = [
  { id: "#ORD-7829", customer: "Travis Scott", date: "2023-11-15", total: 450.00, paymentStatus: "Paid", deliveryStatus: "Processing" },
  { id: "#ORD-7830", customer: "Drake Graham", date: "2023-11-14", total: 1200.50, paymentStatus: "Pending", deliveryStatus: "Shipped" },
  { id: "#ORD-7831", customer: "Kanye West", date: "2023-11-12", total: 230.00, paymentStatus: "Paid", deliveryStatus: "Delivered" },
  { id: "#ORD-7832", customer: "LeBron James", date: "2023-11-10", total: 850.00, paymentStatus: "Failed", deliveryStatus: "Cancelled" },
]

/* ================= ORDERS PAGE ================= */
const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  
  // Form State
  const [formData, setFormData] = useState({
    customer: "",
    total: "",
    paymentStatus: "Pending",
    deliveryStatus: "Processing",
    date: new Date().toISOString().split('T')[0]
  })

  // Initialize Data
  useEffect(() => {
    if (orders.length === 0) {
      setOrders(MOCK_ORDERS)
    }
    axios.get("/api/orders").then(res => setOrders(res.data))
  }, [])

  /* ====== HANDLERS ====== */
  
  const handleDelete = (id) => {
    if (confirm(`Delete order ${id}? This cannot be undone.`)) {
      setOrders(prev => prev.filter(o => o.id !== id))
    }
  }

  const handleOpenAdd = () => {
    setEditingId(null)
    setFormData({
      customer: "",
      total: "",
      paymentStatus: "Pending",
      deliveryStatus: "Processing",
      date: new Date().toISOString().split('T')[0]
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (order) => {
    setEditingId(order.id)
    setFormData({
      customer: order.customer,
      total: order.total,
      paymentStatus: order.paymentStatus,
      deliveryStatus: order.deliveryStatus,
      date: order.date
    })
    setIsModalOpen(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    
    if (editingId) {
      // Update existing
      setOrders(prev => prev.map(o => o.id === editingId ? { ...o, ...formData, total: parseFloat(formData.total) } : o))
    } else {
      // Create new
      const newOrder = {
        id: `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        ...formData,
        total: parseFloat(formData.total) || 0
      }
      setOrders(prev => [newOrder, ...prev])
    }
    setIsModalOpen(false)
  }

  /* ====== CALCULATIONS ====== */
  const totalReceived = orders
    .filter(o => o.paymentStatus === "Paid")
    .reduce((sum, o) => sum + o.total, 0)

  const totalPending = orders
    .filter(o => o.paymentStatus === "Pending")
    .reduce((sum, o) => sum + o.total, 0)

  const cancelledOrders = orders.filter(o => o.deliveryStatus === "Cancelled")
  const cancelledAmount = cancelledOrders.reduce((sum, o) => sum + o.total, 0)

  return (
    <div className="min-h-screen bg-black">
      {/* HEADER */}
      <div className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black px-6 pt-12 pb-8">
        <div className="relative z-10">
          <div className="inline-block mb-3 px-4 py-1 bg-white text-black text-xs font-black tracking-widest uppercase rounded-full">
            Order Management
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1 className="text-6xl md:text-7xl font-black text-white leading-none tracking-tighter mb-3">
                ORDERS
              </h1>
              <p className="text-xl text-gray-400 font-medium">
                Track and manage all customer orders
              </p>
            </div>

            <button 
              onClick={handleOpenAdd}
              className="group bg-white text-black hover:bg-gray-200 font-black text-sm uppercase tracking-wider px-8 py-6 rounded-full transition-all hover:scale-105 flex items-center"
            >
              <Plus size={20} className="mr-2" />
              New Order
            </button>
          </div>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <SummaryCard
            icon={<DollarSign size={24} className="text-white" />}
            label="Payment Received"
            value={`$${totalReceived.toLocaleString()}`}
            gradient="from-green-600 to-emerald-600"
            trend={<TrendingUp size={16} className="text-green-400" />}
          />
          <SummaryCard
            icon={<Package size={24} className="text-white" />}
            label="Payment Pending"
            value={`$${totalPending.toLocaleString()}`}
            gradient="from-yellow-600 to-orange-600"
          />
          <SummaryCard
            icon={<XCircle size={24} className="text-white" />}
            label="Cancelled Orders"
            value={cancelledOrders.length}
            gradient="from-red-600 to-pink-600"
          />
          <SummaryCard
            icon={<DollarSign size={24} className="text-white" />}
            label="Cancelled Amount"
            value={`$${cancelledAmount.toLocaleString()}`}
            gradient="from-purple-600 to-blue-600"
          />
        </div>

        {/* TABLE + SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* TABLE */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border border-gray-800">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <TableHeader label="Order ID" />
                      <TableHeader label="Customer" />
                      <TableHeader label="Date" />
                      <TableHeader label="Total" />
                      <TableHeader label="Payment" />
                      <TableHeader label="Delivery" hidden="lg" />
                      <TableHeader label="Actions" />
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                          No orders found. Create one to get started.
                        </td>
                      </tr>
                    ) : orders.map(order => (
                      <tr
                        key={order.id}
                        className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="px-4 py-4 text-white font-bold text-sm">{order.id}</td>
                        <td className="px-4 py-4 text-gray-300 text-sm">{order.customer}</td>
                        <td className="px-4 py-4 text-gray-400 text-sm">{order.date}</td>
                        <td className="px-4 py-4 text-white font-bold text-sm">${order.total.toLocaleString()}</td>
                        <td className="px-4 py-4">
                          <StatusBadge status={order.paymentStatus} />
                        </td>
                        <td className="px-4 py-4 hidden lg:table-cell">
                          <StatusBadge status={order.deliveryStatus} />
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleOpenEdit(order)}
                              className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                            >
                              <Edit size={14} />
                            </button>
                            <button 
                              onClick={() => handleDelete(order.id)}
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

          {/* SIDEBAR */}
          <div className="relative overflow-hidden rounded-2xl hidden lg:block">
            <img
              src="https://wallpapercave.com/wp/wp8592792.jpg"
              alt="Nike Background"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
            <div className="relative z-10 p-6 min-h-[400px] flex flex-col justify-end">
              <h2 className="text-4xl font-black text-white leading-tight tracking-tighter mb-2">
                JUST<br />DO IT.
              </h2>
              <p className="text-gray-300 text-sm font-medium">
                Track all Nike orders and manage fulfillment efficiently.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
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
              {editingId ? "Edit Order" : "New Order"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Customer Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.customer}
                  onChange={e => setFormData({...formData, customer: e.target.value})}
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                  placeholder="e.g. Travis Scott"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Total Amount ($)</label>
                <input 
                  type="number" 
                  required
                  value={formData.total}
                  onChange={e => setFormData({...formData, total: e.target.value})}
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                  placeholder="0.00"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Payment</label>
                  <select 
                    value={formData.paymentStatus}
                    onChange={e => setFormData({...formData, paymentStatus: e.target.value})}
                    className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors appearance-none"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Delivery</label>
                  <select 
                    value={formData.deliveryStatus}
                    onChange={e => setFormData({...formData, deliveryStatus: e.target.value})}
                    className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors appearance-none"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-800 text-white hover:bg-gray-700 font-bold py-4 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-white text-black hover:bg-gray-200 font-black uppercase tracking-wider py-4 rounded-xl transition-colors"
                >
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

/* ================= COMPONENTS ================= */

const SummaryCard = ({ icon, label, value, gradient, trend }) => (
  <div className="group relative overflow-hidden bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-gray-800 hover:scale-105 transition-all duration-300">
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10`} />
    <div className="relative">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
          {icon}
        </div>
        {trend}
      </div>
      <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">
        {label}
      </p>
      <h2 className="text-4xl font-black text-white tracking-tight">{value}</h2>
    </div>
  </div>
)

const TableHeader = ({ label, hidden }) => (
  <th
    className={`px-4 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider ${
      hidden ? `hidden ${hidden}:table-cell` : ""
    }`}
  >
    {label}
  </th>
)

const StatusBadge = ({ status }) => {
  const base =
    "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border"

  const styles = {
    Paid: "bg-green-500/20 text-green-400 border-green-500/50",
    Pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
    Failed: "bg-red-500/20 text-red-400 border-red-500/50",
    Cancelled: "bg-red-500/20 text-red-400 border-red-500/50",
    Delivered: "bg-green-500/20 text-green-400 border-green-500/50",
    Shipped: "bg-blue-500/20 text-blue-400 border-blue-500/50",
    Processing: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
    default: "bg-gray-500/20 text-gray-400 border-gray-500/50"
  }

  return (
    <span className={`${base} ${styles[status] || styles.default}`}>
      {status}
    </span>
  )
}

export default OrdersPage