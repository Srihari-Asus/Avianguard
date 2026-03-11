import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Sprout, Shield, Loader2, AlertCircle } from 'lucide-react';

const LoginPage: React.FC = () => {
    const { signInWithGoogle } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await signInWithGoogle();
        } catch (err: any) {
            setError('Sign-in failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #fdfcf9 40%, #ecfdf5 70%, #f8fafc 100%)' }}>
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)' }} />
                <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #059669 0%, transparent 70%)' }} />
                <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-10 animate-pulse-soft" style={{ background: 'radial-gradient(circle, #34d399 0%, transparent 70%)' }} />

                {/* Floating dots */}
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-emerald-400 opacity-20"
                        style={{
                            top: `${15 + i * 15}%`,
                            left: `${10 + i * 14}%`,
                            animation: `pulse-soft ${3 + i * 0.5}s ease-in-out infinite`,
                            animationDelay: `${i * 0.3}s`,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 w-full max-w-md px-6">
                {/* Logo & Branding */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-600 rounded-3xl shadow-2xl shadow-emerald-200 mb-6 mx-auto">
                        <Sprout className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-5xl font-bold text-stone-800 mb-3 tracking-tight">AvianGuard</h1>
                    <p className="text-stone-500 text-lg font-medium italic">
                        Intelligent agricultural defense, powered by nature's wisdom.
                    </p>
                </div>

                {/* Sign-In Card */}
                <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-xl shadow-stone-200/50 p-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100">
                            <Shield className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-stone-800">Welcome Back</h2>
                            <p className="text-xs text-stone-400 font-medium uppercase tracking-widest">Secure Authentication</p>
                        </div>
                    </div>

                    <p className="text-stone-500 mb-8 leading-relaxed">
                        Sign in with your Google account to access your guardian network, field insights, and community intelligence.
                    </p>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-3 p-4 bg-red-50 rounded-2xl border border-red-100 mb-6 animate-in fade-in duration-300">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                            <p className="text-sm text-red-700 font-medium">{error}</p>
                        </div>
                    )}

                    {/* Google Sign-In Button */}
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-stone-200 rounded-2xl font-bold text-stone-700 text-base hover:border-emerald-400 hover:bg-emerald-50/50 hover:shadow-lg hover:shadow-emerald-100/50 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed group"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 48 48" className="shrink-0">
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                            </svg>
                        )}
                        <span>{isLoading ? 'Signing in...' : 'Continue with Google'}</span>
                    </button>

                    <div className="mt-8 pt-6 border-t border-stone-100">
                        <div className="flex items-center justify-center gap-6 text-stone-400">
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Encrypted</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Secure</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Private</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-[10px] text-stone-400 mt-8 uppercase font-bold tracking-[0.2em]">
                    Protected by Firebase Authentication
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
