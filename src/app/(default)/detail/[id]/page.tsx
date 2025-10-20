import { notFound } from 'next/navigation';
import DetailPageContent from '@/components/Details_page/DetailPageContent'
import Wrapper from '@/components/Wrapper';
import RecommendedSection from '@/components/RecommendedSection';
import ShimmerDetailPage from '@/components/shimmers/ShimmerDetailPage';
import { Suspense } from 'react';
import ShimmerHorizontalCards from '@/components/shimmers/ShimmerHorizontalCards';
import NearbySection from '@/components/Details_page/NearbySection';
import { Metadata } from 'next';

type ValidTypes = 'hotel' | 'activity';

export async function generateMetadata({
    params,
    searchParams
}: {
    params: Promise<{ id: string }>,
    searchParams: Promise<{ type: ValidTypes }>
}): Promise<Metadata> {
    const { id } = await params;
    const { type } = await searchParams;

    const isHotel = type === 'hotel';
    const isActivity = type === 'activity';

    const typeTitle = isHotel ? 'Hotel' : isActivity ? 'Activity' : 'Experience';
    const typeDescription = isHotel
        ? 'Book this amazing hotel and enjoy comfortable accommodation'
        : 'Discover this exciting activity and create unforgettable memories';

    return {
        title: `${typeTitle} Details & Booking - Exploreden`,
        description: `${typeDescription} with Exploreden. View details, photos, reviews, and book your ${type} experience. Compare prices and find the best deals.`,
        keywords: [
            `${type} booking`,
            `${type} details`,
            `${type} reviews`,
            isHotel ? 'hotel accommodation' : 'travel activity',
            isHotel ? 'hotel reservation' : 'activity booking',
            'travel booking',
            'travel experiences',
            'vacation planning',
            `best ${type}`,
            'travel deals'
        ],
        openGraph: {
            title: `${typeTitle} Details & Booking - Exploreden`,
            description: `${typeDescription} with Exploreden. View details, photos, and reviews.`,
            url: `https://exploreden.com.au/detail/${id}?type=${type}`,
            type: 'article',
        },
        twitter: {
            title: `${typeTitle} Details & Booking - Exploreden`,
            description: `${typeDescription} with Exploreden. View details, photos, and reviews.`,
        },
        alternates: {
            canonical: `https://exploreden.com.au/detail/${id}?type=${type}`,
        },
    }
}

const DetailPage = async ({
    params,
    searchParams
}: {
    params: Promise<{ id: string }>,
    searchParams: Promise<{
        availability?: string,
        type: ValidTypes
    }>
}) => {
    const { id } = await params;
    const { type } = await searchParams;

    if (!['hotel', 'activity'].includes(type || '')) {
        notFound();
    }



    return (

        <Suspense fallback={<ShimmerDetailPage />}>
            <Wrapper>
                <DetailPageContent type={type} id={id} />
                <Suspense fallback={<ShimmerHorizontalCards />}>
                    <NearbySection id={id} className="px-4 md:px-8 lg:px-10" type={type} />
                </Suspense>
                <Suspense fallback={<ShimmerHorizontalCards />}>
                    <RecommendedSection isFromDetailsPage={true} type={type} id={id} />
                </Suspense>
            </Wrapper>
        </Suspense>

    );
};

export default DetailPage;

