import React from "react";
import {
  ArrowLeft,
  Coffee,
  DollarSign,
  Edit3,
  Eye,
  MapPin,
  Star,
} from "lucide-react";
import { Cafe } from "../types";

interface ManagerDashboardProps {
  cafe: Cafe;
  onEdit: () => void;
  onPreview: () => void;
  onBack: () => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
  cafe,
  onEdit,
  onPreview,
  onBack,
}) => {
  // نحمي أنفسنا من undefined
  const reviews = cafe.reviews || [];
  const menu = cafe.menu || [];
  const features = cafe.features || [];
  const amenities = cafe.amenities || [];
  const coffeeTypes = cafe.coffeeTypes || [];

  const reviewsCount = reviews.length;

  const priceLabel =
    cafe.priceLevel === "High"
      ? "مرتفع"
      : cafe.priceLevel === "Low"
      ? "منخفض"
      : "متوسط";

  return (
    <div className="flex flex-col min-h-screen bg-coffee-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-coffee-100 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-coffee-700 hover:text-coffee-900"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-bold">رجوع للواجهة</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-coffee-100 text-coffee-800 px-2 py-1 rounded-md font-bold">
              مدير مقهى
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* عنوان المقهى */}
        <section className="bg-white rounded-2xl shadow-sm border border-coffee-100 p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
          <div className="w-full sm:w-48 h-40 sm:h-32 rounded-xl overflow-hidden bg-coffee-100 flex-shrink-0">
            {cafe.imageUrl ? (
              <img
                src={cafe.imageUrl}
                alt={cafe.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-coffee-400">
                <Coffee size={32} />
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black text-coffee-900 mb-1">
                {cafe.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-xs text-coffee-700">
                <MapPin size={14} />
                <span>{cafe.location}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              <span className="inline-flex items-center gap-1 text-xs bg-coffee-100 text-coffee-800 px-2 py-1 rounded-full">
                <Star size={14} className="text-yellow-500" />
                <span>{cafe.rating?.toFixed(1) || "5.0"}</span>
              </span>
              <span className="inline-flex items-center gap-1 text-xs bg-coffee-50 text-coffee-700 px-2 py-1 rounded-full">
                <DollarSign size={14} />
                <span>{priceLabel}</span>
              </span>
              {cafe.isOpen && (
                <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  مفتوح الآن
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 justify-between">
            <button
              onClick={onPreview}
              className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-bold border border-coffee-200 text-coffee-800 hover:bg-coffee-50 transition-colors"
            >
              <Eye size={16} />
              عرض صفحة المقهى
            </button>

            <button
              onClick={onEdit}
              className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-bold bg-coffee-600 text-white hover:bg-coffee-700 transition-colors"
            >
              <Edit3 size={16} />
              تعديل بيانات المقهى
            </button>
          </div>
        </section>

        {/* إحصائيات سريعة */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-coffee-100 p-4 flex flex-col gap-2">
            <p className="text-xs text-coffee-500">متوسط التقييم</p>
            <div className="flex items-center gap-2">
              <h3 className="text-3xl font-bold text-coffee-900">
                {cafe.rating?.toFixed(1) || "5.0"}
              </h3>
              <Star size={18} className="text-yellow-500" />
            </div>
            <p className="text-[11px] text-coffee-500">
              من {reviewsCount} تقييم
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-coffee-100 p-4 flex flex-col gap-2">
            <p className="text-xs text-coffee-500">عدد التقييمات</p>
            <h3 className="text-3xl font-bold text-coffee-900">
              {reviewsCount}
            </h3>
            <p className="text-[11px] text-coffee-500">
              اجمع تقييمات أكثر من عملائك
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-coffee-100 p-4 flex flex-col gap-2">
            <p className="text-xs text-coffee-500">عدد أصناف المنيو</p>
            <h3 className="text-3xl font-bold text-coffee-900">
              {menu.length}
            </h3>
            <p className="text-[11px] text-coffee-500">
              تأكد من تحديث الأسعار والأصناف بشكل مستمر
            </p>
          </div>
        </section>

        {/* التفاصيل / المميزات */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-coffee-100 p-4 space-y-3">
            <h3 className="text-sm font-bold text-coffee-900 mb-1">
              المميزات والخدمات
            </h3>

            {features.length === 0 &&
              amenities.length === 0 &&
              coffeeTypes.length === 0 && (
                <p className="text-xs text-coffee-500">
                  لم يتم تحديد المميزات. يمكنك إضافتها من شاشة تعديل بيانات
                  المقهى.
                </p>
              )}

            <div className="flex flex-wrap gap-2">
              {features.map((f) => (
                <span
                  key={`feature-${f}`}
                  className="text-[11px] px-2 py-1 rounded-full bg-coffee-50 text-coffee-800 border border-coffee-100"
                >
                  {f}
                </span>
              ))}

              {amenities.map((a) => (
                <span
                  key={`amenity-${a}`}
                  className="text-[11px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100"
                >
                  {a}
                </span>
              ))}

              {coffeeTypes.map((t) => (
                <span
                  key={`coffee-${t}`}
                  className="text-[11px] px-2 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-100"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-coffee-100 p-4 space-y-3">
            <h3 className="text-sm font-bold text-coffee-900 mb-1">
              لمحة عن المنيو
            </h3>

            {menu.length === 0 ? (
              <p className="text-xs text-coffee-500">
                لم يتم إضافة أصناف للمنيو بعد.
              </p>
            ) : (
              <ul className="space-y-2 max-h-40 overflow-y-auto">
                {menu.slice(0, 6).map((item) => (
                  <li key={item.name} className="flex justify-between text-xs">
                    <span className="text-coffee-900 font-medium">
                      {item.name}
                    </span>
                    <span className="text-coffee-600">{item.price}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};
