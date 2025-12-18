
import React, { useState, useEffect } from 'react';
import { ServerList } from './components/ServerList';
import { ChannelSidebar } from './components/ChannelSidebar';
import { ChatContainer } from './components/ChatContainer';
import { MemberSidebar } from './components/MemberSidebar';
import { LoginPage } from './components/LoginPage';
import { AppState, User, Message } from './types';

const USERS: Record<string, { user: User, pass: string }> = {
  'mazen': { pass: 'pass123', user: { id: 'u-mazen', name: 'Mazen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mazen', status: 'online' } },
  'zeyad': { pass: 'pass123', user: { id: 'u-zeyad', name: 'Zeyad', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zeyad', status: 'online' } },
  'gasser': { pass: 'pass123', user: { id: 'u-gasser', name: 'Gasser', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gasser', status: 'idle' } },
  'omar shata': { pass: 'pass123', user: { id: 'u-shata', name: 'Omar Shata', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=shata', status: 'online' } },
  'omar el sokhari': { pass: 'pass123', user: { id: 'u-sokhari', name: 'Omar El Sokhari', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sokhari', status: 'online' } }
};

const INITIAL_STATE: AppState = {
  currentUser: USERS['mazen'].user,
  servers: [
    {
      id: 'server-auto',
      name: 'Auto Community',
      icon: 'https://api.dicebear.com/7.x/initials/svg?seed=AC',
      channels: [
        { id: 'chan-group', name: 'group-chat', type: 'text', category: 'MAIN' },
        { id: 'chan-ai', name: 'ask-omar-ai', type: 'text', category: 'MAIN' },
        { id: 'chan-voice', name: 'Lounge', type: 'voice', category: 'VOICE' }
      ]
    }
  ],
  activeServerId: 'server-auto',
  activeChannelId: 'chan-group',
  messages: {
    'chan-group': [
      { id: 'm1', userId: 'u-mazen', content: 'Hey everyone, welcome to the Auto Community!', timestamp: new Date(Date.now() - 3600000), isAI: false },
      { id: 'm2', userId: 'u-shata', content: 'Omar Shata here, ready for some fun.', timestamp: new Date(Date.now() - 3000000), isAI: false },
      { id: 'm-bot', userId: 'user-bot', content: 'Hello squad! I am Omar AI. I am ready to help on mobile!', timestamp: new Date(Date.now() - 2500000), isAI: true }
    ],
    'chan-ai': []
  },
  members: [
    USERS['mazen'].user, USERS['zeyad'].user, USERS['gasser'].user, 
    USERS['omar shata'].user, USERS['omar el sokhari'].user,
    { id: 'user-bot', name: 'Omar AI', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=omarai', status: 'online', isBot: true }
  ]
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLogin = (username: string, pass: string) => {
    const userEntry = USERS[username.toLowerCase()];
    if (userEntry && userEntry.pass === pass) {
      setState(prev => ({ ...prev, currentUser: userEntry.user }));
      setIsAuthenticated(true);
    }
  };

  if (!isAuthenticated) return <LoginPage onLogin={handleLogin} />;

  return (
    <div className="flex h-screen w-full select-none overflow-hidden bg-[#1e1f22] safe-area-top">
      {/* Mobile Safe Area Adjustment */}
      <style>{`
        .safe-area-top { padding-top: env(safe-area-inset-top); }
      `}</style>

      {!isOnline && (
        <div className="absolute top-0 left-0 right-0 bg-[#f23f43] text-white text-[12px] font-bold text-center py-1 z-50 animate-pulse">
          Offline Mode - Limited AI
        </div>
      )}
      
      <ServerList servers={state.servers} activeServerId={state.activeServerId} onSelectServer={(id) => setState(p => ({...p, activeServerId: id}))} />

      <div className="flex flex-1 overflow-hidden">
        <ChannelSidebar 
          server={state.servers.find(s => s.id === state.activeServerId)!} 
          activeChannelId={state.activeChannelId}
          onSelectChannel={(id) => setState(p => ({...p, activeChannelId: id}))}
          currentUser={state.currentUser}
        />

        <ChatContainer 
          channel={state.servers.find(s => s.id === state.activeServerId)!.channels.find(c => c.id === state.activeChannelId)!}
          messages={state.messages[state.activeChannelId] || []}
          members={state.members}
          onSendMessage={(content, isAI, userId) => {
            const msg = { id: Math.random().toString(), userId: userId || state.currentUser.id, content, timestamp: new Date(), isAI };
            setState(prev => ({
              ...prev,
              messages: { ...prev.messages, [state.activeChannelId]: [...(prev.messages[state.activeChannelId] || []), msg] }
            }));
          }}
        />

        <MemberSidebar members={state.members} />
      </div>
    </div>
  );
};

export default App;
