"use client";

import { useEffect, useState } from "react";
import { ExternalLink, FolderOpen } from "lucide-react";
import { getGalleryDriveLink } from "@/lib/gallerySettings";

export default function GalleryDriveLink() {
  const [driveLink, setDriveLink] = useState<string | null>(null);

  useEffect(() => {
    setDriveLink(getGalleryDriveLink());
  }, []);

  if (driveLink === null) return null;

  if (!driveLink) {
    return <p className="text-center text-sm text-charcoal-light">No photo gallery link added yet — check back soon.</p>;
  }

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl bg-white/70 border border-maroon-500/10 p-10 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-maroon-500/10 text-maroon-500">
        <FolderOpen className="h-7 w-7" />
      </span>
      <p className="text-sm text-charcoal-light max-w-sm">
        Our full photo gallery is hosted on Google Drive — tap below to browse and download pictures from the
        celebration.
      </p>
      <a
        href={driveLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-maroon-500 text-cream px-6 py-3 text-sm font-semibold focus-ring"
      >
        Open Photo Gallery <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  );
}
