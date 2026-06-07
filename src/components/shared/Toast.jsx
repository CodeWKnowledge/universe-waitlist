import React, { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  const isError = type === 'error';

  return (
    <div
      className={`fixed bottom-8 right-8 z-[99999] max-w-sm w-full md:w-80 p-4 border rounded-xl backdrop-blur-md shadow-2xl transition-all duration-300 transform translate-y-0 opacity-100 flex items-start gap-3 select-none
        ${isError 
          ? 'bg-rose-500/10 border-rose-500/35 text-rose-200' 
          : 'bg-[#16C760]/10 border-[#16C760]/35 text-[#86efac]'
        }`}
    >
      <span className="text-base flex-shrink-0 select-none">
        {isError ? '⚠️' : '✅'}
      </span>
      <div className="flex-1 text-xs md:text-sm font-medium leading-relaxed">
        {message}
      </div>
      <button 
        onClick={onClose} 
        className="text-white/45 hover:text-white transition-colors text-base font-bold leading-none cursor-pointer flex-shrink-0"
      >
        &times;
      </button>
    </div>
  );
}
