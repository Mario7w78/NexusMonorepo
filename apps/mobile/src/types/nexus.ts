export type ModuleId = 'dashboard' | 'users' | 'ideas' | 'messages' | 'payments';

// Estructura de un mensaje individual dentro del chat
export interface MessageDetail {
  sender: string;
  content: string;
  timestamp: string | Date;
}

export interface Idea {
  id?: number | string; // Puede ser number (mock) o string (Mongo)
  _id?: string;         // MongoDB ID
  title: string;
  description: string;
  fullDescription?: string;
  author: string;
  avatar?: string;
  authorRating?: number;
  skills?: string[];
  budget: string;
  collaborators?: number;
  status: string;
  category?: string;
  deliveryTime?: string;
  revisions?: string;
  portfolio?: string[];
}

export interface Chat {
  // Identificadores (soportamos ambos por compatibilidad)
  id?: string;      
  _id?: string;     // MongoDB siempre devuelve esto

  // Nombres (soportamos ambos)
  name?: string;            
  participantName?: string; // Backend usa esto

  avatar: string;
  
  // Contenido
  lastMessage?: string;       
  messages?: MessageDetail[]; // Backend devuelve lista de mensajes

  // Metadatos
  time?: string;
  unread?: number;
  unreadCount?: number;     // Backend usa esto
  project: string;
  online: boolean;
}

export interface Transaction {
  type: string;
  project: string;
  amount: string;
  date: string;
  status: string;
}