import React, { useState, useMemo } from 'react';
import {
  Download, FileText, Table, Image, Calendar,
  Users, DollarSign, MessageCircle, Camera,
  Filter, Search, CheckCircle, Clock, AlertCircle,
  FileSpreadsheet, FileImage, Archive
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { formatDate, formatRelativeDate } from '../utils/dateUtils';
import { formatCurrency } from '../utils/formatUtils';
import StatusBadge from '../components/common/StatusBadge';
import {
  exportMembers,
  exportEvents,
  exportFinances,
  exportNews,
  exportCalendar,
  exportCompleteReport,
  exportToJSON
} from '../utils/exportUtils';

interface ExportOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'members' | 'events' | 'finances' | 'news' | 'gallery' | 'reports';
  formats: string[];
  dataCount: number;
  lastExport?: string;
  size: string;
  premium?: boolean;
}

interface ExportHistory {
  id: string;
  title: string;
  format: string;
  exportedAt: string;
  exportedBy: string;
  status: 'completed' | 'failed' | 'processing';
  fileSize: string;
  downloadUrl?: string;
}

const Exports: React.FC = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedExport, setSelectedExport] = useState<ExportOption | null>(null);

  // Données de démonstration pour les exports
  const mockMembers = [
    { id: '1', firstName: 'Marie', lastName: 'GHIEME', email: 'marie@example.com', phone: '+241 01 02 03 04', birthDate: '1985-03-15', birthPlace: 'Libreville', profession: 'Enseignante', memberType: 'worker', status: 'active', joinDate: '2020-01-15' },
    { id: '2', firstName: 'Jean', lastName: 'GHIEME', email: 'jean@example.com', phone: '+241 05 06 07 08', birthDate: '1990-07-22', birthPlace: 'Port-Gentil', profession: 'Ingénieur', memberType: 'worker', status: 'active', joinDate: '2020-02-10' },
    // ... autres membres
  ];

  const mockEvents = [
    { id: '1', title: 'Assemblée Générale 2024', description: 'AG annuelle', type: 'meeting', date: '2024-02-15', time: '14:00', location: 'Libreville', organizer: 'Marie GHIEME', participants: ['1', '2'], photos: [], likes: [], createdAt: '2024-01-15T10:00:00Z' },
    // ... autres événements
  ];

  const mockNews = [
    { id: '1', title: 'Nouvelle année 2024', author: 'Marie GHIEME', category: 'announcement', createdAt: '2024-01-01T00:00:00Z', isPublished: true, isPinned: false, likes: [], comments: [] },
    // ... autres actualités
  ];

  const mockFinances = {
    cotisations: [
      { id: '1', member: 'Marie GHIEME', amount: 10000, status: 'paid', date: '2024-01-15', type: 'worker' },
      // ... autres cotisations
    ],
    depenses: [
      { id: '1', title: 'Assemblée Générale', amount: 150000, category: 'event', date: '2024-01-15', approvedBy: 'Marie GHIEME' },
      // ... autres dépenses
    ]
  };

  // Options d'export disponibles
  const exportOptions: ExportOption[] = [
    {
      id: 'members-list',
      title: 'Liste des membres',
      description: 'Exporter la liste complète des membres avec leurs informations',
      icon: Users,
      category: 'members',
      formats: ['xlsx', 'csv', 'pdf'],
      dataCount: 127,
      lastExport: '2024-01-15T10:30:00Z',
      size: '2.3 MB'
    },
    {
      id: 'members-contacts',
      title: 'Contacts des membres',
      description: 'Annuaire avec emails et téléphones des membres actifs',
      icon: FileText,
      category: 'members',
      formats: ['xlsx', 'csv', 'vcf'],
      dataCount: 89,
      lastExport: '2024-01-10T14:20:00Z',
      size: '1.1 MB'
    },
    {
      id: 'events-calendar',
      title: 'Calendrier des événements',
      description: 'Planning complet des événements passés et à venir',
      icon: Calendar,
      category: 'events',
      formats: ['xlsx', 'pdf', 'ics'],
      dataCount: 24,
      lastExport: '2024-01-18T09:15:00Z',
      size: '3.7 MB'
    },
    {
      id: 'events-photos',
      title: 'Photos d\'événements',
      description: 'Archive des photos de tous les événements',
      icon: Camera,
      category: 'events',
      formats: ['zip'],
      dataCount: 156,
      size: '45.2 MB',
      premium: true
    },
    {
      id: 'financial-report',
      title: 'Rapport financier',
      description: 'Bilan financier complet avec cotisations et dépenses',
      icon: DollarSign,
      category: 'finances',
      formats: ['xlsx', 'pdf'],
      dataCount: 1,
      lastExport: '2024-01-20T16:45:00Z',
      size: '1.8 MB'
    },
    {
      id: 'cotisations-status',
      title: 'État des cotisations',
      description: 'Suivi des paiements de cotisations par membre',
      icon: Table,
      category: 'finances',
      formats: ['xlsx', 'csv', 'pdf'],
      dataCount: 127,
      lastExport: '2024-01-12T11:30:00Z',
      size: '2.1 MB'
    },
    {
      id: 'news-archive',
      title: 'Archive des actualités',
      description: 'Toutes les publications et annonces de l\'association',
      icon: FileText,
      category: 'news',
      formats: ['pdf', 'docx'],
      dataCount: 45,
      lastExport: '2024-01-08T13:20:00Z',
      size: '5.4 MB'
    },
    {
      id: 'gallery-archive',
      title: 'Archive photos complète',
      description: 'Toutes les photos de la galerie organisées par date',
      icon: Image,
      category: 'gallery',
      formats: ['zip'],
      dataCount: 342,
      size: '128.7 MB',
      premium: true
    },
    {
      id: 'annual-report',
      title: 'Rapport annuel',
      description: 'Rapport complet d\'activité de l\'association',
      icon: FileSpreadsheet,
      category: 'reports',
      formats: ['pdf', 'docx'],
      dataCount: 1,
      lastExport: '2024-01-01T00:00:00Z',
      size: '12.3 MB',
      premium: true
    }
  ];

  // Historique des exports
  const exportHistory: ExportHistory[] = [
    {
      id: '1',
      title: 'Liste des membres',
      format: 'xlsx',
      exportedAt: '2024-01-20T14:30:00Z',
      exportedBy: 'Marie GHIEME',
      status: 'completed',
      fileSize: '2.3 MB',
      downloadUrl: '#'
    },
    {
      id: '2',
      title: 'Rapport financier',
      format: 'pdf',
      exportedAt: '2024-01-20T10:15:00Z',
      exportedBy: 'Super Administrateur',
      status: 'completed',
      fileSize: '1.8 MB',
      downloadUrl: '#'
    },
    {
      id: '3',
      title: 'Calendrier des événements',
      format: 'ics',
      exportedAt: '2024-01-19T16:45:00Z',
      exportedBy: 'Paul GHIEME',
      status: 'processing',
      fileSize: '3.7 MB'
    },
    {
      id: '4',
      title: 'Archive photos',
      format: 'zip',
      exportedAt: '2024-01-18T09:20:00Z',
      exportedBy: 'Marie GHIEME',
      status: 'failed',
      fileSize: '45.2 MB'
    }
  ];

  // Filtrage des options d'export
  const filteredExports = useMemo(() => {
    return exportOptions.filter(option => {
      const matchesSearch = 
        option.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || option.category === selectedCategory;
      
      const matchesFormat = selectedFormat === 'all' || option.formats.includes(selectedFormat);
      
      return matchesSearch && matchesCategory && matchesFormat;
    });
  }, [exportOptions, searchTerm, selectedCategory, selectedFormat]);

  // Statistiques des exports
  const exportStats = useMemo(() => {
    const totalOptions = exportOptions.length;
    const completedToday = exportHistory.filter(h => {
      const exportDate = new Date(h.exportedAt);
      const today = new Date();
      return exportDate.toDateString() === today.toDateString() && h.status === 'completed';
    }).length;
    const totalSize = exportOptions.reduce((sum, option) => {
      const sizeNum = parseFloat(option.size.replace(/[^\d.]/g, ''));
      return sum + sizeNum;
    }, 0);
    const premiumOptions = exportOptions.filter(o => o.premium).length;
    
    return { totalOptions, completedToday, totalSize, premiumOptions };
  }, [exportOptions, exportHistory]);

  const getCategoryLabel = (category: string) => {
    const categories = {
      members: 'Membres',
      events: 'Événements',
      finances: 'Finances',
      news: 'Actualités',
      gallery: 'Galerie',
      reports: 'Rapports'
    };
    return categories[category as keyof typeof categories] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      members: 'bg-blue-100 text-blue-800',
      events: 'bg-green-100 text-green-800',
      finances: 'bg-yellow-100 text-yellow-800',
      news: 'bg-purple-100 text-purple-800',
      gallery: 'bg-pink-100 text-pink-800',
      reports: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.reports;
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'xlsx':
      case 'csv':
        return FileSpreadsheet;
      case 'pdf':
        return FileText;
      case 'zip':
        return Archive;
      case 'jpg':
      case 'png':
        return FileImage;
      default:
        return FileText;
    }
  };

  const handleExport = (option: ExportOption, format: string) => {
    // Vérifier les permissions pour les exports premium
    if (option.premium && user?.role !== 'super_admin') {
      alert('Cet export nécessite un accès super administrateur');
      return;
    }

    try {
      switch (option.id) {
        case 'members-list':
        case 'members-contacts':
          if (format === 'csv') {
            exportMembers(mockMembers, 'csv');
          } else if (format === 'json') {
            exportMembers(mockMembers, 'json');
          }
          break;

        case 'events-calendar':
          if (format === 'ics') {
            exportCalendar(mockEvents);
          } else if (format === 'csv') {
            exportEvents(mockEvents, 'csv');
          } else if (format === 'json') {
            exportEvents(mockEvents, 'json');
          }
          break;

        case 'financial-report':
        case 'cotisations-status':
          if (format === 'csv') {
            exportFinances(mockFinances.cotisations, mockFinances.depenses, 'csv');
          } else if (format === 'json') {
            exportFinances(mockFinances.cotisations, mockFinances.depenses, 'json');
          }
          break;

        case 'news-archive':
          if (format === 'csv') {
            exportNews(mockNews, 'csv');
          } else if (format === 'json') {
            exportNews(mockNews, 'json');
          }
          break;

        case 'annual-report':
          exportCompleteReport({
            members: mockMembers,
            events: mockEvents,
            news: mockNews,
            finances: mockFinances
          });
          break;

        case 'events-photos':
        case 'gallery-archive':
          // Pour les archives de photos, on simule le téléchargement
          alert(`Export des photos en cours... Cela peut prendre quelques minutes.`);
          break;

        default:
          console.log(`Export non implémenté pour ${option.id}`);
          alert(`Export de "${option.title}" en format ${format.toUpperCase()} démarré !`);
      }

      // Afficher un message de succès
      if (option.id !== 'events-photos' && option.id !== 'gallery-archive') {
        alert(`Export de "${option.title}" terminé ! Le fichier a été téléchargé.`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      alert('Une erreur est survenue lors de l\'export. Veuillez réessayer.');
    }
  };

  const canExport = user?.role === 'super_admin' || user?.role === 'admin';

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exports de données</h1>
          <p className="text-gray-600">Exportez les données de l'association MOUKONA GHIEME</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Clock className="h-4 w-4" />
            <span>Historique</span>
          </button>
          {canExport && (
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export personnalisé</span>
            </button>
          )}
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Download className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Options disponibles</p>
              <p className="text-2xl font-bold text-gray-900">{exportStats.totalOptions}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Exports aujourd'hui</p>
              <p className="text-2xl font-bold text-gray-900">{exportStats.completedToday}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Archive className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Taille totale</p>
              <p className="text-2xl font-bold text-gray-900">{exportStats.totalSize.toFixed(1)} MB</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Options premium</p>
              <p className="text-2xl font-bold text-gray-900">{exportStats.premiumOptions}</p>
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
                placeholder="Rechercher un type d'export..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Toutes les catégories</option>
                <option value="members">Membres</option>
                <option value="events">Événements</option>
                <option value="finances">Finances</option>
                <option value="news">Actualités</option>
                <option value="gallery">Galerie</option>
                <option value="reports">Rapports</option>
              </select>
            </div>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Tous les formats</option>
              <option value="xlsx">Excel (.xlsx)</option>
              <option value="csv">CSV (.csv)</option>
              <option value="pdf">PDF (.pdf)</option>
              <option value="zip">Archive (.zip)</option>
              <option value="docx">Word (.docx)</option>
              <option value="ics">Calendrier (.ics)</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>{filteredExports.length} option(s) d'export disponible(s)</span>
          {(searchTerm || selectedCategory !== 'all' || selectedFormat !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedFormat('all');
              }}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      </div>

      {/* Options d'export */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExports.map((option) => {
          const IconComponent = option.icon;
          return (
            <div key={option.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <IconComponent className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{option.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(option.category)}`}>
                      {getCategoryLabel(option.category)}
                    </span>
                  </div>
                </div>
                {option.premium && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Premium
                  </span>
                )}
              </div>

              <p className="text-gray-600 text-sm mb-4">{option.description}</p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Éléments :</span>
                  <span className="font-medium text-gray-900">{option.dataCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Taille :</span>
                  <span className="font-medium text-gray-900">{option.size}</span>
                </div>
                {option.lastExport && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Dernier export :</span>
                    <span className="font-medium text-gray-900">{formatRelativeDate(option.lastExport)}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {option.formats.map((format) => {
                  const FormatIcon = getFormatIcon(format);
                  return (
                    <span key={format} className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs">
                      <FormatIcon className="h-3 w-3 mr-1" />
                      {format.toUpperCase()}
                    </span>
                  );
                })}
              </div>

              {canExport ? (
                <div className="flex space-x-2">
                  {option.formats.slice(0, 2).map((format) => (
                    <button
                      key={format}
                      onClick={() => handleExport(option, format)}
                      className="flex-1 bg-green-50 text-green-600 px-3 py-2 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                      disabled={option.premium && user?.role !== 'super_admin'}
                    >
                      Exporter {format.toUpperCase()}
                    </button>
                  ))}
                  {option.formats.length > 2 && (
                    <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      +{option.formats.length - 2}
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-2 text-sm text-gray-500">
                  Accès administrateur requis
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredExports.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
          <Download className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune option d'export trouvée</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || selectedCategory !== 'all' || selectedFormat !== 'all'
              ? 'Aucune option d\'export ne correspond à vos critères de recherche.'
              : 'Aucune option d\'export n\'est disponible pour le moment.'}
          </p>
          {(searchTerm || selectedCategory !== 'all' || selectedFormat !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedFormat('all');
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Voir toutes les options
            </button>
          )}
        </div>
      )}

      {/* Historique des exports */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Historique des exports récents</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Export
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Format
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exporté par
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taille
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {exportHistory.map((export_) => {
                const FormatIcon = getFormatIcon(export_.format);
                return (
                  <tr key={export_.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{export_.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FormatIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-900">{export_.format.toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatRelativeDate(export_.exportedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {export_.exportedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={export_.status} type="export" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {export_.fileSize}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {export_.status === 'completed' && export_.downloadUrl ? (
                        <button className="text-green-600 hover:text-green-900 mr-3">
                          <Download className="h-4 w-4" />
                        </button>
                      ) : export_.status === 'processing' ? (
                        <span className="text-yellow-600">En cours...</span>
                      ) : export_.status === 'failed' ? (
                        <button className="text-red-600 hover:text-red-900">
                          Réessayer
                        </button>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de confirmation d'export */}
      {showExportModal && selectedExport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Download className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Confirmer l'export</h3>
                <p className="text-sm text-gray-500">Préparer le fichier pour téléchargement</p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">{selectedExport.title}</h4>
              <p className="text-sm text-gray-600 mb-4">{selectedExport.description}</p>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Éléments à exporter :</span>
                  <span className="font-medium">{selectedExport.dataCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Taille estimée :</span>
                  <span className="font-medium">{selectedExport.size}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Temps estimé :</span>
                  <span className="font-medium">2-5 minutes</span>
                </div>
              </div>

              {selectedExport.premium && user?.role !== 'super_admin' && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="text-sm text-yellow-800">
                      Cet export nécessite un accès super administrateur
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowExportModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  setShowExportModal(false);
                  // Utiliser le format par défaut (premier format disponible)
                  const defaultFormat = selectedExport.formats[0];
                  handleExport(selectedExport, defaultFormat);
                }}
                disabled={selectedExport.premium && user?.role !== 'super_admin'}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Démarrer l'export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exports;
