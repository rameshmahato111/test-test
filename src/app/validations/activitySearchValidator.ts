export interface ActivitySearchValidation {
    query: string;
}

export const validateActivitySearch = (params: ActivitySearchValidation) => {
    const errors: string[] = [];

    if (!params.query.trim()) {
        errors.push("Please enter a location or activity");
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}; 

