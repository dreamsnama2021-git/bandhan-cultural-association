"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { sponsors as initialSponsors } from "@/data/sponsors";
import { stalls as initialStalls } from "@/data/stalls";
import { events as initialEvents } from "@/data/events";
import { coupons as initialCoupons } from "@/data/coupons";
import { sponsorshipPackages as initialSponsorshipPackagesRecord } from "@/data/sponsorshipPackages";
import { individualSponsorshipItems as initialIndividualSponsorshipItems } from "@/data/individualSponsorshipItems";
import { readSponsorshipPurchases, deleteSponsorshipPurchase } from "@/lib/sponsorships";
import { readStallBookings, updateStallBooking as persistUpdateStallBooking } from "@/lib/stallBookings";
import { generateId } from "@/lib/utils";
import type {
  Sponsor,
  Stall,
  StallBooking,
  EventItem,
  Coupon,
  SponsorshipPackageTier,
  IndividualSponsorshipItem,
} from "@/types";

const initialSponsorshipPackages = Object.values(initialSponsorshipPackagesRecord);

interface AdminDataContextValue {
  sponsors: Sponsor[];
  updateSponsor: (id: string, patch: Partial<Sponsor>) => void;
  deleteSponsor: (id: string) => void;

  stalls: Stall[];
  updateStall: (id: string, patch: Partial<Stall>) => void;
  deleteStall: (id: string) => void;

  stallBookings: StallBooking[];
  approveStallBooking: (id: string) => void;
  rejectStallBooking: (id: string) => void;

  events: EventItem[];
  addEvent: (event: Omit<EventItem, "id" | "slug">) => void;
  updateEvent: (id: string, patch: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;

  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, "id">) => void;
  updateCoupon: (id: string, patch: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;

  sponsorshipPackages: SponsorshipPackageTier[];
  addSponsorshipPackage: (pkg: Omit<SponsorshipPackageTier, "id">) => void;
  updateSponsorshipPackage: (id: string, patch: Partial<SponsorshipPackageTier>) => void;
  deleteSponsorshipPackage: (id: string) => void;

  individualSponsorshipItems: IndividualSponsorshipItem[];
  addIndividualSponsorshipItem: (item: Omit<IndividualSponsorshipItem, "id">) => void;
  updateIndividualSponsorshipItem: (id: string, patch: Partial<IndividualSponsorshipItem>) => void;
  deleteIndividualSponsorshipItem: (id: string) => void;
}

const AdminDataContext = createContext<AdminDataContextValue | null>(null);

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const [sponsors, setSponsors] = useState<Sponsor[]>(initialSponsors);
  const [stalls, setStalls] = useState<Stall[]>(initialStalls);
  const [stallBookings, setStallBookings] = useState<StallBooking[]>([]);
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [sponsorshipPackages, setSponsorshipPackages] = useState<SponsorshipPackageTier[]>(initialSponsorshipPackages);
  const [individualSponsorshipItems, setIndividualSponsorshipItems] = useState<IndividualSponsorshipItem[]>(
    initialIndividualSponsorshipItems
  );

  useEffect(() => {
    const purchased = readSponsorshipPurchases();
    if (purchased.length === 0) return;
    setSponsors((prev) => {
      const existingIds = new Set(prev.map((s) => s.id));
      const toAdd = purchased.filter((s) => !existingIds.has(s.id));
      return toAdd.length > 0 ? [...prev, ...toAdd] : prev;
    });
  }, []);

  useEffect(() => {
    setStallBookings(readStallBookings());
  }, []);

  const updateSponsor = (id: string, patch: Partial<Sponsor>) => {
    setSponsors((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };
  const deleteSponsor = (id: string) => {
    deleteSponsorshipPurchase(id);
    setSponsors((prev) => prev.filter((s) => s.id !== id));
  };

  const updateStall = (id: string, patch: Partial<Stall>) => {
    setStalls((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };
  const deleteStall = (id: string) => {
    setStalls((prev) => prev.filter((s) => s.id !== id));
  };

  const approveStallBooking = (id: string) => {
    const respondedOn = new Date().toISOString();
    persistUpdateStallBooking(id, { status: "approved", respondedOn });
    setStallBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "approved", respondedOn } : b)));
  };
  const rejectStallBooking = (id: string) => {
    const respondedOn = new Date().toISOString();
    persistUpdateStallBooking(id, { status: "rejected", respondedOn });
    setStallBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "rejected", respondedOn } : b)));
  };

  const addEvent = (event: Omit<EventItem, "id" | "slug">) => {
    const id = generateId("evt");
    const slug = event.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setEvents((prev) => [...prev, { ...event, id, slug }]);
  };
  const updateEvent = (id: string, patch: Partial<EventItem>) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  };
  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const addCoupon = (coupon: Omit<Coupon, "id">) => {
    setCoupons((prev) => [...prev, { ...coupon, id: generateId("cpn") }]);
  };
  const updateCoupon = (id: string, patch: Partial<Coupon>) => {
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };
  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  const addSponsorshipPackage = (pkg: Omit<SponsorshipPackageTier, "id">) => {
    setSponsorshipPackages((prev) => [...prev, { ...pkg, id: generateId("pkg") }]);
  };
  const updateSponsorshipPackage = (id: string, patch: Partial<SponsorshipPackageTier>) => {
    setSponsorshipPackages((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };
  const deleteSponsorshipPackage = (id: string) => {
    setSponsorshipPackages((prev) => prev.filter((p) => p.id !== id));
  };

  const addIndividualSponsorshipItem = (item: Omit<IndividualSponsorshipItem, "id">) => {
    setIndividualSponsorshipItems((prev) => [...prev, { ...item, id: generateId("isp") }]);
  };
  const updateIndividualSponsorshipItem = (id: string, patch: Partial<IndividualSponsorshipItem>) => {
    setIndividualSponsorshipItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  };
  const deleteIndividualSponsorshipItem = (id: string) => {
    setIndividualSponsorshipItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <AdminDataContext.Provider
      value={{
        sponsors,
        updateSponsor,
        deleteSponsor,
        stalls,
        updateStall,
        deleteStall,
        stallBookings,
        approveStallBooking,
        rejectStallBooking,
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        coupons,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        sponsorshipPackages,
        addSponsorshipPackage,
        updateSponsorshipPackage,
        deleteSponsorshipPackage,
        individualSponsorshipItems,
        addIndividualSponsorshipItem,
        updateIndividualSponsorshipItem,
        deleteIndividualSponsorshipItem,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error("useAdminData must be used within AdminDataProvider");
  return ctx;
}
