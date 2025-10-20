import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://exploreden.com.au'
    
    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
           
        },
        {
            url: `${baseUrl}/search`,
            lastModified: new Date(),
            changeFrequency: 'daily',
          
        },
        {
            url: `${baseUrl}/travel-hub`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
          
        },
        {
            url: `${baseUrl}/all`,
            lastModified: new Date(),
            changeFrequency: 'daily',
           
        },
        {
            url: `${baseUrl}/privacy-policy`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
           
        },
        {
            url: `${baseUrl}/terms-and-conditions`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
           
        },
        {
            url: `${baseUrl}/detail`,
            lastModified: new Date(),
            changeFrequency: 'daily',
           
        },
       
        // Add more static routes as needed
        // Dynamic routes for cities and details would be added here
        // if you have a way to fetch all possible IDs
    ]
} 