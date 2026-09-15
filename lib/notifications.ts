// Demo-only member notification store (localStorage). Used so a member can
// see when the admin has made changes to their profile — there is no real
// backend or push service here.

export interface MemberNotification {
  id: string;
  memberId: string;
  message: string;
  createdAt: string;
  read: boolean;
}

const STORAGE_KEY = "bca_notifications";

function readAll(): MemberNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MemberNotification[]) : [];
  } catch {
    return [];
  }
}

function writeAll(list: MemberNotification[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function addNotification(memberId: string, message: string) {
  const all = readAll();
  all.unshift({
    id: `ntf-${Date.now()}`,
    memberId,
    message,
    createdAt: new Date().toISOString(),
    read: false,
  });
  writeAll(all);
}

export function getNotifications(memberId: string): MemberNotification[] {
  return readAll().filter((n) => n.memberId === memberId);
}

export function unreadCount(memberId: string): number {
  return getNotifications(memberId).filter((n) => !n.read).length;
}

export function markAllRead(memberId: string) {
  const all = readAll();
  writeAll(all.map((n) => (n.memberId === memberId ? { ...n, read: true } : n)));
}
