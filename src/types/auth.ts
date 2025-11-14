export interface AuthResponse {
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
    };
    permissions?: string[];
}

export interface ValidationErrors {
    [key: string]: string[] | undefined;
}

export interface ForgotPasswordPayload {
    email: string;
}

export interface ResetPasswordPayload {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}
