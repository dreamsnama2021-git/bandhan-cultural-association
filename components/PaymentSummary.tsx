import { formatCurrency } from "@/lib/utils";
import type { PaymentSummaryData } from "@/types";

export default function PaymentSummary({ data }: { data: PaymentSummaryData }) {
  const discountAmount = data.discountPercent ? (data.price * data.discountPercent) / 100 : 0;
  const afterDiscount = data.price - discountAmount;
  const taxAmount = data.taxPercent ? (afterDiscount * data.taxPercent) / 100 : 0;
  const total = afterDiscount + taxAmount;

  return (
    <div className="rounded-2xl bg-beige-light border border-beige-dark p-6">
      <h3 className="font-display text-lg font-semibold text-maroon-500 mb-4">Order Summary</h3>
      <div className="space-y-2.5 text-sm">
        <div className="flex justify-between">
          <span className="text-charcoal-light">{data.itemLabel}</span>
          <span className="font-semibold text-charcoal">{formatCurrency(data.price)}</span>
        </div>
        {data.itemDescription && (
          <p className="text-xs text-charcoal-light">{data.itemDescription}</p>
        )}
        {!!data.discountPercent && (
          <div className="flex justify-between text-emerald-700">
            <span>Discount ({data.discountPercent}%)</span>
            <span>&minus; {formatCurrency(discountAmount)}</span>
          </div>
        )}
        {!!data.taxPercent && (
          <div className="flex justify-between text-charcoal-light">
            <span>Taxes ({data.taxPercent}%)</span>
            <span>+ {formatCurrency(taxAmount)}</span>
          </div>
        )}
      </div>
      <div className="mt-4 pt-4 border-t border-beige-dark flex justify-between items-center">
        <span className="font-semibold text-charcoal">Total Amount</span>
        <span className="font-display text-2xl font-bold text-maroon-500">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
