import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Notification } from '../components/NotificationPanel';

interface NotificationContextType {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'> & { riskLevel?: 'Low' | 'Medium' | 'High' }) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearAll: () => void;
    unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            title: 'Node Pulse Alert',
            description: 'Guardian Node #001 reported anomalous parakeet behavior in Sector 4.',
            timestamp: '2 min ago',
            status: 'alert',
            isRead: false,
        },
        {
            id: '2',
            title: 'System Optimization',
            description: 'Global Collective successfully calibrated ultrasonic frequencies for dusk migration.',
            timestamp: '15 min ago',
            status: 'system',
            isRead: false,
        }
    ]);

    const playAlertSound = useCallback((risk: 'Low' | 'Medium' | 'High' = 'Low') => {
        try {
            const context = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = context.createOscillator();
            const gain = context.createGain();

            const freq = risk === 'High' ? 880 : risk === 'Medium' ? 660 : 440;
            osc.frequency.setValueAtTime(freq, context.currentTime);
            osc.type = risk === 'High' ? 'sawtooth' : 'sine';

            gain.gain.setValueAtTime(0, context.currentTime);
            gain.gain.linearRampToValueAtTime(0.1, context.currentTime + 0.05);
            gain.gain.linearRampToValueAtTime(0, context.currentTime + 0.3);

            osc.connect(gain);
            gain.connect(context.destination);

            osc.start();
            osc.stop(context.currentTime + 0.4);
        } catch (e) {
            console.warn('System Alarm Failure:', e);
        }
    }, []);

    const addNotification = useCallback((n: Omit<Notification, 'id' | 'timestamp' | 'isRead'> & { riskLevel?: 'Low' | 'Medium' | 'High' }) => {
        const newNotification: Notification = {
            ...n,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: 'Just now',
            isRead: false,
        };
        setNotifications(prev => [newNotification, ...prev]);

        if (n.status === 'alert') {
            playAlertSound(n.riskLevel);
        }

        console.log('SYSTEM_ALERT:', newNotification.title, n.riskLevel || 'N/A');
    }, [playAlertSound]);

    const markAsRead = useCallback((id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
    }, []);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <NotificationContext.Provider value={{
            notifications,
            addNotification,
            markAsRead,
            markAllAsRead,
            clearAll,
            unreadCount
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
