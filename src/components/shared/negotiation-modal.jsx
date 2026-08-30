"use client"

import { useState } from "react"
import { CheckCircle2, Handshake, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// `target` shape: { listingType, listingId, name } | null
export default function NegotiationModal({ target, onClose }) {
  const [offerPrice, setOfferPrice] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [sent, setSent] = useState(false)

  if (!target) return null

  function handleClose() {
    setOfferPrice("")
    setMessage("")
    setError("")
    setSent(false)
    onClose?.()
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/v1/negotiate/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingType: target.listingType,
          listingId: target.listingId,
          offerPrice: Number(offerPrice),
          message: message.trim(),
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Could not send your offer")
      }

      setSent(true)

      setTimeout(() => {
        handleClose()
      }, 1500)
    } catch (err) {
      setError(err.message || "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl border border-[#dce4d8] bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-[#edf3e8] text-[#668b45]">
              <Handshake className="size-4" />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-[#19352a]">
                Make an offer
              </h3>
              {target.name && (
                <p className="text-xs text-[#718078]">{target.name}</p>
              )}
            </div>
          </div>

          <button
            type="button"
            aria-label="Close"
            onClick={handleClose}
            className="text-[#a4b0a4] hover:text-[#19352a]"
          >
            <X className="size-5" />
          </button>
        </div>

        {sent ? (
          <div className="mt-6 flex flex-col items-center justify-center gap-2 py-6 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-[#dcebc9] text-[#477536]">
              <CheckCircle2 className="size-6" />
            </span>
            <p className="font-semibold text-[#19352a]">Offer sent</p>
            <p className="text-sm text-[#718078]">
              We've let them know about your offer.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="offerPrice">Your offer price</Label>
              <Input
                required
                id="offerPrice"
                min="0.01"
                onChange={(event) => setOfferPrice(event.target.value)}
                placeholder="0.00"
                step="0.01"
                type="number"
                value={offerPrice}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="negotiationMessage">Message (optional)</Label>
              <textarea
                id="negotiationMessage"
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Add any details about your offer..."
                rows={3}
                value={message}
                className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex items-center justify-end gap-2 pt-1">
              <Button
                onClick={handleClose}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>

              <Button disabled={isSubmitting} type="submit">
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send offer"
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
