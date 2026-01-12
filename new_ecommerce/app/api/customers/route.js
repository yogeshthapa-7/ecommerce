import { NextResponse } from "next/server"

const customers = [
  { id: "1", name: "John Doe", email: "john@example.com", phone: "+1 555-1234", orders: 5, totalSpent: 450, status: "Active" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", phone: "+1 555-5678", orders: 2, totalSpent: 120, status: "Inactive" },
  { id: "3", name: "Mike Johnson", email: "mike@example.com", phone: "+1 555-9012", orders: 10, totalSpent: 980, status: "Active" },
  { id: "4", name: "Alice Brown", email: "alice@example.com", phone: "+1 555-3456", orders: 0, totalSpent: 0, status: "Banned" },
  { id: "5", name: "Chris Wilson", email: "chris@example.com", phone: "+1 555-7890", orders: 3, totalSpent: 230, status: "Active" },
  { id: "6", name: "Sara Davis", email: "sara@example.com", phone: "+1 555-2468", orders: 1, totalSpent: 75, status: "Inactive" },
  { id: "7", name: "David Lee", email: "david@example.com", phone: "+1 555-1357", orders: 8, totalSpent: 670, status: "Active" },
  { id: "8", name: "Emma Clark", email: "emma@example.com", phone: "+1 555-9753", orders: 0, totalSpent: 0, status: "Banned" },
  { id: "9", name: "Brian Martinez", email: "brian@example.com", phone: "+1 555-8642", orders: 6, totalSpent: 520, status: "Active" },
  { id: "10", name: "Olivia Taylor", email: "olivia@example.com", phone: "+1 555-3698", orders: 4, totalSpent: 310, status: "Active" },
]

export async function GET() {
  return NextResponse.json(customers)
}
