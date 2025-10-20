import CategoryItemCard from "../CategoriesSection/CategoryItemCard";
import HorizontalCardScroll from "../HorizontalCardScroll";
import AllCategoriesCard from "../CategoriesSection/AllCategoriesCard";
import { categoriesApi } from "@/services/api/categories";
import ShimmerContainer from "../shimmers/ShimmerContainer";
import DataStateHandler from "../StateHandlers/DataStateHandler";
import { useQuery } from "@tanstack/react-query";
import EmptyState from "../StateHandlers/EmptyState";
import ErrorState from "../StateHandlers/ErrorState";



const AllCategories = ({ selectedCategory, city }: { selectedCategory: string, city?: string }) => {
    const { data, isLoading, isError, error, isFetched } = useQuery({
        queryKey: ['allCategoriesItems'],
        queryFn: () => categoriesApi.getCategories(),
        retry: false,
        staleTime: 0,
        refetchOnWindowFocus: false,
    })
    return (
        <div className="">
            <DataStateHandler
                isLoading={isLoading}
                error={error}
                isEmpty={false}
                loadingComponent={<CategoriesLoading />}
                emptyComponent={<EmptyState message="No categories available at the moment" />}
                errorComponent={<ErrorState message="Unable To Get Categories" />}

            >
                <HorizontalCardScroll showArrows={true} stretchItems={false} className="relative z-10">
                    {data && data.map((category) => (
                        <CategoryItemCard
                            key={category.id}
                            id={category.id}
                            iconSrc={category.image ?? '/images/default-image.png'}
                            label={category.name}
                            selected={category.name === selectedCategory}
                            city={city}
                        />
                    ))}
                </HorizontalCardScroll>
            </DataStateHandler>
        </div>

    );
};
export default AllCategories;


// states components
const CategoriesLoading = () => (
    <HorizontalCardScroll showArrows={false} stretchItems={false}>
        {[...Array(10)].map((_, index) => (
            <ShimmerContainer key={index} width="90px" height="100px" />
        ))}
    </HorizontalCardScroll>
);
