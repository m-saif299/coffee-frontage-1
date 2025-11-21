import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Star, StarHalf } from 'lucide-react';
export const RatingStars = ({ rating, size = 16, interactive = false, onRate }) => {
    // Safety check: ensure rating is a number, default to 0 if undefined/null
    const safeRating = typeof rating === 'number' ? rating : 0;
    return (_jsxs("div", { className: "flex items-center gap-1 text-yellow-500", children: [[1, 2, 3, 4, 5].map((star) => (_jsx("button", { type: "button", disabled: !interactive, onClick: () => interactive && onRate && onRate(star), className: `${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`, children: safeRating >= star ? (_jsx(Star, { size: size, fill: "currentColor" })) : safeRating >= star - 0.5 ? (_jsx(StarHalf, { size: size, fill: "currentColor" })) : (_jsx(Star, { size: size })) }, star))), !interactive && _jsx("span", { className: "text-coffee-700 text-sm font-medium mr-1", children: safeRating.toFixed(1) })] }));
};
