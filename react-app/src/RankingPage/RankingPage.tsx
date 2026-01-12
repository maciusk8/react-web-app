import React, { useState } from 'react';
import { Container, Row, Col, Nav, Tab, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DoubleNavbar from '../components/DoubleNavbar';

const menRankings = [
    { rank: 1, name: "Aventus", brand: "Creed", rating: 4.9, image: "https://via.placeholder.com/100" },
    { rank: 2, name: "Sauvage Elixir", brand: "Dior", rating: 4.8, image: "https://via.placeholder.com/100" },
    { rank: 3, name: "Tobacco Vanille", brand: "Tom Ford", rating: 4.7, image: "https://via.placeholder.com/100" },
    { rank: 4, name: "Bleu de Chanel Parfum", brand: "Chanel", rating: 4.7, image: "https://via.placeholder.com/100" },
    { rank: 5, name: "Oud Wood", brand: "Tom Ford", rating: 4.6, image: "https://via.placeholder.com/100" },
];

const womenRankings = [
    { rank: 1, name: "Baccarat Rouge 540", brand: "Maison Francis Kurkdjian", rating: 4.9, image: "https://via.placeholder.com/100" },
    { rank: 2, name: "Black Orchid", brand: "Tom Ford", rating: 4.8, image: "https://via.placeholder.com/100" },
    { rank: 3, name: "Libre Intense", brand: "Yves Saint Laurent", rating: 4.7, image: "https://via.placeholder.com/100" },
    { rank: 4, name: "Delina", brand: "Parfums de Marly", rating: 4.7, image: "https://via.placeholder.com/100" },
    { rank: 5, name: "Good Girl", brand: "Carolina Herrera", rating: 4.6, image: "https://via.placeholder.com/100" },
];

const RankingList = ({ items }) => (
    <div className="d-flex flex-column gap-3">
        {items.map((item) => (
            <div key={item.rank} className="d-flex align-items-center p-3 border-bottom border-light-subtle bg-white bg-opacity-50 position-relative custom-hover-card" style={{ transition: 'all 0.2s' }}>
                <Link to="/product" className="stretched-link" aria-label={`View ${item.name}`} />

                {/* Rank Number */}
                <div className="me-4 text-center" style={{ minWidth: '40px' }}>
                    <h2 className="fw-bold m-0 text-dark opacity-50 fst-italic" style={{ fontFamily: 'Georgia, serif' }}>#{item.rank}</h2>
                </div>

                {/* Image */}
                <div className="me-4 bg-light d-flex align-items-center justify-content-center" style={{ width: 80, height: 80 }}>
                    {/* Placeholder image */}
                    <span className="text-muted small">IMG</span>
                </div>

                {/* Details */}
                <div className="flex-grow-1">
                    <h5 className="fw-bold mb-1">{item.name}</h5>
                    <p className="text-uppercase text-muted small mb-0 spacing-2" style={{ letterSpacing: '1px' }}>{item.brand}</p>
                </div>

                {/* Rating */}
                <div className="text-end">
                    <div className="text-warning small mb-1">{"★".repeat(Math.round(item.rating))}</div>
                    <small className="fw-bold">{item.rating}</small>
                </div>
            </div>
        ))}
    </div>
);

export default function RankingPage() {
    const [activeTab, setActiveTab] = useState('men');

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

                        <div className="text-center mb-5">
                            <h1 className="display-4 fw-bold mb-3" style={{ fontFamily: 'Georgia, serif' }}>Rankingi Perfum</h1>
                            <p className="lead text-muted fst-italic">Najpopularniejsze zapachy wybrane przez naszą społeczność.</p>
                        </div>

                        {/* Tabs */}
                        <div className="d-flex justify-content-center mb-5">
                            <div className="border border-dark d-inline-flex">
                                <Button
                                    variant="link"
                                    className={`text-decoration-none text-uppercase fw-bold px-4 py-2 rounded-0 fs-6 ${activeTab === 'men' ? 'bg-dark text-white' : 'text-dark hover-bg-light'}`}
                                    onClick={() => setActiveTab('men')}
                                >
                                    Mężczyzna
                                </Button>
                                <Button
                                    variant="link"
                                    className={`text-decoration-none text-uppercase fw-bold px-4 py-2 rounded-0 fs-6 ${activeTab === 'women' ? 'bg-dark text-white' : 'text-dark'}`}
                                    onClick={() => setActiveTab('women')}
                                >
                                    Kobieta
                                </Button>
                            </div>
                        </div>

                        {/* Content */}
                        <Row className="justify-content-center">
                            <Col lg={8}>
                                {activeTab === 'men' ? <RankingList items={menRankings} /> : <RankingList items={womenRankings} />}
                            </Col>
                        </Row>

                    </div>
                </Container>

                {/* Footer */}
                <footer className="text-center py-5 mt-auto" style={{ background: 'rgba(255,255,255,0.8)', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                    <p className="mb-1 fw-bold text-uppercase spacing-2 small">Perforum © 2026</p>
                </footer>
            </div>
            <style>
                {`
                    .custom-hover-card:hover {
                        background-color: rgba(255,255,255,0.9) !important;
                        transform: translateY(-2px);
                        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
                    }
                `}
            </style>
        </div>
    );
}
