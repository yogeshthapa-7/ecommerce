export type OrderItem = {
  productId?: string
  name?: string
  price?: number
  quantity?: number
  color?: string
  size?: string | number
  image?: string
  image_url?: string
  product?: {
    name?: string
    image?: string
    image_url?: string
  }
}

export type DashboardOrder = {
  _id?: string
  id?: string
  orderId?: string
  customer?: string | { name?: string; email?: string }
  customerEmail?: string
  items?: OrderItem[] | string
  total?: number
  status?: string
  paymentStatus?: string
  deliveryStatus?: string
  paymentMethod?: string
  shippingInfo?: {
    fullName?: string
    email?: string
    phone?: string
    address?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  }
  createdAt?: string
  date?: string
}

export const formatCurrency = (value?: number) => `$${(Number(value) || 0).toLocaleString()}`

export const getOrderDisplayId = (order: DashboardOrder) =>
  order.orderId || (order._id ? order._id.substring(0, 8) : order.id) || "Order"

export const getCustomerName = (order: DashboardOrder) =>
  order.shippingInfo?.fullName ||
  (typeof order.customer === "object" ? order.customer?.name : order.customer) ||
  "Walking Guest"

export const getCustomerEmail = (order: DashboardOrder) =>
  order.shippingInfo?.email ||
  (typeof order.customer === "object" ? order.customer?.email : undefined) ||
  order.customerEmail ||
  "No email provided"

export const getOrderItems = (order: DashboardOrder): OrderItem[] =>
  Array.isArray(order.items) ? order.items : []

export const getItemImage = (item: OrderItem) =>
  item.image || item.image_url || item.product?.image_url || item.product?.image || ""

export const getItemName = (item: OrderItem) =>
  item.name || item.product?.name || "Product"

export const formatPaymentMethod = (method?: string) =>
  method ? method.charAt(0).toUpperCase() + method.slice(1) : "Online"
