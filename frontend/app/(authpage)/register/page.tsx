"use client"

import { useRouter } from "next/navigation"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useState } from "react"
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

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onBlur={onBlur}
        disabled={disabled}
        className={`h-12 w-full rounded-sm border bg-white px-3 text-left text-sm flex items-center justify-between transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          error
            ? "border-red-500 focus:border-red-500"
            : isOpen
              ? "border-black"
              : "border-gray-300 hover:border-gray-400"
        } ${value ? "text-gray-900" : "text-gray-500"}`}
      >
        <span>{value ? formatDisplayDate(value) : "Date of Birth"}</span>
        <Calendar size={18} className="text-gray-500" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-30 mt-2 w-full bg-white border border-gray-200 rounded-sm shadow-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 hover:bg-gray-100 rounded-sm transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft size={18} className="text-gray-700" />
              </button>

              <div className="flex gap-2 flex-1 justify-center">
                <select
                  value={viewDate.getMonth()}
                  onChange={(e) => handleMonthChange(Number(e.target.value))}
                  className="text-sm font-semibold text-gray-900 bg-transparent border border-gray-200 rounded-sm px-2 py-1 cursor-pointer hover:border-gray-400 focus:outline-none focus:border-black"
                >
                  {MONTHS.map((month, idx) => (
                    <option key={month} value={idx}>{month.slice(0, 3)}</option>
                  ))}
                </select>
                <select
                  value={viewDate.getFullYear()}
                  onChange={(e) => handleYearChange(Number(e.target.value))}
                  className="text-sm font-semibold text-gray-900 bg-transparent border border-gray-200 rounded-sm px-2 py-1 cursor-pointer hover:border-gray-400 focus:outline-none focus:border-black"
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                disabled={viewDate.getFullYear() >= maxDate.getFullYear() && viewDate.getMonth() >= maxDate.getMonth()}
                className="p-1.5 hover:bg-gray-100 rounded-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Next month"
              >
                <ChevronRight size={18} className="text-gray-700" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map((day) => (
                <div key={day} className="text-center text-xs font-semibold text-gray-500 py-1">
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
                        ? "bg-black text-white"
                        : todayDate
                          ? "border border-black text-black hover:bg-gray-100"
                          : future
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {day}
                  </button>
                )
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Select your date of birth</span>
              <button
                type="button"
                onClick={() => {
                  onChange("")
                  setIsOpen(false)
                  onBlur()
                }}
                className="text-gray-700 hover:text-black font-medium underline"
              >
                Clear
              </button>
            </div>
          </div>
        </>
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
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Stylish geometric background - CSS only for performance */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-orange-100 to-transparent rounded-full blur-3xl opacity-30" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-100 to-transparent rounded-full blur-3xl opacity-30" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #000 1px, transparent 1px),
              linear-gradient(to bottom, #000 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }}
        />

        {/* Diagonal accent lines */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 100px,
                #000 100px,
                #000 102px
              )`
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* Left branding */}
          <div className="hidden lg:flex flex-col animate-slideRight">
            {/* Nike Swoosh */}
            <div className="mb-12">
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

            <h1 className="text-7xl font-black text-black leading-[0.9] mb-8 tracking-tight">
              JOIN<br />
              THE<br />
              CLUB.<br />
              GET<br />
              REWARDED.
            </h1>

            <p className="text-lg text-gray-600 max-w-md leading-relaxed">
              Create your Nike Member profile and get first access to the very best of Nike products, inspiration and community.
            </p>
          </div>

          {/* Register form */}
          <div className="w-full max-w-md mx-auto lg:mx-0 animate-slideUp">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <svg
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M23.906 8.809c-.209-.282-3.09-2.24-7.628-1.854-2.58.23-5.303 1.328-8.075 3.253-2.095 1.453-4.26 3.315-6.424 5.528-.354.361-.612.632-.777.822l-.02.022c-.063.071-.012.18.077.16 1.524-.346 4.382-.972 7.272-.972 1.627 0 3.298.165 4.972.49 4.52.876 8.59 2.925 9.063 3.148.18.086.367-.103.273-.277-.945-1.746-2.22-4.254-2.48-6.482-.26-2.227.29-3.5.747-3.838z"
                fill="#000"
              />
            </svg>
          </div>

          {/* Floating card with backdrop */}
          <div className="relative">
            {/* Subtle shadow/glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/10 blur-xl transform translate-y-2" />

            <Card className="relative border-[1.5px] border-gray-200 shadow-2xl rounded-sm bg-white/95 backdrop-blur-sm">
              <CardHeader className="px-8 pt-10 pb-6 space-y-3">
                <CardTitle className="text-2xl font-bold text-center">
                  BECOME A NIKE MEMBER
                </CardTitle>
                <p className="text-sm text-gray-600 text-center leading-relaxed">
                  Create your Nike Member profile and get first access to the very best of Nike products, inspiration and community.
                </p>
              </CardHeader>

              <CardContent className="px-8 pb-8">
                <form className="space-y-4" onSubmit={formik.handleSubmit}>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="sr-only">Email address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`h-12 rounded-sm border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-black transition-colors ${formik.touched.email && formik.errors.email ? 'border-red-500 focus-visible:border-red-500' : ''
                        }`}
                      placeholder="Email address"
                      disabled={formik.isSubmitting}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className="flex items-center gap-1.5 text-red-600 text-xs mt-1.5">
                        <AlertCircle size={14} />
                        <span>{formik.errors.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="sr-only">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`h-12 rounded-sm border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-black transition-colors pr-12 ${formik.touched.password && formik.errors.password ? 'border-red-500 focus-visible:border-red-500' : ''
                          }`}
                        placeholder="Password"
                        disabled={formik.isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={formik.isSubmitting}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 disabled:opacity-50"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {formik.touched.password && formik.errors.password && (
                      <div className="flex items-center gap-1.5 text-red-600 text-xs mt-1.5">
                        <AlertCircle size={14} />
                        <span>{formik.errors.password}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="firstName" className="sr-only">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formik.values.firstName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`h-12 rounded-sm border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-black transition-colors ${formik.touched.firstName && formik.errors.firstName ? 'border-red-500 focus-visible:border-red-500' : ''
                        }`}
                      placeholder="First Name"
                      disabled={formik.isSubmitting}
                    />
                    {formik.touched.firstName && formik.errors.firstName && (
                      <div className="flex items-center gap-1.5 text-red-600 text-xs mt-1.5">
                        <AlertCircle size={14} />
                        <span>{formik.errors.firstName}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="lastName" className="sr-only">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formik.values.lastName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`h-12 rounded-sm border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-black transition-colors ${formik.touched.lastName && formik.errors.lastName ? 'border-red-500 focus-visible:border-red-500' : ''
                        }`}
                      placeholder="Last Name"
                      disabled={formik.isSubmitting}
                    />
                    {formik.touched.lastName && formik.errors.lastName && (
                      <div className="flex items-center gap-1.5 text-red-600 text-xs mt-1.5">
                        <AlertCircle size={14} />
                        <span>{formik.errors.lastName}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="dateOfBirth" className="sr-only">Date of Birth</Label>
                    <CustomDatePicker
                      value={formik.values.dateOfBirth}
                      onChange={(value) => formik.setFieldValue("dateOfBirth", value)}
                      onBlur={() => formik.setFieldTouched("dateOfBirth", true)}
                      error={!!(formik.touched.dateOfBirth && formik.errors.dateOfBirth)}
                      disabled={formik.isSubmitting}
                    />
                    {formik.touched.dateOfBirth && formik.errors.dateOfBirth ? (
                      <div className="flex items-center gap-1.5 text-red-600 text-xs mt-1.5">
                        <AlertCircle size={14} />
                        <span>{formik.errors.dateOfBirth}</span>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 pt-1">
                        Get a Nike Member Reward every year on your Birthday.
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs text-gray-700">Gender</Label>
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
                        <div className={`h-12 border-[1.5px] rounded-sm text-sm font-medium flex items-center justify-center transition-colors ${formik.values.gender === "male"
                            ? "border-black bg-black text-white"
                            : "border-gray-300 hover:border-black text-gray-900"
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
                        <div className={`h-12 border-[1.5px] rounded-sm text-sm font-medium flex items-center justify-center transition-colors ${formik.values.gender === "female"
                            ? "border-black bg-black text-white"
                            : "border-gray-300 hover:border-black text-gray-900"
                          } ${formik.touched.gender && formik.errors.gender ? "border-red-500" : ""} disabled:opacity-50 disabled:cursor-not-allowed`}>
                          Female
                        </div>
                      </label>
                    </div>
                    {formik.touched.gender && formik.errors.gender && (
                      <div className="flex items-center gap-1.5 text-red-600 text-xs">
                        <AlertCircle size={14} />
                        <span>{formik.errors.gender}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-start gap-3 py-2">
                    <input
                      type="checkbox"
                      id="emailUpdates"
                      name="emailUpdates"
                      checked={formik.values.emailUpdates}
                      onChange={formik.handleChange}
                      className="w-5 h-5 mt-0.5 rounded-sm border-gray-300 flex-shrink-0"
                      disabled={formik.isSubmitting}
                    />
                    <label htmlFor="emailUpdates" className="text-xs text-gray-600 leading-relaxed cursor-pointer">
                      Sign up for emails to get updates from Nike on products, offers and your Member benefits
                    </label>
                  </div>

                  <p className="text-xs text-gray-500 text-center leading-relaxed pt-2">
                    By creating an account, you agree to Nike&apos;s{" "}
                    <a href="#" className="underline hover:text-black">Privacy Policy</a>
                    {" "}and{" "}
                    <a href="#" className="underline hover:text-black">Terms of Use</a>.
                  </p>

                  <Button
                    type="submit"
                    disabled={formik.isSubmitting}
                    className="w-full h-12 bg-black hover:bg-black/80 text-white rounded-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formik.isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        JOINING...
                      </div>
                    ) : (
                      "JOIN US"
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Already a Member?{" "}
                    <button
                      onClick={() => router.push("/login")}
                      className="font-medium text-black underline hover:text-gray-600 transition-colors"
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

        .animate-slideUp {
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .animate-slideRight {
          animation: slideRight 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  )
}
