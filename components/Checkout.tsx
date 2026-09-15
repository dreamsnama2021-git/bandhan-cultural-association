"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Smartphone, CreditCard, Landmark, Loader2, ShieldCheck } from "lucide-react";
import { cn, formatCurrency, generateOrderId, generateTransactionId } from "@/lib/utils";
import type { PaymentMethod, PaymentResult, PaymentSummaryData } from "@/types";
import PaymentSummary from "@/components/PaymentSummary";
import Button from "@/components/Button";

const methods: { id: PaymentMethod; label: string; icon: typeof Smartphone }[] = [
  { id: "upi", label: "UPI", icon: Smartphone },
  { id: "card", label: "Card", icon: CreditCard },
  { id: "netbanking", label: "Net Banking", icon: Landmark },
];

function computeTotal(data: PaymentSummaryData) {
  const discount = data.discountPercent ? (data.price * data.discountPercent) / 100 : 0;
  const afterDiscount = data.price - discount;
  const tax = data.taxPercent ? (afterDiscount * data.taxPercent) / 100 : 0;
  return afterDiscount + tax;
}

export default function Checkout({
  summary,
  onComplete,
}: {
  summary: PaymentSummaryData;
  onComplete: (result: PaymentResult) => void;
}) {
  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      const result: PaymentResult = {
        orderId: generateOrderId(),
        transactionId: generateTransactionId(),
        date: new Date().toISOString(),
        amount: computeTotal(summary),
        status: "success",
        method,
      };
      setProcessing(false);
      onComplete(result);
    }, 1400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="grid grid-cols-1 lg:grid-cols-5 gap-8"
    >
      <div className="lg:col-span-3">
        <h3 className="font-display text-lg font-semibold text-maroon-500 mb-4">Select Payment Method</h3>
        <div className="grid grid-cols-3 gap-3">
          {methods.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMethod(m.id)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border-2 py-5 transition-colors focus-ring",
                method === m.id ? "border-saffron-500 bg-saffron-50" : "border-maroon-500/10 hover:border-saffron-500/40"
              )}
            >
              <m.icon className={cn("h-6 w-6", method === m.id ? "text-maroon-500" : "text-charcoal-light")} />
              <span className="text-xs font-semibold text-charcoal">{m.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-xl bg-white/70 border border-maroon-500/10 p-5">
          {method === "upi" && (
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-1.5">UPI ID</label>
              <input
                className="w-full rounded-xl border border-maroon-500/15 bg-white px-4 py-3 text-sm focus-ring"
                placeholder="yourname@upi"
                defaultValue="member@upi"
              />
            </div>
          )}
          {method === "card" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-charcoal mb-1.5">Card Number</label>
                <input className="w-full rounded-xl border border-maroon-500/15 bg-white px-4 py-3 text-sm focus-ring" placeholder="4242 4242 4242 4242" defaultValue="4242 4242 4242 4242" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-1.5">Expiry</label>
                <input className="w-full rounded-xl border border-maroon-500/15 bg-white px-4 py-3 text-sm focus-ring" placeholder="MM/YY" defaultValue="12/29" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-1.5">CVV</label>
                <input className="w-full rounded-xl border border-maroon-500/15 bg-white px-4 py-3 text-sm focus-ring" placeholder="123" defaultValue="123" />
              </div>
            </div>
          )}
          {method === "netbanking" && (
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-1.5">Select Bank</label>
              <select className="w-full rounded-xl border border-maroon-500/15 bg-white px-4 py-3 text-sm focus-ring">
                <option>State Bank of India</option>
                <option>HDFC Bank</option>
                <option>ICICI Bank</option>
                <option>Axis Bank</option>
              </select>
            </div>
          )}
        </div>

        <p className="mt-4 flex items-center gap-2 text-xs text-charcoal-light">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          This is a demo checkout. No real payment will be processed.
        </p>

        <Button onClick={handlePay} size="lg" className="mt-6 w-full sm:w-auto" disabled={processing}>
          {processing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Processing&hellip;
            </>
          ) : (
            `Pay ${formatCurrency(computeTotal(summary))}`
          )}
        </Button>
      </div>

      <div className="lg:col-span-2">
        <PaymentSummary data={summary} />
      </div>
    </motion.div>
  );
}
