"use client";

import { useState, useEffect } from "react";

export default function FiltersBar({ value, onChange }) {
  const [local, setLocal] = useState({
    priceMin: 0,
    priceMax: 50000,
    minRating: 0,
  });

  useEffect(() => {
    setLocal((prev) => ({ ...prev, ...value }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value?.priceMin, value?.priceMax, value?.minRating]);

  const emit = (next) => {
    onChange?.(next);
  };

  const handleInput = (key, val) => {
    const next = { ...local, [key]: val };
    setLocal(next);
  };

  const handleApply = () => emit(local);
  const handleClear = () => {
    const cleared = { priceMin: 0, priceMax: 50000, minRating: 0 };
    setLocal(cleared);
    emit(cleared);
  };

  const handlePriceRangeChange = (type, value) => {
    const numValue = Number(value);
    if (type === "min") {
      const next = { ...local, priceMin: Math.min(numValue, local.priceMax) };
      setLocal(next);
    } else {
      const next = { ...local, priceMax: Math.max(numValue, local.priceMin) };
      setLocal(next);
    }
  };

  return (
    <div className="w-full max-w-full space-y-4 overflow-hidden">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 block truncate">
          Price Range: ₹{local.priceMin.toLocaleString()} - ₹{local.priceMax.toLocaleString()}
        </label>
        <div className="relative w-full overflow-hidden">
          <div className="w-full h-2 bg-gray-200 rounded-lg relative">
            <div 
              className="absolute h-2 bg-blue-500 rounded-lg"
              style={{
                left: `${((local.priceMin - 0) / (50000 - 0)) * 100}%`,
                width: `${((local.priceMax - local.priceMin) / (50000 - 0)) * 100}%`
              }}
            />
          </div>
          <input
            type="range"
            min="0"
            max="50000"
            step="100"
            value={local.priceMin}
            onChange={(e) => handlePriceRangeChange("min", e.target.value)}
            className="absolute top-0 w-full h-2 opacity-0 cursor-pointer"
          />
          <input
            type="range"
            min="0"
            max="50000"
            step="100"
            value={local.priceMax}
            onChange={(e) => handlePriceRangeChange("max", e.target.value)}
            className="absolute top-0 w-full h-2 opacity-0 cursor-pointer"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2 flex-wrap">
        <label className="text-sm font-medium text-gray-700">Rating:</label>
        <select
          value={local.minRating}
          onChange={(e) => handleInput("minRating", Number(e.target.value))}
          className="border border-gray-300 text-sm px-2 py-1 bg-white text-gray-900 rounded min-w-0"
        >
          <option value={0}>All</option>
          <option value={4}>4+ stars</option>
          <option value={4.5}>4.5+ stars</option>
          <option value={5}>5 stars</option>
        </select>
      </div>
      
      <div className="flex items-center gap-2 pt-2 flex-wrap">
        <button onClick={handleClear} className="text-sm px-4 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded whitespace-nowrap">Clear</button>
        <button onClick={handleApply} className="text-sm px-4 py-2 border border-black bg-black text-white hover:bg-gray-800 rounded whitespace-nowrap">Apply</button>
      </div>
    </div>
  );
}


