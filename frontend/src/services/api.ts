import type {
    Perfume,
    RawPerfume,
    Review,
    RawReview,
    UserSummary,
    AuthResponse,
    AuthRequest,
    RegisterRequest,
    CreateReviewRequest,
    CreateCommentRequest,
} from '../types/types';

const API_BASE_URL = 'http://localhost:8080/api';

// Backend serves images from /images/
const IMAGE_BASE_URL = 'http://localhost:8080/images';

// Transform backend response to frontend format
function transformPerfume(raw: RawPerfume): Perfume {
    return {
        id: raw.id,
        name: raw.name_perfume,
        brand: raw.brand,
        gender: raw.gender,
        family: raw.family,
        subfamily: raw.subfamily,
        description: raw.description,
        ingredients: raw.ingredients?.join(', '),
        imageUrl: raw.image_name ? `${IMAGE_BASE_URL}/${raw.image_name}` : undefined,
        reviews: raw.reviews?.map(transformReview), // handle nested reviews if any
    };
}

function transformReview(raw: any): Review {
    // raw might be RawReview, but to avoid circular dep issues or type conflicts, we type casually here
    // In reality raw.subject is RawPerfume
    return {
        id: raw.id,
        text: raw.text,
        rating: raw.rating,
        author: raw.author,
        subject: raw.subject ? transformPerfume(raw.subject) : undefined,
        likes: raw.likes,
        likesCount: raw.likesCount,
        createdAt: raw.createdAt,
        comments: raw.comments,
    };
}

// Helper to get auth token
const getToken = (): string | null => localStorage.getItem('token');

// Helper for authenticated requests
const authHeaders = (): HeadersInit => {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

// Generic fetch wrapper with error handling
async function fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: authHeaders(),
        ...options,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP ${response.status}`);
    }

    // Handle empty responses
    const text = await response.text();
    if (!text) return {} as T;

    // Check if response is JSON
    try {
        return JSON.parse(text);
    } catch {
        // Return text as-is if not JSON
        return text as unknown as T;
    }
}

// ==================== AUTH ====================

export const authApi = {
    login: (credentials: AuthRequest): Promise<AuthResponse> =>
        fetchApi('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        }),

    register: (data: RegisterRequest): Promise<AuthResponse> =>
        fetchApi('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
};

// ==================== PERFUMES ====================

export const perfumeApi = {
    getAll: async (): Promise<Perfume[]> => {
        const raw = await fetchApi<RawPerfume[]>('/perfumes');
        return raw.map(transformPerfume);
    },

    getById: async (id: number): Promise<Perfume> => {
        const raw = await fetchApi<RawPerfume>(`/perfumes/${id}`);
        return transformPerfume(raw);
    },

    search: async (text: string): Promise<Perfume[]> => {
        const raw = await fetchApi<RawPerfume[]>(`/perfumes/search?text=${encodeURIComponent(text)}`);
        return raw.map(transformPerfume);
    },

    getByGender: async (gender: string): Promise<Perfume[]> => {
        const raw = await fetchApi<RawPerfume[]>(`/perfumes/gender/${encodeURIComponent(gender)}`);
        return raw.map(transformPerfume);
    },

    getByBrand: async (brand: string): Promise<Perfume[]> => {
        const raw = await fetchApi<RawPerfume[]>(`/perfumes/brand/${encodeURIComponent(brand)}`);
        return raw.map(transformPerfume);
    },

    getByIngredient: async (name: string): Promise<Perfume[]> => {
        const raw = await fetchApi<RawPerfume[]>(`/perfumes/ingredient?name=${encodeURIComponent(name)}`);
        return raw.map(transformPerfume);
    },
};

// ==================== REVIEWS ====================

export const reviewApi = {
    getByPerfume: async (perfumeId: number): Promise<Review[]> => {
        const raw = await fetchApi<RawReview[]>(`/reviews/perfume/${perfumeId}`);
        return raw.map(transformReview);
    },

    create: (data: CreateReviewRequest): Promise<string> =>
        fetchApi('/reviews', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    delete: (reviewId: number): Promise<string> =>
        fetchApi(`/reviews/${reviewId}`, { method: 'DELETE' }),

    toggleLike: (reviewId: number, userId: number): Promise<number> =>
        fetchApi(`/reviews/${reviewId}/like?userId=${userId}`, { method: 'POST' }),

    getFeed: async (userId: number): Promise<Review[]> => {
        const raw = await fetchApi<RawReview[]>(`/reviews/feed?userId=${userId}`);
        return raw.map(transformReview);
    },

    getByUser: async (userId: number): Promise<Review[]> => {
        const raw = await fetchApi<RawReview[]>(`/reviews/user/${userId}`);
        return raw.map(transformReview);
    },

    getRecent: async (limit: number = 6): Promise<Review[]> => {
        const raw = await fetchApi<RawReview[]>(`/reviews/recent?limit=${limit}`);
        return raw.map(transformReview);
    },
};

// ==================== COMMENTS ====================

export const commentApi = {
    create: (data: CreateCommentRequest): Promise<string> =>
        fetchApi('/comments', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    delete: (commentId: number): Promise<string> =>
        fetchApi(`/comments/${commentId}`, { method: 'DELETE' }),
};

// ==================== USERS ====================

export const userApi = {
    search: (query: string): Promise<UserSummary[]> =>
        fetchApi(`/users/search?query=${encodeURIComponent(query)}`),

    getById: (id: number): Promise<UserSummary> =>
        fetchApi(`/users/${id}`),

    getWishlist: async (userId: number): Promise<Perfume[]> => {
        const raw = await fetchApi<RawPerfume[]>(`/users/${userId}/wishlist`);
        return raw.map(transformPerfume);
    },

    getOwned: async (userId: number): Promise<Perfume[]> => {
        const raw = await fetchApi<RawPerfume[]>(`/users/${userId}/owned`);
        return raw.map(transformPerfume);
    },

    toggleWishlist: (userId: number, perfumeId: number): Promise<string> =>
        fetchApi(`/users/wishlist?userId=${userId}&perfumeId=${perfumeId}`, {
            method: 'POST',
        }),

    toggleOwned: (userId: number, perfumeId: number): Promise<string> =>
        fetchApi(`/users/owned?userId=${userId}&perfumeId=${perfumeId}`, {
            method: 'POST',
        }),

    toggleFriend: (myId: number, targetId: number): Promise<string> =>
        fetchApi(`/users/friend?myId=${myId}&targetId=${targetId}`, {
            method: 'POST',
        }),

    getFriends: async (userId: number): Promise<UserSummary[]> =>
        fetchApi<UserSummary[]>(`/users/${userId}/friends`),
};
