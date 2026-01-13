import { useState, useEffect } from 'react';
import { Container, Spinner, Row, Col, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { useAuth } from '../context/AuthContext';
import { userApi, reviewApi } from '../services/api';
import type { Perfume, UserSummary, Review } from '../types/types';
import HorizontalScrollList from '../components/HorizontalScrollList';

export default function ProfilePage() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    const [wishlist, setWishlist] = useState<Perfume[]>([]);
    const [owned, setOwned] = useState<Perfume[]>([]);
    const [friends, setFriends] = useState<UserSummary[]>([]);
    const [myReviews, setMyReviews] = useState<Review[]>([]); // New state for reviews
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/login');
            return;
        }

        const fetchUserData = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const [wishlistData, ownedData, friendsData, reviewsData] = await Promise.all([
                    userApi.getWishlist(user.id),
                    userApi.getOwned(user.id),
                    userApi.getFriends(user.id),
                    reviewApi.getByUser(user.id) // Fetch reviews
                ]);
                setWishlist(wishlistData);
                setOwned(ownedData);
                setFriends(friendsData);
                setMyReviews(reviewsData);
            } catch (err) {
                console.error('Failed to load profile data:', err);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchUserData();
    }, [user, isAuthenticated, isLoading, navigate]);

    const handleRemoveFriend = async (friendId: number) => {
        if (!user || !window.confirm('Usunąć ze znajomych?')) return;
        try {
            await userApi.toggleFriend(user.id, friendId); // Toggle removes if exists
            setFriends(prev => prev.filter(f => f.id !== friendId));
        } catch (err) {
            console.error(err);
        }
    };

    if (isLoading) {
        return (
            <PageWrapper>
                <div className="text-center py-5">
                    <Spinner animation="border" variant="dark" />
                </div>
            </PageWrapper>
        );
    }

    if (!isAuthenticated || !user) return null;

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
                {/* Profile Header */}
                <div className="text-center mb-5">
                    <div
                        className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                        style={{ width: 100, height: 100, fontSize: '2.5rem', fontFamily: 'var(--font-serif)' }}
                    >
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-serif)' }}>{user.username}</h2>
                    <span className="badge bg-gold text-white text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>
                        {user.role}
                    </span>
                </div>

                {/* Recently Rated Section - First! */}
                <HorizontalScrollList
                    title="Ostatnio Ocenione"
                    items={myReviews}
                    renderItem={renderReviewCard}
                    loading={loading}
                    emptyMessage="Nie dodałeś jeszcze żadnych recenzji."
                />

                {/* Wishlist Section */}
                <HorizontalScrollList
                    title="Wishlist"
                    items={wishlist}
                    renderItem={renderPerfumeCard}
                    loading={loading}
                    emptyMessage="Twój wishlist jest pusty."
                />

                {/* Owned Section */}
                <HorizontalScrollList
                    title="Posiadane Perfumy"
                    items={owned}
                    renderItem={renderPerfumeCard}
                    loading={loading}
                    emptyMessage="Nie dodałeś jeszcze żadnych perfum."
                />

                {/* Friends Section */}
                <div>
                    <div className="d-flex align-items-center gap-3 mb-4">
                        <h4 style={{ fontFamily: 'var(--font-serif)' }} className="mb-0">Znajomi</h4>
                        <div className="flex-grow-1" style={{ height: '1px', background: 'rgba(201,169,98,0.3)' }}></div>
                        <span className="text-muted small">{friends.length}</span>
                    </div>

                    {loading ? (
                        <div className="text-center py-3">
                            <Spinner animation="border" size="sm" />
                        </div>
                    ) : friends.length === 0 ? (
                        <p className="text-muted fst-italic text-center py-3 border bg-light">Nie masz jeszcze znajomych.</p>
                    ) : (
                        <Row className="g-3">
                            {friends.map(friend => (
                                <Col xs={12} md={6} lg={4} key={friend.id}>
                                    <div className="d-flex align-items-center justify-content-between bg-white p-3 border h-100">
                                        <div className="d-flex align-items-center gap-3">
                                            <Link to={`/profile/${friend.id}`} className="text-decoration-none">
                                                <div className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, fontFamily: 'var(--font-serif)' }}>
                                                    {friend.username.charAt(0).toUpperCase()}
                                                </div>
                                            </Link>
                                            <Link to={`/profile/${friend.id}`} className="text-dark fw-bold text-decoration-none">
                                                {friend.username}
                                            </Link>
                                        </div>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleRemoveFriend(friend.id)} className="rounded-0 text-uppercase" style={{ fontSize: '0.6rem' }}>
                                            Usuń
                                        </Button>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    )}
                </div>

            </Container>
        </PageWrapper>
    );
}
