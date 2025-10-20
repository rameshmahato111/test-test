import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Loader2, Search } from 'lucide-react'
import { Button } from '../ui/button'
import SearchSuggestions from './SearchSuggestions'
import { useSearch } from '@/hooks/useSearch';
import { Tabs } from '@/types/enums';
import { validateActivitySearch } from '@/app/validations/activitySearchValidator';
import { useToast } from '@/hooks/use-toast'
import { ActivityApi } from '@/services/api/activites';


const ActivitiesSearch = () => {
    const { getSearchParams, performSearch } = useSearch();
    const { toast } = useToast();
    const searchParams = getSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams?.query || '');
    const [shouldFetch, setShouldFetch] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const searchRef = useRef<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const debouncedFetchSuggestions = useCallback((query: string) => {
        if (!query || !shouldFetch) {
            setFilteredSuggestions([]);
            setShowSuggestions(false);
            return;
        }
        setIsLoading(true);
        ActivityApi.getActivityQuerySuggestions(query)
            .then((suggestions) => {
                setFilteredSuggestions(suggestions);
                setShowSuggestions(suggestions.length > 0);
            })
            .catch((error) => {
                console.error('Error fetching suggestions:', error);
                setFilteredSuggestions([]);
                setShowSuggestions(false);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [shouldFetch]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            debouncedFetchSuggestions(searchTerm);
        }, 300); // 300ms delay

        return () => clearTimeout(timeoutId);
    }, [searchTerm, debouncedFetchSuggestions]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        setShouldFetch(true);
        setShowSuggestions(true);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setSearchTerm(suggestion);
        setShouldFetch(false);
        setShowSuggestions(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            searchRef.current &&
            !searchRef.current.contains(event.target as Node)
        ) {
            setShowSuggestions(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    const handleSearch = () => {
        const validationResult = validateActivitySearch({
            query: searchTerm
        });

        if (!validationResult.isValid) {
            validationResult.errors.forEach(error => {
                toast({
                    title: error,
                    variant: 'destructive'
                });
            });
            return;
        }

        performSearch({
            tab: Tabs.Activities,
            query: searchTerm,
            sort: 'relevance',
            city: 'Sydney',
            longitude: '151.2153',
            latitude: '-33.8568'

        });
        setShowSuggestions(false);
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };
    return (
        <div className='flex flex-col md:flex-row items-center w-full relative gap-4 py-10' ref={searchRef}>
            <Label htmlFor='activity' className='w-full'>
                <div className='flex w-full items-center bg-background shadow-searchShadow rounded-lg border  px-3 border-gray-200'>
                    <Search className='w-5 h-5 text-gray-700 ' />
                    <Input
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                        id='activity'
                        autoComplete='off'
                        placeholder='Places to go, things to do and many more ......'
                        className='border-none font-inter w-full focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-offset-background placeholder:text-gray-500 text-sm placeholder:text-sm placeholder:font-normal font-medium'
                    />
                    {isLoading && (
                        <div className="absolute right-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                        </div>
                    )}
                </div>

            </Label>
            <Button onClick={handleSearch} className='w-full lg:w-[10%]  bg-primary-400 hover:bg-primary-500 duration-300 text-white rounded-xl text-base font-semibold'>
                Search
            </Button>
            {showSuggestions && searchTerm && filteredSuggestions.length > 0 && (
                <SearchSuggestions
                    suggestions={filteredSuggestions}
                    searchTerm={searchTerm}
                    className='top-[80%] md:top-[70%]'
                    onSuggestionClick={handleSuggestionClick}
                    isFromActivities={true}
                />
            )}
        </div>
    )
}

export default ActivitiesSearch
