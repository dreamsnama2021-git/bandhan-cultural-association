// Demo-only editable display profile for the fixed Admin login (localStorage).
// The actual login email/password stay fixed in lib/config.ts — this only
// controls how the Admin's name/email are shown across the admin panel.

import { adminConfig } from "@/lib/config";

const STORAGE_KEY = "bca_admin_profile";

export interface AdminProfile {
  name: string;
  email: string;
}

const defaultProfile: AdminProfile = { name: "Admin", email: adminConfig.email };

export function getAdminProfile(): AdminProfile {
  if (typeof window === "undefined") return defaultProfile;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultProfile, ...JSON.parse(raw) } : defaultProfile;
  } catch {
    return defaultProfile;
  }
}

export function saveAdminProfile(profile: AdminProfile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}
