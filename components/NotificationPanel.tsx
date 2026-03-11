import React from 'react';
import { X, Bell, Zap, Cpu, ShieldAlert, CheckCircle2, Clock, Trash2 } from 'lucide-react';

export interface Notification {
    id: string;
    title: string;
    description: string;
    timestamp: string;
    status: 'alert' | 'system' | 'activity';
    isRead: boolean;
    imageUrl?: string;
    riskLevel?: 'Low' | 'Medium' | 'High';
}

interface NotificationPanelProps {
    isOpen: boolean;
    onClose: () => void;
    notifications: Notification[];
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
    onClearAll: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
    isOpen,
    onClose,
    notifications,
    onMarkAsRead,
    onMarkAllAsRead,
    onClearAll,
}) => {
    const getStatusIcon = (status: Notification['status']) => {
        switch (status) {
            case 'alert': return <ShieldAlert className="w-5 h-5 text-amber-500" />;
            case 'system': return <Cpu className="w-5 h-5 text-primary" />;
            case 'activity': return <Zap className="w-5 h-5 text-blue-500" />;
            default: return <Bell className="w-5 h-5 text-muted" />;
        }
    };

    const getStatusBg = (status: Notification['status']) => {
        switch (status) {
            case 'alert': return 'bg-amber-500/10';
            case 'system': return 'bg-primary/10';
            case 'activity': return 'bg-blue-500/10';
            default: return 'bg-soft';
        }
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] transition-opacity duration-500"
                    onClick={onClose}
                />
            )}

            {/* Panel */}
            <aside
                className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-card border-l border-light z-[70] shadow-2xl transition-transform duration-500 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-soft flex items-center justify-between bg-white dark:bg-stone-900/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-xl">
                                <Bell className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-main">Notifications</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-soft rounded-xl transition-colors text-muted hover:text-main"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Quick Actions */}
                    {notifications.length > 0 && (
                        <div className="px-6 py-3 border-b border-soft flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-muted bg-stone-50/50 dark:bg-stone-900/20">
                            <button
                                onClick={onMarkAllAsRead}
                                className="hover:text-primary transition-colors flex items-center gap-1.5"
                            >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Mark all read
                            </button>
                            <button
                                onClick={onClearAll}
                                className="hover:text-red-500 transition-colors flex items-center gap-1.5"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                Clear all
                            </button>
                        </div>
                    )}

                    {/* List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-10">
                                <div className="w-16 h-16 bg-soft rounded-3xl flex items-center justify-center mb-4 opacity-50">
                                    <Bell className="w-8 h-8 text-muted" />
                                </div>
                                <p className="text-main font-bold">All caught up!</p>
                                <p className="text-xs text-muted mt-1 leading-relaxed">
                                    Your Guardian network is operating within optimal parameters.
                                </p>
                            </div>
                        ) : (
                            notifications.map((n) => (
                                <div
                                    key={n.id}
                                    onClick={() => !n.isRead && onMarkAsRead(n.id)}
                                    className={`p-4 rounded-2xl border transition-all cursor-pointer group relative ${n.isRead
                                        ? 'bg-transparent border-soft opacity-70 hover:opacity-100 hover:border-primary/20'
                                        : 'bg-primary/5 border-primary/20 hover:bg-primary/10'
                                        }`}
                                >
                                    <div className="flex gap-4">
                                        <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${getStatusBg(n.status)}`}>
                                            {getStatusIcon(n.status)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <div className="flex flex-col gap-1 min-w-0">
                                                    <h4 className="text-sm font-bold text-main truncate leading-tight uppercase tracking-tight">{n.title}</h4>
                                                    {n.riskLevel && (
                                                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border w-fit ${n.riskLevel === 'High' ? 'bg-red-500/10 border-red-500/30 text-red-500' :
                                                                n.riskLevel === 'Medium' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' :
                                                                    'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                                                            }`}>
                                                            <div className={`w-1 h-1 rounded-full animate-pulse ${n.riskLevel === 'High' ? 'bg-red-500' :
                                                                    n.riskLevel === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                                                                }`} />
                                                            <span className="text-[8px] font-bold uppercase tracking-widest">{n.riskLevel} Risk</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1 text-[10px] text-muted whitespace-nowrap font-medium">
                                                    <Clock className="w-3 h-3" />
                                                    {n.timestamp}
                                                </div>
                                            </div>
                                            <p className="text-xs text-muted leading-relaxed line-clamp-2">{n.description}</p>
                                            {n.imageUrl && (
                                                <div className="mt-3 rounded-xl overflow-hidden border border-soft aspect-video bg-soft">
                                                    <img src={n.imageUrl} alt="Alert Snapshot" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {!n.isRead && (
                                        <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full" />
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-soft bg-white dark:bg-stone-900/50">
                        <button
                            onClick={onClose}
                            className="w-full btn-primary justify-center py-4 rounded-xl text-sm font-bold"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default NotificationPanel;
