"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Gift, Minus, Plus } from "lucide-react";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import StepIndicator from "@/components/StepIndicator";
import TicketCard from "@/components/TicketCard";
import Checkout from "@/components/Checkout";
import Confirmation from "@/components/Confirmation";
import Button from "@/components/Button";
import { formatCurrency, formatDate, generateOrderId, generateTransactionId, isValidEmail, isValidMobile } from "@/lib/utils";
import { getCurrentSessionMember, type StoredCredential } from "@/lib/credentials";
import { addTicketBooking, freeTicketAllowance, freeTicketsUsed } from "@/lib/ticketBookings";
import { ticketTypesByEvent } from "@/data/events";
import type { EventItem, PaymentResult, TicketTypeOption } from "@/types";

const steps = ["Ticket Type", "Quantity", "Your Details", "Payment", "Confirmation"];

export default function TicketFlow({ event }: { event: EventItem }) {
  const ticketTypes: TicketTypeOption[] = useMemo(
    () =>
      ticketTypesByEvent[event.id] ?? [
        {
          id: "general",
          name: "General Entry",
          price: event.ticketPriceFrom,
          description: event.ticketPriceFrom > 0 ? "Standard entry for this event." : "Free entry — registration required.",
          perks: ["Event entry"],
        },
      ],
    [event]
  );

  const [step, setStep] = useState(0);
  const [ticketTypeId, setTicketTypeId] = useState(ticketTypes[0].id);
  const [quantity, setQuantity] = useState(1);
  const [customer, setCustomer] = useState({ name: "", phone: "", email: "" });
  const [errors, setErrors] = useState<Partial<Record<"name" | "phone" | "email", string>>>({});
  const [result, setResult] = useState<PaymentResult | null>(null);

  const [session, setSession] = useState<StoredCredential | null>(null);
  const [freeRemaining, setFreeRemaining] = useState(0);

  // A signed-in member gets 1 free ticket + 1 per family member (per event).
  useEffect(() => {
    const current = getCurrentSessionMember();
    if (!current) return;
    setSession(current);
    setCustomer({ name: current.member.fullName, phone: current.member.mobile, email: current.email });
    const allowance = freeTicketAllowance(current.familyMembers.length);
    setFreeRemaining(Math.max(0, allowance - freeTicketsUsed(current.email, event.id)));
  }, [event.id]);

  const selectedType = ticketTypes.find((t) => t.id === ticketTypeId)!;
  const freeQty = Math.min(quantity, freeRemaining);
  const paidQty = quantity - freeQty;
  const totalPrice = selectedType.price * paidQty;
  const maxQuantity = freeRemaining + 10;

  const handleComplete = (res: PaymentResult) => {
    if (session) {
      addTicketBooking({
        memberEmail: session.email,
        eventId: event.id,
        ticketTypeName: selectedType.name,
        freeQuantity: freeQty,
        paidQuantity: paidQty,
        amount: res.amount,
        orderId: res.orderId,
      });
    }
    setResult(res);
    setStep(4);
  };

  const confirmFreeTickets = () =>
    handleComplete({
      orderId: generateOrderId(),
      transactionId: generateTransactionId(),
      date: new Date().toISOString(),
      amount: 0,
      status: "success",
      method: "free",
    });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!customer.name.trim()) next.name = "Name is required.";
    if (!isValidMobile(customer.phone)) next.phone = "Enter a valid 10-digit phone number.";
    if (!isValidEmail(customer.email)) next.email = "Enter a valid email address.";
    setErrors(next);
    if (Object.keys(next).length === 0) setStep(3);
  };

  const inputClass = "w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-3 text-sm focus-ring";

  return (
    <>
      <PageHeader
        eyebrow="Tickets"
        title={event.name}
        description={`${formatDate(event.date)} · ${event.time} · ${event.venue}`}
        crumbs={[{ label: "Tickets", href: "/tickets" }, { label: event.name }]}
      />
      <section className="section-py">
        <Container className="max-w-3xl">
          <StepIndicator steps={steps} currentStep={step} />

          <div className="mt-10">
            {step === 0 && (
              <div>
                <h2 className="font-display text-2xl font-semibold text-maroon-500 mb-6">Choose your ticket type</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ticketTypes.map((t, i) => (
                    <TicketCard key={t.id} ticket={t} selected={ticketTypeId === t.id} onSelect={() => setTicketTypeId(t.id)} index={i} />
                  ))}
                </div>
                <Button className="mt-8" size="lg" onClick={() => setStep(1)}>Continue</Button>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="font-display text-2xl font-semibold text-maroon-500 mb-6">Select quantity</h2>
                {session ? (
                  <div className="mb-5 flex items-start gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-900">
                    <Gift className="h-5 w-5 mt-0.5 shrink-0" />
                    <p>
                      Members get <strong>1 free ticket for themselves + 1 for each family member</strong> (you have{" "}
                      {session.familyMembers.length} family member{session.familyMembers.length === 1 ? "" : "s"}).{" "}
                      {freeRemaining > 0 ? (
                        <>You have <strong>{freeRemaining} free ticket{freeRemaining === 1 ? "" : "s"}</strong> left for this event. Any extra tickets are paid.</>
                      ) : (
                        <>You have used all your free tickets for this event. Extra tickets are paid.</>
                      )}
                    </p>
                  </div>
                ) : (
                  <p className="mb-5 text-sm text-charcoal-light">
                    Members get free tickets for themselves and their family members.{" "}
                    <a href="/login" className="font-semibold text-maroon-600 underline">Log in</a> to claim them.
                  </p>
                )}
                <div className="flex items-center gap-5 rounded-2xl bg-white/70 border border-maroon-500/10 p-6 max-w-xs">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-beige-light hover:bg-beige-dark focus-ring"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-display text-2xl font-bold text-charcoal w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-beige-light hover:bg-beige-dark focus-ring"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {session && (
                  <div className="mt-4 max-w-xs text-sm text-charcoal-light space-y-1">
                    <p>Free tickets: <strong className="text-emerald-700">{freeQty}</strong></p>
                    <p>
                      Paid tickets: <strong className="text-charcoal">{paidQty}</strong>
                      {paidQty > 0 && <> &times; {formatCurrency(selectedType.price)}</>}
                    </p>
                    <p>Total: <strong className="text-maroon-500">{formatCurrency(totalPrice)}</strong></p>
                  </div>
                )}
                <div className="mt-8 flex gap-3">
                  <Button variant="ghost" onClick={() => setStep(0)}>Back</Button>
                  <Button onClick={() => setStep(2)}>Continue</Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit} noValidate>
                <h2 className="font-display text-2xl font-semibold text-maroon-500 mb-6">Your details</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-1.5">Full Name</label>
                    <input className={inputClass} value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
                    {errors.name && <p className="mt-1 text-xs text-maroon-600">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-1.5">Phone</label>
                    <input className={inputClass} value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
                    {errors.phone && <p className="mt-1 text-xs text-maroon-600">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-1.5">Email</label>
                    <input type="email" className={inputClass} value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />
                    {errors.email && <p className="mt-1 text-xs text-maroon-600">{errors.email}</p>}
                  </div>
                </div>
                <div className="mt-8 flex gap-3">
                  <Button type="button" variant="ghost" onClick={() => setStep(1)}>Back</Button>
                  <Button type="submit">Continue to Payment</Button>
                </div>
              </form>
            )}

            {step === 3 && (
              <div>
                <h2 className="font-display text-2xl font-semibold text-maroon-500 mb-6">Complete your purchase</h2>
                {totalPrice === 0 ? (
                  <div className="rounded-2xl bg-beige-light border border-beige-dark p-6 max-w-md">
                    <h3 className="font-display text-lg font-semibold text-maroon-500 mb-3">Free Tickets</h3>
                    <p className="text-sm text-charcoal-light">
                      {event.name} — {selectedType.name}
                    </p>
                    <p className="mt-1 text-sm text-charcoal-light">{quantity} free ticket(s) · {customer.name}</p>
                    <p className="mt-4 font-display text-2xl font-bold text-maroon-500">{formatCurrency(0)}</p>
                    <div className="mt-6 flex gap-3">
                      <Button type="button" variant="ghost" onClick={() => setStep(2)}>Back</Button>
                      <Button onClick={confirmFreeTickets}>Confirm Free Tickets</Button>
                    </div>
                  </div>
                ) : (
                  <Checkout
                    summary={{
                      itemLabel: `${event.name} — ${selectedType.name}`,
                      itemDescription:
                        freeQty > 0
                          ? `${quantity} ticket(s): ${freeQty} free + ${paidQty} paid · ${customer.name}`
                          : `${quantity} ticket(s) · ${customer.name}`,
                      price: totalPrice,
                    }}
                    onComplete={handleComplete}
                  />
                )}
              </div>
            )}

            {step === 4 && result && (
              <Confirmation
                result={result}
                title="Tickets Confirmed"
                message={`${quantity} ticket(s) for ${event.name} have been booked${freeQty > 0 ? ` (${freeQty} free, ${paidQty} paid)` : ""}. A confirmation has been sent to ${customer.email}.`}
              />
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
