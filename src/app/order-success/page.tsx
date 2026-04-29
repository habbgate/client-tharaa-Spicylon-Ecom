"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/store/useStore";
import { HiCheckCircle, HiDownload } from "react-icons/hi";
import { useTranslations } from "next-intl";
import axios from "axios";
import { generateInvoice } from "@/lib/generateInvoice";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("orderId");
  const { clearCart } = useStore();
  const t = useTranslations("OrderSuccess");
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (sessionId) {
      clearCart();
    }

    const finalizeOrder = async () => {
      if (orderId) {
        try {
          const { data } = await axios.put(`/api/orders/${orderId}/pay`);
          setOrder(data);
        } catch (error) {
          console.error(error);
        }
      }
    };

    finalizeOrder();
  }, [sessionId, orderId, clearCart]);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg text-center">
        {/* Animated check circle */}
        <div className="w-24 h-24 bg-green-50 border-4 border-green-100 rounded-full flex items-center justify-center mx-auto mb-7 shadow-lg shadow-green-100">
          <HiCheckCircle className="w-14 h-14 text-green-500" />
        </div>

        <span className="inline-block text-xs font-bold uppercase tracking-widest text-green-600 bg-green-50 border border-green-100 rounded-full px-3 py-1 mb-4">
          Order Confirmed
        </span>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 text-stone-900">
          {t("title")}
        </h1>
        <p className="text-stone-500 text-base leading-relaxed mb-8 max-w-sm mx-auto">
          {t("message")}
        </p>

        {/* Order details card */}
        {order && (
          <div className="bg-white border border-stone-100 rounded-2xl p-6 mb-8 shadow-sm text-left space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-stone-400 font-medium">Order ID</span>
              <span className="font-mono font-bold text-stone-700">
                #{order._id?.slice(-8).toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-stone-400 font-medium">Total Paid</span>
              <span className="font-black text-stone-900 text-base">
                {order.currency} {order.totalPrice?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-stone-400 font-medium">Status</span>
              <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-100">
                Processing
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-7 py-3 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-all text-sm shadow-md text-center"
          >
            {t("homeBtn")}
          </Link>
          <Link
            href="/profile"
            className="px-7 py-3 bg-orange-50 text-orange-700 border border-orange-100 font-bold rounded-xl hover:bg-orange-100 transition-all text-sm text-center"
          >
            View My Orders
          </Link>
          {order && (
            <button
              onClick={() => generateInvoice(order)}
              className="px-7 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-all flex items-center justify-center gap-2 text-sm shadow-md"
            >
              <HiDownload className="text-base" />
              Download Invoice
            </button>
          )}
        </div>

        <p className="text-stone-400 text-xs mt-8">
          A confirmation email has been sent to your registered address.
        </p>
      </div>
    </div>
  );
}
