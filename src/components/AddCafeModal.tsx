import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Loader2, Upload, Trash2, Image as ImageIcon, MapPin } from 'lucide-react';
import { generateCafeDescription } from '../services/geminiService';
import { Cafe, MenuItem } from '../types';
import { SAUDI_LOCATIONS, Region, City } from '../data/saudiLocations';

interface AddCafeModalProps {
  onClose: () => void;
  onSave: (cafe: Cafe) => void;
  initialData?: Cafe | null;
}

export const AddCafeModal: React.FC<AddCafeModalProps> = ({ onClose, onSave, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  
  // Location States
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  
  const [description, setDescription] = useState(initialData?.description || '');
  const [mainImage, setMainImage] = useState(initialData?.imageUrl || '');
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialData?.menu || [
    { name: 'اسبريسو', price: '12 ر.س', category: 'مشروبات ساخنة', description: 'مزيج فاخر من حبوب الأرابيكا.', imageUrl: 'https://picsum.photos/seed/espresso/200/200' },
    { name: 'لاتيه', price: '18 ر.س', category: 'مشروبات ساخنة', description: 'اسبريسو غني مع حليب طازج.', imageUrl: 'https://picsum.photos/seed/latte/200/200' },
    { name: 'كولد برو', price: '22 ر.س', category: 'مشروبات باردة', description: 'قهوة منقعة بالماء البارد.', imageUrl: 'https://picsum.photos/seed/coldbrew/200/200' },
    { name: 'تشيز كيك', price: '25 ر.س', category: 'حلى', description: 'كيكة الجبن الكلاسيكية.', imageUrl: 'https://picsum.photos/seed/cheesecake/200/200' }
  ]);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const isEditing = !!initialData;

  // Attempt to parse existing location if editing
  useEffect(() => {
    if (initialData?.location) {
        // Heuristic: Try to split by " - " or ","
        const parts = initialData.location.split(/ - |، |, /);
        // We won't perfectly map back to dropdowns if the format doesn't match, 
        // but for a prototype this is acceptable. 
        // In a real app, we would store region_id, city_id separately.
        // For now, we just leave dropdowns empty if it's a custom string, 
        // requiring the user to re-select if they want to edit the location.
    }
  }, [initialData]);

  // Derived lists based on selection
  const cities = SAUDI_LOCATIONS.find(r => r.name === selectedRegion)?.cities || [];
  const districts = cities.find(c => c.name === selectedCity)?.districts || [];

  // File Input Refs
  const mainImageInputRef = useRef<HTMLInputElement>(null);

  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) setMainImage(ev.target.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleMenuImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          const updatedMenu = [...menuItems];
          updatedMenu[index] = { ...updatedMenu[index], imageUrl: ev.target.result as string };
          setMenuItems(updatedMenu);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleAddMenuItem = () => {
    setMenuItems([...menuItems, { name: '', price: '', category: 'مشروبات ساخنة', description: '' }]);
  };

  const handleRemoveMenuItem = (index: number) => {
    setMenuItems(menuItems.filter((_, i) => i !== index));
  };

  const handleMenuItemChange = (index: number, field: keyof MenuItem, value: string) => {
    const updatedMenu = [...menuItems];
    updatedMenu[index] = { ...updatedMenu[index], [field]: value };
    setMenuItems(updatedMenu);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    let finalLocation = initialData?.location || '';
    
    // If user made selections, overwrite location
    if (selectedRegion && selectedCity && selectedDistrict) {
        finalLocation = `${selectedCity} - ${selectedDistrict} (${selectedRegion})`;
    } else if (!isEditing) {
        // If creating new and didn't select
        alert('الرجاء اختيار المنطقة والمدينة والحي');
        return;
    }

    if (!name || !finalLocation) return;

    let finalDescription = description;
    
    // Only generate if empty and not editing (or explicitly requested)
    if (!finalDescription && !isEditing) {
        setIsGenerating(true);
        finalDescription = await generateCafeDescription(name, finalLocation);
        setIsGenerating(false);
    }

    const cafeData: Cafe = {
      ...(initialData || {}), // Keep existing ID and other fields if editing
      id: initialData?.id || `manual-${Date.now()}`,
      name,
      location: finalLocation,
      description: finalDescription || 'وصف المقهى...',
      rating: initialData?.rating || 5.0,
      reviews: initialData?.reviews || [],
      features: initialData?.features || ['جديد', 'قهوة مختصة'],
      imageUrl: mainImage || `https://picsum.photos/seed/${Date.now()}/800/600`,
      priceLevel: initialData?.priceLevel || 'Medium',
      isOpen: initialData?.isOpen ?? true,
      amenities: initialData?.amenities || ['Wifi'],
      coffeeTypes: initialData?.coffeeTypes || ['Espresso', 'V60'],
      menu: menuItems
    };

    onSave(cafeData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold text-coffee-900 mb-6">
            {isEditing ? 'تعديل المقهى' : 'إضافة مقهى جديد'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Main Cafe Info */}
          <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">اسم المقهى</label>
                        <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-coffee-500 focus:outline-none"
                        placeholder="مثال: محمصة الرياض"
                        />
                    </div>
                    
                    {/* Location Cascading Dropdowns */}
                    <div className="space-y-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                        <label className="flex items-center gap-1 text-sm font-bold text-coffee-800">
                            <MapPin size={14} />
                            بيانات الموقع
                        </label>
                        <div className="grid grid-cols-1 gap-3">
                            {/* Region */}
                            <select
                                value={selectedRegion}
                                onChange={(e) => {
                                    setSelectedRegion(e.target.value);
                                    setSelectedCity('');
                                    setSelectedDistrict('');
                                }}
                                className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-coffee-500 focus:outline-none"
                            >
                                <option value="">اختر المنطقة</option>
                                {SAUDI_LOCATIONS.map(r => (
                                    <option key={r.id} value={r.name}>{r.name}</option>
                                ))}
                            </select>

                            {/* City */}
                            <select
                                value={selectedCity}
                                disabled={!selectedRegion}
                                onChange={(e) => {
                                    setSelectedCity(e.target.value);
                                    setSelectedDistrict('');
                                }}
                                className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-coffee-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
                            >
                                <option value="">اختر المدينة / المحافظة</option>
                                {cities.map(c => (
                                    <option key={c.id} value={c.name}>{c.name}</option>
                                ))}
                            </select>

                            {/* District */}
                            <select
                                value={selectedDistrict}
                                disabled={!selectedCity}
                                onChange={(e) => setSelectedDistrict(e.target.value)}
                                className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-coffee-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
                            >
                                <option value="">اختر الحي</option>
                                {districts.map((d, idx) => (
                                    <option key={idx} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>
                        {isEditing && (
                            <p className="text-xs text-gray-500 mt-1">
                                الموقع الحالي: <span className="font-bold">{initialData?.location}</span> (قم بالاختيار أعلاه للتحديث)
                            </p>
                        )}
                    </div>
                  </div>
                  
                  {/* Cafe Image Upload */}
                  <div className="w-full md:w-32">
                      <label className="block text-sm font-medium text-gray-700 mb-1 text-center">صورة المقهى</label>
                      <div 
                        onClick={() => mainImageInputRef.current?.click()}
                        className="w-full md:w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-coffee-500 hover:bg-coffee-50 overflow-hidden relative"
                      >
                          {mainImage ? (
                              <img src={mainImage} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                              <div className="text-gray-400 flex flex-col items-center">
                                  <ImageIcon size={24} />
                                  <span className="text-xs mt-1">رفع صورة</span>
                              </div>
                          )}
                          <input 
                            type="file" 
                            ref={mainImageInputRef}
                            className="hidden" 
                            accept="image/*"
                            onChange={handleMainImageUpload}
                          />
                      </div>
                  </div>
              </div>

              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-coffee-500 focus:outline-none h-24 text-sm"
                    placeholder={isEditing ? "وصف المقهى..." : "اتركه فارغاً للتوليد التلقائي بالذكاء الاصطناعي"}
                  />
              </div>
          </div>

          <hr className="border-gray-100" />

          {/* Menu Editor Section */}
          <div>
              <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-coffee-800">قائمة الطعام والصور</h3>
                  <button 
                    type="button"
                    onClick={handleAddMenuItem}
                    className="text-coffee-600 text-sm font-bold flex items-center gap-1 hover:bg-coffee-50 px-2 py-1 rounded-lg"
                  >
                      <Plus size={16} />
                      إضافة صنف
                  </button>
              </div>
              
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2 scrollbar-thin">
                  {menuItems.map((item, index) => (
                      <div key={index} className="flex gap-3 items-start bg-gray-50 p-3 rounded-xl border border-gray-200">
                          {/* Item Image */}
                          <div className="relative w-16 h-16 flex-shrink-0">
                                <input 
                                    type="file" 
                                    id={`menu-img-${index}`}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => handleMenuImageUpload(index, e)}
                                />
                                <label 
                                    htmlFor={`menu-img-${index}`}
                                    className="w-full h-full block rounded-lg overflow-hidden border border-gray-300 cursor-pointer hover:opacity-80 relative bg-white"
                                >
                                    {item.imageUrl ? (
                                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <Upload size={16} />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                                        <Upload size={16} className="text-white" />
                                    </div>
                                </label>
                          </div>

                          {/* Item Details */}
                          <div className="flex-1 grid grid-cols-2 gap-2">
                              <input 
                                type="text" 
                                placeholder="اسم الصنف"
                                value={item.name}
                                onChange={(e) => handleMenuItemChange(index, 'name', e.target.value)}
                                className="p-2 rounded-lg border border-gray-300 text-sm"
                              />
                              <input 
                                type="text" 
                                placeholder="السعر (مثال 15 ر.س)"
                                value={item.price}
                                onChange={(e) => handleMenuItemChange(index, 'price', e.target.value)}
                                className="p-2 rounded-lg border border-gray-300 text-sm"
                              />
                              <input 
                                type="text" 
                                placeholder="التصنيف (ساخن/بارد/حلى)"
                                value={item.category}
                                onChange={(e) => handleMenuItemChange(index, 'category', e.target.value)}
                                className="p-2 rounded-lg border border-gray-300 text-sm col-span-2"
                              />
                          </div>

                          <button 
                            type="button"
                            onClick={() => handleRemoveMenuItem(index)}
                            className="text-red-400 hover:text-red-600 p-1"
                          >
                              <Trash2 size={18} />
                          </button>
                      </div>
                  ))}
              </div>
          </div>

          <div className="pt-2 border-t border-gray-100 mt-4">
            <button 
              type="submit" 
              disabled={isGenerating}
              className="w-full bg-coffee-600 text-white py-3 rounded-xl font-bold hover:bg-coffee-700 transition-colors flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>جاري المعالجة...</span>
                </>
              ) : (
                <>
                  {isEditing ? <Upload size={20} /> : <Plus size={20} />}
                  <span>{isEditing ? 'حفظ التعديلات' : 'إضافة المقهى'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};