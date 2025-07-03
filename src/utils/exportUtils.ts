// Utilitaires pour l'export de données

export interface ExportData {
  headers: string[];
  rows: (string | number)[][];
  filename: string;
}

// Fonction pour convertir les données en CSV
export const exportToCSV = (data: ExportData): void => {
  const csvContent = [
    data.headers.join(','),
    ...data.rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${data.filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Fonction pour convertir les données en JSON et télécharger
export const exportToJSON = (data: any, filename: string): void => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Fonction pour générer un export de membres
export const exportMembers = (members: any[], format: 'csv' | 'json' = 'csv'): void => {
  if (format === 'csv') {
    const data: ExportData = {
      headers: [
        'ID',
        'Prénom',
        'Nom',
        'Email',
        'Téléphone',
        'Date de naissance',
        'Lieu de naissance',
        'Profession',
        'Type de membre',
        'Statut',
        'Date d\'adhésion',
        'Dernière cotisation'
      ],
      rows: members.map(member => [
        member.id,
        member.firstName,
        member.lastName,
        member.email,
        member.phone,
        member.birthDate,
        member.birthPlace,
        member.profession,
        member.memberType,
        member.status,
        member.joinDate,
        member.lastContribution || 'Aucune'
      ]),
      filename: `membres_moukona_ghieme_${new Date().toISOString().split('T')[0]}`
    };
    exportToCSV(data);
  } else {
    exportToJSON(members, `membres_moukona_ghieme_${new Date().toISOString().split('T')[0]}`);
  }
};

// Fonction pour générer un export d'événements
export const exportEvents = (events: any[], format: 'csv' | 'json' = 'csv'): void => {
  if (format === 'csv') {
    const data: ExportData = {
      headers: [
        'ID',
        'Titre',
        'Description',
        'Type',
        'Date',
        'Heure',
        'Lieu',
        'Organisateur',
        'Participants',
        'Photos',
        'Likes',
        'Créé le'
      ],
      rows: events.map(event => [
        event.id,
        event.title,
        event.description,
        event.type,
        event.date,
        event.time,
        event.location,
        event.organizer,
        event.participants.length,
        event.photos.length,
        event.likes.length,
        event.createdAt
      ]),
      filename: `evenements_moukona_ghieme_${new Date().toISOString().split('T')[0]}`
    };
    exportToCSV(data);
  } else {
    exportToJSON(events, `evenements_moukona_ghieme_${new Date().toISOString().split('T')[0]}`);
  }
};

// Fonction pour générer un export financier
export const exportFinances = (cotisations: any[], depenses: any[], format: 'csv' | 'json' = 'csv'): void => {
  if (format === 'csv') {
    // Export des cotisations
    const cotisationsData: ExportData = {
      headers: [
        'ID',
        'Membre',
        'Montant',
        'Statut',
        'Date',
        'Type de membre',
        'Méthode de paiement'
      ],
      rows: cotisations.map(cotisation => [
        cotisation.id,
        cotisation.member,
        cotisation.amount,
        cotisation.status,
        cotisation.date,
        cotisation.type,
        cotisation.paymentMethod || 'Non spécifié'
      ]),
      filename: `cotisations_moukona_ghieme_${new Date().toISOString().split('T')[0]}`
    };
    exportToCSV(cotisationsData);

    // Export des dépenses
    const depensesData: ExportData = {
      headers: [
        'ID',
        'Titre',
        'Montant',
        'Catégorie',
        'Date',
        'Approuvé par',
        'Description'
      ],
      rows: depenses.map(depense => [
        depense.id,
        depense.title,
        depense.amount,
        depense.category,
        depense.date,
        depense.approvedBy,
        depense.description || ''
      ]),
      filename: `depenses_moukona_ghieme_${new Date().toISOString().split('T')[0]}`
    };
    exportToCSV(depensesData);
  } else {
    const financialData = {
      cotisations,
      depenses,
      exportDate: new Date().toISOString(),
      association: 'MOUKONA GHIEME'
    };
    exportToJSON(financialData, `finances_moukona_ghieme_${new Date().toISOString().split('T')[0]}`);
  }
};

// Fonction pour générer un export d'actualités
export const exportNews = (news: any[], format: 'csv' | 'json' = 'csv'): void => {
  if (format === 'csv') {
    const data: ExportData = {
      headers: [
        'ID',
        'Titre',
        'Auteur',
        'Catégorie',
        'Date de création',
        'Publié',
        'Épinglé',
        'Likes',
        'Commentaires'
      ],
      rows: news.map(post => [
        post.id,
        post.title,
        post.author,
        post.category,
        post.createdAt,
        post.isPublished ? 'Oui' : 'Non',
        post.isPinned ? 'Oui' : 'Non',
        post.likes.length,
        post.comments.length
      ]),
      filename: `actualites_moukona_ghieme_${new Date().toISOString().split('T')[0]}`
    };
    exportToCSV(data);
  } else {
    exportToJSON(news, `actualites_moukona_ghieme_${new Date().toISOString().split('T')[0]}`);
  }
};

// Fonction pour générer un calendrier ICS
export const exportCalendar = (events: any[]): void => {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MOUKONA GHIEME//Association Calendar//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...events.flatMap(event => [
      'BEGIN:VEVENT',
      `UID:${event.id}@moukonaghieme.org`,
      `DTSTART:${event.date.replace(/-/g, '')}T${event.time.replace(':', '')}00`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description}`,
      `LOCATION:${event.location}`,
      `ORGANIZER:CN=${event.organizer}`,
      `CREATED:${event.createdAt.replace(/[-:]/g, '').split('.')[0]}Z`,
      'END:VEVENT'
    ]),
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `calendrier_moukona_ghieme_${new Date().toISOString().split('T')[0]}.ics`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Fonction pour générer un rapport complet
export const exportCompleteReport = (data: {
  members: any[];
  events: any[];
  news: any[];
  finances: { cotisations: any[]; depenses: any[] };
}): void => {
  const report = {
    association: 'MOUKONA GHIEME',
    exportDate: new Date().toISOString(),
    summary: {
      totalMembers: data.members.length,
      activeMembers: data.members.filter(m => m.status === 'active').length,
      totalEvents: data.events.length,
      upcomingEvents: data.events.filter(e => new Date(e.date) > new Date()).length,
      totalNews: data.news.length,
      publishedNews: data.news.filter(n => n.isPublished).length,
      totalCotisations: data.finances.cotisations.reduce((sum, c) => sum + c.amount, 0),
      totalDepenses: data.finances.depenses.reduce((sum, d) => sum + d.amount, 0)
    },
    data
  };

  exportToJSON(report, `rapport_complet_moukona_ghieme_${new Date().toISOString().split('T')[0]}`);
};
