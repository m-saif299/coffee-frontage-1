import React, { useState } from 'react';
import { X, MapPin, Navigation, MessageSquare, Send, UtensilsCrossed, Info, Wifi, Car, Sun, VolumeX, Baby, CheckCircle, Share2, Users, Clock, Copy, Check, Pencil, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Cafe, Review, MenuItem } from '../types';
import { RatingStars } from './RatingStars';

interface CafeDetailProps {
  cafe: Cafe;
  onBack: () => void;
  onAddReview: (cafeId: string, review: Review) => void;
  onEdit: (cafe: Cafe) => void;
}

export const CafeDetail: React.FC<CafeDetailProps> = ({ cafe, onBack, onAddReview, onEdit }) => {
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [showGoogleReviews, setShowGoogleReviews] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [isNoteSaved, setIsNoteSaved] = useState(false);
  
  // Share & Invite State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteTime, setInviteTime] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  const showToast = (msg: string) => {
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
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}`);
        showToast('تم نسخ رابط المقهى بنجاح');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteTime) return;
    
    // Simulate sending invite
    setShowInviteModal(false);
    showToast(`تم إرسال الدعوة إلى ${inviteName}، الوعد الساعة ${inviteTime}!`);
    setInviteName('');
    setInviteTime('');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    const review: Review = {
      user: "مستخدم محلي",
      comment: newComment,
      rating: newRating,
      date: new Date().toLocaleDateString('ar-SA')
    };
    
    onAddReview(cafe.id, review);
    setNewComment('');
    setNewRating(5);
  };

  const toggleMenuItem = (key: string) => {
    if (expandedItem === key) {
        setExpandedItem(null);
    } else {
        setExpandedItem(key);
    }
  };

  const amenityConfig: Record<string, { icon: React.ReactNode; label: string }> = {
    'Wifi': { icon: <Wifi size={18} />, label: 'واي فاي' },
    'Parking': { icon: <Car size={18} />, label: 'مواقف سيارات' },
    'Outdoor Seating': { icon: <Sun size={18} />, label: 'جلسات خارجية' },
    'Quiet': { icon: <VolumeX size={18} />, label: 'جو هادئ' },
    'Family Friendly': { icon: <Baby size={18} />, label: 'مناسب للعائلات' },
  };

  // Group menu by category
  const groupedMenu = cafe.menu ? cafe.menu.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>) : {};

  // Mock Google Reviews Data based on rating
  const mockGoogleReviews = [
    { user: "Google User A", rating: 5, comment: "مكان جميل وهادئ، القهوة ممتازة جداً.", date: "منذ أسبوع" },
    { user: "Google User B", rating: 4, comment: "الخدمة سريعة والمكان نظيف، لكن الأسعار مرتفعة قليلاً.", date: "منذ شهر" },
    { user: "Google User C", rating: cafe.googleRating ? Math.round(cafe.googleRating) : 5, comment: "تجربة رائعة، أنصح بتجربة السجنتشر.", date: "منذ يومين" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onBack} />
      
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative z-10 flex flex-col md:flex-row animate-fade-in-up">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2 animate-fade-in-up">
            <CheckCircle size={16} className="text-green-400" />
            {toastMessage}
          </div>
        )}

        {/* Close & Share Buttons Mobile */}
        <div className="absolute top-4 left-4 z-20 flex gap-2 md:hidden">
           <button 
            onClick={handleShare}
            className="bg-white/80 p-2 rounded-full shadow-md text-coffee-700"
          >
            <Share2 size={20} />
          </button>
          <button 
            onClick={onBack}
            className="bg-white/80 p-2 rounded-full shadow-md text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Image Section */}
        <div className="w-full md:w-2/5 h-64 md:h-auto relative flex-shrink-0">
          <img 
            src={cafe.imageUrl} 
            alt={cafe.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
          <div className="absolute bottom-4 right-4 text-white md:hidden">
             <h2 className="text-2xl font-bold">{cafe.name}</h2>
             <RatingStars rating={cafe.rating} size={16} />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 md:p-8 bg-white overflow-y-auto">
          <div className="hidden md:flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-coffee-900 mb-2">{cafe.name}</h2>
              <RatingStars rating={cafe.rating} size={20} />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => onEdit(cafe)}
                className="p-2 hover:bg-coffee-50 rounded-full transition-colors text-coffee-600"
                title="تعديل المقهى"
              >
                <Pencil size={24} />
              </button>
              <button 
                onClick={handleShare}
                className="p-2 hover:bg-coffee-50 rounded-full transition-colors text-coffee-600"
                title="مشاركة"
              >
                <Share2 size={24} />
              </button>
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} className="text-gray-500" />
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {/* Description */}
            <section>
                <p className="text-gray-600 leading-relaxed text-lg">
                {cafe.description}
                </p>
                
                {/* Features Tags */}
                <div className="flex flex-wrap gap-2 mt-4 mb-6">
                {(cafe.features || []).map((feature, idx) => (
                    <span key={idx} className="px-3 py-1 bg-stone-100 text-stone-600 rounded-lg text-xs font-medium">
                    {feature}
                    </span>
                ))}
                </div>

                {/* Amenities Icons */}
                {cafe.amenities && cafe.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-3 p-4 bg-coffee-50/50 rounded-2xl border border-coffee-100">
                        {cafe.amenities.map((amenity) => {
                            const config = amenityConfig[amenity] || { icon: <CheckCircle size={18} />, label: amenity };
                            return (
                                <div key={amenity} className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl shadow-sm text-coffee-700 border border-coffee-50">
                                    <div className="text-coffee-600">{config.icon}</div>
                                    <span className="text-sm font-bold">{config.label}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
            
            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 bg-stone-50 rounded-xl border border-stone-100">
              <div className="flex items-center gap-3 text-coffee-800 flex-1">
                <MapPin className="text-coffee-600 flex-shrink-0" />
                <span className="text-sm font-medium line-clamp-1">{cafe.location}</span>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowInviteModal(true)}
                  className="flex items-center justify-center gap-2 bg-white text-coffee-700 border border-coffee-200 px-4 py-2 rounded-lg hover:bg-coffee-50 transition-colors text-sm font-bold shadow-sm"
                >
                  <Users size={16} />
                  <span>الوعد هنا</span>
                </button>
                
                <a 
                  href={mapUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-coffee-600 text-white px-4 py-2 rounded-lg hover:bg-coffee-700 transition-colors text-sm font-bold shadow-sm"
                >
                  <Navigation size={16} />
                  <span>الاتجاهات</span>
                </a>
              </div>
            </div>

            {/* Google Maps Reviews Section */}
            {cafe.googleRating && (
                <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <div 
                        onClick={() => setShowGoogleReviews(!showGoogleReviews)}
                        className="p-4 flex items-center justify-between cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200">
                                <span className="text-xl font-bold text-blue-500">G</span>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-gray-800 text-lg">{cafe.googleRating.toFixed(1)}</span>
                                    <div className="flex text-yellow-400">
                                        {[1,2,3,4,5].map(s => (
                                            <Star key={s} size={12} fill={s <= (cafe.googleRating || 0) ? "currentColor" : "none"} className={s <= (cafe.googleRating || 0) ? "fill-current" : "text-gray-300"} />
                                        ))}
                                    </div>
                                </div>
                                <span className="text-xs text-gray-500">({cafe.googleReviewsCount} تقييم في Google Maps)</span>
                            </div>
                        </div>
                        <div className="text-gray-400">
                            {showGoogleReviews ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                    </div>
                    
                    {showGoogleReviews && (
                        <div className="p-4 border-t border-gray-100 bg-white animate-[fadeIn_0.2s_ease-out]">
                             <div className="space-y-3">
                                {mockGoogleReviews.map((review, i) => (
                                    <div key={i} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-sm text-gray-700">{review.user}</span>
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, starIdx) => (
                                                    <Star 
                                                        key={starIdx} 
                                                        size={10} 
                                                        fill={starIdx < review.rating ? "currentColor" : "none"} 
                                                        className={starIdx < review.rating ? "" : "text-gray-200"}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-xs text-gray-400 mr-auto">{review.date}</span>
                                        </div>
                                        <p className="text-xs text-gray-600">{review.comment}</p>
                                    </div>
                                ))}
                                <a 
                                    href={mapUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block text-center text-sm text-blue-600 font-bold hover:underline pt-2"
                                >
                                    عرض المزيد في Google Maps
                                </a>
                             </div>
                        </div>
                    )}
                </section>
            )}

             {/* Private Notes Section */}
             <section className="bg-yellow-50/80 p-5 rounded-2xl border border-yellow-100 relative">
                <h3 className="text-sm font-bold text-yellow-800 mb-2 flex items-center gap-2">
                    <Users size={16} />
                    ملاحظاتي الخاصة
                    <span className="text-xs font-normal text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">لا تظهر للآخرين</span>
                </h3>
                <textarea 
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="w-full bg-white/50 border border-yellow-200 rounded-xl p-3 text-sm text-gray-700 focus:ring-2 focus:ring-yellow-400 focus:outline-none min-h-[80px]"
                    placeholder="سجل ملاحظاتك عن هذا المقهى هنا..."
                />
                <button 
                    onClick={handleSaveNote}
                    className="mt-2 text-xs font-bold bg-yellow-200 text-yellow-800 px-3 py-1.5 rounded-lg hover:bg-yellow-300 transition-colors flex items-center gap-1"
                >
                    {isNoteSaved ? <CheckCircle size={14} /> : null}
                    {isNoteSaved ? 'تم الحفظ' : 'حفظ الملاحظة'}
                </button>
            </section>

            {/* Menu Section */}
            {cafe.menu && cafe.menu.length > 0 && (
                <section className="bg-stone-50 rounded-2xl p-6 border border-stone-100">
                    <h3 className="text-xl font-bold text-coffee-900 mb-4 flex items-center gap-2">
                        <UtensilsCrossed size={20} className="text-coffee-600" />
                        قائمة الطعام
                    </h3>
                    <div className="grid grid-cols-1 gap-6">
                        {Object.entries(groupedMenu).map(([category, items]) => (
                            <div key={category}>
                                <h4 className="font-bold text-coffee-700 mb-3 text-sm border-b border-stone-200 pb-1 inline-block">{category}</h4>
                                <ul className="space-y-3">
                                    {items.map((item, idx) => {
                                        const itemKey = `${category}-${idx}`;
                                        const isExpanded = expandedItem === itemKey;
                                        
                                        return (
                                            <li key={idx} className="group">
                                                <div 
                                                    className="flex justify-between items-end text-sm cursor-pointer"
                                                    onClick={() => toggleMenuItem(itemKey)}
                                                >
                                                    <div className="flex items-center gap-1 relative z-10 bg-stone-50 pl-2 text-gray-700 font-medium group-hover:text-coffee-700 transition-colors">
                                                        <span>{item.name}</span>
                                                        <ChevronDown size={12} className={`text-coffee-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                                    </div>
                                                    <span className="flex-1 border-b border-dotted border-gray-300 mb-1 mx-1"></span>
                                                    <span className="text-coffee-900 font-bold whitespace-nowrap">{item.price}</span>
                                                </div>
                                                
                                                {/* Expandable Detail Section */}
                                                {isExpanded && (
                                                    <div className="mt-3 text-xs text-gray-500 bg-white border border-stone-200 p-3 rounded-lg shadow-sm animate-[fadeIn_0.2s_ease-out] flex gap-3 items-start">
                                                        {item.imageUrl && (
                                                            <img 
                                                                src={item.imageUrl} 
                                                                alt={item.name} 
                                                                className="w-16 h-16 object-cover rounded-lg shadow-sm flex-shrink-0"
                                                            />
                                                        )}
                                                        <div className="flex-1">
                                                            <div className="font-bold text-gray-800 mb-1">{item.name}</div>
                                                            <p>{item.description || "لا يوجد وصف متاح."}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Reviews Section */}
            <section>
              <h3 className="text-xl font-bold text-coffee-900 mb-4 flex items-center gap-2">
                <MessageSquare size={20} />
                التعليقات داخل التطبيق ({(cafe.reviews || []).length})
              </h3>
              
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-coffee-200 mb-6">
                {(!cafe.reviews || cafe.reviews.length === 0) && <p className="text-gray-400 text-sm">لا توجد تعليقات بعد. كن أول من يقيم!</p>}
                {(cafe.reviews || []).map((review, idx) => (
                  <div key={idx} className="bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-sm text-gray-800">{review.user}</span>
                      <span className="text-xs text-gray-400">{review.date}</span>
                    </div>
                    <RatingStars rating={review.rating} size={12} />
                    <p className="text-gray-600 text-sm mt-2">{review.comment}</p>
                  </div>
                ))}
              </div>

              {/* Add Review Form */}
              <form onSubmit={handleSubmitReview} className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                <h4 className="font-bold text-sm text-coffee-800 mb-3">أضف تقييمك</h4>
                <div className="mb-3">
                  <RatingStars rating={newRating} interactive onRate={setNewRating} size={24} />
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="شاركنا تجربتك..."
                    className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-coffee-500 text-sm"
                  />
                  <button 
                    type="submit"
                    disabled={!newComment.trim()}
                    className="bg-coffee-600 text-white p-2 rounded-lg hover:bg-coffee-700 disabled:opacity-50 transition-colors"
                  >
                    <Send size={18} className="rotate-180" />
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>

      {/* Invite Friend Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-fade-in-up">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-coffee-900 flex items-center gap-2">
                        <Users size={20} className="text-coffee-600" />
                        الوعد هنا
                    </h3>
                    <button onClick={() => setShowInviteModal(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>
                
                <p className="text-sm text-gray-500 mb-4">
                    أرسل دعوة لصديق لمقابلتك في <span className="font-bold text-coffee-700">{cafe.name}</span>.
                </p>

                <form onSubmit={handleSendInvite} className="space-y-3">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">اسم الصديق</label>
                        <input 
                            type="text" 
                            required
                            value={inviteName}
                            onChange={(e) => setInviteName(e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-coffee-500 focus:outline-none text-sm"
                            placeholder="مثال: محمد، سارة..."
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">وقت اللقاء</label>
                        <input 
                            type="time" 
                            required
                            value={inviteTime}
                            onChange={(e) => setInviteTime(e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-coffee-500 focus:outline-none text-sm"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-coffee-600 text-white py-3 rounded-xl font-bold hover:bg-coffee-700 transition-colors flex items-center justify-center gap-2 mt-2"
                    >
                        <Send size={16} className="rotate-180" />
                        <span>إرسال الدعوة</span>
                    </button>
                </form>
            </div>
        </div>
      )}

    </div>
  );
};
