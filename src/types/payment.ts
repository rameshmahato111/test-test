export interface BookingDetails {
    hotelId: number;
    roomId: number;
    hotelName: string;
    rateId: string;
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    price: {
        roomPrice: number;
        tax: number;
        travelCredit: number;
        total: number;
    };
}

export interface ContactDetails {
    firstName: string;
    lastName: string;
    email: string;
    phone: {
        phoneNumber: string;
        countryCode: string;
    };
    address: string;
    zipCode: string;
    country: string;
}

export interface PaymentDetails {
    method: 'card' | 'paypal' | 'afterpay';
    card?: {
        cardHolderName: string;
        cardNumber: string;
        expiryDate: string;
        cvv: string;
    };
}

export interface FormData {
    requestId: string;
    supplierReference: string;
    clientReference: string;
    contact: ContactDetails;
    booking: {
        hotelId: number;
        hotelName: string;
        roomId: number;
        rateId: number;
        checkIn: string;
        checkOut: string;
        adults: number;
        children: number;
        price: {
            roomPrice: number;
            tax: number;
            travelCredit: number;
            total: number;
        };
    };
    payment: PaymentDetails;
    marketingConsent: boolean;
}

export interface FormErrors {
    contact: {
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
        address?: string;
        zipCode?: string;
    };
    payment?: {
        cardHolderName?: string;
        cardNumber?: string;
        expiryDate?: string;
        cvv?: string;
    };
}