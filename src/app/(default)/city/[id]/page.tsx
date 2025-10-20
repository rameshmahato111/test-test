import CategoryTags from '@/components/CategoryTags'
import CitiesSection from '@/components/City/CitiesSection'
import ImageWithTitle from '@/components/ImageWithTitle'
import Loader from '@/components/Loader'
import DataStateHandler from '@/components/StateHandlers/DataStateHandler'
import Wrapper from '@/components/Wrapper'
import { categoriesApi, citiesApi } from '@/services/api'
import React from 'react'
import EmptyState from '@/components/StateHandlers/EmptyState'
import DealsSection from '@/components/home_page/DealsSection'
import { City } from '@/schemas/cities'
import CategoriesByCity from '@/components/CategoriesSection/CategoriesByCity'
import { Category } from '@/schemas/categories'
import CityRecommendation from '@/components/City/CityRecommendation'
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;

    try {
        const cityDetails = await citiesApi.getCityDetails(id);

        if (!cityDetails) {
            return {
                title: 'City Not Found - Exploreden',
                description: 'The city you are looking for could not be found.',
            }
        }

        const cityName = cityDetails.name;
        const cityImage = cityDetails.image || `/images/city-1.png`;

        return {
            title: `${cityName} Travel Guide & Experiences - Exploreden`,
            description: `Discover the best of ${cityName} with Exploreden. Find top attractions, experiences, hotels, and travel deals. Plan your perfect trip to ${cityName} with our comprehensive travel guide.`,
            keywords: [
                cityName,
                `${cityName} travel`,
                `${cityName} tourism`,
                `${cityName} attractions`,
                `${cityName} experiences`,
                `${cityName} hotels`,
                `${cityName} activities`,
                `visit ${cityName}`,
                `${cityName} travel guide`,
                'travel planning',
                'destination guide'
            ],
            openGraph: {
                title: `${cityName} Travel Guide & Experiences - Exploreden`,
                description: `Discover the best of ${cityName} with Exploreden. Find top attractions, experiences, and travel deals.`,
                url: `https://exploreden.com.au/city/${id}`,
                images: [
                    {
                        url: cityImage,
                        width: 1200,
                        height: 630,
                        alt: `${cityName} - Travel Destination`,
                    },
                ],
                type: 'article',
            },
            twitter: {
                title: `${cityName} Travel Guide & Experiences - Exploreden`,
                description: `Discover the best of ${cityName} with Exploreden. Find top attractions, experiences, and travel deals.`,
                images: [cityImage],
            },
            alternates: {
                canonical: `https://exploreden.com.au/city/${id}`,
            },
        }
    } catch (error) {
        return {
            title: 'City Details - Exploreden',
            description: 'Explore amazing city destinations and experiences with Exploreden.',
        }
    }
}

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    let cityDetails: City | null = null;
    let categories: Category[] | null = null;
    let error: Error | null = null;

    try {
        const [cityData, categoriesData] = await Promise.all([
            citiesApi.getCityDetails(id),
            categoriesApi.getCategoriesByCity(id)
        ]);
        cityDetails = cityData;
        categories = categoriesData;
    } catch (err) {
        error = err as Error;
    }


    return (
        <Wrapper>

            <DataStateHandler
                isEmpty={cityDetails === null}
                error={error}
                errorComponent={
                    <div className="min-h-[100vh] flex items-center justify-center">

                        <EmptyState message={error?.message || "Unable to load city details"} />
                    </div>
                }
                loadingComponent={<Loader />}
                emptyComponent={<div>No data found</div>}>

                {cityDetails && (
                    <>
                        <ImageWithTitle title={cityDetails.name} image={cityDetails.image || `/images/city-1.png`} />
                        <CategoriesByCity categories={categories || []} city={cityDetails.name} />
                        <DealsSection city={cityDetails.name} city_id={id} />
                        <CityRecommendation city={cityDetails.name} />
                        {
                            categories && categories.length > 0 && categories.map((category) => (
                                <CategoryTags key={category.id} city={cityDetails.name} category={category.name} category_id={category.id} />
                            ))
                        }
                        {
                            !categories || categories.length === 0 && (
                                <div className="flex items-center justify-center">
                                    <EmptyState message="No categories found" />
                                </div>
                            )
                        }
                        <CitiesSection id={id} title="Nearby Cities" seeAllUrl="/cities" />
                    </>
                )}
            </DataStateHandler>
        </Wrapper>
    )
}

export default page;
