import React, { useState, useMemo } from 'react';
import {
  FileText, Plus, Search, Filter, Edit, Trash2,
  Heart, MessageCircle, Calendar, User, Eye,
  Image, ThumbsUp, Share2, MoreVertical, TrendingUp, Bookmark
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { NewsPost } from '../types';
import { formatDate, formatRelativeDate } from '../utils/dateUtils';
import { formatFullName } from '../utils/formatUtils';
import Avatar from '../components/common/Avatar';

interface NewsFilters {
  search: string;
  category: string;
  author: string;
}

const News: React.FC = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<NewsFilters>({
    search: '',
    category: 'all',
    author: 'all'
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<NewsPost | null>(null);
  const [showPostDetails, setShowPostDetails] = useState(false);

  // Données de démonstration
  const mockNews: NewsPost[] = [
    {
      id: '1',
      title: 'Assemblée Générale Annuelle 2024 - Bilan et Perspectives',
      content: `L'Assemblée Générale Annuelle de l'Association Familiale MOUKONA GHIEME s'est tenue le 15 janvier 2024 à Libreville avec une participation record de 45 membres.

**Points saillants de la réunion :**

• **Bilan financier 2023 :** Présentation d'un bilan positif avec 1 250 000 FCFA de cotisations collectées
• **Nouveaux projets AGR :** Validation du projet de coopérative agricole à Moanda
• **Élections :** Renouvellement partiel du bureau exécutif
• **Solidarité familiale :** 8 interventions d'urgence réalisées en 2023

**Décisions importantes :**
- Maintien des tarifs de cotisation actuels
- Création d'une commission jeunesse
- Organisation de 3 grands événements familiaux en 2024

Nous remercions tous les membres pour leur participation active et leur engagement continu envers notre famille.`,
      excerpt: 'Bilan positif de l\'AG 2024 avec 45 participants et validation de nouveaux projets AGR.',
      author: 'Marie GHIEME',
      authorId: '2',
      createdAt: '2024-01-16T10:00:00Z',
      photos: [
        'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
        'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg'
      ],
      likes: ['1', '3', '4', '5', '6'],
      comments: [
        {
          id: '1',
          authorId: '3',
          authorName: 'Jean GHIEME',
          content: 'Excellente organisation ! Merci à toute l\'équipe.',
          createdAt: '2024-01-16T14:30:00Z'
        }
      ],
      isPublished: true,
      category: 'announcement',
      isPinned: true
    },
    {
      id: '2',
      title: 'Nouveau projet AGR : Coopérative Agricole approuvée',
      content: `Grande nouvelle pour notre association ! Le projet de coopérative agricole a été officiellement approuvé lors de l'Assemblée Générale.

**Détails du projet :**
- **Investissement initial :** 500 000 FCFA
- **Localisation :** Moanda, Gabon
- **Cultures prévues :** Manioc, plantain, légumes
- **Bénéficiaires :** 15 familles membres
- **Retour sur investissement estimé :** 25% la première année

**Prochaines étapes :**
1. Constitution du comité de gestion
2. Acquisition du terrain
3. Formation des participants
4. Démarrage des activités en mars 2024

Ce projet s'inscrit dans notre objectif de développement économique des membres et de renforcement de la solidarité familiale.`,
      excerpt: 'Validation du projet de coopérative agricole avec un investissement de 500 000 FCFA.',
      author: 'Super Administrateur',
      authorId: '1',
      createdAt: '2024-01-18T09:15:00Z',
      photos: [
        'https://images.pexels.com/photos/1459505/pexels-photo-1459505.jpeg'
      ],
      likes: ['2', '3', '4', '6'],
      comments: [],
      isPublished: true,
      category: 'agr',
      isPinned: false
    },
    {
      id: '3',
      title: 'Rappel : Cotisations du mois de janvier',
      content: `Chers membres de la famille MOUKONA GHIEME,

Nous vous rappelons que les cotisations du mois de janvier 2024 sont à régler avant le 31 janvier.

**Tarifs selon votre statut :**
- Travailleurs : 10 000 FCFA
- Retraités : 5 000 FCFA
- Chômeurs : 3 000 FCFA
- Étudiants : 1 000 FCFA

**Modalités de paiement :**
- Virement bancaire
- Mobile Money
- Espèces lors des réunions

Pour toute difficulté de paiement, n'hésitez pas à contacter le trésorier. Des arrangements peuvent être trouvés selon votre situation.

Merci pour votre engagement et votre ponctualité !`,
      excerpt: 'Rappel des cotisations de janvier avec les différents tarifs selon le statut.',
      author: 'Marie GHIEME',
      authorId: '2',
      createdAt: '2024-01-20T08:00:00Z',
      photos: [],
      likes: ['1', '4', '5'],
      comments: [],
      isPublished: true,
      category: 'announcement',
      isPinned: false
    }
  ];

  const [news, setNews] = useState(mockNews);
  const [likedPosts, setLikedPosts] = useState<string[]>(['1', '2', '3']);

  // Logique de filtrage améliorée
  const filteredNews = useMemo(() => {
    return news.filter(post => {
      const matchesSearch =
        post.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        post.content.toLowerCase().includes(filters.search.toLowerCase()) ||
        post.author.toLowerCase().includes(filters.search.toLowerCase());

      const matchesCategory = filters.category === 'all' || post.category === filters.category;
      const matchesAuthor = filters.author === 'all' || post.author === filters.author;

      return matchesSearch && matchesCategory && matchesAuthor && post.isPublished;
    }).sort((a, b) => {
      // Articles épinglés en premier, puis par date
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [news, filters]);

  // Statistiques des actualités
  const newsStats = useMemo(() => {
    const total = news.filter(n => n.isPublished).length;
    const thisMonth = news.filter(n => {
      const newsDate = new Date(n.createdAt);
      const now = new Date();
      return newsDate.getMonth() === now.getMonth() &&
             newsDate.getFullYear() === now.getFullYear() &&
             n.isPublished;
    }).length;
    const totalLikes = news.reduce((sum, n) => sum + n.likes.length, 0);
    const totalComments = news.reduce((sum, n) => sum + n.comments.length, 0);

    return { total, thisMonth, totalLikes, totalComments };
  }, [news]);

  const getCategoryLabel = (category: string) => {
    const categories = {
      announcement: 'Annonce',
      event: 'Événement',
      agr: 'AGR',
      family: 'Famille',
      other: 'Autre'
    };
    return categories[category as keyof typeof categories] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      announcement: 'bg-blue-100 text-blue-800',
      event: 'bg-green-100 text-green-800',
      agr: 'bg-purple-100 text-purple-800',
      family: 'bg-pink-100 text-pink-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const handleLike = (postId: string) => {
    setLikedPosts(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const canManageNews = user?.role === 'super_admin' || user?.role === 'admin';

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Journal des Événements</h1>
          <p className="text-gray-600">Actualités et annonces de l'association</p>
        </div>
        {canManageNews && (
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle publication
          </button>
        )}
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Publications</p>
              <p className="text-2xl font-bold text-gray-900">{newsStats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ThumbsUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Likes</p>
              <p className="text-2xl font-bold text-gray-900">{newsStats.totalLikes}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Commentaires</p>
              <p className="text-2xl font-bold text-gray-900">{newsStats.totalComments}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Eye className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ce mois</p>
              <p className="text-2xl font-bold text-gray-900">{newsStats.thisMonth}</p>
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
                placeholder="Rechercher par titre, contenu ou auteur..."
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
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Toutes les catégories</option>
                <option value="announcement">Annonces</option>
                <option value="event">Événements</option>
                <option value="agr">AGR</option>
                <option value="family">Famille</option>
                <option value="other">Autres</option>
              </select>
            </div>
            <select
              value={filters.author}
              onChange={(e) => setFilters(prev => ({ ...prev, author: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Tous les auteurs</option>
              <option value="Marie GHIEME">Marie GHIEME</option>
              <option value="Paul GHIEME">Paul GHIEME</option>
              <option value="Super Administrateur">Super Administrateur</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>{filteredNews.length} publication(s) trouvée(s)</span>
          {(filters.search || filters.category !== 'all' || filters.author !== 'all') && (
            <button
              onClick={() => setFilters({ search: '', category: 'all', author: 'all' })}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      </div>

      {/* Publications */}
      <div className="space-y-6">
        {filteredNews.map((post) => (
          <article key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* En-tête de l'article */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar
                    firstName={post.author.split(' ')[0]}
                    lastName={post.author.split(' ')[1]}
                    size="md"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{post.author}</p>
                    <p className="text-xs text-gray-500">{formatRelativeDate(post.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {post.isPinned && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Épinglé
                    </span>
                  )}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                    {getCategoryLabel(post.category)}
                  </span>
                  {canManageNews && post.authorId === user?.id && (
                    <div className="flex items-center space-x-1">
                      <button className="p-1 text-gray-400 hover:text-blue-600 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h2>
            </div>

            {/* Contenu */}
            <div className="p-6">
              <div className="prose max-w-none text-gray-700 mb-4">
                {post.content.split('\n').map((paragraph, index) => {
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return (
                      <h3 key={index} className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                        {paragraph.replace(/\*\*/g, '')}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('•')) {
                    return (
                      <li key={index} className="ml-4 mb-1">
                        {paragraph.substring(2)}
                      </li>
                    );
                  }
                  if (paragraph.trim()) {
                    return (
                      <p key={index} className="mb-3">
                        {paragraph}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>

              {/* Photos */}
              {post.photos.length > 0 && (
                <div className="mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {post.photos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm transition-colors ${
                      likedPosts.includes(post.id)
                        ? 'bg-pink-100 text-pink-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-pink-100 hover:text-pink-600'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${likedPosts.includes(post.id) ? 'fill-current' : ''}`} />
                    <span>{post.likes.length}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments.length}</span>
                  </button>
                </div>
                
                <button className="flex items-center space-x-2 px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600 transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span>Partager</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default News;