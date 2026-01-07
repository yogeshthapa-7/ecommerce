import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Card className="w-[400px] rounded-2xl border border-gray-700 bg-white/10 backdrop-blur-xl shadow-2xl">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-white tracking-tight">
            Sign in to <span className="text-indigo-400">YourApp</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="bg-gray-900/40 border-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-200">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="bg-gray-900/40 border-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow-lg transition-transform hover:scale-[1.02]"
            >
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-3">
          <a href="/forgot-password" className="text-sm text-indigo-400 hover:underline">
            Forgot password?
          </a>
          <p className="text-sm text-gray-400">
            Don’t have an account?{" "}
            <a href="/register" className="text-indigo-400 hover:underline font-medium">
              Sign up
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
