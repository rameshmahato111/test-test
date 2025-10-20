import { ContentType } from '@/enums';
import EmptyState from '@/components/StateHandlers/EmptyState';
import AllCategoryItems from '@/components/all/AllCategoryItems';
import AllCitites from '@/components/all/AllCitites';
import AllDeals from '@/components/all/AllDeals';
import AllTrending from '@/components/all/AllTrending';
import AllRecommendation from '@/components/all/AllRecommendation';
import { notFound } from 'next/navigation';


export const generateMetadata = async ({ params, searchParams }: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{ page?: string, id?: string, category?: string }>
}) => {
    const { slug } = await params;
    const { page = '1', category } = await searchParams;

    const title = slug === 'category' ? category : slug === 'recommended' ? 'Recommended' : slug === 'cities' ? 'Cities' : slug === 'deals' ? 'Deals' : slug === 'trendings' ? 'Trendings' : slug;
    return {
        title: `${title} | Exploreden`,
        description: `${title} | Exploreden`,
        keywords: [`${title}`, 'Exploreden', `${title}`, 'Exploreden'],
    }
}



const Page = async ({ params, searchParams }: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{ page?: string, id?: string }>
}) => {
    const { slug } = await params;
    const { page = '1', id: category_id } = await searchParams;

    if (!Object.values(ContentType).includes(slug as ContentType)) {
        return <EmptyState className='h-[80vh]' message={`${slug} Not Found`} />;
    }
    const contentType = slug as ContentType;

    if (contentType === ContentType.Recommended) {
        return (
            <AllRecommendation />
        );
    } else if (contentType === ContentType.Category) {
        if (!category_id) {
            return <EmptyState className='h-[80vh]' message={`Category ID is required`} />
        }
        return <AllCategoryItems id={parseInt(category_id)} />
    } else if (contentType === ContentType.Cities) {
        return <AllCitites page={parseInt(page)} />
    } else if (contentType === ContentType.Deals) {
        return <AllDeals page={parseInt(page)} />
    } else if (contentType === ContentType.Trendings) {
        return <AllTrending page={parseInt(page)} />
    } else {
        notFound();
    }
};

export default Page;
