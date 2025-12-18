
export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  isBot?: boolean;
}

export interface Message {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  isAI?: boolean;
}

export interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice';
  category?: string;
}

export interface Server {
  id: string;
  name: string;
  icon: string;
  channels: Channel[];
}

export interface AppState {
  currentUser: User;
  servers: Server[];
  activeServerId: string;
  activeChannelId: string;
  messages: Record<string, Message[]>; // channelId -> messages
  members: User[];
}
