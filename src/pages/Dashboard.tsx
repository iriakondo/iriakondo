import React, { useState, useEffect } from 'react';
import {
  Users, Calendar, DollarSign, TrendingUp,
  Bell, MessageCircle, Camera, FileText,
  ArrowUp, ArrowDown, Eye, Heart, Plus,
  Clock, MapPin, User, ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { formatDate, formatRelativeDate } from '../utils/dateUtils';
import { formatCurrency } from '../utils/formatUtils';
import Avatar from '../components/common/Avatar';
import StatusBadge from '../components/common/StatusBadge';

interface DashboardStats {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
  description?: string;
}

interface RecentActivity {
  id: string;
  type: 'login' | 'event' | 'payment' | 'message' | 'photo';
  title: string;
  description: string;
  user: string;
  timestamp: string;
  avatar?: string;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  action: () => void;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const stats: DashboardStats[] = [
    {
      title: 'Membres Actifs',
      value: '127',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-blue-500',
      description: '89% du total des membres'
    },
    {
      title: 'Événements ce mois',
      value: '8',
      change: '+3',
      changeType: 'positive',
      icon: Calendar,
      color: 'bg-green-500',
      description: '3 événements à venir'
    },
    {
      title: 'Cotisations collectées',
      value: formatCurrency(1250000),
      change: '+8.2%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-yellow-500',
      description: 'Ce mois-ci'
    },
    {
      title: 'Taux de participation',
      value: '89%',
      change: '+5%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'bg-purple-500',
      description: 'Aux événements récents'
    }
  ];

  const recentEvents = [
    {
      id: '1',
      title: 'Assemblée Générale Annuelle',
      date: '2024-02-15',
      time: '14:00',
      location: 'Salle des Fêtes, Libreville',
      type: 'meeting',
      participants: 45,
      status: 'upcoming',
      organizer: 'Marie GHIEME'
    },
    {
      id: '2',
      title: 'Anniversaire Marie GHIEME',
      date: '2024-03-15',
      time: '18:00',
      location: 'Résidence GHIEME',
      type: 'birthday',
      participants: 23,
      status: 'upcoming',
      organizer: 'Paul GHIEME'
    },
    {
      id: '3',
      title: 'Réunion Bureau Exécutif',
      date: '2024-01-25',
      time: '10:00',
      location: 'Bureau Association',
      type: 'meeting',
      participants: 11,
      status: 'completed',
      organizer: 'Super Admin'
    }
  ];

  const recentNews = [
    {
      id: '1',
      title: 'Nouveau projet AGR approuvé',
      excerpt: 'Le projet de coopérative agricole a été validé par l\'assemblée générale. Les travaux commenceront dès le mois prochain.',
      author: 'Marie GHIEME',
      date: '2024-01-18',
      likes: 12,
      comments: 5
    },
    {
      id: '2',
      title: 'Rappel cotisations janvier',
      excerpt: 'Les cotisations du mois de janvier sont à régler avant le 31. Merci de vous rapprocher du trésorier.',
      author: 'Trésorier',
      date: '2024-01-16',
      likes: 8,
      comments: 2
    },
    {
      id: '3',
      title: 'Nouvelle galerie photos disponible',
      excerpt: 'Les photos de l\'assemblée générale sont maintenant disponibles dans la galerie.',
      author: 'Jean GHIEME',
      date: '2024-01-14',
      likes: 15,
      comments: 8
    }
  ];

  const recentActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'login',
      title: 'Nouvelle connexion',
      description: 'Jean GHIEME s\'est connecté',
      user: 'Jean GHIEME',
      timestamp: '2024-01-20T14:30:00Z'
    },
    {
      id: '2',
      type: 'payment',
      title: 'Cotisation payée',
      description: 'Marie GHIEME a payé sa cotisation de janvier',
      user: 'Marie GHIEME',
      timestamp: '2024-01-20T10:15:00Z'
    },
    {
      id: '3',
      type: 'photo',
      title: 'Photos ajoutées',
      description: '5 nouvelles photos dans la galerie',
      user: 'Paul GHIEME',
      timestamp: '2024-01-19T16:45:00Z'
    },
    {
      id: '4',
      type: 'event',
      title: 'Événement créé',
      description: 'Assemblée Générale Annuelle programmée',
      user: 'Super Admin',
      timestamp: '2024-01-19T09:00:00Z'
    }
  ];

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Ajouter un membre',
      description: 'Enregistrer un nouveau membre',
      icon: Users,
      color: 'bg-blue-500',
      action: () => console.log('Add member')
    },
    {
      id: '2',
      title: 'Créer un événement',
      description: 'Organiser un nouvel événement',
      icon: Calendar,
      color: 'bg-green-500',
      action: () => console.log('Create event')
    },
    {
      id: '3',
      title: 'Publier une actualité',
      description: 'Partager une information',
      icon: FileText,
      color: 'bg-purple-500',
      action: () => console.log('Create news')
    },
    {
      id: '4',
      title: 'Ajouter des photos',
      description: 'Enrichir la galerie',
      icon: Camera,
      color: 'bg-pink-500',
      action: () => console.log('Add photos')
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login': return User;
      case 'payment': return DollarSign;
      case 'photo': return Camera;
      case 'event': return Calendar;
      case 'message': return MessageCircle;
      default: return Bell;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'login': return 'bg-blue-100 text-blue-600';
      case 'payment': return 'bg-green-100 text-green-600';
      case 'photo': return 'bg-purple-100 text-purple-600';
      case 'event': return 'bg-yellow-100 text-yellow-600';
      case 'message': return 'bg-pink-100 text-pink-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête de bienvenue */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">
              Bienvenue, {user?.firstName} {user?.lastName} !
            </h1>
            <p className="text-green-100 mb-4">
              Voici un aperçu de l'activité de l'association MOUKONA GHIEME
            </p>
            <div className="flex items-center space-x-4 text-sm text-green-100">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{formatDate(currentTime, 'EEEE dd MMMM yyyy')}</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>
                  {user?.role === 'super_admin' ? 'Super Administrateur' :
                   user?.role === 'admin' ? 'Administrateur' : 'Membre'}
                </span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/20 flex items-center justify-center">
              <img
                src="/Whisk_storyboard5cbcf8599218412b988bad87.png"
                alt="Logo MOUKONA GHIEME"
                className="w-16 h-16 object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      {(user?.role === 'super_admin' || user?.role === 'admin') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <div className={`flex items-center text-sm ${
                      stat.changeType === 'positive' ? 'text-green-600' :
                      stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {stat.changeType === 'positive' ? (
                        <ArrowUp className="h-4 w-4 mr-1" />
                      ) : stat.changeType === 'negative' ? (
                        <ArrowDown className="h-4 w-4 mr-1" />
                      ) : null}
                      <span>{stat.change}</span>
                    </div>
                  </div>
                  {stat.description && (
                    <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                  )}
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions rapides */}
      {(user?.role === 'super_admin' || user?.role === 'admin') && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={action.action}
                className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all text-left group"
              >
                <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Événements récents */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Événements récents</h2>
            <button className="text-green-600 hover:text-green-700 text-sm font-medium">
              Voir tout
            </button>
          </div>
          <div className="space-y-4">
            {recentEvents.slice(0, 3).map((event) => (
              <div key={event.id} className="p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    event.status === 'upcoming' ? 'bg-blue-100' :
                    event.status === 'ongoing' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <Calendar className={`h-5 w-5 ${
                      event.status === 'upcoming' ? 'text-blue-600' :
                      event.status === 'ongoing' ? 'text-green-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{event.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{formatDate(event.date)} à {event.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <StatusBadge status={event.status} type="event" />
                      <span className="text-xs text-gray-500">{event.participants} participants</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actualités récentes */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Actualités</h2>
            <button className="text-green-600 hover:text-green-700 text-sm font-medium">
              Voir tout
            </button>
          </div>
          <div className="space-y-4">
            {recentNews.slice(0, 3).map((news) => (
              <div key={news.id} className="p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{news.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{news.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-gray-500">
                    <Avatar firstName={news.author.split(' ')[0]} lastName={news.author.split(' ')[1]} size="sm" className="mr-2" />
                    <span>{news.author}</span>
                    <span className="mx-1">•</span>
                    <span>{formatRelativeDate(news.date)}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Heart className="h-3 w-3 mr-1" />
                      <span>{news.likes}</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      <span>{news.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activités récentes */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Activités récentes</h2>
            <button className="text-green-600 hover:text-green-700 text-sm font-medium">
              Voir tout
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.slice(0, 4).map((activity) => {
              const ActivityIcon = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                    <ActivityIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatRelativeDate(activity.timestamp)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>


    </div>
  );
};

export default Dashboard;