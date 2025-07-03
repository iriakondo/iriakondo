import React, { forwardRef } from 'react';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  showPasswordToggle?: boolean;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  icon,
  iconPosition = 'left',
  showPasswordToggle = false,
  fullWidth = true,
  className = '',
  type = 'text',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const inputType = showPasswordToggle && type === 'password' 
    ? (showPassword ? 'text' : 'password') 
    : type;

  const hasError = !!error;
  const hasIcon = !!icon;
  const hasPasswordToggle = showPasswordToggle && type === 'password';

  const baseClasses = 'block w-full px-3 py-2 border rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const stateClasses = hasError
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
    : isFocused
    ? 'border-blue-500 focus:border-blue-500 focus:ring-blue-500'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';

  const paddingClasses = hasIcon && iconPosition === 'left' 
    ? 'pl-10' 
    : hasPasswordToggle || (hasIcon && iconPosition === 'right')
    ? 'pr-10'
    : '';

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
        {/* Icon gauche */}
        {hasIcon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className={`text-gray-400 ${hasError ? 'text-red-400' : ''}`}>
              {icon}
            </span>
          </div>
        )}

        {/* Input */}
        <input
          ref={ref}
          type={inputType}
          className={`${baseClasses} ${stateClasses} ${paddingClasses}`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {/* Icon droite ou toggle password */}
        {(hasIcon && iconPosition === 'right') || hasPasswordToggle ? (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {hasPasswordToggle ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            ) : (
              <span className={`text-gray-400 ${hasError ? 'text-red-400' : ''}`}>
                {icon}
              </span>
            )}
          </div>
        ) : null}

        {/* Icône d'erreur */}
        {hasError && !hasPasswordToggle && !(hasIcon && iconPosition === 'right') && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
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

Input.displayName = 'Input';

export default Input;
