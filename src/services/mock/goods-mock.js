// MOCK DATA LAYER — Goods
//
// Stand-in for a real Prisma-backed GoodProvider/Good model. See the note
// at the top of services-mock.js — same pattern applies here.

let goods = [
  {
    id: "good_1",
    name: "Hybrid Wheat Seeds (HD-3086)",
    category: "SEEDS",
    price: 65,
    stock: 500,
    unit: "kg",
    description: "High-yield hybrid wheat seed variety, disease resistant.",
    imageUrl: null,
    goodProviderId: "gprov_1",
    providerName: "Malwa Seed Co.",
    contactEmail: "sales@malwaseed.example.com",
    contactPhone: "+91 90000 11122",
    location: "Indore, Madhya Pradesh",
    createdAt: "2026-08-19T10:00:00.000Z",
  },
  {
    id: "good_2",
    name: "DAP Fertilizer (50kg bag)",
    category: "FERTILIZER",
    price: 1350,
    stock: 200,
    unit: "bag",
    description: "Di-ammonium phosphate for root and early growth support.",
    imageUrl: null,
    goodProviderId: "gprov_2",
    providerName: "Krishi Input Depot",
    contactEmail: "orders@krishidepot.example.com",
    contactPhone: "+91 90000 22233",
    location: "Ujjain, Madhya Pradesh",
    createdAt: "2026-08-20T10:00:00.000Z",
  },
  {
    id: "good_3",
    name: "Battery Sprayer Pump (16L)",
    category: "EQUIPMENT",
    price: 2800,
    stock: 40,
    unit: "unit",
    description: "Rechargeable knapsack sprayer for pesticide application.",
    imageUrl: null,
    goodProviderId: "gprov_3",
    providerName: "FarmTools Direct",
    contactEmail: "help@farmtoolsdirect.example.com",
    contactPhone: "+91 90000 33344",
    location: "Dewas, Madhya Pradesh",
    createdAt: "2026-08-21T10:00:00.000Z",
  },
  {
    id: "good_4",
    name: "Neem-based Pesticide (1L)",
    category: "PESTICIDE",
    price: 480,
    stock: 150,
    unit: "litre",
    description: "Organic pest deterrent safe for most vegetable crops.",
    imageUrl: null,
    goodProviderId: "gprov_4",
    providerName: "AgroShield Solutions",
    contactEmail: "support@agroshield.example.com",
    contactPhone: "+91 99887 66554",
    location: "Dewas, Madhya Pradesh",
    createdAt: "2026-08-22T10:00:00.000Z",
  },
  {
    id: "good_5",
    name: "Drip Irrigation Pipe Kit (100m)",
    category: "IRRIGATION",
    price: 4200,
    stock: 60,
    unit: "kit",
    description: "Complete kit with emitters, connectors, and mainline pipe.",
    imageUrl: null,
    goodProviderId: "gprov_5",
    providerName: "GreenFlow Irrigation Co.",
    contactEmail: "hello@greenflow.example.com",
    contactPhone: "+91 90210 44556",
    location: "Ujjain, Madhya Pradesh",
    createdAt: "2026-08-23T10:00:00.000Z",
  },
];

export function listGoods(query = "") {
  const q = query.trim().toLowerCase();

  if (!q) return goods;

  return goods.filter(
    (good) =>
      good.name.toLowerCase().includes(q) ||
      good.category.toLowerCase().includes(q),
  );
}

export function createGood(data) {
  const good = {
    id: `good_${Date.now()}`,
    name: data.name,
    category: data.category,
    price: data.price,
    stock: data.stock,
    unit: data.unit,
    description: data.description || "",
    // Real backend will replace this with object storage + a real URL.
    imageUrl: data.imageDataUrl || null,
    goodProviderId: data.goodProviderId || "current-user",
    providerName: data.providerName || "You",
    contactEmail: data.contactEmail || null,
    contactPhone: data.contactPhone || null,
    location: data.location || null,
    createdAt: new Date().toISOString(),
  };

  goods = [good, ...goods];

  return good;
}
