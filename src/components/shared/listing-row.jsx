"use client";

import { useState } from "react";
import {
  Boxes,
  Handshake,
  Info,
  Leaf,
  MapPin,
  MessageCircle,
  Phone,
  WrenchIcon,
  X,
} from "lucide-react";

const typeIcon = {
  crop: Leaf,
  service: WrenchIcon,
  good: Boxes,
  buyer: Handshake,
};

// Pulls out the 2-3 attribute chips shown per item type.
function getAttributes(itemType, item) {
  switch (itemType) {
    case "crop":
      return [
        { label: "Type", value: item.type },
        { label: "Area", value: `${item.area} acres` },
        { label: "Price", value: `₹${item.price}/kg` },
      ];

    case "service":
      return [
        { label: "Type", value: item.type },
        { label: "Price", value: `₹${item.prices}` },
        {
          label: "Available",
          value: item.availableFrom
            ? `${new Date(item.availableFrom).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })} → ${new Date(item.availableTo).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })}`
            : "—",
        },
      ];

    case "good":
      return [
        { label: "Category", value: item.category },
        { label: "Price", value: `₹${item.price}/${item.unit || "unit"}` },
        { label: "Stock", value: `${item.stock} ${item.unit || ""}`.trim() },
      ];

    case "buyer":
      return [
        { label: "Company", value: item.companyName },
        { label: "Interested in", value: item.interestedIn },
      ];

    default:
      return [];
  }
}

export default function ListingRow({
  item,
  itemType = "crop",
  interactive = false,
  onChat,
  onNegotiate,
}) {
  const [popover, setPopover] = useState(null); // "contact" | "location" | null
  const Icon = typeIcon[itemType] || Info;
  const attributes = getAttributes(itemType, item);

  const contactName = item.providerName || item.name;
  const contactEmail = item.contactEmail || null;
  const contactPhone = item.contactPhone || null;
  const location = item.location || null;

  return (
    <article className="relative flex flex-col gap-4 rounded-2xl border border-[#dce4d8] bg-white p-4 transition hover:border-[#b9cdb0] sm:flex-row sm:items-center sm:p-5">
      {/* Thumbnail */}
      <div className="flex shrink-0 items-center gap-4 sm:contents">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.name}
            className="size-14 shrink-0 rounded-xl object-cover"
          />
        ) : (
          <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-[#edf3e8] text-[#668b45]">
            <Icon className="size-6" />
          </span>
        )}

        <h3 className="text-lg font-semibold text-[#19352a] sm:hidden">
          {item.name}
        </h3>
      </div>

      {/* Main info */}
      <div className="min-w-0 flex-1">
        <h3 className="hidden text-lg font-semibold text-[#19352a] sm:block">
          {item.name}
        </h3>

        <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-xs text-[#718078] sm:mt-2">
          {attributes.map((attr) => (
            <span key={attr.label}>
              <span className="text-[#92a095]">{attr.label}: </span>
              <span className="font-semibold text-[#3a4f3e]">
                {attr.value || "—"}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      {interactive && (
        <div className="flex flex-wrap gap-2 sm:shrink-0">
          <RowButton
            icon={MessageCircle}
            label="Chat"
            onClick={() =>
              onChat
                ? onChat(item)
                : window.alert("Chat is coming soon.")
            }
          />

          <RowButton
            icon={Phone}
            label="Contact Details"
            onClick={() => setPopover("contact")}
          />

          <RowButton
            icon={MapPin}
            label="Location"
            onClick={() => setPopover("location")}
          />

          <RowButton
            icon={Handshake}
            label="Negotiate"
            primary
            onClick={() =>
              onNegotiate
                ? onNegotiate(item)
                : window.alert("Negotiation is coming soon.")
            }
          />
        </div>
      )}

      {popover === "contact" && (
        <Popover title="Contact details" onClose={() => setPopover(null)}>
          <p className="text-sm font-semibold text-[#19352a]">
            {contactName || "Not specified"}
          </p>
          <p className="mt-1 text-sm text-[#718078]">
            {contactEmail || "Email not specified"}
          </p>
          <p className="mt-1 text-sm text-[#718078]">
            {contactPhone || "Phone not specified"}
          </p>
        </Popover>
      )}

      {popover === "location" && (
        <Popover title="Location" onClose={() => setPopover(null)}>
          <p className="text-sm text-[#19352a]">
            {location || "Not specified"}
          </p>
        </Popover>
      )}
    </article>
  );
}

function RowButton({ icon: Icon, label, onClick, primary = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition ${
        primary
          ? "bg-[#214a38] text-white hover:bg-[#173b2b]"
          : "border border-[#d4dfd2] bg-white text-[#476650] hover:bg-[#f6f8f3]"
      }`}
    >
      <Icon className="size-3.5" />
      {label}
    </button>
  );
}

function Popover({ title, onClose, children }) {
  return (
    <div className="absolute right-4 top-4 z-10 w-64 rounded-xl border border-[#dce4d8] bg-white p-4 shadow-lg sm:right-5 sm:top-1/2 sm:-translate-y-1/2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8c9c8a]">
          {title}
        </p>

        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="text-[#a4b0a4] hover:text-[#19352a]"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="mt-3">{children}</div>
    </div>
  );
}
