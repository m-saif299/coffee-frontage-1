console.log("SUPABASE URL IS:", import.meta.env.VITE_SUPABASE_URL);
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, MapPin, Coffee, Plus, Loader2 } from 'lucide-react';
import { Cafe, Review, ViewState, FilterState } from './types';
import { CafeCard } from './components/CafeCard';
import { CafeDetail } from './components/CafeDetail';
import { AddCafeModal } from './components/AddCafeModal';
import { LoginModal } from './components/LoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { ManagerDashboard } from './components/ManagerDashboard';
import { FilterBar } from './components/FilterBar';
import { getCafes } from "./services/cafeService";
import { supabase } from "./lib/supabase";


/* -------------------------------------------------
   دالة بحث مؤقتة بدون أي AI — بيانات وهمية
---------------------------------------------------*/

const POPULAR_CITIES = ['الرياض', 'جدة', 'الدمام', 'دبي', 'القاهرة'];

export default function App() {
  const [city, setCity] = useState('');
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewState, setViewState] = useState<ViewState>(ViewState.LIST);
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCafe, setEditingCafe] = useState<Cafe | null>(null);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ role: 'GUEST' | 'ADMIN' | 'MANAGER', cafeId?: string }>({
    role: 'GUEST'
  });

  const [filters, setFilters] = useState<FilterState>({
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

const handleSearch = useCallback(async (searchCity: string) => {
  if (!searchCity.trim()) return;

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

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
}, []);



  const handleCafeClick = (cafe: Cafe) => {
    setSelectedCafe(cafe);
    setViewState(ViewState.DETAIL);
  };

  const handleBackToHome = () => {
    setSelectedCafe(null);
    setViewState(ViewState.LIST);
  };

  const handleAddReview = (cafeId: string, review: Review) => {
    setCafes(prev =>
      prev.map(c => (c.id === cafeId ? { ...c, reviews: [review, ...c.reviews] } : c))
    );

    if (selectedCafe && selectedCafe.id === cafeId) {
      setSelectedCafe(prev =>
        prev ? { ...prev, reviews: [review, ...prev.reviews] } : null
      );
    }
  };

  const handleSaveCafe = async (savedCafe: Cafe) => {
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

  } catch (err) {
    console.error(err);
  }
};


  const handleOpenAddModal = () => {
    setEditingCafe(null);
    setIsAddModalOpen(true);
  };

  const handleLoginSuccess = (role: 'ADMIN' | 'MANAGER', cafeId?: string) => {
    setCurrentUser({ role, cafeId });
    if (role === 'ADMIN') setViewState(ViewState.ADMIN_DASHBOARD);
    if (role === 'MANAGER') setViewState(ViewState.MANAGER_DASHBOARD);
  };

  const handleLogout = () => {
    setCurrentUser({ role: 'GUEST' });
    setViewState(ViewState.LIST);
  };

  const filteredCafes = useMemo(() => {
    return cafes.filter(cafe => {
      if (filters.priceLevel && cafe.priceLevel !== filters.priceLevel) return false;
      if (filters.openNow && !cafe.isOpen) return false;

      if (filters.amenities.length > 0) {
        const hasAll = filters.amenities.every(f => cafe.amenities?.includes(f));
        if (!hasAll) return false;
      }

      if (filters.coffeeTypes.length > 0) {
        const hasAll = filters.coffeeTypes.every(t => cafe.coffeeTypes?.includes(t));
        if (!hasAll) return false;
      }

      if (filters.city && !cafe.location.includes(filters.city)) return false;
      if (filters.district && !cafe.location.includes(filters.district)) return false;

      return true;
    });
  }, [cafes, filters]);

  const renderView = () => {
    switch (viewState) {
      case ViewState.ADMIN_DASHBOARD:
        return (
          <AdminDashboard
            cafes={cafes}
            onAddCafe={handleOpenAddModal}
            onDeleteCafe={(id) => setCafes(prev => prev.filter(c => c.id !== id))}
            onBack={handleBackToHome}
          />
        );

      case ViewState.MANAGER_DASHBOARD:
        const myCafe = cafes.find(c => c.id === currentUser.cafeId);
        if (!myCafe) return <div className="p-10 text-center">لم يتم العثور على المقهى الخاص بك</div>;
        return (
          <ManagerDashboard
            cafe={myCafe}
            onEdit={() => handleEditCafe(myCafe)}
            onPreview={() => handleCafeClick(myCafe)}
            onBack={handleBackToHome}
          />
        );

      case ViewState.DETAIL:
        if (!selectedCafe) return null;
        return (
          <CafeDetail
            cafe={selectedCafe}
            onBack={handleBackToHome}
            onAddReview={handleAddReview}
            onEdit={handleEditCafe}
          />
        );

      default:
        return (
          <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-coffee-900 flex items-center gap-2">
                <MapPin size={20} className="text-coffee-600" />
                نتائج البحث في: <span className="text-coffee-600">{city || '...'}</span>
              </h3>
              <span className="text-sm text-gray-500 font-medium">
                {filteredCafes.length} مقهى
                {cafes.length !== filteredCafes.length && (
                  <span className="text-xs"> (من {cafes.length})</span>
                )}
              </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl h-80 shadow-sm animate-pulse flex flex-col overflow-hidden"
                  >
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-5 space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-10 bg-gray-200 rounded w-full mt-auto"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {filteredCafes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                    {filteredCafes.map(cafe => (
                      <CafeCard key={cafe.id} cafe={cafe} onClick={handleCafeClick} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-coffee-200">
                    <Coffee size={48} className="mx-auto text-coffee-300 mb-4" />
                    <h3 className="text-xl font-bold text-gray-400">لا توجد نتائج تطابق بحثك</h3>
                    <p className="text-gray-400 mt-2">حاول تغيير خيارات التصفية أو المدينة</p>
                    <button
                      onClick={() =>
                        setFilters({
                          priceLevel: null,
                          amenities: [],
                          coffeeTypes: [],
                          openNow: false,
                          region: null,
                          city: null,
                          district: null
                        })
                      }
                      className="mt-4 text-coffee-600 font-bold hover:underline"
                    >
                      إلغاء جميع الفلاتر
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-coffee-50 relative">
      <header className="bg-white shadow-sm sticky top-0 z-30 border-b border-coffee-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={handleBackToHome}>
              <div className="bg-coffee-600 p-2 rounded-lg text-white">
                <Coffee size={24} />
              </div>
              <h1 className="text-2xl font-black text-coffee-900 tracking-tight hidden sm:block">واجهة القهوة</h1>
            </div>

            <div className="flex items-center gap-3">
              {currentUser.role === 'GUEST' ? (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="text-coffee-700 font-bold text-sm hover:bg-coffee-50 px-3 py-2 rounded-lg"
                >
                  دخول الملاك
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-coffee-100 text-coffee-800 px-2 py-1 rounded-md font-bold">
                    {currentUser.role === 'ADMIN' ? 'مدير النظام' : 'مدير مقهى'}
                  </span>
                  <button onClick={handleLogout} className="text-gray-500 text-xs hover:text-red-500">
                    خروج
                  </button>
                </div>
              )}

              {currentUser.role !== 'GUEST' && (
                <button
                  onClick={handleOpenAddModal}
                  className="hidden sm:flex items-center gap-2 bg-coffee-100 text-coffee-800 px-4 py-2 rounded-full text-sm font-bold hover:bg-coffee-200 transition-colors"
                >
                  <Plus size={18} />
                  <span>أضف مقهى</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {viewState === ViewState.LIST && (
        <>
          <div className="bg-coffee-900 text-white py-8 px-4 sm:px-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="max-w-3xl mx-auto relative z-10 text-center">
              <div className="relative max-w-xl mx-auto mb-4">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(city)}
                  placeholder="ابحث باسم المدينة (مثال: الرياض)..."
                  className="w-full py-3 pr-12 pl-4 rounded-2xl text-gray-900 shadow-xl focus:ring-4 focus:ring-coffee-500/50 focus:outline-none"
                />
                <button
                  onClick={() => handleSearch(city)}
                  className="absolute left-2 top-1.5 bottom-1.5 bg-coffee-600 text-white px-4 rounded-xl hover:bg-coffee-700 transition-colors font-bold flex items-center"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : 'بحث'}
                </button>
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {POPULAR_CITIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => handleSearch(c)}
                    className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs border border-white/20 transition-colors backdrop-blur-sm"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <FilterBar filters={filters} onFilterChange={setFilters} />
        </>
      )}

      {renderView()}

      {viewState === ViewState.LIST && currentUser.role !== 'GUEST' && (
        <button
          onClick={handleOpenAddModal}
          className="fixed bottom-6 left-6 md:hidden bg-coffee-600 text-white p-4 rounded-full shadow-lg shadow-coffee-600/30 hover:scale-105 transition-transform z-20"
        >
          <Plus size={24} />
        </button>
      )}

      {isAddModalOpen && (
        <AddCafeModal
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingCafe(null);
          }}
          onSave={handleSaveCafe}
          initialData={editingCafe}
        />
      )}

      {isLoginModalOpen && (
        <LoginModal
          onClose={() => setIsLoginModalOpen(false)}
          onLogin={handleLoginSuccess}
        />
      )}

      {viewState === ViewState.LIST && (
        <footer className="bg-white border-t border-coffee-100 py-8 text-center text-coffee-800/60 text-sm">
          <p>© {new Date().getFullYear()} واجهة القهوة. جميع الحقوق محفوظة.</p>
        </footer>
      )}
    </div>
  );
}
