import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home, Users, Calendar, FileText, MessageSquare, 
  DollarSign, BarChart3, Settings, TreePine, 
  Camera, Download, X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const menuItems = [
    { icon: Home, label: 'Tableau de bord', path: '/', roles: ['super_admin', 'admin', 'member'] },
    { icon: Users, label: 'Membres', path: '/members', roles: ['super_admin', 'admin', 'member'] },
    { icon: Calendar, label: 'Événements', path: '/events', roles: ['super_admin', 'admin', 'member'] },
    { icon: FileText, label: 'Journal', path: '/news', roles: ['super_admin', 'admin', 'member'] },
    { icon: MessageSquare, label: 'Messages', path: '/messages', roles: ['super_admin', 'admin', 'member'] },
    { icon: TreePine, label: 'Arbre Généalogique', path: '/family-tree', roles: ['super_admin', 'admin', 'member'] },
    { icon: Camera, label: 'Galerie', path: '/gallery', roles: ['super_admin', 'admin', 'member'] },
    { icon: DollarSign, label: 'Finances', path: '/finances', roles: ['super_admin', 'admin'] },
    { icon: BarChart3, label: 'Statistiques', path: '/statistics', roles: ['super_admin', 'admin'] },
    { icon: Download, label: 'Exports', path: '/exports', roles: ['super_admin', 'admin'] },
    { icon: Settings, label: 'Administration', path: '/admin', roles: ['super_admin'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role || 'member')
  );

  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:shadow-none lg:border-r lg:border-gray-200
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* En-tête mobile */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 lg:hidden">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-yellow-100 flex items-center justify-center">
              <img 
                src="/Whisk_storyboard5cbcf8599218412b988bad87.png" 
                alt="Logo MOUKONA GHIEME" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <div>
              <span className="font-bold text-gray-900 text-lg">MOUKONA GHIEME</span>
              <p className="text-sm text-gray-600">Association Familiale</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* En-tête desktop */}
        <div className="hidden lg:flex items-center space-x-3 p-6 border-b border-gray-200">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-yellow-100 flex items-center justify-center">
            <img 
              src="/Whisk_storyboard5cbcf8599218412b988bad87.png" 
              alt="Logo MOUKONA GHIEME" 
              className="w-10 h-10 object-contain"
            />
          </div>
          <div>
            <span className="font-bold text-gray-900 text-lg">MOUKONA GHIEME</span>
            <p className="text-sm text-gray-600">Association Familiale</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-2">
            {filteredMenuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-green-50 text-green-700 border-r-4 border-green-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Informations de l'association en bas */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <TreePine className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-green-800">
                  Association Familiale
                </p>
                <p className="text-xs text-green-600">
                  Descendance GHIEME Marguerite
                </p>
              </div>
            </div>
            <div className="text-xs text-green-700 space-y-1">
              <p>• {filteredMenuItems.length} sections disponibles</p>
              <p>• Connecté en tant que {user?.role === 'super_admin' ? 'Super Admin' : user?.role === 'admin' ? 'Admin' : 'Membre'}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;