import React from 'react';
import { AlertTriangle, Trash2, Edit, Check } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'danger',
  confirmText,
  cancelText = 'Annuler',
  loading = false
}) => {
  const config = {
    danger: {
      icon: <Trash2 className="w-6 h-6" />,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      confirmText: confirmText || 'Supprimer',
      confirmVariant: 'danger' as const
    },
    warning: {
      icon: <AlertTriangle className="w-6 h-6" />,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      confirmText: confirmText || 'Continuer',
      confirmVariant: 'primary' as const
    },
    info: {
      icon: <Edit className="w-6 h-6" />,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      confirmText: confirmText || 'Confirmer',
      confirmVariant: 'primary' as const
    },
    success: {
      icon: <Check className="w-6 h-6" />,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      confirmText: confirmText || 'Valider',
      confirmVariant: 'success' as const
    }
  };

  const currentConfig = config[type];

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      showCloseButton={false}
      closeOnOverlayClick={!loading}
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className={`flex-shrink-0 w-12 h-12 rounded-full ${currentConfig.iconBg} flex items-center justify-center mr-4`}>
            <span className={currentConfig.iconColor}>
              {currentConfig.icon}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-gray-700 text-sm leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={currentConfig.confirmVariant}
            onClick={handleConfirm}
            loading={loading}
          >
            {currentConfig.confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
