import { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Spinner, Form, Button } from 'react-bootstrap';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { perfumeApi } from '../services/api';
import type { Perfume } from '../types/types';

const ITEMS_PER_PAGE = 20;

const genderConfig: Record<string, { title: string; subtitle: string; filter: string }> = {
    male: { title: 'Męskie', subtitle: 'Elegancja i charakter w każdej nucie', filter: 'Male' },
    female: { title: 'Damskie', subtitle: 'Subtelność i wyrafinowanie', filter: 'Female' },
    unisex: { title: 'Unisex', subtitle: 'Uniwersalne kompozycje bez granic', filter: 'Unisex' }
};

export default function GenderPage() {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const gender = location.pathname.replace('/', '');

    const [allPerfumes, setAllPerfumes] = useState<Perfume[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    // Filters
    const [familyFilter, setFamilyFilter] = useState<string>('all');
    const [brandFilter, setBrandFilter] = useState<string>('all');
    const [noteFilter, setNoteFilter] = useState<string>(searchParams.get('note') || '');
    const [sortBy, setSortBy] = useState<string>('name');

    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

    const config = gender ? genderConfig[gender] : null;

    useEffect(() => {
        if (!config) return;

        const fetchPerfumes = async () => {
            setLoading(true);
            setVisibleCount(ITEMS_PER_PAGE);
            try {
                const data = await perfumeApi.getByGender(config.filter);
                setAllPerfumes(data);
            } catch (err) {
                console.error('Failed to load perfumes:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPerfumes();
    }, [config?.filter]);

    useEffect(() => {
        const note = searchParams.get('note');
        if (note) setNoteFilter(note);
    }, [searchParams]);

    const families = useMemo(() => {
        const uniqueFamilies = [...new Set(allPerfumes.map(p => p.family).filter(Boolean))];
        return uniqueFamilies.sort();
    }, [allPerfumes]);

    const brands = useMemo(() => {
        const uniqueBrands = [...new Set(allPerfumes.map(p => p.brand).filter(Boolean))];
        return uniqueBrands.sort();
    }, [allPerfumes]);

    const filteredPerfumes = useMemo(() => {
        let result = [...allPerfumes];
        if (familyFilter !== 'all') result = result.filter(p => p.family === familyFilter);
        if (brandFilter !== 'all') result = result.filter(p => p.brand === brandFilter);
        if (noteFilter) result = result.filter(p => p.ingredients?.toLowerCase().includes(noteFilter.toLowerCase()));

        if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
        else if (sortBy === 'brand') result.sort((a, b) => a.brand.localeCompare(b.brand));

        return result;
    }, [allPerfumes, familyFilter, brandFilter, noteFilter, sortBy]);

    const visiblePerfumes = filteredPerfumes.slice(0, visibleCount);
    const hasMore = visibleCount < filteredPerfumes.length;

    const handleShowMore = () => {
        setLoadingMore(true);
        setTimeout(() => {
            setVisibleCount(prev => prev + ITEMS_PER_PAGE);
            setLoadingMore(false);
        }, 300);
    };

    const clearNoteFilter = () => {
        setNoteFilter('');
        setSearchParams({});
    };

    if (!config) {
        return <PageWrapper><Container className="py-5 text-center">Nieznana kategoria</Container></PageWrapper>;
    }

    return (
        <PageWrapper>
            <Container className="py-5">
                {/* Header */}
                <div className="text-center mb-5">
                    <h1 style={{ fontFamily: 'var(--font-serif)' }} className="display-4 fw-bold mb-2">{config.title}</h1>
                    <p className="text-muted fst-italic">{config.subtitle}</p>
                    <div className="mx-auto" style={{ width: '60px', height: '2px', background: 'var(--color-gold)' }} />
                </div>

                {/* Active Note Filter */}
                {noteFilter && (
                    <div className="text-center mb-4">
                        <span
                            className="d-inline-flex align-items-center gap-2 px-3 py-2"
                            style={{ background: 'rgba(201,169,98,0.1)', border: '1px solid var(--color-gold)' }}
                        >
                            <span className="small">Filtr nuty: <strong>{noteFilter}</strong></span>
                            <button onClick={clearNoteFilter} className="btn btn-link text-gold p-0">×</button>
                        </span>
                    </div>
                )}

                {/* Filters */}
                <div className="bg-light p-4 mb-5 border">
                    <Row className="g-3 justify-content-center align-items-end">
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label className="text-uppercase small text-muted mb-1" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>
                                    Rodzina
                                </Form.Label>
                                <Form.Select
                                    size="sm"
                                    value={familyFilter}
                                    onChange={(e) => { setFamilyFilter(e.target.value); setVisibleCount(ITEMS_PER_PAGE); }}
                                    className="rounded-0 border-0 border-bottom bg-transparent"
                                >
                                    <option value="all">Wszystkie</option>
                                    {families.map(f => <option key={f} value={f}>{f}</option>)}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label className="text-uppercase small text-muted mb-1" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>
                                    Marka
                                </Form.Label>
                                <Form.Select
                                    size="sm"
                                    value={brandFilter}
                                    onChange={(e) => { setBrandFilter(e.target.value); setVisibleCount(ITEMS_PER_PAGE); }}
                                    className="rounded-0 border-0 border-bottom bg-transparent"
                                >
                                    <option value="all">Wszystkie</option>
                                    {brands.map(b => <option key={b} value={b}>{b}</option>)}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label className="text-uppercase small text-muted mb-1" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>
                                    Sortuj
                                </Form.Label>
                                <Form.Select
                                    size="sm"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="rounded-0 border-0 border-bottom bg-transparent"
                                >
                                    <option value="name">Nazwa</option>
                                    <option value="brand">Marka</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        {/* Clear Filters Button could go here */}
                    </Row>
                </div>

                <p className="text-center text-muted small mb-4">
                    Wyświetlono {visiblePerfumes.length} z {filteredPerfumes.length} perfum
                </p>

                {loading ? (
                    <div className="text-center py-5"><Spinner animation="border" variant="dark" /></div>
                ) : (
                    <>
                        <Row className="g-4">
                            {visiblePerfumes.map((perfume) => (
                                <Col xs={6} md={4} lg={3} key={perfume.id}>
                                    <Link to={`/product/${perfume.id}`} className="text-decoration-none">
                                        <div className="bg-white p-3 text-center h-100 card-premium position-relative">
                                            <div className="mb-3" style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {perfume.imageUrl ? (
                                                    <img src={perfume.imageUrl} alt={perfume.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} loading="lazy" />
                                                ) : (
                                                    <span className="text-muted small">Brak zdjęcia</span>
                                                )}
                                            </div>
                                            <p className="text-uppercase small text-muted mb-1" style={{ letterSpacing: '2px', fontSize: '0.65rem' }}>{perfume.brand}</p>
                                            <h6 className="fw-bold text-dark mb-1" style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem' }}>{perfume.name}</h6>
                                            {perfume.family && <small className="text-muted d-block mt-1" style={{ fontSize: '0.7rem' }}>{perfume.family}</small>}
                                        </div>
                                    </Link>
                                </Col>
                            ))}
                        </Row>

                        {hasMore && (
                            <div className="text-center mt-5">
                                <Button
                                    onClick={handleShowMore}
                                    disabled={loadingMore}
                                    className="btn-premium-outline px-5"
                                >
                                    {loadingMore ? <Spinner animation="border" size="sm" /> : `Pokaż więcej (${filteredPerfumes.length - visibleCount} pozostało)`}
                                </Button>
                            </div>
                        )}

                        {filteredPerfumes.length === 0 && (
                            <div className="text-center py-5">
                                <p className="text-muted">Brak perfum spełniających kryteria.</p>
                                <Button
                                    variant="link"
                                    onClick={() => { setFamilyFilter('all'); setBrandFilter('all'); setNoteFilter(''); }}
                                    className="text-gold"
                                >
                                    Wyczyść filtry
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </Container>
        </PageWrapper>
    );
}
