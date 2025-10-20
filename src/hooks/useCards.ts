import { useState, useEffect } from 'react';

const ITEMS_PER_PAGE = 16;

export const useCards = (slug: string, currentPage: number) => {
  const [totalItems, setTotalItems] = useState(0);
  const [cards, setCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCards(currentPage);
  }, [currentPage, slug]);

  const fetchCards = async (page: number) => {
    setIsLoading(true);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    await new Promise(resolve => setTimeout(resolve, 1000));

    const dummyCards = Array(100).fill(null).map((_, index) => ({
      imageSrc: '/images/card-1.png',
      title: `${slug} Activity ${index + 1}`,
      id: index + 1,
      rating: (Math.random() * 5).toFixed(1),
      price: `${Math.floor(Math.random() * 500) + 50}`,
      location: 'Tokyo, Japan',
    }));

    setTotalItems(dummyCards.length);
    setCards(dummyCards.slice(startIndex, endIndex));
    setIsLoading(false);
  };

  return { cards, isLoading, totalItems };
};
