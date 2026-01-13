import { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Button, Form } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { perfumeApi, reviewApi, userApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Perfume, Review } from '../types/types';
import ReviewItem from '../components/ReviewItem';
import StarRating from '../components/StarRating';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [perfume, setPerfume] = useState<Perfume | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Review form
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    if (!id) return;
    try {
      const [perfumeData, reviewsData] = await Promise.all([
        perfumeApi.getById(Number(id)),
        reviewApi.getByPerfume(Number(id))
      ]);
      setPerfume(perfumeData);
      setReviews(reviewsData);
    } catch (err: any) {
      setError(err.message || 'Nie udało się załadować');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToWishlist = async () => {
    if (!user || !perfume) return;
    try {
      const result = await userApi.toggleWishlist(user.id, perfume.id);
      setMessage(result);
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage(err.message || 'Błąd');
    }
  };

  const handleAddToOwned = async () => {
    if (!user || !perfume) return;
    try {
      const result = await userApi.toggleOwned(user.id, perfume.id);
      setMessage(result);
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage(err.message || 'Błąd');
    }
  };

  const handleSubmitReview = async () => {
    if (!user || !perfume || !reviewText.trim()) return;
    setSubmitting(true);
    try {
      await reviewApi.create({
        perfumeId: perfume.id,
        userId: user.id,
        text: reviewText,
        rating: reviewRating
      });
      setReviewText('');
      setReviewRating(5);
      fetchData(); // Refresh reviews
    } catch (err: any) {
      setMessage(err.message || 'Błąd dodawania opinii');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNoteClick = (note: string) => {
    if (!perfume) return;
    const genderPath = perfume.gender.toLowerCase() === 'unisex' ? 'unisex' :
      perfume.gender.toLowerCase() === 'female' ? 'female' : 'male';
    navigate(`/${genderPath}?note=${encodeURIComponent(note)}`);
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="text-center py-5">
          <Spinner animation="border" variant="dark" />
        </div>
      </PageWrapper>
    );
  }

  if (error || !perfume) {
    return (
      <PageWrapper>
        <Container className="py-5 text-center">
          <p className="text-danger">{error || 'Nie znaleziono perfum'}</p>
        </Container>
      </PageWrapper>
    );
  }

  const ingredientsList = perfume.ingredients?.split(',').map(i => i.trim()) || [];
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <PageWrapper>
      <Container className="py-5">
        {message && <div className="alert alert-info">{message}</div>}

        <Row className="mb-5">
          {/* Image Section */}
          <Col md={4} className="mb-4 mb-md-0">
            <div className="bg-white p-4 border text-center">
              {perfume.imageUrl ? (
                <img src={perfume.imageUrl} alt={perfume.name} className="img-fluid" style={{ maxHeight: 400 }} />
              ) : (
                <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: 300 }}>
                  <span className="text-muted">Brak zdjęcia</span>
                </div>
              )}
            </div>
          </Col>

          {/* Details Section */}
          <Col md={8}>
            <div className="ps-md-4">
              <Link to={`/brand/${encodeURIComponent(perfume.brand)}`} className="text-muted text-uppercase small ls-1 text-decoration-none">
                {perfume.brand}
              </Link>
              <h1 className="display-5 fw-bold mb-3" style={{ fontFamily: 'var(--font-serif)' }}>{perfume.name}</h1>

              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="d-flex align-items-center text-star-gold">
                  <span className="fs-5 me-2">★ {avgRating}</span>
                  <span className="text-muted small">({reviews.length} ocen)</span>
                </div>
                <div className="vr"></div>
                <span className="text-uppercase small">{perfume.gender}</span>
                <div className="vr"></div>
                <span className="text-uppercase small">{perfume.family}</span>
              </div>

              <p className="lead text-secondary mb-4" style={{ fontSize: '1rem', lineHeight: 1.8 }}>
                {perfume.description || "Brak opisu."}
              </p>

              <div className="mb-4">
                <h6 className="text-uppercase small fw-bold mb-3 text-muted">Nuty zapachowe</h6>
                <div className="d-flex flex-wrap gap-2">
                  {ingredientsList.map((note, idx) => (
                    <Button key={idx} variant="outline-secondary" size="sm" className="rounded-pill" onClick={() => handleNoteClick(note)}>
                      {note}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="d-flex gap-3 mt-5 border-top pt-4">
                {isAuthenticated && (
                  <>
                    <Button
                      onClick={handleAddToWishlist}
                      className="rounded-pill px-4 py-2"
                      style={{
                        backgroundColor: user?.wishlistPerfumes?.some(p => p.id === perfume.id) ? 'var(--color-star-gold)' : 'var(--color-noir)',
                        border: 'none',
                        color: 'white'
                      }}
                    >
                      {user?.wishlistPerfumes?.some(p => p.id === perfume.id) ? '✓ Na liście' : '+ Dodaj do Wishlisty'}
                    </Button>
                    <Button
                      onClick={handleAddToOwned}
                      className="rounded-pill px-4 py-2"
                      style={{
                        backgroundColor: user?.ownedPerfumes?.some(p => p.id === perfume.id) ? 'var(--color-star-gold)' : 'var(--color-noir)',
                        border: 'none',
                        color: 'white'
                      }}
                    >
                      {user?.ownedPerfumes?.some(p => p.id === perfume.id) ? '✓ W kolekcji' : '+ Dodaj do Kolekcji'}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Col>
        </Row>

        {/* Reviews Section */}
        <div id="reviews" className="mt-5 pt-5 border-top" style={{ backgroundColor: 'var(--color-cream)', padding: '3rem 2rem', borderRadius: '4px' }}>
          <h3 className="mb-4" style={{ fontFamily: 'var(--font-serif)' }}>Opinie użytkowników</h3>

          {/* Add Review */}
          {isAuthenticated ? (
            <div className="bg-light p-4 mb-5 border">
              <h5 className="mb-3">Dodaj swoją opinię</h5>
              <div className="mb-3">
                <StarRating rating={reviewRating} onRatingChange={setReviewRating} size={24} />
              </div>
              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Napisz recenzję..."
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  className="rounded-0"
                />
              </Form.Group>
              <Button onClick={handleSubmitReview} disabled={submitting || !reviewText.trim()} className="btn-dark rounded-0">
                Opublikuj recenzję
              </Button>
            </div>
          ) : (
            <div className="alert alert-secondary text-center mb-5">
              <Link to="/login" className="fw-bold text-dark">Zaloguj się</Link>, aby dodać recenzję.
            </div>
          )}

          {/* Review List */}
          <div className="d-flex flex-column gap-4">
            {reviews.length > 0 ? reviews.map(review => (
              <ReviewItem key={review.id} review={review} onRefresh={fetchData} />
            )) : (
              <p className="text-center text-muted py-5">Brak recenzji dla tego produktu.</p>
            )}
          </div>
        </div>

      </Container>
    </PageWrapper>
  );
}