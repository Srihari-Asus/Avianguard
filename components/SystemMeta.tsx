import React, { useState } from 'react';
import {
    Cpu, Terminal, ShieldCheck, Activity,
    Settings, Database, Zap, HardDrive,
    Network, Lock, AlertCircle, CheckCircle2,
    Clock, RefreshCw, ChevronRight, BarChart3
} from 'lucide-react';

type Module = 'Hardware' | 'Logs' | 'Security' | 'Metrics';

const SystemMeta: React.FC = () => {
    const [activeModule, setActiveModule] = useState<Module>('Hardware');

    const modules = [
        { id: 'Hardware', icon: Cpu, label: 'Core Hardware', status: 'Optimal', color: 'primary' },
        { id: 'Logs', icon: Terminal, label: 'Event Logs', status: 'Live', color: 'amber' },
        { id: 'Security', icon: ShieldCheck, label: 'Security', status: 'Encrypted', color: 'emerald' },
        { id: 'Metrics', icon: Activity, label: 'Performance', status: 'Peak', color: 'indigo' },
    ];

    return (
        <div className="animate-fade space-y-8 pb-10">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Module Sidebar */}
                <div className="lg:col-span-1 space-y-3">
                    {modules.map((m) => (
                        <button
                            key={m.id}
                            onClick={() => setActiveModule(m.id as Module)}
                            className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all duration-300 group ${activeModule === m.id
                                    ? 'bg-primary text-white shadow-xl shadow-emerald-500/20'
                                    : 'glass-card hover:bg-soft text-muted hover:text-main'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <m.icon className={`w-5 h-5 ${activeModule === m.id ? 'text-white' : 'text-primary'}`} />
                                <div className="text-left">
                                    <div className="text-xs font-bold uppercase tracking-widest leading-tight">{m.label}</div>
                                    <div className={`text-[10px] font-medium opacity-70 ${activeModule === m.id ? 'text-white' : 'text-muted'}`}>
                                        {m.status}
                                    </div>
                                </div>
                            </div>
                            <ChevronRight className={`w-4 h-4 transition-transform ${activeModule === m.id ? 'translate-x-0' : 'translate-x-[-10px] opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                        </button>
                    ))}

                    <div className="mt-8 p-6 bg-stone-900 rounded-[2.5rem] text-white relative overflow-hidden group border border-stone-800">
                        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                            <Settings className="w-32 h-32 text-accent-neon" />
                        </div>
                        <h4 className="text-lg font-bold mb-2">System Override</h4>
                        <p className="text-xs text-stone-400 leading-relaxed mb-6">Manual protocols for emergency network shutdown.</p>
                        <button className="w-full py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all">
                            Initiate Purge
                        </button>
                    </div>
                </div>

                {/* Main Content Column */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="glass-card p-8 min-h-[600px] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
                            <Settings className="w-80 h-80 text-primary" />
                        </div>

                        {/* Hardware Module */}
                        {activeModule === 'Hardware' && (
                            <div className="animate-fade space-y-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-2xl font-bold text-main">Core Infrastructure</h3>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                                        <div className="w-1.5 h-1.5 bg-accent-neon rounded-full animate-pulse" />
                                        <span className="text-[10px] font-bold text-primary uppercase">Synchronized</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {[
                                        { label: 'CPU Cluster', value: '42°C', icon: Cpu, sub: 'Load: 12%' },
                                        { label: 'Memory Pool', value: '1.2 GB', icon: Database, sub: '85% Free' },
                                        { label: 'Uplink Latency', value: '14 ms', icon: Network, sub: 'Stable' },
                                    ].map((stat, i) => (
                                        <div key={i} className="p-6 bg-soft rounded-3xl border border-soft hover:border-primary/20 transition-all">
                                            <stat.icon className="w-6 h-6 text-primary mb-4" />
                                            <div className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">{stat.label}</div>
                                            <div className="text-2xl font-bold text-main">{stat.value}</div>
                                            <div className="text-[10px] font-medium text-stone-400 mt-1">{stat.sub}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-8 bg-stone-50 dark:bg-stone-900/40 rounded-[2.5rem] border border-soft relative overflow-hidden">
                                    <h4 className="font-bold text-main mb-6 flex items-center gap-2">
                                        <HardDrive className="w-5 h-5 text-primary" />
                                        Storage Matrix
                                    </h4>
                                    <div className="w-full h-3 bg-soft rounded-full overflow-hidden mb-4">
                                        <div className="h-full bg-primary w-[72%] rounded-full shadow-lg shadow-emerald-500/20" />
                                    </div>
                                    <div className="flex justify-between text-[11px] font-bold text-muted uppercase tracking-widest">
                                        <span>Used: 364.2 GB</span>
                                        <span>Total: 500 GB</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Logs Module */}
                        {activeModule === 'Logs' && (
                            <div className="animate-fade h-full flex flex-col">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-2xl font-bold text-main">System Event Logs</h3>
                                    <button className="flex items-center gap-2 text-xs font-bold text-primary hover:text-primary-hover transition-colors">
                                        <RefreshCw className="w-4 h-4" />
                                        Live Feed
                                    </button>
                                </div>

                                <div className="space-y-3 font-mono text-sm overflow-y-auto max-h-[450px] pr-2 custom-scrollbar">
                                    {[
                                        { time: '19:50:12', msg: 'Uplink established with Node #004', type: 'info' },
                                        { time: '19:48:45', msg: 'Frequency calibration complete (Sect-B)', type: 'success' },
                                        { time: '19:42:30', msg: 'Low power warning: Node #012 (Battery 14%)', type: 'warn' },
                                        { time: '19:35:10', msg: 'Anomalous movement detected Sector 4', type: 'info' },
                                        { time: '19:28:55', msg: 'System update applied successfully', type: 'success' },
                                        { time: '19:20:00', msg: 'Initial boot sequence complete', type: 'info' },
                                    ].map((log, i) => (
                                        <div key={i} className="flex gap-4 p-3 bg-soft/50 rounded-xl border border-transparent hover:border-soft transition-all">
                                            <span className="text-stone-400 text-xs shrink-0">{log.time}</span>
                                            <span className={`text-xs font-bold uppercase shrink-0 w-16 ${log.type === 'success' ? 'text-emerald-500' :
                                                    log.type === 'warn' ? 'text-amber-500' : 'text-primary'
                                                }`}>{log.type}</span>
                                            <span className="text-main/80 text-xs truncate">{log.msg}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Security Module */}
                        {activeModule === 'Security' && (
                            <div className="animate-fade">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-2xl font-bold text-main">Network Integrity</h3>
                                    <Lock className="w-6 h-6 text-emerald-500" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="p-8 bg-emerald-500/5 rounded-[2.5rem] border border-emerald-500/10">
                                        <ShieldCheck className="w-10 h-10 text-emerald-500 mb-4" />
                                        <h4 className="text-lg font-bold text-main mb-2">AES-256 Active</h4>
                                        <p className="text-xs text-muted leading-relaxed">All telemetry data stream is encrypted via military-grade protocols.</p>
                                    </div>
                                    <div className="p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10">
                                        <CheckCircle2 className="w-10 h-10 text-primary mb-4" />
                                        <h4 className="text-lg font-bold text-main mb-2">Auth Verified</h4>
                                        <p className="text-xs text-muted leading-relaxed">Device signature #AV-4921 matches your steward credentials.</p>
                                    </div>
                                </div>

                                <div className="p-6 bg-red-500/5 rounded-3xl border border-red-500/10 flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center">
                                        <AlertCircle className="w-6 h-6 text-red-500" />
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-main text-sm">Threat Detection Active</h5>
                                        <p className="text-[10px] text-muted uppercase tracking-widest font-bold mt-1">0 External Breach Attempts Detected</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Metrics Module */}
                        {activeModule === 'Metrics' && (
                            <div className="animate-fade">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-2xl font-bold text-main">System Performance</h3>
                                    <BarChart3 className="w-6 h-6 text-indigo-500" />
                                </div>

                                <div className="h-64 flex items-end justify-between gap-3 px-2 mb-8">
                                    {[60, 40, 80, 50, 90, 70, 85, 45, 95].map((h, i) => (
                                        <div key={i} className="flex-1 bg-gradient-to-t from-indigo-500/20 to-indigo-500/40 rounded-t-xl group relative cursor-crosshair hover:from-indigo-500/40 hover:to-indigo-500" style={{ height: `${h}%` }}>
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-main text-white px-2 py-1 rounded-lg text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                Eff: {h}%
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-6 bg-soft rounded-2xl border border-soft">
                                        <div className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Deterrence Yield</div>
                                        <div className="text-2xl font-bold text-indigo-500">+14.2%</div>
                                    </div>
                                    <div className="p-6 bg-soft rounded-2xl border border-soft">
                                        <div className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Energy Saving</div>
                                        <div className="text-2xl font-bold text-primary">31%</div>
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

export default SystemMeta;
