"use client";
import { useState, useRef } from "react";
import {
  GraduationCap,
  Heart,
  Car,
  Briefcase,
  Plane,
  Sparkles,
  Home,
  Megaphone,
  Search,
  Wrench,
  User,
  PawPrint,
  Smartphone,
  Tv,
  Sofa,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function PostAdForm() {
  const scrollRef = useRef(null);

  const inputStyle =
    "w-full border border-gray-200 bg-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#157A4F] focus:border-[#157A4F] transition shadow-sm";

  const categories = [
    { name: "Education", icon: GraduationCap },
    { name: "Matrimonial", icon: Heart },
    { name: "Vehicle", icon: Car, sub: ["Rent", "Sell"] },
    { name: "Business", icon: Briefcase, sub: ["Promotion"] },
    { name: "Travel", icon: Plane },
    { name: "Astrology", icon: Sparkles },
    { name: "Property", icon: Home, sub: ["Rent", "Sell"] },
    { name: "Public Notice", icon: Megaphone },
    { name: "Lost & Found", icon: Search },
    { name: "Service", icon: Wrench },
    { name: "Personal", icon: User },
    { name: "Employment", icon: Briefcase },
    { name: "Pets", icon: PawPrint },
    { name: "Mobiles", icon: Smartphone },
    { name: "Electronics", icon: Tv },
    { name: "Furniture", icon: Sofa },
    { name: "Other", icon: Package },
  ];

  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedSub, setSelectedSub] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [uploadedImages, setUploadedImages] = useState([]);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -260 : 260,
      behavior: "smooth",
    });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const images = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setUploadedImages((prev) => [...prev, ...images]);
  };

  const removeImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const formatDate = (date) =>
    new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  return (
    <div className="space-y-12 bg-[#F8F6F2] p-6 rounded-3xl">

      {/* SECTION WRAPPER STYLE */}
      {/* Reusable Card Style */}
      {/** --------------------------------------- */}

      {/* Choose Category */}
<div className="bg-white p-10 rounded-3xl shadow-md border border-gray-100 relative min-h-[320px]">

  <h3 className="font-semibold text-2xl mb-8 text-gray-800 text-center">
    Choose Category
  </h3>

  {/* Left Scroll Button */}
  <button
    onClick={() => scroll("left")}
    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white border border-gray-200 shadow-md rounded-full p-2 hover:bg-[#FFF3D6] transition z-10"
  >
    <ChevronLeft size={18} />
  </button>

  {/* Right Scroll Button */}
  <button
    onClick={() => scroll("right")}
    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white border border-gray-200 shadow-md rounded-full p-2 hover:bg-[#FFF3D6] transition z-10"
  >
    <ChevronRight size={18} />
  </button>

  {/* Categories Scroll Row */}
  <div
    ref={scrollRef}
    className="flex items-center gap-8 overflow-x-auto scroll-smooth px-14 snap-x snap-mandatory py-6"
  >
    {categories.map((cat, index) => {
      const Icon = cat.icon;
      const isActive = selectedCategory.name === cat.name;

      return (
        <div
          key={index}
          onClick={() => {
            setSelectedCategory(cat);
            setSelectedSub(null);
          }}
          className={`snap-start flex-shrink-0 w-[130px] h-[160px] flex flex-col items-center justify-center rounded-2xl cursor-pointer transition-all duration-300 border
          ${
            isActive
              ? "bg-[#157A4F] text-white border-[#157A4F] shadow-xl scale-105"
              : "bg-white text-gray-700 border-gray-200 hover:border-[#157A4F] hover:-translate-y-2 hover:shadow-lg"
          }`}
        >
          <Icon size={34} className="mb-3" />
          <span className="text-sm font-medium text-center px-2">
            {cat.name}
          </span>
        </div>
      );
    })}
  </div>

  {/* Subcategories */}
  {selectedCategory?.sub && (
    <div className="flex gap-4 mt-10 justify-center flex-wrap">
      {selectedCategory.sub.map((option, i) => (
        <button
          key={i}
          onClick={() => setSelectedSub(option)}
          className={`px-6 py-2 rounded-full text-sm font-medium transition
          ${
            selectedSub === option
              ? "bg-[#157A4F] text-white shadow-md"
              : "bg-[#FFF3D6] text-gray-700 hover:bg-[#F5B849] hover:text-white"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  )}

</div>

      {/* Basic Info */}
      <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-100 space-y-6">
        <h3 className="font-semibold text-2xl text-gray-800">
          Basic Information
        </h3>
        <input placeholder="Ad Title" className={inputStyle} />
        <textarea
          placeholder="Description"
          rows={4}
          className={inputStyle}
        />
        <input placeholder="Price (₹)" className={`${inputStyle} w-1/2`} />
      </div>

      {/* Dynamic Details */}
      <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-100 space-y-6">
        <h3 className="font-semibold text-2xl text-gray-800">
          {selectedCategory.name} Details
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <input placeholder="Field 1" className={inputStyle} />
          <input placeholder="Field 2" className={inputStyle} />
          <input placeholder="Field 3" className={inputStyle} />
          <input placeholder="Field 4" className={inputStyle} />
        </div>
      </div>

     {/* Scheduling */}
<div className="bg-white p-8 rounded-3xl shadow-md border border-gray-100">

  <h3 className="font-semibold text-2xl text-gray-800 mb-8 text-center">
    Ad Scheduling
  </h3>

  <div className="grid md:grid-cols-2 gap-8 items-start">

    {/* LEFT COLUMN — CALENDAR */}
    <div className="space-y-6">

      {/* Month & Year Selectors */}
      <div className="flex gap-4 justify-center">
        <select
          className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#157A4F] focus:outline-none transition"
          value={currentMonth.getMonth()}
          onChange={(e) =>
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), Number(e.target.value), 1)
            )
          }
        >
          {months.map((month, i) => (
            <option key={i} value={i}>{month}</option>
          ))}
        </select>

        <select
          className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#157A4F] focus:outline-none transition"
          value={currentMonth.getFullYear()}
          onChange={(e) =>
            setCurrentMonth(
              new Date(Number(e.target.value), currentMonth.getMonth(), 1)
            )
          }
        >
          {years.map((year, i) => (
            <option key={i} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Calendar Card */}
      <div className="bg-[#FFF3D6] p-6 rounded-2xl border border-gray-200 shadow-sm flex justify-center">
        <DayPicker
          mode="multiple"
          selected={selectedDates}
          onSelect={setSelectedDates}
          fromDate={new Date()}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          className="text-sm"
        />
      </div>

    </div>

    {/* RIGHT COLUMN — SELECTED DATES */}
    <div className="bg-gray-50 rounded-2xl border border-gray-200 shadow-inner flex flex-col h-[420px]">

      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h4 className="text-lg font-semibold text-gray-700">
          Selected Dates
        </h4>

        {selectedDates.length > 0 && (
          <span className="bg-[#157A4F] text-white px-3 py-1 rounded-lg text-xs font-medium shadow">
            {selectedDates.length} Day{selectedDates.length > 1 && "s"}
          </span>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-[#157A4F]/60 scrollbar-track-transparent">

        {selectedDates.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {selectedDates.map((date, index) => (
              <span
                key={index}
                className="bg-[#157A4F] text-white px-4 py-2 rounded-full text-sm shadow-md hover:scale-105 transition"
              >
                {formatDate(date)}
              </span>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            No dates selected yet
          </div>
        )}

      </div>

    </div>

  </div>

</div>

      {/* Media Upload */}
      <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-100">
        <h3 className="font-semibold text-2xl mb-6 text-gray-800">
          Media & Photos
        </h3>

        <div className="grid grid-cols-4 gap-6">
          {uploadedImages.map((image, index) => (
            <div
              key={index}
              className="h-32 border border-gray-200 rounded-2xl relative overflow-hidden shadow-sm"
            >
              <img
                src={image.url}
                alt={`uploaded-${index}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}

          <label className="h-32 flex items-center justify-center border-2 border-dashed rounded-2xl cursor-pointer text-gray-400 hover:border-[#157A4F] hover:text-[#157A4F] transition bg-[#FFF3D6]">
            + Add
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      </div>

    </div>
  );
}
