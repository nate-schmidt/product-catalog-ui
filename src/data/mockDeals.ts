import { Deal } from "../types/deal";

// Generate timestamps relative to now
const now = new Date();
const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
const threeHoursFromNow = new Date(now.getTime() + 3 * 60 * 60 * 1000);
const fourHoursFromNow = new Date(now.getTime() + 4 * 60 * 60 * 1000);
const fiveHoursFromNow = new Date(now.getTime() + 5 * 60 * 60 * 1000);
const sixHoursFromNow = new Date(now.getTime() + 6 * 60 * 60 * 1000);

export const mockDeals: Deal[] = [
  {
    id: "deal-1",
    name: "Mid-Century Modern Sofa",
    description: "Comfortable 3-seater sofa with premium fabric upholstery. Perfect for your living room.",
    price: 899.99,
    originalPrice: 1299.99,
    displayStartTime: oneHourAgo.toISOString(),
    displayEndTime: oneHourFromNow.toISOString(),
  },
  {
    id: "deal-2",
    name: "Oak Dining Table Set",
    description: "Beautiful solid oak dining table with 6 matching chairs. Seats up to 8 comfortably.",
    price: 1499.99,
    originalPrice: 2199.99,
    displayStartTime: now.toISOString(),
    displayEndTime: twoHoursFromNow.toISOString(),
  },
  {
    id: "deal-3",
    name: "Ergonomic Office Chair",
    description: "Premium ergonomic office chair with lumbar support and adjustable height. Perfect for long work sessions.",
    price: 299.99,
    originalPrice: 449.99,
    displayStartTime: oneHourFromNow.toISOString(),
    displayEndTime: threeHoursFromNow.toISOString(),
  },
  {
    id: "deal-4",
    name: "Modern Bedroom Set",
    description: "Complete bedroom set including queen bed frame, nightstands, and dresser. Contemporary design.",
    price: 1999.99,
    originalPrice: 2999.99,
    displayStartTime: twoHoursFromNow.toISOString(),
    displayEndTime: fourHoursFromNow.toISOString(),
  },
  {
    id: "deal-5",
    name: "Leather Recliner",
    description: "Premium leather recliner with built-in USB charging port. Available in black or brown.",
    price: 599.99,
    originalPrice: 899.99,
    displayStartTime: threeHoursFromNow.toISOString(),
    displayEndTime: fiveHoursFromNow.toISOString(),
  },
  {
    id: "deal-6",
    name: "Glass Coffee Table",
    description: "Elegant tempered glass coffee table with chrome legs. Modern and minimalist design.",
    price: 249.99,
    originalPrice: 399.99,
    displayStartTime: fourHoursFromNow.toISOString(),
    displayEndTime: sixHoursFromNow.toISOString(),
  },
];

