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
import { Mail, ArrowRight, ArrowLeft, Shield } from "lucide-react"

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen w-full relative bg-white overflow-hidden">
      {/* Full Background - Nike Apparel & Accessories */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 grid grid-cols-3 gap-0">
          <img
            src="https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/d3eb254d-0901-4158-956a-4610180545e5/sportswear-heritage-86-futura-washed-cap-L0dL4X.png"
            alt="Nike Cap"
            className="w-full h-full object-cover"
          />
          <img
            src="https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/8a4aa677-c9d0-45ec-ab01-d4fb3a59cd46/tech-crossbody-bag-KCq4mh.png"
            alt="Nike Bag"
            className="w-full h-full object-cover"
          />
          <img
            src="https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/24eb8c29-d14f-4a39-8a8e-be6e3e4e0bd7/everyday-plus-cushioned-training-crew-socks-xQGhJv.png"
            alt="Nike Socks"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Strong overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-black/90 backdrop-blur-sm" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT SIDE - Support Message */}
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
              WE'VE<br />
              GOT<br />
              YOU.
            </h1>
            <p className="text-xl text-gray-300 font-medium leading-relaxed mb-8">
              Forgot your password? No worries. Happens to the best athletes. Let's get you back in the game.
            </p>

            {/* Security Features */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                <Shield className="text-green-400 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="text-white font-black text-base mb-1">Secure Process</h3>
                  <p className="text-gray-400 text-sm">Your account security is our top priority</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                <Mail className="text-blue-400 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="text-white font-black text-base mb-1">Email Verification</h3>
                  <p className="text-gray-400 text-sm">We'll send a secure link to reset your password</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Reset Form */}
          <div className="w-full" style={{ animation: 'slideUp 0.8s ease-out 0.2s backwards' }}>
            <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
              {/* Top Nike Swoosh Accent */}
              <div className="h-2 bg-gradient-to-r from-green-500 via-teal-600 to-cyan-500" />
              
              <CardHeader className="space-y-3 pt-8 pb-6 px-8">
                <CardTitle className="text-4xl font-black text-black tracking-tight">
                  RESET PASSWORD
                </CardTitle>
                <p className="text-gray-600 text-sm font-medium">
                  Enter your email address and we'll send you instructions to reset your password.
                </p>
              </CardHeader>

              <CardContent className="space-y-6 px-8 pb-6">
                <form className="space-y-6">
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

                  <Button
                    type="submit"
                    className="group w-full h-14 bg-black hover:bg-gray-800 text-white font-black text-base uppercase tracking-wider transition-all rounded-full"
                  >
                    Send Reset Link
                    <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>

                {/* Info box */}
                <div className="rounded-2xl bg-gray-50 border-2 border-gray-100 p-5">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Mail size={18} className="text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-gray-900 mb-1">Check your inbox</h4>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        The reset link will expire in 1 hour. If you don't see the email, check your spam folder or request a new link.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-3 text-sm px-8 pb-8">
                <a 
                  href="/login" 
                  className="group flex items-center justify-center gap-2 text-gray-600 hover:text-black font-bold transition-colors"
                >
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                  Back to Sign In
                </a>
                <p className="text-gray-600 text-center">
                  Don't have an account?{" "}
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