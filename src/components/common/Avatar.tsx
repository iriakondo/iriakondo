import React from 'react';
import { User } from 'lucide-react';
import { getInitials, getColorFromString } from '../../utils/formatUtils';

interface AvatarProps {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ 
  firstName = '', 
  lastName = '', 
  avatar, 
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8'
  };

  const initials = getInitials(firstName, lastName);
  const colorClass = getColorFromString(firstName + lastName);

  if (avatar) {
    return (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden ${className}`}>
        <img 
          src={avatar} 
          alt={`${firstName} ${lastName}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Si l'image ne charge pas, on affiche les initiales
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            if (target.nextSibling) {
              (target.nextSibling as HTMLElement).style.display = 'flex';
            }
          }}
        />
        <div 
          className={`${sizeClasses[size]} ${colorClass} rounded-full flex items-center justify-center text-white font-medium ${className}`}
          style={{ display: 'none' }}
        >
          {initials}
        </div>
      </div>
    );
  }

  if (firstName || lastName) {
    return (
      <div className={`${sizeClasses[size]} ${colorClass} rounded-full flex items-center justify-center text-white font-medium ${className}`}>
        {initials}
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} bg-gray-300 rounded-full flex items-center justify-center ${className}`}>
      <User className={`${iconSizes[size]} text-gray-600`} />
    </div>
  );
};

export default Avatar;
