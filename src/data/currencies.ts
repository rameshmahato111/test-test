const STRIPE_CURRENCIES = [
    {
      "code": "USD",
      "name": "United States dollar",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "AED",
      "name": "UAE dirham",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "AFN",
      "name": "Afghan afghani",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "ALL",
      "name": "Albanian lek",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "AMD",
      "name": "Armenian dram",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "ANG",
      "name": "Netherlands Antillean gulden",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "AOA",
      "name": "Angolan kwanza",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "ARS",
      "name": "Argentine peso",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "AUD",
      "name": "Australian dollar",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "AWG",
      "name": "Aruban florin",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "AZN",
      "name": "Azerbaijani manat",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "BAM",
      "name": "Bosnia and Herzegovina konvertibilna marka",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "BBD",
      "name": "Barbadian dollar",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "BDT",
      "name": "Bangladeshi taka",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "BGN",
      "name": "Bulgarian lev",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "BIF",
      "name": "Burundi franc",
      "zero_decimal": true,
      "two_decimal": false
    },
    {
      "code": "BMD",
      "name": "Bermudian dollar",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "BND",
      "name": "Brunei dollar",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "BOB",
      "name": "Bolivian boliviano",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "BRL",
      "name": "Brazilian real",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "BSD",
      "name": "Bahamian dollar",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "BWP",
      "name": "Botswana pula",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "BZD",
      "name": "Belize dollar",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "CAD",
      "name": "Canadian dollar",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "CDF",
      "name": "Congolese franc",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "CHF",
      "name": "Swiss franc",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "CLP",
      "name": "Chilean peso",
      "zero_decimal": true,
      "two_decimal": false
    },
    {
      "code": "CNY",
      "name": "Chinese/Yuan renminbi",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "COP",
      "name": "Colombian peso",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "CRC",
      "name": "Costa Rican colon",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "CVE",
      "name": "Cape Verdean escudo",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "CZK",
      "name": "Czech koruna",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "DJF",
      "name": "Djiboutian franc",
      "zero_decimal": true,
      "two_decimal": false
    },
    {
      "code": "DKK",
      "name": "Danish krone",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "DOP",
      "name": "Dominican peso",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "DZD",
      "name": "Algerian dinar",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "EGP",
      "name": "Egyptian pound",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "ETB",
      "name": "Ethiopian birr",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "EUR",
      "name": "European Euro",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "FJD",
      "name": "Fijian dollar",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "FKP",
      "name": "Falkland Islands pound",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "GBP",
      "name": "British pound",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "GEL",
      "name": "Georgian lari",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "GIP",
      "name": "Gibraltar pound",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "GMD",
      "name": "Gambian dalasi",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "GNF",
      "name": "Guinean franc",
      "zero_decimal": true,
      "two_decimal": false
    },
    {
      "code": "GTQ",
      "name": "Guatemalan quetzal",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "GYD",
      "name": "Guyanese dollar",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "HKD",
      "name": "Hong Kong dollar",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "HNL",
      "name": "Honduran lempira",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "HTG",
      "name": "Haitian gourde",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "IDR",
      "name": "Indonesian rupiah",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "ILS",
      "name": "Israeli new sheqel",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "INR",
      "name": "Indian rupee",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "JMD",
      "name": "Jamaican dollar",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "JPY",
      "name": "Japanese yen",
      "zero_decimal": true,
      "two_decimal": false
    },
    {
      "code": "KES",
      "name": "Kenyan shilling",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "KGS",
      "name": "Kyrgyzstani som",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "KHR",
      "name": "Cambodian riel",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "KMF",
      "name": "Comorian franc",
      "zero_decimal": true,
      "two_decimal": false
    },
    {
      "code": "KRW",
      "name": "South Korean won",
      "zero_decimal": true,
      "two_decimal": false
    },
    {
      "code": "KYD",
      "name": "Cayman Islands dollar",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "KZT",
      "name": "Kazakhstani tenge",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "LAK",
      "name": "Lao kip",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "LBP",
      "name": "Lebanese lira",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "LKR",
      "name": "Sri Lankan rupee",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "LRD",
      "name": "Liberian dollar",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "LSL",
      "name": "Lesotho loti",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "MAD",
      "name": "Moroccan dirham",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "MDL",
      "name": "Moldovan leu",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "MGA",
      "name": "Malagasy ariary",
      "zero_decimal": true,
      "two_decimal": false
    },
    {
      "code": "MKD",
      "name": "Macedonian denar",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "MMK",
      "name": "Myanma kyat",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "MNT",
      "name": "Mongolian tugrik",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "MOP",
      "name": "Macanese pataca",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "MUR",
      "name": "Mauritian rupee",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "MVR",
      "name": "Maldivian rufiyaa",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "MWK",
      "name": "Malawian kwacha",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "MXN",
      "name": "Mexican peso",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "MYR",
      "name": "Malaysian ringgit",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "MZN",
      "name": "Mozambican metical",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "NAD",
      "name": "Namibian dollar",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "NGN",
      "name": "Nigerian naira",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "NIO",
      "name": "Nicaraguan c\u00f3rdoba",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "NOK",
      "name": "Norwegian krone",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "NPR",
      "name": "Nepalese rupee",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "NZD",
      "name": "New Zealand dollar",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "PAB",
      "name": "Panamanian balboa",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "PEN",
      "name": "Peruvian nuevo sol",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "PGK",
      "name": "Papua New Guinean kina",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "PHP",
      "name": "Philippine peso",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "PKR",
      "name": "Pakistani rupee",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "PLN",
      "name": "Polish zloty",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "PYG",
      "name": "Paraguayan guarani",
      "zero_decimal": true,
      "two_decimal": false
    },
    {
      "code": "QAR",
      "name": "Qatari riyal",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "RON",
      "name": "Romanian leu",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "RSD",
      "name": "Serbian dinar",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "RUB",
      "name": "Russian ruble",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "RWF",
      "name": "Rwandan franc",
      "zero_decimal": true,
      "two_decimal": false
    },
    {
      "code": "SAR",
      "name": "Saudi riyal",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "SBD",
      "name": "Solomon Islands dollar",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "SCR",
      "name": "Seychellois rupee",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "SEK",
      "name": "Swedish krona",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "SGD",
      "name": "Singapore dollar",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "SHP",
      "name": "Saint Helena pound",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "SOS",
      "name": "Somali shilling",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "SRD",
      "name": "Surinamese dollar",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "STD",
      "name": "S\u00e3o Tom\u00e9 and Pr\u00edncipe dobra",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "SZL",
      "name": "Swazi lilangeni",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "THB",
      "name": "Thai baht",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "TJS",
      "name": "Tajikistani somoni",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "TOP",
      "name": "Tongan Pa'anga",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "TRY",
      "name": "Turkish new lira",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "TTD",
      "name": "Trinidad and Tobago dollar",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "TZS",
      "name": "Tanzanian shilling",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "UAH",
      "name": "Ukrainian hryvnia",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "UYU",
      "name": "Uruguayan peso",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "UZS",
      "name": "Uzbekistani som",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "VND",
      "name": "Vietnamese dong",
      "zero_decimal": true,
      "two_decimal": false
    },
    {
      "code": "VUV",
      "name": "Vanuatu vatu",
      "zero_decimal": true,
      "two_decimal": false
    },
    {
      "code": "WST",
      "name": "Samoan tala",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "XAF",
      "name": "Central African CFA franc",
      "zero_decimal": true,
      "two_decimal": false
    },
    {
      "code": "XCD",
      "name": "East Caribbean dollar",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "XOF",
      "name": "West African CFA franc",
      "zero_decimal": true,
      "two_decimal": false
    },
    {
      "code": "XPF",
      "name": "CFP franc",
      "zero_decimal": true,
      "two_decimal": false
    },
    {
      "code": "YER",
      "name": "Yemeni rial",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "ZAR",
      "name": "South African rand",
      "zero_decimal": false,
      "two_decimal": true
    },
    {
      "code": "ZMW",
      "name": "Zambian kwacha",
      "zero_decimal": false,
      "two_decimal": true
    }
  ]

interface Currency {
    code: string;
    name: string;
    zero_decimal: boolean;
    two_decimal: boolean;
}

// Common currencies that we want to show at the top of the list
const POPULAR_CURRENCY_CODES = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "INR"];

// Sort currencies to show popular ones first
export const currencies: Currency[] = [
    // First add popular currencies in the specified order
    ...POPULAR_CURRENCY_CODES
        .map(code => STRIPE_CURRENCIES.find(c => c.code === code))
        .filter((c): c is Currency => c !== undefined),
    // Then add all other currencies
    ...STRIPE_CURRENCIES.filter(c => !POPULAR_CURRENCY_CODES.includes(c.code))
];

export const getCurrencyByCode = (code: string): Currency => {
    return currencies.find(c => c.code === code) || currencies[0];
};