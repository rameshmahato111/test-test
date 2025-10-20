import React, { useState } from 'react'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Label } from '../ui/label'
import { ArrowLeftRight, Plane, ChevronDown, User, Minus, Plus } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import NationalitySelector from '../NationalitySelector'
import SingleDatePicker from '../SingleDatePicker'
import { validateFlightSearch } from '@/app/validations/flightSearchValidator';
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/AuthContext'
import Extras from '@/services/api/extras'
import TravelerDetailsForm from './TravelerDetailsForm'
import ContactDetailsForm from './ContactDetailsForm'

const travelClasses = {
    'Economy': 'ECONOMY',
    'Premium Economy': 'PREMIUM_ECONOMY',
    'Business Class': 'BUSINESS',
    'First Class': 'FIRST'
};

export interface TravelerDetails {
    fullName: string;
    type: 'ADULT' | 'CHILD';
}

export interface ContactDetails {
    email: string;
    phone: string;
    preferredAirlines?: string[];
    priceRange?: {
        min: number;
        max: number;
    };
}

interface FlightSearchState {
    step: 1 | 2 | 3;
    basicDetails: {
        origin: string;
        destination: string;
        departureDate: Date | null;
        returnDate: Date | null;
        selectedClass: string;
        selectedNationality: string;
        tripType: 'ONE_WAY' | 'ROUND_TRIP';
        adults: number;
        children: number;
    };
    travelerDetails: TravelerDetails[];
    contactDetails: ContactDetails;
}

const FlightSearch = () => {
    const { toast } = useToast();
    const { user, token } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const [searchState, setSearchState] = useState<FlightSearchState>({
        step: 1,
        basicDetails: {
            origin: '',
            destination: '',
            departureDate: null,
            returnDate: null,
            selectedClass: 'Economy',
            selectedNationality: '',
            tripType: 'ONE_WAY',
            adults: 1,
            children: 0,

        },
        travelerDetails: [],
        contactDetails: {
            email: user?.user.email || '',
            phone: user?.phone_number || '',
            preferredAirlines: [],
            priceRange: {
                min: 0,
                max: 0
            }
        }
    });

    const totalTravelers = searchState.basicDetails.adults + searchState.basicDetails.children;

    const handleIncrementAdults = () => {
        setSearchState(prev => ({
            ...prev,
            basicDetails: {
                ...prev.basicDetails,
                adults: prev.basicDetails.adults + 1
            }
        }));
    };

    const handleDecrementAdults = () => {
        if (searchState.basicDetails.adults > 1) {
            setSearchState(prev => ({
                ...prev,
                basicDetails: {
                    ...prev.basicDetails,
                    adults: prev.basicDetails.adults - 1
                }
            }));
        }
    };

    const handleIncrementChildren = () => {
        setSearchState(prev => ({
            ...prev,
            basicDetails: {
                ...prev.basicDetails,
                children: prev.basicDetails.children + 1
            }
        }));
    };

    const handleDecrementChildren = () => {
        if (searchState.basicDetails.children > 0) {
            setSearchState(prev => ({
                ...prev,
                basicDetails: {
                    ...prev.basicDetails,
                    children: prev.basicDetails.children - 1
                }
            }));
        }
    };

    const handleNextStep = async () => {
        if (searchState.step === 1) {
            const validationResult = validateFlightSearch({
                origin: searchState.basicDetails.origin,
                destination: searchState.basicDetails.destination,
                departureDate: searchState.basicDetails.departureDate,
                returnDate: searchState.basicDetails.returnDate,
                selectedClass: searchState.basicDetails.selectedClass,
                nationality: searchState.basicDetails.selectedNationality,
                tripType: searchState.basicDetails.tripType,
                travelers: searchState.basicDetails.adults + searchState.basicDetails.children
            });

            if (!validationResult.isValid) {
                validationResult.errors.forEach(error => {
                    toast({
                        title: error,
                        variant: 'destructive'
                    });
                });
                return;
            }

            // Initialize traveler details array with proper types
            const travelers: TravelerDetails[] = [
                ...Array(searchState.basicDetails.adults).fill({
                    fullName: '',
                    type: 'ADULT'
                }),
                ...Array(searchState.basicDetails.children).fill({
                    fullName: '',
                    type: 'CHILD'
                })
            ];

            setSearchState(prev => ({
                ...prev,
                step: 2,
                travelerDetails: travelers
            }));
        } else if (searchState.step === 2) {
            // Validate traveler details
            const isValid = searchState.travelerDetails.every(traveler =>
                traveler.fullName.trim() !== ''
            );

            if (!isValid) {
                toast({
                    title: 'Please fill in all traveler names',
                    variant: 'destructive'
                });
                return;
            }

            setSearchState(prev => ({
                ...prev,
                step: 3
            }));
        }
    };

    const handlePrevStep = () => {
        setSearchState(prev => ({
            ...prev,
            step: prev.step > 1 ? (prev.step - 1) as 1 | 2 | 3 : 1
        }));
    };

    const handleSubmit = async () => {
        if (!user || !token) {
            toast({
                title: 'Please login to save your flight search',
                variant: 'destructive'
            });
            return;
        }

        // Validate contact details
        if (!searchState.contactDetails.email || !searchState.contactDetails.phone) {
            toast({
                title: 'Please provide contact details',
                variant: 'destructive'
            });
            return;
        }

        setIsLoading(true);
        const data = {
            origin: searchState.basicDetails.origin,
            destination: searchState.basicDetails.destination,
            departure_date: searchState.basicDetails.departureDate?.toISOString().split('T')[0],
            return_date: searchState.basicDetails.tripType === 'ROUND_TRIP' ?
                searchState.basicDetails.returnDate?.toISOString().split('T')[0] : null,
            cabin_class: travelClasses[searchState.basicDetails.selectedClass as keyof typeof travelClasses],
            nationality: searchState.basicDetails.selectedNationality,
            trip_type: searchState.basicDetails.tripType,
            travelers: searchState.basicDetails.adults + searchState.basicDetails.children,
            traveler_details: searchState.travelerDetails,
            contact_details: searchState.contactDetails,
            user: user?.id!
        };

        const res = await Extras.saveFlightSearch(data, token!);
        if (res) {
            toast({
                title: 'Flight Data Saved Successfully',
                description: 'Will be notified via email',
                variant: 'success'
            });
            // Reset form after successful submission
            setSearchState(prev => ({
                ...prev,
                step: 1
            }));
            setSearchState(prev => ({
                ...prev,
                basicDetails: {
                    ...prev.basicDetails,
                    origin: '',
                    destination: '',
                    departureDate: null,
                    returnDate: null,
                    selectedClass: 'Economy',
                    selectedNationality: '',
                    tripType: 'ONE_WAY',
                    adults: 1,
                    children: 0
                }
            }));
        } else {
            toast({
                title: 'Failed to save flight data',
                description: res.message,
                variant: 'destructive'
            });
        }
        setIsLoading(false);
    };

    const handleOriginKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleNextStep();
        }
    };

    const handleDestinationKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleNextStep();
        }
    };

    const renderTravelersPopover = () => (
        <div className='lg:min-w-[130px] xl:min-w-[150px]'>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full bg-white border-gray-200 text-sm justify-between"
                    >
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{totalTravelers} Traveler{totalTravelers > 1 ? 's' : ''}</span>
                        </div>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="start">
                    <div className="p-4 bg-white rounded-lg space-y-4">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Adults</p>
                                    <p className="text-xs text-gray-500">Age 12+</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handleDecrementAdults}
                                        disabled={searchState.basicDetails.adults <= 1}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-8 text-center text-sm">
                                        {searchState.basicDetails.adults}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handleIncrementAdults}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Children</p>
                                    <p className="text-xs text-gray-500">Under 12</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handleDecrementChildren}
                                        disabled={searchState.basicDetails.children <= 0}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-8 text-center text-sm">
                                        {searchState.basicDetails.children}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handleIncrementChildren}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );

    const renderStep = () => {
        switch (searchState.step) {
            case 1:
                return (
                    <div className='px-0 py-2 sm:p-4 md:py-7 md:px-4'>
                        <div className='flex flex-col gap-2 lg:flex-row mb-6 justify-between items-center'>
                            <div className='flex items-center sm:gap-3 lg:gap-10 w-full  lg:w-auto order-2 lg:order-1'>
                                <RadioGroup
                                    defaultValue={searchState.basicDetails.tripType}
                                    onValueChange={(value) => setSearchState(prev => ({
                                        ...prev,
                                        basicDetails: {
                                            ...prev.basicDetails,
                                            tripType: value as 'ONE_WAY' | 'ROUND_TRIP'
                                        }
                                    }))}
                                    className="flex items-center space-x-1 sm:space-x-4 w-full lg:w-auto"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="ONE_WAY" id="one-way" className="peer" />
                                        <Label htmlFor="one-way" className="cursor-pointer text-xs md:text-sm font-semibold peer-data-[state=checked]:text-pink-500">
                                            One-Way
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="ROUND_TRIP" id="round-trip" className="peer" />
                                        <Label htmlFor="round-trip" className="cursor-pointer text-xs md:text-sm font-medium peer-data-[state=checked]:text-pink-500">
                                            Round-Trip
                                        </Label>
                                    </div>
                                </RadioGroup>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className=" lg:w-auto text-pink-500 font-medium justify-start p-0"
                                        >
                                            {searchState.basicDetails.selectedClass}
                                            <ChevronDown className="h-4 w-4 opacity-50 ml-1" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent align='start' className="w-[180px] bg-background p-0">
                                        <div className="max-h-[300px] overflow-y-auto">
                                            {Object.values(travelClasses).map((travelClass) => (
                                                <Button
                                                    key={travelClass}
                                                    variant="ghost"
                                                    className="w-full hover:bg-gray-100 justify-start font-normal p-4"
                                                    onClick={() => setSearchState(prev => ({
                                                        ...prev,
                                                        basicDetails: {
                                                            ...prev.basicDetails,
                                                            selectedClass: travelClass
                                                        }
                                                    }))}
                                                >
                                                    {travelClass}
                                                </Button>
                                            ))}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <p className='order-1 lg:order-2 text-xs text-gray-900 bg-green-100  px-4 py-2 rounded-md border border-green-400'>
                                Your ticket will be issued offline and will be notify via email
                            </p>
                        </div>

                        <div className='grid grid-cols-1 lg:flex gap-2'>
                            <div className='min-w-[200px] flex flex-col lg:flex-row gap-2 relative'>
                                <div className='w-full flex items-center bg-white border border-gray-200 rounded-md px-3'>
                                    <Plane className='w-5 h-5 text-gray-500' />
                                    <Input
                                        placeholder='Origin'
                                        value={searchState.basicDetails.origin}
                                        onChange={(e) => setSearchState(prev => ({
                                            ...prev,
                                            basicDetails: {
                                                ...prev.basicDetails,
                                                origin: e.target.value
                                            }
                                        }))}
                                        onKeyDown={handleOriginKeyDown}
                                        className='border-none focus-visible:ring-0 focus-visible:ring-offset-0'
                                    />
                                </div>

                                <Button
                                    tabIndex={-1}
                                    variant="ghost"
                                    className='absolute right-0 lg:right-auto lg:left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                                             w-10 h-10 p-2 bg-white border border-gray-200 rounded-full z-10'
                                >
                                    <ArrowLeftRight className='w-4 h-4 text-gray-700' />
                                </Button>

                                <div className='w-full flex items-center bg-white border border-gray-200 rounded-md px-3'>
                                    <Plane className='w-5 h-5 text-gray-500 rotate-90 ml-2' />
                                    <Input
                                        placeholder='Destination'
                                        value={searchState.basicDetails.destination}
                                        onChange={(e) => setSearchState(prev => ({
                                            ...prev,
                                            basicDetails: {
                                                ...prev.basicDetails,
                                                destination: e.target.value
                                            }
                                        }))}
                                        onKeyDown={handleDestinationKeyDown}
                                        className='border-none focus-visible:ring-0 focus-visible:ring-offset-0'
                                    />
                                </div>
                            </div>

                            {searchState.basicDetails.tripType === 'ONE_WAY' ? (
                                <div className=''>
                                    <SingleDatePicker
                                        selectedDate={searchState.basicDetails.departureDate}
                                        onDateChange={(date) => setSearchState(prev => ({
                                            ...prev,
                                            basicDetails: {
                                                ...prev.basicDetails,
                                                departureDate: date
                                            }
                                        }))}
                                        placeholder="Dates"
                                        className='lg:min-w-[140px] xl:min-w-[200px]'
                                    />
                                </div>
                            ) : (
                                <>
                                    <div className=''>
                                        <SingleDatePicker
                                            selectedDate={searchState.basicDetails.departureDate}
                                            onDateChange={(date) => setSearchState(prev => ({
                                                ...prev,
                                                basicDetails: {
                                                    ...prev.basicDetails,
                                                    departureDate: date
                                                }
                                            }))}
                                            placeholder="Dates"
                                            className='lg:min-w-[130px] xl:min-w-[160px]'
                                        />
                                    </div>
                                    <div className=''>
                                        <SingleDatePicker
                                            selectedDate={searchState.basicDetails.returnDate}
                                            onDateChange={(date) => setSearchState(prev => ({
                                                ...prev,
                                                basicDetails: {
                                                    ...prev.basicDetails,
                                                    returnDate: date
                                                }
                                            }))}
                                            placeholder="Return Date"
                                            className='lg:min-w-[130px] xl:min-w-[160px]'
                                        />
                                    </div>
                                </>
                            )}

                            {renderTravelersPopover()}

                            <div className="">
                                <NationalitySelector
                                    initialValue={searchState.basicDetails.selectedNationality}
                                    onSelect={(nationality) => setSearchState(prev => ({
                                        ...prev,
                                        basicDetails: {
                                            ...prev.basicDetails,
                                            selectedNationality: nationality
                                        }
                                    }))}
                                    className="w-full lg:min-w-[110px] xl:min-w-[160px] bg-white border-gray-200"
                                />
                            </div>

                            <div className="">
                                <Button
                                    onClick={handleNextStep}
                                    className='w-full bg-pink-500 min-w-[80px] hover:bg-pink-600 text-white font-bold py-3 rounded-lg'
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className='md:px-4 py-2 '>
                        <TravelerDetailsForm
                            travelers={searchState.travelerDetails}
                            onUpdate={(travelers) => setSearchState(prev => ({ ...prev, travelerDetails: travelers }))}
                            onNext={handleNextStep}
                            onBack={handlePrevStep}
                        />
                    </div>
                );
            case 3:
                return (
                    <div className=' md:px-4 py-2'>
                        <ContactDetailsForm
                            contactDetails={searchState.contactDetails}
                            onUpdate={(details) => setSearchState(prev => ({ ...prev, contactDetails: details }))}
                            onSubmit={handleSubmit}
                            onBack={handlePrevStep}
                            isLoading={isLoading}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            {renderStep()}
        </div>
    );
};

export default FlightSearch;

