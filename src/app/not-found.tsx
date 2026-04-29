import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-stone-950 text-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background dot grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #f97316 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg">
        {/* 404 large number */}
        <div className="text-[9rem] sm:text-[12rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-stone-600 to-stone-800 select-none mb-2">
          404
        </div>

        <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-4">
          Page Not Found
        </h1>
        <p className="text-stone-400 text-base leading-relaxed mb-10">
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back on the spice trail.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-7 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition-all text-sm shadow-md"
          >
            Back to Home
          </Link>
          <Link
            href="/products"
            className="px-7 py-3 bg-stone-800 hover:bg-stone-700 text-white font-bold rounded-xl transition-all text-sm border border-stone-700"
          >
            Browse Products
          </Link>
          <Link
            href="/contact"
            className="px-7 py-3 bg-transparent border border-stone-700 hover:border-stone-500 text-stone-300 font-bold rounded-xl transition-all text-sm"
          >
            Get Help
          </Link>
        </div>
      </div>
    </div>
  );
}
