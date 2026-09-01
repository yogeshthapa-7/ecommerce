"use client"

import { useRouter, useSearchParams } from "next/navigation"
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
import { AlertCircle, Eye, EyeOff } from "lucide-react"
import { useEffect, useRef } from "react"
import toastr from "toastr"
import "toastr/build/toastr.min.css"

// Configure toastr options
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

// Yup validation schema
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email address is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  keepSignedIn: Yup.boolean()
})

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || null
  const toastrInitialized = useRef(false)
  const [showPassword, setShowPassword] = useState(false)

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

  useEffect(() => {
    if (!toastrInitialized.current) {
      toastrInitialized.current = true
    }

    const saved = localStorage.getItem("registeredUser");
    if (saved) {
      const { email, password } = JSON.parse(saved);
      formik.setFieldValue("email", email);
      formik.setFieldValue("password", password);
      localStorage.removeItem("registeredUser");
      showToast('success', 'Account created! Please sign in.', 'Welcome!')
    }
  }, [])


  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      keepSignedIn: false
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          showToast('error', data.message || "Invalid email or password", "Login Failed");
          setSubmitting(false);
          return;
        }

        // Login success - save token and user
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        showToast('success', 'Login successful! Redirecting...', 'Welcome');

        // Redirect based on user role or redirect param
        setTimeout(() => {
          if (data.user.role === "admin") {
            router.push("/admin");
          } else if (redirectTo) {
            router.push(redirectTo);
          } else {
            router.push("/nike");
          }
        }, 500);
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
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-6">
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
                  fill="#fff"
                />
              </svg>
            </div>

            <h1 className="text-7xl font-black text-white leading-[0.9] mb-8 tracking-tight animate-fade-in-delayed">
              YOUR<br />
              ACCOUNT<br />
              FOR<br />
              EVERYTHING<br />
              NIKE
            </h1>

            <p className="text-lg text-neutral-400 max-w-md leading-relaxed animate-fade-in-delayed-more">
              Access exclusive member benefits, personalized recommendations, and early access to new releases.
            </p>
          </div>

          {/* Login form */}
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
                <CardHeader className="px-8 pt-10 pb-6 space-y-1">
                  <CardTitle className="text-2xl font-bold text-center text-white animate-fade-in-delayed-more">
                    YOUR ACCOUNT FOR EVERYTHING NIKE
                  </CardTitle>
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

                     <div className="flex items-center justify-between text-xs text-neutral-400 py-1 animate-stagger" style={{ animationDelay: '0.15s' }}>
                       <label className="flex items-center gap-2 cursor-pointer group">
                         <input
                           type="checkbox"
                           name="keepSignedIn"
                           checked={formik.values.keepSignedIn}
                           onChange={formik.handleChange}
                           className="w-4 h-4 rounded-sm border-neutral-600 bg-neutral-800 transition-all duration-200 group-hover:border-neutral-500"
                           disabled={formik.isSubmitting}
                         />
                         <span className="transition-colors duration-200 group-hover:text-white">Keep me signed in</span>
                       </label>
                       <button
                         type="button"
                         onClick={() => router.push("/forget-password")}
                         className="hover:text-white transition-colors duration-200 hover:underline underline-offset-2"
                         disabled={formik.isSubmitting}
                       >
                         Forgotten your password?
                       </button>
                     </div>

                     <p className="text-xs text-neutral-400 text-center leading-relaxed pt-2 animate-stagger" style={{ animationDelay: '0.2s' }}>
                       By logging in, you agree to Nike&apos;s{" "}
                       <a href="#" className="underline hover:text-white transition-colors duration-200 hover:underline-offset-2">Privacy Policy</a>
                       {" "}and{" "}
                       <a href="#" className="underline hover:text-white transition-colors duration-200 hover:underline-offset-2">Terms of Use</a>.
                     </p>

                     <Button
                       type="submit"
                       disabled={formik.isSubmitting}
                       className="w-full h-12 bg-white hover:bg-neutral-200 text-black rounded-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-white/20 active:scale-[0.98] animate-stagger"
                       style={{ animationDelay: '0.25s' }}
                     >
                       {formik.isSubmitting ? (
                         <div className="flex items-center gap-2">
                           <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                           SIGNING IN...
                         </div>
                       ) : (
                         "SIGN IN"
                       )}
                     </Button>
                   </form>

                   <div className="mt-6 text-center animate-stagger" style={{ animationDelay: '0.3s' }}>
                     <p className="text-sm text-neutral-300">
                       Not a Member?{" "}
                       <button
                         onClick={() => router.push("/register")}
                         className="font-medium text-white underline hover:text-neutral-300 transition-all duration-200 hover:underline-offset-2"
                       >
                         Join Us.
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
