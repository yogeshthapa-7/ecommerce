import React from "react"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, UserCheck, UserX, Plus, TrendingUp, Award } from "lucide-react"

const CustomersPage = () => {
  const customers = [
    { id: "1", name: "John Doe", email: "john@example.com", phone: "+1 555-1234", orders: 5, totalSpent: 450, status: "Active" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", phone: "+1 555-5678", orders: 2, totalSpent: 120, status: "Inactive" },
    { id: "3", name: "Mike Johnson", email: "mike@example.com", phone: "+1 555-9012", orders: 10, totalSpent: 980, status: "Active" },
    { id: "4", name: "Alice Brown", email: "alice@example.com", phone: "+1 555-3456", orders: 0, totalSpent: 0, status: "Banned" },
    { id: "5", name: "Chris Wilson", email: "chris@example.com", phone: "+1 555-7890", orders: 3, totalSpent: 230, status: "Active" },
    { id: "6", name: "Sara Davis", email: "sara@example.com", phone: "+1 555-2468", orders: 1, totalSpent: 75, status: "Inactive" },
    { id: "7", name: "David Lee", email: "david@example.com", phone: "+1 555-1357", orders: 8, totalSpent: 670, status: "Active" },
    { id: "8", name: "Emma Clark", email: "emma@example.com", phone: "+1 555-9753", orders: 0, totalSpent: 0, status: "Banned" },
    { id: "9", name: "Brian Martinez", email: "brian@example.com", phone: "+1 555-8642", orders: 6, totalSpent: 520, status: "Active" },
    { id: "10", name: "Olivia Taylor", email: "olivia@example.com", phone: "+1 555-3698", orders: 4, totalSpent: 310, status: "Active" },
  ]

  const topCustomers = customers
    .filter(c => c.status === "Active")
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 3)

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

            <Button className="group bg-white text-black hover:bg-gray-200 font-black text-sm uppercase tracking-wider px-8 py-6 rounded-full transition-all hover:scale-105">
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
                    {customers.map((customer, idx) => (
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
                              {customer.name.split(' ').map(n => n[0]).join('')}
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
                            ${customer.totalSpent}
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
                            <button className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
                              <Edit size={14} />
                            </button>
                            {customer.status !== "Banned" ? (
                              <button className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                                <UserX size={14} />
                              </button>
                            ) : (
                              <button className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                                <UserCheck size={14} />
                              </button>
                            )}
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
                  {topCustomers.map((customer, idx) => (
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
                        <p className="font-black text-lg">${customer.totalSpent}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative element */}
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
            <div className="relative overflow-hidden rounded-2xl">
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

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      ` }} />
    </div>
  )
}

export default CustomersPage