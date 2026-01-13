import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authApi } from '../services/api';
import type { AuthResponse, AuthRequest, RegisterRequest, Perfume } from '../types/types';

interface AuthUser {
    id: number;
    username: string;
    role: string;
    wishlistPerfumes?: Perfume[];
    ownedPerfumes?: Perfume[];
}

interface AuthContextType {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: AuthRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load auth state from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const saveAuth = (response: AuthResponse) => {
        const authUser: AuthUser = {
            id: response.userId,
            username: response.username,
            role: response.role,
        };

        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(authUser));

        setToken(response.token);
        setUser(authUser);
    };

    const login = async (credentials: AuthRequest) => {
        const response = await authApi.login(credentials);
        saveAuth(response);
    };

    const register = async (data: RegisterRequest) => {
        const response = await authApi.register(data);
        saveAuth(response);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token,
                isLoading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
