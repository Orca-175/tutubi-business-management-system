export interface Supplier {
  address: {
    barangay: string;
    city: string;
    houseNumber: string;
    region: string;
    street: string;
  };
  businessName: string;
  createdAt: string;
  email: string;
  ownerName: string;
  phone: string;
};

export interface SupplierData extends Supplier {
  docId: string;
}

