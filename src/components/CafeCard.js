import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MapPin, ArrowRight, Clock } from 'lucide-react';
import { RatingStars } from './RatingStars';
export const CafeCard = ({ cafe, onClick }) => {
    const getPriceLabel = (level) => {
        if (level === 'High')
            return '$$$';
        if (level === 'Medium')
            return '$$';
        return '$';
    };
    // Safe access to arrays
    const tags = (cafe.coffeeTypes && cafe.coffeeTypes.length > 0)
        ? cafe.coffeeTypes
        : (cafe.features || []);
    return (_jsxs("div", { className: "bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer border border-coffee-100 relative", onClick: () => onClick(cafe), children: [_jsxs("div", { className: "relative h-48 overflow-hidden", children: [_jsx("img", { src: cafe.imageUrl, alt: cafe.name, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" }), _jsx("div", { className: "absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm", children: _jsx(RatingStars, { rating: cafe.rating, size: 14 }) }), cafe.isOpen && (_jsxs("div", { className: "absolute top-3 left-3 bg-green-500/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg shadow-sm font-bold flex items-center gap-1", children: [_jsx(Clock, { size: 12 }), "\u0645\u0641\u062A\u0648\u062D"] }))] }), _jsxs("div", { className: "p-5", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsx("h3", { className: "text-xl font-bold text-coffee-900 line-clamp-1", children: cafe.name }), _jsx("span", { className: "text-xs font-bold text-coffee-600 bg-coffee-50 px-2 py-1 rounded-md border border-coffee-100", children: getPriceLabel(cafe.priceLevel) })] }), _jsxs("div", { className: "flex items-start gap-2 text-coffee-600 text-sm mb-3", children: [_jsx(MapPin, { size: 16, className: "mt-1 flex-shrink-0" }), _jsx("span", { className: "line-clamp-2", children: cafe.location })] }), _jsx("p", { className: "text-gray-500 text-sm line-clamp-2 mb-4", children: cafe.description }), _jsx("div", { className: "flex flex-wrap gap-2 mb-4", children: tags.slice(0, 3).map((tag, idx) => (_jsx("span", { className: "text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded-full", children: tag }, idx))) }), _jsxs("button", { className: "w-full flex items-center justify-center gap-2 bg-coffee-50 text-coffee-700 py-2 rounded-xl font-medium group-hover:bg-coffee-600 group-hover:text-white transition-colors", children: [_jsx("span", { children: "\u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644" }), _jsx(ArrowRight, { size: 16, className: "rotate-180 group-hover:-translate-x-1 transition-transform" })] })] })] }));
};
