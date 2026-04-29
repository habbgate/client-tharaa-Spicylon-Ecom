"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import axios from "axios";
import toast from "react-hot-toast";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiOutlineCog,
  HiOutlineTrash,
  HiDownload,
} from "react-icons/hi";
import Image from "next/image";
import Link from "next/link";
import { generateInvoice } from "@/lib/generateInvoice";

export default function ProfilePage() {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const router = useRouter();
  const t = useTranslations("Profile");

  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    setFormData({
      name: user.name || "",
      email: user.email || "",
      address: user?.address?.address || "",
      city: user?.address?.city || "",
      postalCode: user?.address?.postalCode || "",
      country: user?.address?.country || "",
      phone: user?.address?.phone || "",
    });

    if (activeTab === "orders") {
      fetchOrders();
    }
  }, [user, router, activeTab]);

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const { data } = await axios.get(
        `/api/user/orders?userId=${user._id || user.id}`,
      );
      setOrders(data);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.put("/api/user/profile", {
        userId: user._id || user.id,
        ...formData,
      });
      setUser(data);
      toast.success(t("saved"));
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm(t("deleteConfirm"))) {
      try {
        await axios.delete(`/api/user/profile?userId=${user._id || user.id}`);
        setUser(null);
        useStore.getState().clearCart();
        toast.success(t("deleted"));
        router.push("/");
      } catch (error) {
        toast.error("Failed to delete account");
      }
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden sticky top-24">
            {/* Profile Header */}
            <div className="p-6 text-center bg-gradient-to-br from-stone-900 to-stone-800 text-white relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, #f97316 1px, transparent 0)",
                  backgroundSize: "20px 20px",
                }}
              />
              <div className="w-16 h-16 mx-auto bg-orange-500 rounded-full flex items-center justify-center text-2xl font-black mb-3 shadow-lg relative z-10">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-lg font-black relative z-10">{user.name}</h2>
              <p className="text-stone-400 text-xs mt-0.5 relative z-10 truncate">
                {user.email}
              </p>
            </div>
            <nav className="p-3 space-y-1">
              {[
                {
                  tab: "profile",
                  icon: <HiOutlineUser className="text-lg" />,
                  label: t("tabs.profile"),
                },
                {
                  tab: "orders",
                  icon: <HiOutlineShoppingBag className="text-lg" />,
                  label: t("tabs.orders"),
                },
                {
                  tab: "settings",
                  icon: <HiOutlineCog className="text-lg" />,
                  label: t("tabs.settings"),
                },
              ].map(({ tab, icon, label }) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm ${
                    activeTab === tab
                      ? tab === "settings"
                        ? "bg-stone-900 text-white"
                        : "bg-orange-50 text-orange-600"
                      : "text-stone-500 hover:bg-stone-50 hover:text-stone-700"
                  }`}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow">
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 sm:p-10">
            {activeTab === "profile" && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-black tracking-tight">
                    {t("personalInfo")}
                  </h2>
                  <p className="text-stone-400 text-sm mt-1">
                    Update your name and shipping address
                  </p>
                </div>
                <form onSubmit={handleUpdateProfile} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                        {t("name")}
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-orange-500 outline-none bg-stone-50 focus:bg-white transition-all text-sm"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                        {t("email")}
                      </label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 rounded-xl border border-stone-100 bg-stone-50 text-stone-400 cursor-not-allowed outline-none text-sm"
                        value={formData.email}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-100">
                    <h3 className="text-sm font-black text-stone-700 uppercase tracking-wider mb-4">
                      {t("shippingAddress")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                          {t("address")}
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-orange-500 outline-none bg-stone-50 focus:bg-white transition-all text-sm"
                          value={formData.address}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                          {t("city")}
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-orange-500 outline-none bg-stone-50 focus:bg-white transition-all text-sm"
                          value={formData.city}
                          onChange={(e) =>
                            setFormData({ ...formData, city: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                          {t("postalCode")}
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-orange-500 outline-none bg-stone-50 focus:bg-white transition-all text-sm"
                          value={formData.postalCode}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              postalCode: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                          {t("country")}
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-orange-500 outline-none bg-stone-50 focus:bg-white transition-all text-sm"
                          value={formData.country}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              country: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                          {t("phone")}
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-orange-500 outline-none bg-stone-50 focus:bg-white transition-all text-sm"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-3 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-all shadow-md text-sm disabled:opacity-50"
                    >
                      {loading ? "..." : t("saveChanges")}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "orders" && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-black tracking-tight">
                    {t("myOrders")}
                  </h2>
                  <p className="text-stone-400 text-sm mt-1">
                    Your complete order history
                  </p>
                </div>
                {ordersLoading ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-32 bg-stone-100 rounded-2xl"
                      ></div>
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12 bg-stone-50 rounded-2xl border border-stone-200 border-dashed">
                    <HiOutlineShoppingBag className="mx-auto text-6xl text-stone-300 mb-4" />
                    <p className="text-stone-500 font-medium mb-6">
                      {t("noOrders")}
                    </p>
                    <Link
                      href="/products"
                      className="px-6 py-3 bg-orange-600 text-white font-bold rounded-xl"
                    >
                      Browse Spices
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order: any) => (
                      <div
                        key={order._id}
                        className="border border-stone-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="bg-stone-50 px-6 py-4 border-b border-stone-200 flex flex-wrap gap-4 justify-between items-center">
                          <div>
                            <p className="text-xs text-stone-500 uppercase font-bold tracking-wider">
                              {t("orderId")}
                            </p>
                            <p className="font-mono font-bold text-stone-900">
                              {order._id.slice(-8)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-stone-500 uppercase font-bold tracking-wider">
                              {t("date")}
                            </p>
                            <p className="font-bold text-stone-900">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-stone-500 uppercase font-bold tracking-wider">
                              {t("total")}
                            </p>
                            <p className="font-bold text-stone-900">
                              {order.currency} {order.totalPrice.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <span
                              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${order.isDelivered ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                            >
                              {order.isDelivered
                                ? t("delivered")
                                : t("processing")}
                            </span>
                            <button
                              onClick={() => generateInvoice(order)}
                              className="px-4 py-1.5 flex items-center gap-2 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors"
                              title="Download Invoice"
                            >
                              <HiDownload className="text-sm" />
                              Invoice
                            </button>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex flex-wrap gap-4">
                            {order.orderItems.map((item: any, idx: number) => (
                              <div
                                key={idx}
                                className="flex items-center gap-3 bg-stone-50 pr-4 rounded-xl border border-stone-100 overflow-hidden"
                              >
                                <div className="h-14 w-14 relative bg-stone-200">
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-bold text-sm text-stone-900 line-clamp-1 max-w-[150px]">
                                    {item.name}
                                  </p>
                                  <p className="text-xs text-stone-500">
                                    Qty: {item.quantity}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-black tracking-tight">
                    {t("tabs.settings")}
                  </h2>
                  <p className="text-stone-400 text-sm mt-1">
                    Manage your account preferences
                  </p>
                </div>
                <div className="border border-red-200 bg-red-50 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-red-100 text-red-600 rounded-xl mt-0.5 flex-shrink-0">
                      <HiOutlineTrash className="text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-red-900 mb-1">
                        {t("dangerZone")}
                      </h3>
                      <p className="text-red-700/70 mb-5 text-sm max-w-lg">
                        {t("deleteConfirm")}
                      </p>
                      <button
                        onClick={handleDeleteAccount}
                        className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-sm text-sm"
                      >
                        {t("deleteAccount")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
