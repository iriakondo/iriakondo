/**
 * Formate un montant en FCFA
 */
export const formatCurrency = (amount: number): string => {
  if (isNaN(amount)) {
    return '0 FCFA';
  }
  
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' FCFA';
};

/**
 * Formate un nombre avec des séparateurs de milliers
 */
export const formatNumber = (num: number): string => {
  if (isNaN(num)) {
    return '0';
  }
  
  return new Intl.NumberFormat('fr-FR').format(num);
};

/**
 * Formate un pourcentage
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  if (isNaN(value)) {
    return '0%';
  }
  
  return `${value.toFixed(decimals)}%`;
};

/**
 * Tronque un texte avec des points de suspension
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) {
    return text || '';
  }
  
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Capitalise la première lettre d'une chaîne
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Formate un nom complet
 */
export const formatFullName = (firstName: string, lastName: string): string => {
  const first = firstName?.trim() || '';
  const last = lastName?.trim() || '';
  
  if (!first && !last) return 'Nom non défini';
  if (!first) return last;
  if (!last) return first;
  
  return `${first} ${last.toUpperCase()}`;
};

/**
 * Formate un numéro de téléphone
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  // Supprime tous les caractères non numériques sauf le +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Format pour les numéros gabonais (+241 XX XX XX XX)
  if (cleaned.startsWith('+241') && cleaned.length === 12) {
    return cleaned.replace(/(\+241)(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  }
  
  // Format pour les numéros locaux (XX XX XX XX)
  if (cleaned.length === 8) {
    return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4');
  }
  
  return phone; // Retourne le numéro original si le format n'est pas reconnu
};

/**
 * Génère des initiales à partir d'un nom
 */
export const getInitials = (firstName: string, lastName: string): string => {
  const first = firstName?.trim() || '';
  const last = lastName?.trim() || '';
  
  if (!first && !last) return 'NN';
  if (!first) return last.charAt(0).toUpperCase();
  if (!last) return first.charAt(0).toUpperCase();
  
  return (first.charAt(0) + last.charAt(0)).toUpperCase();
};

/**
 * Valide une adresse email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Génère une couleur basée sur une chaîne (pour les avatars)
 */
export const getColorFromString = (str: string): string => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};
