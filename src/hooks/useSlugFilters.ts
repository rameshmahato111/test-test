import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const useSlugFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    sort: 'recommendation',
    city: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    const newFilters = {
      sort: searchParams.get('sort') || 'recommendation',
      city: searchParams.get('city') || '',
      startDate: searchParams.get('startDate') || '',
      endDate: searchParams.get('endDate') || '',
    };
    setFilters(newFilters);
  }, [searchParams]);

  const updateFilters = (newParams: Partial<typeof filters>) => {
    const updatedFilters = { ...filters, ...newParams };
    setFilters(updatedFilters);

    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  return { filters, updateFilters };
};
