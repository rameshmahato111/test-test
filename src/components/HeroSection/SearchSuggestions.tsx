import { cn } from '@/lib/utils';
import React from 'react';
import { HotelSearchSuggestions } from '@/types/search';
import { ActivityIcon, HotelIcon } from 'lucide-react';

interface SearchSuggestionsProps {
    suggestions: HotelSearchSuggestions | string[];
    searchTerm: string;
    onSuggestionClick: (suggestion: string) => void;
    className?: string;
    isFromActivities?: boolean;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
    suggestions,
    searchTerm,
    onSuggestionClick,
    className,
    isFromActivities = false
}) => {

    const isHotelSuggestionObject = (suggestion: any): suggestion is HotelSearchSuggestions => {
        return typeof suggestion === 'object' && suggestion !== null && 'regions' in suggestion && 'hotels' in suggestion;
    };
    return (
        <ul className={cn(`absolute  top-[90%] md:top-full mt-2 py-4 px-3 shadow-searchSuggestionShadow bg-background rounded-xl w-full md:w-[450px] max-h-[280px] md:max-h-[330px] overflow-y-auto`, className)}>
            {isHotelSuggestionObject(suggestions) ? (
                <>
                    {/* Regions Section */}
                    {suggestions.regions.length > 0 && (
                        <>
                            <li className="px-3 py-2 text-base font-semibold text-gray-700 bg-gray-50 rounded-lg ">
                                Regions
                            </li>
                            {suggestions.regions.map((region, index) => (
                                <li
                                    key={`region-${index}`}
                                    className="flex items-start gap-3 px-3 py-3 cursor-pointer hover:bg-primary-50 rounded-lg transition-colors duration-200 mb-1 group"
                                    onClick={() => onSuggestionClick(region.name)}
                                >
                                    <div className="mt-1">
                                        <img
                                            src="/icons/location.svg"
                                            alt="Location icon"
                                            className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-base font-medium text-gray-900 mb-0.5">
                                            {region.name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {region.country_flag}    {region.location_detail}, {region.country}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </>
                    )}

                    {/* Hotels Section */}
                    {suggestions.hotels.length > 0 && (
                        <>
                            <li className="px-3 py-2 text-base font-semibold text-gray-700 bg-gray-50 rounded-lg ">
                                Hotels
                            </li>
                            {suggestions.hotels.map((hotel, index) => (
                                <li
                                    key={`hotel-${index}`}
                                    className="flex items-start gap-3 px-3 py-3 cursor-pointer hover:bg-primary-50 rounded-lg transition-colors duration-200 mb-1 group"
                                    onClick={() => onSuggestionClick(hotel.name)}
                                >
                                    <div className="mt-1">
                                        {/* <img
                                            src="/icons/location.svg"
                                            alt="Hotel icon"
                                            className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
                                        /> */}
                                        <HotelIcon className='w-5 h-5 group-hover:scale-110 transition-transform duration-200' />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-base font-medium text-gray-900 mb-0.5">
                                            {hotel.name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {hotel.country_flag}  {hotel.address}, {hotel.city}, {hotel.country_name}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </>
                    )}
                </>
            ) : (
                // Fallback for string array suggestions
                (suggestions as string[]).map((suggestion, index) => (
                    <li
                        key={index}
                        className="flex items-start gap-3 px-3 py-3 cursor-pointer hover:bg-primary-50 rounded-lg transition-colors duration-200 mb-1 group"
                        onClick={() => onSuggestionClick(suggestion)}
                    >
                        <div className="mt-1">
                            {/* <img
                                src="/icons/location.svg"
                                alt="Location icon"
                                className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
                            /> */}
                            <ActivityIcon className='w-5 h-5 group-hover:scale-110 transition-transform duration-200' />
                        </div>
                        <div className="flex-1">
                            <p className="text-base font-medium text-gray-900">
                                {suggestion}
                            </p>
                        </div>
                    </li>
                ))
            )}

        </ul>
    );
};

export default SearchSuggestions;
