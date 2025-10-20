import { GalleryImage } from "@/types";

export const description = `Lorem ipsum dolor sit amet consectetur. Convallis nisl aliquet vitae interdum amet. Pellentesque ut sit porta ac. Duis pretium scelerisque mauris sagittis maecenas arcu iaculis. Auctor tincidunt vel tristique neque urna augue pellentesque. Morbi in faucibus commodo odio sit justo enim enim.
        Sem nulla lectus turpis in. Felis sed id massa viverra eget amet augue amet vehicula. Vel netus in vestibulum scelerisque nibh odio tristique. Molestie auctor purus vitae non leo ultrices. Vel imperdiet lorem in tristique.`;

export const accordionData = {
    included: [
        "Boston to Salem aboard High-Speed Catamaran",
        "See the stunning views of the Boston Skyline during your sail",
        "Skip the summer and Halloween traffic with this leisurely sail to Salem, MA"
    ],
    notIncluded: [
        "Boston to Salem aboard High-Speed Catamaran",
        "See the stunning views of the Boston Skyline during your sail",
        "Skip the summer and Halloween traffic with this leisurely sail to Salem, MA"
    ],
    highlights: [
        "Enjoy a hearty 2 or 3-course meal with American classics and refreshing drinks, surrounded by live music at the famous Hard Rock Cafe in Munich.",
        "Delight in burgers, sandwiches, cheese pasta, chicken tenders, salads, and more, with dessert items such as a brownie or cheesecake to choose from.",
        "Marvel at rock memorabilia from renowned musicians and signature merchandise at the Rock Shop and the new Hard Rock Couture store within the cafe.",
        "Opt between the Gold or Diamond Menu for lunch or dinner with priority seating with tea, coffee, or a soft drink included."
    ],
    meetingPoint: {
        startLocation: "Location 1 Name",
        endLocation: "Salem, MA, USA"
    }
};

export const ratingData = {
    ratings: [
        { stars: 5, count: 25 },
        { stars: 4, count: 15 },
        { stars: 3, count: 7 },
        { stars: 2, count: 3 },
        { stars: 1, count: 2 }
    ],
    totalReviews: 52
};

export const reviews = [
    {
        userImage: '/images/chat-with-us.png',
        userName: 'Courtney Henry',
        rating: 3,
        timeAgo: '2 mins ago',
        review: 'Lorem ipsum dolor sit amet consectetur. Fermentum tincidunt egestas feugiat scelerisque phasellus ut tortor ipsum. Sed scelerisque cras sit massa egestas cras viverra tellus donec. Fames nibh eu ut sagittis nibh. Ultrices in leo euismod pulvinar netus morbi pulvinar ac maecenas. Habitasse nec.',
        initialLikes: 123,
        initialDislikes: 1,
    },
    {
        userImage: '/images/chat-with-us.png',
        userName: 'Courtney Henry',
        rating: 4,
        timeAgo: '2 mins ago',
        review: 'Lorem ipsum dolor sit amet consectetur. Fermentum tincidunt egestas feugiat scelerisque phasellus ut tortor ipsum. Sed scelerisque cras sit massa egestas cras viverra tellus donec. Fames nibh eu ut sagittis nibh. Ultrices in leo euismod pulvinar netus morbi pulvinar ac maecenas. Habitasse nec.',
        initialLikes: 10,
        initialDislikes: 1,
    },
    {
        userImage: '/images/chat-with-us.png',
        userName: 'Courtney Henry',
        rating: 2,
        timeAgo: '2 mins ago',
        review: 'Lorem ipsum dolor sit amet consectetur. Fermentum tincidunt egestas feugiat scelerisque phasellus ut tortor ipsum. Sed scelerisque cras sit massa egestas cras viverra tellus donec. Fames nibh eu ut sagittis nibh. Ultrices in leo euismod pulvinar netus morbi pulvinar ac maecenas. Habitasse nec.',
        initialLikes: 10,
        initialDislikes: 1,
    }
];

export const images: GalleryImage[] = [
    { id: 1, src: '/images/city-1.png', alt: 'Aerial view of the stadium' },
    { id: 2, src: '/images/card-2.png', alt: 'Stadium entrance at sunset' },
    { id: 3, src: '/images/card-3.png', alt: 'Interior view of the stadium' },
    { id: 4, src: '/images/city-1.png', alt: 'Stadium field view' },
    { id: 5, src: '/images/city-2.png', alt: 'Stadium field view' },
];