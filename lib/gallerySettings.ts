// Demo-only site setting: a single Google Drive link the admin sets once,
// shared by every Puja's "View Images" page since this app has no real
// file/photo storage of its own.

const STORAGE_KEY = "bca_gallery_drive_link";

export function getGalleryDriveLink(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(STORAGE_KEY) ?? "";
}

export function saveGalleryDriveLink(url: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, url);
}
