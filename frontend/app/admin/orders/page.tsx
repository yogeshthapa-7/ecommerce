"use client"
import React, { useEffect, useState } from "react"
import { Edit, Trash2, Package, DollarSign, XCircle, TrendingUp, Plus } from "lucide-react"
import axios from "axios"
import Pagination from "@/components/ui/pagination"
import { AdminConfirmDialog, AdminModal, PageBody, PageHeader, MetricCard, adminPanel, adminTable, adminHeaderCell, adminCell, fieldClass, iconButton, labelClass, primaryButton } from "@/components/admin/AdminSurface"


/* ================= ORDERS PAGE ================= */
const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null)
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
    const token = localStorage.getItem("token")
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setOrders(prev => prev.filter(o => (o._id || o.id) !== id))
    } catch (err) {
      console.error("Error deleting order:", err)
    } finally {
      setDeleteTarget(null)
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
    <div className="min-h-screen bg-[#080808]">
      <PageHeader
        title="Orders"
        label="Order Management"
        description="Track customer orders, payment state, delivery movement, and cancellations in one fast table."
        action={
          <button onClick={handleOpenAdd} className={primaryButton}>
            <Plus size={18} />
            New Order
          </button>
        }
      />

      {/* SUMMARY CARDS */}
      <PageBody>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            icon={<DollarSign size={22} />}
            label="Payment Received"
            value={`$${(totalReceived ?? 0).toLocaleString()}`}
            note={<TrendingUp size={14} />}
          />
          <MetricCard
            icon={<Package size={22} />}
            label="Payment Pending"
            value={`$${(totalPending ?? 0).toLocaleString()}`}
          />
          <MetricCard
            icon={<XCircle size={22} />}
            label="Cancelled Orders"
            value={cancelledOrders.length}
          />
          <MetricCard
            icon={<DollarSign size={22} />}
            label="Cancelled Amount"
            value={`$${(cancelledAmount ?? 0).toLocaleString()}`}
          />
        </div>

        {/* TABLE + SIDEBAR */}
        <div className="relative">
          {/* TABLE */}
          <div className="relative z-10">
            <div className={`${adminPanel} overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className={adminTable}>
                  <thead>
                    <tr>
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
                        <td colSpan={7} className="px-4 py-8 text-center text-white/35">
                          No orders found. Create one to get started.
                        </td>
                      </tr>
                    ) : orders.map((order, index) => (
                      <tr
                        key={order._id || order.id || index}
                        className="transition-colors hover:bg-white/[0.04]"
                      >
                        <td className={`${adminCell} max-w-[120px] truncate text-sm font-bold text-white`} title={order.orderId || order._id || order.id}>
                          {order.orderId || order._id || order.id}
                        </td>
                        <td className={`${adminCell} max-w-[150px]`}>
                          <div>
                            <p className="text-gray-300 text-sm font-medium truncate" title={order.customer || 'N/A'}>{order.customer || 'N/A'}</p>
                            <p className="text-gray-500 text-xs truncate" title={order.customerEmail || 'No email'}>{order.customerEmail || 'No email'}</p>
                          </div>
                        </td>
                        <td className={adminCell}>
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
                        <td className={`${adminCell} text-sm font-bold text-white`}>${(order?.total ?? 0).toLocaleString()}</td>
                        <td className={adminCell}>
                          <StatusBadge status={order.paymentStatus} />
                        </td>
                        <td className={`${adminCell} hidden xl:table-cell`}>
                          <StatusBadge status={order.deliveryStatus} />
                        </td>
                        <td className={`${adminCell} sticky right-0 z-10 bg-[#111111] shadow-[-12px_0_20px_rgba(0,0,0,0.28)]`}>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleOpenEdit(order)}
                              className={iconButton}
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(order)}
                              className={iconButton}
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
      </PageBody>

      <AdminModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        eyebrow="Order Editor"
        title={editingId ? "Edit Order" : "New Order"}
        subtitle="Manage order totals, payment state, and delivery movement in one focused panel."
        maxWidthClass="max-w-xl"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="inline-flex flex-1 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-white transition-colors hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="order-form"
              className="inline-flex flex-1 items-center justify-center rounded-xl bg-white px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-black transition-colors hover:bg-lime-300"
            >
              {editingId ? "Update" : "Create"}
            </button>
          </>
        }
      >
        <form id="order-form" onSubmit={handleSave} className="space-y-4">
              <div>
                <label className={labelClass}>Customer Name</label>
                <input
                  type="text"
                  required
                  value={formData.customer}
                  onChange={e => setFormData({ ...formData, customer: e.target.value })}
                  className={fieldClass}
                  placeholder="e.g. Travis Scott"
                />
              </div>

              <div>
                <label className={labelClass}>Total Amount ($)</label>
                <input
                  type="number"
                  required
                  value={formData.total}
                  onChange={e => setFormData({ ...formData, total: e.target.value })}
                  className={fieldClass}
                  placeholder="0.00"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Payment</label>
                  <select
                    value={formData.paymentStatus}
                    onChange={e => setFormData({ ...formData, paymentStatus: e.target.value })}
                    className={`${fieldClass} appearance-none`}
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Delivery</label>
                  <select
                    value={formData.deliveryStatus}
                    onChange={e => setFormData({ ...formData, deliveryStatus: e.target.value })}
                    className={`${fieldClass} appearance-none`}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
        </form>
      </AdminModal>

      <AdminConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            handleDelete(deleteTarget)
          }
        }}
        title="Delete Order"
        message={`This will permanently remove ${deleteTarget?.orderId || deleteTarget?._id || "this order"} from the order log. This action cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  )
}

/* ================= COMPONENTS ================= */

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
    className={`${adminHeaderCell} ${hidden ? `hidden ${hidden}:table-cell` : ""} ${className}`}
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
