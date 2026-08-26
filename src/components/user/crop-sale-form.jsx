"use client";

import { useState } from "react";
import { CheckCircle2, ImagePlus, Send } from "lucide-react";

const initialValues = {
  name: "",
  type: "",
  area: "",
  quantity: "",
  price: "",
};

const fields = [
  ["name", "Crop name", "e.g. Basmati rice", "text"],
  ["type", "Crop category", "e.g. Cereal", "text"],
  ["area", "Farm area", "0.00", "number"],
  ["quantity", "Available quantity", "0", "number"],
  ["price", "Price per kg", "0.00", "number"],
];

export default function CropSaleForm({
  onCreated,
}) {
  const [values, setValues] = useState(initialValues);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setValues((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsSubmitting(true);
    setMessage({
      type: "",
      text: "",
    });

    try {
      const response = await fetch(
        "/api/v1/user/crops/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: values.name.trim(),
            type: values.type.trim(),
            area: Number(values.area),
            quantity: Number(values.quantity),
            price: Number(values.price),
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Could not publish this crop",
        );
      }

      setValues(initialValues);

      setMessage({
        type: "success",
        text: "Your crop is now listed for sale.",
      });

      // Tell the crop list to reload
      if (onCreated) {
        onCreated(result.crop);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.message ||
          "Something went wrong",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-[#dce4d8] bg-white shadow-sm">
      <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
        <div className="relative min-h-56 overflow-hidden bg-[#214a38] p-6 text-white sm:p-8">
          <div className="absolute inset-0 bg-[url('/loginBackground.jpg')] bg-cover bg-center opacity-35" />

          <div className="relative">
            <span className="flex size-10 items-center justify-center rounded-xl bg-[#f0c22e] text-[#24351c]">
              <ImagePlus className="size-5" />
            </span>

            <p className="mt-10 text-[10px] font-bold uppercase tracking-[0.16em] text-[#d2e0cf]">
              New listing
            </p>

            <h2 className="mt-2 max-w-xs text-3xl font-semibold leading-tight tracking-tighter">
              Put your harvest in good hands.
            </h2>

            <p className="mt-3 max-w-sm text-sm leading-6 text-[#d2e0cf]">
              Add clear details so buyers can discover
              and plan around your crop.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 sm:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map(
              ([
                name,
                label,
                placeholder,
                type,
              ]) => (
                <label
                  key={name}
                  className="text-xs font-semibold text-[#526258]"
                >
                  {label}

                  <input
                    required
                    min={
                      type === "number"
                        ? "0.01"
                        : undefined
                    }
                    name={name}
                    onChange={handleChange}
                    placeholder={placeholder}
                    step={
                      type === "number"
                        ? "0.01"
                        : undefined
                    }
                    type={type}
                    value={values[name]}
                    className="mt-2 h-11 w-full rounded-lg border border-[#d4dfd2] bg-[#fbfcf9] px-3 text-sm font-normal text-[#19352a] outline-none transition focus:border-[#668b45] focus:ring-2 focus:ring-[#dcebc9]"
                  />
                </label>
              ),
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {message.text ? (
              <p
                role="status"
                className={`flex items-center gap-2 text-sm ${
                  message.type === "success"
                    ? "text-[#5b823e]"
                    : "text-[#a14f3e]"
                }`}
              >
                {message.type === "success" && (
                  <CheckCircle2 className="size-4" />
                )}

                {message.text}
              </p>
            ) : (
              <p className="text-xs text-[#92a095]">
                All amounts should be listed in
                metric units.
              </p>
            )}

            <button
              disabled={isSubmitting}
              type="submit"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#214a38] px-5 text-sm font-bold text-white transition hover:bg-[#173b2b] disabled:cursor-wait disabled:opacity-60"
            >
              <Send className="size-4" />

              {isSubmitting
                ? "Publishing..."
                : "Publish crop"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}