import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Image, Stack, Spinner, Offcanvas } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// 1. DANE (Mockup opinii)
const reviewsData = [
  { user: "Anna M.", rating: 5, text: "Zapach absolutnie obłędny. Czuć gotycki chłód kościoła, ale przełamany ciepłą wanilią. Trwałość 12h+.", date: "2 dni temu" },
  { user: "Piotr K.", rating: 4, text: "Bardzo specyficzny, nie dla każdego. Otwarcie jest trudne, ale po godzinie dzieje się magia.", date: "Tydzień temu" },
  { user: "Ewelina Z.", rating: 5, text: "Mój signature scent na jesień. Butelka to dzieło sztuki.", date: "Miesiąc temu" }
];

const perfumeData = {
  brand: "Filippo Sorcinelli",
  name_perfume: "Opus 1144",
  family: "WOODY",
  subfamily: "AMBER (ORIENTAL)",
  origin: "Italy",
  gender: "Unisex",
  years: "2015",
  description: "Inspired by Gothicism (circa 1144), Opus 1144 is a monument of intricate purity.",
  ingredients: ["Cashmeran", "Benzoin", "Sandalwood", "Amber", "Elemi", "Iris / Orris", "Orchid", "Vanilla", "Jasmine", "Leather", "Lemon", "Musk"]
};

import DoubleNavbar from '../components/DoubleNavbar';

// 3. NOWY KOMPONENT: SEKCJA OPINII (Na dole strony)
function ReviewsSection({ onOpenSlider }) {
  return (
    <Container className="py-5 mt-5 border-top border-dark-subtle">
      <Row>
        {/* Lewa: Nagłówek i przycisk */}
        <Col md={4} className="mb-4">
          <h2 className="display-6 fw-bold mb-3" style={{ fontFamily: 'Georgia, serif' }}>Opinie społeczności</h2>
          <div className="d-flex align-items-end mb-3">
            <h1 className="display-3 fw-bold mb-0 me-3">4.8</h1>
            <span className="text-muted pb-2">/ 5.0 (128 ocen)</span>
          </div>
          <p className="text-secondary mb-4">
            Co inni sądzą o tym zapachu? Dołącz do dyskusji i podziel się swoimi wrażeniami.
          </p>
          <Button variant="dark" className="rounded-0 px-4 py-2" onClick={onOpenSlider}>
            Zobacz wszystkie opinie
          </Button>
        </Col>

        {/* Prawa: 2 Wyróżnione opinie (Teaser) */}
        <Col md={8}>
          <div className="ps-md-5">
            {reviewsData.slice(0, 2).map((review, idx) => (
              <div key={idx} className="mb-4 pb-4 border-bottom border-light-subtle">
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-bold">{review.user}</span>
                  <span className="text-muted small">{review.date}</span>
                </div>
                <div className="mb-2 text-warning">{"★".repeat(review.rating)}</div>
                <p className="fst-italic text-secondary">"{review.text}"</p>
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

// 4. NOWY KOMPONENT: SLIDE BAR (OFFCANVAS)
function ReviewsOffcanvas({ show, handleClose }) {
  return (
    <Offcanvas show={show} onHide={handleClose} placement="end" style={{ width: '400px' }}>
      <Offcanvas.Header closeButton className="border-bottom">
        <Offcanvas.Title style={{ fontFamily: 'Georgia, serif' }}>Wszystkie Opinie</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="bg-light">
        {/* Tutaj lista wszystkich komentarzy */}
        <div className="d-grid gap-3">
          <Button variant="outline-dark" className="w-100 mb-3 rounded-0">+ Dodaj własną opinię</Button>

          {reviewsData.map((review, idx) => (
            <div key={idx} className="bg-white p-3 shadow-sm border border-light">
              <div className="d-flex align-items-center mb-2">
                <div className="rounded-circle bg-secondary me-2" style={{ width: 25, height: 25 }}></div>
                <span className="fw-bold small">{review.user}</span>
                <span className="ms-auto text-muted small" style={{ fontSize: '0.7rem' }}>{review.date}</span>
              </div>
              <div className="text-warning small mb-2">{"★".repeat(review.rating)}</div>
              <p className="small text-secondary mb-0">{review.text}</p>
            </div>
          ))}
          {/* Powielone dla efektu scrollowania */}
          {reviewsData.map((review, idx) => (
            <div key={idx + 10} className="bg-white p-3 shadow-sm border border-light">
              <div className="d-flex align-items-center mb-2">
                <div className="rounded-circle bg-secondary me-2" style={{ width: 25, height: 25 }}></div>
                <span className="fw-bold small">{review.user}</span>
                <span className="ms-auto text-muted small" style={{ fontSize: '0.7rem' }}>{review.date}</span>
              </div>
              <div className="text-warning small mb-2">{"★".repeat(review.rating)}</div>
              <p className="small text-secondary mb-0">{review.text}</p>
            </div>
          ))}
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

// 5. GŁÓWNY WIDOK
export default function PerfumePage() {
  const [perfumeImage, setPerfumeImage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Stan do obsługi Slide Baru
  const [showReviews, setShowReviews] = useState(false);
  const handleCloseReviews = () => setShowReviews(false);
  const handleShowReviews = () => setShowReviews(true);

  useEffect(() => {
    fetch('https://dummyjson.com/products/category/fragrances')
      .then(res => res.json())
      .then(data => {
        if (data.products && data.products.length > 0) setPerfumeImage(data.products[0].thumbnail);
        setLoading(false);
      })
      .catch(err => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', color: '#212529', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>

      {/* TŁO */}
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0,
        backgroundImage: 'url("https://images.unsplash.com/photo-1596367407072-6782110e5b49?q=80&w=2670&auto=format&fit=crop")',
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'brightness(1.1) grayscale(20%) opacity(0.5)', transform: 'scale(1.1)'
      }}></div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <DoubleNavbar />

        {/* HERO SECTION */}
        <Container className="mt-5 pb-5">
          <Row className="align-items-center justify-content-center">
            <Col md={4} className="text-center mb-4 mb-md-0">
              <div style={{
                position: 'relative', padding: '20px', background: 'rgba(255,255,255,0.4)', borderRadius: '50%',
                display: 'inline-block', backdropFilter: 'blur(15px)', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                minHeight: '400px', minWidth: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {loading ? <Spinner animation="border" variant="dark" /> :
                  <Image src={perfumeImage || "https://via.placeholder.com/300"} fluid style={{ maxHeight: '450px', filter: 'drop-shadow(0px 15px 25px rgba(0,0,0,0.2))' }} />
                }
              </div>
            </Col>
            <Col md={7} lg={6} className="ps-md-5">
              <div className="mb-4">
                <h6 className="text-uppercase text-secondary tracking-widest mb-2" style={{ letterSpacing: '3px', fontSize: '0.8rem' }}>{perfumeData.brand}</h6>
                <h1 className="display-3 fw-bold mb-0 text-dark" style={{ fontFamily: 'Georgia, serif' }}>{perfumeData.name_perfume}</h1>
                <Stack direction="horizontal" gap={3} className="text-secondary mt-2 font-monospace small">
                  <span>{perfumeData.years}</span><div className="vr" /><span>{perfumeData.origin}</span><div className="vr" /><span>{perfumeData.family}</span>
                </Stack>
              </div>
              <p className="lead fst-italic text-dark opacity-75 mb-4" style={{ borderLeft: '3px solid #333', paddingLeft: '15px' }}>"{perfumeData.description}"</p>
              <div className="mb-4">
                <h6 className="text-uppercase text-secondary mb-3" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Kompozycja zapachowa</h6>
                <div className="d-flex flex-wrap gap-2">
                  {perfumeData.ingredients.map((item, index) => (
                    <Button key={index} variant="outline-dark" size="sm" className="rounded-0 text-uppercase" style={{ fontSize: '0.7rem', opacity: 0.8, borderColor: '#dee2e6' }}>{item}</Button>
                  ))}
                </div>
              </div>
              <div className="d-flex gap-3 mt-5 pt-4">
                <div className="text-center me-3">
                  <h2 className="mb-0 fw-bold text-dark">8.5</h2><small className="text-muted">Ocena</small>
                </div>
                <Button variant="dark" size="lg" className="px-4 rounded-0 fw-bold">Oceń zapach</Button>
                <Button variant="outline-dark" size="lg" className="rounded-0">+ Do listy</Button>
              </div>
            </Col>
          </Row>
        </Container>

        {/* NOWA SEKCJA: KOMENTARZE POD SPODEM */}
        {/* Przekazujemy funkcję otwierającą Slide Bar */}
        <ReviewsSection onOpenSlider={handleShowReviews} />

        {/* UKRYTY SLIDE BAR */}
        <ReviewsOffcanvas show={showReviews} handleClose={handleCloseReviews} />
      </div>
    </div>
  );
}