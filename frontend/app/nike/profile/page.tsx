"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Bell,
  CheckCircle,
  ChevronRight,
  Circle,
  Clock,
  CreditCard,
  Edit3,
  FileText,
  Heart,
  HelpCircle,
  LogOut,
  Mail,
  MapPin,
  Package,
  Phone,
  RotateCcw,
  Settings,
  Shield,
  ShoppingBag,
  Trash2,
  Truck,
  User,
  XCircle,
} from "lucide-react";
import EcomFooter from "@/components/ecomfooter";
import EcomNavbar from "@/components/ecomnavbar";
import { useCart } from "@/app/context/CartContext";

interface UserData {
  _id?: string;
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth?: string;
  gender?: string;
  profilePic?: string;
}

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  image?: string;
}

interface ShippingInfo {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

interface Order {
  _id: string;
  orderId: string;
  customer: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  paymentStatus: string;
  deliveryStatus: string;
  paymentMethod: string;
  shippingInfo: ShippingInfo;
  date: string;
}

type TabType = "orders" | "returns" | "account" | "address" | "payment" | "wishlist" | "settings";

const panelClass = "rounded-3xl border border-white/10 bg-zinc-950 p-5 shadow-xl shadow-black/30 md:p-6";
const labelClass = "text-xs font-black uppercase tracking-[0.18em] text-zinc-500";

const ProfilePage = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("orders");
  const [loading, setLoading] = useState(true);
  const [orderFilter, setOrderFilter] = useState("all");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [returns, setReturns] = useState<any[]>([]);
  const [returnModalOrder, setReturnModalOrder] = useState<Order | null>(null);
  const [returnReason, setReturnReason] = useState("");
  const [returnDescription, setReturnDescription] = useState("");
  const [selectedReturnItems, setSelectedReturnItems] = useState<string[]>([]);
  const [submittingReturn, setSubmittingReturn] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const router = useRouter();
  const { addOrderItemsToCart } = useCart();

  useEffect(() => {
    const userStr = localStorage.getItem("user");

    if (!userStr) {
      router.push("/login");
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      setUser(userData);
      fetchOrders(userData._id || userData.id);
    } catch (e) {
      router.push("/login");
    }
  }, [router]);

  const fetchOrders = async (userId: string) => {
    if (!userId) {
      setLoading(false);
      return;
    }

    let apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    if (apiBaseUrl.endsWith("/api")) {
      apiBaseUrl = apiBaseUrl.slice(0, -4);
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${apiBaseUrl}/api/orders/user/${userId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.status === 404 || response.status === 500 || response.status === 401) {
        const allOrdersResponse = await fetch(`${apiBaseUrl}/api/orders`);

        if (allOrdersResponse.ok) {
          const allOrders = await allOrdersResponse.json();
          const userStr = localStorage.getItem("user");

          if (userStr) {
            const userData = JSON.parse(userStr);
            const filteredOrders = allOrders.filter(
              (order: Order) => order.customerEmail === userData.email,
            );
            setOrders(filteredOrders);
          }
        }
      } else if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReturns = async () => {
    if (!user) return;
    const userId = user._id || user.id;
    if (!userId) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/returns/user/${userId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setReturns(data);
      }
    } catch (error) {
      console.error("Error fetching returns:", error);
    }
  };

  useEffect(() => {
    if (user) fetchReturns();
  }, [user]);

  useEffect(() => {
    if (activeTab === "returns" && user) {
      fetchReturns();
    }
  }, [activeTab, user]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && user) {
        fetchReturns();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleBuyAgain = (order: Order) => {
    if (!order?.items?.length) return;
    addOrderItemsToCart(order.items);
    router.push("/nike/payment-details");
  };

  const handleDeleteOrder = async (orderId: string) => {
    setDeleteTargetId(orderId);
  };

  const confirmDeleteOrder = async () => {
    if (!deleteTargetId) return;

    let apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    if (apiBaseUrl.endsWith("/api")) {
      apiBaseUrl = apiBaseUrl.slice(0, -4);
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${apiBaseUrl}/api/orders/${deleteTargetId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to delete order:", errorText);
        setDeleteTargetId(null);
        return;
      }

      setOrders((prev) => prev.filter((order) => order._id !== deleteTargetId && order.orderId !== deleteTargetId));
    } catch (error) {
      console.error("Error deleting order:", error);
    } finally {
      setDeleteTargetId(null);
    }
  };

  const openReturnModal = (order: Order) => {
    setReturnModalOrder(order);
    setSelectedReturnItems(order.items.map((_, idx) => String(idx)));
    setReturnReason("");
    setReturnDescription("");
  };

  const toggleReturnItem = (idx: number) => {
    const key = String(idx);
    setSelectedReturnItems((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const submitReturn = async () => {
    if (!returnModalOrder || !returnReason || selectedReturnItems.length === 0) return;
    setSubmittingReturn(true);

    try {
      const token = localStorage.getItem("token");
      const selectedItems = selectedReturnItems
        .map((idx) => returnModalOrder.items[Number(idx)])
        .filter(Boolean);

      const totalAmount = selectedItems.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.quantity),
        0,
      );

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/returns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          orderId: returnModalOrder._id || returnModalOrder.orderId,
          items: selectedItems.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: Number(item.price),
            quantity: Number(item.quantity),
            color: item.color || "",
            size: item.size || "",
            image: item.image || "",
            reason: returnReason,
          })),
          totalAmount,
          reason: returnReason,
          description: returnDescription,
          customerName: user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "",
          customerEmail: user?.email || "",
          userId: user?._id || user?.id,
        }),
      });

      if (res.ok) {
        setReturnModalOrder(null);
        setSelectedReturnItems([]);
        setReturnReason("");
        setReturnDescription("");
        fetchReturns();
        setNotification({ message: "Return request submitted successfully", type: "success" });
      } else {
        const err = await res.json();
        setNotification({ message: err.message || "Failed to submit return", type: "error" });
      }
    } catch (error) {
      console.error("Error submitting return:", error);
      setNotification({ message: "Something went wrong", type: "error" });
    } finally {
      setSubmittingReturn(false);
    }
  };

  const getUserInitials = () => {
    if (!user) return "?";
    const first = user.firstName?.charAt(0) || "";
    const last = user.lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || user.firstName?.charAt(0)?.toUpperCase() || "U";
  };

  const filteredOrders = orders.filter((order) => {
    if (orderFilter === "all") return true;
    if (orderFilter === "processing") return order.deliveryStatus === "Processing";
    if (orderFilter === "shipped") return order.deliveryStatus === "Shipped";
    if (orderFilter === "delivered") return order.deliveryStatus === "Delivered";
    if (orderFilter === "cancelled") return order.deliveryStatus === "Cancelled";
    return true;
  });

  const getDeliveryStatusColor = (status: string) => {
    switch (status) {
      case "Processing":
        return "border-yellow-400/30 bg-yellow-400/10 text-yellow-300";
      case "Shipped":
        return "border-blue-400/30 bg-blue-400/10 text-blue-300";
      case "Delivered":
        return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
      case "Cancelled":
        return "border-red-400/30 bg-red-500/10 text-red-300";
      default:
        return "border-white/10 bg-white/5 text-zinc-300";
    }
  };

  const getDeliveryIcon = (status: string) => {
    switch (status) {
      case "Processing":
        return <Clock className="h-4 w-4" />;
      case "Shipped":
        return <Truck className="h-4 w-4" />;
      case "Delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "Cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getReturnForOrder = (order: Order) => {
    const orderReturns = returns
      .filter((ret) => {
        const retOrderId = typeof ret.orderId === "object" ? ret.orderId?._id || ret.orderId?.orderId : ret.orderId;
        return retOrderId === order._id || retOrderId === order.orderId;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return orderReturns[0] || null;
  };

  const getReturnStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
      case "Rejected":
        return "border-red-400/30 bg-red-400/10 text-red-300";
      case "Refunded":
        return "border-blue-400/30 bg-blue-400/10 text-blue-300";
      case "Cancelled":
        return "border-red-400/30 bg-red-500/10 text-red-300";
      default:
        return "border-amber-300/30 bg-amber-300/10 text-amber-200";
    }
  };

  const orderStats = {
    total: orders.length,
    processing: orders.filter((o) => o.deliveryStatus === "Processing").length,
    shipped: orders.filter((o) => o.deliveryStatus === "Shipped").length,
    delivered: orders.filter((o) => o.deliveryStatus === "Delivered").length,
  };

  const totalSpent = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Total Orders", value: orderStats.total },
          { label: "Processing", value: orderStats.processing },
          { label: "Shipped", value: orderStats.shipped },
          { label: "Delivered", value: orderStats.delivered },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
            <p className="text-3xl font-black text-white">{stat.value}</p>
            <p className="mt-1 text-xs font-black uppercase tracking-wider text-zinc-500">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {["all", "processing", "shipped", "delivered", "cancelled"].map((filter) => (
          <button
            key={filter}
            onClick={() => setOrderFilter(filter)}
            className={`shrink-0 rounded-full px-5 py-3 text-sm font-black uppercase transition-colors ${
              orderFilter === filter
                ? "bg-white text-black"
                : "border border-white/10 bg-zinc-950 text-zinc-500 hover:border-white/30 hover:text-white"
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
            {filter === "all" && orders.length > 0 && ` (${orders.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className={`${panelClass} py-16 text-center`}>
          <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full border border-white/10 bg-black">
            <Package className="h-10 w-10 text-zinc-600" />
          </div>
          <p className="text-xl font-black uppercase text-white">No orders yet</p>
          <p className="mt-2 text-sm text-zinc-500">Start shopping to see your orders here.</p>
          <Link href="/nike/products">
            <button className="mt-7 rounded-full bg-white px-8 py-3 text-sm font-black uppercase text-black transition-colors hover:bg-red-500 hover:text-white">
              Shop Now
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((order) => (
            <article key={order._id} className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950">
              <div className="flex flex-col gap-5 border-b border-white/10 bg-black px-5 py-5 md:flex-row md:items-center md:justify-between md:px-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className={labelClass}>Order ID</p>
                    <p className="mt-1 font-black text-white">{order.orderId}</p>
                  </div>
                  <div>
                    <p className={labelClass}>Date</p>
                    <p className="mt-1 font-semibold text-zinc-300">{order.date}</p>
                  </div>
                  <div>
                    <p className={labelClass}>Items</p>
                    <p className="mt-1 font-semibold text-zinc-300">
                      {order.items.length} product{order.items.length > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-black uppercase ${getDeliveryStatusColor(
                      order.deliveryStatus,
                    )}`}
                  >
                    {getDeliveryIcon(order.deliveryStatus)}
                    {order.deliveryStatus}
                  </span>
                  <p className="text-2xl font-black text-white">${Number(order.total).toFixed(2)}</p>
                </div>
              </div>

              <div className="border-b border-white/10 px-5 py-5 md:px-6">
                <p className="mb-4 text-sm font-black uppercase tracking-wider text-zinc-400">
                  Order Status
                </p>
                <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-start gap-3">
                  {["Processing", "Shipped", "Delivered"].map((step, index) => {
                    const isCompleted =
                      (index === 0 &&
                        ["Processing", "Shipped", "Delivered"].includes(order.deliveryStatus)) ||
                      (index === 1 && ["Shipped", "Delivered"].includes(order.deliveryStatus)) ||
                      (index === 2 && order.deliveryStatus === "Delivered");
                    const isCurrent =
                      (index === 0 && order.deliveryStatus === "Processing") ||
                      (index === 1 && order.deliveryStatus === "Shipped") ||
                      (index === 2 && order.deliveryStatus === "Delivered");

                    return (
                      <div key={step} className="contents">
                        <div className="flex flex-col items-center text-center">
                          <div
                            className={`mb-2 grid h-10 w-10 place-items-center rounded-full border ${
                              isCompleted
                                ? "border-white bg-white text-black"
                                : isCurrent
                                  ? "border-red-500 bg-red-500 text-white"
                                  : "border-white/10 bg-black text-zinc-600"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : (
                              <Circle className="h-5 w-5" />
                            )}
                          </div>
                          <span
                            className={`text-xs font-bold ${
                              isCompleted || isCurrent ? "text-white" : "text-zinc-600"
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                        {index < 2 && (
                          <div
                            className={`mt-5 h-px w-full ${
                              isCompleted ? "bg-white" : "bg-white/10"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                {order.deliveryStatus === "Cancelled" && (
                  <div className="mt-5 flex items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 py-3 text-red-300">
                    <XCircle className="h-5 w-5" />
                    <span className="font-black uppercase">Order Cancelled</span>
                  </div>
                )}
              </div>

              <div className="p-5 md:p-6">
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={`${item.productId}-${index}`} className="flex items-center gap-4">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-contain"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="grid h-full w-full place-items-center">
                            <Package className="h-8 w-8 text-zinc-700" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-black uppercase tracking-tight text-white">
                          {item.name}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-500">
                          <span>Qty: {item.quantity}</span>
                          {item.color && <span>Color: {item.color}</span>}
                          {item.size && <span>Size: {item.size}</span>}
                        </div>
                      </div>
                      <p className="text-right font-black text-white">${Number(item.price).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-zinc-500">Payment:</span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black uppercase ${
                        order.paymentStatus === "Paid"
                          ? "bg-emerald-400/10 text-emerald-300"
                          : "bg-yellow-400/10 text-yellow-300"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {order.deliveryStatus === "Delivered" && (() => {
                      const existingReturn = getReturnForOrder(order);
                      if (existingReturn) {
                        return (
                          <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-black uppercase ${getReturnStatusColor(existingReturn.status)}`}>
                            <RotateCcw className="h-4 w-4" />
                            Return {existingReturn.status}
                          </span>
                        );
                      }
                      return (
                        <button
                          onClick={() => openReturnModal(order)}
                          className="inline-flex items-center gap-2 text-sm font-black uppercase text-red-400 transition-colors hover:text-red-300"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Return
                        </button>
                      );
                    })()}
                    <button
                      onClick={() => handleDeleteOrder(order._id || order.orderId)}
                      className="inline-flex items-center gap-2 text-sm font-black uppercase text-red-500 transition-colors hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                    <button
                      onClick={() => handleBuyAgain(order)}
                      className="inline-flex items-center gap-2 text-sm font-black uppercase text-zinc-500 transition-colors hover:text-white"
                    >
                      Buy Again <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );

  const renderReturns = () => {
    const deliveredOrders = orders.filter((o) => o.deliveryStatus === "Delivered");
    const returnableItems = deliveredOrders.flatMap((order) =>
      order.items.map((item, idx) => ({
        order,
        item,
        idx,
        key: `${order._id || order.orderId}-${idx}`,
      })),
    );

    return (
      <div className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
          <h3 className="text-xl font-black uppercase text-white mb-2">My Returns</h3>
          <p className="text-sm text-zinc-500 mb-6">
            Returns are only available for orders that have been successfully delivered.
          </p>

          {returns.length === 0 && returnableItems.length === 0 ? (
            <div className="py-10 text-center">
              <RotateCcw className="mx-auto mb-4 h-10 w-10 text-zinc-600" />
              <p className="text-lg font-black uppercase text-white">No returns yet</p>
              <p className="mt-2 text-sm text-zinc-500">
                Once you receive a delivered order, you can request a return from the Orders tab.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {returns.map((ret) => (
                <div
                  key={ret._id}
                  className="rounded-2xl border border-white/10 bg-black px-5 py-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-black uppercase text-white">
                        {ret.status === "Approved"
                          ? "Return Approved"
                          : ret.status === "Rejected"
                            ? "Return Rejected"
                            : ret.status === "Requested"
                              ? "Return Requested"
                              : ret.status === "Refunded"
                                ? "Return Refunded"
                                : ret.status === "Cancelled"
                                  ? "Return Cancelled"
                                  : ret.returnId || ret._id}
                      </p>
                      <p className="text-xs text-zinc-500">
                        Order: {ret.orderId?.orderId || ret.orderId || "—"}
                      </p>
                    </div>
                    <StatusBadge status={ret.status} />
                  </div>
                  <div className="mt-3 space-y-1">
                    {ret.items?.map((item: any, idx: number) => (
                      <p key={idx} className="text-xs text-zinc-400">
                        {item.quantity}x {item.name || "Product"}
                        {item.color ? ` (${item.color}` : ""}
                        {item.size ? ` / ${item.size}` : ""}
                        {item.color ? ")" : ""}
                      </p>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">
                    Reason: {ret.reason || "—"}
                  </p>
                  {ret.resolution && (
                    <p className="mt-1 text-xs text-zinc-400">
                      Resolution: {ret.resolution}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAccount = () => (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-black p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="grid h-24 w-24 shrink-0 place-items-center rounded-full bg-red-500 text-3xl font-black text-white">
            {getUserInitials()}
          </div>
          <div className="min-w-0">
            <h3 className="text-3xl font-black uppercase tracking-tight text-white">
              {user?.firstName} {user?.lastName}
            </h3>
            <p className="mt-1 text-sm font-black uppercase tracking-widest text-zinc-500">
              Nike Member
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-zinc-400">
              <Mail className="h-4 w-4" />
              <span className="truncate">{user?.email}</span>
            </div>
          </div>
        </div>
        <div className="mt-7 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
          <div>
            <p className="text-3xl font-black text-white">{orderStats.total}</p>
            <p className="text-xs font-black uppercase text-zinc-500">Orders</p>
          </div>
          <div>
            <p className="text-3xl font-black text-white">${totalSpent.toFixed(0)}</p>
            <p className="text-xs font-black uppercase text-zinc-500">Spent</p>
          </div>
          <div>
            <p className="text-3xl font-black text-white">0</p>
            <p className="text-xs font-black uppercase text-zinc-500">Reviews</p>
          </div>
        </div>
      </div>

      <div className={panelClass}>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-black uppercase text-white">Account Details</h3>
          <button className="inline-flex items-center gap-2 text-sm font-black uppercase text-zinc-500 transition-colors hover:text-white">
            <Edit3 className="h-4 w-4" /> Edit
          </button>
        </div>
        <div className="divide-y divide-white/10">
          {[
            { label: "Full Name", value: `${user?.firstName} ${user?.lastName}`, icon: User },
            { label: "Email", value: user?.email, icon: Mail },
            { label: "Phone", value: "Not set", icon: Phone },
            { label: "Date of Birth", value: user?.dateOfBirth || "Not set", icon: Clock },
            { label: "Gender", value: user?.gender || "Not set", icon: User },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-4 py-4">
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5 text-zinc-500" />
                <span className="font-semibold text-zinc-400">{item.label}</span>
              </div>
              <span className="text-right font-black text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Edit Profile", icon: Edit3 },
          { label: "Change Password", icon: Shield },
          { label: "Notifications", icon: Bell },
        ].map((item) => (
          <button
            key={item.label}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-950 p-4 text-left font-black uppercase text-zinc-300 transition-colors hover:border-white/30 hover:text-white"
          >
            <item.icon className="h-5 w-5 text-red-500" />
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );

  const renderAddress = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black uppercase text-white">Saved Addresses</h3>
        <button className="rounded-full bg-white px-5 py-2 text-sm font-black uppercase text-black transition-colors hover:bg-red-500 hover:text-white">
          Add New
        </button>
      </div>

      {orders.length > 0 && orders[0].shippingInfo?.address ? (
        <div className={panelClass}>
          <div className="flex items-start justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-black">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <h4 className="font-black uppercase text-white">Home</h4>
                  <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-xs font-black uppercase text-emerald-300">
                    Default
                  </span>
                </div>
                <p className="font-semibold text-zinc-300">{orders[0].shippingInfo.fullName}</p>
                <p className="mt-1 text-sm text-zinc-500">
                  {orders[0].shippingInfo.address}, {orders[0].shippingInfo.city}
                </p>
                <p className="text-sm text-zinc-500">
                  {orders[0].shippingInfo.state}, {orders[0].shippingInfo.zipCode}
                </p>
                <p className="mt-2 text-sm text-zinc-500">
                  Phone: {orders[0].shippingInfo.phone || "Not set"}
                </p>
              </div>
            </div>
            <button className="text-zinc-500 transition-colors hover:text-white">
              <Edit3 className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={MapPin}
          title="No addresses saved"
          description="Add an address for faster checkout."
        />
      )}
    </div>
  );

  const renderPayment = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black uppercase text-white">Payment Methods</h3>
        <button className="rounded-full bg-white px-5 py-2 text-sm font-black uppercase text-black transition-colors hover:bg-red-500 hover:text-white">
          Add Card
        </button>
      </div>
      <EmptyState
        icon={CreditCard}
        title="No payment methods"
        description="Add a card for faster checkout."
      />
    </div>
  );

  const renderWishlist = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-black uppercase text-white">My Wishlist</h3>
      <EmptyState
        icon={Heart}
        title="Your wishlist is empty"
        description="Save items you love to your wishlist."
        action={
          <Link href="/nike/products">
            <button className="mt-7 rounded-full bg-white px-8 py-3 text-sm font-black uppercase text-black transition-colors hover:bg-red-500 hover:text-white">
              Browse Products
            </button>
          </Link>
        }
      />
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950">
        {[
          { label: "Account Settings", icon: User },
          { label: "Privacy & Security", icon: Shield },
          { label: "Notification Preferences", icon: Bell },
          { label: "Help Center", icon: HelpCircle },
          { label: "Terms & Conditions", icon: FileText },
        ].map((item) => (
          <button
            key={item.label}
            className="flex w-full items-center justify-between border-b border-white/10 px-6 py-5 text-left transition-colors last:border-0 hover:bg-white/[0.04]"
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-5 w-5 text-zinc-500" />
              <span className="font-black uppercase text-zinc-300">{item.label}</span>
            </div>
            <ChevronRight className="h-5 w-5 text-zinc-600" />
          </button>
        ))}
      </div>

      <button
        onClick={handleLogout}
        className="flex w-full items-center justify-center gap-2 rounded-3xl border border-red-500/20 bg-red-500/10 px-6 py-5 font-black uppercase text-red-300 transition-colors hover:bg-red-500 hover:text-white"
      >
        <LogOut className="h-5 w-5" />
        Sign Out
      </button>
    </div>
  );

  const tabs = [
    { id: "orders", label: "Orders", icon: Package },
    { id: "returns", label: "Returns", icon: RotateCcw },
    { id: "account", label: "Account", icon: User },
    { id: "address", label: "Addresses", icon: MapPin },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const activeLabel = tabs.find((tab) => tab.id === activeTab)?.label;

  const NotificationModal = () => {
    if (!notification) return null;
    const isSuccess = notification.type === "success";

    return (
      <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/80 p-4">
        <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/60">
          <div className={`border-b border-white/10 px-6 py-5 ${isSuccess ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
            <div className="flex items-center gap-3">
              <div
                className={`grid h-10 w-10 place-items-center rounded-full border ${
                  isSuccess ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300" : "border-red-400/30 bg-red-400/10 text-red-300"
                }`}
              >
                {isSuccess ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
              </div>
              <div>
                <h3 className="text-lg font-black uppercase text-white">{isSuccess ? "Success" : "Error"}</h3>
                <p className="text-xs font-semibold text-zinc-500">{notification.message}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4">
            <button
              onClick={() => setNotification(null)}
              className={`h-11 rounded-full px-5 text-sm font-black uppercase transition-colors ${
                isSuccess
                  ? "border border-white/10 bg-white text-black hover:bg-emerald-400"
                  : "border border-white/10 bg-white text-black hover:bg-red-500 hover:text-white"
              }`}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <EcomNavbar />

      {deleteTargetId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 p-4">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/60">
            <div className="border-b border-white/10 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-red-500/30 bg-red-500/10">
                  <Trash2 className="h-4 w-4 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase text-white">Delete Order</h3>
                  <p className="text-xs font-semibold text-zinc-500">This action cannot be undone</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-5">
              <p className="text-sm font-semibold text-zinc-300">
                Are you sure you want to delete this order? This will permanently remove it
                from your order history.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="h-11 rounded-full border border-white/10 px-5 text-sm font-black uppercase text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteOrder}
                className="h-11 rounded-full bg-red-500 px-5 text-sm font-black uppercase text-white transition-colors hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {returnModalOrder && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/60">
            <div className="border-b border-white/10 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-red-500/30 bg-red-500/10">
                  <RotateCcw className="h-4 w-4 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase text-white">Request Return</h3>
                  <p className="text-xs font-semibold text-zinc-500">
                    Order {returnModalOrder.orderId}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-5 space-y-4">
              <p className="text-xs font-black uppercase tracking-wider text-zinc-400">
                Select Items to Return
              </p>
              <div className="space-y-2">
                {returnModalOrder.items.map((item: any, idx: number) => {
                  const checked = selectedReturnItems.includes(String(idx));
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleReturnItem(idx)}
                      className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-colors ${
                        checked
                          ? "border-white bg-white text-black"
                          : "border-white/10 bg-black text-zinc-300 hover:border-white/20"
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black uppercase">{item.name}</p>
                        <p className={`text-xs ${checked ? "text-black/70" : "text-zinc-500"}`}>
                          Qty: {item.quantity} {item.color ? `· ${item.color}` : ""} {item.size ? `· ${item.size}` : ""}
                        </p>
                      </div>
                      <p className="text-sm font-black">${(Number(item.price) * Number(item.quantity)).toFixed(2)}</p>
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-white/45">
                  Reason <span className="text-red-400">*</span>
                </label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm font-medium text-white outline-none transition-colors focus:border-white/40"
                >
                  <option value="">Select a reason</option>
                  <option value="Damaged">Damaged</option>
                  <option value="Wrong item">Wrong item</option>
                  <option value="No longer needed">No longer needed</option>
                  <option value="Poor quality">Poor quality</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-white/45">
                  Description
                </label>
                <textarea
                  value={returnDescription}
                  onChange={(e) => setReturnDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm font-medium text-white outline-none transition-colors placeholder:text-white/25 focus:border-white/40"
                  placeholder="Add more details about your return..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4">
              <button
                onClick={() => {
                  setReturnModalOrder(null);
                  setSelectedReturnItems([]);
                  setReturnReason("");
                  setReturnDescription("");
                }}
                className="h-11 rounded-full border border-white/10 px-5 text-sm font-black uppercase text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={submitReturn}
                disabled={!returnReason || selectedReturnItems.length === 0 || submittingReturn}
                className="h-11 rounded-full bg-red-500 px-5 text-sm font-black uppercase text-white transition-colors hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingReturn ? "Submitting..." : "Submit Return"}
              </button>
            </div>
          </div>
        </div>
      )}

      <NotificationModal />

      <section className="border-b border-white/10 bg-[linear-gradient(120deg,#09090b_0%,#000_52%,rgba(239,68,68,0.16)_100%)] pt-28">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.32em] text-red-500">
                Nike Member
              </p>
              <h1 className="text-5xl font-black uppercase leading-none tracking-tight md:text-7xl">
                My
                <span className="block text-zinc-500">Profile</span>
              </h1>
              <p className="mt-5 max-w-2xl text-sm font-semibold leading-7 text-zinc-400 md:text-base">
                Manage your orders, delivery details, profile information, and saved
                preferences in one clean account space.
              </p>
            </div>
            <div className="grid w-full max-w-md grid-cols-3 overflow-hidden rounded-3xl border border-white/10 bg-black/60">
              <div className="border-r border-white/10 p-4">
                <p className="text-2xl font-black">{orderStats.total}</p>
                <p className="text-xs font-black uppercase text-zinc-500">Orders</p>
              </div>
              <div className="border-r border-white/10 p-4">
                <p className="text-2xl font-black">${totalSpent.toFixed(0)}</p>
                <p className="text-xs font-black uppercase text-zinc-500">Spent</p>
              </div>
              <div className="p-4">
                <p className="text-2xl font-black">{orderStats.delivered}</p>
                <p className="text-xs font-black uppercase text-zinc-500">Delivered</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className={panelClass}>
              <div className="flex items-center gap-4">
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-red-500 text-xl font-black">
                  {getUserInitials()}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-black uppercase text-white">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="truncate text-sm font-semibold text-zinc-500">{user?.email}</p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex w-full items-center gap-3 border-b border-white/10 px-5 py-4 text-left transition-colors last:border-0 ${
                    activeTab === tab.id
                      ? "bg-white text-black"
                      : "text-zinc-500 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="font-black uppercase">{tab.label}</span>
                </button>
              ))}
            </div>
          </aside>

          <section className="min-w-0">
            <div className={`${panelClass} mb-6 flex items-center justify-between`}>
              <div>
                <p className={labelClass}>Account Section</p>
                <h2 className="mt-1 text-3xl font-black uppercase tracking-tight text-white">
                  {activeLabel}
                </h2>
              </div>
              <ShoppingBag className="hidden h-8 w-8 text-zinc-700 sm:block" />
            </div>

            {activeTab === "orders" && renderOrders()}
            {activeTab === "returns" && renderReturns()}
            {activeTab === "account" && renderAccount()}
            {activeTab === "address" && renderAddress()}
            {activeTab === "payment" && renderPayment()}
            {activeTab === "wishlist" && renderWishlist()}
            {activeTab === "settings" && renderSettings()}
          </section>
        </div>
      </main>

      <EcomFooter />
    </div>
  );
};

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: typeof Package;
  title: string;
  description: string;
  action?: ReactNode;
}) => (
  <div className={`${panelClass} py-14 text-center`}>
    <div className="mx-auto mb-5 grid h-[72px] w-[72px] place-items-center rounded-full border border-white/10 bg-black">
      <Icon className="h-8 w-8 text-zinc-600" />
    </div>
    <p className="text-xl font-black uppercase text-white">{title}</p>
    <p className="mt-2 text-sm text-zinc-500">{description}</p>
    {action}
  </div>
);

const StatusBadge = ({ status }: { status?: string }) => {
  const normalized = (status || "").toLowerCase();
  const cls =
    ["paid", "delivered", "refunded", "approved"].includes(normalized) ||
    status === "Delivered" ||
    status === "Paid" ||
    status === "Refunded" ||
    status === "Approved"
      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
      : ["pending", "processing", "shipped", "requested"].includes(normalized) ||
        status === "Pending" ||
        status === "Processing" ||
        status === "Shipped" ||
        status === "Requested"
        ? "border-amber-300/30 bg-amber-300/10 text-amber-200"
        : ["failed", "cancelled", "rejected", "banned"].includes(normalized) ||
          status === "Failed" ||
          status === "Cancelled" ||
          status === "Rejected" ||
          status === "Banned"
          ? "border-red-400/30 bg-red-400/10 text-red-300"
          : "border-white/10 bg-white/[0.06] text-white/60";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${cls}`}
    >
      {status || "Unknown"}
    </span>
  );
};

export default ProfilePage;
