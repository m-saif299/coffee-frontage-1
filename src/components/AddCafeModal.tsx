import React, { useState, useRef } from 'react';
import { X, Plus, Upload, Trash2, Image as ImageIcon, MapPin } from 'lucide-react';
import { Cafe, MenuItem } from '../types';
import { SAUDI_LOCATIONS } from '../data/saudiLocations';

// ✔ التصحيح هنا
import { supabase } from "../lib/supabase";

interface AddCafeModalProps {
  onClose: () => void;
  onSave?: (cafe: Cafe) => void;
  initialData?: Cafe | null;
}

export const AddCafeModal: React.FC<AddCafeModalProps> = ({ onClose, onSave, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [description, setDescription] = useState(initialData?.description || '');
  const [mainImage, setMainImage] = useState(initialData?.imageUrl || '');
  const mainImageInputRef = useRef<HTMLInputElement>(null);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { name: 'اسبريسو', price: '12 ر.س', category: 'مشروبات ساخنة', description: '', imageUrl: 'https://picsum.photos/seed/espresso/200/200' },
    { name: 'لاتيه', price: '18 ر.س', category: 'مشروبات ساخنة', description: '', imageUrl: 'https://picsum.photos/seed/latte/200/200' }
  ]);

  const cities = SAUDI_LOCATIONS.find(r => r.name === selectedRegion)?.cities || [];
  const districts = cities.find(c => c.name === selectedCity)?.districts || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalLocation = `${selectedCity} - ${selectedDistrict} (${selectedRegion})`;

    const cafeData: Cafe = {
      id: `manual-${Date.now()}`,
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

    const { error } = await supabase.from("cafes").insert({
      name: cafeData.name,
      description: cafeData.description,
      location: cafeData.location,
      image_url: cafeData.imageUrl,
      price_level: cafeData.priceLevel,
      is_open: cafeData.isOpen,
      rating: cafeData.rating,
      amenities: cafeData.amenities,
      coffee_types: cafeData.coffeeTypes,
      features: cafeData.features,
      menu: cafeData.menu
    });

    if (error) {
      alert("فشل حفظ البيانات");
      console.error(error);
      return;
    }

    onSave?.(cafeData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
      {/* UI كما هو */}
      {/* ... */}
    </div>
  );
};
