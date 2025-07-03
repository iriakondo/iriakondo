import React, { useState } from 'react';
import {
  DollarSign, TrendingUp, TrendingDown, Plus,
  Calendar, Download, PieChart,
  CreditCard, Wallet, Building, Users,
  Edit, Eye, Trash2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { formatCurrency } from '../utils/formatUtils';
import { Modal, Button, Input, Select, ConfirmModal, SearchInput, FilterPanel } from '../components/ui';
import { useSearchAndFilter, filterHelpers } from '../hooks/useSearchAndFilter';
import { SimpleBarChart, SimplePieChart, SimpleLineChart } from '../components/charts/SimpleCharts';
import { useChartData } from '../hooks/useChartData';

const Finances: React.FC = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMonth, setSelectedMonth] = useState('2024-01');
  const [showCotisationModal, setShowCotisationModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cotisationToDelete, setCotisationToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cotisationForm, setCotisationForm] = useState({
    memberId: '',
    memberName: '',
    amount: '',
    type: 'worker',
    date: new Date().toISOString().split('T')[0],
    status: 'paid'
  });
  // Données de démonstration
  const financialStats = {
    totalCotisations: 1250000,
    totalDepenses: 850000,
    soldeActuel: 400000,
    cotisationsEnAttente: 125000,
    membresAJour: 89,
    totalMembres: 127
  };

  const cotisationsData = [
    { id: '1', member: 'Marie GHIEME', amount: 10000, status: 'paid', date: '2024-01-15', type: 'worker' },
    { id: '2', member: 'Jean GHIEME', amount: 1000, status: 'paid', date: '2024-01-10', type: 'student' },
    { id: '3', member: 'Paul GHIEME', amount: 10000, status: 'pending', date: '2024-01-01', type: 'worker' },
    { id: '4', member: 'Robert GHIEME', amount: 5000, status: 'paid', date: '2024-01-20', type: 'retired' },
    { id: '5', member: 'Sophie GHIEME', amount: 3000, status: 'overdue', date: '2023-12-01', type: 'unemployed' },
    { id: '6', member: 'André GHIEME', amount: 10000, status: 'paid', date: '2024-01-18', type: 'worker' },
    { id: '7', member: 'Claudine GHIEME', amount: 5000, status: 'paid', date: '2024-01-12', type: 'retired' },
    { id: '8', member: 'Michel GHIEME', amount: 10000, status: 'pending', date: '2024-01-05', type: 'worker' },
    { id: '9', member: 'Françoise GHIEME', amount: 1000, status: 'paid', date: '2024-01-08', type: 'student' },
    { id: '10', member: 'Bernard GHIEME', amount: 3000, status: 'overdue', date: '2023-11-15', type: 'unemployed' },
    { id: '11', member: 'Sylvie GHIEME', amount: 10000, status: 'paid', date: '2024-01-22', type: 'worker' },
    { id: '12', member: 'Patrick GHIEME', amount: 5000, status: 'pending', date: '2024-01-03', type: 'retired' },
  ];

  const [cotisations, setCotisations] = useState(cotisationsData);

  const expensesData = [
    { id: '1', description: 'Assemblée Générale', amount: 150000, category: 'event', date: '2024-01-15', status: 'approved' },
    { id: '2', description: 'Aide funéraire famille NZAMBA', amount: 200000, category: 'emergency', date: '2024-01-10', status: 'approved' },
    { id: '3', description: 'Matériel bureau', amount: 75000, category: 'administration', date: '2024-01-08', status: 'approved' },
    { id: '4', description: 'Projet AGR - Coopérative', amount: 300000, category: 'agr', date: '2024-01-05', status: 'approved' },
    { id: '5', description: 'Fête de fin d\'année', amount: 180000, category: 'event', date: '2023-12-20', status: 'approved' },
    { id: '6', description: 'Aide médicale famille MBALLA', amount: 150000, category: 'emergency', date: '2024-01-12', status: 'approved' },
    { id: '7', description: 'Fournitures de bureau', amount: 45000, category: 'administration', date: '2024-01-18', status: 'approved' },
    { id: '8', description: 'Projet AGR - Commerce', amount: 250000, category: 'agr', date: '2024-01-20', status: 'approved' },
    { id: '9', description: 'Réunion mensuelle', amount: 35000, category: 'event', date: '2024-01-25', status: 'approved' },
    { id: '10', description: 'Aide scolaire famille NKOMO', amount: 100000, category: 'emergency', date: '2024-01-22', status: 'approved' },
  ];

  // Configuration du système de recherche et filtrage pour les cotisations
  const cotisationFilters = {
    status: filterHelpers.exactMatch('status'),
    type: filterHelpers.exactMatch('type'),
    dateRange: filterHelpers.dateRange('date'),
    amountRange: (item: any, value: { min?: string; max?: string }) => {
      if (!value.min && !value.max) return true;
      const amount = item.amount;
      const min = value.min ? parseInt(value.min) : null;
      const max = value.max ? parseInt(value.max) : null;
      if (min !== null && amount < min) return false;
      if (max !== null && amount > max) return false;
      return true;
    }
  };

  const {
    searchTerm: cotisationSearch,
    setSearchTerm: setCotisationSearch,
    filters: cotisationFilters_,
    setFilter: setCotisationFilter,
    clearFilters: clearCotisationFilters,
    filteredData: filteredCotisations
  } = useSearchAndFilter({
    data: cotisations,
    searchFields: ['member'],
    filterFunctions: cotisationFilters
  });

  // Données simplifiées pour les graphiques
  const stats = {
    totalCotisations: cotisations.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.amount, 0),
    totalDepenses: expensesData.reduce((sum, e) => sum + e.amount, 0),
    soldeActuel: 0,
    membresActifs: new Set(cotisations.map(c => c.member)).size,
    tauxRecouvrement: cotisations.length > 0 ? (cotisations.filter(c => c.status === 'paid').length / cotisations.length) * 100 : 0
  };
  stats.soldeActuel = stats.totalCotisations - stats.totalDepenses;

  // Données pour graphiques simples
  const memberTypeData = [
    { label: 'Travailleurs', value: cotisations.filter(c => c.type === 'worker').length, color: '#3b82f6' },
    { label: 'Retraités', value: cotisations.filter(c => c.type === 'retired').length, color: '#10b981' },
    { label: 'Étudiants', value: cotisations.filter(c => c.type === 'student').length, color: '#f59e0b' },
    { label: 'Chômeurs', value: cotisations.filter(c => c.type === 'unemployed').length, color: '#ef4444' }
  ];

  const monthlyData = [
    { label: 'Jan', value: 120000 },
    { label: 'Fév', value: 135000 },
    { label: 'Mar', value: 98000 },
    { label: 'Avr', value: 142000 },
    { label: 'Mai', value: 156000 }
  ];

  const categoryData = [
    { label: 'Événements', value: expensesData.filter(e => e.category === 'event').reduce((sum, e) => sum + e.amount, 0), color: '#3b82f6' },
    { label: 'Urgences', value: expensesData.filter(e => e.category === 'emergency').reduce((sum, e) => sum + e.amount, 0), color: '#ef4444' },
    { label: 'AGR', value: expensesData.filter(e => e.category === 'agr').reduce((sum, e) => sum + e.amount, 0), color: '#10b981' },
    { label: 'Administration', value: expensesData.filter(e => e.category === 'administration').reduce((sum, e) => sum + e.amount, 0), color: '#f59e0b' }
  ];

  const agrProjects = [
    { id: '1', name: 'Coopérative Agricole', investment: 500000, revenue: 125000, status: 'active', roi: 25, description: 'Production et vente de légumes bio', startDate: '2023-06-01' },
    { id: '2', name: 'Commerce Général', investment: 300000, revenue: 90000, status: 'active', roi: 30, description: 'Boutique de produits de première nécessité', startDate: '2023-08-15' },
    { id: '3', name: 'Transport Urbain', investment: 800000, revenue: 0, status: 'pending', roi: 0, description: 'Service de taxi moto', startDate: '2024-02-01' },
    { id: '4', name: 'Élevage de Porc', investment: 400000, revenue: 80000, status: 'active', roi: 20, description: 'Élevage et vente de porcs', startDate: '2023-09-01' },
    { id: '5', name: 'Salon de Coiffure', investment: 200000, revenue: 65000, status: 'active', roi: 32, description: 'Salon de coiffure moderne', startDate: '2023-10-01' },
    { id: '6', name: 'Boulangerie', investment: 600000, revenue: 0, status: 'pending', roi: 0, description: 'Production et vente de pain', startDate: '2024-03-01' },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { label: 'Payé', color: 'bg-green-100 text-green-800' },
      pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
      overdue: { label: 'En retard', color: 'bg-red-100 text-red-800' },
      active: { label: 'Actif', color: 'bg-green-100 text-green-800' },
      inactive: { label: 'Inactif', color: 'bg-gray-100 text-gray-800' },
      completed: { label: 'Terminé', color: 'bg-blue-100 text-blue-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] ||
                  { label: status, color: 'bg-gray-100 text-gray-800' };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      event: { label: 'Événement', color: 'bg-blue-100 text-blue-800' },
      emergency: { label: 'Urgence', color: 'bg-red-100 text-red-800' },
      administration: { label: 'Administration', color: 'bg-purple-100 text-purple-800' },
      agr: { label: 'AGR', color: 'bg-green-100 text-green-800' }
    };

    const config = categoryConfig[category as keyof typeof categoryConfig] ||
                  { label: category, color: 'bg-gray-100 text-gray-800' };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!cotisationForm.memberName.trim()) {
      errors.memberName = 'Le nom du membre est requis';
    }

    if (!cotisationForm.amount || parseInt(cotisationForm.amount) <= 0) {
      errors.amount = 'Le montant doit être supérieur à 0';
    }

    if (!cotisationForm.date) {
      errors.date = 'La date est requise';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCotisationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showError('Erreur de validation', 'Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Créer une nouvelle cotisation
      const newCotisation = {
        id: (cotisations.length + 1).toString(),
        member: cotisationForm.memberName,
        amount: parseInt(cotisationForm.amount),
        status: cotisationForm.status,
        date: cotisationForm.date,
        type: cotisationForm.type
      };

      // Ajouter la cotisation à la liste
      setCotisations(prev => [newCotisation, ...prev]);

      // Réinitialiser le formulaire
      setCotisationForm({
        memberId: '',
        memberName: '',
        amount: '',
        type: 'worker',
        date: new Date().toISOString().split('T')[0],
        status: 'paid'
      });

      setFormErrors({});
      setShowCotisationModal(false);

      showSuccess(
        'Cotisation enregistrée !',
        `La cotisation de ${cotisationForm.memberName} a été ajoutée avec succès.`
      );
    } catch (error) {
      showError('Erreur', 'Une erreur est survenue lors de l\'enregistrement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAmountByType = (type: string) => {
    const amounts = {
      worker: '10000',
      retired: '5000',
      student: '1000',
      unemployed: '3000'
    };
    return amounts[type as keyof typeof amounts] || '10000';
  };

  const handleTypeChange = (type: string) => {
    setCotisationForm(prev => ({
      ...prev,
      type,
      amount: getAmountByType(type)
    }));
    // Effacer l'erreur du montant si elle existe
    if (formErrors.amount) {
      setFormErrors(prev => ({ ...prev, amount: '' }));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCotisationForm(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur du champ modifié
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Options pour les selects
  const memberTypeOptions = [
    { value: 'worker', label: 'Travailleur (10,000 FCFA)' },
    { value: 'retired', label: 'Retraité (5,000 FCFA)' },
    { value: 'student', label: 'Étudiant (1,000 FCFA)' },
    { value: 'unemployed', label: 'Chômeur (3,000 FCFA)' }
  ];

  const statusOptions = [
    { value: 'paid', label: 'Payé' },
    { value: 'pending', label: 'En attente' },
    { value: 'overdue', label: 'En retard' }
  ];

  // Options de filtrage pour les cotisations
  const cotisationFilterOptions = [
    {
      key: 'status',
      label: 'Statut',
      type: 'select' as const,
      options: [
        { value: '', label: 'Tous les statuts' },
        ...statusOptions
      ]
    },
    {
      key: 'type',
      label: 'Type de membre',
      type: 'select' as const,
      options: [
        { value: '', label: 'Tous les types' },
        { value: 'worker', label: 'Travailleur' },
        { value: 'retired', label: 'Retraité' },
        { value: 'student', label: 'Étudiant' },
        { value: 'unemployed', label: 'Chômeur' }
      ]
    },
    {
      key: 'dateRange',
      label: 'Période',
      type: 'dateRange' as const
    },
    {
      key: 'amountRange',
      label: 'Montant',
      type: 'text' as const,
      placeholder: 'Min-Max (ex: 1000-10000)'
    }
  ];

  // Fonctions de gestion de suppression
  const handleDeleteClick = (cotisationId: string) => {
    setCotisationToDelete(cotisationId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!cotisationToDelete) return;

    setIsDeleting(true);
    try {
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Supprimer la cotisation
      setCotisations(prev => prev.filter(c => c.id !== cotisationToDelete));

      const deletedCotisation = cotisations.find(c => c.id === cotisationToDelete);
      showSuccess(
        'Cotisation supprimée !',
        `La cotisation de ${deletedCotisation?.member} a été supprimée avec succès.`
      );
    } catch (error) {
      showError('Erreur', 'Une erreur est survenue lors de la suppression');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setCotisationToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setCotisationToDelete(null);
  };

  if (user?.role === 'member') {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <DollarSign className="h-8 w-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès restreint</h2>
        <p className="text-gray-600">Cette section est réservée aux administrateurs.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion Financière</h1>
          <p className="text-gray-600">Cotisations, dépenses et projets AGR</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle dépense
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </button>
        </div>
      </div>

      {/* Statistiques financières */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cotisations collectées</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(financialStats.totalCotisations)}
              </p>
              <p className="text-sm text-green-600 mt-1">+12% ce mois</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total dépenses</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(financialStats.totalDepenses)}
              </p>
              <p className="text-sm text-red-600 mt-1">+8% ce mois</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Solde actuel</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(financialStats.soldeActuel)}
              </p>
              <p className="text-sm text-blue-600 mt-1">Disponible</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Wallet className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taux de paiement</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round((financialStats.membresAJour / financialStats.totalMembres) * 100)}%
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {financialStats.membresAJour}/{financialStats.totalMembres} membres
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          {/* Navigation desktop */}
          <nav className="hidden md:flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: PieChart },
              { id: 'cotisations', label: 'Cotisations', icon: CreditCard },
              { id: 'expenses', label: 'Dépenses', icon: DollarSign },
              { id: 'agr', label: 'Projets AGR', icon: Building }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Navigation mobile */}
          <div className="md:hidden px-4 py-3">
            <Select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              options={[
                { value: 'overview', label: 'Vue d\'ensemble' },
                { value: 'cotisations', label: 'Cotisations' },
                { value: 'expenses', label: 'Dépenses' },
                { value: 'agr', label: 'Projets AGR' }
              ]}
              fullWidth={true}
            />
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                <h3 className="text-lg font-semibold">Vue d'ensemble financière</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              {/* Statistiques principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Cotisations</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalCotisations)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <TrendingDown className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Dépenses</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalDepenses)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg ${stats.soldeActuel >= 0 ? 'bg-blue-100' : 'bg-red-100'}`}>
                      <Wallet className={`w-6 h-6 ${stats.soldeActuel >= 0 ? 'text-blue-600' : 'text-red-600'}`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Solde Actuel</p>
                      <p className={`text-2xl font-bold ${stats.soldeActuel >= 0 ? 'text-blue-900' : 'text-red-900'}`}>
                        {formatCurrency(stats.soldeActuel)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Membres Actifs</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.membresActifs}</p>
                      <p className="text-xs text-gray-500">{stats.tauxRecouvrement.toFixed(1)}% de recouvrement</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphiques principaux */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Évolution des cotisations */}
                <SimpleLineChart
                  data={monthlyData}
                  title="Évolution des Cotisations"
                  height={250}
                />

                {/* Répartition par type de membre */}
                <SimplePieChart
                  data={memberTypeData}
                  title="Répartition par Type de Membre"
                />
              </div>

              {/* Graphiques secondaires */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Répartition des dépenses */}
                <SimplePieChart
                  data={categoryData}
                  title="Répartition des Dépenses"
                />

                {/* Statistiques par statut */}
                <SimpleBarChart
                  data={[
                    { label: 'Payées', value: cotisations.filter(c => c.status === 'paid').length, color: '#10b981' },
                    { label: 'En attente', value: cotisations.filter(c => c.status === 'pending').length, color: '#f59e0b' },
                    { label: 'En retard', value: cotisations.filter(c => c.status === 'overdue').length, color: '#ef4444' }
                  ]}
                  title="Cotisations par Statut"
                  height={200}
                />
              </div>
            </div>
          )}

          {activeTab === 'cotisations' && (
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                <h3 className="text-lg font-semibold">Suivi des Cotisations</h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowCotisationModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Saisir cotisation
                  </button>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                    >
                      <option value="2024-01">Janvier 2024</option>
                      <option value="2023-12">Décembre 2023</option>
                      <option value="2023-11">Novembre 2023</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Barre de recherche et filtres */}
              <div className="space-y-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <SearchInput
                      placeholder="Rechercher par nom de membre..."
                      value={cotisationSearch}
                      onChange={setCotisationSearch}
                    />
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    {filteredCotisations.length} sur {cotisations.length} cotisations
                  </div>
                </div>

                <FilterPanel
                  filters={cotisationFilterOptions}
                  values={cotisationFilters_}
                  onChange={(values) => {
                    Object.entries(values).forEach(([key, value]) => {
                      if (key === 'amountRange' && typeof value === 'string' && value.includes('-')) {
                        const [min, max] = value.split('-').map(v => v.trim());
                        setCotisationFilter(key, { min, max });
                      } else {
                        setCotisationFilter(key, value);
                      }
                    });
                  }}
                  onReset={clearCotisationFilters}
                  defaultCollapsed={true}
                />
              </div>

              {/* Version desktop */}
              <div className="hidden lg:block overflow-x-auto bg-white shadow rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Membre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCotisations.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <div className="text-gray-500">
                            <p className="text-lg font-medium">Aucune cotisation trouvée</p>
                            <p className="text-sm mt-1">
                              {cotisationSearch || Object.values(cotisationFilters_).some(v => v)
                                ? 'Essayez de modifier vos critères de recherche ou filtres'
                                : 'Aucune cotisation enregistrée pour le moment'
                              }
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredCotisations.map((cotisation) => (
                      <tr key={cotisation.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {cotisation.member}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {cotisation.amount.toLocaleString()} FCFA
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(cotisation.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(cotisation.date).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {cotisation.type === 'worker' ? 'Travailleur' :
                           cotisation.type === 'student' ? 'Étudiant' :
                           cotisation.type === 'retired' ? 'Retraité' : 'Chômeur'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              icon={<Eye className="w-4 h-4" />}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              Voir
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              icon={<Edit className="w-4 h-4" />}
                              className="text-green-600 hover:text-green-700"
                            >
                              Modifier
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              icon={<Trash2 className="w-4 h-4" />}
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteClick(cotisation.id)}
                            >
                              Supprimer
                            </Button>
                          </div>
                        </td>
                      </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Version mobile */}
              <div className="lg:hidden space-y-4">
                {filteredCotisations.length === 0 ? (
                  <div className="bg-white shadow rounded-lg p-8 text-center">
                    <div className="text-gray-500">
                      <p className="text-lg font-medium">Aucune cotisation trouvée</p>
                      <p className="text-sm mt-1">
                        {cotisationSearch || Object.values(cotisationFilters_).some(v => v)
                          ? 'Essayez de modifier vos critères de recherche ou filtres'
                          : 'Aucune cotisation enregistrée pour le moment'
                        }
                      </p>
                    </div>
                  </div>
                ) : (
                  filteredCotisations.map((cotisation) => (
                  <div key={cotisation.id} className="bg-white shadow rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-medium text-gray-900">{cotisation.member}</h4>
                      {getStatusBadge(cotisation.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Montant:</span>
                        <p className="font-medium">{cotisation.amount.toLocaleString()} FCFA</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Date:</span>
                        <p className="font-medium">{new Date(cotisation.date).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Type:</span>
                        <p className="font-medium capitalize">
                          {cotisation.type === 'worker' ? 'Travailleur' :
                           cotisation.type === 'student' ? 'Étudiant' :
                           cotisation.type === 'retired' ? 'Retraité' : 'Chômeur'}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 mt-4 pt-3 border-t">
                      <Button
                        size="sm"
                        variant="outline"
                        icon={<Eye className="w-4 h-4" />}
                      >
                        Voir
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        icon={<Edit className="w-4 h-4" />}
                        className="text-green-600 border-green-300 hover:bg-green-50"
                      >
                        Modifier
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        icon={<Trash2 className="w-4 h-4" />}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                        onClick={() => handleDeleteClick(cotisation.id)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'expenses' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Historique des Dépenses</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approuvé par</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {expensesData.map((expense) => (
                      <tr key={expense.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {expense.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {expense.amount.toLocaleString()} FCFA
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getCategoryBadge(expense.category)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(expense.date).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {expense.status === 'approved' ? 'Approuvé' : 'En attente'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'agr' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Projets AGR (Activités Génératrices de Revenus)</h3>
                <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau projet
                </button>
              </div>

              {/* Statistiques AGR */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Building className="h-8 w-8 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-green-600">Projets actifs</p>
                      <p className="text-2xl font-bold text-green-900">
                        {agrProjects.filter(p => p.status === 'active').length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-blue-600">Investissement total</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {formatCurrency(agrProjects.reduce((sum, p) => sum + p.investment, 0))}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-purple-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-purple-600">Revenus générés</p>
                      <p className="text-2xl font-bold text-purple-900">
                        {formatCurrency(agrProjects.reduce((sum, p) => sum + p.revenue, 0))}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agrProjects.map((project) => (
                  <div key={project.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-gray-900">{project.name}</h4>
                      {getStatusBadge(project.status)}
                    </div>

                    <p className="text-sm text-gray-600 mb-4">{project.description}</p>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Date de début:</span>
                        <span className="text-sm font-medium">
                          {new Date(project.startDate).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Investissement:</span>
                        <span className="text-sm font-medium">{formatCurrency(project.investment)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Revenus:</span>
                        <span className="text-sm font-medium text-green-600">{formatCurrency(project.revenue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">ROI:</span>
                        <span className={`text-sm font-medium ${project.roi > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                          {project.roi}%
                        </span>
                      </div>

                      {/* Barre de progression ROI */}
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Progression</span>
                          <span>{project.roi}% ROI</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              project.roi > 25 ? 'bg-green-500' :
                              project.roi > 15 ? 'bg-yellow-500' :
                              project.roi > 0 ? 'bg-blue-500' : 'bg-gray-400'
                            }`}
                            style={{ width: `${Math.min(project.roi * 2, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <button className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        <Eye className="w-4 h-4 mr-1" />
                        Détails
                      </button>
                      <button className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        <Edit className="w-4 h-4 mr-1" />
                        Modifier
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de saisie de cotisation */}
      <Modal
        isOpen={showCotisationModal}
        onClose={() => setShowCotisationModal(false)}
        title="Saisir une cotisation"
        size="md"
        closeOnOverlayClick={!isSubmitting}
      >
        <form onSubmit={handleCotisationSubmit} className="p-6 space-y-4">
          <Input
            label="Nom du membre"
            type="text"
            required
            value={cotisationForm.memberName}
            onChange={(e) => handleInputChange('memberName', e.target.value)}
            error={formErrors.memberName}
            placeholder="Ex: Marie GHIEME"
            disabled={isSubmitting}
          />

          <Select
            label="Type de membre"
            required
            value={cotisationForm.type}
            onChange={(e) => handleTypeChange(e.target.value)}
            options={memberTypeOptions}
            disabled={isSubmitting}
          />

          <Input
            label="Montant (FCFA)"
            type="number"
            required
            value={cotisationForm.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
            error={formErrors.amount}
            min="0"
            disabled={isSubmitting}
          />

          <Input
            label="Date de paiement"
            type="date"
            required
            value={cotisationForm.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            error={formErrors.date}
            disabled={isSubmitting}
          />

          <Select
            label="Statut"
            required
            value={cotisationForm.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            options={statusOptions}
            disabled={isSubmitting}
          />

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCotisationModal(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="success"
              loading={isSubmitting}
              icon={<Plus className="w-4 h-4" />}
            >
              Enregistrer
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Supprimer la cotisation"
        message={`Êtes-vous sûr de vouloir supprimer cette cotisation ? Cette action est irréversible.`}
        type="danger"
        loading={isDeleting}
      />
    </div>
  );
};

export default Finances;