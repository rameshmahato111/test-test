'use client'
import HorizontalCardScroll from "../HorizontalCardScroll";
import Card from "../Cards/Card";
import TextWithSeeAll from "../TextWithSeeAll";
import { cn } from "@/lib/utils";
import { detailAPI } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import DataStateHandler from "../StateHandlers/DataStateHandler";
import ShimmerHorizontalCards from "../shimmers/ShimmerHorizontalCards";
import EmptyState from "../StateHandlers/EmptyState";
import ErrorState from "../StateHandlers/ErrorState";
import { Nearby } from "@/schemas/nearby";
import { useAuth } from "@/hooks/useAuth";


export default function NearbySection({ id, className, type }: { id: string, className?: string, type: string }) {
    const { token } = useAuth();
    const { data, isLoading, error } = useQuery({
        queryKey: ['nearby', type, id, token],
        queryFn: async () => {
            try {
                return type === 'hotel' ? await detailAPI.getHotelNearyBy(id, token) : await detailAPI.getActivityNearyBy({ id, token });
            } catch (error) {
                throw error;
            }
        },
        refetchOnWindowFocus: false,
        retry: false,

    })


    return (
        <div className={cn("w-full", className)}>
            <TextWithSeeAll title="Nearby" showSeeAll={false} />
            <DataStateHandler
                isLoading={isLoading}
                isEmpty={data?.count === 0 || !data}
                error={error}

                loadingComponent={<ShimmerHorizontalCards />}
                emptyComponent={<EmptyState message="No nearby items found" />}
                // @ts-ignore
                errorComponent={<ErrorState message={error?.message || error?.error || 'Failed to load nearby items'} />}
            >
                <HorizontalCardScroll>
                    {data?.results?.map((card: Nearby) => (
                        <Card type={card.type} key={card.id} card={{
                            id: card.id,
                            imageSrc: card.image,
                            title: card.name,
                            location: card.location,
                            currency: card.currency,
                            originalPrice: card.originalPrice?.toString() ?? "0",
                            farePrice: card.farePrice?.toString() ?? "0",
                        }} />
                    ))}
                </HorizontalCardScroll>
            </DataStateHandler>

        </div>
    );
}

// RSC
{/* <AsyncDataWrapper
    fetchData={() => callFn}
    isEmpty={(data: any) => !data?.length}
    emptyMessage="No nearby items found"
    errorMessage="Error fetching nearby items"

>
    {(data) => (
        <HorizontalCardScroll>
            {data.map((card: NearbyCardProps) => (
                <Card type='hotel' key={card.id} card={{
                    id: card.id,
                    imageSrc: card.image,
                    title: card.name,
                    location: card.location,
                    price: card.minPrice,
                }} />
            ))}
        </HorizontalCardScroll>
    )}
</AsyncDataWrapper> */}