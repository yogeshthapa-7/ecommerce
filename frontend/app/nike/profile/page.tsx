"use client";

import React, { useEffect, useState } from 'react';
import {
    User,
    Package,
    MapPin,
    CreditCard,
    Heart,
    Settings,
    LogOut,
    ChevronRight,
    Clock,
    Truck,
    CheckCircle,
    XCircle,
    Circle,
    Box,
    Mail,
    Phone,
    Calendar,
    Edit3,
    Shield,
    Bell,
    HelpCircle,
    ShoppingBag,
    ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserData {
    _id?: string;
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

type TabType = 'orders' | 'account' | 'address' | 'payment' | 'wishlist' | 'settings';

const ProfilePage = () => {
    const [user, setUser] = useState<UserData | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [activeTab, setActiveTab] = useState<TabType>('orders');
    const [loading, setLoading] = useState(true);
    const [orderFilter, setOrderFilter] = useState<string>('all');
    const router = useRouter();

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            try {
                const userData = JSON.parse(userStr);
                setUser(userData);
                const userId = userData._id || userData.id;
                fetchOrders(userId);
            } catch (e) {
                router.push("/login");
            }
        } else {
            router.push("/login");
        }
    }, [router]);

    const fetchOrders = async (userId: string) => {
        if (!userId) {
            setLoading(false);
            return;
        }
        let apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        if (apiBaseUrl.endsWith('/api')) {
            apiBaseUrl = apiBaseUrl.slice(0, -4);
        }
        const token = localStorage.getItem("token");
        try {
            let response = await fetch(`${apiBaseUrl}/api/orders/user/${userId}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            if (response.status === 404 || response.status === 500 || response.status === 401) {
                // Fallback: fetch all orders and filter by email
                const allOrdersResponse = await fetch(`${apiBaseUrl}/api/orders`);
                if (allOrdersResponse.ok) {
                    const allOrders = await allOrdersResponse.json();
                    const userStr = localStorage.getItem("user");
                    if (userStr) {
                        const userData = JSON.parse(userStr);
                        const filteredOrders = allOrders.filter((order: Order) => order.customerEmail === userData.email);
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

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
    };

    const getUserInitials = () => {
        if (!user) return "?";
        const first = user.firstName?.charAt(0) || "";
        const last = user.lastName?.charAt(0) || "";
        return (first + last).toUpperCase() || user.firstName?.charAt(0)?.toUpperCase() || "U";
    };

    const filteredOrders = orders.filter(order => {
        if (orderFilter === 'all') return true;
        if (orderFilter === 'processing') return order.deliveryStatus === 'Processing';
        if (orderFilter === 'shipped') return order.deliveryStatus === 'Shipped';
        if (orderFilter === 'delivered') return order.deliveryStatus === 'Delivered';
        if (orderFilter === 'cancelled') return order.deliveryStatus === 'Cancelled';
        return true;
    });

    const getDeliveryStatusColor = (status: string) => {
        switch (status) {
            case 'Processing':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Shipped':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Delivered':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getDeliveryIcon = (status: string) => {
        switch (status) {
            case 'Processing':
                return <Clock className="w-4 h-4" />;
            case 'Shipped':
                return <Truck className="w-4 h-4" />;
            case 'Delivered':
                return <CheckCircle className="w-4 h-4" />;
            case 'Cancelled':
                return <XCircle className="w-4 h-4" />;
            default:
                return <Package className="w-4 h-4" />;
        }
    };

    const orderStats = {
        total: orders.length,
        processing: orders.filter(o => o.deliveryStatus === 'Processing').length,
        shipped: orders.filter(o => o.deliveryStatus === 'Shipped').length,
        delivered: orders.filter(o => o.deliveryStatus === 'Delivered').length,
    };

    const renderOrders = () => (
        <div className="space-y-6">
            {/* Order Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Orders', value: orderStats.total, color: 'from-gray-800 to-gray-900' },
                    { label: 'Processing', value: orderStats.processing, color: 'from-yellow-500 to-yellow-600' },
                    { label: 'Shipped', value: orderStats.shipped, color: 'from-blue-500 to-blue-600' },
                    { label: 'Delivered', value: orderStats.delivered, color: 'from-green-500 to-green-600' },
                ].map((stat, index) => (
                    <div key={index} className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 text-white`}>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-xs opacity-80">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Order Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {['all', 'processing', 'shipped', 'delivered', 'cancelled'].map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setOrderFilter(filter)}
                        className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${orderFilter === filter
                            ? 'bg-black text-white shadow-lg'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        {filter === 'all' && orders.length > 0 && ` (${orders.length})`}
                    </button>
                ))}
            </div>

            {/* Orders List */}
            {loading ? (
                <div className="flex justify-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-2xl">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg font-medium">No orders yet</p>
                    <p className="text-gray-400 text-sm mt-1">Start shopping to see your orders here</p>
                    <Link href="/nike/products">
                        <button className="mt-6 px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors">
                            Shop Now
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {filteredOrders.map((order) => (
                        <div key={order._id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            {/* Order Header */}
                            <div className="bg-gray-50 px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-b border-gray-100">
                                <div className="flex items-center gap-6">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Order ID</p>
                                        <p className="font-semibold text-gray-900">{order.orderId}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
                                        <p className="text-gray-700">{order.date}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Items</p>
                                        <p className="text-gray-700">{order.items.length} product{order.items.length > 1 ? 's' : ''}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${getDeliveryStatusColor(order.deliveryStatus)}`}>
                                        {getDeliveryIcon(order.deliveryStatus)}
                                        {order.deliveryStatus}
                                    </span>
                                    <p className="text-xl font-bold text-gray-900">${order.total.toFixed(2)}</p>
                                </div>
                            </div>

                            {/* Order Tracking Timeline */}
                            <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-gray-100">
                                <p className="text-sm font-semibold text-gray-700 mb-4">Order Status</p>
                                <div className="flex items-center justify-between">
                                    {['Processing', 'Shipped', 'Delivered'].map((step, index) => {
                                        const isCompleted = (index === 0 && (order.deliveryStatus === 'Processing' || order.deliveryStatus === 'Shipped' || order.deliveryStatus === 'Delivered')) ||
                                            (index === 1 && (order.deliveryStatus === 'Shipped' || order.deliveryStatus === 'Delivered')) ||
                                            (index === 2 && order.deliveryStatus === 'Delivered');
                                        const isCurrent = (index === 0 && order.deliveryStatus === 'Processing') ||
                                            (index === 1 && order.deliveryStatus === 'Shipped') ||
                                            (index === 2 && order.deliveryStatus === 'Delivered');

                                        return (
                                            <React.Fragment key={step}>
                                                <div className="flex flex-col items-center">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${isCompleted ? 'bg-black text-white' : isCurrent ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-400'
                                                        }`}>
                                                        {isCompleted ? <CheckCircle className="w-5 h-5" /> :
                                                            isCurrent ? <Box className="w-5 h-5" /> :
                                                                <Circle className="w-5 h-5" />}
                                                    </div>
                                                    <span className={`text-xs font-medium ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>
                                                        {step}
                                                    </span>
                                                </div>
                                                {index < 2 && (
                                                    <div className={`flex-1 h-0.5 mx-2 ${isCompleted ? 'bg-black' : 'bg-gray-300'}`}></div>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                                {order.deliveryStatus === 'Cancelled' && (
                                    <div className="mt-4 flex items-center justify-center gap-2 text-red-600 bg-red-50 rounded-lg py-2">
                                        <XCircle className="w-5 h-5" />
                                        <span className="font-medium">Order Cancelled</span>
                                    </div>
                                )}
                            </div>

                            {/* Order Items */}
                            <div className="p-6">
                                <div className="space-y-4">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex gap-4 items-center">
                                            <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package className="w-8 h-8 text-gray-300" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 truncate">{item.name}</p>
                                                <div className="flex gap-4 mt-1 text-sm text-gray-500">
                                                    <span>Qty: {item.quantity}</span>
                                                    {item.color && <span>Color: {item.color}</span>}
                                                    {item.size && <span>Size: {item.size}</span>}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-900">${item.price.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Payment Status */}
                                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500">Payment:</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {order.paymentStatus}
                                        </span>
                                    </div>
                                    <Link href={`/nike/products`}>
                                        <button className="text-sm text-gray-500 hover:text-black flex items-center gap-1 transition-colors">
                                            Buy Again <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const renderAccount = () => (
        <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 text-white">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                        {getUserInitials()}
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold">{user?.firstName} {user?.lastName}</h3>
                        <p className="text-gray-400">Nike Member</p>
                        <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-1 text-sm text-gray-300">
                                <Mail className="w-4 h-4" />
                                {user?.email}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-700 grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold">{orderStats.total}</p>
                        <p className="text-xs text-gray-400">Orders</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold">${orders.reduce((sum, o) => sum + o.total, 0).toFixed(0)}</p>
                        <p className="text-xs text-gray-400">Spent</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold">0</p>
                        <p className="text-xs text-gray-400">Reviews</p>
                    </div>
                </div>
            </div>

            {/* Account Details */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Account Details</h3>
                    <button className="text-sm text-gray-500 hover:text-black flex items-center gap-1">
                        <Edit3 className="w-4 h-4" /> Edit
                    </button>
                </div>
                <div className="space-y-4">
                    {[
                        { label: 'Full Name', value: `${user?.firstName} ${user?.lastName}`, icon: User },
                        { label: 'Email', value: user?.email, icon: Mail },
                        { label: 'Phone', value: 'Not set', icon: Phone },
                        { label: 'Date of Birth', value: user?.dateOfBirth || 'Not set', icon: Calendar },
                        { label: 'Gender', value: user?.gender || 'Not set', icon: User },
                    ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                            <div className="flex items-center gap-3">
                                <item.icon className="w-5 h-5 text-gray-400" />
                                <span className="text-gray-600">{item.label}</span>
                            </div>
                            <span className="font-medium text-gray-900">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: 'Edit Profile', icon: Edit3, color: 'bg-blue-50 text-blue-600' },
                    { label: 'Change Password', icon: Shield, color: 'bg-purple-50 text-purple-600' },
                    { label: 'Notifications', icon: Bell, color: 'bg-orange-50 text-orange-600' },
                ].map((item, index) => (
                    <button key={index} className={`${item.color} p-4 rounded-xl flex items-center gap-3 hover:opacity-80 transition-opacity`}>
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );

    const renderAddress = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Saved Addresses</h3>
                <button className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                    + Add New
                </button>
            </div>

            {orders.length > 0 && orders[0].shippingInfo?.address ? (
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-semibold text-gray-900">Home</h4>
                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Default</span>
                                </div>
                                <p className="text-gray-600">{orders[0].shippingInfo.fullName}</p>
                                <p className="text-gray-500 text-sm mt-1">
                                    {orders[0].shippingInfo.address}, {orders[0].shippingInfo.city}
                                </p>
                                <p className="text-gray-500 text-sm">
                                    {orders[0].shippingInfo.state}, {orders[0].shippingInfo.zipCode}
                                </p>
                                <p className="text-gray-500 text-sm mt-1">Phone: {orders[0].shippingInfo.phone || 'Not set'}</p>
                            </div>
                        </div>
                        <button className="text-gray-400 hover:text-black">
                            <Edit3 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-gray-50 rounded-2xl p-12 text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No addresses saved</p>
                    <p className="text-gray-400 text-sm mt-1">Add an address for faster checkout</p>
                </div>
            )}
        </div>
    );

    const renderPayment = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
                <button className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                    + Add Card
                </button>
            </div>

            <div className="bg-gray-50 rounded-2xl p-12 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No payment methods</p>
                <p className="text-gray-400 text-sm mt-1">Add a card for faster checkout</p>
            </div>
        </div>
    );

    const renderWishlist = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">My Wishlist</h3>
            <div className="bg-gray-50 rounded-2xl p-12 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">Your wishlist is empty</p>
                <p className="text-gray-400 text-sm mt-1">Save items you love to your wishlist</p>
                <Link href="/nike/products">
                    <button className="mt-6 px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors">
                        Browse Products
                    </button>
                </Link>
            </div>
        </div>
    );

    const renderSettings = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {[
                    { label: 'Account Settings', icon: User },
                    { label: 'Privacy & Security', icon: Shield },
                    { label: 'Notification Preferences', icon: Bell },
                    { label: 'Help Center', icon: HelpCircle },
                    { label: 'Terms & Conditions', icon: FileText },
                ].map((item, index) => (
                    <button
                        key={index}
                        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                    >
                        <div className="flex items-center gap-3">
                            <item.icon className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-700 font-medium">{item.label}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                ))}
            </div>

            <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-colors font-medium"
            >
                <LogOut className="w-5 h-5" />
                Sign Out
            </button>
        </div>
    );

    const tabs = [
        { id: 'orders', label: 'Orders', icon: Package },
        { id: 'account', label: 'Account', icon: User },
        { id: 'address', label: 'Addresses', icon: MapPin },
        { id: 'payment', label: 'Payment', icon: CreditCard },
        { id: 'wishlist', label: 'Wishlist', icon: Heart },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-gray-900 to-black text-white py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <h1 className="text-4xl font-bold mb-2">My Profile</h1>
                    <p className="text-gray-400">Manage your account and view your orders</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="lg:w-64 flex-shrink-0">
                        {/* User Card */}
                        <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-200">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center text-white text-xl font-bold">
                                    {getUserInitials()}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">
                                        {user?.firstName} {user?.lastName}
                                    </p>
                                    <p className="text-sm text-gray-500">{user?.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as TabType)}
                                    className={`w-full flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 ${activeTab === tab.id ? 'bg-gray-50 border-l-4 border-l-black' : ''
                                        }`}
                                >
                                    <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-black' : 'text-gray-500'}`} />
                                    <span className={`${activeTab === tab.id ? 'text-black font-medium' : 'text-gray-600'}`}>
                                        {tab.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {tabs.find(t => t.id === activeTab)?.label}
                            </h2>
                        </div>

                        {activeTab === 'orders' && renderOrders()}
                        {activeTab === 'account' && renderAccount()}
                        {activeTab === 'address' && renderAddress()}
                        {activeTab === 'payment' && renderPayment()}
                        {activeTab === 'wishlist' && renderWishlist()}
                        {activeTab === 'settings' && renderSettings()}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Add FileText icon that was missing
function FileText(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
    );
}

export default ProfilePage;