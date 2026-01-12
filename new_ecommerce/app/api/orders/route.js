import { NextResponse } from "next/server"

const orders = [
    { id: "ORD001", customer: "John Doe", date: "2026-01-05", total: 450, paymentStatus: "Paid", deliveryStatus: "Processing" },
    { id: "ORD002", customer: "Jane Smith", date: "2026-01-04", total: 120, paymentStatus: "Pending", deliveryStatus: "Processing" },
    { id: "ORD003", customer: "Mike Johnson", date: "2026-01-03", total: 980, paymentStatus: "Paid", deliveryStatus: "Shipped" },
    { id: "ORD004", customer: "Alice Brown", date: "2026-01-02", total: 0, paymentStatus: "Failed", deliveryStatus: "Cancelled" },
    { id: "ORD005", customer: "Chris Wilson", date: "2026-01-01", total: 230, paymentStatus: "Paid", deliveryStatus: "Delivered" },
    { id: "ORD006", customer: "Aloj Khadka", date: "2026-01-05", total: 230, paymentStatus: "Pending", deliveryStatus: "Processing" },
  ]

  export async function GET() {
    return NextResponse.json(orders)
  }