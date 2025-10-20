export interface SocialMediaLinkResponse {
    id: number;
    linkedin: string | null;
    facebook: string | null;
    instagram: string | null;
    twitter: string | null;
    youtube: string | null;
    tiktok: string | null;
    pinterest: string | null;
    whatsapp: string | null;
    telegram: string | null;
}


export interface BlogCard {
    uuid: number;
    title: string;
    excerpt: string;
    feature_image: string;
    published_at: string;
    url: string;
}