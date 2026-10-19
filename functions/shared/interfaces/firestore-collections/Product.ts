// A product that the business sells
export interface Product {
  createdAt: string;
  name: string;
  price: number; // Price per kg
  shelfLife: number; // Days before expiry in days
}

export interface ProductData extends Product {
  docId: string;
}
