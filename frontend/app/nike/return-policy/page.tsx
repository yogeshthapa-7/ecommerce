"use client"

import { FileText, Truck, RotateCcw, ShieldCheck, AlertTriangle } from "lucide-react"
import Link from "next/link"
import EcomNavbar from "@/components/ecomnavbar"
import EcomFooter from "@/components/ecomfooter"

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <EcomNavbar />

      <main className="mx-auto max-w-4xl px-5 py-24 sm:px-8">
        <div className="mb-12">
          <p className="mb-3 text-[11px] font-black uppercase tracking-[0.24em] text-red-500">
            Customer Care
          </p>
          <h1 className="text-4xl font-black uppercase leading-none tracking-tight text-white sm:text-6xl">
            Return Policy
          </h1>
          <p className="mt-4 max-w-2xl text-sm font-semibold text-white/60">
            We want you to love what you buy. If you&apos;re not completely satisfied, we&apos;ll make it right.
            Please review our return guidelines below before initiating a return.
          </p>
        </div>

        <div className="space-y-6">
          <Section icon={<FileText className="h-5 w-5" />} title="Eligibility">
            <ul className="space-y-2 text-sm text-white/70">
              <li>• Returns are accepted within <strong className="text-white">30 days</strong> of the delivery date.</li>
              <li>• Items must be <strong className="text-white">unworn, unwashed, and unaltered</strong>.</li>
              <li>• Original tags, labels, and packaging must be intact.</li>
              <li>• Proof of purchase (order number or receipt) is required.</li>
              <li>• Returns are only available for orders with a <strong className="text-white">Delivered</strong> status.</li>
            </ul>
          </Section>

          <Section icon={<AlertTriangle className="h-5 w-5" />} title="Non-Returnable Items">
            <ul className="space-y-2 text-sm text-white/70">
              <li>• Gift cards and promotional codes are non-refundable.</li>
              <li>• Personalized or custom-made products cannot be returned.</li>
              <li>• Items marked as <strong className="text-white">Final Sale</strong> at checkout.</li>
              <li>• Products showing signs of wear, damage, or alteration.</li>
            </ul>
          </Section>

          <Section icon={<RotateCcw className="h-5 w-5" />} title="How to Return">
            <ol className="space-y-2 text-sm text-white/70">
              <li>1. Go to your <strong className="text-white">Profile &rarr; Returns</strong> tab.</li>
              <li>2. Select a delivered order and choose the items you wish to return.</li>
              <li>3. Provide a reason for the return.</li>
              <li>4. Submit the return request. You&apos;ll receive a confirmation email with return instructions.</li>
              <li>5. Pack the items securely in their original packaging and ship them back using the provided label.</li>
            </ol>
          </Section>

          <Section icon={<Truck className="h-5 w-5" />} title="Shipping & Refunds">
            <ul className="space-y-2 text-sm text-white/70">
              <li>• Once a return is <strong className="text-white">approved</strong>, a prepaid return shipping label will be provided.</li>
              <li>• Refunds are processed to the <strong className="text-white">original payment method</strong> within 5–10 business days after we receive the return.</li>
              <li>• Shipping charges are non-refundable unless the return is due to our error.</li>
              <li>• You are responsible for the return shipping cost unless the item is defective or incorrect.</li>
            </ul>
          </Section>

          <Section icon={<ShieldCheck className="h-5 w-5" />} title="Exchange Policy">
            <ul className="space-y-2 text-sm text-white/70">
              <li>• We currently offer <strong className="text-white">refunds only</strong>; direct exchanges are not available.</li>
              <li>• To exchange for a different size or color, please return the original item and place a new order.</li>
              <li>• Refunded amounts will reflect the price paid at the time of purchase.</li>
            </ul>
          </Section>
        </div>

        <div className="mt-12 rounded-3xl border border-white/10 bg-zinc-950 p-6">
          <h3 className="text-lg font-black uppercase text-white mb-2">Need Help?</h3>
          <p className="text-sm text-white/60">
            If you have questions about a return, contact our support team at{" "}
            <Link href="mailto:support@nikestore.com" className="text-red-500 underline">
              support@nikestore.com
            </Link>
          </p>
        </div>
      </main>

      <EcomFooter />
    </div>
  )
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white/80">
          {icon}
        </div>
        <h2 className="text-lg font-black uppercase tracking-tight text-white">{title}</h2>
      </div>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  )
}