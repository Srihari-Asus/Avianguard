
import React, { useState, useEffect } from 'react';
import {
  Sprout, BarChart3, Map as MapIcon, BookOpen, Settings,
  Bell, Cpu, LogOut, User, Menu, X, Sun, Moon, Search,
  Compass, Zap, Database, Layers, Camera
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import NotificationPanel from './NotificationPanel';
import { useNotifications } from '../contexts/NotificationContext';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { userProfile, signOut } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll
  } = useNotifications();

  // Initialize theme from storage
  useEffect(() => {
    const savedTheme = localStorage.getItem('avianguard-theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('avianguard-theme', newTheme);
  };

  const tabs = [
    { id: 'dashboard', icon: Compass, label: 'Control Center' },
    { id: 'guardian', icon: Cpu, label: 'Guardians' },
    { id: 'report', icon: Layers, label: 'Observations' },
    { id: 'analytics', icon: BarChart3, label: 'Intelligence' },
    { id: 'detection', icon: Camera, label: 'AI Detection' },
    { id: 'archive', icon: BookOpen, label: 'Archive' },
    { id: 'profile', icon: User, label: 'Steward' },
  ];

  const displayName = userProfile?.displayName || 'Guardian User';
  const photoURL = userProfile?.photoURL || '';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen flex bg-app transition-colors duration-500">
      {/* Immersive Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-emerald-500/5 dark:bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[35%] h-[35%] bg-amber-500/[0.02] dark:bg-amber-500/2 rounded-full blur-[100px]" />
      </div>

      {/* Sidebar - Desktop */}
      <aside
        className={`fixed left-0 top-0 h-screen transition-all duration-500 z-50 hidden md:flex flex-col border-r border-soft glass ${isSidebarCollapsed ? 'w-20' : 'w-72'
          }`}
      >
        <div className="p-6 flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0 neon-pulse shadow-lg shadow-emerald-500/30">
              <Sprout className="text-white w-6 h-6" />
            </div>
            {!isSidebarCollapsed && (
              <h1 className="text-xl font-bold tracking-tight text-main whitespace-nowrap animate-fade">
                Avian<span className="text-primary">Guard</span>
              </h1>
            )}
          </div>
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 hover:bg-soft rounded-lg transition-colors text-muted hover:text-primary"
          >
            {isSidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative group overflow-hidden ${activeTab === tab.id
                ? 'bg-primary text-white shadow-lg'
                : 'text-muted hover:bg-soft hover:text-main'
                }`}
            >
              <tab.icon className={`w-5 h-5 shrink-0 ${activeTab === tab.id ? 'animate-pulse' : ''}`} />
              {!isSidebarCollapsed && (
                <span className="font-semibold tracking-wide animate-fade">{tab.label}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto p-4 space-y-2 border-t border-soft">

          <button
            onClick={() => setActiveTab('system')}
            className={`w-full flex items-center gap-3 px-4 py-3 transition-all rounded-xl group ${activeTab === 'system'
              ? 'bg-primary text-white shadow-lg'
              : 'text-muted hover:text-primary hover:bg-soft'
              }`}
          >
            <Settings className={`w-5 h-5 group-hover:rotate-90 transition-transform duration-500 ${activeTab === 'system' ? 'rotate-90' : ''}`} />
            {!isSidebarCollapsed && <span className="font-medium animate-fade">System Meta</span>}
          </button>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-stone-400 hover:text-red-500 transition-all rounded-xl hover:bg-red-500/5 group"
          >
            <LogOut className="w-5 h-5" />
            {!isSidebarCollapsed && <span className="font-medium animate-fade">Relinquish Access</span>}
          </button>

          {!isSidebarCollapsed && (
            <div className="px-4 py-3 bg-primary/5 rounded-2xl mt-4 border border-primary/10">
              <p className="text-[10px] text-muted font-bold tracking-[0.2em] uppercase mb-1">Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent-neon rounded-full animate-pulse" />
                <span className="text-[11px] font-bold text-primary">Guardian Network Secure</span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main
        className={`flex-1 min-h-screen relative z-10 transition-all duration-500 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-72'
          } pb-24 md:pb-0`}
      >
        {/* Futuristic Floating Header */}
        <header className="sticky top-0 z-40 px-6 py-4">
          <div className="max-w-[1600px] mx-auto flex justify-between items-center bg-card dark:backdrop-blur-xl border border-light rounded-3xl px-6 py-4 shadow-glass transition-all duration-500">
            <div className="flex items-center gap-6">
              <div className="hidden lg:flex items-center gap-3 px-4 py-2.5 bg-soft rounded-2xl border border-soft group focus-within:border-primary transition-all">
                <Search className="w-4 h-4 text-muted group-hover:text-primary" />
                <input
                  type="text"
                  placeholder="Scan regional data..."
                  className="bg-transparent border-none p-0 text-sm w-48 focus:ring-0 focus:outline-none placeholder:text-stone-400"
                />
              </div>
              <div className="flex items-center gap-2 md:hidden">
                <Sprout className="text-primary w-6 h-6" />
                <span className="font-bold text-main">AvianGuard</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Modern Theme Switch */}
              <div
                onClick={toggleTheme}
                className="theme-switch"
              >
                <div className="theme-switch-thumb">
                  {theme === 'light' ? <Sun /> : <Moon />}
                </div>
              </div>

              <div className="h-8 w-[1px] bg-soft" />

              <button
                onClick={() => setIsNotificationsOpen(true)}
                className="relative w-11 h-11 flex items-center justify-center bg-soft rounded-2xl hover:bg-primary-light hover:text-primary transition-all group"
              >
                <Bell className="w-5 h-5 text-muted group-hover:scale-110 transition-transform" />
                {unreadCount > 0 && (
                  <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-amber-500 border-2 border-app rounded-full animate-pulse" />
                )}
              </button>

              <div className="h-8 w-[1px] bg-soft" />

              <div
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-3 group cursor-pointer bg-soft hover:bg-primary-light p-1.5 pr-4 rounded-2xl transition-all border border-transparent hover:border-primary/20"
              >
                {photoURL ? (
                  <img
                    src={photoURL}
                    alt={displayName}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-xl border-2 border-white dark:border-stone-800 shadow-md object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center border-2 border-white dark:border-stone-800 shadow-md group-hover:scale-105 transition-transform">
                    <span className="text-white font-bold text-xs">{initials}</span>
                  </div>
                )}
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-main leading-tight group-hover:text-primary transition-colors">{displayName}</p>
                  <p className="text-[9px] text-muted font-bold uppercase tracking-widest mt-0.5">
                    {userProfile?.farmerProfile?.role || 'Field Steward'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Container */}
        <div className="px-6 lg:px-10 pb-10 max-w-[1600px] mx-auto min-h-[calc(100vh-100px)]">
          <div className="mb-10 mt-4 animate-fade">
            <h2 className="text-4xl lg:text-5xl font-bold text-main tracking-tight capitalize mb-2">
              {activeTab === 'dashboard' ? 'Control Center' : activeTab}
            </h2>
            <p className="text-muted font-medium lg:text-lg">
              {activeTab === 'dashboard' && 'Autonomous intelligence monitoring field integrity.'}
              {activeTab === 'guardian' && 'Real-time telemetry from your primary defense matrix.'}
              {activeTab === 'profile' && 'Manage your steward credentials and synchronization.'}
            </p>
          </div>

          <div className="relative animate-fade" style={{ animationDelay: '0.1s' }}>
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Nav - Reimagined as a floating dock */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 z-50">
        <div className="bg-card dark:bg-card/80 dark:backdrop-blur-2xl border border-light rounded-[2.5rem] p-3 shadow-glass flex justify-around items-center">
          {tabs.slice(0, 5).map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setIsMobileMenuOpen(false);
              }}
              className={`flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${activeTab === tab.id
                ? 'bg-primary text-white shadow-lg shadow-emerald-500/30 -translate-y-2'
                : 'text-muted hover:text-main'
                }`}
            >
              <tab.icon className="w-6 h-6" />
            </button>
          ))}
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-12 h-12 rounded-2xl overflow-hidden border-2 transition-all ${activeTab === 'profile' ? 'border-primary -translate-y-2 scale-110 shadow-lg shadow-emerald-500/20' : 'border-transparent'
              }`}
          >
            {photoURL ? (
              <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-primary flex items-center justify-center text-white font-bold text-xs">{initials}</div>
            )}
          </button>
        </div>
      </nav>

      {/* Slide-out Notification Panel */}
      <NotificationPanel
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onClearAll={clearAll}
      />
    </div>
  );
};

export default Layout;

