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
import { ArrowRight, AlertCircle } from "lucide-react"

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
    .test("age", "You must be at least 13 years old", function(value) {
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
   onSubmit: async (values, { setSubmitting, setFieldError }) => {
  try {
    const res = await fetch("/api/auth/register", { // ✅ FIXED PATH
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

    if (!res.ok) {
      setFieldError("email", data.message || "Registration failed");
      return;
    }

    // ✅ Save credentials for login auto-fill
    localStorage.setItem(
      "registeredUser",
      JSON.stringify({
        email: values.email,
        password: values.password,
      })
    );

    router.push("/login"); // ✅ correct redirect
  } catch (error) {
    setFieldError("email", "Server error. Please try again.");
  } finally {
    setSubmitting(false);
  }
}

  })

  const handleGenderSelect = (gender: string) => {
    formik.setFieldValue("gender", gender)
    formik.setFieldTouched("gender", true)
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Stylish geometric background - CSS only for performance */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-20 right-20 w-80 h-80 bg-gradient-to-br from-orange-100 to-transparent rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-purple-100 to-transparent rounded-full blur-3xl opacity-30" />
        
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
        <div className="w-full max-w-md animate-slideUp">
          {/* Nike logo */}
          <div className="mb-8 flex justify-center">
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

                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="sr-only">First Name</Label>
                  <Input 
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`h-12 rounded-sm border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-black transition-colors ${
                      formik.touched.firstName && formik.errors.firstName ? 'border-red-500 focus-visible:border-red-500' : ''
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
                    className={`h-12 rounded-sm border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-black transition-colors ${
                      formik.touched.lastName && formik.errors.lastName ? 'border-red-500 focus-visible:border-red-500' : ''
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
                  <Input 
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formik.values.dateOfBirth}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`h-12 rounded-sm border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-black transition-colors ${
                      formik.touched.dateOfBirth && formik.errors.dateOfBirth ? 'border-red-500 focus-visible:border-red-500' : ''
                    } ${formik.values.dateOfBirth ? 'text-gray-900' : 'text-gray-500'}`}
                    placeholder="Date of Birth"
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
                    <button
                      type="button"
                      onClick={() => handleGenderSelect("male")}
                      disabled={formik.isSubmitting}
                      className={`h-12 border-[1.5px] transition-colors rounded-sm text-sm font-medium ${
                        formik.values.gender === "male" 
                          ? 'border-black bg-black text-white' 
                          : formik.touched.gender && formik.errors.gender
                          ? 'border-red-500 hover:border-red-600'
                          : 'border-gray-300 hover:border-black'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      Male
                    </button>
                    <button
                      type="button"
                      onClick={() => handleGenderSelect("female")}
                      disabled={formik.isSubmitting}
                      className={`h-12 border-[1.5px] transition-colors rounded-sm text-sm font-medium ${
                        formik.values.gender === "female" 
                          ? 'border-black bg-black text-white' 
                          : formik.touched.gender && formik.errors.gender
                          ? 'border-red-500 hover:border-red-600'
                          : 'border-gray-300 hover:border-black'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      Female
                    </button>
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
                  By creating an account, you agree to Nike's{" "}
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

        .animate-slideUp {
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  )
}