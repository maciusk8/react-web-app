import { useState, useRef, useEffect } from 'react';
import { Container, Form, Button, Alert, Table, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageWrapper from '../../components/PageWrapper';

const MOCK_CREDENTIALS = [
    { username: 'maciej', password: 'maciej123', role: 'USER' },
    { username: 'mateusz', password: 'mateusz123', role: 'USER' },
    { username: 'prowadzacy', password: 'admin123', role: 'ADMIN' },
    { username: 'anna_perfumy', password: 'anna123', role: 'USER' },
    { username: 'tomek_niche', password: 'tomek123', role: 'USER' },
];

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const usernameRef = useRef<HTMLInputElement>(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    // Autofocus on mount
    useEffect(() => {
        usernameRef.current?.focus();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login({ username, password });
            navigate('/');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Błąd logowania';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickLogin = (cred: typeof MOCK_CREDENTIALS[0]) => {
        setUsername(cred.username);
        setPassword(cred.password);
    };

    return (
        <PageWrapper showFooter={false}>
            <Container className="py-5 login-container" style={{ maxWidth: '500px' }}>
                <div className="auth-card p-5 bg-white">
                    <h1 className="text-center mb-4 auth-title">Logowanie</h1>

                    {error && (
                        <Alert variant="danger" className="rounded-0" role="alert">
                            {error}
                        </Alert>
                    )}

                    <Form onSubmit={handleSubmit} noValidate>
                        <Form.Group className="mb-3">
                            <Form.Label
                                htmlFor="login-username"
                                className="form-label-premium"
                            >
                                Nazwa użytkownika
                            </Form.Label>
                            <Form.Control
                                ref={usernameRef}
                                id="login-username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="form-input-premium"
                                autoComplete="username"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label
                                htmlFor="login-password"
                                className="form-label-premium"
                            >
                                Hasło
                            </Form.Label>
                            <InputGroup>
                                <Form.Control
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-input-premium"
                                    autoComplete="current-password"
                                    required
                                />
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="rounded-0"
                                    type="button"
                                    aria-label={showPassword ? 'Ukryj hasło' : 'Pokaż hasło'}
                                >
                                    {showPassword ? '👁️‍🗨️' : '👁️'}
                                </Button>
                            </InputGroup>
                        </Form.Group>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-100 btn-premium"
                            aria-busy={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Logowanie...
                                </>
                            ) : (
                                'Zaloguj się'
                            )}
                        </Button>
                    </Form>

                    <div className="text-center mt-4">
                        <span className="text-muted">Nie masz konta? </span>
                        <Link to="/register" className="text-dark fw-bold text-decoration-none link-hover">
                            Zarejestruj się
                        </Link>
                    </div>
                </div>


                <div className="auth-card mt-4 p-4 bg-white">
                    <h6 className="text-center form-label-premium mb-3">
                        Konta testowe
                    </h6>
                    <Table size="sm" className="mb-0" style={{ fontSize: '0.85rem' }}>
                        <thead>
                            <tr>
                                <th className="border-0 text-muted fw-normal">Użytkownik</th>
                                <th className="border-0 text-muted fw-normal">Hasło</th>
                                <th className="border-0 text-muted fw-normal">Rola</th>
                                <th className="border-0"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_CREDENTIALS.map((cred) => (
                                <tr key={cred.username}>
                                    <td className="border-0">{cred.username}</td>
                                    <td className="border-0 text-muted">{cred.password}</td>
                                    <td className="border-0">
                                        <span
                                            className="badge text-white"
                                            style={{
                                                background: cred.role === 'ADMIN' ? 'var(--color-star-gold)' : '#C0C0C0',
                                                fontSize: '0.65rem'
                                            }}
                                        >
                                            {cred.role}
                                        </span>
                                    </td>
                                    <td className="border-0 text-end">
                                        <button
                                            onClick={() => handleQuickLogin(cred)}
                                            className="btn btn-link text-gold p-0 text-decoration-none small link-hover"
                                            type="button"
                                        >
                                            Użyj
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Container>
        </PageWrapper>
    );
}
