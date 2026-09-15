"use client";

import Modal from "@/components/Modal";

export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  description,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title?: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <p className="text-sm text-charcoal-light mb-6">{description}</p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-full border-2 border-maroon-500 text-maroon-500 hover:bg-maroon-50 px-6 py-3 text-sm font-semibold transition-colors focus-ring"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="flex-1 rounded-full bg-red-600 text-white hover:bg-red-700 px-6 py-3 text-sm font-semibold transition-colors focus-ring"
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
