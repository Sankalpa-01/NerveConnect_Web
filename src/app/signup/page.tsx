"use client"
import React, { useState, useEffect } from "react"
import {
  User,
  Mail,
  Lock,
  Loader2,
  AtSign,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Github,
  Chrome,
  UserPlus,
  Shield,
} from "lucide-react"
import { z } from "zod"
import { useRouter } from "next/navigation"

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  username: z.string().min(3, "Username must be at least 3 characters").max(30),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100),
})

function SignUpForm() {
  const [name, setName] = useState<string>("")
  const [username, setUsername] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false)
  const [focusedField, setFocusedField] = useState<string>("")
  const [mounted, setMounted] = useState<boolean>(false)

  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    if (!acceptTerms) {
      setError("Please accept the Terms of Service and Privacy Policy")
      setIsLoading(false)
      return
    }

    const result = signUpSchema.safeParse({
      name,
      username,
      email,
      password,
    })

    if (!result.success) {
      const firstError = result.error.issues[0].message
      setError(firstError)
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          username,
          email,
          password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Signup failed")
      } else {
        setSuccess("Account created successfully! Welcome aboard!")
        router.push("/signin")
      }
    } catch (err) {
      setError("Something went wrong")
    }
    setIsLoading(false)
  }

  const handleSocialSignUp = (provider: string) => {
    console.log(`Sign up with ${provider}`)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSubmit(e as any)
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-400 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-blue-400 rounded-full opacity-30 animate-bounce`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/25 animate-pulse">
            <UserPlus className="w-8 h-8 text-white animate-spin-slow" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-teal-100 bg-clip-text text-transparent mb-2 animate-gradient">
            Join Us Today
          </h1>
          <p
            className="text-blue-200 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            Create your account to get started
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-500/10 p-8 border border-blue-300/20 relative animate-slide-up hover:shadow-blue-500/20 transition-all duration-500">
          {/* Enhanced glassmorphism effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-teal-500/5 to-blue-500/5 rounded-3xl animate-shimmer"></div>

          <div className="relative z-10">
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              onKeyPress={handleKeyPress}
            >
              {/* Success Message */}
              {success && (
                <div className="bg-teal-500/20 border border-teal-400/30 text-teal-200 px-4 py-3 rounded-xl text-sm flex items-center space-x-2 backdrop-blur-sm animate-slide-down">
                  <CheckCircle className="w-5 h-5 animate-pulse" />
                  <span>{success}</span>
                </div>
              )}

              {/* Name Field */}
              <div
                className="space-y-2 animate-fade-in"
                style={{ animationDelay: "0.3s" }}
              >
                <label className="text-sm font-medium text-blue-100 block transition-colors duration-300">
                  Full Name
                </label>
                <div className="relative group">
                  <User
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
                      focusedField === "name"
                        ? "text-blue-400 scale-110"
                        : "text-blue-300"
                    }`}
                  />
                  <input
                    type="text"
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setName(e.target.value)
                    }
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField("")}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-blue-300/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-300 outline-none text-white placeholder-blue-200 backdrop-blur-sm hover:bg-white/15 hover:border-blue-300/30"
                    placeholder="Enter your full name"
                    disabled={isLoading}
                  />
                  <div
                    className={`absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none ${
                      focusedField === "name"
                        ? "bg-gradient-to-r from-blue-500/10 to-teal-500/10 scale-105"
                        : ""
                    }`}
                  ></div>
                </div>
              </div>

              {/* Username Field */}
              <div
                className="space-y-2 animate-fade-in"
                style={{ animationDelay: "0.4s" }}
              >
                <label className="text-sm font-medium text-blue-100 block transition-colors duration-300">
                  Username
                </label>
                <div className="relative group">
                  <AtSign
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
                      focusedField === "username"
                        ? "text-blue-400 scale-110"
                        : "text-blue-300"
                    }`}
                  />
                  <input
                    type="text"
                    value={username}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setUsername(e.target.value)
                    }
                    onFocus={() => setFocusedField("username")}
                    onBlur={() => setFocusedField("")}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-blue-300/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-300 outline-none text-white placeholder-blue-200 backdrop-blur-sm hover:bg-white/15 hover:border-blue-300/30"
                    placeholder="Choose a username"
                    disabled={isLoading}
                  />
                  <div
                    className={`absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none ${
                      focusedField === "username"
                        ? "bg-gradient-to-r from-blue-500/10 to-teal-500/10 scale-105"
                        : ""
                    }`}
                  ></div>
                </div>
              </div>

              {/* Email Field */}
              <div
                className="space-y-2 animate-fade-in"
                style={{ animationDelay: "0.5s" }}
              >
                <label className="text-sm font-medium text-blue-100 block transition-colors duration-300">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
                      focusedField === "email"
                        ? "text-blue-400 scale-110"
                        : "text-blue-300"
                    }`}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEmail(e.target.value)
                    }
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField("")}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-blue-300/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-300 outline-none text-white placeholder-blue-200 backdrop-blur-sm hover:bg-white/15 hover:border-blue-300/30"
                    placeholder="Enter your email address"
                    disabled={isLoading}
                  />
                  <div
                    className={`absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none ${
                      focusedField === "email"
                        ? "bg-gradient-to-r from-blue-500/10 to-teal-500/10 scale-105"
                        : ""
                    }`}
                  ></div>
                </div>
              </div>

              {/* Password Field */}
              <div
                className="space-y-2 animate-fade-in"
                style={{ animationDelay: "0.6s" }}
              >
                <label className="text-sm font-medium text-blue-100 block transition-colors duration-300">
                  Password
                </label>
                <div className="relative group">
                  <Lock
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
                      focusedField === "password"
                        ? "text-blue-400 scale-110"
                        : "text-blue-300"
                    }`}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPassword(e.target.value)
                    }
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField("")}
                    className="w-full pl-12 pr-12 py-3 bg-white/10 border border-blue-300/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-300 outline-none text-white placeholder-blue-200 backdrop-blur-sm hover:bg-white/15 hover:border-blue-300/30"
                    placeholder="Create a secure password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-blue-400 transition-all duration-300 hover:scale-110"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                  <div
                    className={`absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none ${
                      focusedField === "password"
                        ? "bg-gradient-to-r from-blue-500/10 to-teal-500/10 scale-105"
                        : ""
                    }`}
                  ></div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div
                className="animate-fade-in"
                style={{ animationDelay: "0.7s" }}
              >
                <label className="flex items-start space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-blue-500 bg-white/10 border-blue-300/20 rounded focus:ring-blue-500 focus:ring-2 transition-all duration-300"
                    disabled={isLoading}
                  />
                  <span className="text-sm text-blue-200 group-hover:text-blue-100 transition-colors duration-300 leading-relaxed">
                    I agree to the{" "}
                    <a
                      href="#"
                      className="text-blue-400 hover:text-blue-300 hover:underline transition-colors duration-300"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-blue-400 hover:text-blue-300 hover:underline transition-colors duration-300"
                    >
                      Privacy Policy
                    </a>
                  </span>
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-xl text-sm flex items-center space-x-2 backdrop-blur-sm animate-shake">
                  <AlertCircle className="w-5 h-5 animate-pulse" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-teal-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:shadow-xl animate-fade-in animate-glow visible block"
                style={{ animationDelay: "0.8s", visibility: "visible", display: "block" }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Create Account</span>
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                      <Shield className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}
              </button>
            </form>

            {/* Divider */}
            <div
              className="my-6 flex items-center animate-fade-in"
              style={{ animationDelay: "0.9s" }}
            >
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-300/20 to-transparent"></div>
              <span className="px-4 text-sm text-blue-200">
                or sign up with
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-300/20 to-transparent"></div>
            </div>

            {/* Social Sign Up Buttons */}
            <div
              className="grid grid-cols-2 gap-3 mb-6 animate-fade-in"
              style={{ animationDelay: "1s" }}
            >
              <button
                type="button"
                onClick={() => handleSocialSignUp("Google")}
                className="flex items-center justify-center space-x-2 py-3 px-4 bg-white/10 hover:bg-blue-500/20 border border-blue-300/20 hover:border-blue-400/30 rounded-xl transition-all duration-300 text-blue-200 hover:text-white backdrop-blur-sm transform hover:scale-105 hover:shadow-lg"
                disabled={isLoading}
              >
                <Chrome className="w-5 h-5" />
                <span className="text-sm">Google</span>
              </button>
              <button
                type="button"
                onClick={() => handleSocialSignUp("GitHub")}
                className="flex items-center justify-center space-x-2 py-3 px-4 bg-white/10 hover:bg-blue-500/20 border border-blue-300/20 hover:border-blue-400/30 rounded-xl transition-all duration-300 text-blue-200 hover:text-white backdrop-blur-sm transform hover:scale-105 hover:shadow-lg"
                disabled={isLoading}
              >
                <Github className="w-5 h-5" />
                <span className="text-sm">GitHub</span>
              </button>
            </div>

            {/* Sign In Link */}
            <div
              className="text-center animate-fade-in"
              style={{ animationDelay: "1.1s" }}
            >
              <p className="text-blue-300 text-sm">
                Already have an account?{" "}
                <a
                  href="/signin"
                  className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-all duration-300 hover:scale-105 inline-block"
                >
                  Sign in here
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="text-center mt-6 animate-fade-in"
          style={{ animationDelay: "1.2s" }}
        >
          <p className="text-blue-400 text-xs">
            By creating an account, you agree to our{" "}
            <a
              href="#"
              className="text-blue-300 hover:text-blue-200 hover:underline transition-colors duration-300"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-blue-300 hover:text-blue-200 hover:underline transition-colors duration-300"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-down {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        @keyframes glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.4s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        .animate-shimmer {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(59, 130, 246, 0.1),
            transparent
          );
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        /* Ensure button is always visible */
        .visible {
          visibility: visible !important;
          display: block !important;
          opacity: 1 !important;
        }
      `}</style>
    </div>
  )
}

export default SignUpForm;