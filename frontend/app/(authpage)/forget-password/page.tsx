"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Mail, ArrowRight, ArrowLeft, Shield, AlertCircle, CheckCircle } from "lucide-react"

// Yup validation schema
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email address is required")
})

export default function ForgotPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [emailSent, setEmailSent] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const formik = useFormik({
    initialValues: {
      email: searchParams.get("email") || ""
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const res = await fetch("/api/password-reset/request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: values.email })
        });

        const data = await res.json();

        if (data.success) {
          setEmailSent(true);
        } else {
          setFieldError("email", data.message || "Unable to send reset email. Please try again.");
        }

      } catch (error) {
        setFieldError("email", "Unable to send reset email. Please try again.");
      } finally {
        setSubmitting(false);
      }
    }
  })

  const handleResend = async () => {
    setIsResending(true)
    try {
      const res = await fetch("/api/password-reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formik.values.email })
      });

      const data = await res.json();

      if (!data.success) {
        formik.setFieldError("email", data.message || "Unable to resend email. Please try again.");
      }
    } catch (error) {
      formik.setFieldError("email", "Unable to resend email. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-neutral-950 overflow-x-hidden">
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

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="hidden lg:flex flex-col animate-slideRight">
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
                  fill="#fff"
                />
              </svg>
            </div>

            <h1 className="text-7xl font-black text-white leading-[0.9] mb-8 tracking-tight">
              WE&apos;VE<br />
              GOT<br />
              YOU.
            </h1>

            <p className="text-lg text-neutral-400 max-w-md leading-relaxed mb-8">
              Forgot your password? No worries. Happens to the best athletes. Let&apos;s get you back in the game.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="text-green-400" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm mb-1">Secure Process</h3>
                  <p className="text-neutral-400 text-xs leading-relaxed">Your account security is our top priority</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="text-blue-400" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm mb-1">Email Verification</h3>
                  <p className="text-neutral-400 text-xs leading-relaxed">We&apos;ll send a secure link to reset your password</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-md mx-auto lg:mx-0 animate-slideUp">
            <div className="lg:hidden mb-8 flex justify-center">
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

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 blur-xl transform translate-y-2" />

              <Card className="relative border-[1.5px] border-neutral-800 shadow-2xl rounded-sm bg-neutral-900/95 backdrop-blur-sm">
                <CardHeader className="px-8 pt-10 pb-6 space-y-3">
                  <CardTitle className="text-2xl font-bold text-center text-white">
                    {emailSent ? "CHECK YOUR EMAIL" : "RESET YOUR PASSWORD"}
                  </CardTitle>
                  <p className="text-sm text-neutral-400 text-center leading-relaxed">
                    {emailSent
                      ? `We've sent password reset instructions to ${formik.values.email}`
                      : "Enter your email address and we'll send you instructions to reset your password."
                    }
                  </p>
                </CardHeader>

                <CardContent className="px-8 pb-8">
                  {!emailSent ? (
                    <form className="space-y-5" onSubmit={formik.handleSubmit}>
                      <div className="space-y-1.5">
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
                          <div className="flex items-center gap-1.5 text-red-400 text-xs mt-1.5">
                            <AlertCircle size={14} />
                            <span>{formik.errors.email}</span>
                          </div>
                        )}
                      </div>

                      <Button
                        type="submit"
                        disabled={formik.isSubmitting}
                        className="w-full h-12 bg-white hover:bg-neutral-200 text-black rounded-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-white/20 active:scale-[0.98]"
                      >
                        {formik.isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            SENDING...
                          </div>
                        ) : (
                          <>
                            SEND RESET LINK
                            <ArrowRight size={18} className="ml-2 transition-transform" />
                          </>
                        )}
                      </Button>
                    </form>
                  ) : (
                    <div className="space-y-5">
                      {/* Success message */}
                      <div className="rounded-sm bg-green-500/10 border border-green-500/20 p-4">
                        <div className="flex gap-3">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-green-500/15 flex items-center justify-center">
                              <CheckCircle size={18} className="text-green-400" />
                            </div>
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-white mb-1">OTP sent successfully</h4>
                            <p className="text-neutral-300 text-xs leading-relaxed">
                              Please check your inbox for the 6-digit OTP. The OTP will expire in 10 minutes.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Resend button */}
                      <Button
                        type="button"
                        onClick={() => router.push(`/otp-verification?email=${encodeURIComponent(formik.values.email)}`)}
                        disabled={isResending}
                        variant="outline"
                        className="w-full h-12 border-neutral-700 hover:border-white hover:bg-white/10 text-white rounded-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isResending ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            RESENDING...
                          </div>
                        ) : (
                          "ENTER OTP"
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Info box - only show if email not sent */}
                  {!emailSent && (
                    <div className="mt-6 rounded-sm bg-neutral-900/80 border border-neutral-800 p-4">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <Mail size={16} className="text-blue-400" />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-white mb-1">Check your inbox</h4>
                          <p className="text-neutral-400 text-xs leading-relaxed">
                            The reset link will expire in 1 hour. If you don&apos;t see the email, check your spam folder.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex flex-col gap-3 px-8 pb-8">
                  <button
                    onClick={() => router.push("/login")}
                    disabled={formik.isSubmitting || isResending}
                    className="group flex items-center justify-center gap-2 text-neutral-400 hover:text-white font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Sign In
                  </button>

                  <p className="text-sm text-neutral-400 text-center">
                    Don&apos;t have an account?{" "}
                    <button
                      onClick={() => router.push("/register")}
                      disabled={formik.isSubmitting || isResending}
                      className="font-medium text-white underline hover:text-neutral-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Join Us.
                    </button>
                  </p>
                </CardFooter>
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
