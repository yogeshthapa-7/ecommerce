"use client"
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
import { Mail, Lock, ArrowRight, ShoppingBag } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full relative bg-white overflow-hidden">
      {/* Full Background - Nike Product Collage */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 grid grid-cols-3 gap-0">
          <img
            src="https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/99486859-0ff3-46b4-949b-2d16af2ad421/custom-nike-dunk-high-by-you-shoes.png"
            alt="Nike Dunk"
            className="w-full h-full object-cover"
          />
          <img
            src="https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/af53d53d-561f-450a-a483-70a7ceee380f/W+AIR+FORCE+1+%2707.png"
            alt="Nike Air Force"
            className="w-full h-full object-cover"
          />
          <img
            src="https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/e777c881-5b62-4250-92a6-362967f54cca/air-max-97-shoes-VDPTnq.png"
            alt="Nike Air Max"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Strong overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/75 to-black/85 backdrop-blur-sm" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT SIDE - Nike Branding */}
          <div className="hidden lg:block" style={{ animation: 'slideRight 0.8s ease-out' }}>
            {/* Nike Logo */}
            <div className="mb-12">
              <svg viewBox="0 0 1000 356.39" className="w-32 h-auto fill-white">
                <path d="M245.8,212.6l130.6-129.7c7.4-7.4,11.4-17.3,11.4-27.6c0-10.4-4-20.2-11.4-27.6l0,0c-15.2-15.2-39.9-15.2-55.1,0
                  L151.5,197.4l169.8,169.8c15.2,15.2,39.9,15.2,55.1,0c7.4-7.4,11.4-17.3,11.4-27.6c0-10.4-4-20.2-11.4-27.6L245.8,212.6z" />
                <path d="M0,283.7c0,24.5,7.8,48.6,22.3,68.7l0,0c8.5,11.8,25.2,14.6,37,6.1c11.8-8.5,14.6-25.2,6.1-37
                  c-8.8-12.2-13.5-26.8-13.5-41.8c0-39.6,32.1-71.7,71.7-71.7h270.4c21.7,0,39.3-17.6,39.3-39.3c0-21.7-17.6-39.3-39.3-39.3H123.6
                  C55.4,129.4,0,184.8,0,253V283.7z" />
              </svg>
            </div>

            <h1 className="text-7xl font-black text-white leading-none tracking-tighter mb-6">
              SHOP.<br />
              TRAIN.<br />
              CONQUER.
            </h1>
            <p className="text-xl text-gray-300 font-medium leading-relaxed mb-8">
              Sign in to access exclusive products, member rewards, and personalized shopping experiences.
            </p>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <ShoppingBag size={18} className="text-white" />
                </div>
                <span className="text-white font-bold">Exclusive member pricing</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <ShoppingBag size={18} className="text-white" />
                </div>
                <span className="text-white font-bold">Early access to new drops</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <ShoppingBag size={18} className="text-white" />
                </div>
                <span className="text-white font-bold">Free shipping on orders $50+</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Login Form */}
          <div className="w-full" style={{ animation: 'slideUp 0.8s ease-out 0.2s backwards' }}>
            <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
              {/* Top Nike Swoosh Accent */}
              <div className="h-2 bg-gradient-to-r from-orange-500 via-red-600 to-pink-600" />
              
              <CardHeader className="space-y-3 pt-8 pb-6 px-8">
                <CardTitle className="text-4xl font-black text-black tracking-tight">
                  WELCOME BACK
                </CardTitle>
                <p className="text-gray-600 text-sm font-medium">
                  Sign in to continue shopping
                </p>
              </CardHeader>

              <CardContent className="space-y-6 px-8 pb-6">
                {/* Social login buttons */}
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full h-12 flex items-center justify-center gap-3 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 font-medium transition-all"
                  >
                    <img
                      src="https://www.svgrepo.com/show/303108/google-icon-logo.svg"
                      alt="Google"
                      className="h-5 w-5"
                    />
                    Continue with Google
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full h-12 flex items-center justify-center gap-3 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 font-medium transition-all"
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
                      alt="Facebook"
                      className="h-5 w-5"
                    />
                    Continue with Facebook
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full h-12 flex items-center justify-center gap-3 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 font-medium transition-all"
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                      alt="Apple"
                      className="h-5 w-5"
                    />
                    Continue with Apple
                  </Button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-gray-300" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">OR</span>
                  <div className="h-px flex-1 bg-gray-300" />
                </div>

                {/* Email login form */}
                <form className="space-y-4">
                  <div>
                    <Label className="text-gray-700 font-bold text-sm mb-2 block">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="pl-12 h-14 border-2 border-gray-200 focus:border-black text-base font-medium rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-700 font-bold text-sm mb-2 block">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        className="pl-12 h-14 border-2 border-gray-200 focus:border-black text-base font-medium rounded-xl"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="group w-full h-14 bg-black hover:bg-gray-800 text-white font-black text-base uppercase tracking-wider transition-all rounded-full mt-6"
                  >
                    Sign In
                    <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="flex flex-col space-y-3 text-sm px-8 pb-8">
                <a href="/forget-password" className="text-gray-600 hover:text-black font-bold transition-colors">
                  Forgot password?
                </a>
                <p className="text-gray-600">
                  Not a member?{" "}
                  <a href="/register" className="font-black text-black hover:underline">
                    Join Us
                  </a>
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideRight {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      ` }} />
    </div>
  )
}