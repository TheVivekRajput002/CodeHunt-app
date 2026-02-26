// Sample property data for the Newly Launched Projects section

export interface Property {
    id: string;
    name: string;
    location: string;
    city: string;
    priceRange: string;
    config: string;
    badge: 'NEW LAUNCH' | 'NEW ARRIVAL';
    certifications: ('RERA' | 'HIRA')[];
    extraInfo: string;
    extraInfoType: 'increase' | 'completion';
    image: string; // emoji placeholder
}

export const newlyLaunchedProperties: Property[] = [
    {
        id: '1',
        name: 'Smartworld Residences',
        location: 'Sector 98',
        city: 'Noida',
        priceRange: '₹1.91 – 11.43 Cr',
        config: '1/2/3/4 BHK Apartments',
        badge: 'NEW LAUNCH',
        certifications: ['RERA'],
        extraInfo: 'Completion Oct 2030',
        extraInfoType: 'completion',
        image: '🏙️',
    },
    {
        id: '2',
        name: 'Purva Silversky',
        location: 'Electronic City',
        city: 'Bangalore',
        priceRange: '₹2.3 – 6.66 Cr',
        config: '3/4/5 BHK Apartments',
        badge: 'NEW ARRIVAL',
        certifications: ['RERA'],
        extraInfo: '8.7% price increase',
        extraInfoType: 'increase',
        image: '🌿',
    },
    {
        id: '3',
        name: 'Urban Lakes',
        location: 'Konnagar',
        city: 'Hooghly',
        priceRange: '₹52.33 – 72.77 L',
        config: '2/3 BHK Apartments',
        badge: 'NEW LAUNCH',
        certifications: ['RERA', 'HIRA'],
        extraInfo: '8.0% price increase',
        extraInfoType: 'increase',
        image: '🏞️',
    },
    {
        id: '4',
        name: 'Godrej Reserve',
        location: 'Kandivali East',
        city: 'Mumbai',
        priceRange: '₹3.5 – 9.2 Cr',
        config: '2/3/4 BHK Apartments',
        badge: 'NEW LAUNCH',
        certifications: ['RERA'],
        extraInfo: 'Completion Dec 2028',
        extraInfoType: 'completion',
        image: '🌊',
    },
];

export const PROPERTY_TYPES = [
    'All Residential',
    'Apartment',
    'Independent House',
    'Villa',
    'Plot',
    'Commercial',
];

export const SEARCH_TABS = [
    { id: 'buy', label: 'Buy' },
    { id: 'rent', label: 'Rent' },
    { id: 'new-launch', label: 'New Launch', dot: true },
    { id: 'commercial', label: 'Commercial' },
    { id: 'plots', label: 'Plots/Land' },
    { id: 'projects', label: 'Projects' },
];
