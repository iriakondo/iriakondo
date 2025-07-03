export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  role: 'super_admin' | 'admin' | 'member';
  membershipStatus: 'active' | 'pending' | 'inactive';
  membershipType: 'worker' | 'retired' | 'unemployed' | 'student';
  cotisationAmount: number;
  parentRelation?: string;
  joinDate: string;
  lastLogin?: string;
  avatar?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  type: 'birthday' | 'meeting' | 'birth' | 'wedding' | 'funeral' | 'other';
  date: string;
  time: string;
  location: string;
  organizer: string;
  participants: string[];
  photos: string[];
  likes: string[];
  expenses: Expense[];
  createdBy: string;
  createdAt: string;
}

export interface NewsPost {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  photos: string[];
  likes: string[];
  isPublished: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  sentAt: string;
  isRead: boolean;
}

export interface Cotisation {
  id: string;
  memberId: string;
  amount: number;
  month: string;
  year: number;
  status: 'paid' | 'pending' | 'overdue';
  paidAt?: string;
  paymentMethod?: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: 'event' | 'agr' | 'administration' | 'emergency' | 'other';
  description: string;
  date: string;
  approvedBy: string;
  eventId?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  generation: number;
  parentId?: string;
  children: string[];
  birthDate?: string;
  deathDate?: string;
  isAlive: boolean;
}

export interface Statistics {
  totalMembers: number;
  activeMembers: number;
  pendingMembers: number;
  totalEvents: number;
  upcomingEvents: number;
  totalCotisations: number;
  totalExpenses: number;
  monthlyRevenue: number;
}