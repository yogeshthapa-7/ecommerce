"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AlertCircle, Eye, EyeOff, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import toastr from "toastr"
import "toastr/build/toastr.min.css"
import { createPortal } from "react-dom"

// Configure toastr options
toastr.options = {
  closeButton: true,
  debug: false,
  newestOnTop: true,
  progressBar: false,
  positionClass: "toast-top-center",
  preventDuplicates: true,
  showDuration: 300,
  hideDuration: 1000,
  timeOut: 3000,
  extendedTimeOut: 1000,
}

const showToast = (type: 'success' | 'error', message: string, title?: string) => {
  if (toastr) {
    toastr.remove()
    setTimeout(() => {
      if (type === 'success') {
        toastr.success(message, title || '')
      } else {
        toastr.error(message, title || '')
      }
    }, 10)
  }
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

const COUNTRY_CODES = [
  { code: "", name: "Select Country" },
  { code: "+1", name: "Canada" },
  { code: "+44", name: "United Kingdom" },
  { code: "+91", name: "India" },
  { code: "+977", name: "Nepal" },
  { code: "+61", name: "Australia" },
  { code: "+86", name: "China" },
  { code: "+49", name: "Germany" },
  { code: "+33", name: "France" },
  { code: "+81", name: "Japan" },
  { code: "+82", name: "South Korea" },
  { code: "+55", name: "Brazil" },
  { code: "+52", name: "Mexico" },
  { code: "+7", name: "Russia" },
  { code: "+971", name: "UAE" },
  { code: "+65", name: "Singapore" },
  { code: "+60", name: "Malaysia" },
  { code: "+63", name: "Philippines" },
  { code: "+64", name: "New Zealand" },
  { code: "+27", name: "South Africa" },
  { code: "+234", name: "Nigeria" },
]

function CustomDatePicker({
  value,
  onChange,
  onBlur,
  error,
  disabled,
}: {
  value: string
  onChange: (date: string) => void
  onBlur: () => void
  error?: boolean
  disabled?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [viewDate, setViewDate] = useState(() => {
    if (value) return new Date(value)
    const today = new Date()
    return new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
  })

  const selectedDate = value ? new Date(value) : null
  const today = new Date()
  const maxDate = new Date()

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
  }

  const handleDateSelect = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
    if (newDate > maxDate) return
    const formatted = newDate.toISOString().split('T')[0]
    onChange(formatted)
    setIsOpen(false)
    onBlur()
  }

  const handleMonthChange = (monthIndex: number) => {
    setViewDate(new Date(viewDate.getFullYear(), monthIndex, 1))
  }

  const handleYearChange = (year: number) => {
    setViewDate(new Date(year, viewDate.getMonth(), 1))
  }

  const yearOptions = []
  const startYear = maxDate.getFullYear()
  for (let y = startYear; y >= startYear - 100; y--) {
    yearOptions.push(y)
  }

  const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth())
  const firstDay = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth())
  const days: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)

  const formatDisplayDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const isSelected = (day: number) => {
    if (!selectedDate) return false
    return (
      selectedDate.getFullYear() === viewDate.getFullYear() &&
      selectedDate.getMonth() === viewDate.getMonth() &&
      selectedDate.getDate() === day
    )
  }

  const isToday = (day: number) => {
    return (
      today.getFullYear() === viewDate.getFullYear() &&
      today.getMonth() === viewDate.getMonth() &&
      today.getDate() === day
    )
  }

  const isFuture = (day: number) => {
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
    return d > maxDate
  }

  const buttonRef = useRef<HTMLButtonElement>(null);

  const getDropdownStyle = (): React.CSSProperties => {
    if (!buttonRef.current) return {};
    const rect = buttonRef.current.getBoundingClientRect();
    return {
      position: 'fixed',
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
      zIndex: 99999,
    };
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onBlur={onBlur}
        disabled={disabled}
        className={`h-12 w-full rounded-sm border bg-neutral-800 px-3 text-left text-sm flex items-center justify-between transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          error
            ? "border-red-500 focus:border-red-500"
            : isOpen
              ? "border-white"
              : "border-neutral-700 hover:border-neutral-600"
        } ${value ? "text-white" : "text-neutral-500"}`}
      >
        <span>{value ? formatDisplayDate(value) : "Date of Birth"}</span>
        <Calendar size={18} className="text-neutral-500" />
      </button>

      {isOpen && createPortal(
        <>
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="bg-neutral-900 border border-neutral-700 rounded-sm shadow-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-200"
            style={getDropdownStyle()}
          >
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 hover:bg-neutral-800 rounded-sm transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft size={18} className="text-neutral-300" />
              </button>

              <div className="flex gap-2 flex-1 justify-center">
                <select
                  value={viewDate.getMonth()}
                  onChange={(e) => handleMonthChange(Number(e.target.value))}
                  className="text-sm font-semibold text-white bg-neutral-800 border border-neutral-700 rounded-sm px-2 py-1 cursor-pointer hover:border-neutral-600 focus:outline-none focus:border-white"
                >
                  {MONTHS.map((month, idx) => (
                    <option key={month} value={idx} className="bg-neutral-800 text-white">{month.slice(0, 3)}</option>
                  ))}
                </select>
                <select
                  value={viewDate.getFullYear()}
                  onChange={(e) => handleYearChange(Number(e.target.value))}
                  className="text-sm font-semibold text-white bg-neutral-800 border border-neutral-700 rounded-sm px-2 py-1 cursor-pointer hover:border-neutral-600 focus:outline-none focus:border-white"
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year} className="bg-neutral-800 text-white">{year}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                disabled={viewDate.getFullYear() >= maxDate.getFullYear() && viewDate.getMonth() >= maxDate.getMonth()}
                className="p-1.5 hover:bg-neutral-800 rounded-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Next month"
              >
                <ChevronRight size={18} className="text-neutral-300" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map((day) => (
                <div key={day} className="text-center text-xs font-semibold text-neutral-500 py-1">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} />
                }
                const selected = isSelected(day)
                const todayDate = isToday(day)
                const future = isFuture(day)
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDateSelect(day)}
                    disabled={future}
                    className={`aspect-square text-sm font-medium rounded-sm transition-all flex items-center justify-center ${
                      selected
                        ? "bg-white text-black"
                        : todayDate
                          ? "border border-white text-white hover:bg-neutral-800"
                          : future
                            ? "text-neutral-700 cursor-not-allowed"
                            : "text-neutral-300 hover:bg-neutral-800"
                    }`}
                  >
                    {day}
                  </button>
                )
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
              <span>Select your date of birth</span>
              <button
                type="button"
                onClick={() => {
                  onChange("")
                  setIsOpen(false)
                  onBlur()
                }}
                className="text-neutral-300 hover:text-white font-medium underline"
              >
                Clear
              </button>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  )
}

// Yup validation schema
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email address is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase, and number"
    )
    .required("Password is required"),
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .matches(/^[a-zA-Z\s-']+$/, "First name contains invalid characters")
    .required("First name is required"),
  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .matches(/^[a-zA-Z\s-']+$/, "Last name contains invalid characters")
    .required("Last name is required"),
  dateOfBirth: Yup.date()
    .max(new Date(), "Date of birth cannot be in the future")
    .test("age", "You must be at least 13 years old", function (value) {
      if (!value) return false
      const today = new Date()
      const birthDate = new Date(value)
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      return age >= 13
    })
    .required("Date of birth is required"),
  gender: Yup.string()
    .oneOf(["male", "female"], "Please select your gender")
    .required("Please select your gender"),
  countryCode: Yup.string()
    .required("Country code is required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{7,15}$/, "Please enter a valid phone number (7-15 digits)")
    .required("Phone number is required"),
  emailUpdates: Yup.boolean()
})

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      countryCode: "+1",
      phoneNumber: "",
      emailUpdates: false
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: values.email,
              password: values.password,
              firstName: values.firstName,
              lastName: values.lastName,
              dateOfBirth: values.dateOfBirth,
              gender: values.gender,
              countryCode: values.countryCode,
              phone: values.phoneNumber,
            }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          showToast('error', data.message || "Registration failed. Please try again.", "Registration Failed");
          setSubmitting(false);
          return;
        }

        // Save credentials for login auto-fill
        localStorage.setItem(
          "registeredUser",
          JSON.stringify({
            email: values.email,
            password: values.password,
          })
        );

        // Reset form and show success
        resetForm()

        showToast('success', "Account created successfully! Please sign in.", "Welcome!");

        // Redirect to login after a short delay
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      } catch {
        showToast('error', "Server error. Please try again.", "Error");
      } finally {
        setSubmitting(false);
      }
    }
  })

  return (
    <div className="min-h-screen w-full bg-neutral-950 overflow-x-hidden">
      {/* Dark Nike-style background with transparent product images */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Base dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black" />

        {/* Transparent product images - scattered in background */}
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] opacity-[0.07]">
          <img src="/assets/nike-hero/nike1-transparent.png" alt="" className="w-full h-full object-contain" />
        </div>
        <div className="absolute top-1/3 -left-32 w-[400px] h-[400px] opacity-[0.05]">
          <img src="/assets/nike-hero/nike2-transparent.png" alt="" className="w-full h-full object-contain" />
        </div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] opacity-[0.04]">
          <img src="/assets/nike-hero/nike3-transparent.png" alt="" className="w-full h-full object-contain" />
        </div>
        <div className="absolute top-2/3 -right-20 w-[350px] h-[350px] opacity-[0.06]">
          <img src="/assets/nike-hero/nike6-transparent.png" alt="" className="w-full h-full object-contain" />
        </div>

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }}
        />

        {/* Gradient accent orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-6 scroll-smooth">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* Left branding */}
          <div className="hidden lg:flex flex-col animate-slideRight">
            {/* Nike Swoosh */}
            <div className="mb-12 animate-fade-in">
              <svg
                width="78"
                height="78"
                viewBox="0 0 24 24"
                fill="none"
                className="transform -rotate-12"
              >
                <path
                  d="M23.906 8.809c-.209-.282-3.09-2.24-7.628-1.854-2.58.23-5.303 1.328-8.075 3.253-2.095 1.453-4.26 3.315-6.424 5.528-.354.361-.612.632-.777.822l-.02.022c-.063.071-.012.18.077.16 1.524-.346 4.382-.972 7.272-.972 1.627 0 3.298.165 4.972.49 4.52.876 8.59 2.925 9.063 3.148.18.086.367-.103.273-.277-.945-1.746-2.22-4.254-2.48-6.482-.26-2.227.29-3.5.747-3.838z"
                  fill="#000"
                />
              </svg>
            </div>

            <h1 className="text-7xl font-black text-white leading-[0.9] mb-8 tracking-tight animate-fade-in-delayed">
              JOIN<br />
              THE<br />
              CLUB.<br />
              GET<br />
              REWARDED.
            </h1>

            <p className="text-lg text-neutral-400 max-w-md leading-relaxed animate-fade-in-delayed-more">
              Create your Nike Member profile and get first access to the very best of Nike products, inspiration and community.
            </p>
          </div>

          {/* Register form */}
          <div className="w-full max-w-md mx-auto lg:mx-0 animate-slideUp">
            {/* Mobile logo */}
            <div className="lg:hidden mb-8 flex justify-center animate-fade-in">
              <svg
                width="60"
                height="60"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M23.906 8.809c-.209-.282-3.09-2.24-7.628-1.854-2.58.23-5.303 1.328-8.075 3.253-2.095 1.453-4.26 3.315-6.424 5.528-.354.361-.612.632-.777.822l-.02.022c-.063.071-.012.18.077.16 1.524-.346 4.382-.972 7.272-.972 1.627 0 3.298.165 4.972.49 4.52.876 8.59 2.925 9.063 3.148.18.086.367-.103.273-.277-.945-1.746-2.22-4.254-2.48-6.482-.26-2.227.29-3.5.747-3.838z"
                  fill="#fff"
                />
              </svg>
            </div>

            {/* Floating card with backdrop */}
            <div className="relative animate-fade-in-delayed">
              {/* Subtle shadow/glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 blur-xl transform translate-y-2" />

              <Card className="relative border-[1.5px] border-neutral-800 shadow-2xl rounded-sm bg-neutral-900/95 backdrop-blur-sm transition-all duration-300 hover:shadow-3xl">
                <CardHeader className="px-8 pt-10 pb-6 space-y-3">
                  <CardTitle className="text-2xl font-bold text-center text-white animate-fade-in-delayed-more">
                    BECOME A NIKE MEMBER
                  </CardTitle>
                  <p className="text-sm text-neutral-400 text-center leading-relaxed">
                    Create your Nike Member profile and get first access to the very best of Nike products, inspiration and community.
                  </p>
                </CardHeader>

                <CardContent className="px-8 pb-8">
                  <form className="space-y-4" onSubmit={formik.handleSubmit}>
                    <div className="space-y-1.5 animate-stagger" style={{ animationDelay: '0.05s' }}>
                      <Label htmlFor="email" className="sr-only">Email address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`h-12 rounded-sm border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white transition-all duration-200 ${formik.touched.email && formik.errors.email ? 'border-red-500 focus-visible:border-red-500' : ''
                          }`}
                        placeholder="Email address"
                        disabled={formik.isSubmitting}
                      />
                      {formik.touched.email && formik.errors.email && (
                        <div className="flex items-center gap-1.5 text-red-400 text-xs mt-1.5 animate-fade-in">
                          <AlertCircle size={14} />
                          <span>{formik.errors.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5 animate-stagger" style={{ animationDelay: '0.1s' }}>
                      <Label htmlFor="password" className="sr-only">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formik.values.password}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`h-12 rounded-sm border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white transition-all duration-200 pr-12 ${formik.touched.password && formik.errors.password ? 'border-red-500 focus-visible:border-red-500' : ''
                            }`}
                          placeholder="Password"
                          disabled={formik.isSubmitting}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={formik.isSubmitting}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white disabled:opacity-50 transition-all duration-200 hover:scale-110"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {formik.touched.password && formik.errors.password && (
                        <div className="flex items-center gap-1.5 text-red-400 text-xs mt-1.5 animate-fade-in">
                          <AlertCircle size={14} />
                          <span>{formik.errors.password}</span>
                        </div>
                      )}
                    </div>

                   <div className="space-y-1.5 animate-stagger" style={{ animationDelay: '0.15s' }}>
                     <Label htmlFor="firstName" className="sr-only">First Name</Label>
                     <Input
                       id="firstName"
                       name="firstName"
                       type="text"
                       value={formik.values.firstName}
                       onChange={formik.handleChange}
                       onBlur={formik.handleBlur}
                       className={`h-12 rounded-sm border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white transition-all duration-200 ${formik.touched.firstName && formik.errors.firstName ? 'border-red-500 focus-visible:border-red-500' : ''
                         }`}
                       placeholder="First Name"
                       disabled={formik.isSubmitting}
                     />
                     {formik.touched.firstName && formik.errors.firstName && (
                       <div className="flex items-center gap-1.5 text-red-400 text-xs mt-1.5 animate-fade-in">
                         <AlertCircle size={14} />
                         <span>{formik.errors.firstName}</span>
                       </div>
                     )}
                   </div>

                   <div className="space-y-1.5 animate-stagger" style={{ animationDelay: '0.2s' }}>
                     <Label htmlFor="lastName" className="sr-only">Last Name</Label>
                     <Input
                       id="lastName"
                       name="lastName"
                       type="text"
                       value={formik.values.lastName}
                       onChange={formik.handleChange}
                       onBlur={formik.handleBlur}
                       className={`h-12 rounded-sm border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white transition-all duration-200 ${formik.touched.lastName && formik.errors.lastName ? 'border-red-500 focus-visible:border-red-500' : ''
                         }`}
                       placeholder="Last Name"
                       disabled={formik.isSubmitting}
                     />
                     {formik.touched.lastName && formik.errors.lastName && (
                       <div className="flex items-center gap-1.5 text-red-400 text-xs mt-1.5 animate-fade-in">
                         <AlertCircle size={14} />
                         <span>{formik.errors.lastName}</span>
                       </div>
                     )}
                   </div>

                   <div className="space-y-1.5 animate-stagger" style={{ animationDelay: '0.25s' }}>
                     <Label htmlFor="dateOfBirth" className="sr-only">Date of Birth</Label>
                     <CustomDatePicker
                       value={formik.values.dateOfBirth}
                       onChange={(value) => formik.setFieldValue("dateOfBirth", value)}
                       onBlur={() => formik.setFieldTouched("dateOfBirth", true)}
                       error={!!(formik.touched.dateOfBirth && formik.errors.dateOfBirth)}
                       disabled={formik.isSubmitting}
                     />
                     {formik.touched.dateOfBirth && formik.errors.dateOfBirth ? (
                       <div className="flex items-center gap-1.5 text-red-400 text-xs mt-1.5 animate-fade-in">
                         <AlertCircle size={14} />
                         <span>{formik.errors.dateOfBirth}</span>
                       </div>
                     ) : (
                       <p className="text-xs text-neutral-500 pt-1">
                         Get a Nike Member Reward every year on your Birthday.
                       </p>
                     )}
                   </div>

                   <div className="space-y-3 animate-stagger" style={{ animationDelay: '0.3s' }}>
                     <Label className="text-xs text-neutral-400">Gender</Label>
                     <div className="grid grid-cols-2 gap-3">
                       <label className="cursor-pointer">
                         <input
                           type="radio"
                           name="gender"
                           value="male"
                           checked={formik.values.gender === "male"}
                           onChange={(e) => {
                             formik.handleChange(e)
                             formik.setFieldTouched("gender", true)
                           }}
                           className="sr-only"
                           disabled={formik.isSubmitting}
                         />
                         <div className={`h-12 border-[1.5px] rounded-sm text-sm font-medium flex items-center justify-center transition-all duration-200 ${formik.values.gender === "male"
                             ? "border-white bg-white text-black"
                             : "border-neutral-700 hover:border-white text-neutral-300"
                           } ${formik.touched.gender && formik.errors.gender ? "border-red-500" : ""} disabled:opacity-50 disabled:cursor-not-allowed`}>
                           Male
                         </div>
                       </label>
                       <label className="cursor-pointer">
                         <input
                           type="radio"
                           name="gender"
                           value="female"
                           checked={formik.values.gender === "female"}
                           onChange={(e) => {
                             formik.handleChange(e)
                             formik.setFieldTouched("gender", true)
                           }}
                           className="sr-only"
                           disabled={formik.isSubmitting}
                         />
                         <div className={`h-12 border-[1.5px] rounded-sm text-sm font-medium flex items-center justify-center transition-all duration-200 ${formik.values.gender === "female"
                             ? "border-white bg-white text-black"
                             : "border-neutral-700 hover:border-white text-neutral-300"
                           } ${formik.touched.gender && formik.errors.gender ? "border-red-500" : ""} disabled:opacity-50 disabled:cursor-not-allowed`}>
                           Female
                         </div>
                       </label>
                     </div>
                     {formik.touched.gender && formik.errors.gender && (
                       <div className="flex items-center gap-1.5 text-red-400 text-xs animate-fade-in">
                         <AlertCircle size={14} />
                         <span>{formik.errors.gender}</span>
                       </div>
                      )}
                    </div>

                    <div className="space-y-1.5 animate-stagger" style={{ animationDelay: '0.35s' }}>
                      <Label className="text-xs text-neutral-400">Phone Number</Label>
                      <div className="flex gap-2">
                        <select
                          name="countryCode"
                          value={formik.values.countryCode}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`h-12 w-32 rounded-sm border bg-neutral-800 px-2 text-sm text-white transition-all duration-200 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white ${formik.touched.countryCode && formik.errors.countryCode ? 'border-red-500' : 'border-neutral-700'}`}
                          disabled={formik.isSubmitting}
                        >
                          {COUNTRY_CODES.map((c) => (
                            <option key={`${c.code}-${c.name}`} value={c.code} className="bg-neutral-800 text-white">
                              {c.name} ({c.code})
                            </option>
                          ))}
                        </select>
                        <Input
                          id="phoneNumber"
                          name="phoneNumber"
                          type="tel"
                          value={formik.values.phoneNumber}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`h-12 rounded-sm border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white transition-all duration-200 flex-1 ${formik.touched.phoneNumber && formik.errors.phoneNumber ? 'border-red-500 focus-visible:border-red-500' : ''
                            }`}
                          placeholder="Phone number"
                          disabled={formik.isSubmitting}
                        />
                      </div>
                      {(formik.touched.countryCode && formik.errors.countryCode) || (formik.touched.phoneNumber && formik.errors.phoneNumber) ? (
                        <div className="flex items-center gap-1.5 text-red-400 text-xs mt-1.5 animate-fade-in">
                          <AlertCircle size={14} />
                          <span>{formik.errors.countryCode || formik.errors.phoneNumber}</span>
                        </div>
                      ) : (
                        <p className="text-xs text-neutral-500 pt-1">
                            Used for order updates and delivery notifications.
                          </p>
                      )}
                    </div>

                    <div className="flex items-start gap-3 py-2 animate-stagger" style={{ animationDelay: '0.4s' }}>
                     <input
                       type="checkbox"
                       id="emailUpdates"
                       name="emailUpdates"
                       checked={formik.values.emailUpdates}
                       onChange={formik.handleChange}
                       className="w-5 h-5 mt-0.5 rounded-sm border-neutral-600 bg-neutral-800 transition-all duration-200 hover:border-neutral-500"
                       disabled={formik.isSubmitting}
                     />
                     <label htmlFor="emailUpdates" className="text-xs text-neutral-400 leading-relaxed cursor-pointer transition-colors duration-200 hover:text-white">
                       Sign up for emails to get updates from Nike on products, offers and your Member benefits
                     </label>
                   </div>

                   <p className="text-xs text-neutral-400 text-center leading-relaxed pt-2 animate-stagger" style={{ animationDelay: '0.45s' }}>
                     By creating an account, you agree to Nike&apos;s{" "}
                     <a href="#" className="underline hover:text-white transition-colors duration-200 hover:underline-offset-2">Privacy Policy</a>
                     {" "}and{" "}
                     <a href="#" className="underline hover:text-white transition-colors duration-200 hover:underline-offset-2">Terms of Use</a>.
                   </p>

                   <Button
                     type="submit"
                     disabled={formik.isSubmitting}
                     className="w-full h-12 bg-white hover:bg-neutral-200 text-black rounded-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-white/20 active:scale-[0.98] animate-stagger"
                     style={{ animationDelay: '0.5s' }}
                   >
                     {formik.isSubmitting ? (
                       <div className="flex items-center gap-2">
                         <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                         JOINING...
                       </div>
                     ) : (
                       "JOIN US"
                     )}
                   </Button>
                 </form>

                 <div className="mt-6 text-center animate-stagger" style={{ animationDelay: '0.55s' }}>
                   <p className="text-sm text-neutral-300">
                     Already a Member?{" "}
                     <button
                       onClick={() => router.push("/login")}
                       className="font-medium text-white underline hover:text-neutral-300 transition-all duration-200 hover:underline-offset-2"
                     >
                       Sign In.
                     </button>
                   </p>
                 </div>
               </CardContent>
             </Card>
           </div>
         </div>
       </div>
     </div>

     <style jsx>{`
       html {
         scroll-behavior: smooth;
       }

       @keyframes slideUp {
         from { 
           opacity: 0; 
           transform: translateY(20px); 
         }
         to { 
           opacity: 1; 
           transform: translateY(0); 
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

       @keyframes fadeIn {
         from { 
           opacity: 0; 
           transform: translateY(10px); 
         }
         to { 
           opacity: 1; 
           transform: translateY(0); 
         }
       }

       @keyframes float {
         0%, 100% {
           transform: translate(0, 0) scale(1);
         }
         33% {
           transform: translate(30px, -30px) scale(1.05);
         }
         66% {
           transform: translate(-20px, 20px) scale(0.95);
         }
       }

       @keyframes floatDelayed {
         0%, 100% {
           transform: translate(0, 0) scale(1);
         }
         33% {
           transform: translate(-30px, 20px) scale(0.95);
         }
         66% {
           transform: translate(20px, -30px) scale(1.05);
         }
       }

       .animate-slideUp {
         animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
       }

       .animate-slideRight {
         animation: slideRight 0.8s cubic-bezier(0.16, 1, 0.3, 1);
       }

       .animate-fade-in {
         animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
         opacity: 0;
       }

       .animate-fade-in-delayed {
         animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
         opacity: 0;
       }

       .animate-fade-in-delayed-more {
         animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
         opacity: 0;
       }

       .animate-float {
         animation: float 20s ease-in-out infinite;
       }

       .animate-float-delayed {
         animation: floatDelayed 25s ease-in-out infinite;
       }

       .animate-stagger {
         animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
         opacity: 0;
       }
      `}</style>
    </div>
  )
}
