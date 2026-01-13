import { useState } from 'react';

interface StarRatingProps {
    rating: number;
    onRatingChange?: (rating: number) => void;
    size?: number;
    readOnly?: boolean;
}

export default function StarRating({ rating, onRatingChange, size = 24, readOnly = false }: StarRatingProps) {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div
            className="d-flex gap-1"
            onMouseLeave={() => !readOnly && setHoverRating(0)}
            style={{ cursor: readOnly ? 'default' : 'pointer' }}
        >
            {[1, 2, 3, 4, 5].map((star) => (
                <div
                    key={star}
                    onClick={() => !readOnly && onRatingChange?.(star)}
                    onMouseEnter={() => !readOnly && setHoverRating(star)}
                    style={{
                        color: (hoverRating || rating) >= star ? '#c9a962' : '#e4e5e9',
                        transition: 'color 0.2s',
                        fontSize: size,
                        lineHeight: 1
                    }}
                    title={`${star}/5`}
                >
                    ★
                </div>
            ))}
        </div>
    );
}
