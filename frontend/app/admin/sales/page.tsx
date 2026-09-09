"use client"
import React, { useEffect, useState } from "react"
import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  Download,
  Package,
  Receipt,
  TrendingUp,
  Users,
} from "lucide-react"
import axios from "axios"
import Link from "next/link"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { AdminModal, PageBody, PageHeader, MetricCard, StatusBadge, adminPanel, adminTable, adminHeaderCell, adminCell, fieldClass, secondaryButton } from "@/components/admin/AdminSurface"
import { NikeDatePicker } from "@/components/ui/nike-date-picker"

type Period = "daily" | "weekly" | "monthly" | "yearly"

type ReportRow = {
  label: string
  revenue: number
  orders: number
  paidOrders: number
  pendingOrders: number
  cancelledOrders: number
  avgOrderValue: number
}

type TopProduct = {
  productId: string
  name: string
  image: string
  category: string
  totalQuantity: number
  totalRevenue: number
  price: number
}

type CategoryRow = {
  name: string
  revenue: number
  orderCount: number
  quantity: number
  percentage: number
}

type PaymentMethod = {
  method: string
  count: number
  revenue: number
  percentage: number
}

type StatusRow = {
  status: string
  count: number
  revenue: number
}

type CustomerInsight = {
  name: string
  email: string
  orders: number
  totalSpent: number
}

const SalesPage = () => {
  const [period, setPeriod] = useState<Period>("monthly")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [report, setReport] = useState<ReportRow[]>([])
  const [totals, setTotals] = useState({ totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 })
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [categories, setCategories] = useState<CategoryRow[]>([])
  const [categoryTotal, setCategoryTotal] = useState(0)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [paymentTotal, setPaymentTotal] = useState(0)
  const [deliveryStatus, setDeliveryStatus] = useState<StatusRow[]>([])
  const [paymentStatus, setPaymentStatus] = useState<StatusRow[]>([])
  const [topCustomers, setTopCustomers] = useState<CustomerInsight[]>([])
  const [customerSegments, setCustomerSegments] = useState({ new: 0, returning: 0, total: 0 })
  const [loading, setLoading] = useState(true)

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : ""

  const fetchAll = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ period })
      if (startDate) params.set("startDate", startDate)
      if (endDate) params.set("endDate", endDate)

      const results = await Promise.allSettled([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sales/report?${params.toString()}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sales/top-products?limit=10`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sales/by-category?${params.toString()}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sales/by-payment-method?${params.toString()}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sales/status-breakdown?${params.toString()}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sales/customer-insights?limit=10`, { headers: { Authorization: `Bearer ${token}` } }),
      ])

      const [reportRes, productsRes, categoryRes, paymentRes, statusRes, customersRes] = results.map(r => r.status === 'fulfilled' ? r.value : null)

      if (reportRes?.data) {
        setReport(reportRes.data.report || [])
        setTotals(reportRes.data.totals || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 })
      }
      if (productsRes?.data) {
        setTopProducts(Array.isArray(productsRes.data) ? productsRes.data : [])
      }
      if (categoryRes?.data) {
        setCategories(categoryRes.data.categories || [])
        setCategoryTotal(categoryRes.data.totalRevenue || 0)
      }
      if (paymentRes?.data) {
        setPaymentMethods(paymentRes.data.methods || [])
        setPaymentTotal(paymentRes.data.totalRevenue || 0)
      }
      if (statusRes?.data) {
        setDeliveryStatus(statusRes.data.deliveryStatus || [])
        setPaymentStatus(statusRes.data.paymentStatus || [])
      }
      if (customersRes?.data) {
        setTopCustomers(customersRes.data.topCustomers || [])
        setCustomerSegments(customersRes.data.customerSegments || { new: 0, returning: 0, total: 0 })
      }

      results.forEach((r, i) => {
        if (r.status === 'rejected') {
          const err = r.reason
          const details = err?.response?.data || err?.message || err
          console.error(`Sales endpoint ${i} failed:`, details)
        }
      })
    } catch (err) {
      console.error("Error fetching sales data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [period, startDate, endDate])

  const maxRevenue = Math.max(...report.map(r => r.revenue), 1)
  const chartHeight = 320

  const downloadPDF = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" })
    const pageWidth = doc.internal.pageSize.getWidth()
    let cursorY = 60

    const header = () => {
      doc.setFillColor(0, 0, 0)
      doc.rect(0, 0, pageWidth, 60, "F")
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(20)
      doc.setFont("helvetica", "bold")
      doc.text("NIKE", 40, 38)
      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(163, 163, 163)
      doc.text("ADMIN PANEL — SALES REPORT", 40, 52)
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("Sales Management Report", pageWidth - 40, 38, { align: "right" })
      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(163, 163, 163)
      doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 40, 52, { align: "right" })
    }

    const footer = (pageNum: number, total: number) => {
      doc.setFillColor(0, 0, 0)
      doc.rect(0, doc.internal.pageSize.getHeight() - 30, pageWidth, 30, "F")
      doc.setTextColor(163, 163, 163)
      doc.setFontSize(8)
      doc.setFont("helvetica", "normal")
      doc.text(`Nike Admin — Sales Report — Page ${pageNum} of ${total}`, 40, doc.internal.pageSize.getHeight() - 10)
      doc.text("CONFIDENTIAL", pageWidth - 40, doc.internal.pageSize.getHeight() - 10, { align: "right" })
    }

    const sectionTitle = (title: string) => {
      doc.setFillColor(190, 242, 100)
      doc.rect(40, cursorY, pageWidth - 80, 22, "F")
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(11)
      doc.setFont("helvetica", "bold")
      doc.text(title, 48, cursorY + 14)
      cursorY += 32
    }

    const ensureSpace = () => {
      const pageHeight = doc.internal.pageSize.getHeight()
      if (cursorY + 110 > pageHeight - 30) {
        doc.addPage()
        cursorY = 72
      }
    }

    header()

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(9)
    doc.setFont("helvetica", "bold")
    doc.text(`Period: ${period}     |     Total Revenue: $${totals.totalRevenue.toLocaleString()}     |     Total Orders: ${totals.totalOrders}     |     Avg Order Value: $${totals.avgOrderValue}`, 40, 88, { align: "left" })
    cursorY = 108

    ensureSpace()
    sectionTitle("Revenue Trend")
    autoTable(doc as any, {
      head: [["Period", "Revenue", "Orders", "Paid", "Pending", "Cancelled", "Avg Value"]],
      body: report.map(r => [r.label, `$${r.revenue.toLocaleString()}`, r.orders, r.paidOrders, r.pendingOrders, r.cancelledOrders, `$${r.avgOrderValue}`]),
      startY: cursorY,
      theme: "grid",
      repeatHeaders: true,
      headStyles: { fillColor: [24, 24, 24], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 9, cellPadding: 8 },
      bodyStyles: { fillColor: [11, 11, 11], textColor: [200, 200, 200], fontSize: 8, cellPadding: 6 },
      alternateRowStyles: { fillColor: [17, 17, 17] },
      styles: { lineColor: [255, 255, 255] as [number, number, number], lineWidth: 0.5 },
      margin: { left: 40, right: 40 },
    } as any)
    cursorY = (doc as any).lastAutoTable.finalY + 24

    ensureSpace()
    sectionTitle("Top Products")
    autoTable(doc as any, {
      head: [["Product", "Category", "Price", "Units Sold", "Revenue"]],
      body: topProducts.map(p => [p.name, p.category, `$${p.price.toLocaleString()}`, p.totalQuantity, `$${p.totalRevenue.toLocaleString()}`]),
      startY: cursorY,
      theme: "grid",
      repeatHeaders: true,
      headStyles: { fillColor: [24, 24, 24], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 9, cellPadding: 8 },
      bodyStyles: { fillColor: [11, 11, 11], textColor: [200, 200, 200], fontSize: 8, cellPadding: 6 },
      alternateRowStyles: { fillColor: [17, 17, 17] },
      styles: { lineColor: [255, 255, 255] as [number, number, number], lineWidth: 0.5 },
      margin: { left: 40, right: 40 },
    } as any)
    cursorY = (doc as any).lastAutoTable.finalY + 24

    ensureSpace()
    sectionTitle("Category Breakdown")
    autoTable(doc as any, {
      head: [["Category", "Revenue", "Orders", "Quantity", "Share"]],
      body: categories.map(c => [c.name, `$${c.revenue.toLocaleString()}`, c.orderCount, c.quantity, `${c.percentage}%`]),
      startY: cursorY,
      theme: "grid",
      repeatHeaders: true,
      headStyles: { fillColor: [24, 24, 24], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 9, cellPadding: 8 },
      bodyStyles: { fillColor: [11, 11, 11], textColor: [200, 200, 200], fontSize: 8, cellPadding: 6 },
      alternateRowStyles: { fillColor: [17, 17, 17] },
      styles: { lineColor: [255, 255, 255] as [number, number, number], lineWidth: 0.5 },
      margin: { left: 40, right: 40 },
    } as any)
    cursorY = (doc as any).lastAutoTable.finalY + 24

    ensureSpace()
    sectionTitle("Payment Methods")
    autoTable(doc as any, {
      head: [["Method", "Count", "Revenue", "Share"]],
      body: paymentMethods.map(p => [p.method, p.count, `$${p.revenue.toLocaleString()}`, `${p.percentage}%`]),
      startY: cursorY,
      theme: "grid",
      repeatHeaders: true,
      headStyles: { fillColor: [24, 24, 24], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 9, cellPadding: 8 },
      bodyStyles: { fillColor: [11, 11, 11], textColor: [200, 200, 200], fontSize: 8, cellPadding: 6 },
      alternateRowStyles: { fillColor: [17, 17, 17] },
      styles: { lineColor: [255, 255, 255] as [number, number, number], lineWidth: 0.5 },
      margin: { left: 40, right: 40 },
    } as any)
    cursorY = (doc as any).lastAutoTable.finalY + 24

    ensureSpace()
    sectionTitle("Delivery & Payment Status")
    autoTable(doc as any, {
      head: [["Delivery Status", "Count", "Revenue", "Payment Status", "Count", "Revenue"]],
      body: Array.from({ length: Math.max(deliveryStatus.length, paymentStatus.length) }, (_, i) => {
        const d = deliveryStatus[i] || { status: "—", count: 0, revenue: 0 }
        const p = paymentStatus[i] || { status: "—", count: 0, revenue: 0 }
        return [d.status, d.count, `$${d.revenue.toLocaleString()}`, p.status, p.count, `$${p.revenue.toLocaleString()}`]
      }),
      startY: cursorY,
      theme: "grid",
      repeatHeaders: true,
      headStyles: { fillColor: [24, 24, 24], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 9, cellPadding: 8 },
      bodyStyles: { fillColor: [11, 11, 11], textColor: [200, 200, 200], fontSize: 8, cellPadding: 6 },
      alternateRowStyles: { fillColor: [17, 17, 17] },
      styles: { lineColor: [255, 255, 255] as [number, number, number], lineWidth: 0.5 },
      margin: { left: 40, right: 40 },
    } as any)
    cursorY = (doc as any).lastAutoTable.finalY + 24

    ensureSpace()
    sectionTitle("Top Customers")
    autoTable(doc as any, {
      head: [["Customer", "Email", "Orders", "Total Spent"]],
      body: topCustomers.map(c => [c.name, c.email, c.orders, `$${c.totalSpent.toLocaleString()}`]),
      startY: cursorY,
      theme: "grid",
      repeatHeaders: true,
      headStyles: { fillColor: [24, 24, 24], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 9, cellPadding: 8 },
      bodyStyles: { fillColor: [11, 11, 11], textColor: [200, 200, 200], fontSize: 8, cellPadding: 6 },
      alternateRowStyles: { fillColor: [17, 17, 17] },
      styles: { lineColor: [255, 255, 255] as [number, number, number], lineWidth: 0.5 },
      margin: { left: 40, right: 40 },
    } as any)

    const pageCount = (doc as any).getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      footer(i, pageCount)
    }

    doc.save(`sales-report-${period}-${new Date().toISOString().split("T")[0]}.pdf`)
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`
    return `$${value}`
  }

  return (
    <div className="min-h-screen bg-[#080808]">
      <PageHeader
        title="Sales"
        label="Sales Management"
        description="Revenue, orders, products, customers, and payment analytics across the store."
        action={
          <div className="flex items-center gap-3">
            <button type="button" onClick={downloadPDF} className={secondaryButton}>
              <Download size={16} />
              Download PDF
            </button>
            <Link href="/admin" className={secondaryButton}>
              <ArrowLeft size={16} />
              Back
            </Link>
          </div>
        }
      />

      <PageBody>
        {/* FILTERS */}
        <div className={`${adminPanel} p-5 sm:p-6 mb-6`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-white/45">Period</label>
                <select value={period} onChange={(e) => setPeriod(e.target.value as Period)} className={fieldClass}>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-white/45">From</label>
                <NikeDatePicker value={startDate} onChange={setStartDate} placeholder="From date" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-white/45">To</label>
                <NikeDatePicker value={endDate} onChange={setEndDate} placeholder="To date" />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          </div>
        ) : (
          <>
            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <MetricCard icon={<TrendingUp size={22} />} label="Total Revenue" value={`$${totals.totalRevenue.toLocaleString()}`} />
              <MetricCard icon={<Receipt size={22} />} label="Total Orders" value={totals.totalOrders} />
              <MetricCard icon={<BarChart3 size={22} />} label="Avg Order Value" value={`$${totals.avgOrderValue}`} />
              <MetricCard icon={<Package size={22} />} label="Top Category" value={categories[0]?.name || "—"} note={categories[0] ? `${categories[0].percentage}% share` : undefined} />
            </div>

            {/* REVENUE CHART */}
            <div className={`${adminPanel} p-5 sm:p-6 mb-6`}>
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-[0.18em] text-white/45">Revenue Trend</h3>
                <p className="text-xs font-bold text-white/35">{period}</p>
              </div>
              <div className="relative h-[340px]">
                {report.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-white/35">No data available for this period.</div>
                ) : (
                  <>
                    <div className="absolute inset-0 flex flex-col justify-between">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} className="border-t border-dashed border-white/10 w-full relative">
                          <span className="absolute -top-2 left-0 text-[10px] font-black text-white/30">
                            {formatCurrency(Math.round((maxRevenue / 4) * (4 - i)))}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="relative h-full flex items-end gap-3 sm:gap-4">
                      {report.map((row, idx) => {
                        const heightPct = maxRevenue > 0 ? (row.revenue / maxRevenue) * 100 : 0
                        return (
                          <div key={row.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                            <div className="w-full flex flex-col items-center justify-end h-[calc(100%-30px)]">
                              <div
                                className="w-full max-w-[60px] rounded-t-lg bg-gradient-to-t from-lime-300 to-white transition-all duration-500 hover:from-white hover:to-lime-300 relative group"
                                style={{ height: `${Math.max(heightPct, 2)}%` }}
                                title={`${row.label}: $${row.revenue.toLocaleString()}`}
                              >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-black px-2 py-1 text-[10px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
                                  ${row.revenue.toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-normal text-white/40 whitespace-nowrap">{row.label}</p>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* CATEGORY BREAKDOWN */}
              <div className={`${adminPanel} p-5 sm:p-6`}>
                <h3 className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-white/45">By Category</h3>
                <div className="space-y-3">
                  {categories.map((cat) => (
                    <div key={cat.name}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-bold text-white">{cat.name}</p>
                        <p className="text-xs font-black text-white/50">{cat.percentage}%</p>
                      </div>
                      <div className="h-2 w-full rounded-full bg-white/10">
                        <div className="h-2 rounded-full bg-lime-300 transition-all duration-500" style={{ width: `${cat.percentage}%` }} />
                      </div>
                      <p className="mt-1 text-xs text-white/35">${cat.revenue.toLocaleString()} · {cat.orderCount} orders</p>
                    </div>
                  ))}
                  {categories.length === 0 && <p className="text-sm text-white/35">No category data available.</p>}
                </div>
              </div>

              {/* PAYMENT METHODS */}
              <div className={`${adminPanel} p-5 sm:p-6`}>
                <h3 className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-white/45">By Payment Method</h3>
                <div className="space-y-3">
                  {paymentMethods.map((pm) => (
                    <div key={pm.method}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-bold text-white capitalize">{pm.method}</p>
                        <p className="text-xs font-black text-white/50">{pm.percentage}%</p>
                      </div>
                      <div className="h-2 w-full rounded-full bg-white/10">
                        <div className="h-2 rounded-full bg-white transition-all duration-500" style={{ width: `${pm.percentage}%` }} />
                      </div>
                      <p className="mt-1 text-xs text-white/35">{pm.count} orders · ${pm.revenue.toLocaleString()}</p>
                    </div>
                  ))}
                  {paymentMethods.length === 0 && <p className="text-sm text-white/35">No payment data available.</p>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* ORDER STATUS */}
              <div className={`${adminPanel} p-5 sm:p-6`}>
                <h3 className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-white/45">Delivery Status</h3>
                <div className="space-y-2">
                  {deliveryStatus.map((s) => (
                    <div key={s.status} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                      <div>
                        <p className="text-sm font-bold text-white">{s.status}</p>
                        <p className="text-xs text-white/35">{s.count} orders</p>
                      </div>
                      <p className="text-sm font-black text-white">${s.revenue.toLocaleString()}</p>
                    </div>
                  ))}
                  {deliveryStatus.length === 0 && <p className="text-sm text-white/35">No status data available.</p>}
                </div>
              </div>

              {/* PAYMENT STATUS */}
              <div className={`${adminPanel} p-5 sm:p-6`}>
                <h3 className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-white/45">Payment Status</h3>
                <div className="space-y-2">
                  {paymentStatus.map((s) => (
                    <div key={s.status} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                      <div>
                        <p className="text-sm font-bold text-white">{s.status}</p>
                        <p className="text-xs text-white/35">{s.count} orders</p>
                      </div>
                      <p className="text-sm font-black text-white">${s.revenue.toLocaleString()}</p>
                    </div>
                  ))}
                  {paymentStatus.length === 0 && <p className="text-sm text-white/35">No payment status data available.</p>}
                </div>
              </div>
            </div>

            {/* TOP PRODUCTS */}
            <div className={`${adminPanel} overflow-hidden mb-6`}>
              <div className="border-b border-white/10 px-5 py-4">
                <h3 className="text-xs font-black uppercase tracking-[0.18em] text-white/45">Top Products</h3>
              </div>
              <div className="overflow-x-auto">
                <table className={adminTable}>
                  <thead>
                    <tr>
                      <TableHeader label="Product" />
                      <TableHeader label="Category" />
                      <TableHeader label="Price" />
                      <TableHeader label="Units Sold" />
                      <TableHeader label="Revenue" />
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.length === 0 ? (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-white/35">No product data available.</td></tr>
                    ) : (
                      topProducts.map((p, idx) => (
                        <tr key={p.productId || idx} className="transition-colors hover:bg-white/[0.04]">
                          <td className={`${adminCell} text-sm font-medium text-white`}>{p.name}</td>
                          <td className={`${adminCell} text-sm text-gray-300`}>{p.category}</td>
                          <td className={`${adminCell} text-sm text-gray-300`}>${p.price.toLocaleString()}</td>
                          <td className={`${adminCell} text-sm text-gray-300`}>{p.totalQuantity}</td>
                          <td className={`${adminCell} text-sm font-black text-white`}>${p.totalRevenue.toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* TOP CUSTOMERS */}
            <div className={`${adminPanel} overflow-hidden`}>
              <div className="border-b border-white/10 px-5 py-4">
                <h3 className="text-xs font-black uppercase tracking-[0.18em] text-white/45">Top Customers</h3>
              </div>
              <div className="overflow-x-auto">
                <table className={adminTable}>
                  <thead>
                    <tr>
                      <TableHeader label="Customer" />
                      <TableHeader label="Email" />
                      <TableHeader label="Orders" />
                      <TableHeader label="Total Spent" />
                    </tr>
                  </thead>
                  <tbody>
                    {topCustomers.length === 0 ? (
                      <tr><td colSpan={4} className="px-4 py-8 text-center text-white/35">No customer data available.</td></tr>
                    ) : (
                      topCustomers.map((c, idx) => (
                        <tr key={c.email || idx} className="transition-colors hover:bg-white/[0.04]">
                          <td className={`${adminCell} text-sm font-medium text-white`}>{c.name}</td>
                          <td className={`${adminCell} text-sm text-gray-300`}>{c.email}</td>
                          <td className={`${adminCell} text-sm text-gray-300`}>{c.orders}</td>
                          <td className={`${adminCell} text-sm font-black text-white`}>${c.totalSpent.toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-white/10 px-5 py-4 flex items-center justify-between">
                <p className="text-xs font-bold text-white/40">Customer Segments</p>
                <p className="text-xs text-white/35">{customerSegments.new} new · {customerSegments.returning} returning · {customerSegments.total} total</p>
              </div>
            </div>
          </>
        )}
      </PageBody>
    </div>
  )
}

const TableHeader = ({ label, hidden, className = "" }: { label: string; hidden?: string; className?: string }) => (
  <th className={`${adminHeaderCell} ${hidden ? `hidden ${hidden}:table-cell` : ""} ${className}`}>{label}</th>
)

function formatCurrency(value: number) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`
  return `$${value}`
}

export default SalesPage
