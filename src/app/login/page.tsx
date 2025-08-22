"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Shield, Eye, EyeOff, Mail, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { useAuth } from "@/hooks/useAuth"
import { loginSchema } from "@/lib/validations"
import type { LoginCredentials } from "@/types/auth"
import AuthGuard from "@/components/auth-guard"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isDay, setIsDay] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const router = useRouter()
  const { login, loading } = useAuth({
    middleware: 'guest',
    redirectIfAuthenticated: '/dashboard'
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setIsDay((prev) => !prev)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginCredentials) => {
    try {
      await login({
        ...data,
        setErrors
      })
      // Only redirect if login succeeds
      router.push("/dashboard")
    } catch (error) {
      // Login failed - errors already set by useAuth hook
      // Stay on login page
    }
  }

  const displayErrors = { ...formErrors }
  Object.entries(errors).forEach(([key, messages]) => {
    if (messages?.length > 0) {
      displayErrors[key as keyof LoginCredentials] = { 
        message: messages[0],
        type: 'manual'  
      }
    }
  })

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen flex">
        <div
          className={`hidden lg:flex lg:w-1/2 relative overflow-hidden transition-all duration-2000 ${
            isDay
              ? "bg-gradient-to-br from-sky-400 via-sky-300 to-blue-400"
              : "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          }`}
        >
          <div
            className={`absolute top-16 right-16 w-16 h-16 rounded-full transition-all duration-2000 ${
              isDay ? "bg-yellow-400 shadow-yellow-400/50 shadow-2xl" : "bg-gray-200 shadow-gray-200/30 shadow-lg"
            }`}
          >
            {!isDay && <div className="absolute top-2 right-2 w-3 h-3 bg-gray-400 rounded-full opacity-60"></div>}
          </div>

          {isDay && (
            <>
              <div className="absolute top-20 left-16 w-20 h-8 bg-white/80 rounded-full animate-float"></div>
              <div className="absolute top-32 right-32 w-16 h-6 bg-white/70 rounded-full animate-float-delayed"></div>
              <div className="absolute top-28 left-1/3 w-12 h-5 bg-white/60 rounded-full animate-float-slow"></div>
            </>
          )}

          <div className="absolute bottom-0 left-0 right-0 h-80">
            <div
              className={`absolute bottom-0 left-8 w-16 h-48 rounded-t-lg transition-colors duration-2000 ${
                isDay ? "bg-gradient-to-t from-gray-600 to-gray-500" : "bg-gradient-to-t from-slate-700 to-slate-600"
              }`}
            >
              <div className="grid grid-cols-3 gap-1 p-2 pt-4">
                <div
                  className={`w-3 h-3 rounded animate-pulse ${isDay ? "bg-blue-300" : "bg-yellow-400"}`}
                  style={{ animationDelay: "0s" }}
                ></div>
                <div
                  className={`w-3 h-3 rounded animate-pulse ${isDay ? "bg-blue-300" : "bg-yellow-400"}`}
                  style={{ animationDelay: "1s" }}
                ></div>
                <div className={`w-3 h-3 rounded ${isDay ? "bg-gray-800" : "bg-slate-800"}`}></div>
                <div className={`w-3 h-3 rounded ${isDay ? "bg-gray-800" : "bg-slate-800"}`}></div>
                <div
                  className={`w-3 h-3 rounded animate-pulse ${isDay ? "bg-blue-300" : "bg-yellow-400"}`}
                  style={{ animationDelay: "2s" }}
                ></div>
                <div
                  className={`w-3 h-3 rounded animate-pulse ${isDay ? "bg-blue-300" : "bg-yellow-400"}`}
                  style={{ animationDelay: "0.5s" }}
                ></div>
              </div>
            </div>

            <div
              className={`absolute bottom-0 left-28 w-20 h-64 rounded-t-lg transition-colors duration-2000 ${
                isDay ? "bg-gradient-to-t from-gray-500 to-gray-400" : "bg-gradient-to-t from-slate-600 to-slate-500"
              }`}
            >
              <div className="grid grid-cols-4 gap-1 p-2 pt-6">
                <div
                  className={`w-2 h-2 rounded animate-pulse ${isDay ? "bg-blue-300" : "bg-yellow-400"}`}
                  style={{ animationDelay: "1.5s" }}
                ></div>
                <div className={`w-2 h-2 rounded ${isDay ? "bg-gray-800" : "bg-slate-800"}`}></div>
                <div
                  className={`w-2 h-2 rounded animate-pulse ${isDay ? "bg-blue-300" : "bg-yellow-400"}`}
                  style={{ animationDelay: "3s" }}
                ></div>
                <div
                  className={`w-2 h-2 rounded animate-pulse ${isDay ? "bg-blue-300" : "bg-yellow-400"}`}
                  style={{ animationDelay: "0.8s" }}
                ></div>
                <div
                  className={`w-2 h-2 rounded animate-pulse ${isDay ? "bg-blue-300" : "bg-yellow-400"}`}
                  style={{ animationDelay: "2.2s" }}
                ></div>
                <div className={`w-2 h-2 rounded ${isDay ? "bg-gray-800" : "bg-slate-800"}`}></div>
                <div className={`w-2 h-2 rounded ${isDay ? "bg-gray-800" : "bg-slate-800"}`}></div>
                <div
                  className={`w-2 h-2 rounded animate-pulse ${isDay ? "bg-blue-300" : "bg-yellow-400"}`}
                  style={{ animationDelay: "1.8s" }}
                ></div>
              </div>
            </div>

            <div
              className={`absolute bottom-0 left-52 w-14 h-40 rounded-t-lg transition-colors duration-2000 ${
                isDay ? "bg-gradient-to-t from-gray-600 to-gray-500" : "bg-gradient-to-t from-slate-700 to-slate-600"
              }`}
            >
              <div className="grid grid-cols-2 gap-1 p-2 pt-3">
                <div
                  className={`w-3 h-3 rounded animate-pulse ${isDay ? "bg-blue-300" : "bg-yellow-400"}`}
                  style={{ animationDelay: "2.5s" }}
                ></div>
                <div className={`w-3 h-3 rounded ${isDay ? "bg-gray-800" : "bg-slate-800"}`}></div>
                <div
                  className={`w-3 h-3 rounded animate-pulse ${isDay ? "bg-blue-300" : "bg-yellow-400"}`}
                  style={{ animationDelay: "1.2s" }}
                ></div>
                <div
                  className={`w-3 h-3 rounded animate-pulse ${isDay ? "bg-blue-300" : "bg-yellow-400"}`}
                  style={{ animationDelay: "3.5s" }}
                ></div>
              </div>
            </div>

            <div
              className={`absolute bottom-0 right-20 w-18 h-56 rounded-t-lg transition-colors duration-2000 ${
                isDay ? "bg-gradient-to-t from-gray-500 to-gray-400" : "bg-gradient-to-t from-slate-600 to-slate-500"
              }`}
            >
              <div className="grid grid-cols-3 gap-1 p-2 pt-4">
                <div
                  className={`w-2 h-2 rounded animate-pulse ${isDay ? "bg-blue-300" : "bg-yellow-400"}`}
                  style={{ animationDelay: "0.3s" }}
                ></div>
                <div className={`w-2 h-2 rounded ${isDay ? "bg-gray-800" : "bg-slate-800"}`}></div>
                <div
                  className={`w-2 h-2 rounded animate-pulse ${isDay ? "bg-blue-300" : "bg-yellow-400"}`}
                  style={{ animationDelay: "2.8s" }}
                ></div>
                <div
                  className={`w-2 h-2 rounded animate-pulse ${isDay ? "bg-blue-300" : "bg-yellow-400"}`}
                  style={{ animationDelay: "1.7s" }}
                ></div>
                <div
                  className={`w-2 h-2 rounded animate-pulse ${isDay ? "bg-blue-300" : "bg-yellow-400"}`}
                  style={{ animationDelay: "3.2s" }}
                ></div>
                <div className={`w-2 h-2 rounded ${isDay ? "bg-gray-800" : "bg-slate-800"}`}></div>
              </div>
            </div>

            <div
              className={`absolute bottom-0 right-8 w-16 h-72 rounded-t-lg transition-colors duration-2000 ${
                isDay ? "bg-gradient-to-t from-gray-600 to-gray-500" : "bg-gradient-to-t from-slate-700 to-slate-600"
              }`}
            >
              <div className="grid grid-cols-3 gap-1 p-2 pt-8">
                <div
                  className={`w-3 h-3 rounded animate-pulse ${isDay ? "bg-blue-300" : "bg-yellow-400"}`}
                  style={{ animationDelay: "1.4s" }}
                ></div>
                <div
                  className={`w-3 h-3 rounded animate-pulse ${isDay ? "bg-blue-300" : "bg-yellow-400"}`}
                  style={{ animationDelay: "2.9s" }}
                ></div>
                <div className={`w-3 h-3 rounded ${isDay ? "bg-gray-800" : "bg-slate-800"}`}></div>
                <div className={`w-3 h-3 rounded ${isDay ? "bg-gray-800" : "bg-slate-800"}`}></div>
                <div
                  className={`w-3 h-3 rounded animate-pulse ${isDay ? "bg-blue-300" : "bg-yellow-400"}`}
                  style={{ animationDelay: "0.7s" }}
                ></div>
                <div
                  className={`w-3 h-3 rounded animate-pulse ${isDay ? "bg-blue-300" : "bg-yellow-400"}`}
                  style={{ animationDelay: "3.8s" }}
                ></div>
              </div>
            </div>

            <div
              className={`absolute bottom-0 left-0 right-0 h-16 transition-colors duration-2000 ${
                isDay ? "bg-gradient-to-t from-gray-700 to-gray-600" : "bg-gradient-to-t from-slate-800 to-slate-700"
              }`}
            >
              <div className="absolute top-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-pulse"></div>
              <div className="absolute top-6 left-0 right-0 h-0.5 bg-white/40"></div>
              <div className="absolute top-10 left-0 right-0 h-0.5 bg-white/40"></div>
            </div>
          </div>

          <div className="absolute bottom-16 left-0 right-0">
            <div className="absolute bottom-0 animate-drive-right">
              <div className="relative">
                <div className="w-24 h-10 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg relative shadow-lg">
                  <div className="absolute top-1 left-2 right-2 h-4 bg-gradient-to-r from-blue-900/80 to-blue-800/60 rounded"></div>
                  <div className="absolute top-2 -left-1 w-2 h-3 bg-white rounded-full animate-pulse"></div>
                  <div className="absolute top-5 -left-1 w-2 h-2 bg-amber-400 rounded-full"></div>
                </div>
                <div className="absolute -bottom-2 left-3 w-6 h-6 bg-slate-900 rounded-full border border-slate-600">
                  <div className="absolute inset-1 bg-slate-400 rounded-full animate-spin-fast"></div>
                </div>
                <div className="absolute -bottom-2 right-3 w-6 h-6 bg-slate-900 rounded-full border border-slate-600">
                  <div className="absolute inset-1 bg-slate-400 rounded-full animate-spin-fast"></div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 animate-drive-left" style={{ animationDelay: "3s" }}>
              <div className="relative">
                <div className="w-20 h-9 bg-gradient-to-r from-red-600 to-red-500 rounded-lg relative shadow-lg">
                  <div className="absolute top-1 left-2 right-2 h-3 bg-gradient-to-r from-red-900/80 to-red-800/60 rounded"></div>
                  <div className="absolute top-2 -right-1 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <div className="absolute top-4 -right-1 w-2 h-2 bg-amber-400 rounded-full"></div>
                </div>
                <div className="absolute -bottom-2 left-2 w-5 h-5 bg-slate-900 rounded-full border border-slate-600">
                  <div className="absolute inset-1 bg-slate-400 rounded-full animate-spin-fast"></div>
                </div>
                <div className="absolute -bottom-2 right-2 w-5 h-5 bg-slate-900 rounded-full border border-slate-600">
                  <div className="absolute inset-1 bg-slate-400 rounded-full animate-spin-fast"></div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 animate-drive-right-slow" style={{ animationDelay: "1s" }}>
              <div className="relative">
                <div className="w-28 h-12 bg-gradient-to-r from-green-600 to-green-500 rounded-lg relative shadow-lg">
                  <div className="absolute top-1 left-2 right-2 h-5 bg-gradient-to-r from-green-900/80 to-green-800/60 rounded"></div>
                  <div className="absolute top-2 -left-1 w-2 h-4 bg-white rounded-full animate-pulse"></div>
                  <div className="absolute top-6 -left-1 w-2 h-2 bg-amber-400 rounded-full"></div>
                </div>
                <div className="absolute -bottom-2 left-4 w-7 h-7 bg-slate-900 rounded-full border border-slate-600">
                  <div className="absolute inset-1 bg-slate-400 rounded-full animate-spin-fast"></div>
                </div>
                <div className="absolute -bottom-2 right-4 w-7 h-7 bg-slate-900 rounded-full border border-slate-600">
                  <div className="absolute inset-1 bg-slate-400 rounded-full animate-spin-fast"></div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 animate-drive-left-fast" style={{ animationDelay: "6s" }}>
              <div className="relative">
                <div className="w-22 h-10 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-lg relative shadow-lg">
                  <div className="absolute top-1 left-2 right-2 h-4 bg-gradient-to-r from-yellow-700/80 to-yellow-600/60 rounded"></div>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-black text-white text-xs flex items-center justify-center rounded-b">
                    TAXI
                  </div>
                  <div className="absolute top-2 -right-1 w-2 h-3 bg-white rounded-full animate-pulse"></div>
                  <div className="absolute top-5 -right-1 w-2 h-2 bg-amber-400 rounded-full"></div>
                </div>
                <div className="absolute -bottom-2 left-3 w-6 h-6 bg-slate-900 rounded-full border border-slate-600">
                  <div className="absolute inset-1 bg-slate-400 rounded-full animate-spin-fast"></div>
                </div>
                <div className="absolute -bottom-2 right-3 w-6 h-6 bg-slate-900 rounded-full border border-slate-600">
                  <div className="absolute inset-1 bg-slate-400 rounded-full animate-spin-fast"></div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 animate-drive-right-fast" style={{ animationDelay: "4s" }}>
              <div className="relative">
                <div className="w-26 h-8 bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg relative shadow-lg">
                  <div className="absolute top-0.5 left-2 right-2 h-3 bg-gradient-to-r from-purple-900/80 to-purple-800/60 rounded"></div>
                  <div className="absolute top-1 -left-1 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <div className="absolute top-4 -left-1 w-2 h-2 bg-amber-400 rounded-full"></div>
                </div>
                <div className="absolute -bottom-2 left-2 w-5 h-5 bg-slate-900 rounded-full border border-slate-600">
                  <div className="absolute inset-1 bg-slate-400 rounded-full animate-spin-fast"></div>
                </div>
                <div className="absolute -bottom-2 right-2 w-5 h-5 bg-slate-900 rounded-full border border-slate-600">
                  <div className="absolute inset-1 bg-slate-400 rounded-full animate-spin-fast"></div>
                </div>
              </div>
            </div>
          </div>

          {!isDay && (
            <>
              <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full animate-pulse"></div>
              <div
                className="absolute top-20 right-20 w-1 h-1 bg-white rounded-full animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
              <div
                className="absolute top-16 left-1/3 w-1 h-1 bg-white rounded-full animate-pulse"
                style={{ animationDelay: "2s" }}
              ></div>
              <div
                className="absolute top-32 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse"
                style={{ animationDelay: "0.5s" }}
              ></div>
              <div
                className="absolute top-24 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse"
                style={{ animationDelay: "3s" }}
              ></div>
              <div
                className="absolute top-40 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse"
                style={{ animationDelay: "1.5s" }}
              ></div>
            </>
          )}

          <div className="relative z-10 flex flex-col justify-center items-center text-center px-16 py-20">
            <h1
              className={`text-6xl font-bold tracking-tight mb-4 transition-colors duration-2000 ${
                isDay ? "text-white drop-shadow-lg" : "text-white"
              }`}
            >
              Car4Sure
            </h1>
            <p
              className={`text-xl font-medium transition-colors duration-2000 ${
                isDay ? "text-white/90 drop-shadow" : "text-gray-300"
              }`}
            >
              Premium insurance excellence
            </p>
          </div>

          <style jsx>{`
            @keyframes drive-right {
              0% { transform: translateX(-100px); }
              100% { transform: translateX(calc(100vw + 100px)); }
            }
            @keyframes drive-left {
              0% { transform: translateX(calc(100vw + 100px)) scaleX(-1); }
              100% { transform: translateX(-100px) scaleX(-1); }
            }
            @keyframes drive-right-slow {
              0% { transform: translateX(-100px); }
              100% { transform: translateX(calc(100vw + 100px)); }
            }
            @keyframes drive-left-fast {
              0% { transform: translateX(calc(100vw + 100px)) scaleX(-1); }
              100% { transform: translateX(-100px) scaleX(-1); }
            }
            @keyframes drive-right-fast {
              0% { transform: translateX(-100px); }
              100% { transform: translateX(calc(100vw + 100px)); }
            }
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-10px); }
            }
            @keyframes float-delayed {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-8px); }
            }
            @keyframes float-slow {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-6px); }
            }
            .animate-drive-right {
              animation: drive-right 8s linear infinite;
            }
            .animate-drive-left {
              animation: drive-left 10s linear infinite;
            }
            .animate-drive-right-slow {
              animation: drive-right-slow 12s linear infinite;
            }
            .animate-drive-left-fast {
              animation: drive-left-fast 6s linear infinite;
            }
            .animate-drive-right-fast {
              animation: drive-right-fast 5s linear infinite;
            }
            .animate-spin-fast {
              animation: spin 0.5s linear infinite;
            }
            .animate-float {
              animation: float 4s ease-in-out infinite;
            }
            .animate-float-delayed {
              animation: float-delayed 5s ease-in-out infinite;
            }
            .animate-float-slow {
              animation: float-slow 6s ease-in-out infinite;
            }
          `}</style>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-8 lg:px-12 bg-background">
          <div className="w-full max-w-lg space-y-10">
            <div className="text-center lg:hidden">
              <div className="flex justify-center mb-6">
                <div className="bg-primary/10 p-4 rounded-2xl">
                  <Shield className="h-12 w-12 text-primary" />
                </div>
              </div>
              <h2 className="text-4xl font-heading font-bold text-foreground mb-2">Car4Sure</h2>
              <p className="text-lg text-muted-foreground">Premium Insurance Management</p>
            </div>

            <Card className="border-0 shadow-2xl glass-card ring-1 ring-border/20">
              <CardHeader className="space-y-2 pb-8 pt-8">
                <CardTitle className="text-3xl font-heading font-bold text-center text-foreground">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-center text-muted-foreground text-lg">
                  Access your premium insurance dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 px-8 pb-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {Object.keys(errors).length > 0 && (
                    <div className="bg-destructive/10 border border-destructive/30 text-destructive px-5 py-4 rounded-xl text-sm font-medium">
                      {Object.values(errors).flat()[0]}
                    </div>
                  )}

                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        autoComplete="email"
                        className="pl-12 h-14 bg-input border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-base rounded-xl transition-all duration-200"
                        {...register("email")}
                      />
                    </div>
                    {displayErrors.email && <p className="text-sm text-destructive font-medium">{displayErrors.email.message}</p>}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-sm font-semibold text-foreground">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        className="pl-12 pr-12 h-14 bg-input border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-base rounded-xl transition-all duration-200"
                        {...register("password")}
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {displayErrors.password && (
                      <p className="text-sm text-destructive font-medium">{displayErrors.password.message}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-3">
                      <input
                        id="remember"
                        type="checkbox"
                        className="h-4 w-4 text-primary focus:ring-primary focus:ring-2 border-border rounded transition-colors"
                        {...register("remember")}
                      />
                      <Label htmlFor="remember" className="text-sm text-muted-foreground font-medium">
                        Keep me signed in
                      </Label>
                    </div>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-primary hover:text-primary/80 font-semibold transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl rounded-xl hover:scale-[1.02]"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                        <span>Signing you in...</span>
                      </div>
                    ) : (
                      "Access Premium Dashboard"
                    )}
                  </Button>

                  <div className="text-center pt-6">
                    <span className="text-base text-muted-foreground">
                      New to Car4Sure?{" "}
                      <Link
                        href="/register"
                        className="font-semibold text-primary hover:text-primary/80 transition-colors"
                      >
                        Join Premium Members
                      </Link>
                    </span>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}