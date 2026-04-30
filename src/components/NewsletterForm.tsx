"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function NewsletterForm({
  placeholder,
  buttonLabel,
}: {
  placeholder: string;
  buttonLabel: string;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await axios.post("/api/newsletter", { email });
      toast.success("You're subscribed!");
      setDone(true);
      setEmail("");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Something went wrong.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="flex items-center gap-3 px-5 py-3.5 bg-green-50 border border-green-200 rounded-xl text-green-700 font-bold text-sm max-w-md">
        <svg
          className="w-5 h-5 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        You&apos;re on the list — thanks!
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 w-full max-w-md"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        required
        className="px-5 py-3.5 rounded-xl flex-1 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white shadow-sm border border-orange-100 text-sm"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-7 py-3.5 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-all shadow-lg text-sm whitespace-nowrap disabled:opacity-60"
      >
        {loading ? "Joining…" : buttonLabel}
      </button>
    </form>
  );
}
