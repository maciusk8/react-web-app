import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Product } from '../types';

export const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`https://dummyjson.com/products/${id}`)
        .then(res => res.json())
        .then(data => setProduct(data));
    }
  }, [id]);

  if (!product) return <div className="container">Ładowanie...</div>;

  return (
    <div className="container" style={{ marginTop: '40px' }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#666' }}>&larr; Powrót</Link>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', marginTop: '20px' }}>
        
        {/* lewo: Galeria (glowne zdjęcie + miniaturki) */}
        <div>
          <div style={{ background: '#f4f4f4', borderRadius: '8px', overflow: 'hidden', aspectRatio: '4/3', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <img src={product.thumbnail} alt={product.title} style={{ maxWidth: '100%', maxHeight:'100%' }} />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px', overflowX: 'auto' }}>
            {product.images.map((img, index) => (
              <img key={index} src={img} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} alt="" />
            ))}
          </div>
        </div>

        {/* prawo: Opis */}
        <div>
          <h4 style={{ textTransform: 'uppercase', color: '#666', fontWeight: 'bold' }}>{product.brand}</h4>
          <h1 style={{ fontSize: '32px', margin: '10px 0' }}>{product.title}</h1>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#d01345', marginBottom: '20px' }}>
            {product.price} $
          </div>
          
          <p style={{ lineHeight: '1.6', color: '#333' }}>{product.description}</p>
          
          <button style={{ 
            background: 'black', color: 'white', padding: '15px 40px', 
            fontSize: '16px', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '20px' 
          }}>
            DODAJ DO KOSZYKA
          </button>
        </div>
      </div>
    </div>
  );
};