export interface Supplier {
  address: string;
  businessName: string;
  createdAt: string;
  ownerName: string;
};

export interface SupplierData extends Supplier {
  docId: string;
}

