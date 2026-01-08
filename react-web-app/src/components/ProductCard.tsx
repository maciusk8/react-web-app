import { Link } from 'react-router-dom';
import type { Product } from '../types';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  data: Product;
}

export const ProductCard = ({ data }: ProductCardProps) => {
  // czy jest promocja?
  const isSale = data.discountPercentage > 5;
  
  const oldPrice = (data.price / (1 - data.discountPercentage / 100)).toFixed(0);

  return (
    <div className={styles.card}>
      <Link to={`/product/${data.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        
        {/* zdj */}
        <div className={styles.imageContainer}>
          <button 
            className={styles.wishlistBtn}
            onClick={(e) => {
              e.preventDefault();
              console.log('Ulubione:', data.title);
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>

          <img 
            src={data.thumbnail} 
            alt={data.title} 
            className={styles.image} 
            loading="lazy"
          />

          {isSale && (
            <span className={styles.badge}>-{Math.round(data.discountPercentage)}%</span>
          )}
        </div>

        {/* dane */}
        <div className={styles.info}>
          <h3 className={styles.brand}>{data.brand || data.category}</h3>
          <p className={styles.title}>{data.title}</p>
          
          <div className={styles.priceContainer}>
            <span className={`${styles.price} ${isSale ? styles.priceDiscount : ''}`}>
              {data.price} $
            </span>
            
            {isSale && (
              <span className={styles.oldPrice}>{oldPrice} $</span>
            )}
          </div>
        </div>

      </Link>
    </div>
  );
};