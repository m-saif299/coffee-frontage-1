import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { X, Image as ImageIcon, MapPin } from 'lucide-react';
import { SAUDI_LOCATIONS } from '../data/saudiLocations';
// 🔥 أهم إصلاح: استيراد supabase
import { supabase } from "../services/supabaseClient";
export const AddCafeModal = ({ onClose, onSave, initialData }) => {
    const [name, setName] = useState(initialData?.name || '');
    // Location
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [description, setDescription] = useState(initialData?.description || '');
    const [mainImage, setMainImage] = useState(initialData?.imageUrl || '');
    const [menuItems, setMenuItems] = useState(initialData?.menu || [
        { name: 'اسبريسو', price: '12 ر.س', category: 'مشروبات ساخنة', description: '', imageUrl: 'https://picsum.photos/seed/espresso/200/200' },
        { name: 'لاتيه', price: '18 ر.س', category: 'مشروبات ساخنة', description: '', imageUrl: 'https://picsum.photos/seed/latte/200/200' },
    ]);
    const isEditing = !!initialData;
    const mainImageInputRef = useRef(null);
    const cities = SAUDI_LOCATIONS.find(r => r.name === selectedRegion)?.cities || [];
    const districts = cities.find(c => c.name === selectedCity)?.districts || [];
    const handleMainImageUpload = (e) => {
        if (!e.target.files?.[0])
            return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            if (ev.target?.result)
                setMainImage(ev.target.result);
        };
        reader.readAsDataURL(e.target.files[0]);
    };
    const handleMenuImageUpload = (index, e) => {
        if (!e.target.files?.[0])
            return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            if (ev.target?.result) {
                const updated = [...menuItems];
                updated[index].imageUrl = ev.target.result;
                setMenuItems(updated);
            }
        };
        reader.readAsDataURL(e.target.files[0]);
    };
    const handleMenuItemChange = (index, field, value) => {
        const updated = [...menuItems];
        updated[index][field] = value;
        setMenuItems(updated);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name) {
            alert("الرجاء إدخال اسم المقهى");
            return;
        }
        let finalLocation = initialData?.location || '';
        if (selectedRegion && selectedCity && selectedDistrict) {
            finalLocation = `${selectedCity} - ${selectedDistrict} (${selectedRegion})`;
        }
        if (!isEditing && !finalLocation) {
            alert("الرجاء اختيار الموقع بالكامل");
            return;
        }
        const cafeData = {
            ...(initialData || {}),
            id: initialData?.id || `manual-${Date.now()}`,
            name,
            location: finalLocation,
            description: description || "مقهى يقدم مجموعة مختارة من القهوة المختصة.",
            rating: 5.0,
            imageUrl: mainImage || `https://picsum.photos/seed/${Date.now()}/800/600`,
            priceLevel: "Medium",
            isOpen: true,
            amenities: ['Wifi'],
            coffeeTypes: ['Espresso', 'V60'],
            features: ['جديد'],
            reviews: [],
            menu: menuItems
        };
        try {
            const { error } = await supabase.from("cafes").insert({
                name: cafeData.name,
                description: cafeData.description,
                location: cafeData.location,
                image_url: cafeData.imageUrl,
                price_level: cafeData.priceLevel,
                is_open: cafeData.isOpen,
                rating: cafeData.rating,
                features: cafeData.features,
                amenities: cafeData.amenities,
                coffee_types: cafeData.coffeeTypes,
                menu: cafeData.menu
            });
            if (error) {
                console.error("Supabase error:", error);
                alert("فشل حفظ البيانات. تحقق من الـ Policies.");
                return;
            }
            alert("تم إضافة المقهى بنجاح 🎉");
            onSave?.(cafeData);
            onClose();
        }
        catch (err) {
            console.error(err);
            alert("تعذر الاتصال بـ Supabase");
        }
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50", children: _jsxs("div", { className: "bg-white rounded-2xl max-w-2xl w-full p-6", children: [_jsx("button", { onClick: onClose, className: "absolute top-4 left-4 text-gray-400 hover:text-gray-600", children: _jsx(X, { size: 24 }) }), _jsx("h2", { className: "text-2xl font-bold text-coffee-900 mb-6", children: isEditing ? 'تعديل المقهى' : 'إضافة مقهى جديد' }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0642\u0647\u0649" }), _jsx("input", { className: "w-full p-3 border rounded-xl", value: name, onChange: (e) => setName(e.target.value), placeholder: "\u0645\u062B\u0627\u0644: \u0645\u062D\u0645\u0635\u0629 \u0627\u0644\u0631\u064A\u0627\u0636" })] }), _jsxs("div", { className: "bg-gray-50 p-3 rounded-xl border space-y-3", children: [_jsxs("label", { className: "flex items-center gap-2 text-sm font-bold", children: [_jsx(MapPin, { size: 16 }), " \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u0648\u0642\u0639"] }), _jsxs("select", { value: selectedRegion, onChange: (e) => {
                                        setSelectedRegion(e.target.value);
                                        setSelectedCity('');
                                        setSelectedDistrict('');
                                    }, className: "p-2 border rounded-lg w-full", children: [_jsx("option", { value: "", children: "\u0627\u062E\u062A\u0631 \u0627\u0644\u0645\u0646\u0637\u0642\u0629" }), SAUDI_LOCATIONS.map(r => (_jsx("option", { value: r.name, children: r.name }, r.id)))] }), _jsxs("select", { disabled: !selectedRegion, value: selectedCity, onChange: (e) => {
                                        setSelectedCity(e.target.value);
                                        setSelectedDistrict('');
                                    }, className: "p-2 border rounded-lg w-full", children: [_jsx("option", { value: "", children: "\u0627\u062E\u062A\u0631 \u0627\u0644\u0645\u062F\u064A\u0646\u0629" }), cities.map(c => (_jsx("option", { value: c.name, children: c.name }, c.id)))] }), _jsxs("select", { disabled: !selectedCity, value: selectedDistrict, onChange: (e) => setSelectedDistrict(e.target.value), className: "p-2 border rounded-lg w-full", children: [_jsx("option", { value: "", children: "\u0627\u062E\u062A\u0631 \u0627\u0644\u062D\u064A" }), districts.map((d, i) => (_jsx("option", { value: d, children: d }, i)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "\u0627\u0644\u0648\u0635\u0641" }), _jsx("textarea", { value: description, onChange: (e) => setDescription(e.target.value), className: "w-full p-3 border rounded-xl h-24" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "\u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0642\u0647\u0649" }), _jsxs("div", { onClick: () => mainImageInputRef.current?.click(), className: "h-32 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer", children: [mainImage ? (_jsx("img", { src: mainImage, className: "h-full w-full object-cover rounded-xl" })) : (_jsxs("div", { className: "text-gray-400 flex flex-col items-center", children: [_jsx(ImageIcon, { size: 24 }), _jsx("span", { className: "text-xs mt-1", children: "\u0631\u0641\u0639 \u0635\u0648\u0631\u0629" })] })), _jsx("input", { type: "file", ref: mainImageInputRef, className: "hidden", onChange: handleMainImageUpload })] })] }), _jsx("button", { type: "submit", className: "w-full bg-coffee-600 text-white py-3 rounded-xl font-bold hover:bg-coffee-700", children: isEditing ? "حفظ التعديلات" : "إضافة المقهى" })] })] }) }));
};
