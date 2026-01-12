import React, { useState } from 'react';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// 1. DANE MOCKUP
const activities = [
    {
        id: 1,
        user: "KACPER ŁABĘCKI",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
        time: "12H TEMU",
        perfume: {
            brand: "ARMANI",
            name: "CODE",
            image: "https://www.sephora.pl/on/demandware.static/-/Sites-sephora-master-catalog/default/dw66d21696/images/hi-res/SKU/SKU_4/263546_swatch.jpg",
            rating: 4
        },
        review: "Naprawdę solidny zapach na wieczorne wyjścia. Trwałość mogłaby być lepsza, ale kompozycja nadrabia.",
        likes: 1,
        comments: 0
    },
    {
        id: 2,
        user: "JULIA NOWAK",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        time: "2H TEMU",
        perfume: {
            brand: "YSL",
            name: "LIBRE",
            image: "https://www.sephora.pl/on/demandware.static/-/Sites-sephora-master-catalog/default/dw1e96720f/images/hi-res/SKU/SKU_5/385558_swatch.jpg",
            rating: 5
        },
        review: "Mój absolutny faworyt tego sezonu! Kwiatowa eksplozja wolności.",
        likes: 12,
        comments: 3
    }
];

const suggestions = [
    { name: "Jan Tracz", avatar: "https://i.pravatar.cc/150?u=a04258a2462d826712d" },
    { name: "Anna Kowalska", avatar: "https://i.pravatar.cc/150?u=4442581f4e29026704d" },
    { name: "Piotr Zieliński", avatar: "https://i.pravatar.cc/150?u=1142581f4e29026704d" }
];

import DoubleNavbar from '../components/DoubleNavbar';

// 2. COMPONENT FOR ACTIVITY POST
const ActivityPost = ({ post }: { post: any }) => {
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(post.likes);

    const handleLike = () => {
        if (liked) {
            setLikesCount(likesCount - 1);
        } else {
            setLikesCount(likesCount + 1);
        }
        setLiked(!liked);
    };

    return (
        <div className="mb-5 bg-white p-4 shadow-sm border border-light position-relative custom-card">
            {/* Header */}
            <div className="d-flex align-items-center mb-3">
                <div className="rounded-circle border border-dark p-1 me-2" style={{ width: 45, height: 45 }}>
                    <Image src={post.avatar} roundedCircle fluid />
                </div>
                <div>
                    <div className="fw-bold text-uppercase small" style={{ letterSpacing: '1.5px' }}>{post.user}</div>
                    <div className="text-muted small" style={{ fontSize: '0.7em' }}>{post.time}</div>
                </div>
            </div>

            {/* Content - Perfume Card */}
            <div className="p-3 mb-3" style={{ background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)', border: '1px solid #e0e0e0' }}>
                <div className="d-flex align-items-start">
                    <div className="me-3 p-2" style={{ background: '#fff', border: '1px solid #ddd', width: '75px', minWidth: '75px' }}>
                        <Image src={post.perfume.image} fluid />
                    </div>
                    <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div>
                                <span className="fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>{post.perfume.name}</span>
                                <span className="text-muted ms-2 small" style={{ fontStyle: 'italic' }}>{post.perfume.brand}</span>
                            </div>
                            <div className="d-flex align-items-center justify-content-center fw-bold text-dark" style={{ width: 32, height: 32, border: '2px solid #333', fontSize: '0.85rem' }}>
                                {post.perfume.rating}
                            </div>
                        </div>
                        <div className="text-muted" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '0.9rem', lineHeight: '1.5' }}>
                            „{post.review}"
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer - Interactions */}
            <div className="border-top border-light-subtle pt-2 d-flex gap-3 text-secondary">
                <span
                    className="d-flex align-items-center gap-1 cursor-pointer hover-dark"
                    onClick={handleLike}
                    style={{ cursor: 'pointer', transition: 'color 0.2s', color: liked ? '#dc3545' : 'inherit' }}
                >
                    <span style={{ fontSize: '1.2rem' }}>{liked ? '♥' : '♡'}</span>
                    <span className="fw-bold small">{likesCount}</span>
                </span>
            </div>
        </div>
    );
};

// 3. FRIENDS PAGE
export default function FriendsPage() {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', color: '#212529', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>

            {/* BACKGROUND */}
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0,
                backgroundImage: 'url("https://images.unsplash.com/photo-1596367407072-6782110e5b49?q=80&w=2670&auto=format&fit=crop")',
                backgroundSize: 'cover', backgroundPosition: 'center',
                filter: 'brightness(1.1) grayscale(20%) opacity(0.5)', transform: 'scale(1.1)'
            }}></div>

            <div style={{ position: 'relative', zIndex: 1 }}>
                <DoubleNavbar />

                <Container className="mt-5 mb-5">
                    {/* GLASS CONTAINER */}
                    <div className="p-4" style={{
                        background: 'rgba(255,255,255,0.6)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                        border: '1px solid rgba(255,255,255,0.8)'
                    }}>
                        <Row className="g-5">

                            {/* LEFT COLUMN: ACTIVITY FEED */}
                            <Col md={7} className="border-end border-dark-subtle pe-md-5">
                                <h2 className="fw-bold mb-4" style={{ fontFamily: 'Georgia, serif', letterSpacing: '1px' }}>Aktywność Znajomych</h2>

                                {activities.map(post => (
                                    <ActivityPost key={post.id} post={post} />
                                ))}
                            </Col>

                            {/* RIGHT COLUMN: SUGGESTIONS */}
                            <Col md={5} className="ps-md-4">
                                <div className="border border-dark p-3 sticky-top" style={{ top: '120px', backgroundColor: 'rgba(255,255,255,0.8)' }}>
                                    <div className="border-bottom border-dark mb-3 pb-2">
                                        <h4 className="fw-bold mb-0" style={{ fontFamily: 'Georgia, serif', letterSpacing: '1px' }}>Sugestie</h4>
                                    </div>

                                    <div className="d-flex flex-column gap-3">
                                        {suggestions.map((user, idx) => (
                                            <div key={idx} className="d-flex align-items-center justify-content-between">
                                                <div className="d-flex align-items-center">
                                                    <div className="rounded-circle bg-secondary me-2 overflow-hidden" style={{ width: 40, height: 40 }}>
                                                        <Image src={user.avatar} fluid />
                                                    </div>
                                                    <span className="fw-bold small text-uppercase" style={{ letterSpacing: '1px' }}>{user.name}</span>
                                                </div>
                                                <Button variant="outline-dark" size="sm" className="rounded-0 small py-0 px-2">+</Button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-center mt-3 small text-muted">. . .</div>
                                </div>
                            </Col>

                        </Row>
                    </div>
                </Container>

                {/* FOOTER */}
                <footer className="text-center py-5 mt-auto" style={{ background: 'rgba(255,255,255,0.8)', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                    <p className="mb-1 fw-bold text-uppercase spacing-2 small">Perforum © 2026</p>
                    <small className="text-muted text-uppercase" style={{ fontSize: '0.7rem' }}>Maciej Mikołajek & Mateusz Wróbel</small>
                </footer>

                <style>
                    {`
            .spacing-2 { letter-spacing: 2px; }
            .font-serif { fontFamily: Georgia, serif; }
            .cursor-pointer { cursor: pointer; }
            .hover-dark:hover { color: #000 !important; }
            .custom-card { transition: transform 0.2s; }
            .custom-card:hover { transform: translateY(-2px); }
          `}
                </style>
            </div>
        </div>
    );
}
