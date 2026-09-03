"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Mail, ArrowLeft, RefreshCw } from "lucide-react"
import toastr from "toastr"
import "toastr/build/toastr.min.css"

toastr.options = {
  closeButton: true,
  debug: false,
  newestOnTop: true,
  progressBar: false,
  positionClass: "toast-top-center",
  preventDuplicates: false,
  showDuration: 300,
  hideDuration: 1000,
  timeOut: 3000,
  extendedTimeOut: 1000,
}

const validationSchema = Yup.object({
  otp: Yup.string()
    .length(6, "OTP must be exactly 6 digits")
    .matches(/^[0-9]+$/, "OTP must contain only numbers")
    .required("OTP is required")
})

export default function OtpVerificationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const [isResending, setIsResending] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  const showToast = (type, message, title) => {
    toastr.remove()
    setTimeout(() => {
      if (type === "success") toastr.success(message, title || "")
      else toastr.error(message, title || "")
    }, 10)
  }

  const formik = useFormik({
    initialValues: {
      otp: ""
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await fetch("/api/password-reset/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: values.otp })
        })

        const data = await res.json()

        if (data.success) {
          setIsVerified(true)
          showToast("success", "OTP verified successfully!", "Success")
          setTimeout(() => {
            router.push(`/reset-password?token=${data.token}&email=${encodeURIComponent(email)}`)
          }, 1000)
        } else {
          showToast("error", data.message || "Invalid OTP. Please try again.", "Error")
        }
      } catch {
        showToast("error", "Something went wrong. Please try again.", "Error")
      } finally {
        setSubmitting(false)
      }
    }
  })

  const handleResend = async () => {
    setIsResending(true)
    try {
      const res = await fetch("/api/password-reset/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (data.success) {
        showToast("success", "OTP resent successfully!", "Success")
        formik.setFieldValue("otp", "")
      } else {
        showToast("error", data.message || "Failed to resend OTP.", "Error")
      }
    } catch {
      showToast("error", "Failed to resend OTP. Please try again.", "Error")
    } finally {
      setIsResending(false)
    }
  }

  const NikeBackground = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black" />
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
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
    </div>
  )

  if (!email) {
    return (
      <div className="min-h-screen w-full bg-neutral-950 flex items-center justify-center overflow-hidden">
        <NikeBackground />
        <div className="relative z-10 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-neutral-400">No email provided. Please go back to the forgot password page.</p>
          <Button
            onClick={() => router.push("/forget-password")}
            className="mt-4 bg-white text-black hover:bg-red-500 hover:text-white"
          >
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-neutral-950 overflow-x-hidden">
      <NikeBackground />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-md mx-auto">
          <div className="relative animate-fade-in-delayed">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 blur-xl transform translate-y-2" />
            <Card className="relative border-[1.5px] border-neutral-800 shadow-2xl rounded-sm bg-neutral-900/95 backdrop-blur-sm">
              <CardHeader className="px-8 pt-10 pb-6 space-y-3">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-center text-white">
                  ENTER OTP
                </CardTitle>
                <p className="text-sm text-neutral-400 text-center leading-relaxed">
                  We've sent a 6-digit OTP to {email}
                </p>
              </CardHeader>

                      <CardContent className="px-8 pb-8">
                {isVerified ? (
                  <div className="text-center space-y-4">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-6 h-6 text-emerald-500" />
                    </div>
                    <p className="text-neutral-300">OTP verified! Redirecting to reset password...</p>
                  </div>
                ) : (
                  <>
                    <form onSubmit={formik.handleSubmit} className="space-y-5">
                      <div className="space-y-1.5">
                        <Label htmlFor="otp" className="sr-only">OTP</Label>
                        <Input
                          id="otp"
                          name="otp"
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={formik.values.otp}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`h-14 rounded-sm border-neutral-700 bg-neutral-800 text-white text-center text-3xl font-bold placeholder:text-neutral-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white transition-all duration-200 ${formik.touched.otp && formik.errors.otp ? 'border-red-500 focus-visible:border-red-500' : ''}`}
                          placeholder="______"
                          disabled={formik.isSubmitting}
                        />
                        {formik.touched.otp && formik.errors.otp && (
                          <div className="flex items-center gap-1.5 text-red-400 text-xs mt-1.5">
                            <AlertCircle size={14} />
                            <span>{formik.errors.otp}</span>
                          </div>
                        )}
                      </div>

                      <Button
                        type="submit"
                        disabled={formik.isSubmitting || !formik.values.otp}
                        className="w-full h-12 bg-white hover:bg-red-500 text-black hover:text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {formik.isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            VERIFYING...
                          </div>
                        ) : (
                          "VERIFY OTP"
                        )}
                      </Button>
                    </form>

                    <div className="pt-5 border-t border-neutral-800">
                      <Button
                        type="button"
                        onClick={handleResend}
                        disabled={isResending}
                        variant="ghost"
                        className="w-full text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-50"
                      >
                        {isResending ? (
                          <div className="flex items-center gap-2">
                            <RefreshCw size={16} className="animate-spin" />
                            RESENDING...
                          </div>
                        ) : (
                          "RESEND OTP"
                        )}
                      </Button>
                    </div>

                    <div className="pt-3 text-center">
                      <button
                        type="button"
                        onClick={() => router.push("/forget-password")}
                        className="text-sm text-neutral-500 hover:text-white transition-colors duration-200 hover:underline flex items-center justify-center gap-2 mx-auto"
                      >
                        <ArrowLeft size={16} />
                        Back to Forgot Password
                      </button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
