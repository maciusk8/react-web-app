import { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { perfumeApi } from '../services/api';
import type { Perfume } from '../types/types';

export default function BrandPage() {
    const { brand } = useParams<{ brand: string }>();
    const [perfumes, setPerfumes] = useState<Perfume[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!brand) return;

        const fetchPerfumes = async () => {
            setLoading(true);
            try {
                const data = await perfumeApi.getByBrand(brand);
                setPerfumes(data);
            } catch (err) {
                console.error('Failed to load brand perfumes:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPerfumes();
    }, [brand]);

    return (
        <PageWrapper>
            <Container className="py-5">
                {/* Header */}
                <div className="text-center mb-5">
                    <p className="text-uppercase text-muted mb-2" style={{ fontSize: '0.7rem', letterSpacing: '3px' }}>Marka</p>
                    <h1 style={{ fontFamily: 'var(--font-serif)' }} className="display-4 fw-bold mb-3">{brand}</h1>
                    <div className="mx-auto" style={{ width: '60px', height: '2px', background: 'var(--color-gold)' }} />
                    <p className="text-muted mt-3">{perfumes.length} perfum w kolekcji</p>
                </div>

                {/* Loading */}
                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="dark" />
                    </div>
                ) : (
                    <Row className="g-4">
                        {perfumes.map((perfume) => (
                            <Col xs={6} md={4} lg={3} key={perfume.id}>
                                <Link to={`/product/${perfume.id}`} className="text-decoration-none">
                                    <div className="bg-white p-3 text-center h-100 card-premium">
                                        <div
                                            className="mb-3"
                                            style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-cream)' }}
                                        >
                                            {perfume.imageUrl ? (
                                                <img
                                                    src={perfume.imageUrl}
                                                    alt={perfume.name}
                                                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <span className="text-muted small">Brak zdjęcia</span>
                                            )}
                                        </div>
                                        <h6 className="fw-bold text-dark mb-1" style={{ fontFamily: 'var(--font-serif)', fontSize: '0.9rem' }}>
                                            {perfume.name}
                                        </h6>
                                        {perfume.family && (
                                            <small className="text-muted" style={{ fontSize: '0.7rem' }}>{perfume.family}</small>
                                        )}
                                    </div>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                )}

                {!loading && perfumes.length === 0 && (
                    <p className="text-center text-muted fst-italic py-5">
                        Nie znaleziono perfum tej marki
                    </p>
                )}
            </Container>
        </PageWrapper>
    );
}
