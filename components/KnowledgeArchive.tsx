import React, { useState } from 'react';
import {
    Bird, Zap, Sprout, Users, Cpu,
    ChevronRight, ArrowLeft, Bookmark,
    ShieldAlert, BarChart3, Clock,
    ExternalLink, CheckCircle2,
    Lightbulb, Target, Info
} from 'lucide-react';

export interface Article {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    content: string;
    insights: { label: string; value: string; icon: any }[];
    actions: { title: string; steps: string[] }[];
    tags: string[];
    time: string;
    icon: any;
    color: string;
    relatedIds: string[];
}

const articles: Article[] = [
    {
        id: '1',
        title: 'The Psychology of Parakeet Flocks',
        subtitle: 'Understanding collective behavior for non-lethal deterrent strategy.',
        description: 'A deep dive into how Rose-ringed parakeets coordinate in the Kuttanad region and why traditional scare tactics fail over time.',
        content: 'Parakeets exhibit decentralized leadership in flocks. When one bird identifies a pattern in deterrent timing, the information ripples through the group within milliseconds. Our research shows that static scarecrows only provide a 48-hour buffer before the flock acclimates. Adaptive intelligence must mimic the unpredictability of natural predators to remain effective. Collective intelligence among these birds is highly developed, requiring our Guardian network to constantly cycle frequencies and light patterns to prevent cognitive adaptation.',
        insights: [
            { label: 'Adaptation Rate', value: 'High (48h)', icon: Clock },
            { label: 'Risk Level', value: 'Critical', icon: ShieldAlert },
            { label: 'Intelligence Tier', value: 'Tier 3', icon: Target },
        ],
        actions: [
            {
                title: 'Calibrate Randomness',
                steps: ['Enable "Chaotic" pulse mode in Node settings', 'Set frequency deviation to ±15%']
            },
            {
                title: 'Observer Protocol',
                steps: ['Document flock arrival times for 3 days', 'Check for pattern repetition in sentinel birds']
            }
        ],
        tags: ['Behavior', 'AI', 'Core'],
        time: '8 min',
        icon: Bird,
        color: 'amber',
        relatedIds: ['2', '3']
    },
    {
        id: '2',
        title: 'Ultrasonic Calibration Matrix',
        subtitle: 'Optimizing hardware efficiency for maximum coverage.',
        description: 'Technical documentation for aligning ultrasonic output with atmospheric humidity for peak propagation.',
        content: 'Hydration levels in the air significantly impact how sound waves travel. During high-humidity mornings in Kuttanad, ultrasonic waves propagate 12% further but lose clarity. This document outlines the matrix for adjusting power output based on real-time hygrometer data. By synchronizing your ESP32 modules with the local Guardian Pulse, you can reduce power consumption by 20% while maintaining the territorial perimeter.',
        insights: [
            { label: 'Power Saving', value: '22%', icon: Zap },
            { label: 'Signal Range', value: '450m', icon: Target },
            { label: 'Hardware Prep', icon: Cpu, value: 'ESP32 v2' },
        ],
        actions: [
            {
                title: 'Sync Hygrometers',
                steps: ['Calibrate DHT22 sensors', 'Set auto-scaling in Global Collective hub']
            }
        ],
        tags: ['Hardware', 'Advanced'],
        time: '12 min',
        icon: Zap,
        color: 'indigo',
        relatedIds: ['1', '5']
    },
    {
        id: '3',
        title: 'Milky Stage Defense Rotation',
        subtitle: 'Protecting crops during their most vulnerable phase.',
        description: 'Strategies for heavy-duty protection during the 15-day milky stage of paddy growth.',
        content: 'The milky stage is when starch is still in liquid form—the primary feast for local avian species. During this 2-week window, deterrence must be increased by 300%. We recommend a rotating "High Alert" status between sectors to ensure no single node overheats while providing constant coverage. This guide provides the rotation schedule tailored for small-scale farms.',
        insights: [
            { label: 'Vulnerability', value: 'Peak', icon: Info },
            { label: 'Defense Load', value: 'Level 5', icon: ShieldAlert },
            { label: 'Yield Impact', value: '+18%', icon: BarChart3 },
        ],
        actions: [
            {
                title: 'Sector Rotation',
                steps: ['Divide farm into 4 tactical zones', 'Rotate high-intensity pulses every 6 hours']
            }
        ],
        tags: ['Strategy', 'Yield'],
        time: '10 min',
        icon: Sprout,
        color: 'emerald',
        relatedIds: ['1', '4']
    },
    {
        id: '4',
        title: 'Community Warden Protocols',
        subtitle: 'Neighbor-to-neighbor synchronization for regional security.',
        description: 'How to link your Guardian network with neighbors to create a "No-Fly Corridor".',
        content: 'Single-farm deterrence often just pushes problems to the neighbor. True protection comes from a collective corridor. By enabling "Peer Sync" in your mesh network, your nodes will communicate with neighboring farms to steer flocks entirely away from a sector rather than just your plot. This collaborative approach reduces individual hardware stress and improves regional yields.',
        insights: [
            { label: 'Network Size', value: 'Global', icon: Users },
            { label: 'Trust Score', value: '92/100', icon: CheckCircle2 },
            { label: 'Collaboration', value: 'Essential', icon: Lightbulb },
        ],
        actions: [
            {
                title: 'Invite Peers',
                steps: ['Share your steward code with adjacent farmers', 'Enable "Corridor Mode" in Global Collective settings']
            }
        ],
        tags: ['Network', 'Social'],
        time: '6 min',
        icon: Users,
        color: 'stone',
        relatedIds: ['3']
    },
    {
        id: '5',
        title: 'ESP32 Range Optimization',
        subtitle: 'Field-tested configurations for maximum telemetry range.',
        description: 'Deep technical guide for optimizing Wi-Fi and LoRa range in dense agricultural environments.',
        content: 'Dense foliage can attenuate 2.4GHz signals by up to 15dB. This guide explores antenna positioning, polarized wave propagation, and LoRa spreading factors (SF7 vs SF12) for reliable long-range data transmission in paddy fields. We recommend vertical polarization for nodes placed 1 meter above the crop line to minimize ground multipath interference.',
        insights: [
            { label: 'Max Distance', value: '2.5km', icon: Target },
            { label: 'Bandwidth', value: 'Low-Latency', icon: Zap },
            { label: 'Stability', value: '99.9%', icon: CheckCircle2 },
        ],
        actions: [
            {
                title: 'Antenna Alignment',
                steps: ['Ensure line-of-sight between gateway and nodes', 'Check for Fresnel zone clearance']
            }
        ],
        tags: ['Engineering', 'Telem'],
        time: '15 min',
        icon: Cpu,
        color: 'primary',
        relatedIds: ['2']
    }
];

const KnowledgeDetail: React.FC<{ article: Article; onBack: () => void; onNavigate: (id: string) => void }> = ({ article, onBack, onNavigate }) => {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const relatedArticles = articles.filter(a => article.relatedIds.includes(a.id));

    return (
        <div className="animate-fade flex flex-col gap-8 pb-10">
            {/* Detail Header Navigation */}
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-muted hover:text-primary transition-all group font-bold text-sm uppercase tracking-widest"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Archive
                </button>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsBookmarked(!isBookmarked)}
                        className={`p-3 rounded-2xl border transition-all ${isBookmarked ? 'bg-primary text-white border-primary shadow-lg shadow-emerald-500/20' : 'bg-soft border-soft text-muted hover:text-primary'
                            }`}
                    >
                        <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-3 bg-soft border border-soft rounded-2xl text-muted hover:text-primary transition-all">
                        <ExternalLink className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="glass-card p-10 relative overflow-hidden">
                        <div className={`absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none`}>
                            <article.icon className="w-64 h-64 text-primary" />
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {article.tags.map(t => (
                                <span key={t} className="px-3 py-1 bg-primary/10 rounded-full text-[10px] font-bold text-primary uppercase tracking-widest border border-primary/10">{t}</span>
                            ))}
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-soft rounded-full text-[10px] font-bold text-muted uppercase tracking-widest ml-auto">
                                <Clock className="w-3 h-3" />
                                {article.time} Read
                            </span>
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-bold text-main tracking-tight mb-4 leading-tight">
                            {article.title}
                        </h1>
                        <p className="text-xl text-muted font-medium mb-10 leading-relaxed italic opacity-80">
                            {article.subtitle}
                        </p>

                        <div className="prose prose-emerald max-w-none">
                            <p className="text-lg text-main leading-relaxed mb-8">
                                {article.content}
                            </p>
                        </div>

                        {/* AI Insight Highlight */}
                        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden group">
                            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                <Lightbulb className="w-40 h-40" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-white/20 rounded-xl">
                                        <Lightbulb className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-sm font-bold uppercase tracking-[0.2em]">Collective Wisdom Insight</h3>
                                </div>
                                <p className="text-xl font-bold leading-snug tracking-tight">
                                    "Decentralized defense strategies outperform static systems by 412% in multi-species environments. Sync your ESP32 mesh nodes with the regional pulse for optimal coverage."
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Recommended Actions */}
                    <section className="glass-card p-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-amber-500/10 rounded-2xl">
                                <ShieldAlert className="w-6 h-6 text-amber-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-main">Recommended Actions</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {article.actions.map((action, i) => (
                                <div key={i} className="p-6 bg-soft rounded-3xl border border-soft hover:border-primary/20 transition-all">
                                    <h4 className="font-bold text-main mb-4 flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px]">{i + 1}</div>
                                        {action.title}
                                    </h4>
                                    <ul className="space-y-3">
                                        {action.steps.map((step, si) => (
                                            <li key={si} className="text-xs text-muted flex items-start gap-2 leading-relaxed">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                                                {step}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar Info Column */}
                <div className="space-y-8">
                    {/* Insights Grid */}
                    <div className="glass-card p-8">
                        <h3 className="text-xs font-bold text-muted uppercase tracking-[0.2em] mb-6">Strategic Matrix</h3>
                        <div className="space-y-4">
                            {article.insights.map((insight, i) => (
                                <div key={i} className="p-5 bg-white dark:bg-stone-900/40 rounded-2xl border border-soft flex items-center gap-4">
                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <insight.icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <div className="text-[9px] font-bold text-muted uppercase tracking-widest">{insight.label}</div>
                                        <div className="text-sm font-bold text-main">{insight.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Related Articles */}
                    <div className="glass-card p-8 flex flex-col bg-gradient-to-br from-bg-card to-primary/5">
                        <h3 className="text-xs font-bold text-muted uppercase tracking-[0.2em] mb-6">Related Knowledge</h3>
                        <div className="space-y-4">
                            {relatedArticles.map((rel, i) => (
                                <div
                                    key={rel.id}
                                    onClick={() => onNavigate(rel.id)}
                                    className="p-5 rounded-2xl border border-soft hover:border-primary/30 transition-all cursor-pointer group hover:bg-white dark:hover:bg-stone-900/50"
                                >
                                    <p className="text-xs font-bold text-main leading-tight mb-2 group-hover:text-primary transition-colors">{rel.title}</p>
                                    <div className="flex justify-between items-center text-[8px] font-bold tracking-widest text-muted uppercase">
                                        <span>{rel.time} Read</span>
                                        <ChevronRight className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Help Center CTA */}
                    <div className="p-8 rounded-[2rem] bg-stone-900 text-white relative overflow-hidden group border border-stone-800">
                        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                            <Users className="w-32 h-32 text-accent-neon" />
                        </div>
                        <h4 className="text-lg font-bold mb-2">Need Field Support?</h4>
                        <p className="text-xs text-stone-400 leading-relaxed mb-6">Connect with authorized stewards for hands-on calibration.</p>
                        <button className="w-full py-3 bg-accent-neon text-stone-950 rounded-xl text-xs font-bold hover:bg-white transition-colors">
                            Contact Warden
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const KnowledgeArchive: React.FC = () => {
    const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

    const selectedArticle = articles.find(a => a.id === selectedArticleId);

    if (selectedArticle) {
        return (
            <KnowledgeDetail
                article={selectedArticle}
                onBack={() => setSelectedArticleId(null)}
                onNavigate={(id) => {
                    setSelectedArticleId(null);
                    setTimeout(() => setSelectedArticleId(id), 10);
                }}
            />
        );
    }

    return (
        <div className="animate-fade grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((item, i) => (
                <div
                    key={i}
                    onClick={() => setSelectedArticleId(item.id)}
                    className="glass-card p-8 flex flex-col group cursor-pointer border-transparent hover:border-primary/20 hover:translate-y-[-4px] transition-all duration-300"
                >
                    <div className={`w-14 h-14 rounded-2xl bg-soft flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-500 shadow-sm group-hover:shadow-lg group-hover:shadow-emerald-500/10`}>
                        <item.icon className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {item.tags.map(t => (
                            <span key={t} className="px-2 py-0.5 bg-soft rounded-lg text-[8px] font-bold text-muted uppercase tracking-widest">{t}</span>
                        ))}
                    </div>
                    <h4 className="text-lg font-bold text-main group-hover:text-primary transition-colors leading-tight mb-4">{item.title}</h4>
                    <p className="text-xs text-muted leading-relaxed line-clamp-2 mb-6">
                        {item.description}
                    </p>
                    <div className="mt-auto flex justify-between items-center text-[10px] font-bold tracking-widest uppercase">
                        <span className="text-stone-400">{item.time} Engagement</span>
                        <div className="flex items-center gap-1.5 text-primary group-hover:translate-x-1 transition-transform">
                            Explore
                            <ChevronRight className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default KnowledgeArchive;
