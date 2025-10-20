'use client';
import { RECOMMENDED_SECTION_SEE_ALL_URL, RECOMMENDED_SECTION_TITLE } from '@/data/staticData'
import React, { } from 'react'
import TextWithSeeAll from './TextWithSeeAll'
import Card from './Cards/Card'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth';
import DataStateHandler from './StateHandlers/DataStateHandler';
import { RecommendationAPI } from '@/services/api';
import { CardProps } from '@/types';
import ShimmerCardGrid from './shimmers/ShimmerCardGrid';
import { Inbox } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import ErrorState from './StateHandlers/ErrorState';
import { Recommendation, RecommendationResponse } from '@/schemas/recommendations';

const RecommendedSection = ({ id, type, isFromDetailsPage = false }: { id?: string, type?: string, isFromDetailsPage?: boolean }) => {
  const { token } = useAuth();


  const { data, isLoading, isPending, error } = useQuery<RecommendationResponse>({
    queryKey: type ? ['recommendations', type] : ['recommendations'],
    queryFn: () => {

      if (!token) {
        throw new Error('User login is required to view recommendations');
      }
      return type
        ? RecommendationAPI.getRecommendedItemsByCategory(token || "", type)
        : RecommendationAPI.getRecommendedItems({ token: token || "" });
    },
    refetchOnWindowFocus: false,
    staleTime: 1 * 60 * 1000,
    retry: 1,
  });

  const mapToCardProps = (item: Recommendation): CardProps => ({
    imageSrc: item.image,
    id: item.id,
    title: item.name,
    rating: "0",
    location: item.location,
    currency: item.currency,
    originalPrice: item.originalPrice?.toString() ?? "0",
    farePrice: item.farePrice?.toString() ?? "0",
  });


  const isEmpty = !isLoading && (!data?.results || data.results.length === 0);

  if (!token) {
    return null;
  }

  return (
    <div className='px-4 md:px-8 lg:px-10 mt-16'>
      <TextWithSeeAll
        title={RECOMMENDED_SECTION_TITLE}
        seeAllUrl={RECOMMENDED_SECTION_SEE_ALL_URL}
        showSeeAll={false}
      />
      <DataStateHandler
        isLoading={isLoading || isPending}
        isEmpty={isEmpty}
        error={error}
        errorComponent={
          <ErrorState message={error?.message || 'Failed to load recommendations'} />
        }
        loadingComponent={
          <ShimmerCardGrid count={8} className='pt-8' />
        }
        emptyComponent={
          <div className="text-center py-10">
            <Inbox className='w-16 h-16 text-primary-300 mx-auto' />
            <p className="text-base text-gray-800">No recommendations available</p>
            <p className='text-sm text-gray-400'>We couldn't find any recommendations for you. Please try again later.</p>
          </div>
        }
      >
        <div className='grid gap-6 pt-8 max-sm:justify-items-center'
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          }}
        >
          {data?.results?.map((item) => (
            <Card
              type={item.type}
              key={item.id}
              card={mapToCardProps(item)}
              className=''
            />
          ))}
        </div>
        {!isFromDetailsPage && data?.count && data.count > 10 && (
          <div className='flex justify-center'>
            <Link
              prefetch={false}
              href={type ? `${RECOMMENDED_SECTION_SEE_ALL_URL}/?category=${type}` : RECOMMENDED_SECTION_SEE_ALL_URL}
              className='bg-primary-400 px-4 py-2 rounded-lg hover:bg-primary-500 duration-300 font-semibold text-base text-background mt-8 mx-auto'
            >
              View More
            </Link>
          </div>
        )}
      </DataStateHandler>
    </div>
  );
};

export default RecommendedSection;
