import React, { useState } from 'react';
import { 
  Settings, Users, Shield, Database, 
  Download, Upload, RefreshCw, AlertTriangle,
  Key, Mail, Bell, Trash2, Edit, Plus,
  Server, Activity, Lock, UserCheck
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Admin: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');

  // Données de démonstration pour l'administration
  const systemStats = {
    totalUsers: 127,
    activeUsers: 89,
    adminUsers: 3,
    pendingUsers: 12,
    totalEvents: 24,
    totalPhotos: 156,
    totalMessages: 342,
    storageUsed: '2.3 GB',
    storageLimit: '10 GB'
  };

  const adminUsers = [
    {
      id: '1',
      name: 'Super Administrateur',
      email: 'admin@moukona-ghieme.ga',
      role: 'super_admin',
      lastLogin: '2024-01-20T14:30:00Z',
      status: 'active'
    },
    {
      id: '2',
      name: 'Marie GHIEME',
      email: 'marie.ghieme@email.com',
      role: 'admin',
      lastLogin: '2024-01-19T16:45:00Z',
      status: 'active'
    }
  ];

  const systemLogs = [
    {
      id: '1',
      action: 'Connexion utilisateur',
      user: 'Jean GHIEME',
      timestamp: '2024-01-20T14:30:00Z',
      ip: '192.168.1.100',
      status: 'success'
    },
    {
      id: '2',
      action: 'Création événement',
      user: 'Marie GHIEME',
      timestamp: '2024-01-20T13:15:00Z',
      ip: '192.168.1.101',
      status: 'success'
    },
    {
      id: '3',
      action: 'Tentative connexion échouée',
      user: 'Inconnu',
      timestamp: '2024-01-20T12:45:00Z',
      ip: '192.168.1.102',
      status: 'error'
    }
  ];

  const backupHistory = [
    {
      id: '1',
      date: '2024-01-20T02:00:00Z',
      type: 'Automatique',
      size: '1.2 GB',
      status: 'success'
    },
    {
      id: '2',
      date: '2024-01-19T02:00:00Z',
      type: 'Automatique',
      size: '1.1 GB',
      status: 'success'
    },
    {
      id: '3',
      date: '2024-01-18T02:00:00Z',
      type: 'Manuel',
      size: '1.0 GB',
      status: 'success'
    }
  ];

  if (user?.role !== 'super_admin') {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="h-8 w-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès restreint</h2>
        <p className="text-gray-600">Cette section est réservée au super administrateur.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
          <p className="text-gray-600">Gestion système et configuration</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Sauvegarde
          </button>
        </div>
      </div>

      {/* Statistiques système */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Utilisateurs Total</p>
              <p className="text-2xl font-bold text-gray-900">{systemStats.totalUsers}</p>
              <p className="text-sm text-green-600 mt-1">{systemStats.activeUsers} actifs</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Administrateurs</p>
              <p className="text-2xl font-bold text-gray-900">{systemStats.adminUsers}</p>
              <p className="text-sm text-blue-600 mt-1">Tous actifs</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Stockage Utilisé</p>
              <p className="text-2xl font-bold text-gray-900">{systemStats.storageUsed}</p>
              <p className="text-sm text-gray-600 mt-1">sur {systemStats.storageLimit}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Database className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Système</p>
              <p className="text-2xl font-bold text-green-600">Opérationnel</p>
              <p className="text-sm text-gray-600 mt-1">99.9% uptime</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Server className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Onglets d'administration */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'users', label: 'Gestion Utilisateurs', icon: Users },
              { id: 'roles', label: 'Rôles & Permissions', icon: Shield },
              { id: 'system', label: 'Configuration', icon: Settings },
              { id: 'backup', label: 'Sauvegardes', icon: Database },
              { id: 'logs', label: 'Journaux', icon: Activity },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Gestion des Utilisateurs</h3>
                <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvel utilisateur
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-blue-900">Utilisateurs Actifs</h4>
                    <UserCheck className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-blue-900">{systemStats.activeUsers}</p>
                  <p className="text-sm text-blue-600">Connectés récemment</p>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-yellow-900">En Attente</h4>
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  </div>
                  <p className="text-2xl font-bold text-yellow-900">{systemStats.pendingUsers}</p>
                  <p className="text-sm text-yellow-600">Validation requise</p>
                </div>

                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-red-900">Inactifs</h4>
                    <Lock className="w-5 h-5 text-red-600" />
                  </div>
                  <p className="text-2xl font-bold text-red-900">
                    {systemStats.totalUsers - systemStats.activeUsers - systemStats.pendingUsers}
                  </p>
                  <p className="text-sm text-red-600">Comptes suspendus</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-4">Actions Rapides</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="flex items-center justify-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <Mail className="w-5 h-5 text-blue-600 mr-2" />
                    Envoyer invitation
                  </button>
                  <button className="flex items-center justify-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <Key className="w-5 h-5 text-green-600 mr-2" />
                    Réinitialiser mot de passe
                  </button>
                  <button className="flex items-center justify-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <Bell className="w-5 h-5 text-purple-600 mr-2" />
                    Notification globale
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Administrateurs</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dernière connexion</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {adminUsers.map((admin) => (
                      <tr key={admin.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                          <div className="text-sm text-gray-500">{admin.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            admin.role === 'super_admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {admin.role === 'super_admin' ? 'Super Admin' : 'Administrateur'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(admin.lastLogin).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Actif
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Edit className="w-4 h-4" />
                            </button>
                            {admin.role !== 'super_admin' && (
                              <button className="text-red-600 hover:text-red-900">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Sauvegardes</h3>
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="w-4 h-4 mr-2" />
                  Créer sauvegarde
                </button>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Configuration Automatique</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Sauvegardes automatiques programmées tous les jours à 2h00
                </p>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600" defaultChecked />
                    <span className="ml-2 text-sm text-blue-700">Sauvegardes automatiques activées</span>
                  </label>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Taille</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {backupHistory.map((backup) => (
                      <tr key={backup.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(backup.date).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {backup.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {backup.size}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Réussie
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Journaux d'Activité</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date/Heure</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {systemLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {log.action}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {log.user}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(log.timestamp).toLocaleString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {log.ip}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {log.status === 'success' ? 'Succès' : 'Erreur'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Configuration Système</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Paramètres Généraux</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom de l'association
                      </label>
                      <input
                        type="text"
                        defaultValue="Association Familiale MOUKONA GHIEME"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email de contact
                      </label>
                      <input
                        type="email"
                        defaultValue="contact@moukona-ghieme.ga"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Sécurité</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Authentification à deux facteurs</span>
                      <input type="checkbox" className="rounded border-gray-300 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Connexions multiples autorisées</span>
                      <input type="checkbox" className="rounded border-gray-300 text-green-600" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Journalisation des actions</span>
                      <input type="checkbox" className="rounded border-gray-300 text-green-600" defaultChecked />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h4 className="font-medium text-red-900 mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Zone Dangereuse
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-900">Réinitialiser toutes les données</p>
                      <p className="text-sm text-red-700">Supprime toutes les données de l'application</p>
                    </div>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                      Réinitialiser
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;