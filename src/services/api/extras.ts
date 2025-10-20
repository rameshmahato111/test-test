import { BlogCard, SocialMediaLinkResponse } from "@/types/extras"
import { API_BASE_URL } from "./client"
import { getHeaders } from "../headers";

class Extras {
    static async getHeroImage(): Promise<string> {
     
        try {
            const response = await fetch(`${API_BASE_URL}/core/hero-images/`);
            if (!response.ok) {
                throw new Error('Failed to fetch hero image');
            }
            const data = await response.json();
            return data && data.results && data.results.length > 0 && data.results[0] && data.results[0].image || "/images/hero_bg.png";
        } catch (error) {
            console.error('Error fetching hero image:', error);
            throw error;
        }
    }
    
    static async getSocialMediaLinks(): Promise<SocialMediaLinkResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/social-links/`, {
                next: { revalidate: 60 }
            });
            if (!response.ok) {
                // Return fallback data if the API fails
                return {
                    id: 1,
                    linkedin: null,
                    facebook: null,
                    instagram: null,
                    twitter: null,
                    youtube: null,
                    tiktok: null,
                    pinterest: null,
                    whatsapp: null,
                    telegram: null
                };
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching social media links:', error);
            // Return fallback data on error
            return {
                id: 1,
                linkedin: null,
                facebook: null,
                instagram: null,
                twitter: null,
                youtube: null,
                tiktok: null,
                pinterest: null,
                whatsapp: null,
                telegram: null
            };
        }
    }

    static async getBlogs(): Promise<
    {
        date: string;
        link: string;
        title: { rendered: string };
        excerpt: { rendered: string; protected: boolean };
        featured_media: number;
        image?: string;
    }[]
> {
    try {
        const response = await fetch(
            "https://blog.exploreden.com.au/wp-json/wp/v2/posts?per_page=3&_fields=title,excerpt,link,featured_media,date"
        );
        const posts = await response.json();

        // Debug log to inspect the response
        console.log("Blog posts API response:", posts);

        // Ensure posts is an array and not null/undefined
        if (!posts || !Array.isArray(posts) || posts.length === 0) {
            return [];
        }

        // Fetch images for each post
        const postsWithImages = await Promise.all(
            posts.map(async (post: any) => {
                let image = null;
                if (post && post.featured_media) {
                    try {
                        const mediaRes = await fetch(
                            `https://blog.exploreden.com.au/wp-json/wp/v2/media/${post.featured_media}`
                        );
                        if (mediaRes.ok) {
                            const mediaData = await mediaRes.json();
                            image = mediaData?.source_url || null;
                        }
                    } catch {
                        image = null;
                    }
                }
                return { ...post, image };
            })
        );

        return postsWithImages;
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return [];
    }
}
     static async saveFlightSearch(data: any,token:string) {
        try {
       const response = await fetch(`${API_BASE_URL}/core/plane-ticket-booking/`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: getHeaders(token)
       });
       if(response.status !== 201){
        return {
            success: false,
            message: 'Failed to save flight search'
        }
       }
       const res = await response.json();
       return res;
    } catch (error) {
        console.error('Error saving flight search:', error);
        throw error;
    }
    }


    static async ContactUs(data:any,token:string){
        try {

            const response = await fetch(`${API_BASE_URL}/core/contact/send_feedback/`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: getHeaders(token)
            });
            if(response.status !== 201){
               return {
                success: false,
                message: 'Failed to send feedback'
               }
            }
            return {
                success: true,
                message: 'Feedback sent successfully'
            }
        } catch (error) {
            console.error('Error sending feedback:', error);
            throw error;
        }
    }

   
}

export default Extras;
