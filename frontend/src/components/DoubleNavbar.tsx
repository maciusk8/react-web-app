import { useState } from 'react';
import { Container, Navbar, Nav, Form, Dropdown } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { perfumeApi } from '../services/api';
import type { Perfume } from '../types/types';
import logo from '../assets/logo.png';

export default function DoubleNavbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Perfume[]>([]);
    const [showSearchResults, setShowSearchResults] = useState(false);

    const isActive = (path: string) => location.pathname === path;

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.length >= 2) {
            try {
                const results = await perfumeApi.search(query);
                setSearchResults(results.slice(0, 5));
                setShowSearchResults(true);
            } catch (err) {
                console.error('Search error:', err);
                setSearchResults([]);
            }
        } else {
            setSearchResults([]);
            setShowSearchResults(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            {/* Main Navbar */}
            <Navbar
                expand="lg"
                className="py-2 sticky-top"
                style={{
                    background: 'rgba(255,255,255,0.98)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(0,0,0,0.06)',
                    zIndex: 1020
                }}
            >
                <Container>
                    {/* Logo */}
                    <Navbar.Brand as={Link} to="/" className="d-flex align-items-center me-4">
                        <img src={logo} alt="Perphorum" style={{ height: '70px' }} />
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="mainNavbar" />

                    <Navbar.Collapse id="mainNavbar">
                        {/* Centered Search Bar */}
                        <div className="flex-grow-1 d-flex justify-content-center mx-4">
                            <div className="position-relative" style={{ width: '100%', maxWidth: '400px' }}>
                                <Form.Control
                                    type="search"
                                    placeholder="Szukaj perfum..."
                                    className="border-0 shadow-none px-4 text-center"
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                                    onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                                    style={{
                                        background: 'rgba(0,0,0,0.03)',
                                        borderRadius: 0,
                                        borderBottom: '1px solid rgba(0,0,0,0.1)',
                                        fontSize: '0.9rem'
                                    }}
                                />

                                {/* Search Results */}
                                {showSearchResults && searchResults.length > 0 && (
                                    <div
                                        className="position-absolute w-100 bg-white shadow border"
                                        style={{ top: '100%', left: 0, zIndex: 1050 }}
                                    >
                                        {searchResults.map(p => (
                                            <Link
                                                key={p.id}
                                                to={`/product/${p.id}`}
                                                className="d-block px-3 py-2 text-decoration-none text-dark border-bottom"
                                                style={{ transition: 'background 0.2s' }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <div className="fw-bold small">{p.name}</div>
                                                <small className="text-muted">{p.brand}</small>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Auth Buttons */}
                        <Nav className="align-items-center">
                            {isAuthenticated && user ? (
                                <Dropdown align="end">
                                    <Dropdown.Toggle
                                        variant="link"
                                        className="text-dark d-flex align-items-center text-decoration-none p-0"
                                    >
                                        <div
                                            className="rounded-circle bg-dark text-white me-2 d-flex align-items-center justify-content-center"
                                            style={{ width: 32, height: 32, fontSize: '0.8rem' }}
                                        >
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="fw-bold small">{user.username}</span>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className="rounded-0 border-dark mt-2">
                                        <Dropdown.Item as={Link} to="/profile">Mój Profil</Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item onClick={handleLogout}>Wyloguj</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            ) : (
                                <div className="d-flex gap-2">
                                    <Link
                                        to="/login"
                                        className="btn btn-outline-dark btn-sm rounded-0 text-uppercase px-3"
                                        style={{ letterSpacing: '1px', fontSize: '0.7rem' }}
                                    >
                                        Zaloguj
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="btn btn-dark btn-sm rounded-0 text-uppercase px-3"
                                        style={{ letterSpacing: '1px', fontSize: '0.7rem' }}
                                    >
                                        Rejestracja
                                    </Link>
                                </div>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Secondary Navigation */}
            <Nav
                className="justify-content-center py-2 border-bottom"
                style={{ background: 'rgba(255,255,255,0.95)', zIndex: 1010 }}
            >
                {[
                    { path: '/male', label: 'Mężczyzna' },
                    { path: '/female', label: 'Kobieta' },
                    { path: '/unisex', label: 'Unisex' },
                    { path: '/rankings', label: 'Rankingi' },
                    { path: '/friends', label: 'Znajomi' },
                ].map(link => (
                    <Nav.Link
                        key={link.path}
                        as={Link}
                        to={link.path}
                        className={`text-dark mx-3 text-uppercase small ${isActive(link.path) ? 'fw-bold' : ''}`}
                        style={isActive(link.path)
                            ? { borderBottom: '2px solid var(--color-gold)', letterSpacing: '1px' }
                            : { letterSpacing: '1px' }
                        }
                    >
                        {link.label}
                    </Nav.Link>
                ))}
            </Nav>
        </>
    );
}
