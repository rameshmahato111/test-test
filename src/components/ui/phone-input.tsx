'use client';
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { ChevronsUpDown } from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Search } from "lucide-react"
import { countryCodes } from "@/data/staticData";
import { CountryCode } from "@/types";





interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onPhoneChange?: (value: { phoneNumber: string; countryCode: string }) => void
    initialPhoneNumber?: string
}

export function PhoneInput({ className, onPhoneChange, initialPhoneNumber, ...props }: PhoneInputProps) {
    const findCountryFromNumber = (phoneNumber: string | undefined): CountryCode => {
        if (!phoneNumber) return countryCodes[0];

        const onlyCountryCode = phoneNumber.replace(/[0-9]/g, "");
        if (onlyCountryCode === phoneNumber) {
            const matchingCountry = countryCodes.find(country =>
                country.dial_code === phoneNumber
            );
            return matchingCountry || countryCodes[0];
        }

        const sortedCountries = [...countryCodes].sort(
            (a, b) => b.dial_code.length - a.dial_code.length
        );

        const matchingCountry = sortedCountries.find(country =>
            phoneNumber.startsWith(country.dial_code)
        );

        return matchingCountry || countryCodes[0];
    };

    const removeCountryCode = (phoneNumber: string | undefined, dialCode: string): string => {
        if (!phoneNumber) return "";
        if (phoneNumber === dialCode) return "";

        const cleanNumber = phoneNumber.replace(/[^\d+]/g, "");
        if (cleanNumber.startsWith(dialCode)) {
            return cleanNumber.slice(dialCode.length);
        }
        return cleanNumber;
    };

    const [open, setOpen] = React.useState(false);
    const [selectedCountry, setSelectedCountry] = React.useState<CountryCode>(
        findCountryFromNumber(initialPhoneNumber)
    );
    const [phoneNumber, setPhoneNumber] = React.useState(
        removeCountryCode(initialPhoneNumber, selectedCountry.dial_code)
    );
    const [searchTerm, setSearchTerm] = React.useState("");

    const filteredCountries = countryCodes.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.dial_code.includes(searchTerm)
    )

    const handleCountrySelect = (country: CountryCode) => {
        setSelectedCountry(country)
        setOpen(false)
        if (onPhoneChange) {
            onPhoneChange({ phoneNumber, countryCode: country.dial_code })
        }
    }

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, "")
        setPhoneNumber(value)
        if (onPhoneChange) {
            onPhoneChange({ phoneNumber: value, countryCode: selectedCountry.dial_code })
        }
    }

    const getFullPhoneNumber = () => {
        return `${selectedCountry.dial_code}${phoneNumber}`
    }

    return (
        <div className="flex mt-2 border rounded-lg">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className=" justify-between border-none px-2"
                    >
                        <span className="flex items-center gap-2">
                            <span>{selectedCountry.flag}</span>
                            <span>{selectedCountry.dial_code}</span>
                        </span>
                        <ChevronsUpDown className=" h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0 bg-background" align="start">
                    <div className="py-6">
                        <div className="flex mx-4 items-center border rounded-lg px-2 border-gray-200 mb-4">
                            <Search className="w-6 h-6 text-gray-500" />
                            <Input
                                type="text"
                                placeholder="Search country..."
                                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <ul className="space-y-1 px-4 max-h-[200px] overflow-y-auto">
                            {filteredCountries.map((country) => (
                                <li
                                    key={country.code}
                                    className={cn(
                                        "p-2 border border-transparent text-base font-medium text-gray-800 rounded-md cursor-pointer flex items-center gap-2",
                                        country.code === selectedCountry.code
                                            ? "bg-primary-0 text-foreground !border-primary-400"
                                            : "hover:bg-primary-0"
                                    )}
                                    onClick={() => handleCountrySelect(country)}
                                >
                                    <span className="mr-2">{country.flag}</span>
                                    {country.name} ({country.dial_code})
                                </li>
                            ))}
                            {filteredCountries.length === 0 && (
                                <li className="p-2 text-gray-500 text-center">
                                    No country found
                                </li>
                            )}
                        </ul>
                    </div>
                </PopoverContent>
            </Popover>
            <Input
                type="tel"
                placeholder="Phone number"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                className={cn("flex-1 border-none", className)}
                {...props}
                name={props.name}
                data-full-number={getFullPhoneNumber()}
            />
        </div>
    )
} 