import { useSearchParams, useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { SearchParams } from '@/types/search';
import { Tabs } from '@/types/enums';

export const useSearch = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const getSearchParams = useCallback(() => {
    const tab = searchParams.get('tab') ;
    switch (tab) {
      case Tabs.Hotel:
        return {
          tab,
          hotel_query: searchParams.get('hotel_query') || '',
          start_date: searchParams.get('start_date'),
          end_date: searchParams.get('end_date'),
          no_of_rooms: searchParams.get('no_of_rooms'),
          no_of_adults: searchParams.get('no_of_adults'),
          no_of_children: searchParams.get('no_of_children'),
          ages_of_children: searchParams.get('ages_of_children'),
          nationality: searchParams.get('nationality'),
          sort: searchParams.get('sort') || 'relevance'
        };
        
      case 'flight':
        return {
          tab,
          origin: searchParams.get('origin') || '',
          destination: searchParams.get('destination') || '',
          departureDate: searchParams.get('departureDate') || '',
          returnDate: searchParams.get('returnDate') || '',
          class: searchParams.get('class') || 'Business Class',
          nationality: searchParams.get('nationality') || '',
          tripType: searchParams.get('tripType') || 'one-way',
          travelers: searchParams.get('travelers') || '1',
          sort: searchParams.get('sort') || 'relevance'
        };

      case Tabs.Activities:
        return {
          tab,
          query: searchParams.get('query') || '',
          sort: searchParams.get('sort') || 'relevance'
        //   category: searchParams.get('category') || 'All categories'
        };

      default:
        return null;
    }
  }, [searchParams]);

  const performSearch = useCallback((params: SearchParams) => {
    const searchQuery = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (typeof value === 'object') {
          searchQuery.set(key, JSON.stringify(value));
        } else {
          searchQuery.set(key, value.toString());
        }
      }
    });
    // console.log('search query in PERFROM', searchQuery.toString());
    
    router.push(`/search/?${searchQuery.toString()}`);
  }, [router]);

  return {
    getSearchParams,
    performSearch
  };
};