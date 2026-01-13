import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { reviewApi, commentApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Review } from '../types/types';
import StarRating from './StarRating';
import { Link } from 'react-router-dom';

interface ReviewItemProps {
    review: Review;
    onRefresh: () => void;
    variant?: 'product' | 'feed';
}

export default function ReviewItem({ review, onRefresh, variant = 'product' }: ReviewItemProps) {
    const { user } = useAuth();
    const [liked, setLiked] = useState(review.likes?.some(L => L.id === user?.id) || false);
    const [likesCount, setLikesCount] = useState(review.likesCount || 0);

    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);

    // Like handler
    const handleToggleLike = async () => {
        if (!user) return;
        // Optimistic update
        const isNowLiked = !liked;
        setLiked(isNowLiked);
        setLikesCount(prev => isNowLiked ? prev + 1 : prev - 1);

        try {
            await reviewApi.toggleLike(review.id, user.id);
            onRefresh(); // Refresh to sync perfect state
        } catch (err) {
            console.error(err);
            // Revert on error
            setLiked(!isNowLiked);
            setLikesCount(prev => !isNowLiked ? prev + 1 : prev - 1);
        }
    };

    // Comment handlers
    const handleAddComment = async () => {
        if (!user || !commentText.trim()) return;
        setSubmittingComment(true);
        try {
            await commentApi.create({
                reviewId: review.id,
                userId: user.id,
                text: commentText
            });
            setCommentText('');
            onRefresh();
        } catch (err) {
            console.error(err);
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleDeleteReview = async () => {
        if (window.confirm('Czy na pewno chcesz usunąć tę recenzję?')) {
            try {
                await reviewApi.delete(review.id);
                onRefresh();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        if (window.confirm('Usunąć komentarz?')) {
            try {
                await commentApi.delete(commentId);
                onRefresh();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const comments = review.comments || [];
    const dateStr = review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'niedawno';

    // FILMWEB STYLE FEED ITEM
    if (variant === 'feed') {
        return (
            <div className="bg-white p-4 card-premium mb-4">
                {/* Header: Avatar, Name, Date */}
                <div className="d-flex align-items-center mb-3">
                    <Link to={`/profile/${review.author.id}`} className="text-decoration-none text-dark d-flex align-items-center">
                        <div
                            className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center me-3"
                            style={{ width: 40, height: 40, fontFamily: 'var(--font-serif)' }}
                        >
                            {review.author.username.charAt(0).toUpperCase()}
                        </div>
                    </Link>
                    <div>
                        <Link to={`/profile/${review.author.id}`} className="fw-bold text-dark text-decoration-none">
                            {review.author.username}
                        </Link>
                        <div className="text-muted small">{dateStr}</div>
                    </div>
                </div>

                {/* Content: Poster + Info */}
                <div className="d-flex gap-3 mb-3">
                    {/* Poster */}
                    <Link to={`/product/${review.subject?.id}`} className="flex-shrink-0 d-block border" style={{ width: '100px', height: '140px', background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                        {review.subject?.imageUrl ? (
                            <img src={review.subject.imageUrl} alt={review.subject.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        ) : (
                            <div className="text-center text-muted p-2" style={{ border: '1px dashed #ddd', width: '90%', height: '90%' }}>
                                <small style={{ fontSize: '0.6rem' }}>NO IMAGE</small>
                            </div>
                        )}
                    </Link>

                    {/* Info */}
                    <div className="d-flex flex-column" style={{ minWidth: 0 }}>
                        <Link to={`/product/${review.subject?.id}`} className="text-dark fw-bold text-decoration-none mb-1 fs-5 text-truncate d-block" style={{ fontFamily: 'var(--font-serif)' }}>
                            {review.subject?.name || "Nieznany zapach"}
                        </Link>
                        <div className="text-secondary small mb-2 fw-bold text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>
                            {review.subject?.brand || "Marka nieznana"} <span className="text-muted fw-normal text-capitalize mx-1">·</span> {review.subject?.family}
                        </div>

                        <p className="mb-2 fst-italic text-muted small" style={{ lineClamp: 3, overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3 }}>
                            "{review.text}"
                        </p>
                    </div>
                </div>

                {/* Footer: Rating, Actions */}
                <div className="d-flex align-items-center gap-3 pt-2 border-top">
                    {/* Rating */}
                    <div className="d-flex align-items-center gap-1">
                        <span className="fw-bold fs-5">{review.rating}</span>
                        <StarRating rating={review.rating} readOnly size={16} />
                    </div>

                    <div className="vr mx-2"></div>

                    {/* Like */}
                    <button
                        onClick={handleToggleLike}
                        className={`btn btn-sm d-flex align-items-center gap-1 ${liked ? 'text-gold' : 'text-muted'}`}
                        style={{ border: 'none', background: 'transparent' }}
                    >
                        <span>{liked ? 'Lubię to!' : 'Lubię to!'}</span>
                        <span>👍</span>
                        {likesCount > 0 && <span className="fw-bold ms-1">{likesCount}</span>}
                    </button>

                    {/* Comment Icon */}
                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="btn btn-sm text-muted"
                        style={{ border: 'none', background: 'transparent' }}
                    >
                        💬 {comments.length}
                    </button>

                    {user?.role === 'ADMIN' && (
                        <button onClick={handleDeleteReview} className="ms-auto btn btn-link text-danger p-0" title="Usuń recenzję (Admin)">
                            🗑️
                        </button>
                    )}
                </div>

                {/* Comments Section */}
                {showComments && (
                    <div className="mt-3 bg-light p-3">
                        {comments.map(c => (
                            <div key={c.id} className="mb-2 d-flex justify-content-between align-items-start border-bottom pb-2">
                                <div>
                                    <span className="fw-bold small me-2">{c.author.username}:</span>
                                    <span className="small text-muted">{c.text}</span>
                                </div>
                                {user?.role === 'ADMIN' && (
                                    <button onClick={() => handleDeleteComment(c.id)} className="btn btn-sm text-danger p-0 ms-2">✕</button>
                                )}
                            </div>
                        ))}

                        {user && (
                            <div className="mt-2 d-flex gap-2">
                                <Form.Control
                                    size="sm"
                                    placeholder="Skomentuj..."
                                    value={commentText}
                                    onChange={e => setCommentText(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleAddComment()}
                                    className="rounded-0"
                                />
                                <Button size="sm" className="btn-dark rounded-0" disabled={submittingComment || !commentText.trim()} onClick={handleAddComment}>
                                    ➤
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    // PRODUCT PAGE STYLE
    return (
        <div className="bg-light p-4 border-bottom rounded-0 position-relative">
            <div className="d-flex justify-content-between align-items-start mb-2">
                <div className="d-flex align-items-center gap-2">
                    <Link to={`/profile/${review.author.id}`} className="text-decoration-none">
                        <div className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: 32, height: 32 }}>
                            {review.author.username.charAt(0).toUpperCase()}
                        </div>
                    </Link>
                    <div>
                        <Link to={`/profile/${review.author.id}`} className="fw-bold fs-6 text-dark text-decoration-none">
                            {review.author.username}
                        </Link>
                        <div className="text-muted" style={{ fontSize: '0.7rem' }}>{dateStr}</div>
                    </div>
                </div>
                <div className="d-flex align-items-center gap-1 bg-white px-2 py-1 border">
                    <span className="fw-bold text-dark">{review.rating}</span>
                    <span className="text-star-gold">★</span>
                </div>
            </div>

            <p className="mb-3 text-secondary" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                {review.text}
            </p>

            {/* Actions */}
            <div className="d-flex align-items-center gap-3">
                <button
                    onClick={handleToggleLike}
                    className={`btn btn-link p-0 text-decoration-none small ${liked ? 'text-gold fw-bold' : 'text-muted'}`}
                >
                    ♥ {liked ? 'Lubisz to' : 'Polub'} ({likesCount})
                </button>
                <button
                    onClick={() => setShowComments(!showComments)}
                    className="btn btn-link p-0 text-decoration-none small text-muted"
                >
                    💬 Komentarze ({comments.length})
                </button>
            </div>

            {/* Comments List */}
            {(showComments || comments.length > 0) && (
                <div className={`mt-3 ps-3 border-start ${!showComments ? 'd-none' : ''}`}>
                    {comments.map((comment) => (
                        <div key={comment.id} className="mb-2">
                            <span className="fw-bold small">{comment.author.username}</span>
                            <span className="mx-1 text-muted small">·</span>
                            <span className="small text-muted">{comment.text}</span>
                            {user?.role === 'ADMIN' && (
                                <button onClick={() => handleDeleteComment(comment.id)} className="btn btn-link text-danger p-0 ms-2" style={{ fontSize: '0.7rem' }}>usuń</button>
                            )}
                        </div>
                    ))}

                    {/* Add Comment */}
                    {user && (
                        <div className="mt-3 d-flex gap-2">
                            <Form.Control
                                type="text"
                                placeholder="Napisz komentarz..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                className="form-control-sm rounded-0 bg-white"
                                style={{ border: '1px solid #ddd' }}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                            />
                            <Button
                                size="sm"
                                disabled={submittingComment || !commentText.trim()}
                                onClick={handleAddComment}
                                className="btn-dark rounded-0 px-3"
                            >
                                Dodaj
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {user?.role === 'ADMIN' && (
                <button
                    onClick={handleDeleteReview}
                    className="position-absolute top-0 end-0 mt-2 me-2 btn btn-link text-secondary p-0"
                    title="Usuń (Admin)"
                >
                    🗑️
                </button>
            )}
        </div>
    );
}
