export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string; // Główne zdjęcie
  images: string[];  // Galeria zdjęć
}

// DummyJSON zwraca taki obiekt
export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}