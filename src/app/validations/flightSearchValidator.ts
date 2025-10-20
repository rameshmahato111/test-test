export interface FlightSearchValidation {
    origin: string;
    destination: string;
    departureDate: Date | null;
    returnDate: Date | null;
    selectedClass: string;
    nationality: string;
    tripType: 'ONE_WAY' | 'ROUND_TRIP';
    travelers: number;
}

export const validateFlightSearch = (params: FlightSearchValidation) => {
    const errors: string[] = [];

    if (!params.origin.trim()) {
        errors.push("Please enter origin city/airport");
    }

    if (!params.destination.trim()) {
        errors.push("Please enter destination city/airport");
    }

    if (params.origin.trim() === params.destination.trim()) {
        errors.push("Origin and destination cannot be the same");
    }

    if (!params.departureDate) {
        errors.push("Please select departure date");
    }

    if (params.tripType === 'ROUND_TRIP' && !params.returnDate) {
        errors.push("Please select return date");
    }

    if (params.tripType === 'ROUND_TRIP' && params.departureDate && params.returnDate) {
        if (params.returnDate <= params.departureDate) {
            errors.push("Return date must be after departure date");
        }
    }

    if (params.travelers < 1) {
        errors.push("At least one traveler is required");
    }

    if (!params.selectedClass) {
        errors.push("Please select travel class");
    }

    if (!params.nationality) {
        errors.push("Please select your nationality");
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}; 