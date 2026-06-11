"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useStore } from "@/store/useStore";
import toast from "react-hot-toast";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineEye,
} from "react-icons/hi";
import { Pagination } from "@/components/Pagination";
import { generateInvoice } from "@/lib/generateInvoice";
import { generateShippingLabel } from "@/lib/generateShippingLabel";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [usersPage, setUsersPage] = useState(1);
  const [productsPage, setProductsPage] = useState(1);
  const [ordersPage, setOrdersPage] = useState(1);
  const [reviewsPage, setReviewsPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("products"); // 'products', 'orders', 'reviews', 'orderDetails', 'newsletter', 'messages'
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [subscribersPage, setSubscribersPage] = useState(1);
  const [messages, setMessages] = useState<any[]>([]);
  const [messagesPage, setMessagesPage] = useState(1);
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [viewingOrder, setViewingOrder] = useState<any>(null);

  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    const dataForm = new FormData();
    dataForm.append("image", file);
    dataForm.append("key", process.env.NEXT_PUBLIC_IMGBB_API_KEY as string);

    try {
      const { data } = await axios.post(
        "https://api.imgbb.com/1/upload",
        dataForm,
      );
      const url = data.data.url;
      setFormData((prev) => ({
        ...prev,
        images: prev.images ? `${prev.images}, ${url}` : url,
      }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Image upload failed");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const [deliverySettings, setDeliverySettings] = useState({
    USD: 0,
    EUR: 0,
    LKR: 0,
    CHF: 0,
    AED: 0,
  });

  const CURRENCIES = ["USD", "EUR", "LKR", "CHF", "AED"] as const;
  type Currency = (typeof CURRENCIES)[number];

  const emptyTiers = () => ({
    USD: { t1: 0, t2: 0, t3: 0, t4: 0 },
    EUR: { t1: 0, t2: 0, t3: 0, t4: 0 },
    LKR: { t1: 0, t2: 0, t3: 0, t4: 0 },
    CHF: { t1: 0, t2: 0, t3: 0, t4: 0 },
    AED: { t1: 0, t2: 0, t3: 0, t4: 0 },
  });

  // tierDelivery[currency].t1 = 1-3 items, t2 = 4-6, t3 = 7-10, t4 = 11+
  const [tierDelivery, setTierDelivery] =
    useState<
      Record<Currency, { t1: number; t2: number; t3: number; t4: number }>
    >(emptyTiers());

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Spices",
    priceUSD: 0,
    priceEUR: 0,
    priceLKR: 0,
    priceCHF: 0,
    priceAED: 0,
    stock: 0,
    images: "",
  });

  const [reviewsProduct, setReviewsProduct] = useState<any>(null);
  const [productReviews, setProductReviews] = useState([]);

  const user = useStore((state) => state.user);

  // Search & Filters state
  const [productSearch, setProductSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderFilter, setOrderFilter] = useState("All");
  const [messageSearch, setMessageSearch] = useState("");
  const [messageFilter, setMessageFilter] = useState("All");

  useEffect(() => {
    if (user?.role === "admin") {
      fetchProducts();
      fetchOrders();
      fetchUsers();
      fetchSettings();
      fetchSubscribers();
      fetchMessages();
    }
  }, [user]);

  const fetchSubscribers = async () => {
    try {
      const { data } = await axios.get("/api/newsletter");
      setSubscribers(data);
    } catch {
      // silently ignore — may not be admin yet
    }
  };

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get("/api/contact");
      setMessages(data);
    } catch {
      // silently ignore
    }
  };

  const markOrderRead = async (id: string, currentStatus: boolean) => {
    try {
      await axios.patch("/api/orders", { id, isRead: !currentStatus });
      setOrders((prev: any) =>
        prev.map((o: any) => (o._id === id ? { ...o, isRead: !currentStatus } : o)),
      );
    } catch {
      toast.error("Failed to update order status");
    }
  };

  const markMessageRead = async (id: string) => {
    try {
      await axios.patch("/api/contact", { id });
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, isRead: true } : m)),
      );
    } catch {
      // ignore
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("Delete this order? This cannot be undone.")) return;
    try {
      await axios.delete("/api/orders", { data: { id } });
      setOrders((prev: any) => prev.filter((o: any) => o._id !== id));
      toast.success("Order deleted.");
    } catch {
      toast.error("Failed to delete order.");
    }
  };

  const deleteSubscriber = async (id: string) => {
    if (!confirm("Remove this subscriber?")) return;
    try {
      await axios.delete("/api/newsletter", { data: { id } });
      setSubscribers((prev) => prev.filter((s: any) => s._id !== id));
      toast.success("Subscriber removed.");
    } catch {
      toast.error("Failed to remove subscriber.");
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    try {
      await axios.delete("/api/contact", { data: { id } });
      setMessages((prev: any) => prev.filter((m: any) => m._id !== id));
      if (expandedMessage === id) setExpandedMessage(null);
      toast.success("Message deleted.");
    } catch {
      toast.error("Failed to delete message.");
    }
  };

  const downloadSubscribersCSV = () => {
    const rows = [
      ["Email", "Subscribed At"],
      ...subscribers.map((s) => [
        s.email,
        new Date(s.createdAt).toLocaleString(),
      ]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter_subscribers_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get("/api/settings");
      const usd = data.find((s: any) => s.key === "deliveryCost_USD");
      const eur = data.find((s: any) => s.key === "deliveryCost_EUR");
      const lkr = data.find((s: any) => s.key === "deliveryCost_LKR");
      const chf = data.find((s: any) => s.key === "deliveryCost_CHF");
      const aed = data.find((s: any) => s.key === "deliveryCost_AED");
      setDeliverySettings({
        USD: usd?.value ? Number(usd.value) : 0,
        EUR: eur?.value ? Number(eur.value) : 0,
        LKR: lkr?.value ? Number(lkr.value) : 0,
        CHF: chf?.value ? Number(chf.value) : 0,
        AED: aed?.value ? Number(aed.value) : 0,
      });
      // Load tier delivery settings
      const tiers: any = emptyTiers();
      for (const cur of CURRENCIES) {
        for (const tier of ["t1", "t2", "t3", "t4"] as const) {
          const entry = data.find(
            (s: any) => s.key === `deliveryTier_${cur}_${tier}`,
          );
          if (entry) tiers[cur][tier] = Number(entry.value);
        }
      }
      setTierDelivery(tiers);
    } catch {
      toast.error("Failed to load settings");
    }
  };

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const baseSaves = CURRENCIES.map((cur) =>
        axios.put("/api/settings", {
          key: `deliveryCost_${cur}`,
          value: (deliverySettings as any)[cur].toString(),
        }),
      );
      const tierSaves = CURRENCIES.flatMap((cur) =>
        (["t1", "t2", "t3", "t4"] as const).map((tier) =>
          axios.put("/api/settings", {
            key: `deliveryTier_${cur}_${tier}`,
            value: tierDelivery[cur][tier].toString(),
          }),
        ),
      );
      await Promise.all([...baseSaves, ...tierSaves]);
      toast.success("Settings updated");
    } catch {
      toast.error("Failed to update settings");
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("/api/admin/users");
      setUsers(data);
    } catch (error) {
      toast.error("Failed to load users");
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/products");
      setProducts(data);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/orders");
      setOrders(data);
    } catch (error) {
      toast.error("Failed to load orders");
    }
  };

  const toggleOrderStatus = async (id: string) => {
    try {
      await axios.put(`/api/orders/${id}/deliver`);
      toast.success("Order status updated");
      fetchOrders();
      setViewingOrder((prev: any) =>
        prev?._id === id ? { ...prev, isDelivered: !prev.isDelivered } : prev,
      );
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await axios.delete(`/api/products/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const viewReviews = async (product: any) => {
    try {
      const { data } = await axios.get(`/api/products/${product._id}/reviews`);
      setReviewsProduct(product);
      setProductReviews(data);
      setTab("reviews");
    } catch (error) {
      toast.error("Failed to load reviews");
    }
  };

  const openForm = (product: any = null) => {
    setEditingProduct(product);
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        priceUSD: product.price?.USD || 0,
        priceEUR: product.price?.EUR || 0,
        priceLKR: product.price?.LKR || 0,
        priceCHF: product.price?.CHF || 0,
        priceAED: product.price?.AED || 0,
        stock: product.stock,
        images: product.images?.join(", ") || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        category: "Spices",
        priceUSD: 0,
        priceEUR: 0,
        priceLKR: 0,
        priceCHF: 0,
        priceAED: 0,
        stock: 0,
        images: "",
      });
    }
    setShowModal(true);
  };

  const submitForm = async (e: any) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      price: {
        USD: Number(formData.priceUSD),
        EUR: Number(formData.priceEUR),
        LKR: Number(formData.priceLKR),
        CHF: Number(formData.priceCHF),
        AED: Number(formData.priceAED),
      },
      stock: Number(formData.stock),
      images: formData.images
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== ""),
    };

    try {
      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct._id}`, payload);
        toast.success("Product updated");
      } else {
        await axios.post("/api/products", payload);
        toast.success("Product added");
      }
      setShowModal(false);
      fetchProducts();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save product");
    }
  };

  const filteredProducts = products.filter((p: any) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orders.filter((o: any) => {
    let matchSearch = true;
    if (orderSearch) {
      const term = orderSearch.toLowerCase();
      matchSearch =
        o._id.toLowerCase().includes(term) ||
        o.userId?.email?.toLowerCase().includes(term) ||
        o.userId?.name?.toLowerCase().includes(term) ||
        o.guestEmail?.toLowerCase().includes(term) ||
        o.shippingAddress?.fullName?.toLowerCase().includes(term);
    }
    let matchFilter = true;
    if (orderFilter === "Delivered") matchFilter = o.isDelivered;
    if (orderFilter === "Processing") matchFilter = !o.isDelivered;
    if (orderFilter === "Read") matchFilter = o.isRead;
    if (orderFilter === "Unread") matchFilter = !o.isRead;
    return matchSearch && matchFilter;
  });

  const filteredMessages = messages.filter((m: any) => {
    let matchSearch = true;
    if (messageSearch) {
      const term = messageSearch.toLowerCase();
      matchSearch =
        m.name?.toLowerCase().includes(term) ||
        m.email?.toLowerCase().includes(term) ||
        m.subject?.toLowerCase().includes(term) ||
        m.message?.toLowerCase().includes(term);
    }
    let matchFilter = true;
    if (messageFilter === "Read") matchFilter = m.isRead;
    if (messageFilter === "Unread") matchFilter = !m.isRead;
    return matchSearch && matchFilter;
  });

  if (user?.role !== "admin") {
    return (
      <div className="text-center py-20 font-bold text-red-500">
        Access Denied
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tighter italic">
          Admin <span className="text-orange-600">Dashboard</span>
        </h1>
        <div className="flex flex-wrap gap-2 sm:gap-4 overflow-x-auto pb-2 w-full md:w-auto">
          <button
            onClick={() => setTab("users")}
            className={`px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-bold rounded-xl transition-all whitespace-nowrap ${tab === "users" ? "bg-orange-500 text-white" : "bg-stone-200 text-stone-600 hover:bg-stone-300"}`}
          >
            Users
          </button>
          <button
            onClick={() => setTab("products")}
            className={`px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-bold rounded-xl transition-all whitespace-nowrap ${tab === "products" ? "bg-orange-500 text-white" : "bg-stone-200 text-stone-600 hover:bg-stone-300"}`}
          >
            Products
          </button>
          <button
            onClick={() => setTab("orders")}
            className={`relative px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-bold rounded-xl transition-all whitespace-nowrap ${tab === "orders" ? "bg-orange-500 text-white" : "bg-stone-200 text-stone-600 hover:bg-stone-300"}`}
          >
            Orders
            {orders.filter((o: any) => !o.isRead).length > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-black">
                {orders.filter((o: any) => !o.isRead).length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab("settings")}
            className={`px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-bold rounded-xl transition-all whitespace-nowrap ${tab === "settings" ? "bg-orange-500 text-white" : "bg-stone-200 text-stone-600 hover:bg-stone-300"}`}
          >
            Settings
          </button>
          <button
            onClick={() => setTab("newsletter")}
            className={`px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-bold rounded-xl transition-all whitespace-nowrap ${tab === "newsletter" ? "bg-orange-500 text-white" : "bg-stone-200 text-stone-600 hover:bg-stone-300"}`}
          >
            Newsletter
          </button>
          <button
            onClick={() => setTab("messages")}
            className={`relative px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-bold rounded-xl transition-all whitespace-nowrap ${tab === "messages" ? "bg-orange-500 text-white" : "bg-stone-200 text-stone-600 hover:bg-stone-300"}`}
          >
            Messages
            {messages.filter((m) => !m.isRead).length > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-black">
                {messages.filter((m) => !m.isRead).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {tab === "users" && (
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="px-8 py-5 font-black text-stone-400 uppercase text-xs tracking-widest">
                  User ID
                </th>
                <th className="px-8 py-5 font-black text-stone-400 uppercase text-xs tracking-widest">
                  Name/Email
                </th>
                <th className="px-8 py-5 font-black text-stone-400 uppercase text-xs tracking-widest">
                  Role
                </th>
                <th className="px-8 py-5 font-black text-stone-400 uppercase text-xs tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {users
                .slice(
                  (usersPage - 1) * ITEMS_PER_PAGE,
                  usersPage * ITEMS_PER_PAGE,
                )
                .map((u: any) => (
                  <tr
                    key={u._id}
                    className="hover:bg-stone-50/50 transition-colors"
                  >
                    <td className="px-8 py-6 font-medium text-stone-600">
                      {u._id}
                    </td>
                    <td className="px-8 py-6 font-bold text-stone-900">
                      {u.name} <br />
                      <span className="text-xs text-stone-500 font-normal">
                        {u.email}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${u.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button
                        onClick={async () => {
                          if (confirm("Toggle role?")) {
                            try {
                              await axios.put(`/api/admin/users/${u._id}`, {
                                role: u.role === "admin" ? "customer" : "admin",
                              });
                              toast.success("User updated");
                              fetchUsers();
                            } catch {
                              toast.error("Failed");
                            }
                          }
                        }}
                        className="px-4 py-2 border border-stone-300 rounded-lg text-sm font-bold hover:bg-stone-100 transition-all mr-2"
                      >
                        Toggle Role
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm("Delete user?")) {
                            try {
                              await axios.delete(`/api/admin/users/${u._id}`);
                              toast.success("User deleted");
                              fetchUsers();
                            } catch {
                              toast.error("Failed");
                            }
                          }
                        }}
                        className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-bold hover:bg-red-200 transition-all"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <Pagination
            currentPage={usersPage}
            totalItems={users.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setUsersPage}
          />
        </div>
      )}

      {tab === "products" && (
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xl">
          <div className="p-4 sm:p-6 border-b border-stone-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-bold text-stone-800">Products</h2>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-stretch sm:items-center w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search products..."
                value={productSearch}
                onChange={(e) => {
                  setProductSearch(e.target.value);
                  setProductsPage(1);
                }}
                className="px-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-full sm:w-64"
              />
              <button
                onClick={() => openForm()}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-all w-full sm:w-auto"
              >
                <HiOutlinePlus className="h-5 w-5" /> Add Product
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="px-8 py-5 font-black text-stone-400 uppercase text-xs tracking-widest">
                  Product
                </th>
                <th className="px-8 py-5 font-black text-stone-400 uppercase text-xs tracking-widest">
                  Prices
                </th>
                <th className="px-8 py-5 font-black text-stone-400 uppercase text-xs tracking-widest">
                  Stock
                </th>
                <th className="px-8 py-5 font-black text-stone-400 uppercase text-xs tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts
                .slice(
                  (productsPage - 1) * ITEMS_PER_PAGE,
                  productsPage * ITEMS_PER_PAGE,
                )
                .map((product: any) => (
                  <tr
                    key={product._id}
                    className="hover:bg-stone-50/50 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        {product.images?.[0] && (
                          <img
                            src={product.images[0]}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        <span className="font-bold text-stone-900">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-stone-600 space-y-0.5">
                      <div>
                        <span className="font-black text-stone-400 text-xs">
                          USD
                        </span>{" "}
                        {product.price?.USD}
                      </div>
                      <div>
                        <span className="font-black text-stone-400 text-xs">
                          EUR
                        </span>{" "}
                        {product.price?.EUR}
                      </div>
                      <div>
                        <span className="font-black text-stone-400 text-xs">
                          LKR
                        </span>{" "}
                        {product.price?.LKR}
                      </div>
                      <div>
                        <span className="font-black text-stone-400 text-xs">
                          CHF
                        </span>{" "}
                        {product.price?.CHF}
                      </div>
                      <div>
                        <span className="font-black text-stone-400 text-xs">
                          AED
                        </span>{" "}
                        {product.price?.AED}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock > 10 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => viewReviews(product)}
                          className="p-2 text-stone-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                          title="View Reviews"
                        >
                          <HiOutlineEye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openForm(product)}
                          className="p-2 text-stone-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all"
                          title="Edit Product"
                        >
                          <HiOutlinePencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => deleteProduct(product._id)}
                          className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete Product"
                        >
                          <HiOutlineTrash className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          </div>
          <Pagination
            currentPage={productsPage}
            totalItems={filteredProducts.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setProductsPage}
          />
        </div>
      )}

      {tab === "orders" && (
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xl">
          <div className="p-4 sm:p-6 border-b border-stone-200 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-stone-50">
            <h2 className="text-xl font-bold text-stone-800">Orders</h2>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-stretch sm:items-center w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search orders..."
                value={orderSearch}
                onChange={(e) => {
                  setOrderSearch(e.target.value);
                  setOrdersPage(1);
                }}
                className="px-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-full sm:w-64"
              />
              <select
                value={orderFilter}
                onChange={(e) => {
                  setOrderFilter(e.target.value);
                  setOrdersPage(1);
                }}
                className="px-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white w-full sm:w-auto"
              >
                <option value="All">All Statuses</option>
                <option value="Delivered">Delivered</option>
                <option value="Processing">Processing</option>
                <option value="Read">Read</option>
                <option value="Unread">Unread</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="px-8 py-5 font-black text-stone-400 uppercase text-xs tracking-widest">
                  Customer
                </th>
                <th className="px-8 py-5 font-black text-stone-400 uppercase text-xs tracking-widest">
                  Shipping
                </th>
                <th className="px-8 py-5 font-black text-stone-400 uppercase text-xs tracking-widest">
                  Total
                </th>
                <th className="px-8 py-5 font-black text-stone-400 uppercase text-xs tracking-widest">
                  Status
                </th>
                <th className="px-8 py-5 font-black text-stone-400 uppercase text-xs tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders
                .slice(
                  (ordersPage - 1) * ITEMS_PER_PAGE,
                  ordersPage * ITEMS_PER_PAGE,
                )
                .map((order: any) => (
                  <tr
                    key={order._id}
                    className={`hover:bg-stone-50/50 transition-colors ${!order.isRead ? "bg-orange-50/30" : ""}`}
                  >
                    <td className="px-8 py-6 font-bold text-stone-900 relative">
                      {!order.isRead && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500"></div>
                      )}
                      {order.userId?.name || (
                        <span className="text-orange-600 font-semibold italic">
                          Non Registered User
                        </span>
                      )}{" "}
                      <br />
                      <span className="text-xs text-stone-500 font-normal">
                        {order.userId?.email || order.guestEmail || "—"}
                      </span>
                      <div className="text-xs text-stone-400 mt-1 font-normal">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-stone-600 max-w-[200px] truncate">
                      {order.shippingAddress ? (
                        <>
                          <span className="font-bold">
                            {order.shippingAddress.fullName}
                          </span>
                          <br />
                          {order.shippingAddress.address},{" "}
                          {order.shippingAddress.city}
                          <br />
                          {order.shippingAddress.postalCode}{" "}
                          {order.shippingAddress.country}
                          <br />
                          {order.shippingAddress.phone}
                        </>
                      ) : (
                        "No Address"
                      )}
                    </td>
                    <td className="px-8 py-6 font-bold text-stone-900">
                      {order.currency} {order.totalPrice?.toFixed(2)}
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${order.isDelivered ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}
                      >
                        {order.isDelivered ? "Delivered" : "Processing"}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 flex-wrap">
                        <button
                          onClick={() => markOrderRead(order._id, order.isRead)}
                          className={`px-4 py-2 border rounded-lg text-sm font-bold transition-all ${order.isRead ? "border-stone-300 text-stone-600 hover:bg-stone-100" : "border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100"}`}
                          title="Toggle Read Status"
                        >
                          {order.isRead ? "Mark Unread" : "Mark Read"}
                        </button>
                        <button
                          onClick={() => {
                            if (!order.isRead) markOrderRead(order._id, order.isRead);
                            setViewingOrder(order);
                            setTab("orderDetails");
                          }}
                          className="px-4 py-2 border border-stone-300 rounded-lg text-sm font-bold hover:bg-stone-100 transition-all"
                        >
                          <HiOutlineEye className="inline-block mr-1 h-4 w-4 -mt-0.5" />{" "}
                          View
                        </button>
                        <button
                          onClick={() => generateInvoice(order)}
                          className="px-4 py-2 border border-orange-200 bg-orange-50 text-orange-700 rounded-lg text-sm font-bold hover:bg-orange-100 transition-all"
                          title="Print Invoice"
                        >
                          🖨 Invoice
                        </button>
                        <button
                          onClick={() => generateShippingLabel(order)}
                          className="px-4 py-2 border border-stone-200 bg-stone-900 text-white rounded-lg text-sm font-bold hover:bg-stone-700 transition-all"
                          title="Print Shipping Label"
                        >
                          📦 Label
                        </button>
                        <button
                          onClick={() => toggleOrderStatus(order._id)}
                          className="px-4 py-2 border border-stone-300 rounded-lg text-sm font-bold hover:bg-stone-100 transition-all"
                        >
                          {order.isDelivered ? "Processing" : "Delivered"}
                        </button>
                        <button
                          onClick={() => deleteOrder(order._id)}
                          className="px-4 py-2 border border-red-200 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-all"
                          title="Delete Order"
                        >
                          <HiOutlineTrash className="inline-block h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-8 py-10 text-center text-stone-500"
                  >
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
          <Pagination
            currentPage={ordersPage}
            totalItems={filteredOrders.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setOrdersPage}
          />
        </div>
      )}

      {tab === "reviews" && (
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-stone-900">
              Reviews for {reviewsProduct?.name}
            </h2>
            <button
              onClick={() => setTab("products")}
              className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-lg transition-all"
            >
              Back to Products
            </button>
          </div>

          {productReviews.length === 0 ? (
            <p className="text-stone-500">No reviews found for this product.</p>
          ) : (
            <div className="space-y-4">
              {productReviews
                .slice(
                  (reviewsPage - 1) * ITEMS_PER_PAGE,
                  reviewsPage * ITEMS_PER_PAGE,
                )
                .map((review: any) => (
                  <div
                    key={review._id}
                    className="p-4 border border-stone-100 rounded-xl bg-stone-50"
                  >
                    <div className="flex justify-between">
                      <span className="font-bold text-stone-800">
                        {review.userName}
                      </span>
                      <span className="text-orange-500 font-black">
                        ★ {review.rating}/5
                      </span>
                    </div>
                    <p className="text-stone-600 mt-2">{review.comment}</p>
                  </div>
                ))}
            </div>
          )}
          <div className="mt-4">
            <Pagination
              currentPage={reviewsPage}
              totalItems={productReviews.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setReviewsPage}
            />
          </div>
        </div>
      )}

      {tab === "settings" && (
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xl p-8">
          <h2 className="text-2xl font-black text-stone-900 mb-6">
            Store Settings
          </h2>
          <form onSubmit={saveSettings} className="space-y-10 max-w-2xl">
            {/* Base delivery costs */}
            <div>
              <h3 className="font-black text-lg text-stone-800 mb-4 pb-2 border-b border-stone-100">
                Base Delivery Cost{" "}
                <span className="text-stone-400 font-normal text-sm">
                  (1–3 items or when no tier matches)
                </span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {(["USD", "EUR", "LKR", "CHF", "AED"] as const).map((cur) => (
                  <div key={cur}>
                    <label className="block text-sm font-bold text-stone-700 mb-1">
                      {cur}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={(deliverySettings as any)[cur]}
                      onChange={(e) =>
                        setDeliverySettings({
                          ...deliverySettings,
                          [cur]: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity-based delivery tiers */}
            <div>
              <h3 className="font-black text-lg text-stone-800 mb-1 pb-2 border-b border-stone-100">
                Quantity-Based Delivery Tiers
              </h3>
              <p className="text-stone-400 text-xs mb-5">
                Set the delivery charge per currency based on total number of
                items in the cart. Leave 0 to fall back to the base cost above.
              </p>

              {(
                [
                  { key: "t1", label: "1 – 3 items" },
                  { key: "t2", label: "4 – 6 items" },
                  { key: "t3", label: "7 – 10 items" },
                  { key: "t4", label: "11+ items" },
                ] as const
              ).map(({ key: tier, label }) => (
                <div key={tier} className="mb-6">
                  <p className="text-sm font-black text-stone-600 uppercase tracking-wider mb-3">
                    {label}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {(["USD", "EUR", "LKR", "CHF", "AED"] as const).map(
                      (cur) => (
                        <div key={cur}>
                          <label className="block text-xs font-bold text-stone-500 mb-1">
                            {cur}
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={tierDelivery[cur][tier]}
                            onChange={(e) =>
                              setTierDelivery((prev) => ({
                                ...prev,
                                [cur]: {
                                  ...prev[cur],
                                  [tier]: Number(e.target.value),
                                },
                              }))
                            }
                            className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                          />
                        </div>
                      ),
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-all"
            >
              Save Settings
            </button>
          </form>
        </div>
      )}

      {tab === "newsletter" && (
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xl">
          <div className="p-6 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-stone-900">
                Newsletter Subscribers
              </h2>
              <p className="text-stone-500 text-sm mt-1">
                {subscribers.length} subscriber
                {subscribers.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={downloadSubscribersCSV}
              disabled={subscribers.length === 0}
              className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-700 transition-all disabled:opacity-50"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download CSV
            </button>
          </div>
          {subscribers.length === 0 ? (
            <div className="px-8 py-16 text-center text-stone-400">
              <svg
                className="w-12 h-12 mx-auto mb-4 opacity-30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              No subscribers yet.
            </div>
          ) : (
            <>
              <table className="w-full text-left">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr>
                    <th className="px-8 py-5 font-black text-stone-400 uppercase text-xs tracking-widest">
                      #
                    </th>
                    <th className="px-8 py-5 font-black text-stone-400 uppercase text-xs tracking-widest">
                      Email
                    </th>
                    <th className="px-8 py-5 font-black text-stone-400 uppercase text-xs tracking-widest">
                      Subscribed At
                    </th>
                    <th className="px-8 py-5 font-black text-stone-400 uppercase text-xs tracking-widest"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {subscribers
                    .slice(
                      (subscribersPage - 1) * ITEMS_PER_PAGE,
                      subscribersPage * ITEMS_PER_PAGE,
                    )
                    .map((s: any, idx: number) => (
                      <tr
                        key={s._id}
                        className="hover:bg-stone-50/50 transition-colors"
                      >
                        <td className="px-8 py-5 text-stone-400 text-sm">
                          {(subscribersPage - 1) * ITEMS_PER_PAGE + idx + 1}
                        </td>
                        <td className="px-8 py-5 font-bold text-stone-900">
                          {s.email}
                        </td>
                        <td className="px-8 py-5 text-stone-500 text-sm">
                          {new Date(s.createdAt).toLocaleString()}
                        </td>
                        <td className="px-8 py-5">
                          <button
                            onClick={() => deleteSubscriber(s._id)}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Remove subscriber"
                          >
                            <HiOutlineTrash className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <Pagination
                currentPage={subscribersPage}
                totalItems={subscribers.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setSubscribersPage}
              />
            </>
          )}
        </div>
      )}

      {tab === "messages" && (
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xl">
          <div className="p-6 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-50">
            <div>
              <h2 className="text-2xl font-black text-stone-900">
                Contact Messages
              </h2>
              <p className="text-stone-500 text-sm mt-1">
                {filteredMessages.length} message{filteredMessages.length !== 1 ? "s" : ""}{" "}
                &nbsp;·&nbsp;
                <span className="text-red-500 font-bold">
                  {messages.filter((m) => !m.isRead).length} total unread
                </span>
              </p>
            </div>
            <div className="flex gap-4 items-center">
              <input
                type="text"
                placeholder="Search messages..."
                value={messageSearch}
                onChange={(e) => {
                  setMessageSearch(e.target.value);
                  setMessagesPage(1);
                }}
                className="px-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-64 bg-white"
              />
              <select
                value={messageFilter}
                onChange={(e) => {
                  setMessageFilter(e.target.value);
                  setMessagesPage(1);
                }}
                className="px-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              >
                <option value="All">All Statuses</option>
                <option value="Read">Read</option>
                <option value="Unread">Unread</option>
              </select>
            </div>
          </div>
          {filteredMessages.length === 0 ? (
            <div className="px-8 py-16 text-center text-stone-400">
              <svg
                className="w-12 h-12 mx-auto mb-4 opacity-30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0l-8 5-8-5"
                />
              </svg>
              No messages yet.
            </div>
          ) : (
            <>
              <table className="w-full text-left">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr>
                    <th className="px-6 py-4 font-black text-stone-400 uppercase text-xs tracking-widest">
                      #
                    </th>
                    <th className="px-6 py-4 font-black text-stone-400 uppercase text-xs tracking-widest">
                      Name
                    </th>
                    <th className="px-6 py-4 font-black text-stone-400 uppercase text-xs tracking-widest">
                      Email
                    </th>
                    <th className="px-6 py-4 font-black text-stone-400 uppercase text-xs tracking-widest">
                      Subject
                    </th>
                    <th className="px-6 py-4 font-black text-stone-400 uppercase text-xs tracking-widest">
                      Date
                    </th>
                    <th className="px-6 py-4 font-black text-stone-400 uppercase text-xs tracking-widest">
                      Status
                    </th>
                    <th className="px-6 py-4 font-black text-stone-400 uppercase text-xs tracking-widest">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredMessages
                    .slice(
                      (messagesPage - 1) * ITEMS_PER_PAGE,
                      messagesPage * ITEMS_PER_PAGE,
                    )
                    .map((msg: any, idx: number) => (
                      <>
                        <tr
                          key={msg._id}
                          className={`transition-colors cursor-pointer ${!msg.isRead ? "bg-orange-50 hover:bg-orange-100/60" : "hover:bg-stone-50"}`}
                          onClick={() =>
                            setExpandedMessage(
                              expandedMessage === msg._id ? null : msg._id,
                            )
                          }
                        >
                          <td className="px-6 py-4 text-stone-400 text-sm">
                            {(messagesPage - 1) * ITEMS_PER_PAGE + idx + 1}
                          </td>
                          <td className="px-6 py-4 font-bold text-stone-900 flex items-center gap-2">
                            {!msg.isRead && (
                              <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
                            )}
                            {msg.name}
                          </td>
                          <td className="px-6 py-4 text-stone-600 text-sm">
                            {msg.email}
                          </td>
                          <td className="px-6 py-4 text-stone-500 text-sm">
                            {msg.subject || (
                              <span className="italic text-stone-300">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-stone-500 text-sm">
                            {new Date(msg.createdAt).toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-bold ${msg.isRead ? "bg-stone-100 text-stone-500" : "bg-orange-100 text-orange-600"}`}
                            >
                              {msg.isRead ? "Read" : "Unread"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              {!msg.isRead && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markMessageRead(msg._id);
                                  }}
                                  className="text-xs font-bold text-stone-500 hover:text-stone-900 underline"
                                >
                                  Mark read
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteMessage(msg._id);
                                }}
                                className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                title="Delete message"
                              >
                                <HiOutlineTrash className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {expandedMessage === msg._id && (
                          <tr
                            key={`${msg._id}-expanded`}
                            className="bg-stone-50"
                          >
                            <td colSpan={7} className="px-8 py-5">
                              <p className="text-stone-700 text-sm whitespace-pre-wrap leading-relaxed">
                                {msg.message}
                              </p>
                              <a
                                href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || "Your message")}`}
                                className="mt-3 inline-block px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-xl hover:bg-stone-700 transition-colors"
                              >
                                Reply via Email
                              </a>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                </tbody>
              </table>
              <Pagination
                currentPage={messagesPage}
                totalItems={filteredMessages.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setMessagesPage}
              />
            </>
          )}
        </div>
      )}

      {tab === "orderDetails" && viewingOrder && (
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xl p-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 border-b border-stone-100 pb-6 gap-4">
            <div>
              <h2 className="text-3xl font-black text-stone-900 tracking-tighter italic">
                Order #{viewingOrder._id}
              </h2>
              <p className="text-stone-500 mt-2 font-bold uppercase tracking-widest text-xs">
                Placed on {new Date(viewingOrder.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => generateInvoice(viewingOrder)}
                className="px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-sm bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-100 flex items-center gap-2"
              >
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
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Print Invoice
              </button>
              <button
                onClick={() => generateShippingLabel(viewingOrder)}
                className="px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-sm bg-stone-900 text-white hover:bg-stone-700 flex items-center gap-2"
              >
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
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                Shipping Label
              </button>
              <button
                onClick={() => toggleOrderStatus(viewingOrder._id)}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${viewingOrder.isDelivered ? "bg-orange-100 text-orange-700 hover:bg-orange-200" : "bg-green-100 text-green-700 hover:bg-green-200"}`}
              >
                {viewingOrder.isDelivered
                  ? "Mark Processing"
                  : "Mark Delivered"}
              </button>
              <button
                onClick={() => setTab("orders")}
                className="px-6 py-3 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-xl transition-all shadow-sm"
              >
                Back to Orders
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
            {/* Customer & Shipping */}
            <div className="space-y-6">
              <div className="bg-stone-50 rounded-2xl p-8 border border-stone-200 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-stone-200 rounded-full -mr-16 -mt-16 blur-2xl opacity-50"></div>
                <h3 className="text-xl font-black mb-6 uppercase tracking-wider text-stone-800 relative z-10 flex items-center gap-2">
                  <div className="w-2 h-6 bg-orange-500 rounded-full"></div>
                  Customer Details
                </h3>
                <div className="space-y-5 text-stone-600 relative z-10">
                  <div className="flex flex-col border-b border-stone-200 pb-3">
                    <span className="text-xs uppercase font-bold text-stone-400 tracking-widest mb-1">
                      Name
                    </span>
                    <span className="font-bold text-stone-900 text-lg">
                      {viewingOrder.userId?.name || (
                        <span className="text-orange-600 italic">
                          Non Registered User
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex flex-col border-b border-stone-200 pb-3">
                    <span className="text-xs uppercase font-bold text-stone-400 tracking-widest mb-1">
                      Email
                    </span>
                    <span className="font-bold text-stone-900 text-lg">
                      {viewingOrder.userId?.email ||
                        viewingOrder.guestEmail ||
                        "—"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs uppercase font-bold text-stone-400 tracking-widest mb-1">
                      Phone
                    </span>
                    <span className="font-bold text-stone-900 text-lg">
                      {viewingOrder.shippingAddress?.phone || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-stone-50 rounded-2xl p-8 border border-stone-200 overflow-hidden relative">
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-orange-100 rounded-full -mr-16 -mb-16 blur-2xl opacity-50"></div>
                <h3 className="text-xl font-black mb-6 uppercase tracking-wider text-stone-800 relative z-10 flex items-center gap-2">
                  <div className="w-2 h-6 bg-stone-900 rounded-full"></div>
                  Shipping Address
                </h3>
                <div className="space-y-2 text-stone-600 text-lg relative z-10">
                  <p className="font-bold text-stone-900 pb-2">
                    {viewingOrder.shippingAddress?.fullName}
                  </p>
                  <p>{viewingOrder.shippingAddress?.address}</p>
                  <p>
                    {viewingOrder.shippingAddress?.city},{" "}
                    {viewingOrder.shippingAddress?.postalCode}
                  </p>
                  <p>{viewingOrder.shippingAddress?.country}</p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8 flex flex-col">
              <h3 className="text-xl font-black mb-6 uppercase tracking-wider text-stone-800 border-b border-stone-100 pb-6 flex items-center gap-2">
                <HiOutlineEye className="w-6 h-6 text-orange-500" />
                Order Items
              </h3>

              <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[400px]">
                {viewingOrder.orderItems.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-stone-50 p-4 rounded-2xl border border-stone-100 hover:border-orange-200 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-xl shadow-sm"
                      />
                      <div>
                        <p className="font-bold text-stone-900">{item.name}</p>
                        <p className="text-stone-500 font-medium text-sm mt-1 bg-stone-200 inline-block px-2 py-0.5 rounded-md">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-black text-stone-900 text-lg">
                      {viewingOrder.currency}{" "}
                      {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-stone-100 space-y-4">
                <div className="flex justify-between text-stone-500 font-bold text-lg">
                  <span>Items Subtotal</span>
                  <span>
                    {viewingOrder.currency}{" "}
                    {viewingOrder.itemsPrice?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-stone-500 font-bold text-lg">
                  <span>Shipping</span>
                  <span>
                    {viewingOrder.currency}{" "}
                    {viewingOrder.shippingPrice?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-3xl font-black text-stone-900 mt-6 pt-6 border-t border-stone-200">
                  <span>Total</span>
                  <span>
                    {viewingOrder.currency}{" "}
                    {viewingOrder.totalPrice?.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-8 bg-stone-900 p-6 rounded-2xl flex items-center justify-between shadow-lg">
                <span className="font-bold text-stone-300 uppercase text-sm tracking-widest">
                  Payment Status
                </span>
                <span
                  className={`px-6 py-2 rounded-xl text-sm font-black uppercase tracking-widest shadow-inner ${viewingOrder.isPaid ? "bg-green-500 text-stone-900" : "bg-red-500 text-white"}`}
                >
                  {viewingOrder.isPaid ? "PAID" : "PENDING"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-8">
            <h2 className="text-3xl font-black mb-6">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>

            <form onSubmit={submitForm} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">
                  Product Name
                </label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">
                  Description
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows={3}
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">
                    Category
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Spices">🌿 Spices</option>
                    <option value="Gift Box">🎁 Gift Box</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">
                    Stock Amount
                  </label>
                  <input
                    required
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">
                    Price (USD)
                  </label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={formData.priceUSD}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priceUSD: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">
                    Price (EUR)
                  </label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={formData.priceEUR}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priceEUR: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">
                    Price (LKR)
                  </label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={formData.priceLKR}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priceLKR: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">
                    Price (CHF)
                  </label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={formData.priceCHF}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priceCHF: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">
                    Price (AED)
                  </label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={formData.priceAED}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priceAED: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">
                  Images
                </label>

                {formData.images && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.images.split(",").map(
                      (url, i) =>
                        url.trim() && (
                          <div
                            key={i}
                            className="relative w-16 h-16 rounded-lg overflow-hidden border border-stone-200 group"
                          >
                            <img
                              src={url.trim()}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const urls = formData.images
                                  .split(",")
                                  .map((u) => u.trim())
                                  .filter((u, idx) => u && idx !== i);
                                setFormData({
                                  ...formData,
                                  images: urls.join(", "),
                                });
                              }}
                              className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity text-white text-xl font-bold"
                              title="Remove image"
                            >
                              ×
                            </button>
                          </div>
                        ),
                    )}
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={uploadImage}
                    disabled={isUploadingImage}
                    className="block w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
                  />
                  {isUploadingImage && (
                    <span className="text-orange-600 text-sm font-bold animate-pulse whitespace-nowrap">
                      Uploading...
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-6 border-t border-stone-200 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-all"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
