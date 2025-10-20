import CategoryItemCard from "./CategoryItemCard";
import HorizontalCardScroll from "../HorizontalCardScroll";
import AllCategoriesCard from "./AllCategoriesCard";
import { categoriesApi } from "@/services/api/categories";
import ShimmerContainer from "../shimmers/ShimmerContainer";
import AsyncDataWrapper from "../StateHandlers/AsyncDataWrapper";



const Categories = () => {
  return (
    <div className="px-4 md:px-8 lg:px-10 py-10">
      <AsyncDataWrapper
        fetchData={categoriesApi.getCategories}
        loadingComponent={<CategoriesLoading />}
        isEmpty={(categories) => !categories.length}
        emptyMessage="No categories available at the moment"
        errorMessage="Unable To Get Categories"

      >
        {
          (categories) => (
            <HorizontalCardScroll showArrows={true} stretchItems={false} className="relative z-10">
              {categories.map((category) => (
                <CategoryItemCard
                  key={category.id}
                  id={category.id}
                  iconSrc={category.image ?? '/images/default-image.png'}
                  label={category.name}
                />
              ))}
              <AllCategoriesCard categories={categories} />

            </HorizontalCardScroll>
          )
        }
      </AsyncDataWrapper>
    </div>

  );
};
export default Categories;


// states components
const CategoriesLoading = () => (
  <HorizontalCardScroll showArrows={false} stretchItems={false}>
    {[...Array(10)].map((_, index) => (
      <ShimmerContainer key={index} width="90px" height="100px" />
    ))}
  </HorizontalCardScroll>
);
