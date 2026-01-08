import { useEffect, useState } from 'react';
import type { Product, ProductsResponse } from '../types';
import { ProductCard } from '../components/ProductCard';

export const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://dummyjson.com/products?limit=0')
      .then(res => res.json())
      .then((data: ProductsResponse) => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  if (loading) return <div className="container">Ładowanie pełnej oferty...</div>;

  return (
    <div className="container">
      <h1 style={{ margin: '30px 0', fontSize: '24px', fontWeight: '800' }}>
        Wszystkie Produkty ({products.length})
      </h1>
      
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} data={product} />
        ))}
      </div>
    </div>
  );
};