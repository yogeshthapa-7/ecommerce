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
    ShoppingBag,
    Star,
    AlertCircle
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
        // Check for logged in user
        const userStr = localStorage.getItem("user");
        if (userStr) {
            try {
                const userData = JSON.parse(userStr);
                setUser(userData);
                fetchOrders(userData._id);
            } catch (e) {
                console.error("Error parsing user data", e);
                router.push("/login");
            }
        } else {
            router.push("/login");
        }
    }, [router]);

    const fetchOrders = async (userId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/orders/user/${userId}`);
            if (response.ok) {
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

    const getDeliveryStatusIcon = (status: string) => {
        switch (status) {
            case 'Processing':
                return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'Shipped':
                return <Truck className="w-5 h-5 text-blue-500" />;
            case 'Delivered':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'Cancelled':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Package className="w-5 h-5 text-gray-500" />;
        }
    };

    const getDeliveryStatusColor = (status: string) => {
        switch (status) {
            case 'Processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'Shipped':
                return 'bg-blue-100 text-blue-800';
            case 'Delivered':
                return 'bg-green-100 text-green-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const tabs = [
        { id: 'orders', label: 'My Orders', icon: Package },
        { id: 'account', label: 'My Account', icon: User },
        { id: 'address', label: 'Address Book', icon: MapPin },
        { id: 'payment', label: 'Payment Methods', icon: CreditCard },
        { id: 'wishlist', label: 'My Wishlist', icon: Heart },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    const renderOrders = () => (
        <div className="space-y-6">
            {/* Order Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {['all', 'processing', 'shipped', 'delivered', 'cancelled'].map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setOrderFilter(filter)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${orderFilter === filter
                                ? 'bg-red-500 text-white'
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
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No orders found</p>
                    <Link href="/nike/products">
                        <button className="mt-4 px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                            Start Shopping
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <div key={order._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                            {/* Order Header */}
                            <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-b border-gray-200">
                                <div>
                                    <p className="text-sm text-gray-500">Order ID</p>
                                    <p className="font-semibold text-gray-800">{order.orderId}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">{order.date}</p>
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getDeliveryStatusColor(order.deliveryStatus)}`}>
                                        {getDeliveryStatusIcon(order.deliveryStatus)}
                                        {order.deliveryStatus}
                                    </span>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="p-4">
                                <div className="space-y-3">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex gap-4">
                                            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package className="w-8 h-8 text-gray-300" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800">{item.name}</p>
                                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                {item.color && <p className="text-sm text-gray-500">Color: {item.color}</p>}
                                                {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-800">${item.price.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Total */}
                                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-500">Payment Status</p>
                                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {order.paymentStatus}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Total</p>
                                        <p className="text-xl font-bold text-gray-800">${order.total.toFixed(2)}</p>
                                    </div>
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
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Information</h3>
                <div className="grid gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {getUserInitials()}
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-gray-800">
                                {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-gray-500">Member</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Details</h3>
                <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-500">Full Name</span>
                        <span className="font-medium text-gray-800">{user?.firstName} {user?.lastName}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-500">Email</span>
                        <span className="font-medium text-gray-800">{user?.email}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-500">Date of Birth</span>
                        <span className="font-medium text-gray-800">{user?.dateOfBirth || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between py-3">
                        <span className="text-gray-500">Gender</span>
                        <span className="font-medium text-gray-800">{user?.gender || 'Not set'}</span>
                    </div>
                </div>
            </div>

            {/* Account Settings Links */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {[
                    { label: 'Edit Profile', icon: User },
                    { label: 'Change Password', icon: Settings },
                    { label: 'Notification Settings', icon: AlertCircle },
                ].map((item, index) => (
                    <button
                        key={index}
                        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                        <div className="flex items-center gap-3">
                            <item.icon className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-700">{item.label}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                ))}
            </div>
        </div>
    );

    const renderAddress = () => (
        <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Saved Addresses</h3>
                    <button className="text-red-500 hover:text-red-600 font-medium">+ Add New</button>
                </div>

                {orders.length > 0 && orders[0].shippingInfo?.address ? (
                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Default</span>
                        </div>
                        <p className="font-semibold text-gray-800 mb-1">
                            {orders[0].shippingInfo.fullName || 'Not set'}
                        </p>
                        <p className="text-gray-600 text-sm mb-1">
                            {orders[0].shippingInfo.address}, {orders[0].shippingInfo.city}
                        </p>
                        <p className="text-gray-600 text-sm mb-1">
                            {orders[0].shippingInfo.state}, {orders[0].shippingInfo.zipCode}
                        </p>
                        <p className="text-gray-500 text-sm">Phone: {orders[0].shippingInfo.phone || 'Not set'}</p>
                    </div>
                ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No addresses saved yet</p>
                    </div>
                )}
            </div>
        </div>
    );

    const renderPayment = () => (
        <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Payment Methods</h3>
                    <button className="text-red-500 hover:text-red-600 font-medium">+ Add New</button>
                </div>

                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No payment methods saved</p>
                    <p className="text-gray-400 text-sm mt-1">Add a card for faster checkout</p>
                </div>
            </div>
        </div>
    );

    const renderWishlist = () => (
        <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="text-center py-8">
                    <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Your wishlist is empty</p>
                    <p className="text-gray-400 text-sm mt-1">Save items you like to your wishlist</p>
                    <Link href="/nike/products">
                        <button className="mt-4 px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                            Browse Products
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );

    const renderSettings = () => (
        <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {[
                    { label: 'Account Settings', icon: User },
                    { label: 'Notification Preferences', icon: AlertCircle },
                    { label: 'Privacy & Security', icon: Settings },
                    { label: 'Help Center', icon: Package },
                ].map((item, index) => (
                    <button
                        key={index}
                        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                        <div className="flex items-center gap-3">
                            <item.icon className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-700">{item.label}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                ))}
            </div>

            <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
            </button>
        </div>
    );

    // Calculate order stats
    const orderStats = {
        total: orders.length,
        processing: orders.filter(o => o.deliveryStatus === 'Processing').length,
        shipped: orders.filter(o => o.deliveryStatus === 'Shipped').length,
        delivered: orders.filter(o => o.deliveryStatus === 'Delivered').length,
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar */}
                    <div className="lg:w-64 flex-shrink-0">
                        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                                    {getUserInitials()}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        {user?.firstName} {user?.lastName}
                                    </p>
                                    <p className="text-sm text-gray-500">{user?.email}</p>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-800">{orderStats.total}</p>
                                    <p className="text-xs text-gray-500">Orders</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-800">${orders.reduce((sum, o) => sum + o.total, 0).toFixed(0)}</p>
                                    <p className="text-xs text-gray-500">Spent</p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Menu */}
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as TabType)}
                                    className={`w-full flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${activeTab === tab.id ? 'bg-red-50 border-l-4 border-l-red-500' : ''
                                        }`}
                                >
                                    <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-red-500' : 'text-gray-500'}`} />
                                    <span className={`${activeTab === tab.id ? 'text-red-600 font-medium' : 'text-gray-700'}`}>
                                        {tab.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                            <h2 className="text-xl font-bold text-gray-800">
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

export default ProfilePage;