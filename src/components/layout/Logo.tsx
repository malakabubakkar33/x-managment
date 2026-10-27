import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  showDescriptor?: boolean;
  variant?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  showDescriptor = true,
  variant = 'dark',
}) => {
  const isLight = variant === 'light';

  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg p-1 transition-opacity hover:opacity-95 ${className}`}
      aria-label="X Management Home"
    >
      {/* Custom Stylized X + Healthcare Cross SVG */}
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-navy-900 shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
        <svg
          className="w-6 h-6 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Stylized X Cross */}
          <path d="M5 5L19 19" />
          <path d="M19 5L5 19" />
          {/* Medical Center Node */}
          <circle cx="12" cy="12" r="2.5" fill="#10B981" stroke="#0E86D4" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-extrabold text-xl tracking-tight ${
              isLight ? 'text-white' : 'text-slate-900'
            }`}
          >
            X <span className="text-brand-600">Management</span>
          </span>
        </div>
        {showDescriptor && (
          <span
            className={`text-[11px] font-medium tracking-wide uppercase ${
              isLight ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Pharmacy Management Solutions
          </span>
        )}
      </div>
    </Link>
  );
};
