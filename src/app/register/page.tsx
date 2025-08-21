"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Mail, Lock, User, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useAuthStore } from "@/store/authStore"
import { registerSchema } from "@/lib/validations"
import type { RegisterData } from "@/types/auth"
import AuthGuard from "@/components/auth-guard"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)
  const router = useRouter()
  const { register: registerUser, isLoading, error, clearError } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterData) => {
    try {
      clearError()
      await registerUser(data)
      router.push("/dashboard")
    } catch (error) {}
  }

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background Design */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
          {/* Geometric Shapes */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-emerald-200/30 rounded-full blur-xl animate-pulse" />
          <div className="absolute top-40 right-32 w-24 h-24 bg-teal-300/40 rounded-full blur-lg animate-bounce" />
          <div className="absolute bottom-32 left-32 w-40 h-40 bg-cyan-200/25 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-emerald-300/35 rounded-full blur-xl animate-bounce" />

          {/* Floating Elements */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-float" />
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-teal-400 rounded-full animate-float-delayed" />
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-cyan-400 rounded-full animate-float-slow" />
          <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-emerald-500 rounded-full animate-float" />

          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="grid grid-cols-12 gap-8 h-full">
              {Array.from({ length: 144 }).map((_, i) => (
                <div key={i} className="border border-emerald-300" />
              ))}
            </div>
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-white/10" />
        </div>

        {/* Registration Form */}
        <div className="relative z-10 w-full max-w-md px-6">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-xl">
                  <Shield className="h-10 w-10 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Join Car4Sure</h1>
              <p className="text-gray-600 text-lg">Create your account for premium insurance management</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">{error}</div>
              )}

              <div>
                <Label htmlFor="name" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    autoComplete="name"
                    className="pl-12 h-14 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-lg"
                    placeholder="Enter your full name"
                    {...register("name")}
                  />
                </div>
                {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className="pl-12 h-14 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-lg"
                    placeholder="Enter your email address"
                    {...register("email")}
                  />
                </div>
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className="pl-12 pr-12 h-14 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-lg"
                    placeholder="Enter your password"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
              </div>

              <div>
                <Label htmlFor="password_confirmation" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password_confirmation"
                    type={showPasswordConfirmation ? "text" : "password"}
                    autoComplete="new-password"
                    className="pl-12 pr-12 h-14 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-lg"
                    placeholder="Confirm your password"
                    {...register("password_confirmation")}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                  >
                    {showPasswordConfirmation ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password_confirmation && (
                  <p className="mt-2 text-sm text-red-600">{errors.password_confirmation.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] text-lg"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>

              <div className="text-center pt-6">
                <span className="text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors"
                  >
                    Sign In
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(-10px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(180deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(-5px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(360deg); }
        }
        
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite 2s; }
        .animate-float-slow { animation: float-slow 10s ease-in-out infinite 4s; }
      `}</style>
    </AuthGuard>
  )
}
