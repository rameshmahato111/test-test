import TextWithSeeAll from '../TextWithSeeAll'
import CityCard from './CityCard'
import HorizontalCardScroll from '../HorizontalCardScroll'
import { citiesApi } from '@/services/api'
import ShimmerImage from '../shimmers/ShimmerImage'
import ShimmerText from '../shimmers/ShimmerText'
import AsyncDataWrapper from '../StateHandlers/AsyncDataWrapper'

// Loading state components
const CityCardShimmer = () => (
  <div className="py-2">
    <div className="w-[195px] h-[235px] rounded-[4px] relative overflow-hidden">
      <ShimmerImage className="w-full h-full" />
      <div className="absolute bottom-3 left-2 w-3/4">
        <ShimmerText className="text-lg bg-primary-200 opacity-50" />
      </div>
    </div>
  </div>
);

const CitiesLoading = ({ title, seeAllUrl }: { title: string, seeAllUrl: string }) => (
  <>
    <HorizontalCardScroll>
      {[...Array(4)].map((_, index) => (
        <CityCardShimmer key={index} />
      ))}
    </HorizontalCardScroll>
  </>
);

export default function CitiesSection({
  title,
  seeAllUrl,
  id
}: {
  title: string,
  seeAllUrl: string,
  id?: string
}) {
  const fetchCities = async () => {
    if (title.includes('Popular')) {
      return citiesApi.getPopularCities()
    }
    return citiesApi.getNearbyCities(id!);
  };

  return (
    <div className='px-4 md:px-8 lg:px-10 mt-16'>
      <TextWithSeeAll title={title} seeAllUrl={seeAllUrl} />
      <AsyncDataWrapper
        fetchData={() => fetchCities()}
        isEmpty={(data) => data.count === 0}
        loadingComponent={<CitiesLoading title={title} seeAllUrl={seeAllUrl} />}
        emptyMessage="No cities available at the moment"
        errorMessage="Failed to load cities"
      >
        {(data) => (
          <HorizontalCardScroll>
            {data.results.map((city, index) => (
              <CityCard key={city.id} cityCard={city} />
            ))}
          </HorizontalCardScroll>
        )}
      </AsyncDataWrapper>
    </div>
  );
}