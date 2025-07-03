/**
 * Formate une date en français
 */
export const formatDate = (date: string | Date, formatStr: string = 'dd/MM/yyyy'): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (!dateObj || isNaN(dateObj.getTime())) {
      return 'Date invalide';
    }

    return dateObj.toLocaleDateString('fr-FR');
  } catch (error) {
    console.error('Erreur lors du formatage de la date:', error);
    return 'Date invalide';
  }
};



/**
 * Formate une date avec l'heure
 */
export const formatDateTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (!dateObj || isNaN(dateObj.getTime())) {
      return 'Date invalide';
    }

    return dateObj.toLocaleDateString('fr-FR') + ' à ' + dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  } catch (error) {
    console.error('Erreur lors du formatage de la date:', error);
    return 'Date invalide';
  }
};

/**
 * Formate une date de manière relative (il y a X jours)
 */
export const formatRelativeDate = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (!dateObj || isNaN(dateObj.getTime())) {
      return 'Date invalide';
    }

    const now = new Date();
    const diffInMs = now.getTime() - dateObj.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return "Aujourd'hui";
    } else if (diffInDays === 1) {
      return 'Hier';
    } else if (diffInDays < 7) {
      return `Il y a ${diffInDays} jours`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return `Il y a ${months} mois`;
    } else {
      const years = Math.floor(diffInDays / 365);
      return `Il y a ${years} an${years > 1 ? 's' : ''}`;
    }
  } catch (error) {
    console.error('Erreur lors du formatage de la date relative:', error);
    return 'Date invalide';
  }
};

/**
 * Vérifie si une date est dans le futur
 */
export const isFutureDate = (date: string | Date): boolean => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj && !isNaN(dateObj.getTime()) && dateObj > new Date();
  } catch (error) {
    return false;
  }
};

/**
 * Calcule l'âge à partir d'une date de naissance
 */
export const calculateAge = (birthDate: string | Date): number => {
  try {
    const birthDateObj = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;

    if (!birthDateObj || isNaN(birthDateObj.getTime())) {
      return 0;
    }

    const today = new Date();
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }

    return age;
  } catch (error) {
    console.error('Erreur lors du calcul de l\'âge:', error);
    return 0;
  }
};
