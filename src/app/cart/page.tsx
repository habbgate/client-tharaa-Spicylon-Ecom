"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import Image from "next/image";
import Link from "next/link";
import {
  HiOutlineTrash,
  HiOutlinePlus,
  HiOutlineMinus,
  HiOutlineArrowRight,
  HiOutlineShoppingBag,
} from "react-icons/hi";
import axios from "axios";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, user, currency } = useStore();
  const t = useTranslations("Cart");

  const [deliveryAmount, setDeliveryAmount] = useState(0);
  const [guestEmail, setGuestEmail] = useState("");
  const [shipping, setShipping] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    axios
      .get("/api/settings")
      .then(({ data }) => {
        // Total item count across all cart lines
        const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

        // Determine which tier key applies
        let tierKey: string;
        if (totalQty <= 3) tierKey = "t1";
        else if (totalQty <= 6) tierKey = "t2";
        else if (totalQty <= 10) tierKey = "t3";
        else tierKey = "t4";

        // Try tier-specific cost first, fall back to base cost
        const tierEntry = data.find(
          (s: any) => s.key === `deliveryTier_${currency}_${tierKey}`,
        );
        const tierValue = tierEntry ? Number(tierEntry.value) : 0;

        if (tierValue > 0) {
          setDeliveryAmount(tierValue);
        } else {
          const base = data.find(
            (s: any) => s.key === "deliveryCost_" + currency,
          );
          if (base) setDeliveryAmount(Number(base.value));
        }
      })
      .catch(console.error);

    if (user) {
      setShipping({
        fullName: user.name || "",
        address: user.address?.address || "",
        city: user.address?.city || "",
        postalCode: user.address?.postalCode || "",
        country: user.address?.country || "",
        phone: user.address?.phone || "",
      });
    }
  }, [user, currency, cart]);

  const total = cart.reduce((acc, item) => acc + (item.prices?.[currency] || item.price) * item.quantity, 0);

  const handleCheckout = async () => {
    // Guest checkout: require an email if not logged in
    if (!user && !guestEmail.trim()) {
      toast.error("Please enter your email to proceed.");
      return;
    }

    if (
      !shipping.fullName ||
      !shipping.address ||
      !shipping.city ||
      !shipping.phone
    ) {
      toast.error("Please fill out all required delivery details.");
      return;
    }

    const emailForCheckout = user ? user.email : guestEmail.trim();

    try {
      // Create the order — userId is optional for guests
      const orderPayload: any = {
        orderItems: cart.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          image: i.image,
          price: i.prices?.[currency] || i.price,
          product: i.id,
        })),
        shippingAddress: shipping,
        paymentMethod: "Stripe",
        itemsPrice: total,
        shippingPrice: deliveryAmount,
        totalPrice: total + deliveryAmount,
        currency: currency,
      };
      if (user) {
        orderPayload.userId = user._id || user.id;
      } else {
        orderPayload.guestEmail = emailForCheckout;
      }

      const orderRes = await axios.post("/api/orders", orderPayload);

      // Pass the created orderId to Stripe checkout
      const { data } = await axios.post("/api/checkout", {
        items: cart.map(i => ({ ...i, price: i.prices?.[currency] || i.price })),
        email: emailForCheckout,
        currency: currency,
        orderId: orderRes.data._id,
        deliveryAmount,
      });

      if (data.url) {
        window.location.href = data.url;
      } else if (data.message) {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || t("errorCheck"));
      console.error(error);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-28 h-28 bg-stone-100 rounded-full flex items-center justify-center mb-8">
          <HiOutlineShoppingBag className="w-14 h-14 text-stone-300" />
        </div>
        <h2 className="text-4xl font-black mb-3 tracking-tighter">
          {t("emptyHeading")}
        </h2>
        <p className="text-stone-400 mb-8 max-w-sm">{t("emptySub")}</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-10 py-4 bg-orange-600 text-white font-bold rounded-full hover:bg-orange-500 transition-all shadow-lg shadow-orange-200"
        >
          {t("browseBtn")}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tighter italic">
          {t("title")} <span className="text-orange-600">{t("titleSpan")}</span>
        </h1>
        <p className="text-stone-400 mt-2">
          {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-3/5 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-2xl border border-stone-100 hover:border-orange-100 hover:shadow-md transition-all flex flex-col sm:flex-row items-center gap-5"
            >
              <div className="relative h-24 w-24 rounded-xl overflow-hidden flex-shrink-0 bg-stone-50">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-grow min-w-0 text-center sm:text-left">
                <h3 className="text-base font-bold mb-0.5 truncate">
                  {item.name}
                </h3>
                <p className="text-orange-600 font-bold text-sm">
                  {currency} {(item.prices?.[currency] || item.price).toFixed(2)}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="flex items-center bg-stone-100 rounded-xl p-1">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, Math.max(1, item.quantity - 1))
                    }
                    className="p-1.5 hover:bg-white rounded-lg transition-colors"
                  >
                    <HiOutlineMinus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center font-bold text-sm">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1.5 hover:bg-white rounded-lg transition-colors"
                  >
                    <HiOutlinePlus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <span className="font-black text-stone-900 w-20 text-right text-sm">
                  {currency} {(item.price * item.quantity).toFixed(2)}
                </span>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-1.5 text-stone-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                >
                  <HiOutlineTrash className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}

          {/* Delivery Form */}
          <div className="bg-white rounded-2xl border border-stone-100 p-6 mt-6">
            <h2 className="text-xl font-black mb-5 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-orange-600 text-white text-xs font-black flex items-center justify-center">
                1
              </span>
              Delivery Details
            </h2>

            {/* Guest email — only shown when not logged in */}
            {!user && (
              <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                  Your Email *{" "}
                  <span className="normal-case font-normal text-stone-400">
                    (for order confirmation)
                  </span>
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-orange-500 outline-none bg-white text-sm"
                  placeholder="your@email.com"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-orange-500 outline-none bg-stone-50 focus:bg-white transition-all text-sm"
                  required
                  value={shipping.fullName}
                  onChange={(e) =>
                    setShipping({ ...shipping, fullName: e.target.value })
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                  Street Address *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-orange-500 outline-none bg-stone-50 focus:bg-white transition-all text-sm"
                  required
                  value={shipping.address}
                  onChange={(e) =>
                    setShipping({ ...shipping, address: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-orange-500 outline-none bg-stone-50 focus:bg-white transition-all text-sm"
                  required
                  value={shipping.city}
                  onChange={(e) =>
                    setShipping({ ...shipping, city: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                  Postal Code
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-orange-500 outline-none bg-stone-50 focus:bg-white transition-all text-sm"
                  value={shipping.postalCode}
                  onChange={(e) =>
                    setShipping({ ...shipping, postalCode: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                  Country
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-orange-500 outline-none bg-stone-50 focus:bg-white transition-all text-sm"
                  value={shipping.country}
                  onChange={(e) =>
                    setShipping({ ...shipping, country: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                  Phone *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-orange-500 outline-none bg-stone-50 focus:bg-white transition-all text-sm"
                  required
                  value={shipping.phone}
                  onChange={(e) =>
                    setShipping({ ...shipping, phone: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-2/5">
          <div className="bg-stone-950 rounded-3xl p-8 text-white sticky top-24 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-600/10 rounded-full -mr-24 -mt-24 blur-3xl pointer-events-none" />

            <h2 className="text-2xl font-black mb-2 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-orange-600 text-white text-xs font-black flex items-center justify-center">
                2
              </span>
              {t("summary")}
            </h2>

            {/* Items list */}
            <div className="mt-6 mb-6 space-y-3 max-h-52 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-sm">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="flex-grow text-stone-300 truncate">
                    {item.name}
                  </span>
                  <span className="text-white font-bold flex-shrink-0">
                    ×{item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-stone-800 pt-5 mb-6">
              <div className="flex justify-between text-stone-400 font-medium text-sm">
                <span>{t("subtotal")}</span>
                <span>
                  {currency} {total.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-stone-400 font-medium text-sm">
                <span>{t("shipping")}</span>
                <span>
                  {currency} {deliveryAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-black pt-3 border-t border-stone-800 text-white">
                <span>{t("total")}</span>
                <span className="text-orange-400">
                  {currency} {(total + deliveryAmount).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 text-base"
            >
              {t("checkoutBtn")}
              <HiOutlineArrowRight className="h-5 w-5" />
            </button>

            <div className="mt-5 flex items-center justify-center gap-2 text-stone-500 text-xs">
              <svg
                className="w-3.5 h-3.5"
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
              <span className="uppercase font-bold tracking-widest">
                {t("secure")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
