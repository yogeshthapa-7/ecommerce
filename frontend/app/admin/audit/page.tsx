"use client"
import React, { useEffect, useState } from "react"
import {
  ArrowLeft,
  ClipboardList,
  Search,
  UserCog,
  Activity,
  FileText,
  GitBranch,
} from "lucide-react"
import axios from "axios"
import Link from "next/link"
import { AdminModal, PageBody, PageHeader, MetricCard, StatusBadge, adminPanel, adminTable, adminHeaderCell, adminCell, fieldClass, secondaryButton } from "@/components/admin/AdminSurface"
import { NikeDatePicker } from "@/components/ui/nike-date-picker"

const ACTIONS = ["CREATE", "UPDATE", "DELETE", "APPROVE", "REJECT", "CANCEL", "COMPLETE", "RESTOCK", "ADJUST_STOCK"]
const ENTITY_TYPES = ["Order", "Product", "Return", "Exchange", "Customer", "Category", "User", "Stock"]

const actionColors: Record<string, string> = {
    CREATE: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    UPDATE: "border-blue-400/30 bg-blue-400/10 text-blue-300",
    DELETE: "border-red-400/30 bg-red-400/10 text-red-300",
    APPROVE: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    REJECT: "border-red-400/30 bg-red-400/10 text-red-300",
    CANCEL: "border-amber-300/30 bg-amber-300/10 text-amber-200",
    COMPLETE: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    RESTOCK: "border-blue-400/30 bg-blue-400/10 text-blue-300",
    ADJUST_STOCK: "border-purple-400/30 bg-purple-400/10 text-purple-300",
}

const AuditPage = () => {
  const [logs, setLogs] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState<any>(null)
  const [filterAction, setFilterAction] = useState("")
  const [filterEntity, setFilterEntity] = useState("")
  const [search, setSearch] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [activeLog, setActiveLog] = useState<any | null>(null)

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : ""

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" })
      if (filterAction) params.set("action", filterAction)
      if (filterEntity) params.set("entityType", filterEntity)
      if (startDate) params.set("startDate", startDate)
      if (endDate) params.set("endDate", endDate)

      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/audit?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setLogs(res.data.logs || [])
      setPagination(res.data.pagination || null)
    } catch (err) {
      console.error("Error fetching audit logs:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/audit/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setStats(res.data)
    } catch (err) {
      console.error("Error fetching audit stats:", err)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [page, filterAction, filterEntity, startDate, endDate])

  useEffect(() => {
    fetchStats()
  }, [])

  const visibleLogs = logs.filter((log) => {
    const term = search.trim().toLowerCase()
    if (!term) return true
    return (
      log.description?.toLowerCase().includes(term) ||
      log.entityName?.toLowerCase().includes(term) ||
      log.adminName?.toLowerCase().includes(term) ||
      log.entityId?.toLowerCase().includes(term)
    )
  })

  const resetFilters = () => {
    setFilterAction("")
    setFilterEntity("")
    setSearch("")
    setStartDate("")
    setEndDate("")
    setPage(1)
  }

  const hasActiveFilters = filterAction || filterEntity || startDate || endDate || search

  return (
    <div className="min-h-screen bg-[#080808]">
      <PageHeader
        title="Audit Log"
        label="Audit Report"
        description="Track all admin actions across orders, products, returns, exchanges, customers, and more."
        action={
          <Link href="/admin" className={secondaryButton}>
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        }
      />

      <PageBody>
        {/* SUMMARY CARDS */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <MetricCard icon={<FileText size={22} />} label="Total Logs" value={stats.totalLogs} note={stats.todayLogs > 0 ? `+${stats.todayLogs} today` : undefined} />
            <MetricCard icon={<Activity size={22} />} label="Entity Types" value={stats.entityBreakdown?.length || 0} />
            <MetricCard icon={<UserCog size={22} />} label="Unique Actions" value={stats.actionBreakdown?.length || 0} />
            <MetricCard icon={<GitBranch size={22} />} label="Top Admin Actions" value={stats.topAdmins?.[0]?.count || 0} note={stats.topAdmins?.[0]?.name || '—'} />
          </div>
        )}

        {/* ACTION BREAKDOWN CHIPS */}
        {stats?.actionBreakdown && (
          <div className="mb-8 flex flex-wrap gap-2">
            {stats.actionBreakdown.map((ab: any) => (
              <span key={ab._id} className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${actionColors[ab._id] || "border-white/10 bg-white/[0.06] text-white/60"}`}>
                {ab._id} <span className="ml-1.5 text-white/50">{ab.count}</span>
              </span>
            ))}
          </div>
        )}

        {/* FILTER SECTION */}
        <div className={`${adminPanel} p-5 sm:p-6 mb-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black uppercase tracking-[0.18em] text-white/45">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white transition-colors hover:bg-white/10"
              >
                Reset All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-white/45">Action</label>
              <select
                value={filterAction}
                onChange={(e) => { setFilterAction(e.target.value); setPage(1) }}
                className={fieldClass}
              >
                <option value="">All Actions</option>
                {ACTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-white/45">Entity Type</label>
              <select
                value={filterEntity}
                onChange={(e) => { setFilterEntity(e.target.value); setPage(1) }}
                className={fieldClass}
              >
                <option value="">All Entities</option>
                {ENTITY_TYPES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-white/45">From Date</label>
              <NikeDatePicker
                value={startDate}
                onChange={(val) => { setStartDate(val); setPage(1) }}
                placeholder="From date"
              />
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-white/45">To Date</label>
              <NikeDatePicker
                value={endDate}
                onChange={(val) => { setEndDate(val); setPage(1) }}
                placeholder="To date"
              />
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by description, entity name, admin name, or entity ID..."
              className={`${fieldClass} pl-12`}
            />
          </div>
        </div>

        {/* TABLE */}
        <div className={`${adminPanel} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className={adminTable}>
              <thead>
                <tr>
                  <TableHeader label="Timestamp" />
                  <TableHeader label="Admin" />
                  <TableHeader label="Action" />
                  <TableHeader label="Entity" />
                  <TableHeader label="Entity ID" />
                  <TableHeader label="Description" />
                  <TableHeader label="IP Address" />
                  <TableHeader
                    label="Details"
                    className="sticky right-0 z-20 bg-black/95 shadow-[-12px_0_20px_rgba(0,0,0,0.35)]"
                  />
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr key="loading">
                    <td colSpan={8} className="px-4 py-12 text-center text-white/35">
                      <div className="flex items-center justify-center gap-3">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                        <span className="text-sm font-medium">Loading audit logs...</span>
                      </div>
                    </td>
                  </tr>
                ) : visibleLogs.length === 0 ? (
                  <tr key="empty">
                    <td colSpan={8} className="px-4 py-12 text-center text-white/35">
                      <div className="flex flex-col items-center gap-3">
                        <FileText size={32} className="text-white/20" />
                        <div>
                          <p className="text-sm font-medium text-white/50">No audit logs found</p>
                          <p className="mt-1 text-xs text-white/35">
                            {hasActiveFilters ? "Try adjusting your filters to see more results." : "Audit logs will appear here as admins perform actions in the system."}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  visibleLogs.map((log, idx) => (
                    <tr key={log._id || idx} className="transition-colors hover:bg-white/[0.04]">
                      <td className={`${adminCell} text-xs text-gray-400 whitespace-nowrap`}>
                        {log.createdAt ? new Date(log.createdAt).toLocaleString() : "—"}
                      </td>
                      <td className={`${adminCell} max-w-[160px]`}>
                        <div>
                          <p className="text-gray-300 text-sm font-medium truncate">{log.adminName || "—"}</p>
                          <p className="text-gray-500 text-xs truncate">{log.adminEmail || "—"}</p>
                        </div>
                      </td>
                      <td className={adminCell}>
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${actionColors[log.action] || "border-white/10 bg-white/[0.06] text-white/60"}`}>
                          {log.action || "—"}
                        </span>
                      </td>
                      <td className={`${adminCell} text-sm font-medium text-gray-300`}>
                        {log.entityType || "—"}
                      </td>
                      <td className={`${adminCell} text-xs text-gray-400 max-w-[120px] truncate`} title={log.entityId}>
                        {log.entityId || "—"}
                      </td>
                      <td className={`${adminCell} max-w-[200px] truncate text-xs text-gray-300`} title={log.description}>
                        {log.description || "—"}
                      </td>
                      <td className={`${adminCell} text-xs text-gray-400`}>
                        {log.ipAddress || "—"}
                      </td>
                      <td className={`${adminCell} sticky right-0 z-10 bg-[#111111] shadow-[-12px_0_20px_rgba(0,0,0,0.28)]`}>
                        <button
                          onClick={() => setActiveLog(log)}
                          className={secondaryButton}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {pagination && !loading && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-white/40">
              Page {pagination.currentPage} of {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={!pagination.hasPrevPage}
                onClick={() => setPage((p) => p - 1)}
                className={`${secondaryButton} disabled:opacity-40`}
              >
                Previous
              </button>
              <button
                disabled={!pagination.hasNextPage}
                onClick={() => setPage((p) => p + 1)}
                className={`${secondaryButton} disabled:opacity-40`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </PageBody>

      {/* Detail modal */}
      <AdminModal
        open={!!activeLog}
        onClose={() => setActiveLog(null)}
        eyebrow="Audit Details"
        title={activeLog?.action || "Audit Log"}
        subtitle={activeLog ? `${activeLog.entityType} — ${activeLog.entityId}` : ""}
        maxWidthClass="max-w-xl"
        footer={
          <button
            type="button"
            onClick={() => setActiveLog(null)}
            className="inline-flex flex-1 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-white transition-colors hover:bg-white/10"
          >
            Close
          </button>
        }
      >
        {activeLog && (
          <div className="space-y-4">
            <DetailRow label="Admin" value={`${activeLog.adminName || "—"} <${activeLog.adminEmail || "—"}>`} />
            <DetailRow label="Action" value={<StatusBadge status={activeLog.action} />} />
            <DetailRow label="Entity Type" value={activeLog.entityType} />
            <DetailRow label="Entity ID" value={activeLog.entityId} />
            <DetailRow label="Entity Name" value={activeLog.entityName || "—"} />
            <DetailRow label="Description" value={activeLog.description || "—"} />
            <DetailRow label="IP Address" value={activeLog.ipAddress || "—"} />
            <DetailRow label="Timestamp" value={activeLog.createdAt ? new Date(activeLog.createdAt).toLocaleString() : "—"} />
            {activeLog.changes && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40">Changes</p>
                <pre className="mt-2 text-xs font-medium text-white/70 whitespace-pre-wrap break-words">
                  {JSON.stringify(activeLog.changes, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </AdminModal>
    </div>
  )
}

/* ================= HELPERS ================= */

const TableHeader = ({ label, hidden, className = "" }: { label: string; hidden?: string; className?: string }) => (
  <th className={`${adminHeaderCell} ${hidden ? `hidden ${hidden}:table-cell` : ""} ${className}`}>{label}</th>
)

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40">{label}</p>
    <p className="mt-1 text-sm font-semibold text-white/80">{value}</p>
  </div>
)

export default AuditPage
