import { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { useAuth } from '../context/AuthContext';
import { userApi, reviewApi } from '../services/api';
import type { UserSummary, Review } from '../types/types';
import ReviewItem from '../components/ReviewItem';

export default function FriendsPage() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<UserSummary[]>([]);
    const [searching, setSearching] = useState(false);
    const [friendMessage, setFriendMessage] = useState('');
    const [feed, setFeed] = useState<Review[]>([]);
    const [feedLoading, setFeedLoading] = useState(true);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, isLoading, navigate]);

    const fetchFeed = async () => {
        if (!user) return;
        try {
            const reviews = await reviewApi.getFeed(user.id);
            setFeed(reviews);
        } catch (err) {
            console.error('Feed error:', err);
        } finally {
            setFeedLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            setFeedLoading(true);
            fetchFeed();
        }
    }, [user]);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setSearching(true);
        try {
            const results = await userApi.search(searchQuery);
            setSearchResults(results.filter(u => u.id !== user?.id));
        } catch (err) {
            console.error('Search error:', err);
        } finally {
            setSearching(false);
        }
    };

    const handleAddFriend = async (targetId: number) => {
        if (!user) return;
        try {
            const result = await userApi.toggleFriend(user.id, targetId);
            setFriendMessage(result);
            setTimeout(() => setFriendMessage(''), 3000);
        } catch (err: any) {
            setFriendMessage(err.message || 'Błąd');
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

    if (!isAuthenticated) {
        return null;
    }

    return (
        <PageWrapper>
            <Container className="py-5">
                {/* Header */}
                <div className="text-center mb-5">
                    <h1 style={{ fontFamily: 'var(--font-serif)' }} className="display-5 fw-bold mb-2">
                        Społeczność
                    </h1>
                    <p className="text-muted fst-italic">Śledź aktywność znajomych i odkrywaj nowe zapachy</p>
                    <div className="mx-auto" style={{ width: '60px', height: '2px', background: 'var(--color-gold)' }} />
                </div>

                {friendMessage && (
                    <Alert variant="success" className="text-center rounded-0 mb-4">{friendMessage}</Alert>
                )}

                <Row>
                    {/* LEFT: Feed */}
                    <Col lg={8} className="mb-4 mb-lg-0">
                        <div className="d-flex align-items-center gap-3 mb-4">
                            <h5 style={{ fontFamily: 'var(--font-serif)' }} className="mb-0">Aktywność znajomych</h5>
                        </div>

                        {feedLoading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" size="sm" />
                            </div>
                        ) : feed.length === 0 ? (
                            <div className="bg-white p-5 text-center" style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
                                <p className="text-muted fst-italic mb-2">Brak aktywności znajomych.</p>
                                <p className="text-muted small">Dodaj znajomych, aby śledzić ich recenzje!</p>
                            </div>
                        ) : (
                            <div className="d-flex flex-column">
                                {feed.map((review) => (
                                    <ReviewItem
                                        key={review.id}
                                        review={review}
                                        onRefresh={fetchFeed}
                                        variant="feed"
                                    />
                                ))}
                            </div>
                        )}
                    </Col>

                    {/* RIGHT: Search */}
                    <Col lg={4}>
                        <div className="d-flex align-items-center gap-3 mb-4">
                            <h5 style={{ fontFamily: 'var(--font-serif)' }} className="mb-0">Znajdź użytkowników</h5>
                        </div>

                        <div className="bg-white p-4" style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
                            <div className="d-flex gap-2 mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder="Wyszukaj..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    className="rounded-0"
                                    style={{ borderColor: 'rgba(0,0,0,0.1)' }}
                                />
                                <button
                                    onClick={handleSearch}
                                    disabled={searching}
                                    className="btn-premium px-3"
                                    style={{ whiteSpace: 'nowrap' }}
                                >
                                    {searching ? '...' : 'Szukaj'}
                                </button>
                            </div>

                            {searchResults.length > 0 && (
                                <div className="d-flex flex-column gap-2">
                                    {searchResults.map((result) => (
                                        <div
                                            key={result.id}
                                            className="d-flex align-items-center justify-content-between p-3"
                                            style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}
                                        >
                                            <div className="d-flex align-items-center gap-2">
                                                <div
                                                    className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center"
                                                    style={{ width: 36, height: 36, fontSize: '0.9rem' }}
                                                >
                                                    {result.username.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="fw-medium">{result.username}</span>
                                            </div>
                                            <button
                                                onClick={() => handleAddFriend(result.id)}
                                                className="btn btn-link text-gold p-0 text-decoration-none small"
                                            >
                                                + Dodaj
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {searchResults.length === 0 && searchQuery && !searching && (
                                <p className="text-center text-muted small fst-italic py-3">
                                    Brak wyników dla "{searchQuery}"
                                </p>
                            )}
                        </div>


                        <div className="mt-4 p-4" style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}>
                            <h6 className="text-uppercase text-muted mb-3" style={{ fontSize: '0.7rem', letterSpacing: '2px' }}>
                                Sugerowane konta
                            </h6>
                            <div className="small text-muted d-flex flex-column gap-2">
                                <p className="mb-1">• anna_perfumy</p>
                                <p className="mb-1">• tomek_niche</p>
                                <p className="mb-1">• ewa_luxury</p>
                                <p className="mb-0">• jan_vintage</p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </PageWrapper>
    );
}
