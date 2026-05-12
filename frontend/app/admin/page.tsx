"use client"
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  ArrowRight,
  RefreshCcw,
  X,
  MapPin,
  CreditCard,
  Calendar,
  Truck,
  ReceiptText
} from "lucide-react"

import axios from "axios"
import { motion } from "motion/react"
import Image from "next/image"
import BarGraph from "@/components/bargraph"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PageBody, PageHeader, MetricCard, adminPanel, adminTable, adminHeaderCell, adminCell, secondaryButton, StatusBadge } from "@/components/admin/AdminSurface"
import {
  DashboardOrder,
  formatCurrency,
  formatPaymentMethod,
  getCustomerEmail,
  getCustomerName,
  getItemImage,
  getItemName,
  getOrderDisplayId,
  getOrderItems,
} from "@/lib/order-helpers"

const AdminDashboardPage = () => {
  // --- STATE ---
  const router = useRouter()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<DashboardOrder | null>(null)

  const [stats, setStats] = useState([
    { title: "Total Revenue", value: 0, prefix: "$", icon: DollarSign, change: "...", bg: "from-orange-500 to-red-600" },
    { title: "Total Orders", value: 0, prefix: "", icon: ShoppingCart, change: "...", bg: "from-blue-500 to-cyan-500" },
    { title: "Customers", value: 0, prefix: "", icon: Users, change: "...", bg: "from-purple-500 to-pink-600" },
    { title: "Products", value: 0, prefix: "", icon: Package, change: "...", bg: "from-green-500 to-emerald-600" },
  ])

  const [recentOrders, setRecentOrders] = useState<DashboardOrder[]>([])

  // --- FETCH DATA ---
  useEffect(() => {
    // Admin access check
    const userStr = localStorage.getItem("user")
    if (!userStr) {
      router.push("/login")
      return
    }

    try {
      const user = JSON.parse(userStr)
      if (user.role !== "admin") {
        router.push("/nike/products")
        return
      }
    } catch {
      router.push("/login")
      return
    }

    fetchDashboardData()
  }, [router])

  const fetchDashboardData = async () => {
    setIsRefreshing(true)
    try {
      const statsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/stats`)
      const ordersRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders?limit=4`)

      const { totalRevenue, totalOrders, totalCustomers, totalProducts } = statsRes.data

      setStats([
        { title: "Total Revenue", value: totalRevenue, prefix: "$", icon: DollarSign, change: "+12.5%", bg: "from-orange-500 to-red-600" },
        { title: "Total Orders", value: totalOrders, prefix: "", icon: ShoppingCart, change: "+8.2%", bg: "from-blue-500 to-cyan-500" },
        { title: "Customers", value: totalCustomers, prefix: "", icon: Users, change: "+5.1%", bg: "from-purple-500 to-pink-600" },
        { title: "Products", value: totalProducts, prefix: "", icon: Package, change: "+2 new", bg: "from-green-500 to-emerald-600" },
      ])

      setRecentOrders(ordersRes.data.orders)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  // --- HANDLERS ---

  // Refresh Data
  const handleRefresh = () => {
    fetchDashboardData()
  }

  // Open Modal
  const handleViewOrder = (order: DashboardOrder) => {
    setSelectedOrder(order)
  }

  // Close Modal
  const closeOrderModal = () => {
    setSelectedOrder(null)
  }

  const handlePrintInvoice = (order: DashboardOrder) => {
    const orderId = order._id || order.id
    if (!orderId || typeof window === "undefined") {
      return
    }

    window.open(`/invoice/${orderId}`, "_blank", "noopener,noreferrer")
  }

  const selectedOrderItems = selectedOrder ? getOrderItems(selectedOrder) : []
  const featuredItem = selectedOrderItems[0]
  const featuredImage = featuredItem ? getItemImage(featuredItem) : ""
  const heroShoes = [
    "/assets/nikehero1.webp",
    "/assets/nikehero2.webp",
    "/assets/nikehero3.webp",
    "/assets/nikehero4.png",
    "/assets/nikehero5.webp",
    "/assets/nikehero6.webp",
  ]
  const heroSliderShoes = [...heroShoes, heroShoes[0]]

  return (
    <div className="min-h-screen bg-[#080808]">
      <PageHeader
        title="Dashboard"
        label="Admin Portal"
        description="Performance overview for revenue, orders, customers, products, and live commerce movement."
        action={
          <button onClick={handleRefresh} className={secondaryButton}>
            <RefreshCcw size={18} className={isRefreshing ? "animate-spin" : ""} />
            {isRefreshing ? "Updating" : "Refresh Data"}
          </button>
        }
      />

      <PageBody>
        <section className="relative mb-7 overflow-hidden rounded-2xl border border-white/10 bg-[#101010] shadow-[0_22px_80px_rgba(0,0,0,0.34)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_20%,rgba(190,242,100,0.16),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_38%)]" />
          <div className="relative grid min-h-[360px] gap-6 p-5 sm:p-7 lg:grid-cols-[0.92fr_1.08fr] lg:p-8">
            <div className="flex flex-col justify-between gap-8 py-2">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-lime-300">Nike Command View</p>
                <h2 className="mt-4 max-w-2xl text-5xl font-black uppercase leading-none tracking-normal text-white sm:text-6xl xl:text-7xl">
                  Own the drop before it moves.
                </h2>
                <p className="mt-5 max-w-xl text-sm font-semibold leading-6 text-white/52 sm:text-base">
                  A focused control surface for stock movement, demand signals, customer growth, and yearly sales condition.
                </p>
              </div>

              <div className="grid max-w-xl grid-cols-3 gap-3">
                <div className="border-l border-white/15 pl-4">
                  <p className="text-2xl font-black text-white">Live</p>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/38">Order pulse</p>
                </div>
                <div className="border-l border-white/15 pl-4">
                  <p className="text-2xl font-black text-white">Auto</p>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/38">Weekly view</p>
                </div>
                <div className="border-l border-white/15 pl-4">
                  <p className="text-2xl font-black text-white">Year</p>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/38">Sales line</p>
                </div>
              </div>
            </div>

            <div className="relative min-h-[300px] overflow-hidden rounded-2xl border border-white/10 bg-black/35">
              <div className="absolute inset-x-0 top-6 z-10 text-center text-[16vw] font-black uppercase leading-none tracking-normal text-white/[0.035] sm:text-[7rem] lg:text-[8.8rem]">
                Nike
              </div>
              <div className="absolute left-6 top-6 z-20 rounded-full border border-white/10 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-black">
                Nike Corousal Control
              </div>
              <div className="absolute inset-0 overflow-hidden">
                <motion.div
                  className="flex h-full w-[500%] will-change-transform"
                  animate={{ x: ["0%", "-20%", "-20%", "-40%", "-40%", "-60%", "-60%", "-80%", "-80%"] }}
                  transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.16, 0.22, 0.38, 0.44, 0.6, 0.66, 0.82, 1],
                  }}
                >
                  {heroSliderShoes.map((src, index) => (
                    <div key={`${src}-${index}`} className="relative flex h-full w-1/5 shrink-0 items-center justify-center">
                      <span className="relative block h-[78%] w-[72%] max-w-[560px] [transform:translateZ(0)] drop-shadow-[0_30px_45px_rgba(0,0,0,0.55)]">
                        <Image
                          src={src}
                          alt="Nike shoe cutout"
                          fill
                          sizes="(min-width: 1024px) 560px, 72vw"
                          className={`object-contain ${index % 2 === 0 ? "-rotate-6" : "rotate-6"}`}
                          priority={index === 0}
                        />
                      </span>
                    </div>
                  ))}
                </motion.div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <MetricCard
              key={stat.title}
              icon={<stat.icon size={22} />}
              label={stat.title}
              value={`${stat.prefix}${(stat.value ?? 0).toLocaleString()}`}
              note={
                <span className="inline-flex items-center gap-1">
                  <TrendingUp size={13} />
                  {stat.change}
                </span>
              }
            />
          ))}
        </div>

      {/* RECENT ORDERS SECTION */}
        <div className="mt-7 max-w-full">
          {/* Section header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="mb-1 text-2xl font-black uppercase tracking-normal text-white">
                RECENT ORDERS
              </h2>
              <p className="text-sm font-medium text-white/45">
                Latest customer purchases
              </p>
            </div>
            <button className="group flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-black transition-colors hover:bg-lime-300">
              View All
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Orders table */}
          <div className={`${adminPanel} overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className={adminTable}>
                <thead>
                  <tr>
                    <th className={adminHeaderCell}>Order ID</th>
                    <th className={adminHeaderCell}>Customer</th>
                    <th className={adminHeaderCell}>Total</th>
                    <th className={adminHeaderCell}>Status</th>
                    <th className={adminHeaderCell}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr key="empty-recent-orders">
                      <td colSpan={5} className="px-6 py-8 text-center text-white/35">
                        No orders found yet.
                      </td>
                    </tr>
                  ) : recentOrders.map((order) => (
                    <tr
                      key={order._id || order.id}
                      className="group cursor-pointer transition-colors hover:bg-white/[0.04]"
                      onClick={() => handleViewOrder(order)}
                    >
                      <td className={adminCell}>
                        <span className="text-white font-bold text-sm">
                          {getOrderDisplayId(order)}
                        </span>
                      </td>
                      <td className={adminCell}>
                        <span className="text-gray-300 font-medium text-sm">
                          {getCustomerName(order)}
                        </span>
                      </td>
                      <td className={adminCell}>
                        <span className="text-white font-bold text-sm">
                          {formatCurrency(order.total)}
                        </span>
                      </td>
                      <td className={adminCell}>
                        <StatusBadge status={order.deliveryStatus || order.paymentStatus || order.status} />
                      </td>
                      <td className={adminCell}>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleViewOrder(order); }}
                          className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-white/50 transition-colors hover:text-white"
                        >
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
        <div className="mt-7">
          <BarGraph />
        </div>
      </PageBody>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-5">
          <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0b] shadow-[0_24px_90px_rgba(0,0,0,0.55)]">

            {/* Close Button */}
            <button
              onClick={closeOrderModal}
              aria-label="Close order details"
              className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/45 text-white/55 transition-colors hover:border-white/25 hover:bg-white hover:text-black"
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div className="grid border-b border-white/10 bg-[#090909] lg:grid-cols-[1fr_280px]">
              <div className="p-5 sm:p-7">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white/80">
                    Order Details
                  </span>
                  <StatusBadge status={selectedOrder.deliveryStatus || selectedOrder.paymentStatus || selectedOrder.status} />
                </div>
                <h2 className="max-w-[720px] text-4xl font-black uppercase leading-none tracking-normal text-white sm:text-5xl">
                  {getOrderDisplayId(selectedOrder)}
                </h2>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-semibold text-white/45">
                  <span className="inline-flex items-center gap-2">
                    <Calendar size={15} />
                    {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString() : (selectedOrder.date || "N/A")}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <ReceiptText size={15} />
                    {selectedOrderItems.length || 1} item{(selectedOrderItems.length || 1) === 1 ? "" : "s"}
                  </span>
                </div>
              </div>

              <div className="hidden border-l border-white/10 bg-white/[0.03] p-5 lg:block">
                <div className="relative h-full min-h-[170px] overflow-hidden rounded-xl border border-white/10 bg-[#151515]">
                  {featuredImage ? (
                    <img
                      src={featuredImage}
                      alt={featuredItem ? getItemName(featuredItem) : "Ordered product"}
                      className="h-full w-full object-contain p-5"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-white/20">
                      <Package size={54} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="min-h-0 flex-1 overflow-y-auto p-5 pb-24 sm:p-7 sm:pb-28">
              <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
                {/* Product Info */}
                <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.18em] text-white/45">
                      Products Bought
                    </h3>
                    <span className="text-xs font-black uppercase tracking-[0.14em] text-lime-300">
                      {formatCurrency(selectedOrder.total)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {selectedOrderItems.length > 0 ? selectedOrderItems.map((item, i) => {
                      const image = getItemImage(item)

                      return (
                        <div key={`${item.productId || getItemName(item)}-${i}`} className="flex gap-4 rounded-xl border border-white/10 bg-black/35 p-3">
                          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#181818] text-white/25 sm:h-24 sm:w-24">
                            {image ? (
                              <img
                                src={image}
                                alt={getItemName(item)}
                                className="h-full w-full object-contain p-2"
                                loading="lazy"
                              />
                            ) : (
                              <Package size={28} />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="truncate text-base font-black text-white">{getItemName(item)}</h4>
                            <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white/45">
                              <span>Qty {item.quantity || 1}</span>
                              {item.size ? <span>Size {item.size}</span> : null}
                              {item.color ? <span>{item.color}</span> : null}
                            </div>
                            <p className="mt-3 text-lg font-black text-white">{formatCurrency(item.price)}</p>
                          </div>
                        </div>
                      )
                    }) : (
                      <div className="flex gap-4 rounded-xl border border-white/10 bg-black/35 p-3">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-[#181818] text-white/25 sm:h-24 sm:w-24">
                          <Package size={30} />
                        </div>
                        <div>
                          <h4 className="text-base font-black text-white">{typeof selectedOrder.items === "string" ? selectedOrder.items : "Product"}</h4>
                          <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white/45">Qty 1</p>
                          <p className="mt-3 text-lg font-black text-white">{formatCurrency(selectedOrder.total)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* Order Info */}
                <div className="space-y-4">
                  <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="mb-3 flex items-center gap-2 text-white/45">
                      <MapPin size={16} />
                      <span className="text-[11px] font-black uppercase tracking-[0.18em]">Shipping</span>
                    </div>
                    <p className="text-base font-black text-white">{getCustomerName(selectedOrder)}</p>
                    <p className="mt-1 text-sm font-semibold text-white/45">{getCustomerEmail(selectedOrder)}</p>
                    {selectedOrder.shippingInfo?.address ? (
                      <p className="mt-4 text-sm font-medium leading-6 text-white/55">
                        {selectedOrder.shippingInfo.address}
                        {selectedOrder.shippingInfo.city ? `, ${selectedOrder.shippingInfo.city}` : ""}
                        {selectedOrder.shippingInfo.state ? `, ${selectedOrder.shippingInfo.state}` : ""}
                        {selectedOrder.shippingInfo.zipCode ? ` ${selectedOrder.shippingInfo.zipCode}` : ""}
                      </p>
                    ) : null}
                  </section>

                  <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="mb-3 flex items-center gap-2 text-white/45">
                        <CreditCard size={16} />
                        <span className="text-[11px] font-black uppercase tracking-[0.18em]">Payment</span>
                      </div>
                      <p className="text-sm font-bold text-white">Method: {formatPaymentMethod(selectedOrder.paymentMethod)}</p>
                      <div className="mt-3">
                        <StatusBadge status={selectedOrder.paymentStatus || selectedOrder.status} />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="mb-3 flex items-center gap-2 text-white/45">
                        <Truck size={16} />
                        <span className="text-[11px] font-black uppercase tracking-[0.18em]">Delivery</span>
                      </div>
                      <p className="text-sm font-bold text-white">{selectedOrder.deliveryStatus || "Processing"}</p>
                      <p className="mt-3 text-2xl font-black text-white">{formatCurrency(selectedOrder.total)}</p>
                    </div>
                  </section>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 z-10 flex flex-col gap-3 border-t border-white/10 bg-[#0b0b0b]/95 p-4 backdrop-blur-md sm:flex-row">
              <button
                onClick={closeOrderModal}
                className="inline-flex flex-1 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-white transition-colors hover:bg-white/10"
              >
                Close
              </button>
              <button
                onClick={() => handlePrintInvoice(selectedOrder)}
                className="inline-flex flex-1 items-center justify-center rounded-xl bg-white px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-black transition-colors hover:bg-lime-300"
              >
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default AdminDashboardPage
