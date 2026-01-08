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
import { Mail, Lock, User, ArrowRight, Star, Zap, Gift } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full relative bg-white overflow-hidden">
      {/* Full Background - Nike Product Lifestyle */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 grid grid-cols-2 lg:grid-cols-4 gap-0">
          <img
            src="https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b1bcbca4-e853-4df7-b329-5be3c61ee057/air-jordan-1-retro-high-og-shoes-Pz6fZ8.png"
            alt="Jordan"
            className="w-full h-full object-cover"
          />
          <img
            src="https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/1c88c971-6071-4eb9-b2e2-995f9927e8f4/jumpman-two-trey-shoes-DmGJFZ.png"
            alt="Jumpman"
            className="w-full h-full object-cover"
          />
          <img
            src="https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/0ba83e49-2ab2-442c-92f7-801ba0a06aa3/sb-zoom-janoski-og-skate-shoes-MLJmQJ.png"
            alt="SB"
            className="w-full h-full object-cover hidden lg:block"
          />
          <img
            src="https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/c14dfb51-e737-4388-95f9-3c7a83ff1e69/blazer-mid-77-vintage-shoes-nw30B2.png"
            alt="Blazer"
            className="w-full h-full object-cover hidden lg:block"
          />
        </div>
        {/* Strong overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-black/90 backdrop-blur-sm" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT SIDE - Nike Membership Benefits */}
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
              BECOME<br />
              A NIKE<br />
              MEMBER
            </h1>
            <p className="text-xl text-gray-300 font-medium leading-relaxed mb-8">
              Join the Nike community and unlock exclusive benefits, rewards, and experiences.
            </p>

            {/* Member Benefits */}
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center flex-shrink-0">
                  <Star size={24} className="text-white fill-white" />
                </div>
                <div>
                  <h3 className="text-white font-black text-lg mb-1">Member Exclusive Products</h3>
                  <p className="text-gray-400 text-sm">Get first access to the latest styles and limited releases</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <Zap size={24} className="text-white fill-white" />
                </div>
                <div>
                  <h3 className="text-white font-black text-lg mb-1">Free Shipping & Returns</h3>
                  <p className="text-gray-400 text-sm">No minimum spend required for members</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                  <Gift size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-black text-lg mb-1">Special Birthday Reward</h3>
                  <p className="text-gray-400 text-sm">Celebrate your special day with a gift from Nike</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Register Form */}
          <div className="w-full" style={{ animation: 'slideUp 0.8s ease-out 0.2s backwards' }}>
            <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
              {/* Top Nike Swoosh Accent */}
              <div className="h-2 bg-gradient-to-r from-purple-500 via-blue-600 to-cyan-500" />
              
              <CardHeader className="space-y-3 pt-8 pb-6 px-8">
                <CardTitle className="text-4xl font-black text-black tracking-tight">
                  JOIN US
                </CardTitle>
                <p className="text-gray-600 text-sm font-medium">
                  Create your Nike Member profile and get first access to the very best of Nike products, inspiration and community.
                </p>
              </CardHeader>

              <CardContent className="space-y-6 px-8 pb-6">
                {/* Social signup buttons */}
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
                    Sign up with Google
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
                    Sign up with Facebook
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
                    Sign up with Apple
                  </Button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-gray-300" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">OR</span>
                  <div className="h-px flex-1 bg-gray-300" />
                </div>

                {/* Register form */}
                <form className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-700 font-bold text-sm mb-2 block">
                        First Name
                      </Label>
                      <Input
                        type="text"
                        placeholder="First Name"
                        className="h-12 border-2 border-gray-200 focus:border-black text-base font-medium rounded-xl"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 font-bold text-sm mb-2 block">
                        Last Name
                      </Label>
                      <Input
                        type="text"
                        placeholder="Last Name"
                        className="h-12 border-2 border-gray-200 focus:border-black text-base font-medium rounded-xl"
                      />
                    </div>
                  </div>

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
                        placeholder="Create a password"
                        className="pl-12 h-14 border-2 border-gray-200 focus:border-black text-base font-medium rounded-xl"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="group w-full h-14 bg-black hover:bg-gray-800 text-white font-black text-base uppercase tracking-wider transition-all rounded-full mt-6"
                  >
                    Join Us
                    <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>

                <p className="text-xs text-gray-500 text-center leading-relaxed">
                  By creating an account, you agree to Nike's{" "}
                  <a href="#" className="underline">Privacy Policy</a> and{" "}
                  <a href="#" className="underline">Terms of Use</a>.
                </p>
              </CardContent>

              <CardFooter className="flex flex-col space-y-3 text-sm px-8 pb-8">
                <p className="text-gray-600">
                  Already a member?{" "}
                  <a href="/login" className="font-black text-black hover:underline">
                    Sign In
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