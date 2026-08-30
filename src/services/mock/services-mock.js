// MOCK DATA LAYER — Services
//
// This is a stand-in for a real Prisma-backed ServiceProvider/Service model.
// Data lives in a module-level array, so it resets whenever the server
// restarts. The API routes that sit in front of this file return the same
// response envelope the real backend is expected to return, so swapping
// this module out for a real prisma-based one later shouldn't require any
// changes to the routes or the UI.

let services = [
  {
    id: "svc_1",
    name: "Tractor Ploughing (2-acre package)",
    type: "TRANSPORT",
    prices: 2500,
    availableFrom: "2026-09-01",
    availableTo: "2026-09-30",
    imageUrl: null,
    serviceProviderId: "prov_1",
    providerName: "Ramesh Agri Services",
    contactEmail: "ramesh.agri@example.com",
    contactPhone: "+91 98230 11223",
    location: "Indore, Madhya Pradesh",
    createdAt: "2026-08-20T10:00:00.000Z",
  },
  {
    id: "svc_2",
    name: "Drip Irrigation Setup",
    type: "IRRIGATION",
    prices: 18000,
    availableFrom: "2026-09-05",
    availableTo: "2026-10-15",
    imageUrl: null,
    serviceProviderId: "prov_2",
    providerName: "GreenFlow Irrigation Co.",
    contactEmail: "hello@greenflow.example.com",
    contactPhone: "+91 90210 44556",
    location: "Ujjain, Madhya Pradesh",
    createdAt: "2026-08-21T10:00:00.000Z",
  },
  {
    id: "svc_3",
    name: "Organic Pest Control Spray",
    type: "PEST_CONTROL",
    prices: 1200,
    availableFrom: "2026-08-28",
    availableTo: "2026-09-20",
    imageUrl: null,
    serviceProviderId: "prov_3",
    providerName: "AgroShield Solutions",
    contactEmail: "support@agroshield.example.com",
    contactPhone: "+91 99887 66554",
    location: "Dewas, Madhya Pradesh",
    createdAt: "2026-08-22T10:00:00.000Z",
  },
  {
    id: "svc_4",
    name: "Harvest Combine Rental",
    type: "HARVESTING",
    prices: 6000,
    availableFrom: "2026-10-01",
    availableTo: "2026-11-10",
    imageUrl: null,
    serviceProviderId: "prov_4",
    providerName: "Farm Fleet Rentals",
    contactEmail: "book@farmfleet.example.com",
    contactPhone: "+91 91234 56780",
    location: "Indore, Madhya Pradesh",
    createdAt: "2026-08-23T10:00:00.000Z",
  },
  {
    id: "svc_5",
    name: "NPK Fertilizer Application",
    type: "FERTILIZER",
    prices: 3400,
    availableFrom: "2026-09-10",
    availableTo: "2026-10-05",
    imageUrl: null,
    serviceProviderId: "prov_5",
    providerName: "SoilCare Agro Inputs",
    contactEmail: "care@soilcare.example.com",
    contactPhone: "+91 98765 43210",
    location: "Bhopal, Madhya Pradesh",
    createdAt: "2026-08-24T10:00:00.000Z",
  },
];

export function listServices(query = "") {
  const q = query.trim().toLowerCase();

  if (!q) return services;

  return services.filter(
    (service) =>
      service.name.toLowerCase().includes(q) ||
      service.type.toLowerCase().includes(q),
  );
}

export function createService(data) {
  const service = {
    id: `svc_${Date.now()}`,
    name: data.name,
    type: data.type,
    prices: data.prices,
    availableFrom: data.availableFrom,
    availableTo: data.availableTo,
    // Real backend will replace this with object storage + a real URL.
    imageUrl: data.imageDataUrl || null,
    serviceProviderId: data.serviceProviderId || "current-user",
    providerName: data.providerName || "You",
    contactEmail: data.contactEmail || null,
    contactPhone: data.contactPhone || null,
    location: data.location || null,
    createdAt: new Date().toISOString(),
  };

  services = [service, ...services];

  return service;
}
