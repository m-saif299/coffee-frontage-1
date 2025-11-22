import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { X, Plus, Loader2, Upload, Trash2, Image as ImageIcon, MapPin } from 'lucide-react';
import { SAUDI_LOCATIONS } from '../data/saudiLocations';
export const AddCafeModal = ({ onClose, onSave, initialData }) => {
    const [name, setName] = useState(initialData?.name || '');
    // Location States
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [description, setDescription] = useState(initialData?.description || '');
    const [mainImage, setMainImage] = useState(initialData?.imageUrl || '');
    const [menuItems, setMenuItems] = useState(initialData?.menu || [
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
    const mainImageInputRef = useRef(null);
    const handleMainImageUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result)
                    setMainImage(ev.target.result);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    const handleMenuImageUpload = (index, e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) {
                    const updatedMenu = [...menuItems];
                    updatedMenu[index] = { ...updatedMenu[index], imageUrl: ev.target.result };
                    setMenuItems(updatedMenu);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    const handleAddMenuItem = () => {
        setMenuItems([...menuItems, { name: '', price: '', category: 'مشروبات ساخنة', description: '' }]);
    };
    const handleRemoveMenuItem = (index) => {
        setMenuItems(menuItems.filter((_, i) => i !== index));
    };
    const handleMenuItemChange = (index, field, value) => {
        const updatedMenu = [...menuItems];
        updatedMenu[index] = { ...updatedMenu[index], [field]: value };
        setMenuItems(updatedMenu);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validation
        let finalLocation = initialData?.location || '';
        // If user made selections, overwrite location
        if (selectedRegion && selectedCity && selectedDistrict) {
            finalLocation = `${selectedCity} - ${selectedDistrict} (${selectedRegion})`;
        }
        else if (!isEditing) {
            // If creating new and didn't select
            alert('الرجاء اختيار المنطقة والمدينة والحي');
            return;
        }
        if (!name || !finalLocation)
            return;
        let finalDescription = description;
        // Only generate if empty and not editing (or explicitly requested)
        if (!finalDescription && !isEditing) {
            setIsGenerating(true);
            setIsGenerating(false);
        }
        const cafeData = {
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
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm", children: _jsxs("div", { className: "bg-white rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto", children: [_jsx("button", { onClick: onClose, className: "absolute top-4 left-4 text-gray-400 hover:text-gray-600", children: _jsx(X, { size: 24 }) }), _jsx("h2", { className: "text-2xl font-bold text-coffee-900 mb-6", children: isEditing ? 'تعديل المقهى' : 'إضافة مقهى جديد' }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex flex-col md:flex-row gap-4", children: [_jsxs("div", { className: "flex-1 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0642\u0647\u0649" }), _jsx("input", { type: "text", required: true, value: name, onChange: (e) => setName(e.target.value), className: "w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-coffee-500 focus:outline-none", placeholder: "\u0645\u062B\u0627\u0644: \u0645\u062D\u0645\u0635\u0629 \u0627\u0644\u0631\u064A\u0627\u0636" })] }), _jsxs("div", { className: "space-y-3 bg-gray-50 p-3 rounded-xl border border-gray-200", children: [_jsxs("label", { className: "flex items-center gap-1 text-sm font-bold text-coffee-800", children: [_jsx(MapPin, { size: 14 }), "\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u0648\u0642\u0639"] }), _jsxs("div", { className: "grid grid-cols-1 gap-3", children: [_jsxs("select", { value: selectedRegion, onChange: (e) => {
                                                                        setSelectedRegion(e.target.value);
                                                                        setSelectedCity('');
                                                                        setSelectedDistrict('');
                                                                    }, className: "w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-coffee-500 focus:outline-none", children: [_jsx("option", { value: "", children: "\u0627\u062E\u062A\u0631 \u0627\u0644\u0645\u0646\u0637\u0642\u0629" }), SAUDI_LOCATIONS.map(r => (_jsx("option", { value: r.name, children: r.name }, r.id)))] }), _jsxs("select", { value: selectedCity, disabled: !selectedRegion, onChange: (e) => {
                                                                        setSelectedCity(e.target.value);
                                                                        setSelectedDistrict('');
                                                                    }, className: "w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-coffee-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400", children: [_jsx("option", { value: "", children: "\u0627\u062E\u062A\u0631 \u0627\u0644\u0645\u062F\u064A\u0646\u0629 / \u0627\u0644\u0645\u062D\u0627\u0641\u0638\u0629" }), cities.map(c => (_jsx("option", { value: c.name, children: c.name }, c.id)))] }), _jsxs("select", { value: selectedDistrict, disabled: !selectedCity, onChange: (e) => setSelectedDistrict(e.target.value), className: "w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-coffee-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400", children: [_jsx("option", { value: "", children: "\u0627\u062E\u062A\u0631 \u0627\u0644\u062D\u064A" }), districts.map((d, idx) => (_jsx("option", { value: d, children: d }, idx)))] })] }), isEditing && (_jsxs("p", { className: "text-xs text-gray-500 mt-1", children: ["\u0627\u0644\u0645\u0648\u0642\u0639 \u0627\u0644\u062D\u0627\u0644\u064A: ", _jsx("span", { className: "font-bold", children: initialData?.location }), " (\u0642\u0645 \u0628\u0627\u0644\u0627\u062E\u062A\u064A\u0627\u0631 \u0623\u0639\u0644\u0627\u0647 \u0644\u0644\u062A\u062D\u062F\u064A\u062B)"] }))] })] }), _jsxs("div", { className: "w-full md:w-32", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1 text-center", children: "\u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0642\u0647\u0649" }), _jsxs("div", { onClick: () => mainImageInputRef.current?.click(), className: "w-full md:w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-coffee-500 hover:bg-coffee-50 overflow-hidden relative", children: [mainImage ? (_jsx("img", { src: mainImage, alt: "Preview", className: "w-full h-full object-cover" })) : (_jsxs("div", { className: "text-gray-400 flex flex-col items-center", children: [_jsx(ImageIcon, { size: 24 }), _jsx("span", { className: "text-xs mt-1", children: "\u0631\u0641\u0639 \u0635\u0648\u0631\u0629" })] })), _jsx("input", { type: "file", ref: mainImageInputRef, className: "hidden", accept: "image/*", onChange: handleMainImageUpload })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "\u0627\u0644\u0648\u0635\u0641" }), _jsx("textarea", { value: description, onChange: (e) => setDescription(e.target.value), className: "w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-coffee-500 focus:outline-none h-24 text-sm", placeholder: isEditing ? "وصف المقهى..." : "اتركه فارغاً للتوليد التلقائي بالذكاء الاصطناعي" })] })] }), _jsx("hr", { className: "border-gray-100" }), _jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h3", { className: "font-bold text-coffee-800", children: "\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0637\u0639\u0627\u0645 \u0648\u0627\u0644\u0635\u0648\u0631" }), _jsxs("button", { type: "button", onClick: handleAddMenuItem, className: "text-coffee-600 text-sm font-bold flex items-center gap-1 hover:bg-coffee-50 px-2 py-1 rounded-lg", children: [_jsx(Plus, { size: 16 }), "\u0625\u0636\u0627\u0641\u0629 \u0635\u0646\u0641"] })] }), _jsx("div", { className: "space-y-3 max-h-64 overflow-y-auto pr-2 scrollbar-thin", children: menuItems.map((item, index) => (_jsxs("div", { className: "flex gap-3 items-start bg-gray-50 p-3 rounded-xl border border-gray-200", children: [_jsxs("div", { className: "relative w-16 h-16 flex-shrink-0", children: [_jsx("input", { type: "file", id: `menu-img-${index}`, className: "hidden", accept: "image/*", onChange: (e) => handleMenuImageUpload(index, e) }), _jsxs("label", { htmlFor: `menu-img-${index}`, className: "w-full h-full block rounded-lg overflow-hidden border border-gray-300 cursor-pointer hover:opacity-80 relative bg-white", children: [item.imageUrl ? (_jsx("img", { src: item.imageUrl, alt: item.name, className: "w-full h-full object-cover" })) : (_jsx("div", { className: "w-full h-full flex items-center justify-center text-gray-400", children: _jsx(Upload, { size: 16 }) })), _jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity", children: _jsx(Upload, { size: 16, className: "text-white" }) })] })] }), _jsxs("div", { className: "flex-1 grid grid-cols-2 gap-2", children: [_jsx("input", { type: "text", placeholder: "\u0627\u0633\u0645 \u0627\u0644\u0635\u0646\u0641", value: item.name, onChange: (e) => handleMenuItemChange(index, 'name', e.target.value), className: "p-2 rounded-lg border border-gray-300 text-sm" }), _jsx("input", { type: "text", placeholder: "\u0627\u0644\u0633\u0639\u0631 (\u0645\u062B\u0627\u0644 15 \u0631.\u0633)", value: item.price, onChange: (e) => handleMenuItemChange(index, 'price', e.target.value), className: "p-2 rounded-lg border border-gray-300 text-sm" }), _jsx("input", { type: "text", placeholder: "\u0627\u0644\u062A\u0635\u0646\u064A\u0641 (\u0633\u0627\u062E\u0646/\u0628\u0627\u0631\u062F/\u062D\u0644\u0649)", value: item.category, onChange: (e) => handleMenuItemChange(index, 'category', e.target.value), className: "p-2 rounded-lg border border-gray-300 text-sm col-span-2" })] }), _jsx("button", { type: "button", onClick: () => handleRemoveMenuItem(index), className: "text-red-400 hover:text-red-600 p-1", children: _jsx(Trash2, { size: 18 }) })] }, index))) })] }), _jsx("div", { className: "pt-2 border-t border-gray-100 mt-4", children: _jsx("button", { type: "submit", disabled: isGenerating, className: "w-full bg-coffee-600 text-white py-3 rounded-xl font-bold hover:bg-coffee-700 transition-colors flex items-center justify-center gap-2", children: isGenerating ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { size: 20, className: "animate-spin" }), _jsx("span", { children: "\u062C\u0627\u0631\u064A \u0627\u0644\u0645\u0639\u0627\u0644\u062C\u0629..." })] })) : (_jsxs(_Fragment, { children: [isEditing ? _jsx(Upload, { size: 20 }) : _jsx(Plus, { size: 20 }), _jsx("span", { children: isEditing ? 'حفظ التعديلات' : 'إضافة المقهى' })] })) }) })] })] }) }));
};
