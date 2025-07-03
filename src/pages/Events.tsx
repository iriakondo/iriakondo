import React, { useState, useMemo } from 'react';
import { 
  Calendar, Plus, MapPin, Users, Clock, 
  Heart, Camera, Filter, Search, Edit, Trash2,
  Eye, MoreVertical, CalendarDays, Star, Share2, 
  Download, CheckCircle, XCircle, AlertCircle, Image
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Event } from '../types';
import { formatDate, formatDateTime, isFutureDate } from '../utils/dateUtils';
import { formatFullName } from '../utils/formatUtils';
import Avatar from '../components/common/Avatar';
import StatusBadge from '../components/common/StatusBadge';

interface EventFilters {
  search: string;
  type: string;
  status: string;
  organizer: string;
}

const Events: React.FC = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<EventFilters>({
    search: '',
    type: 'all',
    status: 'all',
    organizer: 'all'
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);

  // Données de démonstration étendues
  const mockEvents: Event[] = [
    {
      id: '1',
      title: 'Assemblée Générale Annuelle 2024',
      description: 'Assemblée générale annuelle de l\'association avec présentation du bilan financier et élection du nouveau bureau.',
      type: 'meeting',
      date: '2024-02-15',
      time: '14:00',
      location: 'Salle des Fêtes, Libreville',
      organizer: 'Marie GHIEME',
      participants: ['1', '2', '3', '4', '5'],
      photos: [
        'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
        'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg'
      ],
      likes: ['1', '2', '3'],
      expenses: [
        {
          id: '1',
          title: 'Location salle',
          amount: 50000,
          category: 'event',
          description: 'Location de la salle des fêtes',
          date: '2024-02-15',
          approvedBy: 'Marie GHIEME'
        }
      ],
      createdBy: '2',
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      title: 'Anniversaire Marie GHIEME',
      description: 'Célébration du 39ème anniversaire de Marie GHIEME avec toute la famille.',
      type: 'birthday',
      date: '2024-03-15',
      time: '18:00',
      location: 'Résidence GHIEME, Libreville',
      organizer: 'Paul GHIEME',
      participants: ['1', '2', '4', '6'],
      photos: [
        'https://images.pexels.com/photos/1729931/pexels-photo-1729931.jpeg',
        'https://images.pexels.com/photos/1857157/pexels-photo-1857157.jpeg'
      ],
      likes: ['1', '2', '4', '6'],
      expenses: [
        {
          id: '1',
          title: 'Gâteau et décoration',
          amount: 45000,
          category: 'event',
          description: 'Gâteau d\'anniversaire et décorations',
          date: '2024-03-15',
          approvedBy: 'Marie GHIEME'
        }
      ],
      createdBy: '4',
      createdAt: '2024-02-15T09:30:00Z'
    },
    {
      id: '3',
      title: 'Naissance de bébé NZAMBA',
      description: 'Célébration de la naissance du petit NZAMBA, nouveau membre de la famille.',
      type: 'birth',
      date: '2024-01-28',
      time: '16:00',
      location: 'Maternité Jeanne EBORI, Libreville',
      organizer: 'Sophie GHIEME',
      participants: ['2', '3', '5'],
      photos: [
        'https://images.pexels.com/photos/1257110/pexels-photo-1257110.jpeg'
      ],
      likes: ['1', '2', '3', '4', '5', '6'],
      expenses: [],
      createdBy: '5',
      createdAt: '2024-01-28T14:00:00Z'
    },
    {
      id: '4',
      title: 'Réunion Bureau Exécutif',
      description: 'Réunion mensuelle du bureau exécutif pour faire le point sur les activités en cours.',
      type: 'meeting',
      date: '2024-02-05',
      time: '19:00',
      location: 'Siège de l\'association',
      organizer: 'Super Administrateur',
      participants: ['1', '2'],
      photos: [],
      likes: ['1', '2'],
      expenses: [],
      createdBy: '1',
      createdAt: '2024-01-30T16:00:00Z'
    },
    {
      id: '5',
      title: 'Mariage de Jean GHIEME',
      description: 'Célébration du mariage de Jean GHIEME avec sa bien-aimée.',
      type: 'wedding',
      date: '2024-04-20',
      time: '10:00',
      location: 'Église Sainte-Marie, Libreville',
      organizer: 'Marie GHIEME',
      participants: ['1', '2', '3', '4', '5', '6'],
      photos: [],
      likes: [],
      expenses: [],
      createdBy: '2',
      createdAt: '2024-02-01T11:00:00Z'
    }
  ];

  const [events, setEvents] = useState(mockEvents);
  const [likedEvents, setLikedEvents] = useState<string[]>(['1', '2', '3']);

  // Logique de filtrage améliorée
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = 
        event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        event.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        event.location.toLowerCase().includes(filters.search.toLowerCase()) ||
        event.organizer.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesType = filters.type === 'all' || event.type === filters.type;
      
      const eventDate = new Date(event.date);
      const now = new Date();
      const isUpcoming = eventDate > now;
      const isPast = eventDate < now;
      
      let matchesStatus = true;
      if (filters.status === 'upcoming') matchesStatus = isUpcoming;
      else if (filters.status === 'past') matchesStatus = isPast;
      else if (filters.status === 'today') {
        const today = new Date();
        matchesStatus = eventDate.toDateString() === today.toDateString();
      }
      
      const matchesOrganizer = filters.organizer === 'all' || event.organizer === filters.organizer;
      
      return matchesSearch && matchesType && matchesStatus && matchesOrganizer;
    });
  }, [events, filters]);

  // Statistiques des événements
  const eventStats = useMemo(() => {
    const total = events.length;
    const upcoming = events.filter(e => new Date(e.date) > new Date()).length;
    const thisMonth = events.filter(e => {
      const eventDate = new Date(e.date);
      const now = new Date();
      return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
    }).length;
    const totalParticipants = events.reduce((sum, e) => sum + e.participants.length, 0);
    
    return { total, upcoming, thisMonth, totalParticipants };
  }, [events]);

  const getEventTypeLabel = (type: string) => {
    const types = {
      birthday: 'Anniversaire',
      meeting: 'Réunion',
      birth: 'Naissance',
      wedding: 'Mariage',
      funeral: 'Funérailles',
      other: 'Autre'
    };
    return types[type as keyof typeof types] || type;
  };

  const getEventTypeColor = (type: string) => {
    const colors = {
      birthday: 'bg-pink-100 text-pink-800',
      meeting: 'bg-blue-100 text-blue-800',
      birth: 'bg-green-100 text-green-800',
      wedding: 'bg-purple-100 text-purple-800',
      funeral: 'bg-gray-100 text-gray-800',
      other: 'bg-yellow-100 text-yellow-800'
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  const getEventStatus = (eventDate: string) => {
    const date = new Date(eventDate);
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDay = new Date(date);
    eventDay.setHours(0, 0, 0, 0);
    
    if (eventDay.getTime() === today.getTime()) return 'ongoing';
    if (date > now) return 'upcoming';
    return 'completed';
  };

  const handleLike = (eventId: string) => {
    setLikedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const canManageEvents = user?.role === 'super_admin' || user?.role === 'admin';

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Événements</h1>
          <p className="text-gray-600">Calendrier des événements familiaux MOUKONA GHIEME</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4" />
            <span>Exporter</span>
          </button>
          {canManageEvents && (
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Créer événement</span>
            </button>
          )}
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Événements</p>
              <p className="text-2xl font-bold text-gray-900">{eventStats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CalendarDays className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">À venir</p>
              <p className="text-2xl font-bold text-gray-900">{eventStats.upcoming}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ce mois</p>
              <p className="text-2xl font-bold text-gray-900">{eventStats.thisMonth}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Participants</p>
              <p className="text-2xl font-bold text-gray-900">{eventStats.totalParticipants}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
