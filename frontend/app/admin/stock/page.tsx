"use client"
import React, { useEffect, useState } from "react"
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Download,
  Package,
  Plus,
  Search,
  TrendingDown,
  TrendingUp,
  Warehouse,
} from "lucide-react"
import axios from "axios"
import Link from "next/link"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { AdminModal, PageBody, PageHeader, MetricCard, StatusBadge, adminPanel, adminTable, adminHeaderCell, adminCell, fieldClass, secondaryButton, primaryButton } from "@/components/admin/AdminSurface"
import { NikeDatePicker } from "@/components/ui/nike-date-picker"
import { getToken } from "@/lib/auth"

type StockLog = {
  _id: string
  productId: string
  productName: string
  changeType: string
  quantityChange: number
  previousQuantity: number
  newQuantity: number
  referenceId?: string
  referenceType?: string
  performedByName: string
  notes: string
  createdAt: string
}

type ProductSummary = {
  _id: string
  name: string
  category: string
  price: number
  stockQuantity: number
  lowStockThreshold: number
  in_stock: boolean
  image_url: string
}

type ReportData = {
  movementsByType: Array<{
    type: string
    totalIn: number
    totalOut: number
    count: number
  }>
  topProducts: Array<{
    productId: string
    productName: string
    totalIn: number
    totalOut: number
    movements: number
  }>
}

const changeTypeColors: Record<string, string> = {
  sale: "border-red-400/30 bg-red-400/10 text-red-300",
  return: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  exchange_in: "border-blue-400/30 bg-blue-400/10 text-blue-300",
  exchange_out: "border-blue-400/30 bg-blue-400/10 text-blue-300",
  restock: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  adjustment: "border-purple-400/30 bg-purple-400/10 text-purple-300",
}

const StockPage = () => {
  const [logs, setLogs] = useState<StockLog[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [lowStockProducts, setLowStockProducts] = useState<ProductSummary[]>([])
  const [report, setReport] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState<any>(null)
  const [filterType, setFilterType] = useState("")
  const [filterProduct, setFilterProduct] = useState("")
  const [search, setSearch] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [adjustProductId, setAdjustProductId] = useState("")
  const [adjustQuantity, setAdjustQuantity] = useState("")
  const [adjustReason, setAdjustReason] = useState("")
  const [adjustType, setAdjustType] = useState("adjustment")
  const [products, setProducts] = useState<ProductSummary[]>([])

  const token = getToken() || ""

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" })
      if (filterType) params.set("changeType", filterType)
      if (filterProduct) params.set("productId", filterProduct)
      if (startDate) params.set("startDate", startDate)
      if (endDate) params.set("endDate", endDate)
      if (search) params.set("search", search)

      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/stock/logs?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setLogs(res.data.logs || [])
      setPagination(res.data.pagination || null)
    } catch (err) {
      console.error("Error fetching stock logs:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchSummary = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/stock/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSummary(res.data)
    } catch (err) {
      console.error("Error fetching stock summary:", err)
    }
  }

  const fetchLowStock = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/stock/low-stock?limit=20`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setLowStockProducts(res.data || [])
    } catch (err) {
      console.error("Error fetching low stock:", err)
    }
  }

  const fetchReport = async () => {
    try {
      const params = new URLSearchParams()
      if (startDate) params.set("startDate", startDate)
      if (endDate) params.set("endDate", endDate)
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/stock/report?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setReport(res.data)
    } catch (err) {
      console.error("Error fetching stock report:", err)
    }
  }

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products?showAll=true&includeOutOfStock=true`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setProducts(res.data.products || [])
    } catch (err) {
      console.error("Error fetching products:", err)
    }
  }

  useEffect(() => {
    fetchLogs()
    fetchSummary()
    fetchLowStock()
    fetchReport()
    fetchProducts()
  }, [page, filterType, filterProduct, startDate, endDate])

  useEffect(() => {
    fetchReport()
  }, [startDate, endDate])

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adjustProductId || !adjustQuantity) return

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/stock/product/${adjustProductId}/adjust`,
        {
          quantity: parseInt(adjustQuantity),
          reason: adjustReason,
          changeType: adjustType,
          notes: adjustReason,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setAdjustProductId("")
      setAdjustQuantity("")
      setAdjustReason("")
      setAdjustType("adjustment")
      fetchLogs()
      fetchSummary()
      fetchLowStock()
      fetchReport()
    } catch (err) {
      console.error("Error adjusting stock:", err)
    }
  }

  const resetFilters = () => {
    setFilterType("")
    setFilterProduct("")
    setSearch("")
    setStartDate("")
    setEndDate("")
    setPage(1)
  }

  const hasActiveFilters = filterType || filterProduct || startDate || endDate || search

  const visibleLogs = logs.filter((log) => {
    const term = search.trim().toLowerCase()
    if (!term) return true
    return (
      log.productName?.toLowerCase().includes(term) ||
      log.referenceId?.toLowerCase().includes(term) ||
      log.notes?.toLowerCase().includes(term) ||
      log.performedByName?.toLowerCase().includes(term)
    )
  })

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
      doc.text("ADMIN PANEL — STOCK REPORT", 40, 52)
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("Stock Management Report", pageWidth - 40, 38, { align: "right" })
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
      doc.text(`Nike Admin — Stock Report — Page ${pageNum} of ${total}`, 40, doc.internal.pageSize.getHeight() - 10)
      doc.text("CONFIDENTIAL", pageWidth - 40, doc.internal.pageSize.getHeight() - 10, { align: "right" })
    }

    const ensureSpace = () => {
      const pageHeight = doc.internal.pageSize.getHeight()
      if (cursorY + 110 > pageHeight - 30) {
        doc.addPage()
        cursorY = 72
      }
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

    const drawTable = (head: string[][], body: string[][]) => {
      autoTable(doc as any, {
        head,
        body,
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
    }

    header()

    if (summary) {
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(9)
      doc.setFont("helvetica", "bold")
      doc.text(`Total Products: ${summary.totalProducts}     |     Low Stock: ${summary.lowStockProducts}     |     Out of Stock: ${summary.outOfStockProducts}     |     Inventory Value: $${Number(summary.totalInventoryValue || 0).toLocaleString()}`, 40, 88, { align: "left" })
      cursorY = 108
    }

    ensureSpace()
    sectionTitle("Stock Movements")
    drawTable(
      [["Timestamp", "Product", "Change Type", "Quantity Change", "Previous", "New", "Performed By"]],
      visibleLogs.map((log) => [
        log.createdAt ? new Date(log.createdAt).toLocaleString() : "—",
        log.productName || "—",
        log.changeType || "—",
        log.quantityChange > 0 ? `+${log.quantityChange}` : String(log.quantityChange),
        String(log.previousQuantity),
        String(log.newQuantity),
        log.performedByName || "—",
      ])
    )

    if (report) {
      ensureSpace()
      sectionTitle("Movements by Type")
      drawTable(
        [["Type", "Total In", "Total Out", "Count"]],
        (report.movementsByType || []).map((m) => [m.type, String(m.totalIn), String(m.totalOut), String(m.count)])
      )

      ensureSpace()
      sectionTitle("Top Products by Movements")
      drawTable(
        [["Product", "Total In", "Total Out", "Movements"]],
        (report.topProducts || []).map((p) => [p.productName, String(p.totalIn), String(p.totalOut), String(p.movements)])
      )
    }

    if (lowStockProducts.length > 0) {
      ensureSpace()
      sectionTitle("Low Stock Alerts")
      drawTable(
        [["Product", "Category", "Current Stock", "Threshold", "Status"]],
        lowStockProducts.map((p) => [
          p.name,
          p.category,
          String(p.stockQuantity),
          String(p.lowStockThreshold),
          p.stockQuantity === 0 ? "Out of Stock" : "Low Stock",
        ])
      )
    }

    const pageCount = (doc as any).getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      footer(i, pageCount)
    }

    doc.save(`stock-report-${new Date().toISOString().split("T")[0]}.pdf`)
  }

  return (
    <div className="min-h-screen bg-[#080808]">
      <PageHeader
        title="Stock"
        label="Stock Management"
        description="Track inventory levels, stock movements, low stock alerts, and manual adjustments."
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
        {/* SUMMARY CARDS */}
        {summary && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <MetricCard icon={<Package size={22} />} label="Total Products" value={summary.totalProducts} />
            <MetricCard icon={<AlertTriangle size={22} />} label="Low Stock" value={summary.lowStockProducts} />
            <MetricCard icon={<TrendingDown size={22} />} label="Out of Stock" value={summary.outOfStockProducts} />
            <MetricCard icon={<Warehouse size={22} />} label="Inventory Value" value={`$${Number(summary.totalInventoryValue || 0).toLocaleString()}`} />
            <MetricCard icon={<Activity size={22} />} label="Today Movements" value={summary.todayMovements} />
          </div>
        )}

        {/* FILTERS */}
        <div className={`${adminPanel} p-5 sm:p-6 mb-6`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label className={`${fieldClass} block`}>Change Type</label>
                <select value={filterType} onChange={(e) => { setFilterType(e.target.value); setPage(1) }} className={fieldClass}>
                  <option value="">All Types</option>
                  <option value="sale">Sale</option>
                  <option value="return">Return</option>
                  <option value="exchange_in">Exchange In</option>
                  <option value="exchange_out">Exchange Out</option>
                  <option value="restock">Restock</option>
                  <option value="adjustment">Adjustment</option>
                </select>
              </div>
              <div>
                <label className={`${fieldClass} block`}>Product</label>
                <select value={filterProduct} onChange={(e) => { setFilterProduct(e.target.value); setPage(1) }} className={fieldClass}>
                  <option value="">All Products</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`${fieldClass} block`}>From</label>
                <NikeDatePicker value={startDate} onChange={setStartDate} placeholder="From date" />
              </div>
              <div>
                <label className={`${fieldClass} block`}>To</label>
                <NikeDatePicker value={endDate} onChange={setEndDate} placeholder="To date" />
              </div>
              {hasActiveFilters && (
                <button onClick={resetFilters} className={secondaryButton}>
                  Reset
                </button>
              )}
            </div>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search logs..."
                className={`${fieldClass} pl-12`}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          </div>
        ) : (
          <>
            {/* STOCK MOVEMENT LOG */}
            <div className={`${adminPanel} overflow-hidden mb-6`}>
              <div className="border-b border-white/10 px-5 py-4">
                <h3 className="text-xs font-black uppercase tracking-[0.18em] text-white/45">Stock Movement Log</h3>
              </div>
              <div className="overflow-x-auto">
                <table className={adminTable}>
                  <thead>
                    <tr>
                      <TableHeader label="Timestamp" />
                      <TableHeader label="Product" />
                      <TableHeader label="Change Type" />
                      <TableHeader label="Quantity" />
                      <TableHeader label="Previous" />
                      <TableHeader label="New" />
                      <TableHeader label="Performed By" />
                      <TableHeader label="Notes" />
                    </tr>
                  </thead>
                  <tbody>
                    {visibleLogs.length === 0 ? (
                      <tr><td colSpan={8} className="px-4 py-8 text-center text-white/35">No stock logs found.</td></tr>
                    ) : (
                      visibleLogs.map((log) => (
                        <tr key={log._id} className="transition-colors hover:bg-white/[0.04]">
                          <td className={`${adminCell} text-xs text-gray-400 whitespace-nowrap`}>
                            {log.createdAt ? new Date(log.createdAt).toLocaleString() : "—"}
                          </td>
                          <td className={`${adminCell} text-sm font-medium text-white`}>{log.productName}</td>
                          <td className={adminCell}>
                            <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${changeTypeColors[log.changeType] || "border-white/10 bg-white/[0.06] text-white/60"}`}>
                              {log.changeType || "—"}
                            </span>
                          </td>
                          <td className={`${adminCell} text-sm font-black ${log.quantityChange > 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                            {log.quantityChange > 0 ? `+${log.quantityChange}` : String(log.quantityChange)}
                          </td>
                          <td className={`${adminCell} text-sm text-gray-300`}>{log.previousQuantity}</td>
                          <td className={`${adminCell} text-sm text-gray-300`}>{log.newQuantity}</td>
                          <td className={`${adminCell} text-sm text-gray-300`}>{log.performedByName}</td>
                          <td className={`${adminCell} max-w-[200px] truncate text-xs text-gray-400`} title={log.notes}>
                            {log.notes || "—"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {pagination && !loading && (
              <div className="mb-6 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-white/40">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </p>
                <div className="flex gap-2">
                  <button disabled={!pagination.hasPrevPage} onClick={() => setPage((p) => p - 1)} className={`${secondaryButton} disabled:opacity-40`}>
                    Previous
                  </button>
                  <button disabled={!pagination.hasNextPage} onClick={() => setPage((p) => p + 1)} className={`${secondaryButton} disabled:opacity-40`}>
                    Next
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* LOW STOCK ALERTS */}
              <div className={`${adminPanel} overflow-hidden`}>
                <div className="border-b border-white/10 px-5 py-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.18em] text-white/45">Low Stock Alerts</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className={adminTable}>
                    <thead>
                      <tr>
                        <TableHeader label="Product" />
                        <TableHeader label="Category" />
                        <TableHeader label="Stock" />
                        <TableHeader label="Threshold" />
                        <TableHeader label="Status" />
                      </tr>
                    </thead>
                    <tbody>
                      {lowStockProducts.length === 0 ? (
                        <tr><td colSpan={5} className="px-4 py-8 text-center text-white/35">No low stock alerts.</td></tr>
                      ) : (
                        lowStockProducts.map((p) => (
                          <tr key={p._id} className="transition-colors hover:bg-white/[0.04]">
                            <td className={`${adminCell} text-sm font-medium text-white`}>{p.name}</td>
                            <td className={`${adminCell} text-sm text-gray-300`}>{p.category}</td>
                            <td className={`${adminCell} text-sm font-black ${p.stockQuantity === 0 ? 'text-red-300' : 'text-amber-300'}`}>{p.stockQuantity}</td>
                            <td className={`${adminCell} text-sm text-gray-300`}>{p.lowStockThreshold}</td>
                            <td className={adminCell}>
                              <StatusBadge status={p.stockQuantity === 0 ? "Out of Stock" : "Low Stock"} />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* MANUAL ADJUST */}
              <div className={`${adminPanel} p-5 sm:p-6`}>
                <h3 className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-white/45">Manual Stock Adjustment</h3>
                <form onSubmit={handleAdjustStock} className="space-y-4">
                  <div>
                    <label className={fieldClass}>Product</label>
                     <select value={adjustProductId} onChange={(e) => setAdjustProductId(e.target.value)} className={fieldClass} required>
                       <option value="">Select a product</option>
                       {lowStockProducts.map((p) => (
                         <option key={p._id} value={p._id}>{p.name} (Current: {p.stockQuantity})</option>
                       ))}
                     </select>
                  </div>
                  <div>
                    <label className={fieldClass}>Change Type</label>
                    <select value={adjustType} onChange={(e) => setAdjustType(e.target.value)} className={fieldClass}>
                      <option value="adjustment">Adjustment</option>
                      <option value="restock">Restock</option>
                    </select>
                  </div>
                  <div>
                    <label className={fieldClass}>Quantity Change (+/-)</label>
                    <input
                      type="number"
                      value={adjustQuantity}
                      onChange={(e) => setAdjustQuantity(e.target.value)}
                      placeholder="e.g. 10 or -5"
                      className={fieldClass}
                      required
                    />
                  </div>
                  <div>
                    <label className={fieldClass}>Reason / Notes</label>
                    <textarea
                      value={adjustReason}
                      onChange={(e) => setAdjustReason(e.target.value)}
                      placeholder="Reason for adjustment..."
                      className={fieldClass}
                      rows={3}
                    />
                  </div>
                  <button type="submit" className={primaryButton}>
                    <Plus size={16} />
                    Adjust Stock
                  </button>
                </form>
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

export default StockPage
