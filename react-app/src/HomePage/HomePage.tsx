import React from 'react';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// 1. DANE MOCKUP
const recommendations = [
    { id: 1, brand: "DIOR", name: "HOMME", image: "https://rd-prod-data.sephora.pl/dw/image/v2/BDOI_PRD/on/demandware.static/-/Sites-sephora-master-catalog/default/dw15197e88/images/hi-res/SKU/SKU_7/598000_swatch.jpg" },
    { id: 2, brand: "CHANEL", name: "BLEU DE CHANEL", image: "https://www.sephora.pl/on/demandware.static/-/Sites-sephora-master-catalog/default/dw83748259/images/hi-res/SKU/SKU_6/397148_swatch.jpg" },
    { id: 3, brand: "VERSACE", name: "EROS", image: "https://www.sephora.pl/on/demandware.static/-/Sites-sephora-master-catalog/default/dwb5003c40/images/hi-res/SKU/SKU_1/253457_swatch.jpg" },
    { id: 4, brand: "YSL", name: "LA NUIT DE L'HOMME", image: "https://www.sephora.pl/on/demandware.static/-/Sites-sephora-master-catalog/default/dw9e144709/images/hi-res/SKU/SKU_6/396655_swatch.jpg" }
];

const newReviews = [
    { perfume: "Sauvage Elixir", user: "Marek", rating: 5 },
    { perfume: "Le Male Le Parfum", user: "Kasia", rating: 4 },
    { perfume: "Aventus", user: "Tomek", rating: 5 },
    { perfume: "Baccarat Rouge 540", user: "Anna", rating: 3 }
];

import DoubleNavbar from '../components/DoubleNavbar';

// 3. HOME PAGE
export default function HomePage() {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', color: '#212529', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>

            {/* TŁO (Shared with ProductPage for consistency) */}
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0,
                backgroundImage: 'url("https://images.unsplash.com/photo-1596367407072-6782110e5b49?q=80&w=2670&auto=format&fit=crop")',
                backgroundSize: 'cover', backgroundPosition: 'center',
                filter: 'brightness(1.1) grayscale(20%) opacity(0.5)', transform: 'scale(1.1)'
            }}></div>

            <div style={{ position: 'relative', zIndex: 1 }}>
                <DoubleNavbar />

                <Container className="mt-5 mb-5">
                    {/* Main Glass Container */}
                    <div className="p-4" style={{
                        background: 'rgba(255,255,255,0.6)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                        border: '1px solid rgba(255,255,255,0.8)'
                    }}>
                        <Row className="g-5">

                            {/* LEFT COLUMN (MAIN CONTENT) */}
                            <Col md={8} className="border-end border-dark-subtle pe-md-5">

                                {/* SPONSORED ARTICLE */}
                                <div className="mb-5 pb-5 border-bottom border-dark-subtle">
                                    <span className="text-uppercase tracking-widest text-muted small mb-2 d-block" style={{ letterSpacing: '2px' }}>Sponsorowany Artykuł</span>
                                    <Row className="align-items-center">
                                        <Col xs={4}>
                                            <div className="bg-white p-2 shadow-sm border border-light" style={{ transform: 'rotate(-2deg)' }}>
                                                <Image src="https://www.sephora.pl/on/demandware.static/-/Sites-sephora-master-catalog/default/dw83748259/images/hi-res/SKU/SKU_6/397148_swatch.jpg" fluid />
                                            </div>
                                        </Col>
                                        <Col xs={8} className="ps-4">
                                            <h2 className="display-6 fw-bold mb-3" style={{ fontFamily: 'Georgia, serif' }}>Nowość Od Paco Rabanne</h2>
                                            <p className="text-secondary mb-4 leading-relaxed">
                                                Odkryj zapach, który redefiniuje męskość. Zmysłowa kompozycja nut drzewnych i przyprawowych, stworzona dla współczesnego gentelmana. Elegancja zamknięta w złotej sztabce.
                                            </p>
                                            <Button variant="dark" className="rounded-0 px-4 py-2 text-uppercase spacing-2" style={{ fontSize: '0.8rem' }}>Czytaj dalej</Button>
                                        </Col>
                                    </Row>
                                </div>

                                {/* RECOMMENDATIONS */}
                                <div>
                                    <div className="d-flex align-items-center mb-4">
                                        <h4 className="mb-0 fw-bold text-uppercase spacing-2" style={{ fontSize: '1rem' }}>Rekomendacje dla Ciebie</h4>
                                        <div className="flex-grow-1 ms-3 border-top border-dark-subtle"></div>
                                    </div>

                                    <Row className="g-4">
                                        {recommendations.map((item) => (
                                            <Col xs={6} md={3} key={item.id}>
                                                <div className="h-100 text-center group cursor-pointer">
                                                    <div className="mb-3 position-relative bg-white p-3 shadow-sm border-light transition-transform" style={{ transition: 'transform 0.3s' }}>
                                                        <Image src={item.image} fluid style={{ mixBlendMode: 'multiply' }} />
                                                    </div>
                                                    <div className="fw-bold small text-uppercase tracking-widest mb-1" style={{ fontSize: '0.7rem' }}>{item.brand}</div>
                                                    <div className="small text-muted font-serif fst-italic">{item.name}</div>
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>

                            </Col>

                            {/* RIGHT COLUMN (SIDEBAR) */}
                            <Col md={4} className="ps-md-4">

                                {/* STATS BOX */}
                                <div className="bg-dark text-white p-4 text-center mb-5" style={{ boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
                                    <h2 className="display-4 fw-bold mb-0">250</h2>
                                    <p className="text-uppercase tracking-widest small opacity-75 mb-3">Zrecenzowanych perfum</p>
                                    <div className="border-top border-white opacity-25 w-50 mx-auto mb-3"></div>
                                    <span className="fst-italic font-serif">~ Nowe Recenzje ~</span>
                                </div>

                                {/* NEW REVIEWS FEED */}
                                <div className="position-relative">
                                    <h5 className="mb-4 fw-bold text-uppercase spacing-2 small text-muted">Ostatnia aktywność</h5>
                                    {newReviews.map((review, idx) => (
                                        <div key={idx} className="mb-4 pb-3 border-bottom border-light-subtle d-flex align-items-start">
                                            <div className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center me-3 flex-shrink-0" style={{ width: '40px', height: '40px', fontSize: '0.9rem' }}>
                                                {review.user.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="fw-bold small text-uppercase mb-1">{review.perfume}</div>
                                                <div className="text-muted small fst-italic mb-1">"Absolutnie niesamowity..."</div>
                                                <div className="d-flex align-items-center">
                                                    <div className="text-warning small me-2">{"★".repeat(review.rating)}</div>
                                                    <small className="text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>przez {review.user}</small>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
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
            .tracking-widest { letter-spacing: 3px; }
            .cursor-pointer { cursor: pointer; }
            .transition-transform:hover { transform: translateY(-5px); }
          `}
                </style>
            </div>
        </div>
    );
}
