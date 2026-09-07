"use client"
import React, { useEffect, useState } from "react"
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  RotateCcw,
  Search,
  Trash2,
  XCircle,
} from "lucide-react"
import axios from "axios"
import Link from "next/link"
import { AdminConfirmDialog, AdminModal, PageBody, PageHeader, MetricCard, StatusBadge, adminPanel, adminTable, adminHeaderCell, adminCell, fieldClass, iconButton, labelClass, primaryButton, secondaryButton } from "@/components/admin/AdminSurface"

const STATUS_OPTIONS = ["Requested", "Approved", "Rejected", "Refunded", "Cancelled"]

const ReturnsPage = () => {
  const [returns, setReturns] = useState<any[]>([])
  const [stats, setStats] = useState({ total: 0, requested: 0, approved: 0, rejected: 0, refunded: 0 })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState<any>(null)
  const [filterStatus, setFilterStatus] = useState("")
  const [search, setSearch] = useState("")

  const [activeReturn, setActiveReturn] = useState<any | null>(null)
  const [statusAction, setStatusAction] = useState<{ returnId: string; status: string } | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : ""

  const fetchReturns = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: "10" })
      if (filterStatus) params.set("status", filterStatus)

      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/returns?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setReturns(res.data.returns || [])
      setPagination(res.data.pagination || null)
    } catch (err) {
      console.error("Error fetching returns:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/returns/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setStats(res.data)
    } catch (err) {
      console.error("Error fetching return stats:", err)
    }
  }

  useEffect(() => {
    fetchReturns()
  }, [page, filterStatus])

  useEffect(() => {
    fetchStats()
  }, [])

  const handleStatusUpdate = async () => {
    if (!statusAction) return
    try {
      const ret = returns.find((r) => r._id === statusAction.returnId)
      const payload: any = {
        status: statusAction.status,
        resolution: ret?.resolution || `Marked as ${statusAction.status} by admin`,
      }

      if (statusAction.status === "Rejected") {
        payload.resolution = rejectionReason || payload.resolution
      }

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/returns/${statusAction.returnId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setStatusAction(null)
      setRejectionReason("")
      fetchReturns()
      fetchStats()
    } catch (err) {
      console.error("Error updating return:", err)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/returns/${deleteTarget._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setDeleteTarget(null)
      fetchReturns()
      fetchStats()
    } catch (err) {
      console.error("Error deleting return:", err)
    }
  }

  const visibleReturns = returns.filter((r) => {
    const term = search.trim().toLowerCase()
    if (!term) return true
    return (
      r.returnId?.toLowerCase().includes(term) ||
      r.customerName?.toLowerCase().includes(term) ||
      r.customerEmail?.toLowerCase().includes(term) ||
      r.reason?.toLowerCase().includes(term)
    )
  })

  return (
    <div className="min-h-screen bg-[#080808]">
      <PageHeader
        title="Returns"
        label="Return Policy"
        description="Manage customer return requests, approve or reject them, and track refund status."
        action={
          <Link href="/admin/orders" className={secondaryButton}>
            <ArrowLeft size={16} />
            Back to Orders
          </Link>
        }
      />

      <PageBody>
        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <MetricCard icon={<Clock size={22} />} label="Total Returns" value={stats.total} />
          <MetricCard icon={<RotateCcw size={22} />} label="Requested" value={stats.requested} />
          <MetricCard icon={<CheckCircle2 size={22} />} label="Approved" value={stats.approved} />
          <MetricCard icon={<XCircle size={22} />} label="Rejected" value={stats.rejected} />
          <MetricCard icon={<CheckCircle2 size={22} />} label="Refunded" value={stats.refunded} />
        </div>

        {/* FILTER + SEARCH */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value)
                setPage(1)
              }}
              className={`${fieldClass} w-auto`}
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search returns..."
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
                  <TableHeader label="Return ID" />
                  <TableHeader label="Customer" />
                  <TableHeader label="Reason" />
                  <TableHeader label="Refund" />
                  <TableHeader label="Status" />
                  <TableHeader label="Created" />
                  <TableHeader
                    label="Actions"
                    className="sticky right-0 z-20 bg-black/95 shadow-[-12px_0_20px_rgba(0,0,0,0.35)]"
                  />
                </tr>
              </thead>
              <tbody>
                {visibleReturns.length === 0 ? (
                  <tr key="empty">
                    <td colSpan={7} className="px-4 py-8 text-center text-white/35">
                      No returns found.
                    </td>
                  </tr>
                ) : (
                  visibleReturns.map((ret, idx) => (
                    <tr key={ret._id || idx} className="transition-colors hover:bg-white/[0.04]">
                      <td className={`${adminCell} max-w-[120px] truncate text-sm font-bold text-white`} title={ret.returnId}>
                        {ret.returnId || ret._id}
                      </td>
                      <td className={`${adminCell} max-w-[160px]`}>
                        <div>
                          <p className="text-gray-300 text-sm font-medium truncate">{ret.customerName || "N/A"}</p>
                          <p className="text-gray-500 text-xs truncate">{ret.customerEmail || "—"}</p>
                        </div>
                      </td>
                      <td className={`${adminCell} max-w-[220px] truncate text-xs text-gray-300`} title={ret.reason}>
                        {ret.reason || "—"}
                      </td>
                      <td className={`${adminCell} text-sm font-bold text-white`}>
                        ${(ret.refundAmount || ret.totalAmount || 0).toLocaleString()}
                      </td>
                      <td className={adminCell}>
                        <StatusBadge status={ret.status} />
                      </td>
                      <td className={`${adminCell} text-xs text-gray-400`}>
                        {ret.createdAt ? new Date(ret.createdAt).toLocaleDateString() : "—"}
                      </td>
                      <td className={`${adminCell} sticky right-0 z-10 bg-[#111111] shadow-[-12px_0_20px_rgba(0,0,0,0.28)]`}>
                        <div className="flex gap-2">
                          {ret.status === "Requested" && (
                            <>
                              <button
                                type="button"
                                onClick={() => setStatusAction({ returnId: ret._id || ret.id, status: "Approved" })}
                                className="inline-flex items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-emerald-300 transition-colors hover:bg-emerald-400/20"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => setStatusAction({ returnId: ret._id || ret.id, status: "Rejected" })}
                                className="inline-flex items-center justify-center rounded-full border border-red-400/30 bg-red-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-red-300 transition-colors hover:bg-red-400/20"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => setDeleteTarget(ret)}
                            className={iconButton}
                            title="Delete return"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {pagination && (
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

      {/* Status update confirmation dialog */}
      {statusAction && (
        <div className={adminPanel?.includes("rounded-2xl") ? "fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" : "fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"}>
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0b] shadow-[0_24px_90px_rgba(0,0,0,0.55)]">
            <div className="border-b border-white/10 bg-[#090909] px-5 py-5 sm:px-7 sm:py-6">
              <div className="mb-3 inline-flex rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white/78">
                Confirm Action
              </div>
              <h2 className="max-w-[720px] text-3xl font-black uppercase leading-none tracking-normal text-white sm:text-4xl">
                {statusAction.status === "Approved" ? "Approve" : "Reject"} Return
              </h2>
              <p className="mt-3 max-w-2xl text-sm font-semibold text-white/45">
                {statusAction.status === "Approved"
                  ? "This will approve the return request and notify the customer. The return can no longer be modified."
                  : "This will reject the return request and notify the customer. The return can no longer be modified."}
              </p>
            </div>

            <div className="p-5 sm:p-7 space-y-4">
              {statusAction.status === "Rejected" && (
                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-white/45">
                    Rejection Reason <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm font-medium text-white outline-none transition-colors placeholder:text-white/25 focus:border-white/40"
                    placeholder="Enter the reason for rejecting this return..."
                  />
                </div>
              )}
            </div>

            <div className="sticky bottom-0 z-10 flex flex-col gap-3 border-t border-white/10 bg-[#0b0b0b]/95 p-4 backdrop-blur-md sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setStatusAction(null)
                  setRejectionReason("")
                }}
                className="inline-flex flex-1 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-white transition-colors hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStatusUpdate}
                disabled={statusAction.status === "Rejected" && !rejectionReason.trim()}
                className="inline-flex flex-1 items-center justify-center rounded-xl bg-white px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-black transition-colors hover:bg-lime-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {statusAction.status || "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      <AdminConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Return"
        message={`This will permanently remove return ${deleteTarget?.returnId || deleteTarget?._id || "this record"}. This action cannot be undone.`}
        confirmLabel="Delete"
      />

      {/* View details modal */}
      <AdminModal
        open={!!activeReturn}
        onClose={() => setActiveReturn(null)}
        eyebrow="Return Details"
        title={activeReturn?.returnId || "Return"}
        subtitle={activeReturn ? `Status: ${activeReturn.status}` : ""}
        maxWidthClass="max-w-xl"
        footer={
          <button
            type="button"
            onClick={() => setActiveReturn(null)}
            className="inline-flex flex-1 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-white transition-colors hover:bg-white/10"
          >
            Close
          </button>
        }
      >
        {activeReturn && (
          <div className="space-y-4">
            <DetailRow label="Customer" value={`${activeReturn.customerName || "—"} ${activeReturn.customerEmail ? `<${activeReturn.customerEmail}>` : ""}`} />
            <DetailRow label="Order ID" value={activeReturn.orderId?.orderId || activeReturn.orderId || "—"} />
            <DetailRow label="Reason" value={activeReturn.reason || "—"} />
            <DetailRow label="Description" value={activeReturn.description || "—"} />
            <DetailRow label="Total Amount" value={`$${(activeReturn.totalAmount || 0).toLocaleString()}`} />
            <DetailRow label="Refund Amount" value={`$${(activeReturn.refundAmount || 0).toLocaleString()}`} />
            <DetailRow label="Resolution" value={activeReturn.resolution || "—"} />
            <DetailRow label="Resolved At" value={activeReturn.resolvedAt ? new Date(activeReturn.resolvedAt).toLocaleString() : "—"} />
            <div className="pt-2">
              <label className={labelClass}>Update Status</label>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.filter((s) => s !== activeReturn.status).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setActiveReturn(null)
                      setStatusAction({ returnId: activeReturn._id || activeReturn.id, status: s })
                    }}
                    className={`${secondaryButton} text-xs`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
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

export default ReturnsPage
