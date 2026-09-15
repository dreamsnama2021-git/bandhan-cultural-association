// Demo-only credential + session store. Simulates "emailing" login details
// after registration by saving them to localStorage so the Login screen can
// validate against them, and so the Profile page can show the registered
// member's own details — there is no real backend or email service here.

import type { FamilyMemberDetails, Member } from "@/types";

export interface StoredCredential {
  email: string;
  password: string;
  member: Member;
  familyMembers: FamilyMemberDetails[];
}

const STORAGE_KEY = "bca_demo_credentials";
const SESSION_KEY = "bca_demo_session_email";
const ADMIN_SESSION_KEY = "bca_admin_session";

export function saveCredential(cred: StoredCredential) {
  if (typeof window === "undefined") return;
  const all = readAllCredentials();
  const next = [...all.filter((c) => c.email.toLowerCase() !== cred.email.toLowerCase()), cred];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function readAllCredentials(): StoredCredential[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredCredential[]) : [];
  } catch {
    return [];
  }
}

export function findCredential(email: string, password: string): StoredCredential | null {
  const all = readAllCredentials();
  return (
    all.find(
      (c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password
    ) ?? null
  );
}

export function setCurrentSession(email: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_KEY, email);
}

export function getCurrentSessionMember(): StoredCredential | null {
  if (typeof window === "undefined") return null;
  const email = window.localStorage.getItem(SESSION_KEY);
  if (!email) return null;
  return readAllCredentials().find((c) => c.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export function setAdminSession() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ADMIN_SESSION_KEY, "true");
}

export function isAdminSession(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

export function clearAdminSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ADMIN_SESSION_KEY);
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
}

export function deleteCredential(email: string) {
  if (typeof window === "undefined") return;
  const all = readAllCredentials();
  const next = all.filter((c) => c.email.toLowerCase() !== email.toLowerCase());
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function updateMemberRecord(memberId: string, patch: Partial<Member>) {
  if (typeof window === "undefined") return;
  const all = readAllCredentials();
  const next = all.map((c) =>
    c.member.id === memberId
      ? { ...c, email: patch.email ?? c.email, member: { ...c.member, ...patch } }
      : c
  );
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function updateFamilyMembers(email: string, familyMembers: FamilyMemberDetails[]) {
  if (typeof window === "undefined") return;
  const all = readAllCredentials();
  const next = all.map((c) =>
    c.email.toLowerCase() === email.toLowerCase()
      ? { ...c, familyMembers, member: { ...c.member, familyMembers: familyMembers.length } }
      : c
  );
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
