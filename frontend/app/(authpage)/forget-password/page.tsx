"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
  const [emailSent, setEmailSent] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const formik = useFormik({
    initialValues: {
      email: ""
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        // Replace this with your actual API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        setEmailSent(true)
        console.log("Password reset email sent to:", values.email)
        
      } catch (error) {
        setFieldError("email", "Unable to send reset email. Please try again.")
      } finally {
        setSubmitting(false)
      }
    }
  })

  const handleResend = async () => {
    setIsResending(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log("Reset email resent to:", formik.values.email)
    } catch (error) {
      formik.setFieldError("email", "Unable to resend email. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Stylish geometric background - CSS only for performance */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-green-100 to-transparent rounded-full blur-3xl opacity-30" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-tr from-teal-100 to-transparent rounded-full blur-3xl opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-100 to-transparent rounded-full blur-3xl opacity-20" />
        
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
                -45deg,
                transparent,
                transparent 100px,
                #000 100px,
                #000 102px
              )`
            }}
          />
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* LEFT SIDE - Support Message */}
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
              WE'VE<br />
              GOT<br />
              YOU.
            </h1>
            
            <p className="text-lg text-gray-600 max-w-md leading-relaxed mb-8">
              Forgot your password? No worries. Happens to the best athletes. Let's get you back in the game.
            </p>

            {/* Security Features */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Shield className="text-green-600" size={20} />
                </div>
                <div>
                  <h3 className="text-black font-bold text-sm mb-1">Secure Process</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">Your account security is our top priority</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Mail className="text-blue-600" size={20} />
                </div>
                <div>
                  <h3 className="text-black font-bold text-sm mb-1">Email Verification</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">We'll send a secure link to reset your password</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Reset Form */}
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
                    {emailSent ? "CHECK YOUR EMAIL" : "RESET YOUR PASSWORD"}
                  </CardTitle>
                  <p className="text-sm text-gray-600 text-center leading-relaxed">
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
                          className={`h-12 rounded-sm border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-black transition-colors ${
                            formik.touched.email && formik.errors.email ? 'border-red-500 focus-visible:border-red-500' : ''
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

                      <Button 
                        type="submit"
                        disabled={formik.isSubmitting}
                        className="w-full h-12 bg-black hover:bg-black/80 text-white rounded-sm font-medium transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {formik.isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            SENDING...
                          </div>
                        ) : (
                          <>
                            SEND RESET LINK
                            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                    </form>
                  ) : (
                    <div className="space-y-5">
                      {/* Success message */}
                      <div className="rounded-sm bg-green-50 border border-green-200 p-4">
                        <div className="flex gap-3">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                              <CheckCircle size={18} className="text-green-600" />
                            </div>
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-green-900 mb-1">Email sent successfully</h4>
                            <p className="text-green-700 text-xs leading-relaxed">
                              Please check your inbox and click the reset link. The link will expire in 1 hour.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Resend button */}
                      <Button
                        type="button"
                        onClick={handleResend}
                        disabled={isResending}
                        variant="outline"
                        className="w-full h-12 border-gray-300 hover:border-black hover:bg-gray-50 rounded-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isResending ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-600 rounded-full animate-spin" />
                            RESENDING...
                          </div>
                        ) : (
                          "RESEND EMAIL"
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Info box - only show if email not sent */}
                  {!emailSent && (
                    <div className="mt-6 rounded-sm bg-gray-50 border border-gray-200 p-4">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Mail size={16} className="text-blue-600" />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-gray-900 mb-1">Check your inbox</h4>
                          <p className="text-gray-600 text-xs leading-relaxed">
                            The reset link will expire in 1 hour. If you don't see the email, check your spam folder.
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
                    className="group flex items-center justify-center gap-2 text-gray-600 hover:text-black font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Sign In
                  </button>
                  
                  <p className="text-sm text-gray-600 text-center">
                    Don't have an account?{" "}
                    <button
                      onClick={() => router.push("/register")}
                      disabled={formik.isSubmitting || isResending}
                      className="font-medium text-black underline hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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