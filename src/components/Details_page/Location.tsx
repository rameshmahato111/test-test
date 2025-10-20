"use client"

import React, { useEffect, useRef, useState } from 'react';

interface LocationProps {
    latitude?: number;
    longitude?: number;
    locationName?: string;
}

declare global {
    interface Window {
        mapboxgl: any;
    }
}

const Location: React.FC<LocationProps> = ({
    latitude = 51.505,
    longitude = -0.09,
    locationName = 'Badu store'
}) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!mapContainer.current || !window.mapboxgl) return;

        window.mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

        const map = new window.mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/sauravniraula/clz621qdh00p501pffpf63mg9',
            center: [longitude, latitude],
            zoom: 13
        });

        // Add navigation controls
        map.addControl(new window.mapboxgl.NavigationControl(), 'top-right');

        // Add marker
        new window.mapboxgl.Marker()
            .setLngLat([longitude, latitude])
            .setPopup(new window.mapboxgl.Popup().setHTML(`<h3>${locationName}</h3>`))
            .addTo(map);

        // Handle map load complete
        map.on('load', () => {
            setIsLoading(false);
        });

        // Cleanup
        return () => map.remove();
    }, [latitude, longitude, locationName]);

    return (
        <div className="py-8 md:py-14">
            <h4 className='text-xl md:text-3xl pb-3 md:pb-8 text-foreground font-semibold'>Location</h4>
            <div className="relative w-full h-[480px] overflow-hidden rounded-lg">
                {isLoading && (
                    <div className="absolute inset-0 rounded-lg overflow-hidden">
                        <div className="w-full h-full bg-gray-200 animate-pulse">
                            <div className="h-full w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"
                                style={{
                                    backgroundSize: '400% 100%',
                                    animation: 'shimmer 1.5s infinite'
                                }}
                            />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-gray-400 flex flex-col items-center">
                                <svg
                                    className="animate-spin h-8 w-8 mb-2"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                <span>Loading map...</span>
                            </div>
                        </div>
                    </div>
                )}
                <div
                    ref={mapContainer}
                    className={`w-full h-[480px] rounded-lg ${isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}
                />
            </div>
        </div>
    );
};

export default Location;
