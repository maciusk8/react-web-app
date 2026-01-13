import { useState, useEffect } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { useAuth } from '../context/AuthContext';
import { userApi, reviewApi } from '../services/api';
import type { UserSummary, Review, Perfume } from '../types/types';
import HorizontalScrollList from '../components/HorizontalScrollList';

export default function UserProfilePage() {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const { isAuthenticated, isLoading: authLoading } = useAuth();

    const [profileUser, setProfileUser] = useState<UserSummary | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [wishlist, setWishlist] = useState<Perfume[]>([]);
    const [owned, setOwned] = useState<Perfume[]>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/login');
        }
    }, [authLoading, isAuthenticated, navigate]);

    useEffect(() => {
        if (!userId) return;
        const id = Number(userId);

        const fetchData = async () => {
            setLoading(true);
            try {
                const [userData, userReviews, userWishlist, userOwned] = await Promise.all([
                    userApi.getById(id),
                    reviewApi.getByUser(id),
                    userApi.getWishlist(id),
                    userApi.getOwned(id)
                ]);

                setProfileUser(userData);
                setReviews(userReviews);
                setWishlist(userWishlist);
                setOwned(userOwned);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);

    if (loading || authLoading) return <PageWrapper><div className="text-center py-5"><Spinner animation="border" /></div></PageWrapper>;
    if (!profileUser) return <PageWrapper><div className="text-center py-5">Nie znaleziono użytkownika</div></PageWrapper>;

    const renderPerfumeCard = (perfume: Perfume) => (
        <Link to={`/product/${perfume.id}`} className="text-decoration-none">
            <div className="bg-white p-3 text-center card-premium h-100 border" style={{ transition: 'transform 0.2s' }}>
                <div className="mb-2 d-flex align-items-center justify-content-center" style={{ height: '120px', background: '#fcfcfc' }}>
                    {perfume.imageUrl ? (
                        <img src={perfume.imageUrl} alt={perfume.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} loading="lazy" />
                    ) : (
                        <span className="text-muted small">IMG</span>
                    )}
                </div>
                <h6 className="mb-0 text-dark small fw-bold text-truncate" style={{ fontFamily: 'var(--font-serif)' }}>{perfume.name}</h6>
                <span className="text-muted text-truncate d-block" style={{ fontSize: '0.65rem' }}>{perfume.brand}</span>
            </div>
        </Link>
    );

    const renderReviewCard = (review: Review) => (
        <div className="bg-white p-3 border h-100 d-flex flex-column" style={{ minHeight: '180px' }}>
            <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="badge bg-dark text-white">{review.rating}/5</span>
                <span className="text-muted" style={{ fontSize: '0.6rem' }}>{new Date(review.createdAt || '').toLocaleDateString()}</span>
            </div>
            {review.subject && (
                <Link to={`/product/${review.subject.id}`} className="text-decoration-none text-dark mb-2">
                    <h6 className="mb-0 small fw-bold text-truncate" style={{ fontFamily: 'var(--font-serif)' }}>{review.subject.name}</h6>
                    <span className="text-muted small d-block" style={{ fontSize: '0.65rem' }}>{review.subject.brand}</span>
                </Link>
            )}
            <p className="text-muted small mb-0 flex-grow-1 overflow-hidden" style={{
                fontSize: '0.75rem',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical'
            }}>
                "{review.text}"
            </p>
        </div>
    );

    return (
        <PageWrapper>
            <Container className="py-5">
                <div className="bg-white p-5 mb-5 text-center border">
                    <div
                        className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                        style={{ width: 100, height: 100, fontSize: '2.5rem', fontFamily: 'var(--font-serif)' }}
                    >
                        {profileUser.username.charAt(0).toUpperCase()}
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-serif)' }}>{profileUser.username}</h2>
                    <div className="d-flex justify-content-center gap-3 text-muted small mt-3">
                        <span>{reviews.length} recenzji</span>
                        <span>{wishlist.length} w Wishlist</span>
                        <span>{owned.length} posiada</span>
                    </div>
                </div>

                {/* Reviews Section */}
                <HorizontalScrollList
                    title="Ostatnie Recenzje"
                    items={reviews}
                    renderItem={renderReviewCard}
                    loading={loading}
                    emptyMessage="Brak recenzji."
                />

                {/* Wishlist Section */}
                <HorizontalScrollList
                    title="Wishlist"
                    items={wishlist}
                    renderItem={renderPerfumeCard}
                    loading={loading}
                    emptyMessage="Pusty wishlist."
                />

                {/* Owned Section */}
                <HorizontalScrollList
                    title="Posiada"
                    items={owned}
                    renderItem={renderPerfumeCard}
                    loading={loading}
                    emptyMessage="Brak posiadanych perfum."
                />

            </Container>
        </PageWrapper>
    );
}
