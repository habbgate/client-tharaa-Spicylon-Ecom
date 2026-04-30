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
  HiOutlineLockClosed,
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
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Profile form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  // Change password form
  const [pwData, setPwData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pwLoading, setPwLoading] = useState(false);

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
    if (activeTab === "orders") fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router, activeTab]);

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const { data } = await axios.get(
        `/api/user/orders?userId=${user._id || user.id}`,
      );
      setOrders(data);
    } catch {
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

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwData.newPassword !== pwData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (pwData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setPwLoading(true);
    try {
      await axios.post("/api/user/change-password", {
        currentPassword: pwData.currentPassword,
        newPassword: pwData.newPassword,
      });
      toast.success("Password changed successfully");
      setPwData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setPwLoading(false);
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
      } catch {
        toast.error("Failed to delete account");
      }
    }
  };

  // Derived stats
  const totalOrders = orders.length;
  const totalSpent = orders.reduce(
    (sum: number, o: any) => sum + (o.totalPrice || 0),
    0,
  );
  const deliveredOrders = orders.filter((o: any) => o.isDelivered).length;
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-GB", {
        month: "short",
        year: "numeric",
      })
    : "2026";

  if (!user) return null;

  const inputCls =
    "w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-orange-500 outline-none bg-stone-50 focus:bg-white transition-all text-sm";
  const labelCls =
    "block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        {/* ── Sidebar ───────────────────────────────── */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden sticky top-24">
            {/* Avatar + name */}
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
              <p className="text-stone-500 text-xs mt-2 relative z-10">
                Member since {memberSince}
              </p>
            </div>

            {/* Nav tabs */}
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

            {/* Account stats */}
            <div className="p-4 pt-0">
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-100 space-y-3">
                <p className="text-xs font-black text-stone-400 uppercase tracking-widest mb-2">
                  Account Stats
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-stone-500 font-medium">
                    Total Orders
                  </span>
                  <span className="text-sm font-black text-stone-900">
                    {totalOrders}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-stone-500 font-medium">
                    Delivered
                  </span>
                  <span className="text-sm font-black text-green-600">
                    {deliveredOrders}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-stone-200 pt-3">
                  <span className="text-xs text-stone-500 font-medium">
                    Total Spent
                  </span>
                  <span className="text-sm font-black text-orange-600">
                    {orders[0]?.currency || "USD"} {totalSpent.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Content ───────────────────────────── */}
        <div className="flex-grow space-y-6">
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 sm:p-10">
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
                    <label className={labelCls}>{t("name")}</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className={labelCls}>{t("email")}</label>
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
                      <label className={labelCls}>{t("address")}</label>
                      <input
                        type="text"
                        className={inputCls}
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className={labelCls}>{t("city")}</label>
                      <input
                        type="text"
                        className={inputCls}
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className={labelCls}>{t("postalCode")}</label>
                      <input
                        type="text"
                        className={inputCls}
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
                      <label className={labelCls}>{t("country")}</label>
                      <input
                        type="text"
                        className={inputCls}
                        value={formData.country}
                        onChange={(e) =>
                          setFormData({ ...formData, country: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className={labelCls}>{t("phone")}</label>
                      <input
                        type="text"
                        className={inputCls}
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
                    {loading ? "Saving..." : t("saveChanges")}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === "orders" && (
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 sm:p-10">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black tracking-tight">
                    {t("myOrders")}
                  </h2>
                  <p className="text-stone-400 text-sm mt-1">
                    Your complete order history
                  </p>
                </div>
                {totalOrders > 0 && (
                  <span className="bg-orange-100 text-orange-700 font-black text-sm px-4 py-1.5 rounded-full">
                    {totalOrders} orders
                  </span>
                )}
              </div>

              {ordersLoading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-stone-100 rounded-2xl" />
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
                <div className="space-y-5">
                  {orders.map((order: any) => {
                    const isExpanded = expandedOrder === order._id;
                    const steps = [
                      { label: "Placed", done: true },
                      { label: "Paid", done: !!order.isPaid },
                      { label: "Processing", done: !!order.isPaid },
                      { label: "Delivered", done: !!order.isDelivered },
                    ];

                    return (
                      <div
                        key={order._id}
                        className="border border-stone-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                      >
                        {/* Order header */}
                        <div className="bg-stone-50 px-6 py-4 border-b border-stone-200 flex flex-wrap gap-4 justify-between items-center">
                          <div className="flex flex-wrap gap-6">
                            <div>
                              <p className="text-xs text-stone-500 uppercase font-bold tracking-wider">
                                {t("orderId")}
                              </p>
                              <p className="font-mono font-bold text-stone-900">
                                #{order._id.slice(-8).toUpperCase()}
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
                                {order.currency} {order.totalPrice?.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                order.isDelivered
                                  ? "bg-green-100 text-green-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {order.isDelivered
                                ? t("delivered")
                                : t("processing")}
                            </span>
                            <button
                              onClick={() => generateInvoice(order)}
                              className="px-3 py-1.5 flex items-center gap-1.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors"
                              title="Print Invoice"
                            >
                              <HiDownload className="text-sm" /> Invoice
                            </button>
                            <button
                              onClick={() =>
                                setExpandedOrder(isExpanded ? null : order._id)
                              }
                              className="px-3 py-1.5 text-xs font-bold text-stone-500 hover:text-stone-800 hover:bg-stone-200 rounded-full transition-colors"
                            >
                              {isExpanded ? "Hide ▲" : "Details ▼"}
                            </button>
                          </div>
                        </div>

                        {/* Status tracker */}
                        <div className="px-6 py-4 bg-white border-b border-stone-100">
                          <div className="flex items-center">
                            {steps.map((step, idx) => (
                              <div
                                key={step.label}
                                className="flex items-center flex-1"
                              >
                                <div className="flex flex-col items-center flex-shrink-0">
                                  <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black border-2 ${
                                      step.done
                                        ? "bg-orange-500 border-orange-500 text-white"
                                        : "border-stone-200 text-stone-300"
                                    }`}
                                  >
                                    {step.done ? (
                                      <svg
                                        className="w-3 h-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="3"
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                    ) : (
                                      idx + 1
                                    )}
                                  </div>
                                  <span
                                    className={`text-xs font-bold mt-1 whitespace-nowrap ${
                                      step.done
                                        ? "text-orange-600"
                                        : "text-stone-400"
                                    }`}
                                  >
                                    {step.label}
                                  </span>
                                </div>
                                {idx < steps.length - 1 && (
                                  <div
                                    className={`h-0.5 flex-1 mx-1 mb-4 ${
                                      step.done && steps[idx + 1].done
                                        ? "bg-orange-400"
                                        : "bg-stone-200"
                                    }`}
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Expandable detail panel */}
                        {isExpanded && (
                          <div className="p-6 space-y-5">
                            {/* Items */}
                            <div className="flex flex-wrap gap-3">
                              {order.orderItems.map(
                                (item: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-3 bg-stone-50 pr-4 rounded-xl border border-stone-100 overflow-hidden"
                                  >
                                    <div className="h-14 w-14 relative bg-stone-200 flex-shrink-0">
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
                                        Qty: {item.quantity} &middot;{" "}
                                        {order.currency}{" "}
                                        {(item.price * item.quantity).toFixed(
                                          2,
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>

                            {/* Price breakdown */}
                            <div className="bg-stone-50 rounded-xl border border-stone-100 p-4 max-w-xs ml-auto space-y-2">
                              <div className="flex justify-between text-sm text-stone-500">
                                <span>Subtotal</span>
                                <span>
                                  {order.currency}{" "}
                                  {(
                                    order.itemsPrice ??
                                    order.totalPrice -
                                      (order.shippingPrice || 0)
                                  ).toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm text-stone-500">
                                <span>Shipping</span>
                                <span>
                                  {order.currency}{" "}
                                  {(order.shippingPrice || 0).toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between font-black text-stone-900 border-t border-stone-200 pt-2">
                                <span>Total</span>
                                <span>
                                  {order.currency}{" "}
                                  {order.totalPrice?.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between text-xs pt-1">
                                <span className="text-stone-400">Payment</span>
                                <span
                                  className={`font-bold ${
                                    order.isPaid
                                      ? "text-green-600"
                                      : "text-red-500"
                                  }`}
                                >
                                  {order.isPaid ? "Paid" : "Pending"}
                                </span>
                              </div>
                            </div>

                            {/* Shipping address */}
                            {order.shippingAddress && (
                              <div className="text-sm text-stone-500 border-t border-stone-100 pt-4">
                                <p className="text-xs font-black uppercase tracking-wider text-stone-400 mb-1">
                                  Shipped to
                                </p>
                                <p className="font-semibold text-stone-800">
                                  {order.shippingAddress.fullName}
                                </p>
                                <p>
                                  {order.shippingAddress.address},{" "}
                                  {order.shippingAddress.city},{" "}
                                  {order.shippingAddress.postalCode}
                                </p>
                                <p>
                                  {order.shippingAddress.country} &middot;{" "}
                                  {order.shippingAddress.phone}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              {/* Change Password */}
              <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-2.5 bg-stone-100 text-stone-600 rounded-xl flex-shrink-0">
                    <HiOutlineLockClosed className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-stone-900">
                      Change Password
                    </h3>
                    <p className="text-stone-400 text-sm mt-0.5">
                      Update your password to keep your account secure
                    </p>
                  </div>
                </div>
                <form
                  onSubmit={handleChangePassword}
                  className="space-y-4 max-w-md"
                >
                  <div>
                    <label className={labelCls}>Current Password</label>
                    <input
                      type="password"
                      className={inputCls}
                      placeholder="••••••••"
                      value={pwData.currentPassword}
                      onChange={(e) =>
                        setPwData({
                          ...pwData,
                          currentPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className={labelCls}>New Password</label>
                    <input
                      type="password"
                      className={inputCls}
                      placeholder="Min. 6 characters"
                      value={pwData.newPassword}
                      onChange={(e) =>
                        setPwData({ ...pwData, newPassword: e.target.value })
                      }
                      required
                      minLength={6}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Confirm New Password</label>
                    <input
                      type="password"
                      className={`${inputCls} ${
                        pwData.confirmPassword &&
                        pwData.newPassword !== pwData.confirmPassword
                          ? "border-red-300 focus:ring-red-400"
                          : ""
                      }`}
                      placeholder="Repeat new password"
                      value={pwData.confirmPassword}
                      onChange={(e) =>
                        setPwData({
                          ...pwData,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                    />
                    {pwData.confirmPassword &&
                      pwData.newPassword !== pwData.confirmPassword && (
                        <p className="text-xs text-red-500 mt-1 font-medium">
                          Passwords do not match
                        </p>
                      )}
                  </div>
                  <button
                    type="submit"
                    disabled={pwLoading}
                    className="px-8 py-3 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-all shadow-md text-sm disabled:opacity-50"
                  >
                    {pwLoading ? "Updating..." : "Update Password"}
                  </button>
                </form>
              </div>

              {/* Danger Zone */}
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
  );
}
