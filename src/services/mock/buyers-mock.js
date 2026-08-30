// MOCK DATA LAYER — Buyers
//
// A directory of buyer entities/companies a farmer can browse and reach
// out to. Stand-in for a real Prisma-backed Buyer model.

const buyers = [
  {
    id: "buyer_1",
    name: "Anita Deshmukh",
    companyName: "Deshmukh Wholesale Grains",
    interestedIn: "Wheat, Soybean",
    offerNote: "Buying in bulk, weekly pickup available.",
    contactEmail: "anita@deshmukhgrains.example.com",
    contactPhone: "+91 98220 10101",
    location: "Indore, Madhya Pradesh",
    createdAt: "2026-08-18T10:00:00.000Z",
  },
  {
    id: "buyer_2",
    name: "Vikram Rathore",
    companyName: "Rathore Agro Exports",
    interestedIn: "Basmati rice, Cotton",
    offerNote: "Looking for export-grade quality, premium pricing.",
    contactEmail: "vikram@rathoreexports.example.com",
    contactPhone: "+91 98220 20202",
    location: "Ujjain, Madhya Pradesh",
    createdAt: "2026-08-19T10:00:00.000Z",
  },
  {
    id: "buyer_3",
    name: "Sunita Joshi",
    companyName: "Joshi Fresh Produce Mart",
    interestedIn: "Vegetables, Pulses",
    offerNote: "Daily mandi supply contracts, flexible quantities.",
    contactEmail: "sunita@joshifresh.example.com",
    contactPhone: "+91 98220 30303",
    location: "Dewas, Madhya Pradesh",
    createdAt: "2026-08-20T10:00:00.000Z",
  },
  {
    id: "buyer_4",
    name: "Manoj Chouhan",
    companyName: "Chouhan Cold Storage & Trading",
    interestedIn: "Onion, Potato",
    offerNote: "Long-term storage partner, can pay in advance.",
    contactEmail: "manoj@chouhancoldstorage.example.com",
    contactPhone: "+91 98220 40404",
    location: "Bhopal, Madhya Pradesh",
    createdAt: "2026-08-21T10:00:00.000Z",
  },
];

export function listBuyers(query = "") {
  const q = query.trim().toLowerCase();

  if (!q) return buyers;

  return buyers.filter(
    (buyer) =>
      buyer.name.toLowerCase().includes(q) ||
      buyer.companyName.toLowerCase().includes(q) ||
      buyer.interestedIn.toLowerCase().includes(q),
  );
}
