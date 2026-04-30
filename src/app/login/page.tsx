"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useStore } from "@/store/useStore";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showOtp, setShowOtp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setUser = useStore((state) => state.setUser);
  const t = useTranslations("Auth");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const payload = isLogin ? { email, password } : { name, email, password };

      const { data } = await axios.post(endpoint, payload);

      if (data.requiresVerification) {
        setShowOtp(true);
        toast.success(data.message);
        setLoading(false);
        return;
      }

      setUser(data.user);
      toast.success(isLogin ? t("welcomeBack") : t("accountCreated"));
      router.push("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || t("error"));
    } finally {
      if (!showOtp) setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/verify-email", {
        email,
        otp,
      });
      setUser(data.user);
      toast.success("Email verified successfully!");
      router.push("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/resend-otp", { email });
      toast.success(data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/auth/google", {
        token: credentialResponse.credential,
      });
      setUser(data.user);
      toast.success("Successfully logged in with Google!");
      router.push("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
    >
      <div className="min-h-screen flex items-stretch">
        {/* Left Panel */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-stone-950 text-white flex-col overflow-hidden self-stretch">
          {/* Background image — warm toned */}
          <div className="absolute inset-0">
            <img
              src="/headerBanner.webp"
              alt=""
              className="w-full h-full object-cover scale-[1.04]"
              style={{ filter: "saturate(1.3) brightness(0.55) sepia(0.15)" }}
            />
            {/* Gradient layers */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-900/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-orange-950/30 to-transparent" />
          </div>

          {/* Ambient warm glow at bottom */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Right border accent */}
          <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-orange-500/20 to-transparent" />
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

          {/* Logo — top left */}
          <div className="relative z-10 p-10 pt-12">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-900/50">
                <svg
                  className="w-3.5 h-3.5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M5 3l14 9-14 9V3z"
                  />
                </svg>
              </div>
              <Image
                src="/logo.png"
                alt="Spicylon"
                width={100}
                height={34}
                className="h-8 w-auto object-contain"
              />
            </div>
          </div>

          {/* Main content — pinned to bottom */}
          <div className="relative z-10 flex-1 flex flex-col justify-end px-10 pb-14">
            {/* Live badge */}
            <div className="mb-5">
              <span className="inline-flex items-center gap-1.5 text-orange-400 text-xs font-bold uppercase tracking-[0.2em] border border-orange-500/25 rounded-full px-3 py-1.5 bg-orange-500/8 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                Est. 2026 · Sri Lanka
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-5xl xl:text-[3.5rem] font-black leading-[0.95] tracking-tight mb-5">
              The Ancient
              <br />
              <span className="text-orange-400">Spice Route,</span>
              <br />
              Redefined.
            </h2>

            {/* Subtext */}
            <p className="text-stone-400 text-sm leading-relaxed max-w-[270px] mb-8">
              Single-origin Ceylon spices — harvested from highland farms and
              shipped to your door.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2">
              {[
                "Authentic Ceylon",
                "Worldwide Shipping",
                "Encrypted Payments",
              ].map((label) => (
                <span
                  key={label}
                  className="flex items-center gap-1.5 text-xs font-semibold text-stone-300 bg-white/6 border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-sm"
                >
                  <span className="w-1 h-1 rounded-full bg-orange-400 flex-shrink-0" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div
          className="w-full lg:w-1/2 flex items-center justify-center relative px-4 py-12 sm:px-8 overflow-hidden self-stretch"
          style={{ background: "#fafaf9" }}
        >
          {/* Subtle background orbs */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-orange-100/60 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-stone-100/80 rounded-full blur-3xl pointer-events-none" />

          <div className="w-full max-w-md relative z-10">
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-8">
              <Image
                src="/logo.png"
                alt="Spicylon"
                width={130}
                height={44}
                className="h-11 w-auto object-contain mx-auto"
              />
            </div>

            {/* Tab switcher (only shown when not in OTP mode) */}
            {!showOtp && (
              <div className="flex bg-stone-100 rounded-2xl p-1 mb-7">
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${isLogin ? "bg-white shadow-sm text-stone-900" : "text-stone-500 hover:text-stone-700"}`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${!isLogin ? "bg-white shadow-sm text-stone-900" : "text-stone-500 hover:text-stone-700"}`}
                >
                  Create Account
                </button>
              </div>
            )}

            <div className="bg-white rounded-3xl shadow-lg border border-stone-100/80 overflow-hidden">
              {/* Card header */}
              <div className="relative px-8 pt-8 pb-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute top-0 right-8 w-3 h-3 bg-orange-400 rounded-full mt-4" />
                <div className="relative z-10">
                  {showOtp ? (
                    <>
                      <div className="w-12 h-12 bg-orange-50 border border-orange-100 rounded-2xl flex items-center justify-center mb-4">
                        <svg
                          className="w-6 h-6 text-orange-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-black text-stone-900">
                        Check your inbox
                      </h3>
                      <p className="text-stone-400 text-sm mt-1">
                        Code sent to{" "}
                        <span className="font-bold text-stone-700">
                          {email}
                        </span>
                      </p>
                    </>
                  ) : isLogin ? (
                    <>
                      <div className="w-12 h-12 bg-stone-900 rounded-2xl flex items-center justify-center mb-4">
                        <svg
                          className="w-5 h-5 text-orange-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-black text-stone-900">
                        Welcome back
                      </h3>
                      <p className="text-stone-400 text-sm mt-1">
                        Sign in to your Spicylon account
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center mb-4">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-black text-stone-900">
                        Create your account
                      </h3>
                      <p className="text-stone-400 text-sm mt-1">
                        Join Spicylon and start your spice journey
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="px-8 pb-8">
                {showOtp ? (
                  <form onSubmit={handleVerifyOtp} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                        Verification Code
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        className="w-full px-4 py-4 rounded-xl border-2 border-stone-200 focus:border-orange-400 focus:ring-0 transition-all outline-none text-center text-3xl font-black tracking-[0.6em] bg-stone-50 focus:bg-white"
                        placeholder="------"
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/\D/g, ""))
                        }
                      />
                      <p className="text-xs text-stone-400 text-center mt-2">
                        Enter the 6-digit code we emailed you
                      </p>
                    </div>
                    <button
                      type="submit"
                      disabled={loading || otp.length !== 6}
                      className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-black rounded-xl transition-all text-sm shadow-md disabled:opacity-40 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <svg
                            className="w-4 h-4 animate-spin"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8z"
                            />
                          </svg>
                          Verifying...
                        </>
                      ) : (
                        "Verify & Continue"
                      )}
                    </button>
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        className="text-stone-400 hover:text-stone-700 font-medium text-xs transition-colors flex items-center gap-1"
                        onClick={() => setShowOtp(false)}
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                        Back
                      </button>
                      <button
                        type="button"
                        className="text-orange-600 hover:text-orange-500 font-bold text-xs transition-colors"
                        onClick={handleResendOtp}
                        disabled={loading}
                      >
                        Resend Code
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                      <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                          {t("nameLabel")}
                        </label>
                        <div className="relative">
                          <svg
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          <input
                            type="text"
                            required
                            suppressHydrationWarning
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:border-orange-400 focus:ring-0 transition-all outline-none bg-stone-50 focus:bg-white text-sm"
                            placeholder="Your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                        {t("emailLabel")}
                      </label>
                      <div className="relative">
                        <svg
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <input
                          type="email"
                          required
                          suppressHydrationWarning
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:border-orange-400 focus:ring-0 transition-all outline-none bg-stone-50 focus:bg-white text-sm"
                          placeholder="you@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider">
                          {t("passwordLabel")}
                        </label>
                        {isLogin && (
                          <Link
                            href="/forgot-password"
                            className="text-xs text-orange-500 hover:text-orange-600 font-bold transition-colors"
                          >
                            Forgot password?
                          </Link>
                        )}
                      </div>
                      <div className="relative">
                        <svg
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                        <input
                          type="password"
                          required
                          suppressHydrationWarning
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:border-orange-400 focus:ring-0 transition-all outline-none bg-stone-50 focus:bg-white text-sm"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-xl transition-all shadow-md shadow-orange-100 disabled:opacity-50 text-sm flex items-center justify-center gap-2 mt-2"
                    >
                      {loading ? (
                        <>
                          <svg
                            className="w-4 h-4 animate-spin"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8z"
                            />
                          </svg>
                          {isLogin ? t("signingIn") : t("signingUp")}
                        </>
                      ) : (
                        <>
                          {isLogin ? t("signInBtn") : t("signUpBtn")}
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </>
                      )}
                    </button>

                    <div className="relative flex items-center py-1">
                      <div className="flex-grow border-t border-stone-100" />
                      <span className="flex-shrink-0 mx-4 text-stone-300 text-xs font-bold uppercase tracking-widest">
                        or
                      </span>
                      <div className="flex-grow border-t border-stone-100" />
                    </div>

                    <div className="flex justify-center">
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => toast.error("Google login failed")}
                        theme="outline"
                        shape="pill"
                        size="large"
                        width="100%"
                      />
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Bottom switch link */}
            {!showOtp && (
              <p className="text-center text-sm text-stone-500 mt-6">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <button
                  type="button"
                  className="text-orange-600 hover:text-orange-500 font-bold transition-colors"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? t("switchRegister") : t("switchLogin")}
                </button>
              </p>
            )}

            {/* Legal */}
            <p className="text-center text-xs text-stone-400 mt-4 leading-relaxed">
              By continuing, you agree to our{" "}
              <Link
                href="/terms-of-service"
                className="underline hover:text-stone-600 transition-colors"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"
                className="underline hover:text-stone-600 transition-colors"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
