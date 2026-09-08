"use client"

import React, { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { cn } from "@/lib/utils"

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function isToday(date: Date) {
  return isSameDay(date, new Date())
}

type NikeDatePickerProps = {
  value?: string
  onChange: (date: string) => void
  placeholder?: string
}

export function NikeDatePicker({ value, onChange, placeholder = "Select date" }: NikeDatePickerProps) {
  const [open, setOpen] = useState(false)
  const [viewDate, setViewDate] = useState(() => {
    if (value) return new Date(value)
    return new Date()
  })
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedDate = value ? new Date(value + "T00:00:00") : null

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const goToPrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1))
  }

  const goToNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1))
  }

  const handleDayClick = (day: number) => {
    const newDate = new Date(year, month, day)
    const yyyy = newDate.getFullYear()
    const mm = String(newDate.getMonth() + 1).padStart(2, "0")
    const dd = String(newDate.getDate()).padStart(2, "0")
    onChange(`${yyyy}-${mm}-${dd}`)
    setOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange("")
  }

  const days = []
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-9 w-9" />)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    const isSelected = selectedDate && isSameDay(date, selectedDate)
    const isTodayDate = isToday(date)

    days.push(
      <button
        key={day}
        type="button"
        onClick={() => handleDayClick(day)}
        className={cn(
          "flex h-9 w-9 items-center justify-center text-sm font-bold transition-all duration-150",
          isSelected
            ? "bg-lime-300 text-black"
            : isTodayDate
              ? "border border-lime-300/60 text-lime-300 hover:bg-lime-300/10"
              : "text-gray-300 hover:bg-white/10 hover:text-white"
        )}
      >
        {day}
      </button>
    )
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-12 w-full items-center justify-between rounded-xl border border-white/10 bg-black px-4 text-sm font-medium text-white outline-none transition-colors",
          "hover:border-white/20 focus:border-lime-300/50 focus:ring-2 focus:ring-lime-300/20"
        )}
      >
        <span className={cn(!value && "text-white/35")}>{value || placeholder}</span>
        <div className="flex items-center gap-1">
          {value && (
            <span
              role="button"
              onClick={handleClear}
              className="flex h-6 w-6 items-center justify-center rounded-md text-white/40 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X size={14} />
            </span>
          )}
          <svg className="h-4 w-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" />
            <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" strokeLinecap="round" />
            <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" strokeLinecap="round" />
            <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-[320px] overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0b] shadow-[0_24px_90px_rgba(0,0,0,0.55)]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 bg-[#090909] px-4 py-3">
            <button
              type="button"
              onClick={goToPrevMonth}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/70 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="text-sm font-black uppercase tracking-[0.12em] text-white">
              {MONTHS[month]} <span className="text-white/50">{year}</span>
            </div>
            <button
              type="button"
              onClick={goToNextMonth}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/70 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 border-b border-white/10 px-3 pt-3 pb-1">
            {DAYS.map((d) => (
              <div key={d} className="flex h-8 items-center justify-center text-[10px] font-black uppercase tracking-[0.14em] text-white/40">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1 px-3 py-2">
            {days}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-white/10 bg-[#090909] px-4 py-2.5">
            <button
              type="button"
              onClick={() => {
                const today = new Date()
                const yyyy = today.getFullYear()
                const mm = String(today.getMonth() + 1).padStart(2, "0")
                const dd = String(today.getDate()).padStart(2, "0")
                onChange(`${yyyy}-${mm}-${dd}`)
                setOpen(false)
              }}
              className="text-[10px] font-black uppercase tracking-[0.14em] text-lime-300 transition-colors hover:text-lime-200"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => {
                onChange("")
                setOpen(false)
              }}
              className="text-[10px] font-black uppercase tracking-[0.14em] text-white/50 transition-colors hover:text-white"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
