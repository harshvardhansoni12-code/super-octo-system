"use client"

import { useState } from "react"
import { CheckCircle2, ImagePlus, Send, UploadCloud } from "lucide-react"

const initialValues = {
  name: "",
  category: "",
  price: "",
  stock: "",
  unit: "",
  description: "",
}

const goodCategories = [
  "SEEDS",
  "FERTILIZER",
  "PESTICIDE",
  "EQUIPMENT",
  "IRRIGATION",
  "OTHER",
]

export default function GoodSaleForm({ onCreated }) {
  const [values, setValues] = useState(initialValues)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageDataUrl, setImageDataUrl] = useState(null)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setValues((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    setImagePreview(URL.createObjectURL(file))

    const reader = new FileReader()
    reader.onload = () => setImageDataUrl(reader.result)
    reader.readAsDataURL(file)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setIsSubmitting(true)
    setMessage({ type: "", text: "" })

    try {
      const response = await fetch("/api/v1/user/goods/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name.trim(),
          category: values.category,
          price: Number(values.price),
          stock: Number(values.stock),
          unit: values.unit.trim(),
          description: values.description.trim(),
          imageDataUrl,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Could not publish this good")
      }

      setValues(initialValues)
      setImagePreview(null)
      setImageDataUrl(null)

      setMessage({
        type: "success",
        text: "Your good is now listed on the platform.",
      })

      if (onCreated) {
        onCreated(result.good)
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Something went wrong",
      })
    } finally {
      setIsSubmitting(false)
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
              Sell seeds, inputs, and equipment.
            </h2>

            <p className="mt-3 max-w-sm text-sm leading-6 text-[#d2e0cf]">
              Add clear stock and pricing details so growers can find and
              order from you.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-[#526258]">
              Good name
              <input
                required
                name="name"
                onChange={handleChange}
                placeholder="e.g. Hybrid Wheat Seeds"
                type="text"
                value={values.name}
                className="mt-2 h-11 w-full rounded-lg border border-[#d4dfd2] bg-[#fbfcf9] px-3 text-sm font-normal text-[#19352a] outline-none transition focus:border-[#668b45] focus:ring-2 focus:ring-[#dcebc9]"
              />
            </label>

            <label className="text-xs font-semibold text-[#526258]">
              Category
              <select
                required
                name="category"
                onChange={handleChange}
                value={values.category}
                className="mt-2 h-11 w-full rounded-lg border border-[#d4dfd2] bg-[#fbfcf9] px-3 text-sm font-normal text-[#19352a] outline-none transition focus:border-[#668b45] focus:ring-2 focus:ring-[#dcebc9]"
              >
                <option value="" disabled>
                  Select a category
                </option>
                {goodCategories.map((category) => (
                  <option key={category} value={category}>
                    {category.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs font-semibold text-[#526258]">
              Price (₹)
              <input
                required
                min="0.01"
                name="price"
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                type="number"
                value={values.price}
                className="mt-2 h-11 w-full rounded-lg border border-[#d4dfd2] bg-[#fbfcf9] px-3 text-sm font-normal text-[#19352a] outline-none transition focus:border-[#668b45] focus:ring-2 focus:ring-[#dcebc9]"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs font-semibold text-[#526258]">
                Stock
                <input
                  required
                  min="0"
                  name="stock"
                  onChange={handleChange}
                  placeholder="0"
                  type="number"
                  value={values.stock}
                  className="mt-2 h-11 w-full rounded-lg border border-[#d4dfd2] bg-[#fbfcf9] px-3 text-sm font-normal text-[#19352a] outline-none transition focus:border-[#668b45] focus:ring-2 focus:ring-[#dcebc9]"
                />
              </label>

              <label className="text-xs font-semibold text-[#526258]">
                Unit
                <input
                  required
                  name="unit"
                  onChange={handleChange}
                  placeholder="e.g. kg, bag, unit"
                  type="text"
                  value={values.unit}
                  className="mt-2 h-11 w-full rounded-lg border border-[#d4dfd2] bg-[#fbfcf9] px-3 text-sm font-normal text-[#19352a] outline-none transition focus:border-[#668b45] focus:ring-2 focus:ring-[#dcebc9]"
                />
              </label>
            </div>

            <label className="text-xs font-semibold text-[#526258] sm:col-span-2">
              Description
              <textarea
                name="description"
                onChange={handleChange}
                placeholder="Share what makes this good worth buying."
                rows={3}
                value={values.description}
                className="mt-2 w-full resize-none rounded-lg border border-[#d4dfd2] bg-[#fbfcf9] px-3 py-2.5 text-sm font-normal text-[#19352a] outline-none transition focus:border-[#668b45] focus:ring-2 focus:ring-[#dcebc9]"
              />
            </label>

            <label className="text-xs font-semibold text-[#526258] sm:col-span-2">
              Photo (optional)
              <div className="mt-2 flex items-center gap-4 rounded-lg border border-dashed border-[#c5d2c2] bg-[#fbfcf9] p-4">
                {imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="size-14 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-[#edf3e8] text-[#668b45]">
                    <UploadCloud className="size-5" />
                  </span>
                )}

                <div className="min-w-0">
                  <p className="text-xs font-normal text-[#718078]">
                    Upload a photo of the product.
                  </p>
                  <input
                    accept="image/*"
                    onChange={handleImageChange}
                    type="file"
                    className="mt-2 block w-full text-xs text-[#526258] file:mr-3 file:rounded-lg file:border-0 file:bg-[#214a38] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-[#173b2b]"
                  />
                </div>
              </div>
            </label>
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
                All amounts should be listed in Indian Rupees.
              </p>
            )}

            <button
              disabled={isSubmitting}
              type="submit"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#214a38] px-5 text-sm font-bold text-white transition hover:bg-[#173b2b] disabled:cursor-wait disabled:opacity-60"
            >
              <Send className="size-4" />
              {isSubmitting ? "Publishing..." : "Publish good"}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
