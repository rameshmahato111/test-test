export interface HotelSearchValidation {
    hotel_query: string;
    start_date: Date | null;
    end_date: Date | null;
    no_of_rooms: number;
    adults: number;
    nationality: string;
}

export const validateHotelSearch = (params: HotelSearchValidation) => {
    const errors: string[] = [];

    if (!params.hotel_query.trim()) {
        errors.push("Please enter a location or hotel name");
    }

    if (!params.start_date || !params.end_date) {
        errors.push("Please select check-in and check-out dates");
    }

    if (params.start_date && params.end_date && params.start_date >= params.end_date) {
        errors.push("Check-out date must be after check-in date");
    }

    if (params.no_of_rooms < 1) {
        errors.push("Minimum 1 room is required");
    }

    if (params.adults < 1) {
        errors.push("Minimum 1 adult is required");
    }

    if (!params.nationality) {
        errors.push("Please select your nationality");
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}; 