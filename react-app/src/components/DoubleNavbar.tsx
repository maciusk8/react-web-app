import React from 'react';
import { Container, Navbar, Nav, Form } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

export default function DoubleNavbar() {
    const location = useLocation();
    const [activeMenu, setActiveMenu] = React.useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

    const isActive = (path: string) => location.pathname === path;

    const categories = ["Drzewne", "Orientalne", "Cytrusowe", "Szyprowe", "Fougère"];

    const mockedPerfumes = [
        { id: 1, name: "Opus 1144", brand: "Filippo Sorcinelli" },
        { id: 2, name: "Baccarat Rouge 540", brand: "Maison Francis Kurkdjian" },
        { id: 3, name: "Aventus", brand: "Creed" },
        { id: 4, name: "Santal 33", brand: "Le Labo" },
    ];

    return (
        <>
            <Navbar expand="lg" variant="light" className="py-3 sticky-top" style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', transition: 'all 0.3s', borderBottom: '1px solid rgba(0,0,0,0.05)', zIndex: 1020 }}>
                <Container fluid>
                    <Navbar.Brand as={Link} to="/" className="fw-bold text-uppercase" style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', letterSpacing: '3px' }}>
                        Perforum
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="offcanvasNavbar" />
                    <Navbar.Collapse id="offcanvasNavbar">
                        <Nav className="mx-auto" style={{ width: '100%', maxWidth: '500px' }}>
                            <Form className="d-flex w-100 position-relative">
                                <Form.Control
                                    type="search"
                                    placeholder="Szukaj perfum..."
                                    className="border-0 shadow-none ps-4 pe-5"
                                    style={{
                                        background: 'rgba(0,0,0,0.03)',
                                        borderRadius: '0',
                                        borderBottom: '1px solid rgba(0,0,0,0.15)',
                                        fontSize: '0.9rem',
                                        letterSpacing: '0.5px',
                                        fontFamily: 'Georgia, serif',
                                        fontStyle: 'italic'
                                    }}
                                />
                                <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4, fontSize: '0.9rem' }}>⌕</span>
                            </Form>
                        </Nav>
                        <Nav className="ms-auto align-items-center">
                            <Nav.Link as={Link} to="/profile" className="text-dark d-flex align-items-center fw-bold">
                                <div className="rounded-circle bg-dark me-2" style={{ width: 30, height: 30 }}></div> Konto
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <div onMouseLeave={() => { setActiveMenu(null); setSelectedCategory(null); }}>
                <Nav className="justify-content-center py-2 border-bottom border-dark-subtle" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(5px)', position: 'relative', zIndex: 1010 }}>

                    <Nav.Link
                        href="#"
                        className={`text-dark mx-3 text-uppercase small ${activeMenu === 'men' ? 'fw-bold' : ''}`}
                        style={{ letterSpacing: '1px' }}
                        onMouseEnter={() => setActiveMenu('men')}
                        onClick={(e) => { e.preventDefault(); setActiveMenu(activeMenu === 'men' ? null : 'men'); }}
                    >
                        Mężczyzna
                    </Nav.Link>

                    <Nav.Link
                        href="#"
                        className={`text-dark mx-3 text-uppercase small ${activeMenu === 'women' ? 'fw-bold' : ''}`}
                        style={{ letterSpacing: '1px' }}
                        onMouseEnter={() => setActiveMenu('women')}
                        onClick={(e) => { e.preventDefault(); setActiveMenu(activeMenu === 'women' ? null : 'women'); }}
                    >
                        Kobieta
                    </Nav.Link>

                    <Nav.Link as={Link} to="/rankings" className={`text-dark mx-3 text-uppercase small ${isActive('/rankings') ? 'fw-bold' : ''}`} style={isActive('/rankings') ? { borderBottom: '2px solid black', letterSpacing: '1px' } : { letterSpacing: '1px' }}>Rankingi</Nav.Link>
                    <Nav.Link as={Link} to="/friends" className={`text-dark mx-3 text-uppercase small ${isActive('/friends') ? 'fw-bold' : ''}`} style={isActive('/friends') ? { borderBottom: '2px solid black', letterSpacing: '1px' } : { letterSpacing: '1px' }}>Znajomi</Nav.Link>
                </Nav>

                {activeMenu && (
                    <div className="w-100 border-bottom border-dark-subtle" style={{
                        background: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(20px)',
                        position: 'absolute',
                        left: 0,
                        zIndex: 1000,
                        padding: '2rem 0',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                    }}>
                        <Container>
                            <div className="d-flex">
                                <div className="border-end border-dark-subtle pe-5" style={{ minWidth: '250px' }}>
                                    <h6 className="text-muted text-uppercase mb-3 small" style={{ letterSpacing: '2px' }}>
                                        Kategorie ({activeMenu === 'men' ? 'Męskie' : 'Damskie'})
                                    </h6>
                                    <div className="d-flex flex-column gap-2">
                                        {categories.map(cat => (
                                            <span
                                                key={cat}
                                                className={`${selectedCategory === cat ? 'fw-bold text-black' : 'text-secondary'}`}
                                                style={{ cursor: 'pointer', transition: 'color 0.2s' }}
                                                onMouseEnter={() => setSelectedCategory(cat)}
                                            >
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="ps-5 flex-grow-1">
                                    {selectedCategory ? (
                                        <>
                                            <h6 className="text-muted text-uppercase mb-4 small" style={{ letterSpacing: '2px' }}>Polecane: {selectedCategory}</h6>
                                            <div className="row g-4">
                                                {mockedPerfumes.map(p => (
                                                    <div className="col-md-6" key={p.id}>
                                                        <Link to="/product" className="text-decoration-none text-dark d-flex align-items-center">
                                                            <div style={{ width: 50, height: 50, background: '#f0f0f0', border: '1px solid #ddd' }} className="me-3"></div>
                                                            <div>
                                                                <div className="fw-bold">{p.name}</div>
                                                                <small className="text-muted" style={{ letterSpacing: '0.5px' }}>{p.brand}</small>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-muted fst-italic h-100 d-flex align-items-center">
                                            Wybierz kategorię, aby zobaczyć perfumy.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Container>
                    </div>
                )}
            </div>
        </>
    );
}
