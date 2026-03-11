import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { logDetection } from '../services/detectionService';
import { useAuth } from '../contexts/AuthContext';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import {
    Camera, CameraOff, Scan, Bird, User,
    ShieldAlert, Target, Clock, History,
    Download, Trash2, Maximize2, RefreshCw,
    CheckCircle2, AlertCircle, Info, ChevronRight,
    Volume2, Zap, ShieldCheck, Activity, LineChart
} from 'lucide-react';

interface DetectionRecord {
    id: string;
    name: string;
    confidence: number;
    risk: 'Low' | 'Medium' | 'High';
    behavior: string;
    action: string;
    timestamp: string;
    image?: string;
}

const BirdDetection: React.FC = () => {
    const { user } = useAuth();
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isModelLoading, setIsModelLoading] = useState(true);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [history, setHistory] = useState<DetectionRecord[]>([]);
    const [currentDetection, setCurrentDetection] = useState<DetectionRecord | null>(null);
    const [sceneType, setSceneType] = useState<'analyzing' | 'detected' | 'empty'>('empty');
    const [detections, setDetections] = useState<cocoSsd.DetectedObject[]>([]);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);

    // Repellent System State
    const [repellentStatus, setRepellentStatus] = useState<'idle' | 'detected' | 'repelling' | 'adaptive' | 'cleared' | 'animal'>('idle');
    const [animalSpecies, setAnimalSpecies] = useState<string | null>(null);
    const { addNotification } = useNotifications();
    const [persistenceTime, setPersistenceTime] = useState(0);
    const detectionStartTimeRef = useRef<number | null>(null);

    // Audio & Visualizer Refs
    const audioCtxRef = useRef<AudioContext | null>(null);
    const oscillatorRef = useRef<OscillatorNode | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const visualizerCanvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Species assessment logic
    const birdSpecs: Record<string, { risk: 'Low' | 'Medium' | 'High', behavior: string, action: string }> = {
        'bird': { risk: 'Medium', behavior: 'Aerial/Foraging', action: 'Frequency Sweep Required' },
    };

    // Load Model on Mount
    useEffect(() => {
        const loadModels = async () => {
            try {
                await tf.ready();
                const loadedModel = await cocoSsd.load({
                    base: 'mobilenet_v2'
                });
                setModel(loadedModel);
                setIsModelLoading(false);
                console.log('AI Model: COCO-SSD loaded successfully');
            } catch (err) {
                console.error('Failed to load TFJS model:', err);
                setCameraError('Neural engine failure: AI model could not be initialized.');
                setIsModelLoading(false);
            }
        };
        loadModels();
    }, []);

    // Initialize Audio Context and Analyser on first interaction
    const initAudio = () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            analyserRef.current = audioCtxRef.current.createAnalyser();
            analyserRef.current.fftSize = 256;
        }
        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }
    };

    // Visualization Logic: Scientific Waveform Chart
    const drawFrequencyGraph = useCallback(() => {
        if (!visualizerCanvasRef.current || !analyserRef.current) return;

        const canvas = visualizerCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const analyser = analyserRef.current;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const renderFrame = () => {
            animationFrameRef.current = requestAnimationFrame(renderFrame);
            analyser.getByteFrequencyData(dataArray);

            const width = canvas.width;
            const height = canvas.height;
            const padding = { top: 20, right: 30, bottom: 30, left: 40 };
            const chartWidth = width - padding.left - padding.right;
            const chartHeight = height - padding.top - padding.bottom;

            // Clear Background
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, width, height);

            // Draw Subtle Grid Lines
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            // Vertical grid lines (kHz markers)
            for (let i = 0; i <= 5; i++) {
                const x = padding.left + (i / 5) * chartWidth;
                ctx.moveTo(x, padding.top);
                ctx.lineTo(x, height - padding.bottom);
            }
            // Horizontal grid lines (Amplitude)
            for (let i = 0; i <= 4; i++) {
                const y = padding.top + (i / 4) * chartHeight;
                ctx.moveTo(padding.left, y);
                ctx.lineTo(width - padding.right, y);
            }
            ctx.stroke();

            // Draw Axes
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.beginPath();
            ctx.moveTo(padding.left, padding.top);
            ctx.lineTo(padding.left, height - padding.bottom);
            ctx.lineTo(width - padding.right, height - padding.bottom);
            ctx.stroke();

            // Axis Labels
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.font = 'bold 8px Inter, sans-serif';
            ctx.textAlign = 'center';

            // X-Axis Labels (kHz)
            const labels = ['0', '5', '10', '15', '20', '22'];
            labels.forEach((label, i) => {
                const x = padding.left + (i / (labels.length - 1)) * chartWidth;
                ctx.fillText(`${label}k`, x, height - 15);
            });
            ctx.fillText('Frequency (kHz)', padding.left + chartWidth / 2, height - 5);

            // Y-Axis Labels (Amplitude)
            ctx.save();
            ctx.translate(10, padding.top + chartHeight / 2);
            ctx.rotate(-Math.PI / 2);
            ctx.fillText('Amplitude (dB)', 0, 0);
            ctx.restore();

            if (repellentStatus === 'idle' || repellentStatus === 'cleared') {
                // Static baseline
                ctx.beginPath();
                ctx.moveTo(padding.left, height - padding.bottom);
                ctx.lineTo(width - padding.right, height - padding.bottom);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.stroke();
                return;
            }

            // Draw Waveform Line
            const hue = repellentStatus === 'adaptive' ? 0 : 160;
            ctx.strokeStyle = `hsla(${hue}, 80%, 60%, 1)`;
            ctx.lineWidth = 2;
            ctx.shadowBlur = 15;
            ctx.shadowColor = `hsla(${hue}, 80%, 60%, 0.6)`;

            ctx.beginPath();

            const sliceWidth = chartWidth / bufferLength;
            let x = padding.left;

            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 255.0;
                const y = (height - padding.bottom) - (v * chartHeight);

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    // Using bezier for smoothness
                    const prevV = dataArray[i - 1] / 255.0;
                    const prevY = (height - padding.bottom) - (prevV * chartHeight);
                    const prevX = x - sliceWidth;

                    const cp1x = prevX + (x - prevX) / 2;
                    const cp1y = prevY;
                    const cp2x = prevX + (x - prevX) / 2;
                    const cp2y = y;

                    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
                }

                x += sliceWidth;
            }

            ctx.stroke();
            ctx.shadowBlur = 0;
        };

        renderFrame();
    }, [repellentStatus]);

    useEffect(() => {
        if (repellentStatus !== 'idle') {
            drawFrequencyGraph();
        } else {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        }
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [repellentStatus, drawFrequencyGraph]);

    // Audio Control Logic
    const startRepellentSound = (frequency: number = 18000, type: OscillatorType = 'sine') => {
        if (!audioCtxRef.current || !analyserRef.current) return;

        console.log(`AUDIO_ENGINE: Initiating repellent sound at ${frequency}Hz (${type})`);
        stopRepellentSound();

        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, audioCtxRef.current.currentTime);

        gain.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
        gain.gain.linearRampToValueAtTime(0.3, audioCtxRef.current.currentTime + 0.1);

        // Chain: OSC -> GAIN -> ANALYSER -> DESTINATION
        osc.connect(gain);
        gain.connect(analyserRef.current);
        analyserRef.current.connect(audioCtxRef.current.destination);

        osc.start();
        oscillatorRef.current = osc;
        gainNodeRef.current = gain;
    };

    const stopRepellentSound = () => {
        if (oscillatorRef.current && audioCtxRef.current) {
            console.log("AUDIO_ENGINE: Termination signal received. Stopping audio context.");
            const currentOsc = oscillatorRef.current;
            const currentGain = gainNodeRef.current;

            if (currentGain) {
                currentGain.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 0.1);
            }

            setTimeout(() => {
                try {
                    currentOsc.stop();
                    currentOsc.disconnect();
                } catch (e) {
                    // Ignore errors if already stopped
                }
            }, 150);

            oscillatorRef.current = null;
            gainNodeRef.current = null;
        }
    };

    const updateAdaptiveSound = () => {
        if (oscillatorRef.current && audioCtxRef.current) {
            const time = audioCtxRef.current.currentTime;
            // Adaptive GenAI Pattern: Erratic frequency modulation (sweep between 15kHz and 22kHz)
            const baseFreq = 15000 + Math.random() * 7000;
            console.log(`AUDIO_ENGINE: GenAI Adaptive Update - Target Frequency: ${Math.round(baseFreq)}Hz`);
            oscillatorRef.current.frequency.exponentialRampToValueAtTime(baseFreq, time + 0.2);

            const types: OscillatorType[] = ['sine', 'square', 'sawtooth', 'triangle'];
            oscillatorRef.current.type = types[Math.floor(Math.random() * types.length)];
        }
    };

    // Attach stream and start analysis
    useEffect(() => {
        if (isCameraActive && stream && videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
                videoRef.current?.play().catch(e => console.error("Video playback failed:", e));
                startDetection();
            };
        }
    }, [isCameraActive, stream]);

    const startDetection = useCallback(async () => {
        if (!model || !videoRef.current || !isCameraActive) return;

        const detectFrame = async () => {
            if (!videoRef.current || videoRef.current.paused || videoRef.current.ended || !isCameraActive) return;

            try {
                const predictions = await model.detect(videoRef.current);

                // Filter detections with confidence above 60%
                const validDetections = predictions.filter(p => p.score >= 0.60);

                // Log every detected object for debugging
                if (validDetections.length > 0) {
                    console.log('DETECTED_OBJECTS:', validDetections.map(d => `${d.class} (${Math.round(d.score * 100)}%)`).join(', '));
                    setDetections(validDetections);
                    setSceneType('detected');

                    // Log the top detection to the backend for persistence
                    if (user) {
                        const topDetection = validDetections[0];
                        logDetection({
                            userId: user.uid,
                            class: topDetection.class,
                            score: topDetection.score,
                            riskLevel: topDetection.class === 'bird' ? 'Medium' : 'Low'
                        });
                    }
                } else {
                    setDetections([]);
                    setSceneType('empty');
                }

                // Internal logic for repellent system (still triggered if birds are detected)
                const birdDetection = validDetections.find(p => p.class === 'bird');

                if (birdDetection) {
                    if (!detectionStartTimeRef.current) {
                        detectionStartTimeRef.current = Date.now();
                        setRepellentStatus('detected');
                    }

                    const elapsed = (Date.now() - detectionStartTimeRef.current) / 1000;
                    setPersistenceTime(elapsed);
                    setAnimalSpecies(null);

                    const spec = birdSpecs['bird'];
                    setCurrentDetection({
                        id: 'live',
                        name: 'Avian Species Detected',
                        confidence: Math.round(birdDetection.score * 100),
                        risk: spec.risk,
                        behavior: spec.behavior,
                        action: spec.action,
                        timestamp: new Date().toLocaleTimeString()
                    });

                    // Repellent Control Logic
                    if (elapsed > 2) {
                        if (repellentStatus !== 'adaptive') {
                            console.log("CONTROL_SYSTEM: Persistent Threat. Engaging GenAI Adaptive Pattern.");
                            setRepellentStatus('adaptive');
                            startRepellentSound(19000, 'square');
                        }
                        updateAdaptiveSound();
                    } else if (repellentStatus === 'detected' || repellentStatus === 'cleared' || repellentStatus === 'idle') {
                        console.log("CONTROL_SYSTEM: Engaging Acoustic Deterrent (Predefined frequency).");
                        setRepellentStatus('repelling');
                        startRepellentSound(18000, 'sine');
                    }
                } else {
                    // Check for other animals (not birds) for specific alerts if needed
                    const MAMMAL_CLASSES = ['cat', 'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe', 'pig', 'wolf', 'monkey'];
                    const animalDetection = validDetections.find(p => MAMMAL_CLASSES.includes(p.class));

                    if (animalDetection) {
                        setAnimalSpecies(animalDetection.class);
                        setRepellentStatus('animal');
                        stopRepellentSound();

                        // Alert check (once every 10s per session)
                        if (!detectionStartTimeRef.current || (Date.now() - detectionStartTimeRef.current > 10000)) {
                            const canvas = document.createElement('canvas');
                            canvas.width = videoRef.current.videoWidth;
                            canvas.height = videoRef.current.videoHeight;
                            canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
                            const snapshot = canvas.toDataURL('image/jpeg');

                            const riskLevel: 'Low' | 'Medium' | 'High' =
                                ['bear', 'elephant', 'wolf'].includes(animalDetection.class) ? 'High' :
                                    ['cow', 'horse', 'sheep', 'pig', 'monkey'].includes(animalDetection.class) ? 'Medium' : 'Low';

                            addNotification({
                                title: 'Animal Intrusion Detected',
                                description: `Intrusion Alert: ${animalDetection.class} detected in field. Risk Level: ${riskLevel}.`,
                                status: 'alert',
                                imageUrl: snapshot,
                                riskLevel
                            });

                            detectionStartTimeRef.current = Date.now();
                        }

                        setCurrentDetection({
                            id: 'live',
                            name: `${animalDetection.class.toUpperCase()} Detected`,
                            confidence: Math.round(animalDetection.score * 100),
                            risk: 'High',
                            behavior: 'Ground Intrusion',
                            action: 'Steward Alert Dispatched',
                            timestamp: new Date().toLocaleTimeString()
                        });
                    } else {
                        // Area Secured or No Relevant Targets
                        if (detectionStartTimeRef.current) {
                            console.log("CONTROL_SYSTEM: Area Secured. Terminating all active counter-measures.");
                            setRepellentStatus('cleared');
                            stopRepellentSound();
                            detectionStartTimeRef.current = null;
                            setPersistenceTime(0);
                        } else {
                            if (repellentStatus !== 'cleared') {
                                setRepellentStatus('idle');
                            }
                        }
                        setCurrentDetection(null);
                    }
                }
            } catch (err) {
                console.error('Detection loop error:', err);
            }

            if (isCameraActive) {
                requestAnimationFrame(detectFrame);
            }
        };

        requestAnimationFrame(detectFrame);
    }, [model, isCameraActive, repellentStatus]);

    const startCamera = async () => {
        initAudio();
        setIsLoading(true);
        setCameraError(null);
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });
            setStream(mediaStream);
            setIsCameraActive(true);
        } catch (err: any) {
            console.error('Camera access failed:', err);
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                setCameraError('Camera permission was denied. AI vision requires active lens access.');
            } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                setCameraError('No optical hardware detected on this device.');
            } else {
                setCameraError(`Initialization failure: ${err.message || 'Unknown error'}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const stopCamera = () => {
        stopRepellentSound();
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsCameraActive(false);
        setCurrentDetection(null);
        setSceneType('empty');
        setRepellentStatus('idle');
    };

    const captureSnapshot = () => {
        if (videoRef.current && canvasRef.current && currentDetection) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/png');
                const newEntry = {
                    ...currentDetection,
                    id: Date.now().toString(),
                    image: dataUrl,
                    timestamp: new Date().toLocaleString()
                };
                setHistory(prev => [newEntry, ...prev]);
            }
        }
    };

    return (
        <div className="animate-fade space-y-8 pb-10">
            {/* Autonomous System Status Breadcrumbs */}
            <div className="flex items-center gap-4 bg-black/40 backdrop-blur-xl border border-white/5 p-4 rounded-3xl overflow-hidden relative group">
                <div className={`absolute inset-y-0 left-0 w-1 transition-all duration-700 opacity-20 pointer-events-none ${repellentStatus === 'adaptive' ? 'bg-red-500 w-full' : repellentStatus === 'repelling' ? 'bg-amber-500 w-1/2' : 'bg-primary'}`} />

                <div className="flex items-center gap-2 px-3 border-r border-white/10 shrink-0 relative z-10">
                    <Activity className={`w-4 h-4 ${isCameraActive ? 'text-primary' : 'text-stone-500'}`} />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Control System</span>
                </div>

                <div className="flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap px-2 relative z-10">
                    <div className={`flex items-center gap-2 transition-all duration-500 ${detections.some(d => d.class === 'bird') ? 'opacity-100 scale-100' : 'opacity-30 scale-95'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${detections.some(d => d.class === 'bird') ? 'bg-red-500 animate-pulse' : 'bg-white/20'}`} />
                        <span className="text-[9px] font-bold text-white uppercase tracking-tighter">Bird Detected</span>
                        <ChevronRight className="w-3 h-3 text-white/20" />
                    </div>

                    <div className={`flex items-center gap-2 transition-all duration-500 ${repellentStatus === 'repelling' || repellentStatus === 'adaptive' ? 'opacity-100 scale-100' : 'opacity-30 scale-95'}`}>
                        <Volume2 className={`w-3.5 h-3.5 ${repellentStatus === 'repelling' || repellentStatus === 'adaptive' ? 'text-amber-500' : 'text-white/20'}`} />
                        <span className="text-[9px] font-bold text-white uppercase tracking-tighter">Repellent Active</span>
                        <ChevronRight className="w-3 h-3 text-white/20" />
                    </div>

                    <div className={`flex items-center gap-2 transition-all duration-500 ${repellentStatus === 'adaptive' ? 'opacity-100 scale-100' : 'opacity-30 scale-95'}`}>
                        <Zap className={`w-3.5 h-3.5 ${repellentStatus === 'adaptive' ? 'text-red-500 animate-bounce' : 'text-white/20'}`} />
                        <span className="text-[9px] font-bold text-white uppercase tracking-tighter">Adaptive Modulation</span>
                        <ChevronRight className="w-3 h-3 text-white/20" />
                    </div>

                    <div className={`flex items-center gap-2 transition-all duration-500 ${repellentStatus === 'cleared' ? 'opacity-100 scale-100' : 'opacity-30 scale-95'}`}>
                        <ShieldCheck className={`w-3.5 h-3.5 ${repellentStatus === 'cleared' ? 'text-primary' : 'text-white/20'}`} />
                        <span className="text-[9px] font-bold text-white uppercase tracking-tighter">Target Cleared</span>
                    </div>
                </div>

                {persistenceTime > 0 && (
                    <div className="ml-auto flex items-center gap-3 pr-2 relative z-10">
                        <div className="text-right">
                            <p className="text-[8px] text-stone-500 font-bold uppercase tracking-widest leading-none">Detection Persistence</p>
                            <p className="text-xs font-mono font-bold text-primary">{persistenceTime.toFixed(1)}s</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main View: Camera and Tactical Intel */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-card p-2 relative overflow-hidden aspect-video bg-black rounded-[2.5rem] border border-light shadow-2xl group">
                        {!isCameraActive ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10 space-y-6">
                                {(isLoading || isModelLoading) ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                        <p className="text-xs font-bold text-primary uppercase tracking-[0.2em]">
                                            {isModelLoading ? 'Initializing Neural Engine...' : 'Syncing Optical Feed...'}
                                        </p>
                                    </div>
                                ) : cameraError ? (
                                    <div className="flex flex-col items-center gap-4 animate-fade">
                                        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center">
                                            <AlertCircle className="w-10 h-10 text-red-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-2">Internal Error Detected</h3>
                                            <p className="text-red-400/80 text-xs max-w-xs mx-auto">{cameraError}</p>
                                        </div>
                                        <button
                                            onClick={startCamera}
                                            className="btn-glass px-6 py-3 rounded-xl flex items-center gap-2 text-white border-white/20"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                            Re-establish Connection
                                        </button>
                                    </div>
                                ) : (
                                    <div className="animate-fade flex flex-col items-center gap-6">
                                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                                            <Scan className="w-10 h-10 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-2">Live AI Surveillance</h3>
                                            <p className="text-stone-400 text-sm max-w-xs">Deploy real-time object detection for active bird monitoring and risk assessment.</p>
                                        </div>
                                        <button
                                            onClick={startCamera}
                                            className="btn-primary px-8 py-4 rounded-2xl flex items-center gap-3 shadow-lg shadow-emerald-500/20"
                                        >
                                            <Camera className="w-5 h-5" />
                                            Establish Lens Link
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="relative w-full h-full overflow-hidden rounded-[2rem]">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-cover"
                                />

                                {/* Overlay Layers */}
                                <div className="absolute top-8 right-8 flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10 z-20">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Surveillance Active</span>
                                </div>

                                {/* Dynamic Bounding Boxes for All Detected Objects */}
                                {detections.map((det, index) => {
                                    if (!videoRef.current) return null;
                                    const [x, y, width, height] = det.bbox;
                                    const videoActualWidth = videoRef.current.videoWidth;
                                    const videoActualHeight = videoRef.current.videoHeight;

                                    const isBird = det.class === 'bird';
                                    const isHuman = det.class === 'person';
                                    const colorClass = isBird ? 'border-emerald-500' : isHuman ? 'border-blue-500' : 'border-amber-500';
                                    const bgClass = isBird ? 'bg-emerald-500' : isHuman ? 'bg-blue-500' : 'bg-amber-500';

                                    return (
                                        <div
                                            key={index}
                                            className={`absolute border-2 ${colorClass} shadow-lg transition-all duration-75 z-20 pointer-events-none`}
                                            style={{
                                                top: `${(y / videoActualHeight) * 100}%`,
                                                left: `${(x / videoActualWidth) * 100}%`,
                                                width: `${(width / videoActualWidth) * 100}%`,
                                                height: `${(height / videoActualHeight) * 100}%`,
                                                borderRadius: '0.5rem'
                                            }}
                                        >
                                            <div className={`absolute -top-7 left-0 px-2 py-0.5 ${bgClass} text-white rounded text-[8px] font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap`}>
                                                {isBird ? <Bird className="w-2.5 h-2.5" /> : isHuman ? <User className="w-2.5 h-2.5" /> : <Scan className="w-2.5 h-2.5" />}
                                                {det.class.toUpperCase()} ({Math.round(det.score * 100)}%)
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* "No object detected" Display */}
                                {sceneType === 'empty' && (
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 p-5 bg-black/60 backdrop-blur-lg rounded-[2rem] border border-white/10 animate-fade pointer-events-none z-30">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5">
                                            <ShieldCheck className="w-5 h-5 text-stone-400" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs font-bold text-white uppercase tracking-widest">No object detected</p>
                                            <p className="text-[8px] text-stone-400 uppercase tracking-widest mt-1">Scanning Field for Activity</p>
                                        </div>
                                    </div>
                                )}

                                {/* Controls Dock */}
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 p-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity z-30">
                                    <button
                                        onClick={captureSnapshot}
                                        disabled={!currentDetection}
                                        className="p-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all disabled:opacity-50"
                                        title="Log Frame"
                                    >
                                        <Download className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={stopCamera}
                                        className="p-4 bg-red-500/80 hover:bg-red-500 text-white rounded-2xl transition-all"
                                        title="Sever Link"
                                    >
                                        <CameraOff className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        )}
                        <canvas ref={canvasRef} className="hidden" />
                    </div>

                    {/* tactical Analysis Dashboard */}
                    <div className="glass-card p-10 relative overflow-hidden">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <Target className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-main">Tactical Intelligence</h3>
                                <p className="text-xs text-muted font-medium mt-0.5">Automated threat assessment and species profiling.</p>
                            </div>
                        </div>

                        {currentDetection ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade">
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-2 block font-sans">Target Profile</label>
                                        <div className="text-3xl font-bold text-main">Hostile Avian (Class: Bird)</div>
                                    </div>
                                    <div className="p-5 bg-primary/5 rounded-3xl border border-primary/10">
                                        <h4 className="text-xs font-bold text-primary mb-2 flex items-center gap-2 uppercase tracking-widest">
                                            <AlertCircle className="w-4 h-4" />
                                            Risk Evaluation
                                        </h4>
                                        <div className="flex items-center gap-3">
                                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white">Moderate</span>
                                            <span className="text-sm font-medium text-main">Feeding pattern identified</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 bg-stone-900 rounded-[2rem] text-white border border-stone-800 self-center">
                                    <div className="flex items-center gap-2 text-primary mb-3">
                                        <ShieldAlert className="w-4 h-4" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Autonomous Counter-Measure</span>
                                    </div>
                                    <p className="text-lg font-bold leading-tight mb-4 text-stone-100">
                                        {repellentStatus === 'adaptive' ? 'GenAI Adaptive Pattern Engaged' : 'Active Acoustic Deterrent Live'}
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <div className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all text-center ${repellentStatus === 'adaptive' ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-primary text-white'}`}>
                                            {repellentStatus === 'adaptive' ? 'EXTREME FREQUENCY' : 'NORMAL DETERRENT'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Info className="w-12 h-12 text-primary/10 mb-4" />
                                <p className="text-muted font-bold text-xs uppercase tracking-[0.2em]">
                                    {detections.some(d => d.class === 'person') ? 'Neural Filter: Human Entity Detected' : repellentStatus === 'cleared' ? 'System Status: Target Repelled' : 'Awaiting Avian Target Selection'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Column: Intelligence Log & Frequency Visualizer */}
                <div className="space-y-6">
                    {/* Frequency Visualizer Panel */}
                    <div className="glass-card p-6 bg-stone-950/40 border-primary/10 flex flex-col items-center">
                        <div className="w-full flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <LineChart className={`w-4 h-4 ${repellentStatus === 'idle' ? 'text-stone-500' : 'text-primary'}`} />
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Frequency Analysis</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded-full border border-white/5">
                                <div className={`w-1.5 h-1.5 rounded-full ${repellentStatus === 'idle' ? 'bg-stone-700' : repellentStatus === 'adaptive' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`} />
                                <span className="text-[8px] font-bold text-stone-400 uppercase tracking-tighter">
                                    {repellentStatus === 'idle' ? 'Standby' : repellentStatus === 'adaptive' ? 'Adaptive' : 'Active'}
                                </span>
                            </div>
                        </div>

                        <div className="relative w-full aspect-[4/3] bg-black/40 rounded-2xl border border-white/5 overflow-hidden group">
                            <canvas
                                ref={visualizerCanvasRef}
                                width={300}
                                height={200}
                                className="w-full h-full object-cover"
                            />

                            {(repellentStatus === 'idle' || repellentStatus === 'cleared') && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                                    <span className="text-[9px] font-bold text-stone-500 uppercase tracking-[0.2em] border border-white/5 px-3 py-1.5 rounded-full bg-black/40 animate-fade">
                                        {repellentStatus === 'cleared' ? 'Area Secured' : 'No active frequency'}
                                    </span>
                                </div>
                            )}

                            <div className="absolute bottom-10 left-12 pointer-events-none">
                                <span className="text-[7px] font-bold text-stone-500 uppercase tracking-widest opacity-50">Real-time Spectrum</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-8 flex flex-col h-[520px]">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-main rounded-xl shadow-lg">
                                    <History className="w-5 h-5 text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-bold text-main">Intelligence Log</h3>
                            </div>
                            <button
                                onClick={() => setHistory([])}
                                className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                            {history.length > 0 ? history.map((item) => (
                                <div key={item.id} className="p-4 rounded-3xl border border-soft hover:border-primary/20 transition-all bg-stone-50 dark:bg-stone-900/60 overflow-hidden">
                                    <div className="flex gap-4">
                                        {item.image && (
                                            <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-soft">
                                                <img src={item.image} alt="Log snippet" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1">{item.timestamp}</div>
                                            <h4 className="text-sm font-bold text-main">{item.name} {item.confidence}%</h4>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${item.risk === 'High' ? 'bg-red-100 text-red-600 dark:bg-red-500/10' :
                                                    item.risk === 'Medium' ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/10' :
                                                        'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10'
                                                    }`}>{item.risk} Risk</span>
                                                <span className="text-[10px] text-stone-400">Snapshot Captured</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                                    <Clock className="w-12 h-12 text-stone-200 mb-4" />
                                    <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">No Log Entries</p>
                                </div>
                            )}
                        </div>

                        <button className="mt-8 w-full btn-glass justify-center py-4 rounded-2xl flex items-center gap-2 text-xs font-bold">
                            <Download className="w-4 h-4" />
                            Export Data Abstract
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BirdDetection;
