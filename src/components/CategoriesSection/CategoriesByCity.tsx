import React from 'react'
import HorizontalCardScroll from '../HorizontalCardScroll'
import CategoryItemCard from './CategoryItemCard'
import AllCategoriesCard from './AllCategoriesCard'
import { Category } from '@/schemas/categories'




const CategoriesByCity = ({ categories, city }: { categories: Category[], city: string }) => {
  return (
    <div className='px-4 md:px-8 lg:px-10 py-10'>

      <HorizontalCardScroll showArrows={false} stretchItems={false} className="relative">
        {categories.map((category) => (
          <CategoryItemCard
            key={category.id}
            id={category.id}
            iconSrc={category.image ?? '/images/default-image.png'}
            label={category.name}
            city={city}
          />
        ))}
        <AllCategoriesCard categories={categories} />

      </HorizontalCardScroll>

    </div>
  )
}

export default CategoriesByCity