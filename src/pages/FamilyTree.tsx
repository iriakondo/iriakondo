import React, { useState } from 'react';
import { 
  TreePine, Users, Plus, Search, Filter, 
  User, Calendar, MapPin, Heart, Baby,
  Edit, Trash2, Eye, ChevronDown, ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface FamilyMember {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  birthDate?: string;
  deathDate?: string;
  birthPlace?: string;
  currentAddress?: string;
  phone?: string;
  email?: string;
  profession?: string;
  generation: number;
  parentId?: string;
  spouseId?: string;
  children: string[];
  isAlive: boolean;
  gender: 'male' | 'female';
  photo?: string;
  notes?: string;
}

const FamilyTree: React.FC = () => {
  const { user } = useAuth();
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [generationFilter, setGenerationFilter] = useState('all');
  const [expandedNodes, setExpandedNodes] = useState<string[]>(['1']);

  // Données de démonstration de l'arbre généalogique
  const mockFamilyMembers: FamilyMember[] = [
    {
      id: '1',
      name: 'GHIEME Marguerite',
      firstName: 'Marguerite',
      lastName: 'GHIEME',
      birthDate: '1920-03-15',
      deathDate: '1995-08-22',
      birthPlace: 'Libreville, Gabon',
      generation: 0,
      children: ['2', '3', '4', '5'],
      isAlive: false,
      gender: 'female',
      notes: 'Fondatrice de la lignée familiale GHIEME'
    },
    {
      id: '2',
      name: 'GHIEME Marie',
      firstName: 'Marie',
      lastName: 'GHIEME',
      birthDate: '1945-06-10',
      birthPlace: 'Libreville, Gabon',
      currentAddress: 'Libreville, Gabon',
      phone: '+241 01 23 45 67',
      email: 'marie.ghieme@email.com',
      profession: 'Enseignante retraitée',
      generation: 1,
      parentId: '1',
      children: ['6', '7'],
      isAlive: true,
      gender: 'female'
    },
    {
      id: '3',
      name: 'GHIEME Paul',
      firstName: 'Paul',
      lastName: 'GHIEME',
      birthDate: '1948-11-22',
      birthPlace: 'Libreville, Gabon',
      currentAddress: 'Port-Gentil, Gabon',
      phone: '+241 06 11 22 33',
      email: 'paul.ghieme@email.com',
      profession: 'Ingénieur pétrolier',
      generation: 1,
      parentId: '1',
      children: ['8', '9', '10'],
      isAlive: true,
      gender: 'male'
    },
    {
      id: '4',
      name: 'GHIEME Robert',
      firstName: 'Robert',
      lastName: 'GHIEME',
      birthDate: '1950-04-30',
      birthPlace: 'Libreville, Gabon',
      currentAddress: 'Oyem, Gabon',
      phone: '+241 04 77 88 99',
      email: 'robert.ghieme@email.com',
      profession: 'Commerçant retraité',
      generation: 1,
      parentId: '1',
      children: ['11', '12'],
      isAlive: true,
      gender: 'male'
    },
    {
      id: '5',
      name: 'GHIEME Sophie',
      firstName: 'Sophie',
      lastName: 'GHIEME',
      birthDate: '1952-09-18',
      birthPlace: 'Libreville, Gabon',
      currentAddress: 'Franceville, Gabon',
      profession: 'Infirmière retraitée',
      generation: 1,
      parentId: '1',
      children: ['13'],
      isAlive: true,
      gender: 'female'
    },
    // Génération 2
    {
      id: '6',
      name: 'NZAMBA Jean',
      firstName: 'Jean',
      lastName: 'NZAMBA',
      birthDate: '1970-07-15',
      birthPlace: 'Libreville, Gabon',
      currentAddress: 'Moanda, Gabon',
      phone: '+241 07 89 12 34',
      email: 'jean.ghieme@email.com',
      profession: 'Ingénieur minier',
      generation: 2,
      parentId: '2',
      children: ['14', '15'],
      isAlive: true,
      gender: 'male'
    },
    {
      id: '7',
      name: 'GHIEME Claire',
      firstName: 'Claire',
      lastName: 'GHIEME',
      birthDate: '1972-12-03',
      birthPlace: 'Libreville, Gabon',
      currentAddress: 'Libreville, Gabon',
      profession: 'Médecin',
      generation: 2,
      parentId: '2',
      children: ['16'],
      isAlive: true,
      gender: 'female'
    },
    {
      id: '8',
      name: 'GHIEME Michel',
      firstName: 'Michel',
      lastName: 'GHIEME',
      birthDate: '1975-03-20',
      birthPlace: 'Port-Gentil, Gabon',
      currentAddress: 'Port-Gentil, Gabon',
      profession: 'Avocat',
      generation: 2,
      parentId: '3',
      children: ['17', '18'],
      isAlive: true,
      gender: 'male'
    },
    {
      id: '9',
      name: 'GHIEME Sylvie',
      firstName: 'Sylvie',
      lastName: 'GHIEME',
      birthDate: '1977-08-14',
      birthPlace: 'Port-Gentil, Gabon',
      currentAddress: 'Libreville, Gabon',
      profession: 'Architecte',
      generation: 2,
      parentId: '3',
      children: [],
      isAlive: true,
      gender: 'female'
    },
    {
      id: '10',
      name: 'GHIEME André',
      firstName: 'André',
      lastName: 'GHIEME',
      birthDate: '1980-01-25',
      birthPlace: 'Port-Gentil, Gabon',
      currentAddress: 'Port-Gentil, Gabon',
      profession: 'Entrepreneur',
      generation: 2,
      parentId: '3',
      children: ['19'],
      isAlive: true,
      gender: 'male'
    },
    // Génération 3
    {
      id: '14',
      name: 'NZAMBA Pierre',
      firstName: 'Pierre',
      lastName: 'NZAMBA',
      birthDate: '1995-05-12',
      birthPlace: 'Moanda, Gabon',
      currentAddress: 'Libreville, Gabon',
      profession: 'Étudiant en informatique',
      generation: 3,
      parentId: '6',
      children: [],
      isAlive: true,
      gender: 'male'
    },
    {
      id: '15',
      name: 'NZAMBA Lucie',
      firstName: 'Lucie',
      lastName: 'NZAMBA',
      birthDate: '1998-09-08',
      birthPlace: 'Moanda, Gabon',
      currentAddress: 'Moanda, Gabon',
      profession: 'Étudiante en médecine',
      generation: 3,
      parentId: '6',
      children: [],
      isAlive: true,
      gender: 'female'
    }
  ];

  const [familyMembers, setFamilyMembers] = useState(mockFamilyMembers);

  const filteredMembers = familyMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGeneration = generationFilter === 'all' || member.generation.toString() === generationFilter;
    return matchesSearch && matchesGeneration;
  });

  const getGenerationLabel = (generation: number) => {
    switch (generation) {
      case 0: return 'Fondatrice';
      case 1: return '1ère génération';
      case 2: return '2ème génération';
      case 3: return '3ème génération';
      case 4: return '4ème génération';
      default: return `${generation}ème génération`;
    }
  };

  const calculateAge = (birthDate: string, deathDate?: string) => {
    const birth = new Date(birthDate);
    const end = deathDate ? new Date(deathDate) : new Date();
    return Math.floor((end.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  };

  const toggleNode = (memberId: string) => {
    setExpandedNodes(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const renderFamilyNode = (member: FamilyMember, level: number = 0) => {
    const children = familyMembers.filter(m => m.parentId === member.id);
    const isExpanded = expandedNodes.includes(member.id);
    const hasChildren = children.length > 0;

    return (
      <div key={member.id} className="relative">
        <div 
          className={`flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer ${
            selectedMember === member.id ? 'ring-2 ring-green-500 border-green-500' : ''
          }`}
          style={{ marginLeft: `${level * 2}rem` }}
          onClick={() => setSelectedMember(member.id)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(member.id);
              }}
              className="mr-2 p-1 hover:bg-gray-100 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-600" />
              )}
            </button>
          )}
          
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
            member.gender === 'male' ? 'bg-blue-100' : 'bg-pink-100'
          }`}>
            {member.photo ? (
              <img src={member.photo} alt={member.name} className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <User className={`w-6 h-6 ${member.gender === 'male' ? 'text-blue-600' : 'text-pink-600'}`} />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900">{member.name}</h3>
              {!member.isAlive && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  Décédé(e)
                </span>
              )}
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {member.birthDate && (
                  <>
                    {new Date(member.birthDate).toLocaleDateString('fr-FR')}
                    {member.isAlive ? ` (${calculateAge(member.birthDate)} ans)` : 
                     member.deathDate ? ` - ${new Date(member.deathDate).toLocaleDateString('fr-FR')} (${calculateAge(member.birthDate, member.deathDate)} ans)` : ''}
                  </>
                )}
              </p>
              {member.profession && (
                <p className="text-xs text-gray-500">{member.profession}</p>
              )}
              {member.currentAddress && (
                <p className="flex items-center text-xs text-gray-500">
                  <MapPin className="w-3 h-3 mr-1" />
                  {member.currentAddress}
                </p>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              {getGenerationLabel(member.generation)}
            </span>
            {hasChildren && (
              <p className="text-xs text-gray-500 mt-1">
                {children.length} enfant{children.length > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="mt-2 space-y-2">
            {children.map(child => renderFamilyNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const selectedMemberData = familyMembers.find(m => m.id === selectedMember);
  const canManageTree = user?.role === 'super_admin' || user?.role === 'admin';

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Arbre Généalogique</h1>
          <p className="text-gray-600">Descendance de Feue GHIEME Marguerite</p>
        </div>
        {canManageTree && (
          <button className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un membre
          </button>
        )}
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Membres</p>
              <p className="text-2xl font-bold text-gray-900">{familyMembers.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Heart className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Vivants</p>
              <p className="text-2xl font-bold text-gray-900">
                {familyMembers.filter(m => m.isAlive).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TreePine className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Générations</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.max(...familyMembers.map(m => m.generation)) + 1}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
              <Baby className="h-6 w-6 text-pink-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Dernière génération</p>
              <p className="text-2xl font-bold text-gray-900">
                {familyMembers.filter(m => m.generation === Math.max(...familyMembers.map(m => m.generation))).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Arbre généalogique */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filtres et recherche */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Rechercher un membre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={generationFilter}
                  onChange={(e) => setGenerationFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">Toutes les générations</option>
                  <option value="0">Fondatrice</option>
                  <option value="1">1ère génération</option>
                  <option value="2">2ème génération</option>
                  <option value="3">3ème génération</option>
                </select>
              </div>
            </div>
          </div>

          {/* Arbre */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="space-y-4">
              {familyMembers
                .filter(m => m.generation === 0)
                .map(member => renderFamilyNode(member))}
            </div>
          </div>
        </div>

        {/* Détails du membre sélectionné */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          {selectedMemberData ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
                  selectedMemberData.gender === 'male' ? 'bg-blue-100' : 'bg-pink-100'
                }`}>
                  {selectedMemberData.photo ? (
                    <img src={selectedMemberData.photo} alt={selectedMemberData.name} className="w-20 h-20 rounded-full object-cover" />
                  ) : (
                    <User className={`w-10 h-10 ${selectedMemberData.gender === 'male' ? 'text-blue-600' : 'text-pink-600'}`} />
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{selectedMemberData.name}</h3>
                <p className="text-sm text-gray-600">{getGenerationLabel(selectedMemberData.generation)}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Informations personnelles</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    {selectedMemberData.birthDate && (
                      <p className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Né(e) le {new Date(selectedMemberData.birthDate).toLocaleDateString('fr-FR')}
                        {selectedMemberData.isAlive && ` (${calculateAge(selectedMemberData.birthDate)} ans)`}
                      </p>
                    )}
                    {selectedMemberData.deathDate && (
                      <p className="flex items-center text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        Décédé(e) le {new Date(selectedMemberData.deathDate).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                    {selectedMemberData.birthPlace && (
                      <p className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        Né(e) à {selectedMemberData.birthPlace}
                      </p>
                    )}
                    {selectedMemberData.currentAddress && selectedMemberData.isAlive && (
                      <p className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        Réside à {selectedMemberData.currentAddress}
                      </p>
                    )}
                    {selectedMemberData.profession && (
                      <p>{selectedMemberData.profession}</p>
                    )}
                  </div>
                </div>

                {selectedMemberData.children.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Enfants ({selectedMemberData.children.length})</h4>
                    <div className="space-y-1">
                      {selectedMemberData.children.map(childId => {
                        const child = familyMembers.find(m => m.id === childId);
                        return child ? (
                          <p key={childId} className="text-sm text-gray-600">
                            • {child.name}
                          </p>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {selectedMemberData.notes && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
                    <p className="text-sm text-gray-600">{selectedMemberData.notes}</p>
                  </div>
                )}
              </div>

              {canManageTree && (
                <div className="flex space-x-2 pt-4 border-t border-gray-200">
                  <button className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
                  </button>
                  <button className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <TreePine className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Sélectionnez un membre
              </h3>
              <p className="text-gray-500">
                Cliquez sur un membre de l'arbre pour voir ses détails.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FamilyTree;