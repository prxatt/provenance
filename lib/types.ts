export type ProductCategory = 'watches' | 'jewelry';
export type ProductGender = 'men' | 'women' | 'unisex';

export type ProductFeatureSection = {
  kicker: string;
  title: string;
  body: string;
  image: string;
  imagePosition?: 'left' | 'right';
};

export type Product = {
  id: string;
  slug: string;
  brand: string;
  name: string;
  ref: string;
  price: number;
  type: 'Watch' | 'Jewelry';
  tag: string;
  gender: ProductGender;
  category: ProductCategory;
  verified: boolean;
  mockLayout: boolean;
  featured: boolean;
  status: string;
  condition: string;
  year: number;
  location: string;
  caseSize: string;
  material: string;
  movement: string;
  boxPapers: string;
  description: string;
  provenanceCopy: string;
  cardImage: string;
  heroImage: string;
  galleryImages: string[];
  featureSections?: ProductFeatureSection[];
  modelUrl: string;
  sortOrder: number;
  listedAt: string;
  published: boolean;
};

export type AccessRequest = {
  id: string;
  email: string;
  name?: string;
  interest?: string;
  createdAt: string;
};

export type AuditEntry = {
  id: string;
  action: string;
  actor: string;
  target?: string;
  detail?: string;
  createdAt: string;
};

export type Order = {
  id: string;
  productSlug: string;
  email: string;
  name: string;
  phone?: string;
  shippingCity?: string;
  note?: string;
  amount: number;
  createdAt: string;
  status: string;
  acknowledgements?: {
    finalSale: boolean;
    insuredShipping: boolean;
    authenticity: boolean;
    preOwnedLegal: boolean;
  };
};

export type CheckoutRequest = {
  productSlug: string;
  email: string;
  name: string;
  phone?: string;
  shippingCity?: string;
  note?: string;
  amount: number;
  acknowledgements: {
    finalSale: boolean;
    insuredShipping: boolean;
    authenticity: boolean;
    preOwnedLegal: boolean;
  };
};
