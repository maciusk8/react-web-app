import { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { perfumeApi, reviewApi } from '../services/api';
import type { Perfume, Review } from '../types/types';

export default function HomePage() {
    const [recommendations, setRecommendations] = useState<Perfume[]>([]);
    const [loading, setLoading] = useState(true);
    const [recentReviews, setRecentReviews] = useState<Review[]>([]);
    const [perfumeCount, setPerfumeCount] = useState(0);
    const [activityLoading, setActivityLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const perfumes = await perfumeApi.getAll();
                setRecommendations(perfumes.slice(0, 8));
                setPerfumeCount(perfumes.length);
            } catch (err) {
                console.error('Failed to load data:', err);
            } finally {
                setLoading(false);
            }
        };

        const fetchRecentActivity = async () => {
            try {
                const reviews = await reviewApi.getRecent(6);
                setRecentReviews(reviews);
            } catch (err) {
                console.error('Failed to load recent activity:', err);
            } finally {
                setActivityLoading(false);
            }
        };

        fetchData();
        fetchRecentActivity();
    }, []);

    return (
        <PageWrapper>
            <Container className="py-5">
                <Row>
                    {/* LEFT MAIN CONTENT */}
                    <Col lg={8}>
                        {/* Sponsored Article */}
                        <section className="mb-5">
                            <Link to="/article/paco-rabanne" className="text-decoration-none">
                                <div
                                    className="bg-white p-4 p-md-5 d-flex flex-column flex-md-row align-items-center gap-4 card-premium"
                                >
                                    {/* Image */}
                                    <div style={{ flex: '0 0 250px' }}>
                                        <img
                                            src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400&auto=format&fit=crop"
                                            alt="Paco Rabanne"
                                            className="w-100"
                                            style={{ height: '180px', objectFit: 'cover' }}
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-grow-1 text-center text-md-start">
                                        <span
                                            className="text-uppercase d-block mb-2 text-star-gold"
                                            style={{ fontSize: '0.65rem', letterSpacing: '3px' }}
                                        >
                                            Artykuł
                                        </span>
                                        <h2 style={{ fontFamily: 'var(--font-serif)' }} className="mb-3 text-dark">
                                            Paco Rabanne: Rewolucja w świecie perfum
                                        </h2>
                                        <p className="text-muted mb-3">
                                            Odkryj historię marki, która zdefiniowała męską elegancję.
                                        </p>
                                        <span
                                            className="text-uppercase text-star-gold"
                                            style={{ fontSize: '0.75rem', letterSpacing: '2px' }}
                                        >
                                            Czytaj więcej →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </section>

                        {/* Recommendations */}
                        <section>
                            <div className="d-flex align-items-center gap-4 mb-4">
                                <div className="flex-grow-1" style={{ height: '1px', background: 'rgba(192,192,192,0.3)' }}></div>
                                <h2 style={{ fontFamily: 'var(--font-serif)' }} className="mb-0">Polecane perfumy</h2>
                                <div className="flex-grow-1" style={{ height: '1px', background: 'rgba(192,192,192,0.3)' }}></div>
                            </div>

                            {loading ? (
                                <div className="text-center py-5">
                                    <Spinner animation="border" variant="dark" />
                                </div>
                            ) : (
                                <Row className="g-4">
                                    {recommendations.map((perfume) => (
                                        <Col xs={6} md={4} lg={3} key={perfume.id}>
                                            <Link to={`/product/${perfume.id}`} className="text-decoration-none">
                                                <div
                                                    className="bg-white p-3 text-center h-100 card-premium"
                                                >
                                                    <div
                                                        className="mb-3"
                                                        style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-cream)' }}
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
                                                    <p
                                                        className="text-uppercase text-muted mb-1"
                                                        style={{ fontSize: '0.6rem', letterSpacing: '2px' }}
                                                    >
                                                        {perfume.brand}
                                                    </p>
                                                    <h6
                                                        className="mb-0 text-dark"
                                                        style={{ fontFamily: 'var(--font-serif)', fontSize: '0.9rem' }}
                                                    >
                                                        {perfume.name}
                                                    </h6>
                                                </div>
                                            </Link>
                                        </Col>
                                    ))}
                                </Row>
                            )}
                        </section>
                    </Col>

                    {/* RIGHT SIDEBAR - RECENT ACTIVITY */}
                    <Col lg={4}>
                        <div className="position-sticky" style={{ top: '20px' }}>
                            {/* Perfume Count */}
                            <div className="bg-white p-4 mb-4 text-center" style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
                                <p className="text-uppercase text-muted mb-2" style={{ fontSize: '0.65rem', letterSpacing: '2px' }}>
                                    Baza Perfum
                                </p>
                                <h3 className="fw-bold mb-0 text-star-gold" style={{ fontFamily: 'var(--font-serif)' }}>
                                    {perfumeCount}
                                </h3>
                                <p className="text-muted small mb-0">perfum w kolekcji</p>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white p-4" style={{ border: '1px solid rgba(0,0,0,0.05)', minHeight: '750px', display: 'flex', flexDirection: 'column' }}>
                                <h5 className="mb-4" style={{ fontFamily: 'var(--font-serif)' }}>Najnowsza aktywność</h5>

                                {activityLoading ? (
                                    <div className="text-center py-3">
                                        <Spinner animation="border" size="sm" />
                                    </div>
                                ) : (
                                    <div className="d-flex flex-column gap-3">
                                        {recentReviews.map((review, index) => (
                                            <div key={review.id} className="pb-3" style={{ borderBottom: index < recentReviews.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}>
                                                <Link to={`/product/${review.subject?.id || 1}`} className="text-decoration-none">
                                                    <div className="d-flex gap-2 mb-1">
                                                        <span className="text-star-gold">{'★'.repeat(review.rating)}</span>
                                                        <span className="text-muted small">{review.rating}/5</span>
                                                    </div>
                                                    <p className="mb-1 small fw-medium text-dark" style={{ fontFamily: 'var(--font-serif)' }}>
                                                        {review.subject?.name || 'Perfumy'}
                                                    </p>
                                                    <p className="mb-0 text-muted small">
                                                        przez {review.author.username}
                                                    </p>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </PageWrapper>
    );
}
