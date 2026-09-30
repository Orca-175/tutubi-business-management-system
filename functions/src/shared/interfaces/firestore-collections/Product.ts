export interface Product {
  createdAt: string;
  name: string;
  price: number;

}

export interface ProductData extends Product {
  docId: string;
}
