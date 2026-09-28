"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Download, QrCode } from "lucide-react";
import Button from "@/components/Button";
import { useToast } from "@/components/Toast";
import { formatDate } from "@/lib/utils";
import { membershipTypeLabels } from "@/data/membership";
import type { Member } from "@/types";

export default function MembershipCard({ member }: { member: Member }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  const handleDownload = async () => {
    const canvas = document.createElement("canvas");
    const width = 900;
    const height = 540;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // background
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#6B1220");
    grad.addColorStop(1, "#450B14");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // decorative circle
    ctx.fillStyle = "rgba(216,154,43,0.18)";
    ctx.beginPath();
    ctx.arc(width - 60, 60, 140, 0, Math.PI * 2);
    ctx.fill();

    // logo image, clipped to a circle
    const logo = new Image();
    logo.src = "/logo.webp";
    await new Promise<void>((resolve) => {
      logo.onload = () => resolve();
      logo.onerror = () => resolve();
    });
    if (logo.complete && logo.naturalWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(80, 70, 34, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(logo, 80 - 34, 70 - 34, 68, 68);
      ctx.restore();
    }

    ctx.textAlign = "left";
    ctx.fillStyle = "#FBF6EC";
    ctx.font = "bold 26px Georgia";
    ctx.fillText("Bandhan Cultural Association", 130, 62);
    ctx.font = "13px Arial";
    ctx.fillStyle = "#F6E1B4";
    ctx.fillText("MEMBERSHIP CARD", 130, 84);

    ctx.fillStyle = "#F6E1B4";
    ctx.font = "13px Arial";
    ctx.fillText("MEMBER NAME", 60, 200);
    ctx.fillStyle = "#FBF6EC";
    ctx.font = "bold 34px Georgia";
    ctx.fillText(member.fullName, 60, 236);

    ctx.fillStyle = "#F6E1B4";
    ctx.font = "13px Arial";
    ctx.fillText("MEMBER ID", 60, 300);
    ctx.fillStyle = "#FBF6EC";
    ctx.font = "bold 20px Arial";
    ctx.fillText(member.memberId, 60, 326);

    ctx.fillStyle = "#F6E1B4";
    ctx.font = "13px Arial";
    ctx.fillText("MEMBERSHIP TYPE", 60, 380);
    ctx.fillStyle = "#FBF6EC";
    ctx.font = "bold 20px Arial";
    ctx.fillText(membershipTypeLabels[member.membershipType] ?? member.membershipType, 60, 406);

    ctx.fillStyle = "#F6E1B4";
    ctx.font = "13px Arial";
    ctx.fillText("VALID UNTIL", 340, 380);
    ctx.fillStyle = "#FBF6EC";
    ctx.font = "bold 20px Arial";
    ctx.fillText(member.validUntil === "Lifetime" ? "Lifetime" : formatDate(member.validUntil), 340, 406);

    // QR placeholder
    ctx.fillStyle = "#FBF6EC";
    ctx.fillRect(width - 190, height - 190, 130, 130);
    ctx.strokeStyle = "#450B14";
    ctx.lineWidth = 3;
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if ((i + j) % 2 === 0) {
          ctx.fillStyle = "#450B14";
          ctx.fillRect(width - 190 + i * 26, height - 190 + j * 26, 26, 26);
        }
      }
    }

    ctx.fillStyle = "#F6E1B4";
    ctx.font = "12px Arial";
    ctx.fillText("Scan at the venue entrance", 60, height - 30);

    const link = document.createElement("a");
    link.download = `${member.memberId}-membership-card.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    showToast("Membership card downloaded", "success");
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, rotateY: -8, y: 20 }}
        animate={{ opacity: 1, rotateY: 0, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-md rounded-2xl overflow-hidden bg-gradient-to-br from-maroon-500 to-maroon-700 text-cream p-7 shadow-card-hover"
      >
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-saffron-400/20" aria-hidden="true" />
        <div className="relative flex items-center gap-3">
          <img
            src="/logo.webp"
            alt="Bandhan Cultural Association"
            className="h-10 w-10 rounded-full object-cover shrink-0"
          />
          <div>
            <p className="font-display font-semibold leading-tight">Bandhan Cultural Association</p>
            <p className="text-[10px] tracking-[0.25em] text-saffron-300 font-semibold">
              MEMBERSHIP CARD
            </p>
          </div>
        </div>

        <div className="relative mt-8">
          <p className="text-[11px] tracking-widest text-saffron-300 font-semibold">MEMBER NAME</p>
          <p className="font-display text-2xl sm:text-3xl font-semibold mt-1">{member.fullName}</p>
        </div>

        <div className="relative mt-6 grid grid-cols-2 gap-4">
          <div>
            <p className="text-[11px] tracking-widest text-saffron-300 font-semibold">MEMBER ID</p>
            <p className="font-semibold mt-1">{member.memberId}</p>
          </div>
          <div>
            <p className="text-[11px] tracking-widest text-saffron-300 font-semibold">TYPE</p>
            <p className="font-semibold mt-1">{membershipTypeLabels[member.membershipType] ?? member.membershipType}</p>
          </div>
          <div>
            <p className="text-[11px] tracking-widest text-saffron-300 font-semibold">VALID UNTIL</p>
            <p className="font-semibold mt-1">
              {member.validUntil === "Lifetime" ? "Lifetime" : formatDate(member.validUntil)}
            </p>
          </div>
          <div>
            <p className="text-[11px] tracking-widest text-saffron-300 font-semibold">CITY</p>
            <p className="font-semibold mt-1">{member.city}</p>
          </div>
        </div>

        <div className="relative mt-7 flex items-end justify-between">
          <p className="text-[11px] text-cream/60 max-w-[60%]">Scan at the venue entrance for quick check-in.</p>
          <span className="flex h-16 w-16 items-center justify-center rounded-lg bg-cream text-maroon-700">
            <QrCode className="h-11 w-11" />
          </span>
        </div>
      </motion.div>

      <Button onClick={handleDownload} icon={<Download className="h-4 w-4" />}>
        Download Membership Card
      </Button>
    </div>
  );
}
