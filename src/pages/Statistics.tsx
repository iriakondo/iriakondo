import React, { useState } from 'react';
import { 
  BarChart3, Users, Calendar, DollarSign, 
  TrendingUp, TrendingDown, Activity, Eye,
  Download, Filter, RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Statistics: React.FC = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedYear, setSelectedYear] = useState('2024');

  // Données de démonstration pour les statistiques
  const membershipStats = {
    total: 127,
    active: 89,
    pending: 12,
    inactive: 26,
    newThisMonth: 8,
    growthRate: 12.5
  };

  const financialStats = {
    totalCotisations: 1250000,
    totalExpenses: 850000,
    balance: 400000,
    monthlyAverage: 104167,
    collectionRate: 89.2
  };

  const eventStats = {
    totalEvents: 24,
    eventsThisMonth: 3,
    averageParticipation: 32,
    mostPopularType: 'Anniversaires',
    participationRate: 67.8
  };

  const activityStats = {
    totalLogins: 1456,
    activeUsers: 78,
    messagesExchanged: 342,
    photosUploaded: 156,
    likesGiven: 892
  };

  // Données pour les graphiques (simulation)
  const monthlyMembership = [
    { month: 'Jan', active: 82, pending: 8, new: 5 },
    { month: 'Fév', active: 85, pending: 10, new: 7 },
    { month: 'Mar', active: 87, pending: 9, new: 4 },
    { month: 'Avr', active: 89, pending: 12, new: 8 },
  ];

  const monthlyFinances = [
    { month: 'Jan', cotisations: 980000, expenses: 650000 },
    { month: 'Fév', cotisations: 1050000, expenses: 720000 },
    { month: 'Mar', cotisations: 1150000, expenses: 800000 },
    { month: 'Avr', cotisations: 1250000, expenses: 850000 },
  ];

  const eventParticipation = [
    { type: 'Anniversaires', count: 8, avgParticipants: 28 },
    { type: 'Réunions', count: 6, avgParticipants: 45 },
    { type: 'Naissances', count: 4, avgParticipants: 15 },
    { type: 'Mariages', count: 3, avgParticipants: 67 },
    { type: 'Autres', count: 3, avgParticipants: 22 },
  ];

  const membersByGeneration = [
    { generation: '1ère génération', count: 8, percentage: 6.3 },
    { generation: '2ème génération', count: 24, percentage: 18.9 },
    { generation: '3ème génération', count: 45, percentage: 35.4 },
    { generation: '4ème génération', count: 38, percentage: 29.9 },
    { generation: '5ème génération', count: 12, percentage: 9.4 },
  ];

  const cotisationsByType = [
    { type: 'Travailleurs', count: 67, amount: 670000, percentage: 53.6 },
    { type: 'Retraités', count: 23, amount: 115000, percentage: 9.2 },
    { type: 'Chômeurs', count: 18, amount: 54000, percentage: 4.3 },
    { type: 'Étudiants', count: 19, amount: 19000, percentage: 1.5 },
  ];

  if (user?.role === 'member') {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="h-8 w-8 text-gray-400" />
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
          <h1 className="text-2xl font-bold text-gray-900">Statistiques</h1>
          <p className="text-gray-600">Analyse des données de l'association</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </button>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Membres Actifs</p>
              <p className="text-2xl font-bold text-gray-900">{membershipStats.active}</p>
              <p className="text-sm text-green-600 mt-1">
                +{membershipStats.newThisMonth} ce mois
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Solde Actuel</p>
              <p className="text-2xl font-bold text-gray-900">
                {financialStats.balance.toLocaleString()} FCFA
              </p>
              <p className="text-sm text-green-600 mt-1">
                +{financialStats.growthRate}% ce mois
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Événements</p>
              <p className="text-2xl font-bold text-gray-900">{eventStats.totalEvents}</p>
              <p className="text-sm text-blue-600 mt-1">
                {eventStats.eventsThisMonth} ce mois
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taux Participation</p>
              <p className="text-2xl font-bold text-gray-900">{eventStats.participationRate}%</p>
              <p className="text-sm text-green-600 mt-1">
                +2.3% ce mois
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution des membres */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Évolution des Membres</h3>
            <RefreshCw className="w-4 h-4 text-gray-400" />
          </div>
          <div className="space-y-4">
            {monthlyMembership.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">{data.month}</span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Actifs: {data.active}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">En attente: {data.pending}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Nouveaux: {data.new}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Répartition par génération */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par Génération</h3>
          <div className="space-y-4">
            {membersByGeneration.map((gen, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">{gen.generation}</span>
                  <span className="text-sm text-gray-900">{gen.count} membres ({gen.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${gen.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Participation aux événements */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Participation aux Événements</h3>
          <div className="space-y-4">
            {eventParticipation.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{event.type}</p>
                  <p className="text-sm text-gray-600">{event.count} événements</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{event.avgParticipants}</p>
                  <p className="text-sm text-gray-600">participants moy.</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cotisations par type */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cotisations par Type de Membre</h3>
          <div className="space-y-4">
            {cotisationsByType.map((type, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">{type.type}</span>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{type.count} membres</p>
                    <p className="text-xs text-gray-600">{type.amount.toLocaleString()} FCFA</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${type.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activité récente */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité de l'Application</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{activityStats.totalLogins}</p>
            <p className="text-sm text-gray-600">Connexions totales</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{activityStats.activeUsers}</p>
            <p className="text-sm text-gray-600">Utilisateurs actifs</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{activityStats.messagesExchanged}</p>
            <p className="text-sm text-gray-600">Messages échangés</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Eye className="h-6 w-6 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{activityStats.photosUploaded}</p>
            <p className="text-sm text-gray-600">Photos partagées</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="h-6 w-6 text-pink-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{activityStats.likesGiven}</p>
            <p className="text-sm text-gray-600">Likes donnés</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;