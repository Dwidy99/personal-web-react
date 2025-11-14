export interface ConfigData {
    abbreviation: string;
    tagline: string;
    about: string;
    description: string;
    website_url: string;
    email: string;
    backup_email: string;
    keywords: string;
    meta_text: string;
    google_map: string;
    encryption: string;
    link_text: string;
    link_website: string;
    summary: string;
    site_name: string;
    protocol: string;
    smtp_host: string;
    smtp_port: string;
    smtp_timeout: string;
    smtp_user: string;
    smtp_pass: string;
    pagination: string;
    logo: string;
    icon: string;
    banner: string;
}

export interface FileInputs {
    logo: File | null;
    icon: File | null;
    banner: File | null;
}

export type ValidationErrors = Partial<Record<keyof ConfigData, string[]>>;
