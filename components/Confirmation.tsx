"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import type { PaymentResult } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function Confirmation({
  result,
  title = "Payment Successful",
  message,
  children,
}: {
  result: PaymentResult;
  title?: string;
  message?: string;
  children?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-lg mx-auto text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
        className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100"
      >
        <CheckCircle2 className="h-11 w-11 text-emerald-600" />
      </motion.div>

      <h2 className="mt-6 font-display text-3xl font-semibold text-maroon-500">{title}</h2>
      {message && <p className="mt-2 text-charcoal-light">{message}</p>}

      <div className="mt-8 rounded-2xl bg-white/70 border border-maroon-500/10 p-6 text-left space-y-3">
        <Row label="Order ID" value={result.orderId} />
        <Row label="Transaction ID" value={result.transactionId} />
        <Row label="Date" value={formatDate(result.date)} />
        <Row label="Amount Paid" value={formatCurrency(result.amount)} />
        <Row label="Payment Method" value={result.method.toUpperCase()} />
        <Row label="Status" value="Confirmed" success />
      </div>

      {children && <div className="mt-8">{children}</div>}
    </motion.div>
  );
}

function Row({ label, value, success }: { label: string; value: string; success?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-charcoal-light">{label}</span>
      <span className={success ? "font-semibold text-emerald-700" : "font-semibold text-charcoal"}>{value}</span>
    </div>
  );
}
