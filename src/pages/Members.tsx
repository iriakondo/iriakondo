import React, { useState, useMemo } from 'react';
import { 
  Users, Plus, Search, Filter, Edit, Trash2, 
  Mail, Phone, MapPin, Calendar, CheckCircle, 
  XCircle, Clock, User, Eye, MoreVertical,
  Download, Upload, UserPlus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { User as UserType } from '../types';
import { formatDate, calculateAge } from '../utils/dateUtils';
import { formatCurrency, formatPhoneNumber, formatFullName } from '../utils/formatUtils';
import Avatar from '../components/common/Avatar';
import StatusBadge from '../components/common/StatusBadge';

interface MemberFilters {
  search: string;
  status: string;
  membershipType: string;
  role: string;
}

const Members: React.FC = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<MemberFilters>({
    search: '',
    status: 'all',
    membershipType: 'all',
    role: 'all'
  });
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<UserType | null>(null);
  const [showMemberDetails, setShowMemberDetails] = useState(false);

  // Données de démonstration étendues
  const mockMembers: UserType[] = [
    {
      id: '1',
      email: 'admin@moukona-ghieme.ga',
      firstName: 'Super',
      lastName: 'Administrateur',
      phone: '+241 00 00 00 00',
      address: 'Libreville, Gabon',
      dateOfBirth: '1970-01-01',
      role: 'super_admin',
      membershipStatus: 'active',
      membershipType: 'worker',
      cotisationAmount: 10000,
      joinDate: '2024-01-01',
      lastLogin: new Date().toISOString(),
    },
    {
      id: '2',
      email: 'marie.ghieme@email.com',
      firstName: 'Marie',
      lastName: 'GHIEME',
      phone: '+241 01 23 45 67',
      address: 'Libreville, Gabon',
      dateOfBirth: '1985-03-15',
      role: 'admin',
      membershipStatus: 'active',
      membershipType: 'worker',
      cotisationAmount: 10000,
      parentRelation: 'Fille de Marguerite GHIEME',
      joinDate: '2024-01-15',
      lastLogin: new Date().toISOString(),
    },
    {
      id: '3',
      email: 'jean.ghieme@email.com',
      firstName: 'Jean',
      lastName: 'GHIEME',
      phone: '+241 07 89 12 34',
      address: 'Moanda, Gabon',
      dateOfBirth: '1992-07-22',
      role: 'member',
      membershipStatus: 'active',
      membershipType: 'student',
      cotisationAmount: 1000,
      parentRelation: 'Petit-fils de Marguerite GHIEME',
      joinDate: '2024-02-01',
      lastLogin: new Date().toISOString(),
    },
    {
      id: '4',
      email: 'paul.ghieme@email.com',
      firstName: 'Paul',
      lastName: 'GHIEME',
      phone: '+241 06 11 22 33',
      address: 'Port-Gentil, Gabon',
      dateOfBirth: '1978-11-08',
      role: 'member',
      membershipStatus: 'active',
      membershipType: 'worker',
      cotisationAmount: 10000,
      parentRelation: 'Fils de Marguerite GHIEME',
      joinDate: '2024-01-20',
      lastLogin: '2024-01-18T10:30:00Z',
    },
    {
      id: '5',
      email: 'sophie.ghieme@email.com',
      firstName: 'Sophie',
      lastName: 'GHIEME',
      phone: '+241 05 44 55 66',
      address: 'Franceville, Gabon',
      dateOfBirth: '1995-06-12',
      role: 'member',
      membershipStatus: 'pending',
      membershipType: 'unemployed',
      cotisationAmount: 3000,
      parentRelation: 'Petite-fille de Marguerite GHIEME',
      joinDate: '2024-01-25',
    },
    {
      id: '6',
      email: 'robert.ghieme@email.com',
      firstName: 'Robert',
      lastName: 'GHIEME',
      phone: '+241 04 77 88 99',
      address: 'Oyem, Gabon',
      dateOfBirth: '1960-04-30',
      role: 'member',
      membershipStatus: 'active',
      membershipType: 'retired',
      cotisationAmount: 5000,
      parentRelation: 'Fils de Marguerite GHIEME',
      joinDate: '2024-01-10',
      lastLogin: '2024-01-20T14:15:00Z',
    },
    {
      id: '7',
      email: 'claire.ghieme@email.com',
      firstName: 'Claire',
      lastName: 'GHIEME',
      phone: '+241 02 33 44 55',
      address: 'Lambaréné, Gabon',
      dateOfBirth: '1988-09-18',
      role: 'member',
      membershipStatus: 'active',
      membershipType: 'worker',
      cotisationAmount: 10000,
      parentRelation: 'Petite-fille de Marguerite GHIEME',
      joinDate: '2024-02-05',
      lastLogin: '2024-01-19T09:20:00Z',
    },
    {
      id: '8',
      email: 'michel.ghieme@email.com',
      firstName: 'Michel',
      lastName: 'GHIEME',
      phone: '+241 03 66 77 88',
      address: 'Tchibanga, Gabon',
      dateOfBirth: '1975-12-03',
      role: 'member',
      membershipStatus: 'inactive',
      membershipType: 'worker',
      cotisationAmount: 10000,
      parentRelation: 'Fils de Marguerite GHIEME',
      joinDate: '2024-01-05',
      lastLogin: '2024-01-10T16:45:00Z',
    }
  ];

  const [members, setMembers] = useState(mockMembers);

  // Logique de filtrage améliorée
  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const matchesSearch = 
        member.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
        member.lastName.toLowerCase().includes(filters.search.toLowerCase()) ||
        member.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        member.phone.includes(filters.search);
      
      const matchesStatus = filters.status === 'all' || member.membershipStatus === filters.status;
      const matchesMembershipType = filters.membershipType === 'all' || member.membershipType === filters.membershipType;
      const matchesRole = filters.role === 'all' || member.role === filters.role;
      
      return matchesSearch && matchesStatus && matchesMembershipType && matchesRole;
    });
  }, [members, filters]);

  // Statistiques des membres
  const memberStats = useMemo(() => {
    const total = members.length;
    const active = members.filter(m => m.membershipStatus === 'active').length;
    const pending = members.filter(m => m.membershipStatus === 'pending').length;
    const inactive = members.filter(m => m.membershipStatus === 'inactive').length;
    
    return { total, active, pending, inactive };
  }, [members]);

  const getMembershipTypeLabel = (type: string) => {
    const types = {
      worker: 'Travailleur',
      retired: 'Retraité',
      unemployed: 'Chômeur',
      student: 'Étudiant'
    };
    return types[type as keyof typeof types] || type;
  };

  const getRoleLabel = (role: string) => {
    const roles = {
      super_admin: 'Super Admin',
      admin: 'Administrateur',
      member: 'Membre'
    };
    return roles[role as keyof typeof roles] || role;
  };

  const handleApprove = (memberId: string) => {
    setMembers(prev => prev.map(member => 
      member.id === memberId 
        ? { ...member, membershipStatus: 'active' as const }
        : member
    ));
  };

  const canManageMembers = user?.role === 'super_admin' || user?.role === 'admin';

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Membres</h1>
          <p className="text-gray-600">Gérez les membres de l'association familiale MOUKONA GHIEME</p>
        </div>
        <div className="flex items-center space-x-3">
          {canManageMembers && (
            <>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="h-4 w-4" />
                <span>Exporter</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Upload className="h-4 w-4" />
                <span>Importer</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <UserPlus className="h-4 w-4" />
                <span>Ajouter</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Membres</p>
              <p className="text-2xl font-bold text-gray-900">{memberStats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Actifs</p>
              <p className="text-2xl font-bold text-gray-900">{memberStats.active}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-gray-900">{memberStats.pending}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inactifs</p>
              <p className="text-2xl font-bold text-gray-900">{memberStats.inactive}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher par nom, email ou téléphone..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actifs</option>
                <option value="pending">En attente</option>
                <option value="inactive">Inactifs</option>
              </select>
            </div>
            <select
              value={filters.membershipType}
              onChange={(e) => setFilters(prev => ({ ...prev, membershipType: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Tous les types</option>
              <option value="worker">Travailleur</option>
              <option value="retired">Retraité</option>
              <option value="unemployed">Chômeur</option>
              <option value="student">Étudiant</option>
            </select>
            <select
              value={filters.role}
              onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Tous les rôles</option>
              <option value="super_admin">Super Admin</option>
              <option value="admin">Administrateur</option>
              <option value="member">Membre</option>
            </select>
            <div className="flex items-center space-x-2 border-l pl-3">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'table' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>{filteredMembers.length} membre(s) trouvé(s)</span>
          {(filters.search || filters.status !== 'all' || filters.membershipType !== 'all' || filters.role !== 'all') && (
            <button
              onClick={() => setFilters({ search: '', status: 'all', membershipType: 'all', role: 'all' })}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      </div>

      {/* Liste des membres */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Membre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cotisation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Âge
                  </th>
                  {canManageMembers && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Avatar
                          firstName={member.firstName}
                          lastName={member.lastName}
                          avatar={member.avatar}
                          size="md"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {formatFullName(member.firstName, member.lastName)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {member.parentRelation || 'Membre fondateur'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center mb-1">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {member.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {formatPhoneNumber(member.phone)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={member.membershipStatus} type="membership" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getMembershipTypeLabel(member.membershipType)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(member.cotisationAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {calculateAge(member.dateOfBirth)} ans
                    </td>
                    {canManageMembers && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedMember(member);
                              setShowMemberDetails(true);
                            }}
                            className="text-green-600 hover:text-green-900 p-1 rounded"
                            title="Voir les détails"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          {member.membershipStatus === 'pending' && (
                            <button
                              onClick={() => handleApprove(member.id)}
                              className="text-green-600 hover:text-green-900 p-1 rounded"
                              title="Approuver"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Vue grille */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map((member) => (
            <div key={member.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <Avatar
                  firstName={member.firstName}
                  lastName={member.lastName}
                  avatar={member.avatar}
                  size="lg"
                />
                {canManageMembers && (
                  <div className="relative">
                    <button className="p-1 rounded-full hover:bg-gray-100">
                      <MoreVertical className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                )}
              </div>

              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {formatFullName(member.firstName, member.lastName)}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {member.parentRelation || 'Membre fondateur'}
                </p>
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <StatusBadge status={member.membershipStatus} type="membership" />
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {getMembershipTypeLabel(member.membershipType)}
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{formatPhoneNumber(member.phone)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="truncate">{member.address}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{calculateAge(member.dateOfBirth)} ans</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    Cotisation: {formatCurrency(member.cotisationAmount)}
                  </span>
                  <span className="text-xs text-gray-500">
                    Membre depuis {formatDate(member.joinDate)}
                  </span>
                </div>
              </div>

              {canManageMembers && (
                <div className="mt-4 flex items-center justify-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedMember(member);
                      setShowMemberDetails(true);
                    }}
                    className="flex-1 bg-green-50 text-green-600 px-3 py-2 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                  >
                    Voir détails
                  </button>
                  {member.membershipStatus === 'pending' && (
                    <button
                      onClick={() => handleApprove(member.id)}
                      className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      title="Approuver"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {filteredMembers.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun membre trouvé</h3>
          <p className="text-gray-500 mb-6">
            {filters.search || filters.status !== 'all' || filters.membershipType !== 'all' || filters.role !== 'all'
              ? 'Aucun membre ne correspond à vos critères de recherche.'
              : 'Aucun membre n\'est encore enregistré dans l\'association.'}
          </p>
          {canManageMembers && (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Ajouter le premier membre
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Members;
