export const PRIMARY_CATEGORIES = [
  "Shoe Store",
  "Clothing Store",
  "Restaurant",
  "Coffee Shop",
  "Bank",
  "Pharmacy",
  "Electronics Store",
  "Supermarket",
  "Gym",
  "Hotel",
  "Car Dealer",
  "Dental Clinic",
] as const;

export const ADDITIONAL_CATEGORIES = [
  "Sportswear Store",
  "Outlet Store",
  "Fashion Accessories Store",
  "Leather Goods Store",
  "Delivery Service",
  "Takeout Restaurant",
  "Wholesaler",
] as const;

export const ATTRIBUTES = [
  "Wheelchair accessible entrance",
  "In-store pickup",
  "Delivery",
  "Free Wi-Fi",
  "Accepts UPI",
  "Accepts credit cards",
  "Restroom",
  "Air conditioned",
  "LGBTQ+ friendly",
  "Parking on site",
] as const;

export const SERVICES = [
  "Personal shopping",
  "Size fitting",
  "Repairs",
  "Gift wrapping",
  "Home delivery",
  "Corporate orders",
] as const;

export const REGIONS = [
  "North India",
  "South India",
  "West India",
  "East India",
  "Central India",
] as const;

export const CITIES: { city: string; region: (typeof REGIONS)[number]; lat: number; lng: number }[] =
  [
    { city: "New Delhi", region: "North India", lat: 28.6139, lng: 77.209 },
    { city: "Gurugram", region: "North India", lat: 28.4595, lng: 77.0266 },
    { city: "Lucknow", region: "North India", lat: 26.8467, lng: 80.9462 },
    { city: "Chandigarh", region: "North India", lat: 30.7333, lng: 76.7794 },
    { city: "Bengaluru", region: "South India", lat: 12.9716, lng: 77.5946 },
    { city: "Chennai", region: "South India", lat: 13.0827, lng: 80.2707 },
    { city: "Hyderabad", region: "South India", lat: 17.385, lng: 78.4867 },
    { city: "Kochi", region: "South India", lat: 9.9312, lng: 76.2673 },
    { city: "Mumbai", region: "West India", lat: 19.076, lng: 72.8777 },
    { city: "Pune", region: "West India", lat: 18.5204, lng: 73.8567 },
    { city: "Ahmedabad", region: "West India", lat: 23.0225, lng: 72.5714 },
    { city: "Surat", region: "West India", lat: 21.1702, lng: 72.8311 },
    { city: "Kolkata", region: "East India", lat: 22.5726, lng: 88.3639 },
    { city: "Patna", region: "East India", lat: 25.5941, lng: 85.1376 },
    { city: "Guwahati", region: "East India", lat: 26.1445, lng: 91.7362 },
    { city: "Bhopal", region: "Central India", lat: 23.2599, lng: 77.4126 },
    { city: "Nagpur", region: "Central India", lat: 21.1458, lng: 79.0882 },
    { city: "Raipur", region: "Central India", lat: 21.2514, lng: 81.6296 },
  ];

export const LOCATION_GROUP_NAMES = [
  "Flagship Stores",
  "Metro Retail",
  "Tier 2 Expansion",
  "Airport Kiosks",
  "Franchise Partners",
  "Outlet Network",
] as const;
