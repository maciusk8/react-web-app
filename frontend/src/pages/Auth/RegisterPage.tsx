import { useState, useRef, useEffect } from 'react';
import { Container, Form, Button, Alert, ProgressBar, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageWrapper from '../../components/PageWrapper';

// Constants for validation
const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_REQUIREMENTS = [
    { regex: /.{6,}/, label: 'Minimum 6 znaków' },
    { regex: /[A-Z]/, label: 'Jedna wielka litera' },
    { regex: /[0-9]/, label: 'Jedna cyfra' },
];

const getPasswordStrength = (password: string): number => {
    let strength = 0;
    PASSWORD_REQUIREMENTS.forEach(req => {
        if (req.regex.test(password)) strength++;
    });
    return strength;
};

const getPasswordStrengthLabel = (strength: number): { label: string; variant: string } => {
    switch (strength) {
        case 0:
        case 1:
            return { label: 'Słabe', variant: 'danger' };
        case 2:
            return { label: 'Średnie', variant: 'warning' };
        case 3:
            return { label: 'Silne', variant: 'success' };
        default:
            return { label: '', variant: 'secondary' };
    }
};

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState({
        username: false,
        email: false,
        password: false,
        confirmPassword: false,
    });

    const usernameRef = useRef<HTMLInputElement>(null);
    const { register } = useAuth();
    const navigate = useNavigate();

    // Autofocus on mount
    useEffect(() => {
        usernameRef.current?.focus();
    }, []);

    // Validation helpers
    const isEmailValid = (emailValue: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
    const isUsernameValid = (usernameValue: string) => usernameValue.length >= 3;
    const passwordStrength = getPasswordStrength(password);
    const passwordStrengthInfo = getPasswordStrengthLabel(passwordStrength);
    const passwordsMatch = password === confirmPassword;

    const handleBlur = (field: keyof typeof touched) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Mark all fields as touched
        setTouched({
            username: true,
            email: true,
            password: true,
            confirmPassword: true,
        });

        if (!isUsernameValid(username)) {
            setError('Nazwa użytkownika musi mieć minimum 3 znaki');
            return;
        }

        if (!isEmailValid(email)) {
            setError('Podaj poprawny adres email');
            return;
        }

        if (password.length < PASSWORD_MIN_LENGTH) {
            setError('Hasło musi mieć minimum 6 znaków');
            return;
        }

        if (!passwordsMatch) {
            setError('Hasła nie są identyczne');
            return;
        }

        setLoading(true);

        try {
            await register({ username, email, password });
            navigate('/');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Błąd rejestracji';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageWrapper showFooter={false}>
            <Container className="py-5 register-container" style={{ maxWidth: '500px' }}>
                <div className="auth-card p-5 bg-white">
                    <h1 className="text-center mb-4 auth-title">Rejestracja</h1>

                    {error && (
                        <Alert variant="danger" className="rounded-0" role="alert">
                            {error}
                        </Alert>
                    )}

                    <Form onSubmit={handleSubmit} noValidate>
                        {/* Username Field */}
                        <Form.Group className="mb-3">
                            <Form.Label
                                htmlFor="register-username"
                                className="form-label-premium"
                            >
                                Nazwa użytkownika
                            </Form.Label>
                            <Form.Control
                                ref={usernameRef}
                                id="register-username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onBlur={() => handleBlur('username')}
                                className="form-input-premium"
                                autoComplete="username"
                                aria-describedby="username-help"
                                isInvalid={touched.username && !isUsernameValid(username)}
                                isValid={touched.username && isUsernameValid(username)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Minimum 3 znaki
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/* Email Field */}
                        <Form.Group className="mb-3">
                            <Form.Label
                                htmlFor="register-email"
                                className="form-label-premium"
                            >
                                Email
                            </Form.Label>
                            <Form.Control
                                id="register-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={() => handleBlur('email')}
                                className="form-input-premium"
                                autoComplete="email"
                                aria-describedby="email-help"
                                isInvalid={touched.email && !isEmailValid(email) && email.length > 0}
                                isValid={touched.email && isEmailValid(email)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Podaj poprawny adres email
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/* Password Field with Strength Indicator */}
                        <Form.Group className="mb-3">
                            <Form.Label
                                htmlFor="register-password"
                                className="form-label-premium"
                            >
                                Hasło
                                <OverlayTrigger
                                    placement="right"
                                    overlay={
                                        <Tooltip id="password-tooltip">
                                            <div className="text-start">
                                                {PASSWORD_REQUIREMENTS.map((req, i) => (
                                                    <div key={i} style={{ color: req.regex.test(password) ? '#28a745' : '#fff' }}>
                                                        {req.regex.test(password) ? '✓' : '○'} {req.label}
                                                    </div>
                                                ))}
                                            </div>
                                        </Tooltip>
                                    }
                                >
                                    <span className="ms-2 text-muted" style={{ cursor: 'help' }}>ⓘ</span>
                                </OverlayTrigger>
                            </Form.Label>
                            <InputGroup>
                                <Form.Control
                                    id="register-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onBlur={() => handleBlur('password')}
                                    className="form-input-premium"
                                    autoComplete="new-password"
                                    aria-describedby="password-strength"
                                    required
                                    minLength={PASSWORD_MIN_LENGTH}
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
                            {password && (
                                <div className="mt-2" id="password-strength">
                                    <ProgressBar
                                        now={(passwordStrength / 3) * 100}
                                        variant={passwordStrengthInfo.variant}
                                        style={{ height: '4px' }}
                                        aria-label="Siła hasła"
                                    />
                                    <small className={`text-${passwordStrengthInfo.variant}`}>
                                        {passwordStrengthInfo.label}
                                    </small>
                                </div>
                            )}
                        </Form.Group>

                        {/* Confirm Password Field */}
                        <Form.Group className="mb-4">
                            <Form.Label
                                htmlFor="register-confirm-password"
                                className="form-label-premium"
                            >
                                Potwierdź hasło
                            </Form.Label>
                            <InputGroup>
                                <Form.Control
                                    id="register-confirm-password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    onBlur={() => handleBlur('confirmPassword')}
                                    className="form-input-premium"
                                    autoComplete="new-password"
                                    isInvalid={touched.confirmPassword && !passwordsMatch && confirmPassword.length > 0}
                                    isValid={touched.confirmPassword && passwordsMatch && confirmPassword.length > 0}
                                    required
                                />
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="rounded-0"
                                    type="button"
                                    aria-label={showConfirmPassword ? 'Ukryj hasło' : 'Pokaż hasło'}
                                >
                                    {showConfirmPassword ? '👁️‍🗨️' : '👁️'}
                                </Button>
                            </InputGroup>
                            <Form.Control.Feedback type="invalid" className="d-block">
                                {touched.confirmPassword && !passwordsMatch && confirmPassword.length > 0 && 'Hasła nie są identyczne'}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/* Terms & Privacy */}
                        <p className="text-muted small mb-4 text-center">
                            Rejestrując się, akceptujesz{' '}
                            <Link to="/regulamin" className="text-gold">Regulamin</Link>
                            {' '}oraz{' '}
                            <Link to="/polityka-prywatnosci" className="text-gold">Politykę Prywatności</Link>
                        </p>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-100 btn-premium"
                            aria-busy={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Rejestracja...
                                </>
                            ) : (
                                'Zarejestruj się'
                            )}
                        </Button>
                    </Form>

                    <div className="text-center mt-4">
                        <span className="text-muted">Masz już konto? </span>
                        <Link to="/login" className="text-dark fw-bold text-decoration-none link-hover">
                            Zaloguj się
                        </Link>
                    </div>
                </div>
            </Container>
        </PageWrapper>
    );
}
