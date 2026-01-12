import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import DoubleNavbar from '../components/DoubleNavbar';

// Mock Data
const user = {
    name: "Maciej Narewisko",
    friendsCount: 40,
    avatar: "https://i.pravatar.cc/150?u=maciej" // Placeholder avatar
};

const perfumes = [
    { id: 1, name: "Opus 1144", brand: "Filippo Sorcinelli", image: "https://via.placeholder.com/150", rating: 5 },
    { id: 2, name: "Baccarat Rouge 540", brand: "Maison Francis Kurkdjian", image: "https://via.placeholder.com/150", rating: 4 },
    { id: 3, name: "Aventus", brand: "Creed", image: "https://via.placeholder.com/150", rating: 5 },
    { id: 4, name: "Tobacco Vanille", brand: "Tom Ford", image: "https://via.placeholder.com/150", rating: 5 },
    { id: 5, name: "Santal 33", brand: "Le Labo", image: "https://via.placeholder.com/150", rating: 3 },
];

const Section = ({ title, items, scrollId }) => (
    <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3 border-bottom border-dark pb-2">
            <h4 className="fw-bold text-uppercase m-0" style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem' }}>{title}</h4>
        </div>

        <div className="d-flex overflow-auto pb-3 gap-3" style={{ scrollbarWidth: 'thin' }}>
            {items.map((item, idx) => (
                <div key={idx} style={{ minWidth: '180px', width: '180px' }}>
                    <div className="border border-secondary p-3 bg-white h-100 d-flex flex-column align-items-center justify-content-center text-center">
                        <div style={{ height: '120px', width: '100%', backgroundColor: '#f0f0f0', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {/* Using placeholder for now, would be perfume image */}
                            <span className="text-muted small">IMG</span>
                        </div>
                        <h6 className="fw-bold mb-1 small">{item.name}</h6>
                        <small className="text-muted d-block mb-2" style={{ fontSize: '0.7rem' }}>{item.brand}</small>
                        {item.rating && <div className="text-warning small">{"★".repeat(item.rating)}</div>}
                    </div>
                </div>
            ))}
            {/* "See all" placeholder card */}
            <div style={{ minWidth: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Button variant="outline-dark" className="rounded-circle" style={{ width: 40, height: 40, padding: 0 }}>&gt;</Button>
            </div>
        </div>
    </div>
);

export default function ProfilePage() {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', color: '#212529', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>

            {/* BACKGROUND (Consistent) */}
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0,
                backgroundImage: 'url("https://images.unsplash.com/photo-1596367407072-6782110e5b49?q=80&w=2670&auto=format&fit=crop")',
                backgroundSize: 'cover', backgroundPosition: 'center',
                filter: 'brightness(1.1) grayscale(20%) opacity(0.5)', transform: 'scale(1.1)'
            }}></div>

            <div style={{ position: 'relative', zIndex: 1 }}>
                <DoubleNavbar />

                <Container className="mt-5 mb-5">
                    {/* Glass Container */}
                    <div className="p-4 p-md-5" style={{
                        background: 'rgba(255,255,255,0.6)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                        border: '1px solid rgba(255,255,255,0.8)'
                    }}>

                        {/* Header Section */}
                        <div className="d-flex align-items-center mb-5 border border-dark p-4 bg-white bg-opacity-50">
                            <div className="rounded-circle border border-dark me-4 overflow-hidden" style={{ width: 100, height: 100 }}>
                                <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div>
                                <h1 className="fw-bold mb-1" style={{ fontFamily: 'Georgia, serif' }}>{user.name}</h1>
                                <p className="text-uppercase text-muted border border-dark px-2 py-1 d-inline-block small fw-bold mb-0">{user.friendsCount} znajomych</p>
                            </div>
                        </div>

                        {/* Sections */}
                        <Section title="Ostatnio Ocenione" items={perfumes} scrollId="recent" />
                        <Section title="Ulubione" items={perfumes.slice(0, 3)} scrollId="favorites" />
                        <Section title="Wishlist" items={perfumes.slice(2, 5)} scrollId="wishlist" />

                    </div>
                </Container>

                {/* Footer */}
                <footer className="text-center py-5 mt-auto" style={{ background: 'rgba(255,255,255,0.8)', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                    <p className="mb-1 fw-bold text-uppercase spacing-2 small">Perforum © 2026</p>
                </footer>
            </div>
        </div>
    );
}
