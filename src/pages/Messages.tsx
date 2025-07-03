import React, { useState } from 'react';
import {
  MessageCircle, Send, Search, Plus,
  User, Clock, Check, CheckCheck, MoreVertical
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { formatDate, formatRelativeDate } from '../utils/dateUtils';
import { formatFullName } from '../utils/formatUtils';
import Avatar from '../components/common/Avatar';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  content: string;
  sentAt: string;
  isRead: boolean;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

const Messages: React.FC = () => {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Données de démonstration
  const mockConversations: Conversation[] = [
    {
      id: '1',
      participantId: '2',
      participantName: 'Marie GHIEME',
      lastMessage: 'Merci pour l\'organisation de l\'assemblée générale !',
      lastMessageTime: '2024-01-20T14:30:00Z',
      unreadCount: 2,
      isOnline: true
    },
    {
      id: '2',
      participantId: '3',
      participantName: 'Jean GHIEME',
      lastMessage: 'À quelle heure commence la réunion demain ?',
      lastMessageTime: '2024-01-19T16:45:00Z',
      unreadCount: 0,
      isOnline: false
    },
    {
      id: '3',
      participantId: '4',
      participantName: 'Paul GHIEME',
      lastMessage: 'Les photos de l\'événement sont magnifiques !',
      lastMessageTime: '2024-01-18T10:20:00Z',
      unreadCount: 1,
      isOnline: true
    },
    {
      id: '4',
      participantId: '5',
      participantName: 'Sophie GHIEME',
      lastMessage: 'Pouvez-vous m\'aider avec ma demande d\'adhésion ?',
      lastMessageTime: '2024-01-17T09:15:00Z',
      unreadCount: 0,
      isOnline: false
    }
  ];

  const mockMessages: Message[] = [
    {
      id: '1',
      senderId: '2',
      senderName: 'Marie GHIEME',
      receiverId: user?.id || '1',
      receiverName: user?.firstName + ' ' + user?.lastName || '',
      content: 'Bonjour ! Comment allez-vous ?',
      sentAt: '2024-01-20T10:00:00Z',
      isRead: true
    },
    {
      id: '2',
      senderId: user?.id || '1',
      senderName: user?.firstName + ' ' + user?.lastName || '',
      receiverId: '2',
      receiverName: 'Marie GHIEME',
      content: 'Bonjour Marie ! Tout va bien, merci. Et vous ?',
      sentAt: '2024-01-20T10:05:00Z',
      isRead: true
    },
    {
      id: '3',
      senderId: '2',
      senderName: 'Marie GHIEME',
      receiverId: user?.id || '1',
      receiverName: user?.firstName + ' ' + user?.lastName || '',
      content: 'Très bien aussi ! Je voulais vous remercier pour l\'organisation de l\'assemblée générale. Tout s\'est très bien passé.',
      sentAt: '2024-01-20T14:25:00Z',
      isRead: true
    },
    {
      id: '4',
      senderId: '2',
      senderName: 'Marie GHIEME',
      receiverId: user?.id || '1',
      receiverName: user?.firstName + ' ' + user?.lastName || '',
      content: 'Merci pour l\'organisation de l\'assemblée générale !',
      sentAt: '2024-01-20T14:30:00Z',
      isRead: false
    }
  ];

  const [conversations, setConversations] = useState(mockConversations);
  const [messages, setMessages] = useState(mockMessages);

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedConversationData = conversations.find(conv => conv.id === selectedConversation);
  const conversationMessages = messages.filter(msg => 
    (msg.senderId === selectedConversationData?.participantId && msg.receiverId === user?.id) ||
    (msg.senderId === user?.id && msg.receiverId === selectedConversationData?.participantId)
  );

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversationData) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: user?.id || '1',
      senderName: user?.firstName + ' ' + user?.lastName || '',
      receiverId: selectedConversationData.participantId,
      receiverName: selectedConversationData.participantName,
      content: newMessage.trim(),
      sentAt: new Date().toISOString(),
      isRead: false
    };

    setMessages(prev => [...prev, message]);
    
    // Mettre à jour la conversation
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation 
        ? { ...conv, lastMessage: newMessage.trim(), lastMessageTime: new Date().toISOString() }
        : conv
    ));

    setNewMessage('');
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Hier';
    } else {
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Liste des conversations */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher une conversation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedConversation === conversation.id ? 'bg-green-50 border-r-2 border-green-500' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  {conversation.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {conversation.participantName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTime(conversation.lastMessageTime)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 truncate">
                      {conversation.lastMessage}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-green-500 rounded-full">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zone de conversation */}
      <div className="flex-1 flex flex-col">
        {selectedConversationData ? (
          <>
            {/* En-tête de conversation */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  {selectedConversationData.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedConversationData.participantName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedConversationData.isOnline ? 'En ligne' : 'Hors ligne'}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {conversationMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderId === user?.id
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <div className={`flex items-center justify-end mt-1 space-x-1 ${
                      message.senderId === user?.id ? 'text-green-100' : 'text-gray-500'
                    }`}>
                      <span className="text-xs">
                        {formatTime(message.sentAt)}
                      </span>
                      {message.senderId === user?.id && (
                        message.isRead ? (
                          <CheckCheck className="w-3 h-3" />
                        ) : (
                          <Check className="w-3 h-3" />
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Zone de saisie */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Tapez votre message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Sélectionnez une conversation
              </h3>
              <p className="text-gray-500">
                Choisissez une conversation dans la liste pour commencer à échanger.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;