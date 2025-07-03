import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  debounceMs?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = 'Rechercher...',
  value = '',
  onChange,
  onClear,
  debounceMs = 300,
  className = '',
  size = 'md',
  fullWidth = true
}) => {
  const [internalValue, setInternalValue] = useState(value);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(internalValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [internalValue, onChange, debounceMs]);

  // Sync with external value changes
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleClear = () => {
    setInternalValue('');
    onChange('');
    onClear?.();
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-3 text-base'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <div className={`relative ${widthClass} ${className}`}>
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className={`${iconSizes[size]} text-gray-400`} />
      </div>

      {/* Input */}
      <input
        type="text"
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        placeholder={placeholder}
        className={`
          block w-full pl-10 pr-10 border border-gray-300 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-all duration-200
          ${sizeClasses[size]}
        `}
      />

      {/* Clear Button */}
      {internalValue && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button
            type="button"
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
          >
            <X className={iconSizes[size]} />
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchInput;
