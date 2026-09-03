"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
import { Lock, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react"
import toastr from "toastr"
import "toastr/build/toastr.min.css"

// Configure toastr
toastr.options = {
    closeButton: true,
    debug: false,
    newestOnTop: true,
    progressBar: false,
    positionClass: "toast-top-center",
    preventDuplicates: false,
    showDuration: 300,
    hideDuration: 0,
    timeOut: 3000,
    extendedTimeOut: 1000,
}

// Validation schema
const validationSchema = Yup.object({
    newPassword: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password must contain uppercase, lowercase, and number"
        )
        .required("New password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords must match")
        .required("Confirm password is required"),
})

export default function ResetPasswordPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get("token")
    const email = searchParams.get("email")

    const [isValidToken, setIsValidToken] = useState<boolean | null>(null)
    const [isSuccess, setIsSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    useEffect(() => {
        if (!token) {
            setIsValidToken(false)
            toastr.error("Invalid reset link", "Error")
        } else {
            setIsValidToken(true)
        }
    }, [token])

    const formik = useFormik({
        initialValues: {
            newPassword: "",
            confirmPassword: "",
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const res = await fetch("/api/password-reset/reset", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        token: token,
                        email: email,
                        newPassword: values.newPassword,
                    }),
                })

                const data = await res.json()

                if (data.success) {
                    setIsSuccess(true)
                    toastr.success("Password reset successful!", "Success")
                    setTimeout(() => {
                        router.push("/login")
                    }, 2000)
                } else {
                    toastr.error(data.message || "Failed to reset password", "Error")
                }
            } catch (error) {
                toastr.error("Something went wrong. Please try again.", "Error")
            } finally {
                setSubmitting(false)
            }
        },
    })

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
    );

    if (isValidToken === null) {
        return (
            <div className="min-h-screen w-full bg-neutral-950 flex items-center justify-center">
                <NikeBackground />
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        )
    }

    if (isValidToken === false) {
        return (
            <div className="min-h-screen w-full bg-neutral-950 flex items-center justify-center p-4">
                <NikeBackground />
                <div className="relative z-10 w-full max-w-md mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 blur-xl transform translate-y-2" />
                    <Card className="relative border-[1.5px] border-neutral-800 shadow-2xl rounded-sm bg-neutral-900/95 backdrop-blur-sm">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 text-red-500" />
                            </div>
                            <CardTitle className="text-xl text-white">Invalid Link</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-neutral-400 mb-4">
                                This password reset link is invalid or has expired.
                            </p>
                            <Button 
                                onClick={() => router.push(`/forget-password${email ? `?email=${encodeURIComponent(email)}` : ""}`)} 
                                className="w-full bg-white text-black hover:bg-red-500 hover:text-white"
                            >
                                Request New Reset Link
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen w-full bg-neutral-950 flex items-center justify-center p-4">
                <NikeBackground />
                <div className="relative z-10 w-full max-w-md mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 blur-xl transform translate-y-2" />
                    <Card className="relative border-[1.5px] border-neutral-800 shadow-2xl rounded-sm bg-neutral-900/95 backdrop-blur-sm">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-emerald-500" />
                            </div>
                            <CardTitle className="text-xl text-white">Password Reset Successful!</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-neutral-400 mb-4">
                                Your password has been reset successfully. Redirecting to login...
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full bg-neutral-950 overflow-x-hidden">
            <NikeBackground />
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-6">
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                    {/* LEFT SIDE - Branding */}
                    <div className="hidden lg:flex flex-col animate-slideRight">
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
                        <h1 className="text-7xl font-black text-white leading-[0.9] mb-8 tracking-tight">
                            YOUR<br />
                            ACCOUNT<br />
                            FOR<br />
                            EVERYTHING<br />
                            NIKE
                        </h1>
                        <p className="text-lg text-neutral-400 max-w-md leading-relaxed">
                            Secure your account by resetting your password
                        </p>
                    </div>

                    {/* RIGHT SIDE - Form */}
                    <div className="w-full max-w-md mx-auto lg:mx-0 animate-slideUp">
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

                        <div className="relative animate-fade-in-delayed">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 blur-xl transform translate-y-2" />
                            <Card className="relative border-[1.5px] border-neutral-800 shadow-2xl rounded-sm bg-neutral-900/95 backdrop-blur-sm">
                                <CardHeader className="px-8 pt-10 pb-6 space-y-1">
                                    <CardTitle className="text-2xl font-bold text-center text-white animate-fade-in-delayed-more">
                                        RESET YOUR PASSWORD
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="px-8 pb-8">
                                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                                        {email && (
                                            <div className="mb-4 p-3 rounded-sm bg-neutral-800/50 border border-neutral-700">
                                                <p className="text-xs text-neutral-500 uppercase tracking-wider">
                                                    Resetting for:
                                                </p>
                                                <p className="text-sm font-medium text-white">{email}</p>
                                            </div>
                                        )}
                                        <div className="space-y-1.5 animate-stagger" style={{ animationDelay: '0.05s' }}>
                                            <Label htmlFor="newPassword" className="sr-only">New Password</Label>
                                            <div className="relative">
                                                <Input
                                                    id="newPassword"
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="New Password"
                                                    className={`h-12 rounded-sm border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white transition-all duration-200 pr-12 ${formik.touched.newPassword && formik.errors.newPassword ? 'border-red-500 focus-visible:border-red-500' : ''}`}
                                                    {...formik.getFieldProps("newPassword")}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white disabled:opacity-50 transition-all duration-200 hover:scale-110"
                                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                            {formik.touched.newPassword && formik.errors.newPassword && (
                                                <div className="flex items-center gap-1.5 text-red-400 text-xs mt-1.5">
                                                    <AlertCircle size={14} />
                                                    <span>{formik.errors.newPassword}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-1.5 animate-stagger" style={{ animationDelay: '0.1s' }}>
                                            <Label htmlFor="confirmPassword" className="sr-only">Confirm Password</Label>
                                            <div className="relative">
                                                <Input
                                                    id="confirmPassword"
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    placeholder="Confirm Password"
                                                    className={`h-12 rounded-sm border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white transition-all duration-200 pr-12 ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500 focus-visible:border-red-500' : ''}`}
                                                    {...formik.getFieldProps("confirmPassword")}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white disabled:opacity-50 transition-all duration-200 hover:scale-110"
                                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                                >
                                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                                <div className="flex items-center gap-1.5 text-red-400 text-xs mt-1.5">
                                                    <AlertCircle size={14} />
                                                    <span>{formik.errors.confirmPassword}</span>
                                                </div>
                                            )}
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={formik.isSubmitting}
                                            className="w-full h-12 bg-white hover:bg-red-500 text-black hover:text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-white/20 active:scale-[0.98]"
                                        >
                                            {formik.isSubmitting ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                                    SUBMITTING...
                                                </div>
                                            ) : (
                                                "SUBMIT"
                                            )}
                                        </Button>
                                    </form>

                                    <div className="mt-6 text-center animate-stagger" style={{ animationDelay: '0.2s' }}>
                                        <p className="text-sm text-neutral-300">
                                            Back to{" "}
                                            <button
                                                onClick={() => router.push("/login")}
                                                className="font-medium text-white underline hover:text-neutral-300 transition-all duration-200 hover:underline-offset-2"
                                            >
                                                Sign In
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

        .animate-stagger {
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
      `}</style>
        </div>
    )
}