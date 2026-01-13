import React, { useRef, useState } from 'react';


interface HorizontalScrollListProps<T> {
    title: string;
    items: T[];
    renderItem: (item: T) => React.ReactNode;
    emptyMessage?: string;
    loading?: boolean;
}

export default function HorizontalScrollList<T>({
    title,
    items,
    renderItem,
    emptyMessage = "Brak elementów.",
    loading = false
}: HorizontalScrollListProps<T>) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { clientWidth } = scrollContainerRef.current;
            const scrollAmount = clientWidth * 0.8;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="mb-5 position-relative group-hover-container">
            <div className="d-flex align-items-center gap-3 mb-4">
                <h4 style={{ fontFamily: 'var(--font-serif)' }} className="mb-0">{title}</h4>
                <div className="flex-grow-1" style={{ height: '1px', background: 'rgba(201,169,98,0.3)' }}></div>
                <span className="text-muted small">{items.length}</span>
            </div>

            {loading ? (
                <div className="d-flex gap-3 overflow-hidden">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-light" style={{ minWidth: '200px', height: '280px', borderRadius: '4px' }}></div>
                    ))}
                </div>
            ) : items.length === 0 ? (
                <p className="text-muted fst-italic text-center py-3 border bg-light">{emptyMessage}</p>
            ) : (
                <div className="position-relative">
                    {/* Left Arrow */}
                    {showLeftArrow && (
                        <button
                            className="position-absolute start-0 top-50 translate-middle-y z-3 rounded-circle d-flex align-items-center justify-content-center border shadow-sm btn-scroll"
                            style={{
                                width: '45px',
                                height: '45px',
                                left: '-22px',
                                background: 'white',
                                color: '#333',
                                transition: 'all 0.2s ease'
                            }}
                            onClick={() => scroll('left')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </button>
                    )}

                    {/* Scroll Container */}
                    <div
                        ref={scrollContainerRef}
                        className="d-flex gap-3 overflow-auto pb-3 hide-scrollbar"
                        style={{ scrollBehavior: 'smooth', scrollSnapType: 'x mandatory' }}
                        onScroll={handleScroll}
                    >
                        {items.map((item, idx) => (
                            <div key={idx} style={{ minWidth: '200px', maxWidth: '200px', scrollSnapAlign: 'start' }}>
                                {renderItem(item)}
                            </div>
                        ))}
                    </div>

                    {/* Right Arrow */}
                    {showRightArrow && (
                        <button
                            className="position-absolute end-0 top-50 translate-middle-y z-3 rounded-circle d-flex align-items-center justify-content-center border shadow-sm btn-scroll"
                            style={{
                                width: '45px',
                                height: '45px',
                                right: '-22px',
                                background: 'white',
                                color: '#333',
                                transition: 'all 0.2s ease'
                            }}
                            onClick={() => scroll('right')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                    )}
                </div>
            )}

            <style>
                {`
                    .hide-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .hide-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                    .btn-scroll:hover {
                        transform: translateY(-50%) scale(1.1) !important;
                        box-shadow: 0 .5rem 1rem rgba(0,0,0,.15) !important;
                    }
                `}
            </style>
        </div>
    );
}
