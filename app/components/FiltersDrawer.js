"use client";

import FiltersBar from "./FiltersBar";

export default function FiltersDrawer({ open, value, onChange, onClose }) {
  return (
    <div className={`fixed inset-0 z-[60] ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      ></div>
      {/* Panel */}
      <aside
        className={`absolute inset-y-0 left-0 w-80 max-w-[90vw] sm:max-w-[85%] bg-white shadow-xl p-4 transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-medium text-neutral-900">Filters</h3>
          <button onClick={onClose} className="text-sm text-neutral-600 hover:text-neutral-900">Close</button>
        </div>
        <FiltersBar value={value} onChange={onChange} />
      </aside>
    </div>
  );
}


