"use client"

import React from "react"
import { AlertTriangle, X } from "lucide-react"

type PageHeaderProps = {
  title: string
  label: string
  description: string
  action?: React.ReactNode
}

export const adminPanel =
  "rounded-2xl border border-white/10 bg-[#111111] shadow-[0_18px_60px_rgba(0,0,0,0.28)]"

export const adminTable =
  "w-full border-separate border-spacing-0 text-sm"

export const adminHeaderCell =
  "border-b border-white/10 px-4 py-3 text-left text-[11px] font-black uppercase tracking-[0.18em] text-white/40"

export const adminCell =
  "border-b border-white/10 px-4 py-4 align-middle"

export const iconButton =
  "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/65 transition-colors hover:border-white/20 hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-white/30"

export const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-black transition-colors hover:bg-lime-300 focus:outline-none focus:ring-2 focus:ring-white/30"

export const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white transition-colors hover:border-white/20 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"

export const fieldClass =
  "w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm font-medium text-white outline-none transition-colors placeholder:text-white/25 focus:border-white/40"

export const labelClass =
  "mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-white/45"

export const modalBackdrop =
  "fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-5"

export const modalShell =
  "relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0b] shadow-[0_24px_90px_rgba(0,0,0,0.55)]"

export const modalBodyClass =
  "min-h-0 flex-1 overflow-y-auto p-5 sm:p-7"

export const statusClass = (status?: string) => {
  const normalized = (status || "").toLowerCase()

  if (["active", "paid", "delivered", "in stock"].includes(normalized)) {
    return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
  }

  if (["pending", "processing", "shipped", "inactive"].includes(normalized)) {
    return "border-amber-300/30 bg-amber-300/10 text-amber-200"
  }

  if (["failed", "cancelled", "banned", "out of stock"].includes(normalized)) {
    return "border-red-400/30 bg-red-400/10 text-red-300"
  }

  return "border-white/10 bg-white/[0.06] text-white/60"
}

export function PageHeader({ title, label, description, action }: PageHeaderProps) {
  return (
    <header className="border-b border-white/10 bg-[#080808] px-5 pb-7 pt-14 md:px-8">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-[11px] font-black uppercase tracking-[0.24em] text-lime-300">
            {label}
          </p>
          <h1 className="text-5xl font-black uppercase leading-none tracking-normal text-white md:text-7xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-base font-medium text-white/48">
            {description}
          </p>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </header>
  )
}

export function PageBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1500px] px-5 py-7 md:px-8">
      {children}
    </div>
  )
}

export function StatusBadge({ status }: { status?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${statusClass(status)}`}>
      {status || "Unknown"}
    </span>
  )
}

export function MetricCard({
  icon,
  label,
  value,
  note,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  note?: React.ReactNode
}) {
  return (
    <div className={`${adminPanel} p-5 transition-colors hover:border-white/20`}>
      <div className="mb-5 flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-black">
          {icon}
        </div>
        {note ? <div className="text-xs font-black uppercase tracking-widest text-lime-300">{note}</div> : null}
      </div>
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/40">{label}</p>
      <div className="mt-2 text-3xl font-black tracking-normal text-white">{value}</div>
    </div>
  )
}

type AdminModalProps = {
  open: boolean
  title: string
  eyebrow?: string
  subtitle?: string
  onClose: () => void
  children: React.ReactNode
  footer?: React.ReactNode
  maxWidthClass?: string
}

export function AdminModal({
  open,
  title,
  eyebrow = "Admin Editor",
  subtitle,
  onClose,
  children,
  footer,
  maxWidthClass = "max-w-2xl",
}: AdminModalProps) {
  if (!open) return null

  return (
    <div className={modalBackdrop}>
      <div className={`${modalShell} ${maxWidthClass}`}>
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/45 text-white/55 transition-colors hover:border-white/25 hover:bg-white hover:text-black"
        >
          <X size={20} />
        </button>

        <div className="border-b border-white/10 bg-[#090909] px-5 py-5 sm:px-7 sm:py-6">
          <div className="mb-3 inline-flex rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white/78">
            {eyebrow}
          </div>
          <h2 className="max-w-[720px] text-3xl font-black uppercase leading-none tracking-normal text-white sm:text-4xl">
            {title}
          </h2>
          {subtitle ? <p className="mt-3 max-w-2xl text-sm font-semibold text-white/45">{subtitle}</p> : null}
        </div>

        <div className={modalBodyClass}>{children}</div>

        {footer ? (
          <div className="sticky bottom-0 z-10 flex flex-col gap-3 border-t border-white/10 bg-[#0b0b0b]/95 p-4 backdrop-blur-md sm:flex-row">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  )
}

type AdminConfirmDialogProps = {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onClose: () => void
  tone?: "danger" | "default"
}

export function AdminConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onClose,
  tone = "danger",
}: AdminConfirmDialogProps) {
  const confirmButtonClass =
    tone === "danger"
      ? "inline-flex flex-1 items-center justify-center rounded-xl bg-white px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-black transition-colors hover:bg-red-500 hover:text-white"
      : "inline-flex flex-1 items-center justify-center rounded-xl bg-white px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-black transition-colors hover:bg-lime-300"

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      eyebrow="Confirm Action"
      title={title}
      subtitle="Review this action before continuing."
      maxWidthClass="max-w-lg"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex flex-1 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-white transition-colors hover:bg-white/10"
          >
            {cancelLabel}
          </button>
          <button type="button" onClick={onConfirm} className={confirmButtonClass}>
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/14 text-red-300">
          <AlertTriangle size={22} />
        </div>
        <p className="text-sm font-semibold leading-7 text-white/72">{message}</p>
      </div>
    </AdminModal>
  )
}
