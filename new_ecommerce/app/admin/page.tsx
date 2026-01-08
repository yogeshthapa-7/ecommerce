"use client"
import React from "react"
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  ArrowRight,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

const AdminDashboardPage = () => {
  // Add keyframe animations
  const styles = `
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
  `

  const stats = [
    {
      title: "Total Revenue",
      value: "$48,920",
      icon: DollarSign,
      change: "+12.5%",
      bg: "from-orange-500 to-red-600",
    },
    {
      title: "Total Orders",
      value: "1,284",
      icon: ShoppingCart,
      change: "+8.2%",
      bg: "from-blue-500 to-cyan-500",
    },
    {
      title: "Customers",
      value: "892",
      icon: Users,
      change: "+5.1%",
      bg: "from-purple-500 to-pink-600",
    },
    {
      title: "Products",
      value: "86",
      icon: Package,
      change: "+2 new",
      bg: "from-green-500 to-emerald-600",
    },
  ]

  const recentOrders = [
    { id: "ORD-1042", customer: "John Doe", total: 450, status: "Paid" },
    { id: "ORD-1041", customer: "Jane Smith", total: 120, status: "Pending" },
    { id: "ORD-1040", customer: "Mike Johnson", total: 980, status: "Paid" },
    { id: "ORD-1039", customer: "Alice Brown", total: 0, status: "Cancelled" },
  ]

  return (
    <div className="min-h-screen bg-black">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      {/* HERO SECTION */}
      <div className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative z-10 px-6 pt-12 pb-8">
          {/* Nike-style header */}
          <div className="flex items-end gap-6 mb-8">
            <div className="flex-1">
              <div className="inline-block mb-3 px-4 py-1 bg-white text-black text-xs font-black tracking-widest uppercase rounded-full">
                Admin Portal
              </div>
              <h1 className="text-7xl font-black text-white leading-none tracking-tighter mb-3">
                DASHBOARD
              </h1>
              <p className="text-xl text-gray-400 font-medium">
                Performance Overview
              </p>
            </div>
            
            {/* Nike Swoosh styled element */}
            <div className="hidden lg:block">
              <svg width="120" height="60" viewBox="0 0 120 60" className="text-white opacity-20">
                <path d="M0 50 Q 40 10, 120 30 L 120 50 Q 40 30, 0 60 Z" fill="currentColor"/>
              </svg>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <Card
                key={stat.title}
                className="group relative overflow-hidden border-0 bg-gradient-to-br from-gray-900 to-black hover:scale-105 transition-all duration-300 cursor-pointer"
                style={{
                  animation: `slideUp 0.6s ease-out ${idx * 0.1}s backwards`,
                }}
              >
                {/* Gradient accent */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bg} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <CardContent className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.bg} shadow-lg`}>
                      <stat.icon size={24} className="text-white" />
                    </div>
                    <div className="flex items-center gap-1 text-green-400 text-sm font-bold">
                      <TrendingUp size={14} />
                      {stat.change}
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">
                    {stat.title}
                  </p>
                  <h2 className="text-4xl font-black text-white tracking-tight">
                    {stat.value}
                  </h2>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* RECENT ORDERS SECTION */}
      <div className="px-6 py-8">
        <div className="max-w-full">
          {/* Section header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight mb-1">
                RECENT ORDERS
              </h2>
              <p className="text-gray-400 text-sm font-medium">
                Latest customer purchases
              </p>
            </div>
            <button className="group flex items-center gap-2 px-6 py-3 bg-white text-black font-bold text-sm uppercase tracking-wider rounded-full hover:bg-gray-200 transition-colors">
              View All
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Orders table */}
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border border-gray-800">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, idx) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors group"
                      style={{
                        animation: `fadeIn 0.4s ease-out ${idx * 0.1}s backwards`,
                      }}
                    >
                      <td className="px-6 py-4">
                        <span className="text-white font-bold text-sm">
                          {order.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-300 font-medium text-sm">
                          {order.customer}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white font-bold text-sm">
                          ${order.total}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                            order.status === "Paid"
                              ? "bg-green-500/20 text-green-400 border border-green-500/50"
                              : order.status === "Pending"
                              ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50"
                              : "bg-red-500/20 text-red-400 border border-red-500/50"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-gray-400 hover:text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2 group-hover:gap-3 transition-all">
                          View
                          <ArrowRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default AdminDashboardPage