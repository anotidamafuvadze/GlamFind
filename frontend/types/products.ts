export interface Product {
  id: string;
  image: string;
  brand: string;
  name: string;
  rationale: string;
  description?: string;
  keyAttributes?: string[];
  reviews?: string[];
  websiteLink?: string;
}