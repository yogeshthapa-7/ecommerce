"use client"
import React, { useEffect, useState } from "react"
import { Edit, Trash2, Package, DollarSign, XCircle, TrendingUp, Plus, X } from "lucide-react"
import axios from "axios"
import Pagination from "@/components/ui/pagination"


/* ================= ORDERS PAGE ================= */
const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1); const [pagination, setPagination] = useState(null);
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
    fetchOrders()
  }, [currentPage])

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders?page=${currentPage}&limit=10`)
      setOrders(res.data.orders)
      setPagination(res.data.pagination)
    } catch (err) {
      console.error("Error fetching orders:", err)
    }
  }

  /* ====== HANDLERS ====== */

  const handleDelete = async (order) => {
    const id = order._id || order.id;
    const orderDisplayId = order.orderId || order.id;
    const token = localStorage.getItem("token")
    if (confirm(`Delete order ${orderDisplayId}? This cannot be undone.`)) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setOrders(prev => prev.filter(o => (o._id || o.id) !== id))
      } catch (err) {
        console.error("Error deleting order:", err)
      }
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
    setEditingId(order._id || order.id)
    setFormData({
      customer: order.customer,
      total: order.total.toString(),
      paymentStatus: order.paymentStatus,
      deliveryStatus: order.deliveryStatus,
      date: order.date?.split('T')[0] || new Date().toISOString().split('T')[0]
    })
    setIsModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()

    const orderData = {
      customer: formData.customer,
      total: parseFloat(formData.total) || 0,
      paymentStatus: formData.paymentStatus,
      deliveryStatus: formData.deliveryStatus,
      date: formData.date
    }

    const token = localStorage.getItem("token")
    const config = { headers: { Authorization: `Bearer ${token}` } }

    try {
      if (editingId) {
        const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/orders/${editingId}`, orderData, config)
        setOrders(prev => prev.map(o => (o._id || o.id) === editingId ? res.data : o))
      } else {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/orders`, orderData, config)
        setOrders(prev => [res.data, ...prev])
      }
      setIsModalOpen(false)
    } catch (err) {
      console.error("Error saving order:", err)
    }
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
            value={`$${(totalReceived ?? 0).toLocaleString()}`}
            gradient="from-green-600 to-emerald-600"
            trend={<TrendingUp size={16} className="text-green-400" />}
          />
          <SummaryCard
            icon={<Package size={24} className="text-white" />}
            label="Payment Pending"
            value={`$${(totalPending ?? 0).toLocaleString()}`}
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
            value={`$${(cancelledAmount ?? 0).toLocaleString()}`}
            gradient="from-purple-600 to-blue-600"
          />
        </div>

        {/* TABLE + SIDEBAR */}
        <div className="relative">
          {/* TABLE */}
          <div className="relative z-10">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border border-gray-800">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <TableHeader label="Order ID" />
                      <TableHeader label="Customer" />
                      <TableHeader label="Items" />
                      <TableHeader label="Total" />
                      <TableHeader label="Payment" />
                      <TableHeader label="Delivery" hidden="xl" />
                      <TableHeader
                        label="Actions"
                        className="sticky right-0 z-20 bg-black/95 shadow-[-12px_0_20px_rgba(0,0,0,0.35)]"
                      />
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr key="empty-orders">
                        <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                          No orders found. Create one to get started.
                        </td>
                      </tr>
                    ) : orders.map((order, index) => (
                      <tr
                        key={order._id || order.id || index}
                        className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="px-4 py-4 text-white font-bold text-sm max-w-[120px] truncate" title={order.orderId || order._id || order.id}>
                          {order.orderId || order._id || order.id}
                        </td>
                        <td className="px-4 py-4 max-w-[150px]">
                          <div>
                            <p className="text-gray-300 text-sm font-medium truncate" title={order.customer || 'N/A'}>{order.customer || 'N/A'}</p>
                            <p className="text-gray-500 text-xs truncate" title={order.customerEmail || 'No email'}>{order.customerEmail || 'No email'}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="max-w-xs">
                            {order.items && order.items.length > 0 ? (
                              <div className="text-xs text-gray-400">
                                {order.items.slice(0, 2).map((item, i) => (
                                  <p key={i} className="truncate" title={`${item.quantity}x ${item.name || 'Product'}`}>
                                    {item.quantity}x {item.name || 'Product'}
                                  </p>
                                ))}
                                {order.items.length > 2 && (
                                  <p className="text-gray-500">+{order.items.length - 2} more items</p>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-500 text-xs">No items</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-white font-bold text-sm">${(order?.total ?? 0).toLocaleString()}</td>
                        <td className="px-4 py-4">
                          <StatusBadge status={order.paymentStatus} />
                        </td>
                        <td className="px-4 py-4 hidden xl:table-cell">
                          <StatusBadge status={order.deliveryStatus} />
                        </td>
                        <td className="px-4 py-4 sticky right-0 z-10 bg-black/95 shadow-[-12px_0_20px_rgba(0,0,0,0.35)]">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleOpenEdit(order)}
                              className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(order)}
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
        </div>

        {pagination && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
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
                  onChange={e => setFormData({ ...formData, customer: e.target.value })}
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
                  onChange={e => setFormData({ ...formData, total: e.target.value })}
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                  placeholder="0.00"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Payment</label>
                  <select
                    value={formData.paymentStatus}
                    onChange={e => setFormData({ ...formData, paymentStatus: e.target.value })}
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
                    onChange={e => setFormData({ ...formData, deliveryStatus: e.target.value })}
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

const TableHeader = ({
  label,
  hidden,
  className = "",
}: {
  label: string;
  hidden?: string;
  className?: string;
}) => (
  <th
    className={`px-4 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider ${hidden ? `hidden ${hidden}:table-cell` : ""} ${className}`}
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
