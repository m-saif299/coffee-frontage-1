import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
console.log("SUPABASE URL IS:", import.meta.env.VITE_SUPABASE_URL);
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, MapPin, Coffee, Plus, Loader2 } from 'lucide-react';
import { ViewState } from './types';
import { CafeCard } from './components/CafeCard';
import { CafeDetail } from './components/CafeDetail';
import { AddCafeModal } from './components/AddCafeModal';
import { LoginModal } from './components/LoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { ManagerDashboard } from './components/ManagerDashboard';
import { FilterBar } from './components/FilterBar';
import { supabase } from "./lib/supabase";
/* -------------------------------------------------
   دالة بحث مؤقتة بدون أي AI — بيانات وهمية
---------------------------------------------------*/
const POPULAR_CITIES = ['الرياض', 'جدة', 'الدمام', 'دبي', 'القاهرة'];
export default function App() {
    const [city, setCity] = useState('');
    const [cafes, setCafes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewState, setViewState] = useState(ViewState.LIST);
    const [selectedCafe, setSelectedCafe] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingCafe, setEditingCafe] = useState(null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState({
        role: 'GUEST'
    });
    const [filters, setFilters] = useState({
        priceLevel: null,
        amenities: [],
        coffeeTypes: [],
        openNow: false,
        region: null,
        city: null,
        district: null
    });
    useEffect(() => {
        handleSearch('الرياض');
    }, []);
    const handleSearch = useCallback(async (searchCity) => {
        if (!searchCity.trim())
            return;
        setCity(searchCity);
        setLoading(true);
        setCafes([]);
        setViewState(ViewState.LIST);
        setSelectedCafe(null);
        setEditingCafe(null);
        try {
            // اجلب كل المقاهي التي تحتوي على اسم المدينة في الموقع
            const { data, error } = await supabase
                .from("cafes")
                .select("*")
                .ilike("location", `%${searchCity}%`);
            if (error) {
                console.error("Supabase Fetch Error:", error);
                return;
            }
            // تحويل البيانات إلى تنسيق Cafe
            const normalized = data?.map((item) => ({
                id: item.id,
                name: item.name,
                description: item.description,
                location: item.location,
                imageUrl: item.image_url,
                priceLevel: item.price_level,
                isOpen: item.is_open,
                rating: item.rating,
                amenities: item.amenities || [],
                coffeeTypes: item.coffee_types || [],
                features: item.features || [],
                reviews: [], // لاحقًا نضيف جدول reviews
                menu: item.menu || []
            })) || [];
            setCafes(normalized);
            setFilters({
                priceLevel: null,
                amenities: [],
                coffeeTypes: [],
                openNow: false,
                region: null,
                city: null,
                district: null
            });
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    }, []);
    const handleCafeClick = (cafe) => {
        setSelectedCafe(cafe);
        setViewState(ViewState.DETAIL);
    };
    const handleBackToHome = () => {
        setSelectedCafe(null);
        setViewState(ViewState.LIST);
    };
    const handleAddReview = (cafeId, review) => {
        setCafes(prev => prev.map(c => (c.id === cafeId ? { ...c, reviews: [review, ...c.reviews] } : c)));
        if (selectedCafe && selectedCafe.id === cafeId) {
            setSelectedCafe(prev => prev ? { ...prev, reviews: [review, ...prev.reviews] } : null);
        }
    };
    const handleSaveCafe = async (savedCafe) => {
        try {
            // إرسال البيانات إلى Supabase
            const { data, error } = await supabase
                .from("cafes")
                .insert({
                name: savedCafe.name,
                description: savedCafe.description,
                location: savedCafe.location,
                image_url: savedCafe.imageUrl,
                price_level: savedCafe.priceLevel,
                is_open: savedCafe.isOpen,
                rating: savedCafe.rating,
                amenities: savedCafe.amenities,
                coffee_types: savedCafe.coffeeTypes,
                features: savedCafe.features,
                menu: savedCafe.menu
            })
                .select(); // هذا يرجع لك البيانات + ال id الجديد
            if (error) {
                console.error("Insert error:", error);
                return;
            }
            const inserted = data[0];
            // إضافة المقهى الجديد مباشرة للواجهة
            setCafes((prev) => [
                {
                    ...savedCafe,
                    id: inserted.id
                },
                ...prev
            ]);
            // إغلاق المودال
            setEditingCafe(null);
            setIsAddModalOpen(false);
        }
        catch (err) {
            console.error(err);
        }
    };
    const handleOpenAddModal = () => {
        setEditingCafe(null);
        setIsAddModalOpen(true);
    };
    const handleLoginSuccess = (role, cafeId) => {
        setCurrentUser({ role, cafeId });
        if (role === 'ADMIN')
            setViewState(ViewState.ADMIN_DASHBOARD);
        if (role === 'MANAGER')
            setViewState(ViewState.MANAGER_DASHBOARD);
    };
    const handleLogout = () => {
        setCurrentUser({ role: 'GUEST' });
        setViewState(ViewState.LIST);
    };
    const filteredCafes = useMemo(() => {
        return cafes.filter(cafe => {
            if (filters.priceLevel && cafe.priceLevel !== filters.priceLevel)
                return false;
            if (filters.openNow && !cafe.isOpen)
                return false;
            if (filters.amenities.length > 0) {
                const hasAll = filters.amenities.every(f => cafe.amenities?.includes(f));
                if (!hasAll)
                    return false;
            }
            if (filters.coffeeTypes.length > 0) {
                const hasAll = filters.coffeeTypes.every(t => cafe.coffeeTypes?.includes(t));
                if (!hasAll)
                    return false;
            }
            if (filters.city && !cafe.location.includes(filters.city))
                return false;
            if (filters.district && !cafe.location.includes(filters.district))
                return false;
            return true;
        });
    }, [cafes, filters]);
    const renderView = () => {
        switch (viewState) {
            case ViewState.ADMIN_DASHBOARD:
                return (_jsx(AdminDashboard, { cafes: cafes, onAddCafe: handleOpenAddModal, onDeleteCafe: (id) => setCafes(prev => prev.filter(c => c.id !== id)), onBack: handleBackToHome }));
            case ViewState.MANAGER_DASHBOARD:
                const myCafe = cafes.find(c => c.id === currentUser.cafeId);
                if (!myCafe)
                    return _jsx("div", { className: "p-10 text-center", children: "\u0644\u0645 \u064A\u062A\u0645 \u0627\u0644\u0639\u062B\u0648\u0631 \u0639\u0644\u0649 \u0627\u0644\u0645\u0642\u0647\u0649 \u0627\u0644\u062E\u0627\u0635 \u0628\u0643" });
                return (_jsx(ManagerDashboard, { cafe: myCafe, onEdit: () => handleEditCafe(myCafe), onPreview: () => handleCafeClick(myCafe), onBack: handleBackToHome }));
            case ViewState.DETAIL:
                if (!selectedCafe)
                    return null;
                return (_jsx(CafeDetail, { cafe: selectedCafe, onBack: handleBackToHome, onAddReview: handleAddReview, onEdit: handleEditCafe }));
            default:
                return (_jsxs("main", { className: "flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsxs("h3", { className: "text-xl font-bold text-coffee-900 flex items-center gap-2", children: [_jsx(MapPin, { size: 20, className: "text-coffee-600" }), "\u0646\u062A\u0627\u0626\u062C \u0627\u0644\u0628\u062D\u062B \u0641\u064A: ", _jsx("span", { className: "text-coffee-600", children: city || '...' })] }), _jsxs("span", { className: "text-sm text-gray-500 font-medium", children: [filteredCafes.length, " \u0645\u0642\u0647\u0649", cafes.length !== filteredCafes.length && (_jsxs("span", { className: "text-xs", children: [" (\u0645\u0646 ", cafes.length, ")"] }))] })] }), loading ? (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: [1, 2, 3, 4, 5, 6].map(i => (_jsxs("div", { className: "bg-white rounded-2xl h-80 shadow-sm animate-pulse flex flex-col overflow-hidden", children: [_jsx("div", { className: "h-48 bg-gray-200" }), _jsxs("div", { className: "p-5 space-y-3", children: [_jsx("div", { className: "h-6 bg-gray-200 rounded w-3/4" }), _jsx("div", { className: "h-4 bg-gray-200 rounded w-1/2" }), _jsx("div", { className: "h-10 bg-gray-200 rounded w-full mt-auto" })] })] }, i))) })) : (_jsx(_Fragment, { children: filteredCafes.length > 0 ? (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-12", children: filteredCafes.map(cafe => (_jsx(CafeCard, { cafe: cafe, onClick: handleCafeClick }, cafe.id))) })) : (_jsxs("div", { className: "text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-coffee-200", children: [_jsx(Coffee, { size: 48, className: "mx-auto text-coffee-300 mb-4" }), _jsx("h3", { className: "text-xl font-bold text-gray-400", children: "\u0644\u0627 \u062A\u0648\u062C\u062F \u0646\u062A\u0627\u0626\u062C \u062A\u0637\u0627\u0628\u0642 \u0628\u062D\u062B\u0643" }), _jsx("p", { className: "text-gray-400 mt-2", children: "\u062D\u0627\u0648\u0644 \u062A\u063A\u064A\u064A\u0631 \u062E\u064A\u0627\u0631\u0627\u062A \u0627\u0644\u062A\u0635\u0641\u064A\u0629 \u0623\u0648 \u0627\u0644\u0645\u062F\u064A\u0646\u0629" }), _jsx("button", { onClick: () => setFilters({
                                            priceLevel: null,
                                            amenities: [],
                                            coffeeTypes: [],
                                            openNow: false,
                                            region: null,
                                            city: null,
                                            district: null
                                        }), className: "mt-4 text-coffee-600 font-bold hover:underline", children: "\u0625\u0644\u063A\u0627\u0621 \u062C\u0645\u064A\u0639 \u0627\u0644\u0641\u0644\u0627\u062A\u0631" })] })) }))] }));
        }
    };
    return (_jsxs("div", { className: "min-h-screen flex flex-col bg-coffee-50 relative", children: [_jsx("header", { className: "bg-white shadow-sm sticky top-0 z-30 border-b border-coffee-100", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between items-center h-16", children: [_jsxs("div", { className: "flex items-center gap-2 cursor-pointer", onClick: handleBackToHome, children: [_jsx("div", { className: "bg-coffee-600 p-2 rounded-lg text-white", children: _jsx(Coffee, { size: 24 }) }), _jsx("h1", { className: "text-2xl font-black text-coffee-900 tracking-tight hidden sm:block", children: "\u0648\u0627\u062C\u0647\u0629 \u0627\u0644\u0642\u0647\u0648\u0629" })] }), _jsxs("div", { className: "flex items-center gap-3", children: [currentUser.role === 'GUEST' ? (_jsx("button", { onClick: () => setIsLoginModalOpen(true), className: "text-coffee-700 font-bold text-sm hover:bg-coffee-50 px-3 py-2 rounded-lg", children: "\u062F\u062E\u0648\u0644 \u0627\u0644\u0645\u0644\u0627\u0643" })) : (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-xs bg-coffee-100 text-coffee-800 px-2 py-1 rounded-md font-bold", children: currentUser.role === 'ADMIN' ? 'مدير النظام' : 'مدير مقهى' }), _jsx("button", { onClick: handleLogout, className: "text-gray-500 text-xs hover:text-red-500", children: "\u062E\u0631\u0648\u062C" })] })), currentUser.role !== 'GUEST' && (_jsxs("button", { onClick: handleOpenAddModal, className: "hidden sm:flex items-center gap-2 bg-coffee-100 text-coffee-800 px-4 py-2 rounded-full text-sm font-bold hover:bg-coffee-200 transition-colors", children: [_jsx(Plus, { size: 18 }), _jsx("span", { children: "\u0623\u0636\u0641 \u0645\u0642\u0647\u0649" })] }))] })] }) }) }), viewState === ViewState.LIST && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "bg-coffee-900 text-white py-8 px-4 sm:px-6 relative overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" }), _jsxs("div", { className: "max-w-3xl mx-auto relative z-10 text-center", children: [_jsxs("div", { className: "relative max-w-xl mx-auto mb-4", children: [_jsx("input", { type: "text", value: city, onChange: (e) => setCity(e.target.value), onKeyDown: (e) => e.key === 'Enter' && handleSearch(city), placeholder: "\u0627\u0628\u062D\u062B \u0628\u0627\u0633\u0645 \u0627\u0644\u0645\u062F\u064A\u0646\u0629 (\u0645\u062B\u0627\u0644: \u0627\u0644\u0631\u064A\u0627\u0636)...", className: "w-full py-3 pr-12 pl-4 rounded-2xl text-gray-900 shadow-xl focus:ring-4 focus:ring-coffee-500/50 focus:outline-none" }), _jsx("button", { onClick: () => handleSearch(city), className: "absolute left-2 top-1.5 bottom-1.5 bg-coffee-600 text-white px-4 rounded-xl hover:bg-coffee-700 transition-colors font-bold flex items-center", children: loading ? _jsx(Loader2, { className: "animate-spin", size: 18 }) : 'بحث' }), _jsx(Search, { className: "absolute right-4 top-1/2 -translate-y-1/2 text-gray-400", size: 20 })] }), _jsx("div", { className: "flex flex-wrap justify-center gap-2", children: POPULAR_CITIES.map((c) => (_jsx("button", { onClick: () => handleSearch(c), className: "px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs border border-white/20 transition-colors backdrop-blur-sm", children: c }, c))) })] })] }), _jsx(FilterBar, { filters: filters, onFilterChange: setFilters })] })), renderView(), viewState === ViewState.LIST && currentUser.role !== 'GUEST' && (_jsx("button", { onClick: handleOpenAddModal, className: "fixed bottom-6 left-6 md:hidden bg-coffee-600 text-white p-4 rounded-full shadow-lg shadow-coffee-600/30 hover:scale-105 transition-transform z-20", children: _jsx(Plus, { size: 24 }) })), isAddModalOpen && (_jsx(AddCafeModal, { onClose: () => {
                    setIsAddModalOpen(false);
                    setEditingCafe(null);
                }, onSave: handleSaveCafe, initialData: editingCafe })), isLoginModalOpen && (_jsx(LoginModal, { onClose: () => setIsLoginModalOpen(false), onLogin: handleLoginSuccess })), viewState === ViewState.LIST && (_jsx("footer", { className: "bg-white border-t border-coffee-100 py-8 text-center text-coffee-800/60 text-sm", children: _jsxs("p", { children: ["\u00A9 ", new Date().getFullYear(), " \u0648\u0627\u062C\u0647\u0629 \u0627\u0644\u0642\u0647\u0648\u0629. \u062C\u0645\u064A\u0639 \u0627\u0644\u062D\u0642\u0648\u0642 \u0645\u062D\u0641\u0648\u0638\u0629."] }) }))] }));
}
