// MOCK DATA LAYER — Recommendations
//
// Stand-in for a real recommendation engine. Returns a small, plausible
// set of items per tab type so the recommendation panel isn't empty.

const recommendationsByType = {
  crop: [
    { id: "rec_crop_1", type: "crop", name: "Basmati Rice", subtitle: "Cereal", price: "₹52/kg" },
    { id: "rec_crop_2", type: "crop", name: "Soybean", subtitle: "Oilseed", price: "₹41/kg" },
    { id: "rec_crop_3", type: "crop", name: "Chickpea (Chana)", subtitle: "Pulse", price: "₹68/kg" },
  ],
  service: [
    { id: "rec_svc_1", type: "service", name: "Tractor Ploughing", subtitle: "Transport", price: "₹2,500" },
    { id: "rec_svc_2", type: "service", name: "Drip Irrigation Setup", subtitle: "Irrigation", price: "₹18,000" },
    { id: "rec_svc_3", type: "service", name: "Organic Pest Control", subtitle: "Pest control", price: "₹1,200" },
    { id: "rec_svc_4", type: "service", name: "Harvest Combine Rental", subtitle: "Harvesting", price: "₹6,000" },
  ],
  good: [
    { id: "rec_good_1", type: "good", name: "Hybrid Wheat Seeds", subtitle: "Seeds", price: "₹65/kg" },
    { id: "rec_good_2", type: "good", name: "DAP Fertilizer", subtitle: "Fertilizer", price: "₹1,350/bag" },
    { id: "rec_good_3", type: "good", name: "Battery Sprayer Pump", subtitle: "Equipment", price: "₹2,800" },
  ],
  buyer: [
    { id: "rec_buyer_1", type: "buyer", name: "Deshmukh Wholesale Grains", subtitle: "Wheat, Soybean", price: "Bulk buyer" },
    { id: "rec_buyer_2", type: "buyer", name: "Rathore Agro Exports", subtitle: "Basmati rice, Cotton", price: "Export buyer" },
    { id: "rec_buyer_3", type: "buyer", name: "Joshi Fresh Produce Mart", subtitle: "Vegetables, Pulses", price: "Daily supply" },
  ],
};

export function getRecommendations(type) {
  return recommendationsByType[type] || [];
}
