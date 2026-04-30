"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";

type Step = "email" | "reset" | "done";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1 — send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/auth/forgot-password", { email });
      toast.success("If that email exists, a reset code was sent.");
      setStep("reset");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Step 2 — verify OTP + set new password
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await axios.post("/api/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      setStep("done");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Reset failed. Check your code and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await axios.post("/api/auth/forgot-password", { email });
      toast.success("A new code was sent.");
    } catch {
      toast.error("Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:border-orange-400 focus:ring-0 transition-all outline-none bg-stone-50 focus:bg-white text-sm";
  const labelCls =
    "block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="min-h-screen flex items-stretch">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-stone-950 text-white flex-col overflow-hidden self-stretch">
        <div className="absolute inset-0">
          <img
            src="/headerBanner.webp"
            alt=""
            className="w-full h-full object-cover scale-[1.04]"
            style={{ filter: "saturate(1.3) brightness(0.55) sepia(0.15)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-900/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-orange-950/30 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-orange-500/20 to-transparent" />

        {/* Logo */}
        <div className="relative z-10 p-10 pt-12">
          <Link href="/" className="flex items-center gap-2.5">
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
            <Image src="/logo.png" alt="Spicylon" width={100} height={34} className="h-8 w-auto object-contain" />
          </Link>
        </div>

        {/* Bottom content */}
        <div className="relative z-10 flex-1 flex flex-col justify-end px-10 pb-14">
          <div className="mb-5">
            <span className="inline-flex items-center gap-1.5 text-orange-400 text-xs font-bold uppercase tracking-[0.2em] border border-orange-500/25 rounded-full px-3 py-1.5 bg-orange-500/8 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
              Account Security
            </span>
          </div>
          <h2 className="text-5xl xl:text-[3.5rem] font-black leading-[0.95] tracking-tight mb-5">
            Secure your
            <br />
            <span className="text-orange-400">Spice Account.</span>
          </h2>
          <p className="text-stone-400 text-sm leading-relaxed max-w-[270px]">
            We&apos;ll send a one-time code to your email so you can reset your
            password safely.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div
        className="w-full lg:w-1/2 flex items-center justify-center relative px-4 py-12 sm:px-8 overflow-hidden self-stretch"
        style={{ background: "#fafaf9" }}
      >
        <div className="absolute top-0 right-0 w-72 h-72 bg-orange-100/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-stone-100/80 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/">
              <Image src="/logo.png" alt="Spicylon" width={130} height={44} className="h-11 w-auto object-contain mx-auto" />
            </Link>
          </div>

          <div className="bg-white rounded-3xl shadow-lg border border-stone-100/80 overflow-hidden">
            {/* Card header */}
            <div className="relative px-8 pt-8 pb-6 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute top-0 right-8 w-3 h-3 bg-orange-400 rounded-full mt-4" />
              <div className="relative z-10">
                {step === "email" && (
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
                          d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-black text-stone-900">
                      Forgot your password?
                    </h3>
                    <p className="text-stone-400 text-sm mt-1">
                      Enter your email and we&apos;ll send a reset code.
                    </p>
                  </>
                )}
                {step === "reset" && (
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
                      Enter your reset code
                    </h3>
                    <p className="text-stone-400 text-sm mt-1">
                      Code sent to{" "}
                      <span className="font-bold text-stone-700">{email}</span>
                    </p>
                  </>
                )}
                {step === "done" && (
                  <>
                    <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center mb-4">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-black text-stone-900">
                      Password reset!
                    </h3>
                    <p className="text-stone-400 text-sm mt-1">
                      Your password has been updated successfully.
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="px-8 pb-8">
              {/* ── Step 1: Email ──────────────────── */}
              {step === "email" && (
                <form onSubmit={handleSendOtp} className="space-y-5">
                  <div>
                    <label className={labelCls}>Email Address</label>
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
                        className={inputCls}
                        placeholder="you@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
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
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Reset Code
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
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-stone-400 pt-1">
                    Remember your password?{" "}
                    <Link
                      href="/login"
                      className="text-orange-600 font-bold hover:text-orange-500 transition-colors"
                    >
                      Sign in
                    </Link>
                  </p>
                </form>
              )}

              {/* ── Step 2: OTP + New Password ─────── */}
              {step === "reset" && (
                <form onSubmit={handleReset} className="space-y-4">
                  <div>
                    <label className={labelCls}>6-Digit Code</label>
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
                    <p className="text-xs text-stone-400 text-center mt-1.5">
                      Check your inbox — the code expires in 15 minutes
                    </p>
                  </div>

                  <div>
                    <label className={labelCls}>New Password</label>
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
                        minLength={6}
                        className={inputCls}
                        placeholder="Min. 6 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Confirm Password</label>
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
                        className={`${inputCls} ${
                          confirmPassword && newPassword !== confirmPassword
                            ? "border-red-300 focus:border-red-400"
                            : ""
                        }`}
                        placeholder="Repeat new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-xs text-red-500 mt-1 font-medium">
                        Passwords do not match
                      </p>
                    )}
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
                        Resetting...
                      </>
                    ) : (
                      <>
                        Reset Password
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
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setStep("email");
                        setOtp("");
                      }}
                      className="text-stone-400 hover:text-stone-700 font-medium text-xs transition-colors flex items-center gap-1"
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
                      Change email
                    </button>
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={loading}
                      className="text-orange-600 hover:text-orange-500 font-bold text-xs transition-colors disabled:opacity-50"
                    >
                      Resend Code
                    </button>
                  </div>
                </form>
              )}

              {/* ── Step 3: Done ───────────────────── */}
              {step === "done" && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
                    <p className="text-sm text-green-700 font-medium">
                      You can now sign in with your new password.
                    </p>
                  </div>
                  <button
                    onClick={() => router.push("/login")}
                    className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-black rounded-xl transition-all text-sm shadow-md flex items-center justify-center gap-2"
                  >
                    Sign In
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
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer links */}
          <p className="text-center text-xs text-stone-400 mt-6">
            <Link
              href="/privacy-policy"
              className="hover:text-stone-600 transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="mx-2">·</span>
            <Link
              href="/terms-of-service"
              className="hover:text-stone-600 transition-colors"
            >
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
