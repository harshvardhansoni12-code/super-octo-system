// MOCK DATA LAYER — Negotiations
//
// Stand-in for a real Prisma-backed Negotiation model.

let negotiations = [];

export function createNegotiation(data) {
  const negotiation = {
    id: `neg_${Date.now()}`,
    status: "PENDING",
    listingType: data.listingType,
    listingId: data.listingId,
    offerPrice: data.offerPrice,
    message: data.message || "",
    createdAt: new Date().toISOString(),
  };

  negotiations = [negotiation, ...negotiations];

  return negotiation;
}
