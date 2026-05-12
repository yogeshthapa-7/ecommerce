"use client"

import Link from "next/link"
import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, Calendar, CreditCard, LoaderCircle, MapPin, Printer, Truck } from "lucide-react"
import {
  DashboardOrder,
  formatCurrency,
  formatPaymentMethod,
  getCustomerEmail,
  getCustomerName,
  getItemImage,
  getItemName,
  getOrderDisplayId,
  getOrderItems,
} from "@/lib/order-helpers"

export default function InvoicePage() {
  const params = useParams<{ orderId: string }>()
  const [order, setOrder] = useState<DashboardOrder | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true)
      setError("")

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/${params.orderId}`)
        setOrder(response.data)
      } catch (fetchError) {
        console.error("Error fetching invoice order:", fetchError)
        setError("We couldn't load that invoice right now.")
      } finally {
        setIsLoading(false)
      }
    }

    if (params.orderId) {
      fetchOrder()
    }
  }, [params.orderId])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#f3efe7] px-6 py-16 text-[#171717]">
        <div className="mx-auto flex max-w-3xl items-center justify-center rounded-[28px] border border-black/10 bg-white px-6 py-20 shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.18em] text-black/55">
            <LoaderCircle className="animate-spin" size={18} />
            Loading Invoice
          </div>
        </div>
      </main>
    )
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-[#f3efe7] px-6 py-16 text-[#171717]">
        <div className="mx-auto max-w-3xl rounded-[28px] border border-black/10 bg-white p-8 shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-black/45">Invoice Error</p>
          <h1 className="mt-4 text-4xl font-black uppercase tracking-tight text-black">Order Not Available</h1>
          <p className="mt-4 max-w-xl text-sm font-medium leading-7 text-black/65">{error || "This order could not be found."}</p>
          <Link
            href="/admin"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-black/10 bg-black px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#1f1f1f]"
          >
            <ArrowLeft size={16} />
            Back To Dashboard
          </Link>
        </div>
      </main>
    )
  }

  const items = getOrderItems(order)
  const subtotal = items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0)
  const total = Number(order.total) || subtotal
  const tax = Math.max(total - subtotal, 0)
  const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : order.date || "N/A"

  return (
    <main className="min-h-screen bg-[#f3efe7] px-4 py-8 text-[#171717] sm:px-6 lg:px-8 print:bg-white print:px-0 print:py-0">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-black transition-colors hover:bg-black hover:text-white"
          >
            <ArrowLeft size={15} />
            Back
          </Link>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-xs font-black uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#252525]"
          >
            <Printer size={15} />
            Print Bill
          </button>
        </div>

        <section className="overflow-hidden rounded-[30px] border border-black/10 bg-white shadow-[0_20px_80px_rgba(0,0,0,0.08)] print:rounded-none print:border-none print:shadow-none">
          <div className="border-b border-black/10 bg-[radial-gradient(circle_at_top_left,_rgba(226,232,240,0.75),_rgba(255,255,255,1)_42%)] px-6 py-7 sm:px-10 sm:py-10">
            <div className="flex flex-wrap items-start justify-between gap-8">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-black/45">Nike Admin Invoice</p>
                <h1 className="mt-3 text-4xl font-black uppercase leading-none tracking-tight text-black sm:text-5xl">
                  {getOrderDisplayId(order)}
                </h1>
                <div className="mt-5 flex flex-wrap gap-5 text-sm font-semibold text-black/55">
                  <span className="inline-flex items-center gap-2">
                    <Calendar size={15} />
                    {orderDate}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <CreditCard size={15} />
                    {formatPaymentMethod(order.paymentMethod)}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Truck size={15} />
                    {order.deliveryStatus || "Processing"}
                  </span>
                </div>
              </div>

              <div className="min-w-[220px] rounded-[24px] border border-black/10 bg-black px-6 py-5 text-white">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/50">Bill To</p>
                <p className="mt-3 text-xl font-black">{getCustomerName(order)}</p>
                <p className="mt-1 text-sm font-medium text-white/72">{getCustomerEmail(order)}</p>
                {order.shippingInfo?.phone ? (
                  <p className="mt-1 text-sm font-medium text-white/72">{order.shippingInfo.phone}</p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="grid gap-8 px-6 py-7 sm:px-10 sm:py-10 lg:grid-cols-[1.35fr_0.65fr]">
            <div>
              <div className="mb-5 flex items-center justify-between gap-4">
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-black/45">Purchased Items</h2>
                <span className="text-sm font-black uppercase tracking-[0.16em] text-black/55">
                  {items.length || 1} item{(items.length || 1) === 1 ? "" : "s"}
                </span>
              </div>

              <div className="space-y-4">
                {items.length > 0 ? items.map((item, index) => {
                  const image = getItemImage(item)

                  return (
                    <article key={`${item.productId || getItemName(item)}-${index}`} className="grid gap-4 rounded-[24px] border border-black/10 bg-[#fbf8f2] p-4 sm:grid-cols-[112px_1fr] print:break-inside-avoid">
                      <div className="flex h-28 items-center justify-center overflow-hidden rounded-[18px] border border-black/8 bg-white">
                        {image ? (
                          <img
                            src={image}
                            alt={getItemName(item)}
                            className="h-full w-full object-contain p-2 print:print-color-adjust-exact"
                          />
                        ) : (
                          <div className="text-sm font-black uppercase tracking-[0.16em] text-black/25">No Image</div>
                        )}
                      </div>

                      <div className="flex min-w-0 items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="truncate text-xl font-black text-black">{getItemName(item)}</h3>
                          <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-[0.15em] text-black/45">
                            <span>Qty {item.quantity || 1}</span>
                            {item.size ? <span>Size {item.size}</span> : null}
                            {item.color ? <span>{item.color}</span> : null}
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-xs font-black uppercase tracking-[0.16em] text-black/45">Line Total</p>
                          <p className="mt-2 text-2xl font-black text-black">
                            {formatCurrency((Number(item.price) || 0) * (Number(item.quantity) || 1))}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-black/45">{formatCurrency(item.price)} each</p>
                        </div>
                      </div>
                    </article>
                  )
                }) : (
                  <article className="rounded-[24px] border border-black/10 bg-[#fbf8f2] p-6">
                    <h3 className="text-xl font-black text-black">{typeof order.items === "string" ? order.items : "Product"}</h3>
                    <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-black/45">Qty 1</p>
                    <p className="mt-4 text-2xl font-black text-black">{formatCurrency(total)}</p>
                  </article>
                )}
              </div>
            </div>

            <aside className="space-y-4">
              <section className="rounded-[24px] border border-black/10 bg-[#f8f5ee] p-5">
                <div className="mb-3 flex items-center gap-2 text-black/55">
                  <MapPin size={16} />
                  <h2 className="text-[11px] font-black uppercase tracking-[0.2em]">Shipping Details</h2>
                </div>
                <p className="text-base font-black text-black">{getCustomerName(order)}</p>
                <p className="mt-2 text-sm font-medium leading-7 text-black/65">
                  {order.shippingInfo?.address || "No shipping address provided"}
                  {order.shippingInfo?.city ? `, ${order.shippingInfo.city}` : ""}
                  {order.shippingInfo?.state ? `, ${order.shippingInfo.state}` : ""}
                  {order.shippingInfo?.zipCode ? ` ${order.shippingInfo.zipCode}` : ""}
                  {order.shippingInfo?.country ? `, ${order.shippingInfo.country}` : ""}
                </p>
              </section>

              <section className="rounded-[24px] border border-black/10 bg-black p-5 text-white">
                <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/50">Bill Summary</h2>
                <div className="mt-5 space-y-3 text-sm font-semibold text-white/78">
                  <div className="flex items-center justify-between gap-4">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>Tax / Additional</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>Payment Status</span>
                    <span>{order.paymentStatus || "Paid"}</span>
                  </div>
                </div>
                <div className="mt-5 border-t border-white/12 pt-5">
                  <div className="flex items-end justify-between gap-4">
                    <span className="text-xs font-black uppercase tracking-[0.18em] text-white/50">Total</span>
                    <span className="text-4xl font-black tracking-tight text-white">{formatCurrency(total)}</span>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </section>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 14mm;
          }

          html,
          body {
            background: #ffffff !important;
          }

          * {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </main>
  )
}
