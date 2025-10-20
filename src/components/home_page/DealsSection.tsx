'use client';
import { DealsApi } from "@/services/api";
import Card from "@/components/Cards/Card";
import { DEAL_SECTION_TITLE, DEAL_SECTION_SEE_ALL_URL } from "@/data/staticData";
import HorizontalCardScroll from "../HorizontalCardScroll";
import TextWithSeeAll from "../TextWithSeeAll";
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import DataStateHandler from "../StateHandlers/DataStateHandler";
import ShimmerHorizontalCards from "../shimmers/ShimmerHorizontalCards";
import EmptyState from "../StateHandlers/EmptyState";
import ErrorState from "../StateHandlers/ErrorState";

export default function DealsSection({ city, city_id }: { city?: string, city_id?: string }) {
    const { token } = useAuth();
    const { data: deals, isLoading, error } = useQuery({
        queryKey: ['deals', token, city_id, city],
        queryFn: () => DealsApi.getDeals({ city, city_id, token }),

    });
    return (
        <div className="px-4 md:px-8 lg:px-10">
            <DataStateHandler
                isLoading={isLoading}
                error={error}
                isEmpty={!deals?.count}
                errorComponent={<ErrorState message={error?.message ?? 'Error fetching deals'} />}
                emptyComponent={<EmptyState message={`No Deals Found ${city_id ? `for ${city}` : ''}`} />}
                loadingComponent={<ShimmerHorizontalCards />}

            >
                <>
                    <TextWithSeeAll title={DEAL_SECTION_TITLE} seeAllUrl={DEAL_SECTION_SEE_ALL_URL} showSeeAll={deals && deals!.count > 10} />
                    <HorizontalCardScroll>
                        {deals?.results.map((card) => (
                            <Card type={card.type.toLowerCase()} key={card.id} card={{
                                id: card.id,
                                imageSrc: card.image || '/images/default-image.png',
                                title: card.name,
                                rating: '0',
                                location: card.location,
                                discount: card.discountPCT.toString(),
                                currency: card.currency,
                                showBadge: card.discountPCT > 0,
                                originalPrice: card.originalPrice.toString(),
                                farePrice: card.farePrice.toString(),
                            }} />
                        ))}
                    </HorizontalCardScroll>
                </>

            </DataStateHandler>
        </div>
    );
}

