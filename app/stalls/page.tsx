"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import StallCard from "@/components/StallCard";
import Modal from "@/components/Modal";
import Checkout from "@/components/Checkout";
import Confirmation from "@/components/Confirmation";
import { stalls as initialStalls } from "@/data/stalls";
import {
  readStallBookings,
  addStallBooking,
  updateStallBooking,
  effectiveStallStatus,
  getStallDurationOptions,
  stallDurationLabels,
} from "@/lib/stallBookings";
import { getCurrentSessionMember } from "@/lib/credentials";
import { cn, formatCurrency, formatDate, generateId, isValidEmail, isValidMobile } from "@/lib/utils";
import type { PaymentResult, Stall, StallBooking, StallDuration } from "@/types";

const statusMeta: Record<StallBooking["status"], { label: string; className: string; icon: typeof Clock }> = {
  pending: { label: "Waiting for admin confirmation", className: "bg-saffron-50 text-saffron-700 border-saffron-200", icon: Clock },
  approved: { label: "Approved — complete your payment", className: "bg-blue-50 text-blue-700 border-blue-200", icon: CheckCircle2 },
  paid: { label: "Paid & Confirmed", className: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  rejected: { label: "Request declined", className: "bg-red-50 text-red-700 border-red-200", icon: XCircle },
};

export default function StallsPage() {
  const [stalls] = useState<Stall[]>(initialStalls);
  const [bookings, setBookings] = useState<StallBooking[]>([]);
  const [lookupEmail, setLookupEmail] = useState("");
  const [memberEmail, setMemberEmail] = useState<string | undefined>(undefined);

  const [activeStall, setActiveStall] = useState<Stall | null>(null);
  const [duration, setDuration] = useState<StallDuration>("full10");
  const [requestPhase, setRequestPhase] = useState<"form" | "submitted">("form");
  const [form, setForm] = useState({ businessName: "", contactPerson: "", phone: "", email: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});

  const [payingBooking, setPayingBooking] = useState<StallBooking | null>(null);
  const [payResult, setPayResult] = useState<PaymentResult | null>(null);

  useEffect(() => {
    setBookings(readStallBookings());
    const session = getCurrentSessionMember();
    if (session) {
      setMemberEmail(session.member.email);
      setLookupEmail(session.member.email);
      setForm((prev) => ({
        ...prev,
        contactPerson: session.member.fullName,
        phone: session.member.mobile,
        email: session.member.email,
      }));
    }
  }, []);

  const rows = Array.from(new Set(stalls.map((s) => s.code[0]))).sort();

  const counts = useMemo(() => {
    const statuses = stalls.map((s) => effectiveStallStatus(s, bookings));
    return {
      available: statuses.filter((s) => s === "available").length,
      reserved: statuses.filter((s) => s === "reserved").length,
      soldOut: statuses.filter((s) => s === "sold-out").length,
    };
  }, [stalls, bookings]);

  const myBookings = useMemo(() => {
    const email = lookupEmail.trim().toLowerCase();
    if (!email) return [];
    return bookings.filter(
      (b) => b.contactEmail.toLowerCase() === email || (memberEmail && b.memberEmail === memberEmail && email === memberEmail.toLowerCase())
    );
  }, [bookings, lookupEmail, memberEmail]);

  const durationOptions = activeStall ? getStallDurationOptions(activeStall) : [];
  const selectedPrice = durationOptions.find((o) => o.duration === duration)?.price ?? 0;

  const openStall = (stall: Stall) => {
    setActiveStall(stall);
    setDuration("full10");
  };

  const closeRequestModal = () => {
    setActiveStall(null);
    setRequestPhase("form");
    setErrors({});
  };

  const handleRequestSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!form.businessName.trim()) next.businessName = "Business name is required.";
    if (!form.contactPerson.trim()) next.contactPerson = "Contact person is required.";
    if (!isValidMobile(form.phone)) next.phone = "Enter a valid 10-digit phone number.";
    if (!isValidEmail(form.email)) next.email = "Enter a valid email address.";
    setErrors(next);
    if (Object.keys(next).length > 0 || !activeStall) return;

    const booking: StallBooking = {
      id: generateId("SB"),
      stallId: activeStall.id,
      businessName: form.businessName,
      contactPerson: form.contactPerson,
      contactPhone: form.phone,
      contactEmail: form.email,
      duration,
      amount: selectedPrice,
      status: "pending",
      requestedOn: new Date().toISOString(),
      memberEmail,
    };
    addStallBooking(booking);
    setBookings((prev) => [...prev, booking]);
    setLookupEmail(form.email);
    setRequestPhase("submitted");
  };

  const closePayModal = () => {
    setPayingBooking(null);
    setPayResult(null);
  };

  const handlePaid = (res: PaymentResult) => {
    if (!payingBooking) return;
    updateStallBooking(payingBooking.id, { status: "paid", paidOn: res.date });
    setBookings((prev) => prev.map((b) => (b.id === payingBooking.id ? { ...b, status: "paid", paidOn: res.date } : b)));
    setPayResult(res);
  };

  const inputClass = "w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-3 text-sm text-charcoal focus-ring";

  return (
    <>
      <PageHeader
        eyebrow="Stall Space"
        title="Reserve your festival stall"
        description="Set up a stall and connect directly with visitors throughout the celebration."
        crumbs={[{ label: "Stall Space" }]}
      />
      <section className="section-py">
        <Container>
          <p className="text-sm text-charcoal-light mb-6">
            Submit a booking request for your preferred stall — our team confirms every request before payment.
          </p>
          <div className="flex flex-wrap items-center gap-4 mb-8 text-sm">
            <Legend swatchClass="bg-emerald-50 border-emerald-200" label={`Available (${counts.available})`} />
            <Legend swatchClass="bg-saffron-50 border-saffron-300" label={`Reserved (${counts.reserved})`} />
            <Legend swatchClass="bg-charcoal/5 border-charcoal/10" label={`Sold Out (${counts.soldOut})`} />
          </div>

          <div className="rounded-2xl bg-beige-light border border-beige-dark p-4 sm:p-8 overflow-x-auto">
            <div className="min-w-[640px] space-y-8">
              {rows.map((row) => {
                const rowStalls = stalls.filter((s) => s.code.startsWith(row));
                const rowCategory = rowStalls[0]?.category;
                return (
                  <div key={row}>
                    <p className="text-xs font-semibold uppercase tracking-widest text-saffron-700 mb-3">
                      Row {row} — {rowCategory} Stalls
                    </p>
                    <div className="grid grid-cols-4 gap-4">
                      {rowStalls.map((s, i) => (
                        <StallCard
                          key={s.id}
                          stall={{ ...s, status: effectiveStallStatus(s, bookings) }}
                          onClick={() => openStall(s)}
                          index={i}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
              <div className="flex items-center justify-center pt-4">
                <span className="text-xs text-charcoal-light border-t border-beige-dark pt-4 w-full text-center">
                  Main Gate / Stage this direction &darr;
                </span>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="font-display text-xl font-semibold text-maroon-500 mb-2">My Stall Requests</h2>
            <p className="text-sm text-charcoal-light mb-4">
              Check the status of your stall booking requests using the email you submitted.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mb-6">
              <input
                type="email"
                value={lookupEmail}
                onChange={(e) => setLookupEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>
            {lookupEmail.trim() === "" ? null : myBookings.length === 0 ? (
              <p className="text-sm text-charcoal-light">No stall requests found for this email.</p>
            ) : (
              <div className="space-y-3">
                {myBookings.map((b) => {
                  const meta = statusMeta[b.status];
                  return (
                    <div key={b.id} className="rounded-xl bg-white/70 border border-maroon-500/10 p-4 flex flex-wrap items-center gap-4 justify-between">
                      <div>
                        <p className="font-semibold text-charcoal">
                          Stall {stalls.find((s) => s.id === b.stallId)?.code ?? ""} — {b.businessName}
                        </p>
                        <p className="text-xs text-charcoal-light">
                          {formatCurrency(b.amount)} &middot; {stallDurationLabels[b.duration]} &middot; Requested {formatDate(b.requestedOn)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={cn("flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border", meta.className)}>
                          <meta.icon className="h-3.5 w-3.5" /> {meta.label}
                        </span>
                        {b.status === "approved" && (
                          <button
                            type="button"
                            onClick={() => setPayingBooking(b)}
                            className="rounded-full bg-maroon-500 text-cream text-xs font-semibold px-4 py-2 focus-ring"
                          >
                            Pay Now
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Container>
      </section>

      <Modal open={!!activeStall} onClose={closeRequestModal} title={activeStall ? `Stall ${activeStall.code}` : undefined}>
        {activeStall && (
          <>
            {requestPhase === "form" && (
              <form onSubmit={handleRequestSubmit} noValidate>
                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <Info label="Category" value={activeStall.category} />
                  <Info label="Size" value={activeStall.size} />
                  <Info label="Location" value={activeStall.location} />
                  <Info label="Selected Price" value={formatCurrency(selectedPrice)} />
                </div>

                {durationOptions.length > 1 && (
                  <div className="mb-5">
                    <label className="block text-sm font-semibold text-charcoal mb-2">Booking Duration</label>
                    <div className="space-y-2">
                      {durationOptions.map((opt) => (
                        <button
                          type="button"
                          key={opt.duration}
                          onClick={() => setDuration(opt.duration)}
                          className={cn(
                            "flex w-full items-center justify-between rounded-xl border-2 px-4 py-3 text-sm transition-colors focus-ring",
                            duration === opt.duration ? "border-saffron-500 bg-saffron-50" : "border-maroon-500/10 bg-white/60 hover:border-saffron-500/40"
                          )}
                        >
                          <span className="font-semibold text-charcoal">{opt.label}</span>
                          <span className="font-semibold text-maroon-600">{formatCurrency(opt.price)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-1.5">Business Name</label>
                    <input
                      className={inputClass}
                      value={form.businessName}
                      onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                      placeholder="e.g. Mishti Mukh Sweets"
                    />
                    {errors.businessName && <p className="mt-1 text-xs text-maroon-600">{errors.businessName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-1.5">Contact Person</label>
                    <input
                      className={inputClass}
                      value={form.contactPerson}
                      onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                    />
                    {errors.contactPerson && <p className="mt-1 text-xs text-maroon-600">{errors.contactPerson}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-1.5">Phone</label>
                      <input
                        className={inputClass}
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                      {errors.phone && <p className="mt-1 text-xs text-maroon-600">{errors.phone}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-1.5">Email</label>
                      <input
                        type="email"
                        className={inputClass}
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                      {errors.email && <p className="mt-1 text-xs text-maroon-600">{errors.email}</p>}
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-6 w-full rounded-full bg-maroon-500 text-cream py-3 font-semibold focus-ring"
                >
                  Submit for Admin Confirmation
                </button>
              </form>
            )}

            {requestPhase === "submitted" && (
              <div className="text-center py-4">
                <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold text-maroon-500 mb-2">Request Submitted</h3>
                <p className="text-sm text-charcoal-light">
                  Your request for Stall {activeStall.code} ({stallDurationLabels[duration]}) has been sent to the
                  association's admin team for confirmation. Once approved, you can complete the payment from the
                  &ldquo;My Stall Requests&rdquo; section below using {form.email}.
                </p>
                <button
                  type="button"
                  onClick={closeRequestModal}
                  className="mt-6 rounded-full bg-maroon-500 text-cream px-6 py-2.5 text-sm font-semibold focus-ring"
                >
                  Done
                </button>
              </div>
            )}
          </>
        )}
      </Modal>

      <Modal open={!!payingBooking} onClose={closePayModal} title={payingBooking ? `Pay for Stall ${stalls.find((s) => s.id === payingBooking.stallId)?.code ?? ""}` : undefined}>
        {payingBooking && !payResult && (
          <Checkout
            summary={{
              itemLabel: `Stall ${stalls.find((s) => s.id === payingBooking.stallId)?.code ?? ""} — ${stallDurationLabels[payingBooking.duration]}`,
              itemDescription: payingBooking.businessName,
              price: payingBooking.amount,
            }}
            onComplete={handlePaid}
          />
        )}
        {payingBooking && payResult && (
          <Confirmation result={payResult} title="Stall Booked!" message={`Stall ${stalls.find((s) => s.id === payingBooking.stallId)?.code ?? ""} is confirmed for ${payingBooking.businessName}.`} />
        )}
      </Modal>
    </>
  );
}

function Legend({ swatchClass, label }: { swatchClass: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-4 w-4 rounded border ${swatchClass}`} />
      <span className="text-charcoal-light">{label}</span>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-beige-light p-3">
      <p className="text-[11px] uppercase tracking-wide text-charcoal-light">{label}</p>
      <p className="font-semibold text-charcoal">{value}</p>
    </div>
  );
}
