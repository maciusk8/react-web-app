import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';

// Mock article data for Paco Rabanne
const articleData = {
    brand: 'Paco Rabanne',
    title: 'Paco Rabanne: Rewolucja w świecie perfum',
    heroImage: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2574&auto=format&fit=crop',
    intro: `Paco Rabanne to hiszpański dom mody założony w 1966 roku, który zdefiniował pojęcie nowoczesnej 
           perfumerii męskiej. Od legendarnego "1 Million" po innowacyjne "Phantom" - każdy zapach to 
           manifest odwagi i ekstrawagancji.`,
    sections: [
        {
            title: 'Historia marki',
            content: `Francisco Rabaneda Cuervo, znany jako Paco Rabanne, rozpoczął swoją karierę jako 
                     architekt, co wpłynęło na jego awangardowe podejście do mody i perfum. W 1969 roku 
                     wypuścił swój pierwszy zapach - Calandre, który natychmiast stał się klasykiem.`
        },
        {
            title: 'Filozofia zapachowa',
            content: `Zapachy Paco Rabanne charakteryzują się odwagą i innowacyjnością. Marka nie boi się 
                     eksperymentować z niekonwencjonalnymi połączeniami, tworząc zapachy, które pozostają 
                     w pamięci na długo.`
        },
        {
            title: 'Ikony marki',
            content: `"1 Million" (2008) to bez wątpienia najbardziej rozpoznawalny zapach marki - 
                     złota sztabka, która stała się symbolem sukcesu i luksusu. "Invictus" (2013) 
                     z kolei przemawia do sportowców i zwycięzców.`
        }
    ],
    featuredPerfumes: [
        { id: 1, name: '1 Million', description: 'Orientalno-korzenny zapach z nutami krwistej mandarynki, cynamonu i skóry' },
        { id: 2, name: 'Invictus', description: 'Świeży, akwatyczny zapach dla nowoczesnego wojownika' },
        { id: 3, name: 'Phantom', description: 'Futurystyczny zapach połączony z technologią' },
        { id: 4, name: 'Pure XS', description: 'Zmysłowy i prowokacyjny zapach z nutami imbiru i wanilii' }
    ]
};

export default function ArticlePage() {
    return (
        <PageWrapper>
            {/* Hero Section */}
            <div
                className="position-relative"
                style={{
                    height: '60vh',
                    minHeight: '400px',
                    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${articleData.heroImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'flex-end'
                }}
            >
                <Container className="pb-5 text-white">
                    <p className="text-uppercase mb-2" style={{ letterSpacing: '4px', fontSize: '0.8rem', color: '#c9a962' }}>
                        Artykuł sponsorowany
                    </p>
                    <h1 className="display-3 fw-bold mb-3" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                        {articleData.title}
                    </h1>
                    <p className="lead opacity-75 mb-0" style={{ maxWidth: '600px' }}>
                        {articleData.intro}
                    </p>
                </Container>
            </div>

            {/* Content */}
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col lg={8}>
                        {articleData.sections.map((section, idx) => (
                            <div key={idx} className="mb-5">
                                <h3 className="fw-bold mb-3" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                                    {section.title}
                                </h3>
                                <p className="text-secondary" style={{ lineHeight: '1.8', fontSize: '1.05rem' }}>
                                    {section.content}
                                </p>
                            </div>
                        ))}

                        {/* Featured Perfumes */}
                        <div className="mt-5 pt-4 border-top">
                            <h3 className="fw-bold mb-4 text-center" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                                Kultowe zapachy marki
                            </h3>
                            <Row className="g-4">
                                {articleData.featuredPerfumes.map((perfume, idx) => (
                                    <Col md={6} key={idx}>
                                        <Link to={`/product/${perfume.id}`} className="text-decoration-none">
                                            <div
                                                className="p-4 h-100"
                                                style={{
                                                    background: 'linear-gradient(135deg, #f8f7f4 0%, #ebe8e2 100%)',
                                                    border: '1px solid rgba(201,169,98,0.3)',
                                                    transition: 'transform 0.2s ease'
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                            >
                                                <h5 className="fw-bold mb-2" style={{ color: '#1a1a1a' }}>{perfume.name}</h5>
                                                <p className="text-muted small mb-0">{perfume.description}</p>
                                            </div>
                                        </Link>
                                    </Col>
                                ))}
                            </Row>
                        </div>

                        {/* CTA */}
                        <div className="text-center mt-5 pt-4">
                            <Link to="/rankings">
                                <Button
                                    variant="dark"
                                    size="lg"
                                    className="px-5 py-3"
                                    style={{
                                        letterSpacing: '2px',
                                        fontSize: '0.85rem',
                                        borderRadius: 0,
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    Zobacz wszystkie rankingi
                                </Button>
                            </Link>
                        </div>
                    </Col>
                </Row>
            </Container>
        </PageWrapper>
    );
}
