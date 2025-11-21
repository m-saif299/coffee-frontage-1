import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Filter, Wifi, Car, Sun, Coffee, Clock, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { SAUDI_LOCATIONS } from '../data/saudiLocations';
export const FilterBar = ({ filters, onFilterChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const togglePrice = (price) => {
        onFilterChange({
            ...filters,
            priceLevel: filters.priceLevel === price ? null : price
        });
    };
    const toggleAmenity = (amenity) => {
        const newAmenities = filters.amenities.includes(amenity)
            ? filters.amenities.filter(a => a !== amenity)
            : [...filters.amenities, amenity];
        onFilterChange({ ...filters, amenities: newAmenities });
    };
    const toggleCoffeeType = (type) => {
        const newTypes = filters.coffeeTypes.includes(type)
            ? filters.coffeeTypes.filter(t => t !== type)
            : [...filters.coffeeTypes, type];
        onFilterChange({ ...filters, coffeeTypes: newTypes });
    };
    const toggleOpenNow = () => {
        onFilterChange({ ...filters, openNow: !filters.openNow });
    };
    const handleLocationChange = (field, value) => {
        const newFilters = { ...filters };
        newFilters[field] = value || null;
        // Reset children if parent changes
        if (field === 'region') {
            newFilters.city = null;
            newFilters.district = null;
        }
        else if (field === 'city') {
            newFilters.district = null;
        }
        onFilterChange(newFilters);
    };
    // Derived Location Lists
    const cities = filters.region ? SAUDI_LOCATIONS.find(r => r.name === filters.region)?.cities || [] : [];
    const districts = filters.city ? cities.find(c => c.name === filters.city)?.districts || [] : [];
    const AMENITY_OPTIONS = [
        { id: 'Wifi', label: 'واي فاي', icon: _jsx(Wifi, { size: 14 }) },
        { id: 'Outdoor Seating', label: 'جلسات خارجية', icon: _jsx(Sun, { size: 14 }) },
        { id: 'Parking', label: 'مواقف', icon: _jsx(Car, { size: 14 }) },
    ];
    const COFFEE_OPTIONS = ['V60', 'Espresso', 'Cold Brew', 'Chemex'];
    const activeCount = (filters.priceLevel ? 1 : 0) + filters.amenities.length + filters.coffeeTypes.length + (filters.openNow ? 1 : 0) + (filters.region ? 1 : 0) + (filters.city ? 1 : 0) + (filters.district ? 1 : 0);
    return (_jsx("div", { className: "w-full bg-white border-b border-coffee-100 sticky top-16 z-20 shadow-sm transition-all", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "flex items-center justify-between py-4 cursor-pointer select-none", onClick: () => setIsOpen(!isOpen), children: [_jsxs("div", { className: "flex items-center gap-2 text-coffee-800 font-bold text-sm", children: [_jsx(Filter, { size: 16 }), _jsx("span", { children: "\u062A\u0635\u0641\u064A\u0629 \u0627\u0644\u0646\u062A\u0627\u0626\u062C" }), activeCount > 0 && (_jsx("span", { className: "bg-coffee-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse", children: activeCount }))] }), _jsxs("div", { className: "flex items-center gap-3", children: [activeCount > 0 && (_jsx("button", { onClick: (e) => {
                                        e.stopPropagation();
                                        onFilterChange({ priceLevel: null, amenities: [], coffeeTypes: [], openNow: false, region: null, city: null, district: null });
                                    }, className: "text-xs text-red-500 hover:underline", children: "\u0645\u0633\u062D \u0627\u0644\u0643\u0644" })), _jsx("button", { className: "text-coffee-600", children: isOpen ? _jsx(ChevronUp, { size: 20 }) : _jsx(ChevronDown, { size: 20 }) })] })] }), _jsx("div", { className: `overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[600px] opacity-100 pb-4' : 'max-h-0 opacity-0'}`, children: _jsxs("div", { className: "space-y-4 pt-2 border-t border-gray-100", children: [_jsxs("div", { className: "bg-coffee-50/50 p-3 rounded-xl border border-coffee-100", children: [_jsxs("h4", { className: "text-xs font-bold text-coffee-800 mb-2 flex items-center gap-1", children: [_jsx(MapPin, { size: 12 }), "\u0627\u0644\u0645\u0648\u0642\u0639"] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-2", children: [_jsxs("select", { value: filters.region || '', onChange: (e) => handleLocationChange('region', e.target.value), className: "text-sm p-2 rounded-lg border border-gray-200 focus:outline-none focus:border-coffee-400", children: [_jsx("option", { value: "", children: "\u0627\u0644\u0645\u0646\u0637\u0642\u0629 (\u0627\u0644\u0643\u0644)" }), SAUDI_LOCATIONS.map(r => (_jsx("option", { value: r.name, children: r.name }, r.id)))] }), _jsxs("select", { value: filters.city || '', disabled: !filters.region, onChange: (e) => handleLocationChange('city', e.target.value), className: "text-sm p-2 rounded-lg border border-gray-200 focus:outline-none focus:border-coffee-400 disabled:bg-gray-100 disabled:text-gray-400", children: [_jsx("option", { value: "", children: "\u0627\u0644\u0645\u062F\u064A\u0646\u0629 (\u0627\u0644\u0643\u0644)" }), cities.map(c => (_jsx("option", { value: c.name, children: c.name }, c.id)))] }), _jsxs("select", { value: filters.district || '', disabled: !filters.city, onChange: (e) => handleLocationChange('district', e.target.value), className: "text-sm p-2 rounded-lg border border-gray-200 focus:outline-none focus:border-coffee-400 disabled:bg-gray-100 disabled:text-gray-400", children: [_jsx("option", { value: "", children: "\u0627\u0644\u062D\u064A (\u0627\u0644\u0643\u0644)" }), districts.map((d, idx) => (_jsx("option", { value: d, children: d }, idx)))] })] })] }), _jsxs("div", { className: "flex flex-wrap gap-3 items-center", children: [_jsxs("button", { onClick: toggleOpenNow, className: `flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all ${filters.openNow
                                            ? 'bg-green-100 text-green-700 border border-green-200 font-bold'
                                            : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'}`, children: [_jsx(Clock, { size: 14 }), "\u0645\u0641\u062A\u0648\u062D \u0627\u0644\u0622\u0646"] }), _jsx("div", { className: "h-6 w-px bg-gray-200 mx-1 hidden sm:block" }), _jsx("div", { className: "flex items-center bg-gray-50 rounded-full p-1 border border-gray-200", children: ['Low', 'Medium', 'High'].map((level) => {
                                            const label = level === 'Low' ? '$' : level === 'Medium' ? '$$' : '$$$';
                                            const isActive = filters.priceLevel === level;
                                            return (_jsx("button", { onClick: () => togglePrice(level), className: `px-3 py-0.5 rounded-full text-xs font-bold transition-all ${isActive
                                                    ? 'bg-coffee-600 text-white shadow-sm'
                                                    : 'text-gray-500 hover:text-coffee-700'}`, children: label }, level));
                                        }) }), _jsx("div", { className: "h-6 w-px bg-gray-200 mx-1 hidden sm:block" }), AMENITY_OPTIONS.map((opt) => (_jsxs("button", { onClick: () => toggleAmenity(opt.id), className: `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all border ${filters.amenities.includes(opt.id)
                                            ? 'bg-coffee-100 text-coffee-800 border-coffee-300 font-medium'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-coffee-300'}`, children: [opt.icon, opt.label] }, opt.id))), COFFEE_OPTIONS.map((type) => (_jsxs("button", { onClick: () => toggleCoffeeType(type), className: `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all border ${filters.coffeeTypes.includes(type)
                                            ? 'bg-stone-800 text-white border-stone-800 font-medium'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-stone-400'}`, children: [_jsx(Coffee, { size: 14 }), type] }, type)))] })] }) })] }) }));
};
