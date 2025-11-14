export interface AuthCredentials {
    email: string;
    password: string;
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

export interface ValidationErrors {
    [key: string]: string[] | undefined;
}
