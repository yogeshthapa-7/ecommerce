"use client"
import React from "react"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Package, DollarSign, XCircle, TrendingUp } from "lucide-react"

const OrdersPage = () => {
  const orders = [
    { id: "ORD001", customer: "John Doe", date: "2026-01-05", total: 450, paymentStatus: "Paid", deliveryStatus: "Processing" },
    { id: "ORD002", customer: "Jane Smith", date: "2026-01-04", total: 120, paymentStatus: "Pending", deliveryStatus: "Processing" },
    { id: "ORD003", customer: "Mike Johnson", date: "2026-01-03", total: 980, paymentStatus: "Paid", deliveryStatus: "Shipped" },
    { id: "ORD004", customer: "Alice Brown", date: "2026-01-02", total: 0, paymentStatus: "Failed", deliveryStatus: "Cancelled" },
    { id: "ORD005", customer: "Chris Wilson", date: "2026-01-01", total: 230, paymentStatus: "Paid", deliveryStatus: "Delivered" },
    { id: "ORD006", customer: "Aloj Khadka", date: "2026-01-05", total: 230, paymentStatus: "Pending", deliveryStatus: "Processing" },
  ]

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
      {/* HEADER SECTION */}
      <div className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black px-6 pt-12 pb-8">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative z-10">
          <div className="inline-block mb-3 px-4 py-1 bg-white text-black text-xs font-black tracking-widest uppercase rounded-full">
            Order Management
          </div>
          
          <div>
            <h1 className="text-6xl md:text-7xl font-black text-white leading-none tracking-tighter mb-3">
              ORDERS
            </h1>
            <p className="text-xl text-gray-400 font-medium">
              Track and manage all customer orders
            </p>
          </div>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div 
            className="group relative overflow-hidden bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-gray-800 hover:scale-105 transition-all duration-300"
            style={{ animation: 'slideUp 0.6s ease-out 0s backwards' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-emerald-600 opacity-0 group-hover:opacity-10 transition-opacity" />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                  <DollarSign size={24} className="text-white" />
                </div>
                <TrendingUp size={16} className="text-green-400" />
              </div>
              <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">
                Payment Received
              </p>
              <h2 className="text-4xl font-black text-white tracking-tight">
                ${totalReceived}
              </h2>
            </div>
          </div>

          <div 
            className="group relative overflow-hidden bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-gray-800 hover:scale-105 transition-all duration-300"
            style={{ animation: 'slideUp 0.6s ease-out 0.1s backwards' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-600 to-orange-600 opacity-0 group-hover:opacity-10 transition-opacity" />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 shadow-lg">
                  <Package size={24} className="text-white" />
                </div>
              </div>
              <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">
                Payment Pending
              </p>
              <h2 className="text-4xl font-black text-white tracking-tight">
                ${totalPending}
              </h2>
            </div>
          </div>

          <div 
            className="group relative overflow-hidden bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-gray-800 hover:scale-105 transition-all duration-300"
            style={{ animation: 'slideUp 0.6s ease-out 0.2s backwards' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-pink-600 opacity-0 group-hover:opacity-10 transition-opacity" />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 shadow-lg">
                  <XCircle size={24} className="text-white" />
                </div>
              </div>
              <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">
                Cancelled Orders
              </p>
              <h2 className="text-4xl font-black text-white tracking-tight">
                {cancelledOrders.length}
              </h2>
            </div>
          </div>

          <div 
            className="group relative overflow-hidden bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-gray-800 hover:scale-105 transition-all duration-300"
            style={{ animation: 'slideUp 0.6s ease-out 0.3s backwards' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity" />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 shadow-lg">
                  <DollarSign size={24} className="text-white" />
                </div>
              </div>
              <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">
                Cancelled Amount
              </p>
              <h2 className="text-4xl font-black text-white tracking-tight">
                ${cancelledAmount}
              </h2>
            </div>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ORDERS TABLE */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border border-gray-800">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="px-4 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider hidden md:table-cell">
                        Date
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                        Delivery
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, idx) => (
                      <tr
                        key={order.id}
                        className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors group"
                        style={{ animation: `fadeIn 0.4s ease-out ${idx * 0.05}s backwards` }}
                      >
                        <td className="px-4 py-4">
                          <span className="text-white font-bold text-sm">
                            {order.id}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-gray-300 font-medium text-sm">
                            {order.customer}
                          </span>
                        </td>
                        <td className="px-4 py-4 hidden md:table-cell">
                          <span className="text-gray-400 text-sm">
                            {order.date}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-white font-bold text-sm">
                            ${order.total}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                              order.paymentStatus === "Paid"
                                ? "bg-green-500/20 text-green-400 border border-green-500/50"
                                : order.paymentStatus === "Pending"
                                ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50"
                                : "bg-red-500/20 text-red-400 border border-red-500/50"
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-4 hidden lg:table-cell">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                              order.deliveryStatus === "Delivered"
                                ? "bg-green-500/20 text-green-400 border border-green-500/50"
                                : order.deliveryStatus === "Shipped"
                                ? "bg-blue-500/20 text-blue-400 border border-blue-500/50"
                                : order.deliveryStatus === "Processing"
                                ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50"
                                : "bg-red-500/20 text-red-400 border border-red-500/50"
                            }`}
                          >
                            {order.deliveryStatus}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
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

export default OrdersPage