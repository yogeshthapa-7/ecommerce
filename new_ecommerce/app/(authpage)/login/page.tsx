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
import { Mail, Lock } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="h-screen w-full grid grid-cols-1 md:grid-cols-2">

      {/* LEFT – NIKE PRODUCT HERO */}
      <div className="relative hidden md:flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519"
          alt="Nike Shoes"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/65" />

        <div className="relative z-10 max-w-md text-left px-10">
          <h1 className="text-5xl font-extrabold text-white leading-tight">
            JUST <br /> DO IT.
          </h1>
          <p className="mt-6 text-gray-300 text-lg">
            Discover the latest drops. Train harder. Move faster.
          </p>
        </div>
      </div>

      {/* RIGHT – FORM WITH NIKE PRODUCT BACKGROUND */}
      <div className="relative flex items-center justify-center overflow-hidden">

        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1549298916-b41d501d3772"
          alt="Nike Apparel"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-white/85 backdrop-blur-sm" />

        {/* Decorative blur */}
        <div className="absolute -top-24 -right-24 h-96 w-96 bg-black/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 bg-gray-900/10 rounded-full blur-2xl" />

        {/* LOGIN CARD */}
        <Card className="relative w-[420px] rounded-3xl border border-black/10 bg-white/70 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-3 text-center">
            <CardTitle className="text-3xl font-extrabold tracking-tight">
              Welcome Back
            </CardTitle>
            <p className="text-gray-600 text-sm">
              Sign in to access exclusive Nike products.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">

            {/* Social login with ONLINE ICONS */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-11 flex items-center justify-center gap-3 border-gray-300 hover:bg-gray-100"
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
                className="w-full h-11 flex items-center justify-center gap-3 border-gray-300 hover:bg-gray-100"
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
                className="w-full h-11 flex items-center justify-center gap-3 border-gray-300 hover:bg-gray-100"
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
              <div className="h-px w-full bg-gray-300" />
              <span className="text-xs text-gray-500">OR</span>
              <div className="h-px w-full bg-gray-300" />
            </div>

            {/* Email login */}
            <form className="space-y-4">
              <div>
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label>Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-black text-white hover:bg-gray-900 font-semibold tracking-wide"
              >
                SIGN IN
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3 text-sm">
            <a href="/forgot-password" className="hover:underline">
              Forgot password?
            </a>
            <p className="text-gray-600">
              New member?{" "}
              <a href="/register" className="font-semibold hover:underline">
                Join Nike.
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
