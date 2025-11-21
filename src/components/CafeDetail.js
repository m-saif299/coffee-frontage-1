import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { X, MapPin, Navigation, MessageSquare, Send, UtensilsCrossed, Wifi, Car, Sun, VolumeX, Baby, CheckCircle, Share2, Users, Pencil, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { RatingStars } from './RatingStars';
export const CafeDetail = ({ cafe, onBack, onAddReview, onEdit }) => {
    const [newComment, setNewComment] = useState('');
    const [newRating, setNewRating] = useState(5);
    const [expandedItem, setExpandedItem] = useState(null);
    const [showGoogleReviews, setShowGoogleReviews] = useState(false);
    const [noteText, setNoteText] = useState('');
    const [isNoteSaved, setIsNoteSaved] = useState(false);
    // Share & Invite State
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteName, setInviteName] = useState('');
    const [inviteTime, setInviteTime] = useState('');
    const [toastMessage, setToastMessage] = useState(null);
    // Load notes on mount
    React.useEffect(() => {
        const savedNote = localStorage.getItem(`note_${cafe.id}`);
        if (savedNote) {
            setNoteText(savedNote);
        }
    }, [cafe.id]);
    const handleSaveNote = () => {
        localStorage.setItem(`note_${cafe.id}`, noteText);
        setIsNoteSaved(true);
        setTimeout(() => setIsNoteSaved(false), 2000);
    };
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cafe.name + ' ' + cafe.location)}`;
    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };
    const handleShare = async () => {
        const shareData = {
            title: `واجهة القهوة: ${cafe.name}`,
            text: `شوف هذا المقهى الرهيب: ${cafe.name}\n${cafe.description}\nالتقييم: ${cafe.rating}/5`,
            url: window.location.href
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            }
            else {
                // Fallback to clipboard
                await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}`);
                showToast('تم نسخ رابط المقهى بنجاح');
            }
        }
        catch (err) {
            console.error('Error sharing:', err);
        }
    };
    const handleSendInvite = (e) => {
        e.preventDefault();
        if (!inviteName || !inviteTime)
            return;
        // Simulate sending invite
        setShowInviteModal(false);
        showToast(`تم إرسال الدعوة إلى ${inviteName}، الوعد الساعة ${inviteTime}!`);
        setInviteName('');
        setInviteTime('');
    };
    const handleSubmitReview = (e) => {
        e.preventDefault();
        if (!newComment.trim())
            return;
        const review = {
            user: "مستخدم محلي",
            comment: newComment,
            rating: newRating,
            date: new Date().toLocaleDateString('ar-SA')
        };
        onAddReview(cafe.id, review);
        setNewComment('');
        setNewRating(5);
    };
    const toggleMenuItem = (key) => {
        if (expandedItem === key) {
            setExpandedItem(null);
        }
        else {
            setExpandedItem(key);
        }
    };
    const amenityConfig = {
        'Wifi': { icon: _jsx(Wifi, { size: 18 }), label: 'واي فاي' },
        'Parking': { icon: _jsx(Car, { size: 18 }), label: 'مواقف سيارات' },
        'Outdoor Seating': { icon: _jsx(Sun, { size: 18 }), label: 'جلسات خارجية' },
        'Quiet': { icon: _jsx(VolumeX, { size: 18 }), label: 'جو هادئ' },
        'Family Friendly': { icon: _jsx(Baby, { size: 18 }), label: 'مناسب للعائلات' },
    };
    // Group menu by category
    const groupedMenu = cafe.menu ? cafe.menu.reduce((acc, item) => {
        if (!acc[item.category])
            acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {}) : {};
    // Mock Google Reviews Data based on rating
    const mockGoogleReviews = [
        { user: "Google User A", rating: 5, comment: "مكان جميل وهادئ، القهوة ممتازة جداً.", date: "منذ أسبوع" },
        { user: "Google User B", rating: 4, comment: "الخدمة سريعة والمكان نظيف، لكن الأسعار مرتفعة قليلاً.", date: "منذ شهر" },
        { user: "Google User C", rating: cafe.googleRating ? Math.round(cafe.googleRating) : 5, comment: "تجربة رائعة، أنصح بتجربة السجنتشر.", date: "منذ يومين" }
    ];
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6", children: [_jsx("div", { className: "absolute inset-0 bg-black/40 backdrop-blur-sm", onClick: onBack }), _jsxs("div", { className: "bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative z-10 flex flex-col md:flex-row animate-fade-in-up", children: [toastMessage && (_jsxs("div", { className: "absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2 animate-fade-in-up", children: [_jsx(CheckCircle, { size: 16, className: "text-green-400" }), toastMessage] })), _jsxs("div", { className: "absolute top-4 left-4 z-20 flex gap-2 md:hidden", children: [_jsx("button", { onClick: handleShare, className: "bg-white/80 p-2 rounded-full shadow-md text-coffee-700", children: _jsx(Share2, { size: 20 }) }), _jsx("button", { onClick: onBack, className: "bg-white/80 p-2 rounded-full shadow-md text-gray-700", children: _jsx(X, { size: 20 }) })] }), _jsxs("div", { className: "w-full md:w-2/5 h-64 md:h-auto relative flex-shrink-0", children: [_jsx("img", { src: cafe.imageUrl, alt: cafe.name, className: "w-full h-full object-cover" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" }), _jsxs("div", { className: "absolute bottom-4 right-4 text-white md:hidden", children: [_jsx("h2", { className: "text-2xl font-bold", children: cafe.name }), _jsx(RatingStars, { rating: cafe.rating, size: 16 })] })] }), _jsxs("div", { className: "flex-1 p-6 md:p-8 bg-white overflow-y-auto", children: [_jsxs("div", { className: "hidden md:flex justify-between items-start mb-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold text-coffee-900 mb-2", children: cafe.name }), _jsx(RatingStars, { rating: cafe.rating, size: 20 })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => onEdit(cafe), className: "p-2 hover:bg-coffee-50 rounded-full transition-colors text-coffee-600", title: "\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0645\u0642\u0647\u0649", children: _jsx(Pencil, { size: 24 }) }), _jsx("button", { onClick: handleShare, className: "p-2 hover:bg-coffee-50 rounded-full transition-colors text-coffee-600", title: "\u0645\u0634\u0627\u0631\u0643\u0629", children: _jsx(Share2, { size: 24 }) }), _jsx("button", { onClick: onBack, className: "p-2 hover:bg-gray-100 rounded-full transition-colors", children: _jsx(X, { size: 24, className: "text-gray-500" }) })] })] }), _jsxs("div", { className: "space-y-8", children: [_jsxs("section", { children: [_jsx("p", { className: "text-gray-600 leading-relaxed text-lg", children: cafe.description }), _jsx("div", { className: "flex flex-wrap gap-2 mt-4 mb-6", children: (cafe.features || []).map((feature, idx) => (_jsx("span", { className: "px-3 py-1 bg-stone-100 text-stone-600 rounded-lg text-xs font-medium", children: feature }, idx))) }), cafe.amenities && cafe.amenities.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-3 p-4 bg-coffee-50/50 rounded-2xl border border-coffee-100", children: cafe.amenities.map((amenity) => {
                                                    const config = amenityConfig[amenity] || { icon: _jsx(CheckCircle, { size: 18 }), label: amenity };
                                                    return (_jsxs("div", { className: "flex items-center gap-2 bg-white px-3 py-2 rounded-xl shadow-sm text-coffee-700 border border-coffee-50", children: [_jsx("div", { className: "text-coffee-600", children: config.icon }), _jsx("span", { className: "text-sm font-bold", children: config.label })] }, amenity));
                                                }) }))] }), _jsxs("div", { className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 bg-stone-50 rounded-xl border border-stone-100", children: [_jsxs("div", { className: "flex items-center gap-3 text-coffee-800 flex-1", children: [_jsx(MapPin, { className: "text-coffee-600 flex-shrink-0" }), _jsx("span", { className: "text-sm font-medium line-clamp-1", children: cafe.location })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: () => setShowInviteModal(true), className: "flex items-center justify-center gap-2 bg-white text-coffee-700 border border-coffee-200 px-4 py-2 rounded-lg hover:bg-coffee-50 transition-colors text-sm font-bold shadow-sm", children: [_jsx(Users, { size: 16 }), _jsx("span", { children: "\u0627\u0644\u0648\u0639\u062F \u0647\u0646\u0627" })] }), _jsxs("a", { href: mapUrl, target: "_blank", rel: "noopener noreferrer", className: "flex items-center justify-center gap-2 bg-coffee-600 text-white px-4 py-2 rounded-lg hover:bg-coffee-700 transition-colors text-sm font-bold shadow-sm", children: [_jsx(Navigation, { size: 16 }), _jsx("span", { children: "\u0627\u0644\u0627\u062A\u062C\u0627\u0647\u0627\u062A" })] })] })] }), cafe.googleRating && (_jsxs("section", { className: "bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden", children: [_jsxs("div", { onClick: () => setShowGoogleReviews(!showGoogleReviews), className: "p-4 flex items-center justify-between cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200", children: _jsx("span", { className: "text-xl font-bold text-blue-500", children: "G" }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-bold text-gray-800 text-lg", children: cafe.googleRating.toFixed(1) }), _jsx("div", { className: "flex text-yellow-400", children: [1, 2, 3, 4, 5].map(s => (_jsx(Star, { size: 12, fill: s <= (cafe.googleRating || 0) ? "currentColor" : "none", className: s <= (cafe.googleRating || 0) ? "fill-current" : "text-gray-300" }, s))) })] }), _jsxs("span", { className: "text-xs text-gray-500", children: ["(", cafe.googleReviewsCount, " \u062A\u0642\u064A\u064A\u0645 \u0641\u064A Google Maps)"] })] })] }), _jsx("div", { className: "text-gray-400", children: showGoogleReviews ? _jsx(ChevronUp, { size: 20 }) : _jsx(ChevronDown, { size: 20 }) })] }), showGoogleReviews && (_jsx("div", { className: "p-4 border-t border-gray-100 bg-white animate-[fadeIn_0.2s_ease-out]", children: _jsxs("div", { className: "space-y-3", children: [mockGoogleReviews.map((review, i) => (_jsxs("div", { className: "border-b border-gray-100 last:border-0 pb-3 last:pb-0", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("span", { className: "font-bold text-sm text-gray-700", children: review.user }), _jsx("div", { className: "flex text-yellow-400", children: [...Array(5)].map((_, starIdx) => (_jsx(Star, { size: 10, fill: starIdx < review.rating ? "currentColor" : "none", className: starIdx < review.rating ? "" : "text-gray-200" }, starIdx))) }), _jsx("span", { className: "text-xs text-gray-400 mr-auto", children: review.date })] }), _jsx("p", { className: "text-xs text-gray-600", children: review.comment })] }, i))), _jsx("a", { href: mapUrl, target: "_blank", rel: "noopener noreferrer", className: "block text-center text-sm text-blue-600 font-bold hover:underline pt-2", children: "\u0639\u0631\u0636 \u0627\u0644\u0645\u0632\u064A\u062F \u0641\u064A Google Maps" })] }) }))] })), _jsxs("section", { className: "bg-yellow-50/80 p-5 rounded-2xl border border-yellow-100 relative", children: [_jsxs("h3", { className: "text-sm font-bold text-yellow-800 mb-2 flex items-center gap-2", children: [_jsx(Users, { size: 16 }), "\u0645\u0644\u0627\u062D\u0638\u0627\u062A\u064A \u0627\u0644\u062E\u0627\u0635\u0629", _jsx("span", { className: "text-xs font-normal text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full", children: "\u0644\u0627 \u062A\u0638\u0647\u0631 \u0644\u0644\u0622\u062E\u0631\u064A\u0646" })] }), _jsx("textarea", { value: noteText, onChange: (e) => setNoteText(e.target.value), className: "w-full bg-white/50 border border-yellow-200 rounded-xl p-3 text-sm text-gray-700 focus:ring-2 focus:ring-yellow-400 focus:outline-none min-h-[80px]", placeholder: "\u0633\u062C\u0644 \u0645\u0644\u0627\u062D\u0638\u0627\u062A\u0643 \u0639\u0646 \u0647\u0630\u0627 \u0627\u0644\u0645\u0642\u0647\u0649 \u0647\u0646\u0627..." }), _jsxs("button", { onClick: handleSaveNote, className: "mt-2 text-xs font-bold bg-yellow-200 text-yellow-800 px-3 py-1.5 rounded-lg hover:bg-yellow-300 transition-colors flex items-center gap-1", children: [isNoteSaved ? _jsx(CheckCircle, { size: 14 }) : null, isNoteSaved ? 'تم الحفظ' : 'حفظ الملاحظة'] })] }), cafe.menu && cafe.menu.length > 0 && (_jsxs("section", { className: "bg-stone-50 rounded-2xl p-6 border border-stone-100", children: [_jsxs("h3", { className: "text-xl font-bold text-coffee-900 mb-4 flex items-center gap-2", children: [_jsx(UtensilsCrossed, { size: 20, className: "text-coffee-600" }), "\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0637\u0639\u0627\u0645"] }), _jsx("div", { className: "grid grid-cols-1 gap-6", children: Object.entries(groupedMenu).map(([category, items]) => (_jsxs("div", { children: [_jsx("h4", { className: "font-bold text-coffee-700 mb-3 text-sm border-b border-stone-200 pb-1 inline-block", children: category }), _jsx("ul", { className: "space-y-3", children: items.map((item, idx) => {
                                                                const itemKey = `${category}-${idx}`;
                                                                const isExpanded = expandedItem === itemKey;
                                                                return (_jsxs("li", { className: "group", children: [_jsxs("div", { className: "flex justify-between items-end text-sm cursor-pointer", onClick: () => toggleMenuItem(itemKey), children: [_jsxs("div", { className: "flex items-center gap-1 relative z-10 bg-stone-50 pl-2 text-gray-700 font-medium group-hover:text-coffee-700 transition-colors", children: [_jsx("span", { children: item.name }), _jsx(ChevronDown, { size: 12, className: `text-coffee-400 transition-transform ${isExpanded ? 'rotate-180' : ''}` })] }), _jsx("span", { className: "flex-1 border-b border-dotted border-gray-300 mb-1 mx-1" }), _jsx("span", { className: "text-coffee-900 font-bold whitespace-nowrap", children: item.price })] }), isExpanded && (_jsxs("div", { className: "mt-3 text-xs text-gray-500 bg-white border border-stone-200 p-3 rounded-lg shadow-sm animate-[fadeIn_0.2s_ease-out] flex gap-3 items-start", children: [item.imageUrl && (_jsx("img", { src: item.imageUrl, alt: item.name, className: "w-16 h-16 object-cover rounded-lg shadow-sm flex-shrink-0" })), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-bold text-gray-800 mb-1", children: item.name }), _jsx("p", { children: item.description || "لا يوجد وصف متاح." })] })] }))] }, idx));
                                                            }) })] }, category))) })] })), _jsxs("section", { children: [_jsxs("h3", { className: "text-xl font-bold text-coffee-900 mb-4 flex items-center gap-2", children: [_jsx(MessageSquare, { size: 20 }), "\u0627\u0644\u062A\u0639\u0644\u064A\u0642\u0627\u062A \u062F\u0627\u062E\u0644 \u0627\u0644\u062A\u0637\u0628\u064A\u0642 (", (cafe.reviews || []).length, ")"] }), _jsxs("div", { className: "space-y-4 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-coffee-200 mb-6", children: [(!cafe.reviews || cafe.reviews.length === 0) && _jsx("p", { className: "text-gray-400 text-sm", children: "\u0644\u0627 \u062A\u0648\u062C\u062F \u062A\u0639\u0644\u064A\u0642\u0627\u062A \u0628\u0639\u062F. \u0643\u0646 \u0623\u0648\u0644 \u0645\u0646 \u064A\u0642\u064A\u0645!" }), (cafe.reviews || []).map((review, idx) => (_jsxs("div", { className: "bg-white border border-gray-100 p-3 rounded-xl shadow-sm", children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsx("span", { className: "font-bold text-sm text-gray-800", children: review.user }), _jsx("span", { className: "text-xs text-gray-400", children: review.date })] }), _jsx(RatingStars, { rating: review.rating, size: 12 }), _jsx("p", { className: "text-gray-600 text-sm mt-2", children: review.comment })] }, idx)))] }), _jsxs("form", { onSubmit: handleSubmitReview, className: "bg-stone-50 p-4 rounded-xl border border-stone-200", children: [_jsx("h4", { className: "font-bold text-sm text-coffee-800 mb-3", children: "\u0623\u0636\u0641 \u062A\u0642\u064A\u064A\u0645\u0643" }), _jsx("div", { className: "mb-3", children: _jsx(RatingStars, { rating: newRating, interactive: true, onRate: setNewRating, size: 24 }) }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: newComment, onChange: (e) => setNewComment(e.target.value), placeholder: "\u0634\u0627\u0631\u0643\u0646\u0627 \u062A\u062C\u0631\u0628\u062A\u0643...", className: "flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-coffee-500 text-sm" }), _jsx("button", { type: "submit", disabled: !newComment.trim(), className: "bg-coffee-600 text-white p-2 rounded-lg hover:bg-coffee-700 disabled:opacity-50 transition-colors", children: _jsx(Send, { size: 18, className: "rotate-180" }) })] })] })] })] })] })] }), showInviteModal && (_jsx("div", { className: "fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm", children: _jsxs("div", { className: "bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-fade-in-up", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsxs("h3", { className: "text-xl font-bold text-coffee-900 flex items-center gap-2", children: [_jsx(Users, { size: 20, className: "text-coffee-600" }), "\u0627\u0644\u0648\u0639\u062F \u0647\u0646\u0627"] }), _jsx("button", { onClick: () => setShowInviteModal(false), className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { size: 20 }) })] }), _jsxs("p", { className: "text-sm text-gray-500 mb-4", children: ["\u0623\u0631\u0633\u0644 \u062F\u0639\u0648\u0629 \u0644\u0635\u062F\u064A\u0642 \u0644\u0645\u0642\u0627\u0628\u0644\u062A\u0643 \u0641\u064A ", _jsx("span", { className: "font-bold text-coffee-700", children: cafe.name }), "."] }), _jsxs("form", { onSubmit: handleSendInvite, className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-gray-700 mb-1", children: "\u0627\u0633\u0645 \u0627\u0644\u0635\u062F\u064A\u0642" }), _jsx("input", { type: "text", required: true, value: inviteName, onChange: (e) => setInviteName(e.target.value), className: "w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-coffee-500 focus:outline-none text-sm", placeholder: "\u0645\u062B\u0627\u0644: \u0645\u062D\u0645\u062F\u060C \u0633\u0627\u0631\u0629..." })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-gray-700 mb-1", children: "\u0648\u0642\u062A \u0627\u0644\u0644\u0642\u0627\u0621" }), _jsx("input", { type: "time", required: true, value: inviteTime, onChange: (e) => setInviteTime(e.target.value), className: "w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-coffee-500 focus:outline-none text-sm" })] }), _jsxs("button", { type: "submit", className: "w-full bg-coffee-600 text-white py-3 rounded-xl font-bold hover:bg-coffee-700 transition-colors flex items-center justify-center gap-2 mt-2", children: [_jsx(Send, { size: 16, className: "rotate-180" }), _jsx("span", { children: "\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u062F\u0639\u0648\u0629" })] })] })] }) }))] }));
};
