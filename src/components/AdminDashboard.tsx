
import React, { useState } from 'react';
import { Cafe } from '../types';
import { Plus, Trash2, Copy, Search, LogOut, Coffee, MapPin, Check } from 'lucide-react';

interface AdminDashboardProps {
  cafes: Cafe[];
  onAddCafe: () => void;
  onDeleteCafe: (id: string) => void;
  onBack: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ cafes, onAddCafe, onDeleteCafe, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredCafes = cafes.filter(c => c.name.includes(searchTerm) || c.location.includes(searchTerm));

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-coffee-900 text-white py-4 px-6 shadow-md">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold">لوحة تحكم الإدارة</h1>
                    <span className="bg-coffee-800 px-2 py-1 rounded text-xs text-coffee-100">Admin</span>
                </div>
                <button onClick={onBack} className="text-sm bg-coffee-800 hover:bg-coffee-700 px-3 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <LogOut size={16} />
                    خروج
                </button>
            </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto w-full p-6">
            
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div className="relative w-full md:w-96">
                    <input 
                        type="text" 
                        placeholder="بحث عن مقهى..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 pr-10 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-coffee-500"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
                
                <button 
                    onClick={onAddCafe}
                    className="bg-coffee-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-coffee-700 transition-colors flex items-center gap-2 shadow-sm w-full md:w-auto justify-center"
                >
                    <Plus size={20} />
                    إضافة مقهى جديد
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50 text-gray-600 text-sm font-bold">
                            <tr>
                                <th className="p-4">المقهى</th>
                                <th className="p-4">الموقع</th>
                                <th className="p-4">كود الوصول (المدير)</th>
                                <th className="p-4 text-center">الحالة</th>
                                <th className="p-4 text-center">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredCafes.map((cafe) => (
                                <tr key={cafe.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden">
                                                <img src={cafe.imageUrl} alt={cafe.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">{cafe.name}</div>
                                                <div className="text-xs text-gray-400">{cafe.menu.length} أصناف</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <MapPin size={14} className="text-gray-400" />
                                            {cafe.location}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 bg-gray-100 w-fit px-2 py-1 rounded border border-gray-200">
                                            <code className="text-xs font-mono text-gray-600 dir-ltr">{cafe.id}</code>
                                            <button 
                                                onClick={() => copyToClipboard(cafe.id)}
                                                className="text-gray-400 hover:text-coffee-600"
                                                title="نسخ الكود"
                                            >
                                                {copiedId === cafe.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${cafe.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {cafe.isOpen ? 'مفتوح' : 'مغلق'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button 
                                            onClick={() => {
                                                if(window.confirm('هل أنت متأكد من حذف هذا المقهى؟')) {
                                                    onDeleteCafe(cafe.id);
                                                }
                                            }}
                                            className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                            title="حذف"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredCafes.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-400">
                                        لا توجد مقاهي مطابقة للبحث
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>
  );
};
