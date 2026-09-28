"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { ExternalLink, FolderOpen } from "lucide-react";
import Container from "@/components/Container";
import AdminTopBar from "@/components/AdminTopBar";
import Button from "@/components/Button";
import { getGalleryDriveLink, saveGalleryDriveLink } from "@/lib/gallerySettings";

export default function AdminImagesPage() {
  const [driveLink, setDriveLink] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setDriveLink(getGalleryDriveLink());
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (driveLink.trim() && !/^https?:\/\//i.test(driveLink.trim())) {
      setError("Enter a valid link starting with http:// or https://");
      return;
    }
    setError("");
    saveGalleryDriveLink(driveLink.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <AdminTopBar
        title="View Images"
        description="The Google Drive link shown to members on every Puja's photo gallery page."
      />
      <section className="section-py">
        <Container className="max-w-xl">
          <div className="rounded-2xl bg-white/70 border border-maroon-500/10 p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-maroon-500/10 text-maroon-500">
                <FolderOpen className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-lg font-semibold text-maroon-500">Photo Gallery — Google Drive Link</p>
                <p className="text-xs text-charcoal-light">One link, shared across all Pujas.</p>
              </div>
            </div>
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1.5">Drive Link</label>
                <input
                  className="w-full rounded-xl border border-maroon-500/15 bg-white/80 px-4 py-2.5 text-sm focus-ring"
                  value={driveLink}
                  onChange={(e) => setDriveLink(e.target.value)}
                  placeholder="https://drive.google.com/drive/folders/..."
                />
                {error && <p className="mt-1 text-xs text-maroon-600">{error}</p>}
              </div>
              <div className="flex items-center gap-3">
                <Button type="submit">{saved ? "Saved!" : "Save Link"}</Button>
                {driveLink.trim() && (
                  <a
                    href={driveLink.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-maroon-600 hover:text-maroon-700 focus-ring rounded px-1"
                  >
                    Open in Drive <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </form>
          </div>
        </Container>
      </section>
    </>
  );
}
