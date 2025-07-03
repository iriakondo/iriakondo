import React, { forwardRef } from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  helperText,
  options,
  placeholder,
  fullWidth = true,
  className = '',
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = React.useState(false);

  const hasError = !!error;

  const baseClasses = 'block w-full px-3 py-2 pr-10 border rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-white';
  
  const stateClasses = hasError
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
    : isFocused
    ? 'border-blue-500 focus:border-blue-500 focus:ring-blue-500'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <div className={`${widthClass} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          className={`${baseClasses} ${stateClasses}`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Icône chevron */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ChevronDown className={`w-4 h-4 ${hasError ? 'text-red-400' : 'text-gray-400'}`} />
        </div>

        {/* Icône d'erreur */}
        {hasError && (
          <div className="absolute inset-y-0 right-8 pr-3 flex items-center pointer-events-none">
            <AlertCircle className="w-4 h-4 text-red-400" />
          </div>
        )}
      </div>

      {/* Messages d'aide et d'erreur */}
      {(error || helperText) && (
        <div className="mt-1">
          {error && (
            <p className="text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {error}
            </p>
          )}
          {!error && helperText && (
            <p className="text-sm text-gray-500">{helperText}</p>
          )}
        </div>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
