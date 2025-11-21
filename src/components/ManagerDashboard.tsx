
import React from 'react';
import { Cafe } from '../types';
import { LogOut, Edit, Eye, TrendingUp, Star, Users, UtensilsCrossed } from 'lucide-react';

interface ManagerDashboardProps {
  cafe: Cafe;
  onEdit: () => void;
  onPreview: () => void;
  onBack: () => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ cafe, onEdit, onPreview, onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 shadow-sm">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold text-coffee-900">لوحة تحكم المقهى</h1>
                    <span className="bg-coffee-100 px-2 py-1 rounded text-xs font-bold text-coffee-700">{cafe.name}</span>
                </div>
                <button onClick={onBack} className="text-sm text-gray-500 hover:text-red-600 flex items-center gap-2 transition-colors">
                    <LogOut size={16} />
                    تسجيل خروج
                </button>
            </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto w-full p-6">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm mb-1">إجمالي المشاهدات</p>
                        <h3 className="text-3xl font-bold text-coffee-900">1,254</h3>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                        <TrendingUp size={24} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm mb-1">متوسط التقييم</p>
                        <h3 className="text-3xl font-bold text-coffee-900">{cafe.rating.toFixed(1)}</h3>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-xl text-yellow-500">
                        <Star size={24} fill="currentColor" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm mb-1">عدد التعليقات</p>
                        <h3 className="text-3xl font-bold text-coffee-900">{cafe.reviews.length}</h3>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-xl text-purple-600">
                        <Users size={24} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-coffee-900 mb-4">إدارة المحتوى</h3>
                    <div className="space-y-3">
                        <button 
                            onClick={onEdit}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-white p-2 rounded-lg shadow-sm text-coffee-600">
                                    <Edit size={20} />
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-gray-900">تعديل بيانات المقهى</div>
                                    <div className="text-xs text-gray-500">الصور، الوصف، الموقع، الخدمات</div>
                                </div>
                            </div>
                            <div className="text-coffee-600 opacity-0 group-hover:opacity-100 transition-opacity font-bold text-sm">تعديل</div>
                        </button>

                        <button 
                            onClick={onEdit} // Re-use edit modal which has menu tab
                            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-white p-2 rounded-lg shadow-sm text-coffee-600">
                                    <UtensilsCrossed size={20} />
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-gray-900">تحديث قائمة الطعام</div>
                                    <div className="text-xs text-gray-500">الأسعار، الأصناف، صور المنتجات</div>
                                </div>
                            </div>
                            <div className="text-coffee-600 opacity-0 group-hover:opacity-100 transition-opacity font-bold text-sm">إدارة</div>
                        </button>

                        <button 
                            onClick={onPreview}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-white p-2 rounded-lg shadow-sm text-coffee-600">
                                    <Eye size={20} />
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-gray-900">معاينة الواجهة</div>
                                    <div className="text-xs text-gray-500">مشاهدة صفحة المقهى كما يراها العميل</div>
                                </div>
                            </div>
                            <div className="text-coffee-600 opacity-0 group-hover:opacity-100 transition-opacity font-bold text-sm">عرض</div>
                        </button>
                    </div>
                </div>

                {/* Recent Activity / Preview */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-coffee-900 mb-4">نظرة عامة</h3>
                    <div className="rounded-xl overflow-hidden border border-gray-100 relative group">
                        <img src={cafe.imageUrl} alt={cafe.name} className="w-full h-48 object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                            <h4 className="font-bold text-lg">{cafe.name}</h4>
                            <p className="text-sm opacity-80 line-clamp-1">{cafe.description}</p>
                        </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                        <p>آخر تحديث للبيانات: <span className="font-bold text-gray-700">اليوم</span></p>
                        <p>حالة المقهى: <span className={`font-bold ${cafe.isOpen ? 'text-green-600' : 'text-red-600'}`}>{cafe.isOpen ? 'مفتوح للزوار' : 'مغلق حالياً'}</span></p>
                    </div>
                </div>
            </div>
        </main>
    </div>
  );
};
