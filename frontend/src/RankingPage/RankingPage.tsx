import { useState, useEffect } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { perfumeApi } from '../services/api';
import type { Perfume } from '../types/types';

export default function RankingPage() {
    const [activeTab, setActiveTab] = useState<'men' | 'women' | 'unisex'>('men');
    const [menPerfumes, setMenPerfumes] = useState<Perfume[]>([]);
    const [womenPerfumes, setWomenPerfumes] = useState<Perfume[]>([]);
    const [unisexPerfumes, setUnisexPerfumes] = useState<Perfume[]>([]);
    const [loading, setLoading] = useState(true);

    const calculateAverage = (perfume: Perfume) => {
        if (!perfume.reviews || perfume.reviews.length === 0) return 0;
        const sum = perfume.reviews.reduce((acc, r) => acc + r.rating, 0);
        return sum / perfume.reviews.length;
    };

    useEffect(() => {
        const fetchPerfumes = async () => {
            setLoading(true);
            try {
                const [men, women, unisex] = await Promise.all([
                    perfumeApi.getByGender('Male'),
                    perfumeApi.getByGender('Female'),
                    perfumeApi.getByGender('Unisex')
                ]);

                const sortByRating = (a: Perfume, b: Perfume) => calculateAverage(b) - calculateAverage(a);

                setMenPerfumes(men.sort(sortByRating).slice(0, 10));
                setWomenPerfumes(women.sort(sortByRating).slice(0, 10));
                setUnisexPerfumes(unisex.sort(sortByRating).slice(0, 10));
            } catch (err) {
                console.error('Error loading rankings:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPerfumes();
    }, []);

    const currentPerfumes =
        activeTab === 'men' ? menPerfumes :
            activeTab === 'women' ? womenPerfumes :
                unisexPerfumes;

    const renderTab = (key: 'men' | 'women' | 'unisex', label: string) => (
        <button
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 text-uppercase small fw-medium border-0 ${activeTab === key ? 'bg-dark text-white' : 'bg-transparent text-dark'
                }`}
            style={{ letterSpacing: '1px', transition: 'all 0.3s ease', minWidth: '120px' }}
        >
            {label}
        </button>
    );

    return (
        <PageWrapper>
            <Container className="py-5">
                {/* Header */}
                <div className="text-center mb-5">
                    <h1 style={{ fontFamily: 'var(--font-serif)' }} className="display-5 fw-bold mb-2">
                        Rankingi Perfum
                    </h1>
                    <p className="text-muted fst-italic">Najpopularniejsze zapachy wybrane przez społeczność</p>
                    <div className="mx-auto" style={{ width: '60px', height: '2px', background: 'var(--color-gold)' }} />
                </div>

                {/* Tabs */}
                <div className="text-center mb-5">
                    <div className="d-inline-flex border border-dark">
                        {renderTab('men', 'Mężczyzna')}
                        {renderTab('women', 'Kobieta')}
                        {renderTab('unisex', 'Unisex')}
                    </div>
                </div>

                {/* Rankings */}
                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="dark" />
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-3 mx-auto" style={{ maxWidth: '800px' }}>
                        {currentPerfumes.map((perfume, idx) => (
                            <Link key={perfume.id} to={`/product/${perfume.id}`} className="text-decoration-none">
                                <div
                                    className="d-flex align-items-center gap-4 p-4 bg-white card-premium shadow-sm"
                                    style={{ transition: 'transform 0.2s', border: '1px solid #eee' }}
                                >
                                    {/* Rank */}
                                    <span
                                        style={{
                                            fontFamily: 'var(--font-serif)',
                                            fontSize: '2rem',
                                            width: '50px',
                                            textAlign: 'center'
                                        }}
                                        className="fw-bold text-star-gold"
                                    >
                                        {idx + 1}
                                    </span>

                                    {/* Image */}
                                    <div
                                        className="flex-shrink-0 d-flex align-items-center justify-content-center"
                                        style={{ width: '80px', height: '80px', background: 'var(--color-cream)' }}
                                    >
                                        {perfume.imageUrl ? (
                                            <img
                                                src={perfume.imageUrl}
                                                alt={perfume.name}
                                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                                loading="lazy"
                                            />
                                        ) : (
                                            <span className="text-muted small">IMG</span>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-grow-1">
                                        <h5 className="mb-1 text-dark" style={{ fontFamily: 'var(--font-serif)' }}>{perfume.name}</h5>
                                        <span className="text-uppercase text-muted" style={{ fontSize: '0.7rem', letterSpacing: '2px' }}>
                                            {perfume.brand}
                                        </span>
                                    </div>

                                    {/* Rating Score */}
                                    <span
                                        className="fw-bold text-star-gold"
                                        style={{
                                            fontFamily: 'var(--font-serif)',
                                            fontSize: '1.2rem'
                                        }}
                                    >
                                        ★ {calculateAverage(perfume).toFixed(1)}
                                    </span>
                                </div>
                            </Link>
                        ))}
                        {currentPerfumes.length === 0 && (
                            <p className="text-center text-muted fst-italic py-5">Brak danych w rankingu.</p>
                        )}
                    </div>
                )}
            </Container>
        </PageWrapper>
    );
}
