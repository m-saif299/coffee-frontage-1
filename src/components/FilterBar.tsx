import React, { useState } from 'react';
import { FilterState } from '../types';
import { Filter, Wifi, Car, Sun, Coffee, Clock, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { SAUDI_LOCATIONS } from '../data/saudiLocations';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const togglePrice = (price: string) => {
    onFilterChange({
      ...filters,
      priceLevel: filters.priceLevel === price ? null : price
    });
  };

  const toggleAmenity = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    onFilterChange({ ...filters, amenities: newAmenities });
  };

  const toggleCoffeeType = (type: string) => {
    const newTypes = filters.coffeeTypes.includes(type)
      ? filters.coffeeTypes.filter(t => t !== type)
      : [...filters.coffeeTypes, type];
    onFilterChange({ ...filters, coffeeTypes: newTypes });
  };

  const toggleOpenNow = () => {
    onFilterChange({ ...filters, openNow: !filters.openNow });
  };

  const handleLocationChange = (field: 'region' | 'city' | 'district', value: string) => {
      const newFilters = { ...filters };
      newFilters[field] = value || null;

      // Reset children if parent changes
      if (field === 'region') {
          newFilters.city = null;
          newFilters.district = null;
      } else if (field === 'city') {
          newFilters.district = null;
      }
      
      onFilterChange(newFilters);
  };

  // Derived Location Lists
  const cities = filters.region ? SAUDI_LOCATIONS.find(r => r.name === filters.region)?.cities || [] : [];
  const districts = filters.city ? cities.find(c => c.name === filters.city)?.districts || [] : [];

  const AMENITY_OPTIONS = [
    { id: 'Wifi', label: 'واي فاي', icon: <Wifi size={14} /> },
    { id: 'Outdoor Seating', label: 'جلسات خارجية', icon: <Sun size={14} /> },
    { id: 'Parking', label: 'مواقف', icon: <Car size={14} /> },
  ];

  const COFFEE_OPTIONS = ['V60', 'Espresso', 'Cold Brew', 'Chemex'];

  const activeCount = (filters.priceLevel ? 1 : 0) + filters.amenities.length + filters.coffeeTypes.length + (filters.openNow ? 1 : 0) + (filters.region ? 1 : 0) + (filters.city ? 1 : 0) + (filters.district ? 1 : 0);

  return (
    <div className="w-full bg-white border-b border-coffee-100 sticky top-16 z-20 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header / Toggle Bar */}
        <div 
            className="flex items-center justify-between py-4 cursor-pointer select-none"
            onClick={() => setIsOpen(!isOpen)}
        >
            <div className="flex items-center gap-2 text-coffee-800 font-bold text-sm">
                <Filter size={16} />
                <span>تصفية النتائج</span>
                {activeCount > 0 && (
                    <span className="bg-coffee-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {activeCount}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-3">
                {activeCount > 0 && (
                    <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onFilterChange({ priceLevel: null, amenities: [], coffeeTypes: [], openNow: false, region: null, city: null, district: null });
                    }}
                    className="text-xs text-red-500 hover:underline"
                    >
                    مسح الكل
                    </button>
                )}
                <button className="text-coffee-600">
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
            </div>
        </div>

        {/* Collapsible Filter Options */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[600px] opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
            <div className="space-y-4 pt-2 border-t border-gray-100">
                
                {/* Location Filter Section */}
                <div className="bg-coffee-50/50 p-3 rounded-xl border border-coffee-100">
                    <h4 className="text-xs font-bold text-coffee-800 mb-2 flex items-center gap-1">
                        <MapPin size={12} />
                        الموقع
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <select 
                            value={filters.region || ''}
                            onChange={(e) => handleLocationChange('region', e.target.value)}
                            className="text-sm p-2 rounded-lg border border-gray-200 focus:outline-none focus:border-coffee-400"
                        >
                            <option value="">المنطقة (الكل)</option>
                            {SAUDI_LOCATIONS.map(r => (
                                <option key={r.id} value={r.name}>{r.name}</option>
                            ))}
                        </select>
                        <select 
                            value={filters.city || ''}
                            disabled={!filters.region}
                            onChange={(e) => handleLocationChange('city', e.target.value)}
                            className="text-sm p-2 rounded-lg border border-gray-200 focus:outline-none focus:border-coffee-400 disabled:bg-gray-100 disabled:text-gray-400"
                        >
                            <option value="">المدينة (الكل)</option>
                            {cities.map(c => (
                                <option key={c.id} value={c.name}>{c.name}</option>
                            ))}
                        </select>
                        <select 
                            value={filters.district || ''}
                            disabled={!filters.city}
                            onChange={(e) => handleLocationChange('district', e.target.value)}
                            className="text-sm p-2 rounded-lg border border-gray-200 focus:outline-none focus:border-coffee-400 disabled:bg-gray-100 disabled:text-gray-400"
                        >
                            <option value="">الحي (الكل)</option>
                            {districts.map((d, idx) => (
                                <option key={idx} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Other Filters */}
                <div className="flex flex-wrap gap-3 items-center">
                    {/* Open Now */}
                    <button
                        onClick={toggleOpenNow}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all ${
                            filters.openNow 
                            ? 'bg-green-100 text-green-700 border border-green-200 font-bold' 
                            : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                        }`}
                    >
                        <Clock size={14} />
                        مفتوح الآن
                    </button>

                    <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>

                    {/* Price Level */}
                    <div className="flex items-center bg-gray-50 rounded-full p-1 border border-gray-200">
                        {['Low', 'Medium', 'High'].map((level) => {
                            const label = level === 'Low' ? '$' : level === 'Medium' ? '$$' : '$$$';
                            const isActive = filters.priceLevel === level;
                            return (
                                <button
                                    key={level}
                                    onClick={() => togglePrice(level)}
                                    className={`px-3 py-0.5 rounded-full text-xs font-bold transition-all ${
                                        isActive 
                                        ? 'bg-coffee-600 text-white shadow-sm' 
                                        : 'text-gray-500 hover:text-coffee-700'
                                    }`}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>

                    {/* Amenities */}
                    {AMENITY_OPTIONS.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => toggleAmenity(opt.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all border ${
                                filters.amenities.includes(opt.id)
                                ? 'bg-coffee-100 text-coffee-800 border-coffee-300 font-medium'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-coffee-300'
                            }`}
                        >
                            {opt.icon}
                            {opt.label}
                        </button>
                    ))}

                    {/* Coffee Types */}
                    {COFFEE_OPTIONS.map((type) => (
                        <button
                            key={type}
                            onClick={() => toggleCoffeeType(type)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all border ${
                                filters.coffeeTypes.includes(type)
                                ? 'bg-stone-800 text-white border-stone-800 font-medium'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-stone-400'
                            }`}
                        >
                            <Coffee size={14} />
                            {type}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
