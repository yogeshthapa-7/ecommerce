"use client"

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
import { Mail, Lock, ArrowRight, AlertCircle } from "lucide-react"
import { useEffect } from "react"

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

  useEffect(() => {
  const saved = localStorage.getItem("registeredUser");
  if (saved) {
    const { email, password } = JSON.parse(saved);
    formik.setFieldValue("email", email);
    formik.setFieldValue("password", password);
    localStorage.removeItem("registeredUser");
  }
}, []);


  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      keepSignedIn: false
    },
    validationSchema,
  onSubmit: async (values, { setSubmitting, setFieldError }) => {
  try {
    const res = await fetch("/api/auth/login", { // ✅ FIXED PATH
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: values.email,
        password: values.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setFieldError("password", data.message || "Invalid email or password");
      return;
    }

    // ✅ login success
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    router.push("/admin");
  } catch (error) {
    setFieldError("password", "Server error. Please try again.");
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
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5">
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
              YOUR<br />
              ACCOUNT<br />
              FOR<br />
              EVERYTHING<br />
              NIKE
            </h1>

            <p className="text-lg text-gray-600 max-w-md leading-relaxed">
              Access exclusive member benefits, personalized recommendations, and early access to new releases.
            </p>
          </div>

          {/* Login form */}
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
                <CardHeader className="px-8 pt-10 pb-6 space-y-1">
                  <CardTitle className="text-2xl font-bold text-center">
                    YOUR ACCOUNT FOR EVERYTHING NIKE
                  </CardTitle>
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

                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="sr-only">Password</Label>
                    <Input 
                      id="password"
                      name="password"
                      type="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`h-12 rounded-sm border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-black transition-colors ${
                        formik.touched.password && formik.errors.password ? 'border-red-500 focus-visible:border-red-500' : ''
                      }`}
                      placeholder="Password"
                      disabled={formik.isSubmitting}
                    />
                    {formik.touched.password && formik.errors.password && (
                      <div className="flex items-center gap-1.5 text-red-600 text-xs mt-1.5">
                        <AlertCircle size={14} />
                        <span>{formik.errors.password}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 py-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox"
                        name="keepSignedIn"
                        checked={formik.values.keepSignedIn}
                        onChange={formik.handleChange}
                        className="w-4 h-4 rounded-sm border-gray-300"
                        disabled={formik.isSubmitting}
                      />
                      <span>Keep me signed in</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => router.push("/forget-password")}
                      className="hover:text-black transition-colors"
                      disabled={formik.isSubmitting}
                    >
                      Forgotten your password?
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 text-center leading-relaxed pt-2">
                    By logging in, you agree to Nike's{" "}
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
                        SIGNING IN...
                      </div>
                    ) : (
                      "SIGN IN"
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Not a Member?{" "}
                    <button
                      onClick={() => router.push("/register")}
                      className="font-medium text-black underline hover:text-gray-600 transition-colors"
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