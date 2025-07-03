import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'membership' | 'payment' | 'event' | 'export' | 'general';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'general', className = '' }) => {
  const getStatusConfig = () => {
    switch (type) {
      case 'membership':
        return {
          active: { label: 'Actif', color: 'bg-green-100 text-green-800' },
          pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
          inactive: { label: 'Inactif', color: 'bg-gray-100 text-gray-800' },
        };
      
      case 'payment':
        return {
          paid: { label: 'Payé', color: 'bg-green-100 text-green-800' },
          pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
          overdue: { label: 'En retard', color: 'bg-red-100 text-red-800' },
        };
      
      case 'event':
        return {
          upcoming: { label: 'À venir', color: 'bg-blue-100 text-blue-800' },
          ongoing: { label: 'En cours', color: 'bg-green-100 text-green-800' },
          completed: { label: 'Terminé', color: 'bg-gray-100 text-gray-800' },
          cancelled: { label: 'Annulé', color: 'bg-red-100 text-red-800' },
        };

      case 'export':
        return {
          completed: { label: 'Terminé', color: 'bg-green-100 text-green-800' },
          processing: { label: 'En cours', color: 'bg-yellow-100 text-yellow-800' },
          failed: { label: 'Échec', color: 'bg-red-100 text-red-800' },
          pending: { label: 'En attente', color: 'bg-gray-100 text-gray-800' },
        };

      default:
        return {
          active: { label: 'Actif', color: 'bg-green-100 text-green-800' },
          inactive: { label: 'Inactif', color: 'bg-gray-100 text-gray-800' },
          pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
          success: { label: 'Succès', color: 'bg-green-100 text-green-800' },
          error: { label: 'Erreur', color: 'bg-red-100 text-red-800' },
          warning: { label: 'Attention', color: 'bg-yellow-100 text-yellow-800' },
          info: { label: 'Info', color: 'bg-blue-100 text-blue-800' },
        };
    }
  };

  const statusConfig = getStatusConfig();
  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: status,
    color: 'bg-gray-100 text-gray-800'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color} ${className}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
