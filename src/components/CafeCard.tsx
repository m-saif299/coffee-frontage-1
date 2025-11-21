import React from 'react';
import { MapPin, ArrowRight, Clock } from 'lucide-react';
import { Cafe } from '../types';
import { RatingStars } from './RatingStars';

interface CafeCardProps {
  cafe: Cafe;
  onClick: (cafe: Cafe) => void;
}

export const CafeCard: React.FC<CafeCardProps> = ({ cafe, onClick }) => {
  
  const getPriceLabel = (level: string) => {
    if (level === 'High') return '$$$';
    if (level === 'Medium') return '$$';
    return '$';
  };

  // Safe access to arrays
  const tags = (cafe.coffeeTypes && cafe.coffeeTypes.length > 0) 
    ? cafe.coffeeTypes 
    : (cafe.features || []);

  return (
    <div 
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer border border-coffee-100 relative"
      onClick={() => onClick(cafe)}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={cafe.imageUrl} 
          alt={cafe.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
          <RatingStars rating={cafe.rating} size={14} />
        </div>
        
        {/* Open Status Badge */}
        {cafe.isOpen && (
            <div className="absolute top-3 left-3 bg-green-500/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg shadow-sm font-bold flex items-center gap-1">
                <Clock size={12} />
                مفتوح
            </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-coffee-900 line-clamp-1">{cafe.name}</h3>
            <span className="text-xs font-bold text-coffee-600 bg-coffee-50 px-2 py-1 rounded-md border border-coffee-100">
                {getPriceLabel(cafe.priceLevel)}
            </span>
        </div>
        
        <div className="flex items-start gap-2 text-coffee-600 text-sm mb-3">
          <MapPin size={16} className="mt-1 flex-shrink-0" />
          <span className="line-clamp-2">{cafe.location}</span>
        </div>
        
        <p className="text-gray-500 text-sm line-clamp-2 mb-4">
          {cafe.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
            {/* Show Coffee Types first if available, or fallback to features */}
            {tags.slice(0, 3).map((tag, idx) => (
                <span key={idx} className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded-full">
                    {tag}
                </span>
            ))}
        </div>

        <button className="w-full flex items-center justify-center gap-2 bg-coffee-50 text-coffee-700 py-2 rounded-xl font-medium group-hover:bg-coffee-600 group-hover:text-white transition-colors">
          <span>التفاصيل</span>
          <ArrowRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};