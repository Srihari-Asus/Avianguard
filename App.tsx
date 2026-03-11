
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Onboarding from './components/Onboarding';
import LoginPage from './components/LoginPage';
import LivingMap from './components/LivingMap';
import DecisionSimulator from './components/DecisionSimulator';
import HardwareDashboard from './components/HardwareDashboard';
import ProfilePage from './components/ProfilePage';
import KnowledgeArchive from './components/KnowledgeArchive';
import SystemMeta from './components/SystemMeta';
import BirdDetection from './components/BirdDetection';
import { FarmerProfile, DamageReport } from './types';
import { getAdaptiveAdvisory } from './services/geminiService';
import { updateUserProfile } from './services/userService';
import { useAuth } from './contexts/AuthContext';
import {
  Sprout, Users, GraduationCap, CheckCircle2, ChevronRight,
  Bird, Zap, ShieldAlert, Thermometer, Droplets, RefreshCw,
  Cpu, Loader2, Compass, BarChart3, Search, Bell
} from 'lucide-react';

const App: React.FC = () => {
  const { user, userProfile, loading, setUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [advisory, setAdvisory] = useState<any>(null);
  const [isLoadingAdvisory, setIsLoadingAdvisory] = useState(false);
  const [greeting, setGreeting] = useState('');

  // Mock initial reports
  const [reports] = useState<DamageReport[]>([
    { id: '1', timestamp: Date.now(), cropStage: 'Milky Stage', severity: 7, observation: 'Hardware detection confirmed: Parakeet flock.', coordinates: [0, 0], isVerified: true },
  ]);

  const profile: FarmerProfile | null = userProfile?.farmerProfile || null;

  const handleOnboardingComplete = async (data: any) => {
    if (!user || !userProfile) return;

    const farmerProfile: FarmerProfile = {
      id: user.uid,
      name: userProfile.displayName || 'Guardian User',
      ...data,
    };

    try {
      await updateUserProfile(user.uid, {
        onboarded: true,
        farmerProfile,
      });
      setUserProfile({
        ...userProfile,
        onboarded: true,
        farmerProfile,
      });
    } catch (error) {
      console.error('Error saving onboarding data:', error);
    }
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    if (userProfile?.onboarded && profile) {
      setIsLoadingAdvisory(true);
      getAdaptiveAdvisory(profile, reports).then(res => {
        setAdvisory(res);
        setIsLoadingAdvisory(false);
      });
    }
  }, [userProfile?.onboarded, profile, reports]);

  // Loading state while checking auth
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-app transition-colors duration-500">
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 bg-primary rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-500/30 neon-pulse">
            <Sprout className="w-10 h-10 text-white" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <p className="text-[11px] font-bold text-muted uppercase tracking-[0.3em]">Guardian Matrix Initializing</p>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated → Show login
  if (!user) {
    return <LoginPage />;
  }

  // Authenticated but not onboarded → Show onboarding
  if (!userProfile?.onboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && (
        <div className="space-y-10 animate-fade">
          {/* Personalized Greeting & Dynamic Insight */}
          <section className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative z-10 p-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="px-3 py-1 bg-primary/10 rounded-full border border-primary/20 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-accent-neon rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Operational Excellence</span>
                </div>
                <span className="text-muted text-xs font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-main tracking-tight mb-4">
                {greeting}, <span className="text-primary">{userProfile.displayName?.split(' ')[0]}</span>.
              </h1>
              <p className="text-muted text-lg lg:text-xl max-w-3xl leading-relaxed">
                Your Guardian network is currently monitoring <span className="text-main font-semibold">4.5 acres</span> of <span className="text-main font-semibold">{profile?.cropType || 'Maize'}</span>.
                Field integrity is at <span className="text-primary font-bold">98% efficiency</span> today.
              </p>
            </div>
          </section>

          {/* Real-time Telemetry Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Guardian Pulse', value: 'Active', icon: Cpu, color: 'emerald', sub: 'Node #001 Online' },
              { label: 'Ambient Temp', value: '32°C', icon: Thermometer, color: 'amber', sub: 'Optimal Range' },
              { label: 'Hydration Level', value: '64%', icon: Droplets, color: 'blue', sub: 'Stable Saturation' },
              { label: 'Aggression Risk', value: 'Low', icon: Bird, color: 'emerald', sub: '0 Incidents (24h)' },
            ].map((stat, i) => (
              <div key={i} className="glass-card p-6 flex flex-col justify-between h-44 group">
                <div className="flex justify-between items-start">
                  <div className={`p-3 rounded-2xl group-hover:scale-110 transition-transform ${stat.color === 'emerald' ? 'bg-emerald-500/10' : stat.color === 'amber' ? 'bg-amber-500/10' : 'bg-blue-500/10'
                    }`}>
                    <stat.icon className={`w-6 h-6 ${stat.color === 'emerald' ? 'text-emerald-500' : stat.color === 'amber' ? 'text-amber-500' : 'text-blue-500'
                      }`} />
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-soft rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[8px] font-bold uppercase tracking-widest text-muted">Real-time</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-1">{stat.label}</div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-3xl font-bold text-main">{stat.value}</div>
                    <div className="text-[10px] font-bold text-primary/70 uppercase">{stat.sub}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Central Map & AI Intelligence */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
              {/* Immersive Map Container */}
              <div className="glass-card p-1 overflow-hidden relative group h-[500px]">
                <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                  <div className="glass px-4 py-2 rounded-2xl border border-light flex items-center gap-3">
                    <Compass className="w-4 h-4 text-primary animate-spin-slow" />
                    <span className="text-xs font-bold text-main">Tactical Field Visualization</span>
                  </div>
                  <div className="bg-primary/90 text-white px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest backdrop-blur-md self-start">
                    GIS Layer: Active
                  </div>
                </div>
                <div className="w-full h-full rounded-[1.75rem] overflow-hidden bg-stone-100 dark:bg-stone-900 border border-soft transition-colors duration-500">
                  <LivingMap />
                </div>
                <div className="absolute bottom-6 right-6 z-10 flex gap-2">
                  <button className="btn-glass px-4 py-2 hover:bg-primary hover:text-white">Relocate Node</button>
                  <button className="btn-primary">Expand Network</button>
                </div>
              </div>

              {/* AI Intelligence Card */}
              <div className="glass-card p-10 relative overflow-hidden h-fit">
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                  <Zap className="w-64 h-64 text-primary" />
                </div>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <Zap className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-main">Adaptive Intelligence</h3>
                      <p className="text-xs text-muted font-medium mt-0.5">Gemini-powered strategic advisory.</p>
                    </div>
                  </div>
                  {isLoadingAdvisory && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
                </div>

                {advisory ? (
                  <div className="animate-fade">
                    <div className="p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10 mb-8 hover:bg-primary/10 transition-colors">
                      <h4 className="text-xl font-bold text-primary mb-3 flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5" />
                        Strategic Insight
                      </h4>
                      <p className="text-main leading-relaxed text-2xl font-semibold tracking-tight mb-6 italic">
                        "{advisory.message}"
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="px-4 py-1.5 bg-white dark:bg-stone-800 rounded-full border border-soft inline-flex items-center gap-2 text-xs font-bold text-main shadow-sm">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                          Expected Impact: {advisory.impact}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <RefreshCw className="w-12 h-12 text-primary/20 animate-spin mb-4" />
                    <p className="text-muted font-bold text-xs uppercase tracking-[0.2em]">Synchronizing Logic Matrix...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Regional Intelligence Feed */}
            <div className="flex flex-col gap-8">
              <div className="glass-card p-8 flex-1 border-primary/20 bg-gradient-to-br from-bg-card to-primary/5">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-main rounded-xl shadow-lg">
                      <Users className="w-5 h-5 text-accent-neon" />
                    </div>
                    <h3 className="text-xl font-bold text-main">Global Collective</h3>
                  </div>
                  <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Live Hub</span>
                </div>

                <div className="space-y-4">
                  {[
                    { text: 'Unusual gathering of Swifts near River bank', farm: '400m away', time: '2h ago', risk: 'Medium' },
                    { text: 'Node failure reported in Sector B', farm: '2.1km away', time: '4h ago', risk: 'Maintenance' },
                    { text: 'Milky stage harvest starting early', farm: '1.2km away', time: '5h ago', risk: 'Info' }
                  ].map((item, idx) => (
                    <div key={idx} className="p-5 rounded-3xl border border-soft hover:border-primary/30 transition-all cursor-pointer group hover:translate-x-1">
                      <p className="text-sm text-main mb-4 leading-relaxed italic opacity-80 group-hover:opacity-100">"{item.text}"</p>
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] font-bold text-muted uppercase tracking-widest">{item.farm}</span>
                          <span className="text-[9px] font-bold text-stone-400">{item.time}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-tighter ${item.risk === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-primary/10 text-primary'
                          }`}>
                          {item.risk}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="mt-8 w-full btn-primary justify-center py-4 rounded-2xl">
                  Broadcast Intel
                </button>
              </div>

              {/* Quick Action Dock */}
              <div className="glass-card p-6 border-amber-500/20">
                <h4 className="text-xs font-bold text-muted uppercase tracking-[0.2em] mb-4">Tactical Override</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-4 rounded-2xl bg-soft hover:bg-primary-light transition-all flex flex-col gap-2 items-center group">
                    <Zap className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
                    <span className="text-[10px] font-bold text-main">Full Pulse</span>
                  </button>
                  <button className="p-4 rounded-2xl bg-soft hover:bg-primary-light transition-all flex flex-col gap-2 items-center group">
                    <ShieldAlert className="w-5 h-5 text-muted group-hover:text-amber-500 transition-colors" />
                    <span className="text-[10px] font-bold text-main">Emergency</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'guardian' && <HardwareDashboard />}

      {activeTab === 'report' && (
        <div className="max-w-5xl mx-auto py-10 animate-fade">
          <div className="glass-card p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent-neon to-amber-500" />
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="lg:w-1/3">
                <h2 className="text-4xl font-bold text-main leading-tight mb-4">Observation Protocol</h2>
                <p className="text-muted font-medium italic mb-8">Synchronize your biological observations with the machine matrix.</p>
                <div className="space-y-4">
                  {[
                    { label: 'Intelligence Tier', value: 'Guardian Level' },
                    { label: 'Network Trust', value: 'High Response' },
                    { label: 'Last Sync', value: '14 min ago' }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-soft">
                      <span className="text-[10px] font-bold text-muted uppercase">{item.label}</span>
                      <span className="text-xs font-bold text-primary">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:w-2/3 space-y-10">
                <div className="space-y-4">
                  <label className="text-sm font-bold text-main uppercase tracking-widest">Chronos Marker</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['Dawn', 'Solar Peak', 'Dusk', 'Lunar'].map(t => (
                      <button key={t} className="p-4 rounded-2xl border border-soft hover:border-primary hover:bg-primary/5 transition-all font-bold text-muted hover:text-primary text-xs">
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-bold text-main uppercase tracking-widest">Narrative Matrix</label>
                  <textarea
                    className="w-full h-44 rounded-3xl p-6 text-main leading-relaxed"
                    placeholder="Document flock behavior or hardware anomalies..."
                  />
                </div>
                <button className="w-full btn-primary py-5 rounded-[2rem] text-lg justify-center shadow-xl shadow-emerald-500/20">
                  Submit to Collective
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-10 animate-fade">
          <section className="glass-card p-10 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row gap-10 items-center mb-10">
              <div className="lg:w-2/3">
                <h2 className="text-3xl font-bold text-main mb-2">Resilience Projection</h2>
                <p className="text-muted leading-relaxed font-medium">Equilibrium modeling for sustainable agriculture. Calibrating yield preservation vs operational overhead.</p>
              </div>
              <div className="lg:w-1/3 flex justify-end">
                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-muted uppercase tracking-widest">Global Rank</div>
                    <div className="text-xl font-bold text-primary">Top 4%</div>
                  </div>
                </div>
              </div>
            </div>
            <DecisionSimulator />
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-10">
              <h3 className="text-xl font-bold text-main mb-8">Telemetry Oscillations</h3>
              <div className="h-64 flex items-end justify-between gap-3 px-2">
                {[30, 50, 45, 80, 60, 90, 70, 85, 40].map((h, i) => (
                  <div key={i} className="flex-1 bg-gradient-to-t from-primary/20 to-primary/40 rounded-t-xl group relative cursor-crosshair hover:from-primary/40 hover:to-primary" style={{ height: `${h}%` }}>
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-main text-white px-2 py-1 rounded-lg text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      Value: {h}.0
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-4 bg-soft rounded-2xl border border-soft flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
                <p className="text-xs font-bold text-muted uppercase tracking-widest">Active Monitoring: 12ms Latency</p>
              </div>
            </div>

            <div className="glass-card p-0 overflow-hidden bg-gradient-to-br from-emerald-900 to-stone-900 border-none group">
              <div className="p-10 relative z-10 w-full h-full flex flex-col text-white">
                <div className="flex items-center gap-3 text-accent-neon mb-6">
                  <GraduationCap className="w-6 h-6" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em]">Collective Wisdom</span>
                </div>
                <h3 className="text-3xl font-bold mb-4 tracking-tight">Generate Study</h3>
                <p className="text-emerald-100/60 leading-relaxed mb-10 font-medium">
                  Convert your raw telemetry into a formal research abstract for academic distribution or policy advocacy.
                </p>
                <button className="mt-auto w-full py-4 bg-white text-emerald-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-accent-neon hover:text-emerald-950 transition-all shadow-xl group-hover:scale-[1.02]">
                  Synthesize Abstract
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute top-0 right-0 p-10 opacity-10 blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                <Sprout className="w-48 h-48 text-primary" />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'knowledge' && (
        <div className="space-y-10 animate-fade">
          <KnowledgeArchive />
        </div>
      )}

      {activeTab === 'detection' && (
        <div className="space-y-10 animate-fade">
          <BirdDetection />
        </div>
      )}

      {activeTab === 'profile' && <ProfilePage />}

      {activeTab === 'system' && (
        <div className="space-y-10 animate-fade">
          <SystemMeta />
        </div>
      )}
    </Layout>
  );
};

export default App;

