export const validateName = (name: string): string => {
    if (!name) return 'This field is required';
    if (name.trim().length < 2) return 'Must be at least 2 characters';
    if (!/^[a-zA-Z\s'-]+$/.test(name)) return 'Only letters, spaces, hyphens and apostrophes allowed';
    if (name.length > 50) return 'Must be less than 50 characters';
    return '';
};

export const validateAge = (age: string): string => {
    if (!age) return 'Age is required';
    const numAge = parseInt(age);
    if (isNaN(numAge)) return 'Must be a valid number';
    if (numAge < 0) return 'Age cannot be negative';
    if (numAge > 120) return 'Invalid age';
    return '';
};

export const validateEmail = (email: string): string => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Invalid email format';
    if (email.length > 100) return 'Email is too long';
    return '';
};

export const validatePhone = (phone: string): string => {
    if (!phone) return 'Phone number is required';
    if (!/^\+?[\d\s-]{8,}$/.test(phone)) return 'Invalid phone number format';
    if (phone.length > 15) return 'Phone number is too long';
    return '';
};

export const validateAddress = (address: string): string => {
    if (!address) return 'Address is required';
    if (address.trim().length < 5) return 'Address is too short';
    if (address.length > 200) return 'Address is too long';
    return '';
};

export const validateZipCode = (zipCode: string): string => {
    if (!zipCode) return 'ZIP code is required';
    if (!/^\d{4,6}$/.test(zipCode)) return 'Invalid ZIP code format';
    return '';
};

export const validateCardNumber = (cardNumber: string): string => {
    if (!cardNumber) return 'Card number is required';
    const cleanNumber = cardNumber.replace(/\s/g, '');
    if (!/^\d{16}$/.test(cleanNumber)) return 'Card number must be 16 digits';
    return '';
};

export const validateCardHolderName = (name: string): string => {
    if (!name) return 'Cardholder name is required';
    if (name.trim().length < 2) return 'Must be at least 2 characters';
    if (!/^[a-zA-Z\s'-]+$/.test(name)) return 'Only letters, spaces, hyphens and apostrophes allowed';
    return '';
};

export const validateExpiryDate = (date: string): string => {
    if (!date) return 'Expiry date is required';
    if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(date)) return 'Use MM/YY format';
    
    const [month, year] = date.split('/');
    const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
    const now = new Date();
    
    if (expiry < now) return 'Card has expired';
    return '';
};

export const validateCVV = (cvv: string): string => {
    if (!cvv) return 'CVV is required';
    if (!/^\d{3,4}$/.test(cvv)) return 'CVV must be 3 or 4 digits';
    return '';
};

// Helper function to validate form fields
export const validateField = (name: string, value: string): string => {
    switch (name) {
        case 'firstName':
        case 'lastName':
        case 'holderFirstName':
        case 'holderLastName':
            return validateName(value);
        case 'age':
            return validateAge(value);
        case 'email':
            return validateEmail(value);
        case 'phone':
            return validatePhone(value);
        case 'address':
            return validateAddress(value);
        case 'zipCode':
            return validateZipCode(value);
        case 'cardNumber':
            return validateCardNumber(value);
        case 'cardHolderName':
            return validateCardHolderName(value);
        case 'expiryDate':
            return validateExpiryDate(value);
        case 'cvv':
            return validateCVV(value);
        default:
            return '';
    }
}; 