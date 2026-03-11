import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
    User, Mail, Shield, MapPin, Bell, Cpu, Wifi, WifiOff,
    Battery, Signal, ChevronRight, Edit3, Save, X, Clock, Globe,
    Smartphone, Key, Activity, Leaf, Sun, CloudRain, Thermometer,
    CheckCircle2, AlertCircle, LogOut, Camera, RefreshCw, Zap, ShieldAlert,
    Bird
} from 'lucide-react';

const ProfilePage: React.FC = () => {
    const { user, userProfile, signOut } = useAuth();
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editName, setEditName] = useState(userProfile?.displayName || '');
    const [activeSection, setActiveSection] = useState('overview');

    // Notification preferences state
    const [notifications, setNotifications] = useState({
        birdAlerts: true,
        deviceStatus: true,
        communityUpdates: false,
        weeklyReport: true,
        soundAlerts: false,
        emailDigest: true,
    });

    // Farm location state
    const [farmDetails] = useState({
        village: 'Ramanagara',
        district: 'Ramanagara',
        state: 'Karnataka',
        coordinates: '12.7159° N, 77.2810° E',
        elevation: '747m',
        soilType: 'Red Laterite',
        waterSource: 'Borewell + Rain-fed',
        totalArea: '4.5 acres',
    });

    // Mock connected devices
    const connectedDevices = [
        { id: 'ESP-32-V2-8821', name: 'Guardian Node #001', status: 'online' as const, battery: 94, signal: -42, lastPing: '2 min ago', firmware: 'v2.4.1', sector: 'North Field' },
        { id: 'ESP-32-V2-8822', name: 'Guardian Node #002', status: 'online' as const, battery: 78, signal: -56, lastPing: '5 min ago', firmware: 'v2.4.1', sector: 'East Perimeter' },
        { id: 'ESP-32-V2-8823', name: 'Guardian Node #003', status: 'warning' as const, battery: 23, signal: -71, lastPing: '18 min ago', firmware: 'v2.3.8', sector: 'South Canal' },
        { id: 'ESP-32-V2-8824', name: 'Guardian Node #004', status: 'offline' as const, battery: 0, signal: 0, lastPing: '3 days ago', firmware: 'v2.3.5', sector: 'West Boundary' },
    ];

    // Mock activity log
    const activityLog = [
        { action: 'Signed in via Google', time: 'Just now', icon: Key, color: 'emerald' },
        { action: 'Guardian Node #001 calibrated', time: '2h ago', icon: Cpu, color: 'emerald' },
        { action: 'Bird alert responded — Parakeet flock', time: '5h ago', icon: Activity, color: 'amber' },
        { action: 'Weekly report downloaded', time: '1 day ago', icon: Globe, color: 'blue' },
        { action: 'Device firmware updated to v2.4.1', time: '3 days ago', icon: RefreshCw, color: 'blue' },
    ];

    const sectionTabs = [
        { id: 'overview', label: 'Overview', icon: User },
        { id: 'farm', label: 'Farm & Location', icon: MapPin },
        { id: 'devices', label: 'Device Network', icon: Cpu },
        { id: 'notifications', label: 'Alerts', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online': return 'text-emerald-500';
            case 'warning': return 'text-amber-500';
            case 'offline': return 'text-stone-400';
            default: return 'text-stone-400';
        }
    };

    const getStatusDot = (status: string) => {
        switch (status) {
            case 'online': return 'bg-emerald-500';
            case 'warning': return 'bg-amber-500';
            case 'offline': return 'bg-stone-400';
            default: return 'bg-stone-400';
        }
    };

    return (
        <div className="space-y-12 animate-fade max-w-[1400px] mx-auto pb-20">
            {/* Profile Hero Section */}
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-emerald-900 to-stone-900 rounded-[3rem] p-12 overflow-hidden shadow-2xl border border-white/10">
                    <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none transition-transform duration-1000 group-hover:scale-110">
                        <Leaf className="w-80 h-80 text-white" />
                    </div>
                </div>

                <div className="relative z-10 p-12 flex flex-col xl:flex-row items-center xl:items-start gap-12 text-white">
                    {/* Avatar Block */}
                    <div className="relative group/avatar">
                        <div className="w-40 h-40 rounded-[3rem] overflow-hidden border-4 border-white/20 shadow-2xl transition-all duration-500 group-hover/avatar:border-primary">
                            {userProfile?.photoURL ? (
                                <img
                                    src={userProfile.photoURL}
                                    alt={userProfile.displayName || 'User'}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-700"
                                />
                            ) : (
                                <div className="w-full h-full bg-white/10 flex items-center justify-center">
                                    <span className="text-6xl font-bold">{userProfile?.displayName?.charAt(0) || 'U'}</span>
                                </div>
                            )}
                        </div>
                        <button className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-xl border-4 border-emerald-900 hover:scale-110 transition-all">
                            <Camera className="w-5 h-5 text-white" />
                        </button>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent-neon rounded-full border-4 border-emerald-900 animate-pulse shadow-lg" />
                    </div>

                    {/* Info Block */}
                    <div className="flex-1 text-center xl:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 mb-6">
                            <span className="w-1.5 h-1.5 bg-accent-neon rounded-full" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-200">Active Field Guardian</span>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4 justify-center xl:justify-start">
                            {isEditingProfile ? (
                                <div className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="text-4xl font-bold bg-white/10 border border-white/20 rounded-2xl px-6 py-2 text-white outline-none focus:border-primary w-full max-w-md"
                                    />
                                    <button onClick={() => setIsEditingProfile(false)} className="p-3 bg-primary rounded-xl hover:bg-primary-light transition-all shadow-lg">
                                        <Save className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => { setIsEditingProfile(false); setEditName(userProfile?.displayName || ''); }} className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4 justify-center xl:justify-start">
                                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">{userProfile?.displayName}</h1>
                                    <button onClick={() => setIsEditingProfile(true)} className="p-2.5 bg-white/10 rounded-xl hover:bg-white/20 transition-all border border-white/5">
                                        <Edit3 className="w-5 h-5 opacity-80 hover:opacity-100" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <p className="text-xl text-emerald-100/60 font-medium mb-8">
                            Managing <span className="text-white font-bold">{farmDetails.totalArea}</span> of <span className="text-primary-light font-bold">{userProfile?.farmerProfile?.cropType || 'Crop'}</span> in Karnataka.
                        </p>

                        <div className="flex flex-wrap gap-4 justify-center xl:justify-start">
                            {[
                                { label: 'Active Nodes', value: connectedDevices.filter(d => d.status === 'online').length, icon: Cpu },
                                { label: 'Integrity', value: '98%', icon: ShieldAlert },
                                { label: 'Session', value: '42m', icon: Clock },
                            ].map((stat, i) => (
                                <div key={i} className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 hover:bg-white/10 transition-colors">
                                    <stat.icon className="w-3.5 h-3.5 text-primary-light" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-emerald-100/50 uppercase font-bold leading-none mb-0.5">{stat.label}</span>
                                        <span className="text-sm font-bold text-white uppercase tracking-wider leading-none">{stat.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Analytics Dock */}
                    <div className="hidden xl:grid grid-cols-2 gap-4">
                        {[
                            { label: 'EFFICIENCY', value: '92%', sub: '+3% improvement', color: 'emerald' },
                            { label: 'ALERTS', value: '14', sub: 'Last 24 hours', color: 'amber' },
                        ].map((stat, i) => (
                            <div key={i} className="glass-card p-6 min-w-[180px] bg-white/5 border-white/10 transition-all hover:bg-white/10">
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4 text-center">{stat.label}</p>
                                <p className="text-4xl font-bold text-white text-center mb-1">{stat.value}</p>
                                <p className={`text-[10px] font-bold text-${stat.color}-400 text-center uppercase tracking-tight`}>{stat.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Navigation Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1 space-y-4">
                    <h3 className="text-[10px] font-bold text-muted uppercase tracking-[0.3em] ml-6 mb-6">Management Matrix</h3>
                    <div className="glass-card p-2 flex flex-col gap-1">
                        {sectionTabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveSection(tab.id)}
                                className={`flex items-center justify-between px-6 py-4 rounded-2xl font-bold text-sm transition-all duration-300 group ${activeSection === tab.id
                                    ? 'bg-primary text-white shadow-lg'
                                    : 'text-muted hover:bg-soft hover:text-main'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <tab.icon className={`w-5 h-5 ${activeSection === tab.id ? 'text-white' : 'text-primary/60 group-hover:text-primary transition-colors'}`} />
                                    {tab.label}
                                </div>
                                {activeSection === tab.id && <ChevronRight className="w-4 h-4" />}
                            </button>
                        ))}
                    </div>

                    {/* Bottom Action */}
                    <button
                        onClick={signOut}
                        className="w-full flex items-center justify-center gap-3 py-5 px-6 rounded-[2rem] border-2 border-red-500/10 text-red-500 font-bold hover:bg-red-500/5 transition-all text-sm group"
                    >
                        <LogOut className="w-5 h-5 group-hover:translate-x-[-4px] transition-transform" />
                        Disconnect Matrix
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3 min-h-[600px]">
                    <div className="animate-fade">
                        {activeSection === 'overview' && (
                            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                                {/* Profile Info Details */}
                                <div className="xl:col-span-3 space-y-8">
                                    <div className="glass-card p-10">
                                        <div className="flex items-center gap-4 mb-10">
                                            <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                                                <User className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-main">Biological Identity</h3>
                                                <p className="text-xs text-muted font-medium uppercase tracking-widest mt-0.5">Verified Profile Data</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {[
                                                { label: 'Guardian Identifier', value: userProfile?.displayName || 'N/A', icon: User },
                                                { label: 'Neural Link Email', value: userProfile?.email || 'N/A', icon: Mail },
                                                { label: 'Operational Role', value: userProfile?.farmerProfile?.role || 'FIELD STEWARD', icon: Shield },
                                                { label: 'Strategic Crop', value: userProfile?.farmerProfile?.cropType || 'N/A', icon: Leaf },
                                                { label: 'Observation Tier', value: 'Level 4 Protector', icon: Zap },
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-soft hover:border-primary/30 hover:bg-primary/5 transition-all group">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-soft flex items-center justify-center border border-soft group-hover:border-primary/20 transition-colors">
                                                            <item.icon className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-0.5">{item.label}</p>
                                                            <p className="text-main font-bold text-base md:text-lg">{item.value}</p>
                                                        </div>
                                                    </div>
                                                    <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Edit3 className="w-4 h-4 text-muted hover:text-primary" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Timeline / Activity */}
                                <div className="xl:col-span-2 space-y-8 text-white">
                                    <div className="glass-card p-10 bg-gradient-to-br from-stone-900 via-stone-900 to-stone-800 dark:from-black dark:to-stone-900 border-none shadow-2xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[100px] pointer-events-none" />
                                        <div className="flex items-center justify-between mb-10 relative z-10">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-white/10 rounded-2xl dark:backdrop-blur-md border border-white/10">
                                                    <Clock className="w-6 h-6 text-primary-light" />
                                                </div>
                                                <h3 className="text-2xl font-bold">Activity Log</h3>
                                            </div>
                                            <Activity className="w-5 h-5 text-primary-light animate-pulse" />
                                        </div>

                                        <div className="space-y-8 relative z-10">
                                            <div className="absolute left-6 top-0 bottom-0 w-px bg-white/5" />
                                            {activityLog.map((log, i) => (
                                                <div key={i} className="flex items-start gap-5 relative group">
                                                    <div className="w-12 h-12 rounded-2xl bg-white/10 dark:bg-white/5 dark:backdrop-blur-xl border border-white/10 flex items-center justify-center shrink-0 shadow-lg group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                                                        <log.icon className="w-5 h-5" />
                                                    </div>
                                                    <div className="pt-1 flex-1">
                                                        <div className="flex justify-between items-start gap-2">
                                                            <p className="text-sm font-bold text-white leading-snug group-hover:text-primary-light transition-colors">{log.action}</p>
                                                            <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest whitespace-nowrap mt-1">{log.time}</p>
                                                        </div>
                                                        <div className="w-full h-[1px] bg-white/5 mt-4 group-hover:bg-primary/20 transition-colors" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="glass-card p-10 border-primary/20 bg-primary/5">
                                        <div className="flex items-center gap-3 mb-4">
                                            <ShieldAlert className="w-5 h-5 text-primary" />
                                            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Security Pulse</span>
                                        </div>
                                        <p className="text-main font-bold text-lg mb-4">Trust level is Optimal</p>
                                        <p className="text-muted text-sm leading-relaxed mb-6">Your identity matrix is synchronized across 4 verified devices.</p>
                                        <button className="w-full btn-glass py-4">Security Protocol</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'farm' && (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                <div className="glass-card p-10 space-y-10">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-primary/10 rounded-2xl">
                                                <MapPin className="w-6 h-6 text-primary" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-main">Geospatial Marker</h3>
                                        </div>
                                        <button className="btn-glass px-4 py-2">Update GIS</button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[
                                            { label: 'Village Cluster', value: farmDetails.village },
                                            { label: 'District Hub', value: farmDetails.district },
                                            { label: 'State Matrix', value: farmDetails.state },
                                            { label: 'GPS Precision', value: farmDetails.coordinates },
                                            { label: 'Altitudinal Reach', value: farmDetails.elevation },
                                        ].map((item, i) => (
                                            <div key={i} className="p-5 bg-soft rounded-3xl border border-soft transition-all hover:bg-white dark:hover:bg-stone-800">
                                                <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-1.5">{item.label}</p>
                                                <p className="text-main font-bold text-base">{item.value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Immersive Map Visual */}
                                    <div className="h-64 rounded-[2.5rem] bg-gradient-to-br from-emerald-500/10 to-stone-500/10 border border-soft relative overflow-hidden group">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Globe className="w-40 h-40 text-primary/10 animate-spin-slow" />
                                        </div>
                                        <div className="absolute inset-0 bg-white/5 dark:backdrop-blur-[1px]" />
                                        <div className="relative z-10 p-8 flex flex-col items-center justify-center text-center">
                                            <div className="w-4 h-4 bg-primary rounded-full animate-ping mb-4 shadow-xl" />
                                            <p className="text-xs font-bold text-primary uppercase tracking-[0.3em]">Guardian GIS Active</p>
                                            <p className="text-muted text-[10px] mt-2 font-medium">Coordinate Sync Root: Ramanagara-Grid-001</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="glass-card p-10 space-y-10 border-primary/20 bg-primary/5">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-primary text-white rounded-2xl shadow-lg">
                                            <Leaf className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-main">Ecological Profile</h3>
                                    </div>

                                    <div className="space-y-4">
                                        {[
                                            { label: 'Operational Coverage', value: farmDetails.totalArea, icon: MapPin },
                                            { label: 'Soil Composition', value: farmDetails.soilType, icon: Leaf },
                                            { label: 'Hydration Vector', value: farmDetails.waterSource, icon: CloudRain },
                                            { label: 'Climatic Zone', value: 'Semi-Arid Tropical', icon: Thermometer },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-5 p-6 bg-white dark:bg-stone-800 rounded-[2rem] border border-soft shadow-sm group hover:scale-[1.02] transition-all cursor-default">
                                                <div className="w-14 h-14 rounded-2xl bg-soft flex items-center justify-center border border-soft group-hover:bg-primary transition-all">
                                                    <item.icon className="w-6 h-6 text-muted group-hover:text-white transition-colors" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">{item.label}</p>
                                                    <p className="text-main font-bold text-xl">{item.value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="p-8 bg-white dark:bg-stone-900 rounded-[2.5rem] border border-soft shadow-inner">
                                        <div className="flex items-center gap-3 mb-4">
                                            <ShieldAlert className="w-5 h-5 text-primary" />
                                            <p className="text-xs font-bold text-primary uppercase tracking-widest">Environment Insight</p>
                                        </div>
                                        <p className="text-main leading-relaxed font-medium italic text-lg opacity-80">
                                            "Target area topography supports long-range frequency propagation. Soil analysis suggests stable node anchoring for upcoming monsoon."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'devices' && (
                            <div className="space-y-10">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {[
                                        { label: 'TOTAL NODES', value: connectedDevices.length, color: 'text-main', icon: Cpu, bg: 'bg-primary/5' },
                                        { label: 'OPERATIONAL', value: connectedDevices.filter(d => d.status === 'online').length, color: 'text-emerald-500', icon: Wifi, bg: 'bg-emerald-500/5' },
                                        { label: 'ANOMALIES', value: connectedDevices.filter(d => d.status === 'warning').length, color: 'text-amber-500', icon: ShieldAlert, bg: 'bg-amber-500/5' },
                                        { label: 'OFFLINE', value: connectedDevices.filter(d => d.status === 'offline').length, color: 'text-muted', icon: WifiOff, bg: 'bg-stone-500/5' },
                                    ].map((stat, i) => (
                                        <div key={i} className={`glass-card p-8 ${stat.bg} border-soft group hover:translate-y-[-4px] transition-all`}>
                                            <div className="flex justify-between items-start mb-6">
                                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                                <span className="text-[9px] font-bold text-muted tracking-widest leading-none">REALTIME</span>
                                            </div>
                                            <p className={`text-4xl font-bold ${stat.color} mb-2 tracking-tighter`}>{stat.value}</p>
                                            <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                    {connectedDevices.map((device) => (
                                        <div key={device.id} className="glass-card p-8 group overflow-hidden relative">
                                            <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl opacity-10 transition-opacity group-hover:opacity-20 ${getStatusDot(device.status)}`} />

                                            <div className="flex items-center justify-between mb-8">
                                                <div className="flex items-center gap-5">
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${device.status === 'online' ? 'bg-emerald-500/10 text-emerald-500' :
                                                        device.status === 'warning' ? 'bg-amber-500/10 text-amber-500' : 'bg-stone-500/10 text-stone-400'
                                                        }`}>
                                                        {device.status === 'offline' ? <WifiOff className="w-7 h-7" /> : <Wifi className="w-7 h-7" />}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-2xl font-bold text-main tracking-tight">{device.name}</h4>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${getStatusDot(device.status)} ${device.status === 'online' ? 'animate-pulse' : ''}`} />
                                                            <p className={`text-[10px] font-bold uppercase tracking-widest ${getStatusColor(device.status)}`}>{device.status}</p>
                                                            <span className="text-stone-300 mx-1">|</span>
                                                            <p className="text-[10px] font-bold text-muted uppercase tracking-widest">{device.sector}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button className="btn-glass p-3 opacity-0 group-hover:opacity-100 transition-all">
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-3 gap-4">
                                                {[
                                                    { icon: Battery, label: 'Charge', value: `${device.battery}%`, color: device.battery > 50 ? 'text-emerald-500' : 'text-amber-500' },
                                                    { icon: Signal, label: 'LORA', value: device.signal ? `${device.signal}dBm` : 'NAN', color: 'text-primary' },
                                                    { icon: Clock, label: 'Synced', value: device.lastPing, color: 'text-muted' },
                                                ].map((stat, i) => (
                                                    <div key={i} className="p-4 bg-soft/50 rounded-2xl border border-soft hover:bg-soft transition-colors text-center aspect-square flex flex-col items-center justify-center">
                                                        <stat.icon className={`w-4 h-4 mb-2 ${stat.color}`} />
                                                        <p className="text-[9px] font-bold text-muted uppercase tracking-[0.1em] mb-1 leading-none">{stat.label}</p>
                                                        <p className="text-base font-bold text-main leading-none">{stat.value}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-8 flex items-center justify-between pt-6 border-t border-soft">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-[9px] font-mono text-muted uppercase">Guardian-HW Revision Index</span>
                                                    <span className="text-[10px] font-bold text-main uppercase racking-widest">{device.id} (FW {device.firmware})</span>
                                                </div>
                                                <button className="text-xs font-bold text-primary uppercase tracking-[0.2em] hover:text-primary-light transition-colors flex items-center gap-2">
                                                    Calibrate
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    <button className="h-full min-h-[280px] border-4 border-dashed border-soft rounded-[3rem] group hover:border-primary/50 transition-all flex flex-col items-center justify-center gap-6 p-8 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-primary/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="w-20 h-20 rounded-[2rem] bg-soft flex items-center justify-center group-hover:bg-primary transition-all shadow-lg group-hover:shadow-emerald-500/20">
                                            <Cpu className="w-10 h-10 text-muted group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xl font-bold text-main mb-2">Initialize Hub</p>
                                            <p className="text-xs text-muted font-medium max-w-[200px] leading-relaxed uppercase tracking-widest">Sync new ESP32 guardian hardware to your farm mesh</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeSection === 'notifications' && (
                            <div className="glass-card p-12 max-w-4xl mx-auto space-y-12">
                                <div className="flex items-center gap-5">
                                    <div className="p-4 bg-amber-500/10 rounded-3xl border border-amber-500/20">
                                        <Bell className="w-8 h-8 text-amber-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-bold text-main">Central Dispatch</h3>
                                        <p className="text-xs text-muted font-bold uppercase tracking-[0.3em] mt-1">Telemetry Alert Matrix</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { key: 'birdAlerts' as const, label: 'AVIAN DETECTION PROTOCOL', desc: 'Critical alerts when bio-sensors detect high-risk parakeet clusters.', icon: Bird, accent: 'primary' },
                                        { key: 'deviceStatus' as const, label: 'HARDWARE TELEMETRY', desc: 'Volt drops, signal jitters, and sensor calibration heartbeats.', icon: Cpu, accent: 'primary' },
                                        { key: 'communityUpdates' as const, label: 'COLLECTIVE INTELLIGENCE', desc: 'Broadcasts from neighboring farms within your coordinate cluster.', icon: Globe, accent: 'blue' },
                                        { key: 'weeklyReport' as const, label: 'YIELD PRESERVATION SUMMARY', desc: 'Deep-dive AI analysis of weekly defense efficacy vs crop stage.', icon: Activity, accent: 'emerald' },
                                        { key: 'soundAlerts' as const, label: 'AUDITORY OVERRIDE', desc: 'Enable native audio signal for imminent field breaches.', icon: Bell, accent: 'amber' },
                                        { key: 'emailDigest' as const, label: 'ARCHIVE DIGEST', desc: 'End-of-day biological activity archive sent to your neural link.', icon: Mail, accent: 'stone' },
                                    ].map((pref) => (
                                        <div key={pref.key} className="flex items-center justify-between p-8 rounded-[2.5rem] border border-soft hover:bg-soft transition-all group">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 rounded-[1.25rem] bg-soft flex items-center justify-center border border-soft group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                                                    <pref.icon className={`w-7 h-7 text-muted group-hover:text-white transition-colors`} />
                                                </div>
                                                <div className="max-w-md">
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                        <p className="font-bold text-main tracking-[0.1em] text-sm uppercase">{pref.label}</p>
                                                        <span className="w-1 h-1 bg-stone-300 rounded-full" />
                                                        <span className="text-[10px] font-bold text-primary uppercase">{pref.accent === 'primary' ? 'Priority' : 'Global'}</span>
                                                    </div>
                                                    <p className="text-sm text-muted font-medium leading-relaxed">{pref.desc}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setNotifications(prev => ({ ...prev, [pref.key]: !prev[pref.key] }))}
                                                className={`relative w-16 h-9 rounded-full transition-all duration-500 shadow-inner group/toggle ${notifications[pref.key] ? 'bg-primary' : 'bg-stone-200 dark:bg-stone-800'
                                                    }`}
                                            >
                                                <div className={`absolute top-1 w-7 h-7 bg-white rounded-full shadow-xl transition-all duration-500 ease-spring ${notifications[pref.key] ? 'left-[32px]' : 'left-1'
                                                    }`}>
                                                    <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${notifications[pref.key] ? 'opacity-100' : 'opacity-0'}`}>
                                                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeSection === 'security' && (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                <div className="glass-card p-10 space-y-12">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                            <Shield className="w-7 h-7 text-blue-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-main">OAuth Synchronicity</h3>
                                            <p className="text-xs text-muted font-bold uppercase tracking-widest mt-1">Neural ID Verification</p>
                                        </div>
                                    </div>

                                    <div className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                                            <Shield className="w-40 h-40" />
                                        </div>
                                        <div className="relative z-10 flex items-center gap-6 mb-8">
                                            <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center shadow-lg">
                                                <svg width="32" height="32" viewBox="0 0 48 48">
                                                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                                                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-xl font-bold">Google Verified</p>
                                                <p className="text-sm opacity-60 font-medium">{userProfile?.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center px-4 py-3 bg-white/10 rounded-2xl border border-white/10">
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Token Integrity</span>
                                            <span className="text-xs font-mono font-bold">SHA-256 SECURED</span>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {[
                                            { label: 'Guardian Hash ID', value: user?.uid?.slice(0, 16) + '...' },
                                            { label: 'Identity Protocol', value: 'OAuth 2.0 Collective' },
                                            { label: 'Matrix Creation', value: user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A' },
                                            { label: 'Active Synchronization', value: user?.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleTimeString() : 'N/A' },
                                        ].map((item, i) => (
                                            <div key={i} className="flex justify-between items-center py-4 border-b border-soft last:border-0 hover:translate-x-1 transition-transform cursor-default group">
                                                <span className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] group-hover:text-primary transition-colors">{item.label}</span>
                                                <span className="text-main font-bold text-sm tracking-tight">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="glass-card p-10">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                                                <Key className="w-6 h-6 text-primary" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-main">Defensive Matrix</h3>
                                        </div>

                                        <div className="space-y-4">
                                            {[
                                                { label: 'Biometric Handshake', status: 'GOOGLE-HW', ok: true },
                                                { label: 'Layer-7 Encryption', status: 'AES-256', ok: true },
                                                { label: 'Firestore Security', status: 'PRODUCTION', ok: true },
                                                { label: 'Hardware Key', status: 'ESPRESSIF', ok: true },
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center justify-between p-6 rounded-[2rem] bg-soft border border-soft hover:bg-white dark:hover:bg-stone-800 transition-all group shadow-sm">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner ${item.ok ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                                            {item.ok ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                                        </div>
                                                        <span className="text-sm font-bold text-main uppercase tracking-widest">{item.label}</span>
                                                    </div>
                                                    <span className={`text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm ${item.ok ? 'bg-white text-primary border border-primary/20' : 'bg-white text-amber-500 border border-amber-500/20'}`}>
                                                        {item.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="glass-card p-10 border-none bg-stone-900 text-white relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="p-3 bg-white/10 rounded-2xl dark:backdrop-blur-xl border border-white/10">
                                                <Smartphone className="w-6 h-6 text-primary-light" />
                                            </div>
                                            <h3 className="text-2xl font-bold">Verified Session</h3>
                                        </div>

                                        <div className="flex items-center gap-6 p-6 bg-white/10 dark:bg-white/5 rounded-[2.5rem] border border-white/10 dark:backdrop-blur-md group-hover:bg-white/10 transition-colors">
                                            <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                                                <Globe className="w-8 h-8 text-primary-light" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-lg font-bold">Chrome 121</p>
                                                <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em] mt-1">macOS Matrix · Bengaluru · ACTIVE</p>
                                            </div>
                                            <div className="w-3 h-3 bg-accent-neon rounded-full animate-pulse shadow-[0_0_15px_rgba(16,255,160,0.5)]" />
                                        </div>

                                        <button className="mt-8 w-full btn-glass py-4 text-white/60 hover:text-white">Review All Active Links</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
