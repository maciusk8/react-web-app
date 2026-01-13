// Backend API Types

// Raw response from backend
export interface RawPerfume {
    id: number;
    name_perfume: string;
    brand: string;
    gender: string;
    family: string;
    subfamily?: string;
    description?: string;
    ingredients?: string[];
    image_name?: string;
    reviews?: Review[];
}

// Transformed for frontend use
export interface Perfume {
    id: number;
    name: string;
    brand: string;
    gender: string;
    family: string;
    subfamily?: string;
    description?: string;
    ingredients?: string;
    imageUrl?: string;
    year?: number;
    origin?: string;
    reviews?: Review[];
}

export interface RawReview {
    id: number;
    text: string;
    rating: number;
    author: UserSummary;
    subject?: RawPerfume;
    likes?: UserSummary[];
    likesCount?: number;
    createdAt?: string;
    comments?: Comment[];
}

export interface Review {
    id: number;
    text: string;
    rating: number;
    author: UserSummary;
    subject?: Perfume;
    likes?: UserSummary[];
    likesCount?: number;
    createdAt?: string;
    comments?: Comment[];
}

export interface Comment {
    id: number;
    text: string;
    createdAt: string;
    author: UserSummary;
}

export interface UserSummary {
    id: number;
    username: string;
}

export interface AppUser {
    id: number;
    username: string;
    email: string;
    role: string;
    wishlistPerfumes?: Perfume[];
    ownedPerfumes?: Perfume[];
    friends?: UserSummary[];
}

export interface AuthResponse {
    token: string;
    userId: number;
    username: string;
    role: string;
}

export interface AuthRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface CreateReviewRequest {
    perfumeId: number;
    userId: number;
    text: string;
    rating: number;
}

export interface CreateCommentRequest {
    reviewId: number;
    userId: number;
    text: string;
}
