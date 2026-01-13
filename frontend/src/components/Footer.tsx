import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

export default function Footer() {
    return (
        <footer className="py-5 border-top bg-white mt-auto">
            <Container>
                <Row className="text-center text-md-start">
                    <Col md={4} className="mb-4 mb-md-0">
                        <h5 style={{ fontFamily: 'var(--font-serif)' }}>Perphorum</h5>
                        <p className="text-muted small">Twoja społeczność perfum</p>
                    </Col>
                    <Col md={4} className="mb-4 mb-md-0">
                        <h6 className="text-uppercase small text-muted mb-3" style={{ letterSpacing: '2px' }}>Nawigacja</h6>
                        <div className="d-flex flex-column gap-2">
                            <Link to="/male" className="text-decoration-none text-dark small">Męskie</Link>
                            <Link to="/female" className="text-decoration-none text-dark small">Damskie</Link>
                            <Link to="/rankings" className="text-decoration-none text-dark small">Rankingi</Link>
                        </div>
                    </Col>
                    <Col md={4}>
                        <h6 className="text-uppercase small text-muted mb-3" style={{ letterSpacing: '2px' }}>Autorzy</h6>
                        <p className="small text-muted mb-1">Maciej Mikołajek</p>
                        <p className="small text-muted">Mateusz Wróbel</p>
                    </Col>
                </Row>
                <hr className="my-4" />
                <p className="text-center text-muted small text-uppercase mb-0" style={{ letterSpacing: '2px' }}>
                    Perphorum © {new Date().getFullYear()}
                </p>
            </Container>
        </footer>
    );
}
