import React, { useState, useMemo } from 'react';
import {
  Camera, Plus, Search, Filter, Heart,
  Download, Share2, Eye, Calendar, User,
  Grid3X3, List, Upload, Edit, Trash2, MoreVertical, Image
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { formatDate, formatRelativeDate } from '../utils/dateUtils';
import { formatFullName } from '../utils/formatUtils';
import Avatar from '../components/common/Avatar';

interface Photo {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl: string;
  uploadedBy: string;
  uploadedById: string;
  uploadedAt: string;
  eventId?: string;
  eventTitle?: string;
  category: 'event' | 'family' | 'agr' | 'meeting' | 'other';
  tags: string[];
  likes: string[];
  views: number;
  isPublic: boolean;
}

interface Album {
  id: string;
  title: string;
  description: string;
  coverPhoto: string;
  photoCount: number;
  createdBy: string;
  createdAt: string;
  isPublic: boolean;
}

const Gallery: React.FC = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'photos' | 'albums'>('photos');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Données de démonstration
  const mockPhotos: Photo[] = [
    {
      id: '1',
      title: 'Assemblée Générale 2024',
      description: 'Photo de groupe lors de l\'assemblée générale annuelle',
      url: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
      thumbnailUrl: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?w=300&h=200&fit=crop',
      uploadedBy: 'Marie GHIEME',
      uploadedById: '2',
      uploadedAt: '2024-01-16T10:00:00Z',
      eventId: '1',
      eventTitle: 'Assemblée Générale Annuelle 2024',
      category: 'meeting',
      tags: ['assemblée', 'réunion', '2024', 'famille'],
      likes: ['1', '3', '4', '5'],
      views: 45,
      isPublic: true
    },
    {
      id: '2',
      title: 'Célébration anniversaire Marie',
      description: 'Moments joyeux de l\'anniversaire de Marie GHIEME',
      url: 'https://images.pexels.com/photos/1729931/pexels-photo-1729931.jpeg',
      thumbnailUrl: 'https://images.pexels.com/photos/1729931/pexels-photo-1729931.jpeg?w=300&h=200&fit=crop',
      uploadedBy: 'Paul GHIEME',
      uploadedById: '4',
      uploadedAt: '2024-03-16T14:30:00Z',
      eventId: '2',
      eventTitle: 'Anniversaire Marie GHIEME',
      category: 'event',
      tags: ['anniversaire', 'marie', 'fête', 'famille'],
      likes: ['1', '2', '3', '6'],
      views: 32,
      isPublic: true
    },
    {
      id: '3',
      title: 'Naissance bébé NZAMBA',
      description: 'Première photo du nouveau membre de la famille',
      url: 'https://images.pexels.com/photos/1257110/pexels-photo-1257110.jpeg',
      thumbnailUrl: 'https://images.pexels.com/photos/1257110/pexels-photo-1257110.jpeg?w=300&h=200&fit=crop',
      uploadedBy: 'Sophie GHIEME',
      uploadedById: '5',
      uploadedAt: '2024-01-29T16:00:00Z',
      eventId: '3',
      eventTitle: 'Naissance de bébé NZAMBA',
      category: 'family',
      tags: ['naissance', 'bébé', 'famille', 'nzamba'],
      likes: ['1', '2', '3', '4', '5', '6'],
      views: 67,
      isPublic: true
    },
    {
      id: '4',
      title: 'Projet AGR - Coopérative',
      description: 'Terrain de la future coopérative agricole',
      url: 'https://images.pexels.com/photos/1459505/pexels-photo-1459505.jpeg',
      thumbnailUrl: 'https://images.pexels.com/photos/1459505/pexels-photo-1459505.jpeg?w=300&h=200&fit=crop',
      uploadedBy: 'Super Administrateur',
      uploadedById: '1',
      uploadedAt: '2024-01-20T11:00:00Z',
      category: 'agr',
      tags: ['agr', 'coopérative', 'agriculture', 'projet'],
      likes: ['2', '3', '4'],
      views: 28,
      isPublic: true
    },
    {
      id: '5',
      title: 'Réunion Bureau Exécutif',
      description: 'Séance de travail du bureau exécutif',
      url: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg',
      thumbnailUrl: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?w=300&h=200&fit=crop',
      uploadedBy: 'Marie GHIEME',
      uploadedById: '2',
      uploadedAt: '2024-02-06T19:30:00Z',
      category: 'meeting',
      tags: ['bureau', 'réunion', 'travail', 'administration'],
      likes: ['1', '2'],
      views: 15,
      isPublic: false
    },
    {
      id: '6',
      title: 'Portrait famille GHIEME',
      description: 'Photo de famille lors du rassemblement annuel',
      url: 'https://images.pexels.com/photos/1857157/pexels-photo-1857157.jpeg',
      thumbnailUrl: 'https://images.pexels.com/photos/1857157/pexels-photo-1857157.jpeg?w=300&h=200&fit=crop',
      uploadedBy: 'Robert GHIEME',
      uploadedById: '6',
      uploadedAt: '2024-01-10T15:45:00Z',
      category: 'family',
      tags: ['famille', 'portrait', 'rassemblement', 'ghieme'],
      likes: ['1', '2', '3', '4', '5'],
      views: 89,
      isPublic: true
    }
  ];

  const mockAlbums: Album[] = [
    {
      id: '1',
      title: 'Assemblée Générale 2024',
      description: 'Photos de l\'assemblée générale annuelle',
      coverPhoto: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?w=300&h=200&fit=crop',
      photoCount: 12,
      createdBy: 'Marie GHIEME',
      createdAt: '2024-01-16T10:00:00Z',
      isPublic: true
    },
    {
      id: '2',
      title: 'Événements Familiaux 2024',
      description: 'Collection des moments familiaux marquants',
      coverPhoto: 'https://images.pexels.com/photos/1729931/pexels-photo-1729931.jpeg?w=300&h=200&fit=crop',
      photoCount: 25,
      createdBy: 'Paul GHIEME',
      createdAt: '2024-01-01T00:00:00Z',
      isPublic: true
    },
    {
      id: '3',
      title: 'Projets AGR',
      description: 'Documentation visuelle des projets AGR',
      coverPhoto: 'https://images.pexels.com/photos/1459505/pexels-photo-1459505.jpeg?w=300&h=200&fit=crop',
      photoCount: 8,
      createdBy: 'Super Administrateur',
      createdAt: '2024-01-15T00:00:00Z',
      isPublic: false
    }
  ];

  const [photos, setPhotos] = useState(mockPhotos);
  const [albums, setAlbums] = useState(mockAlbums);
  const [likedPhotos, setLikedPhotos] = useState<string[]>(['1', '2', '3']);

  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || photo.category === categoryFilter;
    const canView = photo.isPublic || user?.role === 'super_admin' || user?.role === 'admin' || photo.uploadedById === user?.id;
    return matchesSearch && matchesCategory && canView;
  });

  const getCategoryLabel = (category: string) => {
    const categories = {
      event: 'Événement',
      family: 'Famille',
      agr: 'AGR',
      meeting: 'Réunion',
      other: 'Autre'
    };
    return categories[category as keyof typeof categories] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      event: 'bg-green-100 text-green-800',
      family: 'bg-pink-100 text-pink-800',
      agr: 'bg-purple-100 text-purple-800',
      meeting: 'bg-blue-100 text-blue-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const handleLike = (photoId: string) => {
    setLikedPhotos(prev => 
      prev.includes(photoId) 
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const selectedPhotoData = photos.find(p => p.id === selectedPhoto);
  const canUpload = user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'member';

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Galerie Photos</h1>
          <p className="text-gray-600">Souvenirs et moments de l'association</p>
        </div>
        {canUpload && (
          <button className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Upload className="w-4 h-4 mr-2" />
            Ajouter des photos
          </button>
        )}
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Camera className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Photos</p>
              <p className="text-2xl font-bold text-gray-900">{photos.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Heart className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Likes</p>
              <p className="text-2xl font-bold text-gray-900">
                {photos.reduce((acc, photo) => acc + photo.likes.length, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Eye className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Vues</p>
              <p className="text-2xl font-bold text-gray-900">
                {photos.reduce((acc, photo) => acc + photo.views, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ce mois</p>
              <p className="text-2xl font-bold text-gray-900">
                {photos.filter(p => new Date(p.uploadedAt).getMonth() === new Date().getMonth()).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'photos', label: 'Photos', icon: Camera },
              { id: 'albums', label: 'Albums', icon: Grid3X3 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'photos' | 'albums')}
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
          {activeTab === 'photos' && (
            <div className="space-y-6">
              {/* Filtres et recherche */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Rechercher des photos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">Toutes les catégories</option>
                    <option value="event">Événements</option>
                    <option value="family">Famille</option>
                    <option value="agr">AGR</option>
                    <option value="meeting">Réunions</option>
                    <option value="other">Autres</option>
                  </select>
                </div>
                <div className="flex border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-green-50 text-green-600' : 'text-gray-600'}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-green-50 text-green-600' : 'text-gray-600'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Grille de photos */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredPhotos.map((photo) => (
                    <div key={photo.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative">
                        <img
                          src={photo.thumbnailUrl}
                          alt={photo.title}
                          className="w-full h-48 object-cover cursor-pointer"
                          onClick={() => setSelectedPhoto(photo.id)}
                        />
                        <div className="absolute top-2 right-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(photo.category)}`}>
                            {getCategoryLabel(photo.category)}
                          </span>
                        </div>
                        <div className="absolute bottom-2 left-2 flex items-center space-x-2 text-white text-xs">
                          <span className="flex items-center bg-black bg-opacity-50 px-2 py-1 rounded">
                            <Eye className="w-3 h-3 mr-1" />
                            {photo.views}
                          </span>
                          <span className="flex items-center bg-black bg-opacity-50 px-2 py-1 rounded">
                            <Heart className="w-3 h-3 mr-1" />
                            {photo.likes.length}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 mb-1 truncate">{photo.title}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{photo.description}</p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Par {photo.uploadedBy}</span>
                          <span>{formatDate(photo.uploadedAt)}</span>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <button
                            onClick={() => handleLike(photo.id)}
                            className={`flex items-center space-x-1 px-2 py-1 rounded text-sm transition-colors ${
                              likedPhotos.includes(photo.id)
                                ? 'bg-pink-100 text-pink-600'
                                : 'bg-gray-100 text-gray-600 hover:bg-pink-100 hover:text-pink-600'
                            }`}
                          >
                            <Heart className={`w-3 h-3 ${likedPhotos.includes(photo.id) ? 'fill-current' : ''}`} />
                            <span>{photo.likes.length}</span>
                          </button>
                          
                          <div className="flex items-center space-x-1">
                            <button className="p-1 text-gray-400 hover:text-blue-600 rounded">
                              <Download className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-green-600 rounded">
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPhotos.map((photo) => (
                    <div key={photo.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <img
                          src={photo.thumbnailUrl}
                          alt={photo.title}
                          className="w-20 h-20 object-cover rounded-lg cursor-pointer"
                          onClick={() => setSelectedPhoto(photo.id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-gray-900">{photo.title}</h3>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(photo.category)}`}>
                              {getCategoryLabel(photo.category)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{photo.description}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Par {photo.uploadedBy} • {formatDate(photo.uploadedAt)}</span>
                            <div className="flex items-center space-x-4">
                              <span className="flex items-center">
                                <Eye className="w-3 h-3 mr-1" />
                                {photo.views}
                              </span>
                              <span className="flex items-center">
                                <Heart className="w-3 h-3 mr-1" />
                                {photo.likes.length}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'albums' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album) => (
                <div key={album.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img
                      src={album.coverPhoto}
                      alt={album.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                      {album.photoCount} photos
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-1">{album.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{album.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Par {album.createdBy}</span>
                      <span>{formatDate(album.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de visualisation photo */}
      {selectedPhoto && selectedPhotoData && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-full overflow-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">{selectedPhotoData.title}</h3>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <img
                src={selectedPhotoData.url}
                alt={selectedPhotoData.title}
                className="w-full max-h-96 object-contain mb-4"
              />
              <div className="space-y-2">
                <p className="text-gray-700">{selectedPhotoData.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Par {selectedPhotoData.uploadedBy}</span>
                  <span>{formatDate(selectedPhotoData.uploadedAt)}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleLike(selectedPhotoData.id)}
                    className={`flex items-center space-x-1 px-3 py-1 rounded text-sm transition-colors ${
                      likedPhotos.includes(selectedPhotoData.id)
                        ? 'bg-pink-100 text-pink-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-pink-100 hover:text-pink-600'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${likedPhotos.includes(selectedPhotoData.id) ? 'fill-current' : ''}`} />
                    <span>{selectedPhotoData.likes.length}</span>
                  </button>
                  <button className="flex items-center space-x-1 px-3 py-1 rounded text-sm bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Télécharger</span>
                  </button>
                  <button className="flex items-center space-x-1 px-3 py-1 rounded text-sm bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600 transition-colors">
                    <Share2 className="w-4 h-4" />
                    <span>Partager</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;