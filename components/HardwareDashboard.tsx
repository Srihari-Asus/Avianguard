
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Cpu, Wifi, Battery, Activity, Camera, Volume2,
  ShieldCheck, AlertTriangle, RefreshCw, PlayCircle,
  Zap, LineChart
} from 'lucide-react';
import { HardwareDevice, HardwareEvent } from '../types';

const HardwareDashboard: React.FC = () => {
  const [devices, setDevices] = useState<HardwareDevice[]>([
    {
      id: 'ESP-001',
      name: 'North Ridge Guardian',
      status: 'online',
      battery: 84,
      signalStrength: 92,
      lastDetection: Date.now() - 3600000,
      location: { x: 200, y: 150 },
      sensors: { pir: false, ultrasonic: 420, lux: 800 }
    },
    {
      id: 'ESP-002',
      name: 'Wetland Sector A',
      status: 'warning',
      battery: 12,
      signalStrength: 45,
      lastDetection: Date.now() - 15000,
      location: { x: 450, y: 300 },
      sensors: { pir: true, ultrasonic: 50, lux: 120 }
    }
  ]);

  const [events, setEvents] = useState<HardwareEvent[]>([
    {
      id: 'evt-1',
      deviceId: 'ESP-002',
      timestamp: Date.now() - 15000,
      triggerType: 'pir',
      birdDetected: 'sparrow',
      actionTaken: 'Ultrasonic Pulse (Pattern B)',
      effectiveness: 85,
      imageUrl: 'https://images.unsplash.com/photo-1555169062-013468b47731?auto=format&fit=crop&q=80&w=200'
    }
  ]);

  const [activeSound, setActiveSound] = useState<string | null>(null);

  // Audio & Visualizer Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const visualizerCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize Audio Logic
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

  const startTestSound = (deviceId: string) => {
    initAudio();
    if (!audioCtxRef.current || !analyserRef.current) return;

    // Stop existing if any
    stopSound();

    setActiveSound(deviceId);
    const osc = audioCtxRef.current.createOscillator();
    const gain = audioCtxRef.current.createGain();

    osc.type = 'sine';
    const baseFreq = 18000 + Math.random() * 2000; // High frequency for test
    osc.frequency.setValueAtTime(baseFreq, audioCtxRef.current.currentTime);

    // Simple frequency sweep to show movement
    osc.frequency.exponentialRampToValueAtTime(baseFreq - 3000, audioCtxRef.current.currentTime + 3);

    gain.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, audioCtxRef.current.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(analyserRef.current);
    analyserRef.current.connect(audioCtxRef.current.destination);

    osc.start();
    oscillatorRef.current = osc;
    gainNodeRef.current = gain;

    // Auto-stop after 3 seconds
    setTimeout(() => {
      stopSound();
    }, 3000);
  };

  const stopSound = () => {
    if (oscillatorRef.current && audioCtxRef.current) {
      const currentOsc = oscillatorRef.current;
      const currentGain = gainNodeRef.current;

      if (currentGain) {
        currentGain.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 0.1);
      }

      setTimeout(() => {
        try {
          currentOsc.stop();
          currentOsc.disconnect();
        } catch (e) { }
      }, 150);

      oscillatorRef.current = null;
      gainNodeRef.current = null;
      setActiveSound(null);
    }
  };

  // Visualization Rendering Logic
  const drawWaveform = useCallback(() => {
    if (!visualizerCanvasRef.current || !analyserRef.current) return;

    const canvas = visualizerCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);
      analyser.getByteFrequencyData(dataArray);

      const width = canvas.width;
      const height = canvas.height;
      const padding = { top: 20, right: 30, bottom: 30, left: 40 };
      const chartWidth = width - padding.left - padding.right;
      const chartHeight = height - padding.top - padding.bottom;

      // Scientific Background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);

      // Subtle Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i <= 5; i++) {
        const x = padding.left + (i / 5) * chartWidth;
        ctx.moveTo(x, padding.top);
        ctx.lineTo(x, height - padding.bottom);
      }
      for (let i = 0; i <= 4; i++) {
        const y = padding.top + (i / 4) * chartHeight;
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
      }
      ctx.stroke();

      // Axes
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath();
      ctx.moveTo(padding.left, padding.top);
      ctx.lineTo(padding.left, height - padding.bottom);
      ctx.lineTo(width - padding.right, height - padding.bottom);
      ctx.stroke();

      // Labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.font = 'bold 7px Inter, sans-serif';
      ctx.textAlign = 'center';
      ['0k', '5k', '10k', '15k', '20k'].forEach((label, i) => {
        const x = padding.left + (i / 4) * chartWidth;
        ctx.fillText(label, x, height - 15);
      });

      ctx.save();
      ctx.translate(12, padding.top + chartHeight / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('AMP (dB)', 0, 0);
      ctx.restore();

      if (!activeSound) {
        ctx.beginPath();
        ctx.moveTo(padding.left, height - padding.bottom);
        ctx.lineTo(width - padding.right, height - padding.bottom);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.stroke();
        return;
      }

      // Glowing Waveform
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 12;
      ctx.shadowColor = 'rgba(16, 185, 129, 0.5)';
      ctx.beginPath();

      const sliceWidth = chartWidth / bufferLength;
      let x = padding.left;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 255.0;
        const y = (height - padding.bottom) - (v * chartHeight);

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          const prevV = dataArray[i - 1] / 255.0;
          const prevY = (height - padding.bottom) - (prevV * chartHeight);
          const prevX = x - sliceWidth;

          ctx.bezierCurveTo(
            prevX + (x - prevX) / 2, prevY,
            prevX + (x - prevX) / 2, y,
            x, y
          );
        }
        x += sliceWidth;
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    };
    render();
  }, [activeSound]);

  useEffect(() => {
    drawWaveform();
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [drawWaveform]);

  // Simulate real-time sensors
  useEffect(() => {
    const interval = setInterval(() => {
      setDevices(prev => prev.map(d => ({
        ...d,
        sensors: { ...d.sensors, lux: d.sensors.lux + (Math.random() > 0.5 ? 2 : -2) }
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-fade">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Device Status Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
          {devices.map(device => (
            <div key={device.id} className="glass-card p-10 relative overflow-hidden group border-soft hover:border-primary/20 transition-all duration-500">
              <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-700 ${device.status === 'online' ? 'text-emerald-500' : 'text-amber-500'}`}>
                <Cpu className="w-full h-full" />
              </div>

              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-2 h-2 rounded-full ${device.status === 'online' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">{device.id}</span>
                  </div>
                  <h4 className="text-2xl font-bold text-main">{device.name}</h4>
                </div>
                <div className="flex flex-col items-end gap-2 text-muted">
                  <div className="flex items-center gap-1.5">
                    <Battery className={`w-4 h-4 ${device.battery < 20 ? 'text-red-500' : 'text-primary'}`} />
                    <span className="text-xs font-bold">{device.battery}%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Wifi className="w-4 h-4 text-stone-400" />
                    <span className="text-xs font-bold">{device.signalStrength}%</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-10">
                <div className="p-4 bg-stone-50 dark:bg-stone-900/40 rounded-2xl text-center border border-soft">
                  <Activity className="w-4 h-4 text-stone-400 mx-auto mb-2" />
                  <div className="text-[9px] font-bold text-stone-500 uppercase tracking-widest leading-none mb-1">Motion</div>
                  <div className={`text-xs font-bold ${device.sensors.pir ? 'text-emerald-500' : 'text-stone-400'}`}>
                    {device.sensors.pir ? 'DETECTED' : 'CLEAR'}
                  </div>
                </div>
                <div className="p-4 bg-stone-50 dark:bg-stone-900/40 rounded-2xl text-center border border-soft">
                  <RefreshCw className="w-4 h-4 text-stone-400 mx-auto mb-2" />
                  <div className="text-[9px] font-bold text-stone-500 uppercase tracking-widest leading-none mb-1">Proximity</div>
                  <div className="text-xs font-bold text-main">{device.sensors.ultrasonic}cm</div>
                </div>
                <div className="p-4 bg-stone-50 dark:bg-stone-900/40 rounded-2xl text-center border border-soft">
                  <ShieldCheck className="w-4 h-4 text-stone-400 mx-auto mb-2" />
                  <div className="text-[9px] font-bold text-stone-500 uppercase tracking-widest leading-none mb-1">Health</div>
                  <div className="text-xs font-bold text-main">OPT-1</div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => startTestSound(device.id)}
                  className={`flex-1 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 overflow-hidden group/btn ${activeSound === device.id ? 'bg-primary text-white shadow-lg shadow-emerald-500/30' : 'bg-stone-800 text-white hover:bg-stone-900'}`}
                >
                  {activeSound === device.id ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Emitting Pulse...
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                      Test Sound
                    </>
                  )}
                </button>
                <button className="flex-1 py-4 border border-soft text-muted rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-soft transition-all flex items-center justify-center gap-3">
                  <Camera className="w-4 h-4" /> Snapshot
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Live Panel: Visualizer & Event Timeline */}
        <div className="space-y-6">
          {/* Scientific Frequency Visualizer */}
          <div className="glass-card p-8 border-primary/10 relative overflow-hidden group h-fit">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <LineChart className={`w-5 h-5 ${activeSound ? 'text-primary' : 'text-stone-500'}`} />
                <h3 className="text-xl font-bold text-main">Frequency Analysis</h3>
              </div>
            </div>

            <div className="relative aspect-video rounded-[1.5rem] bg-[#0a0a0a] border border-white/5 overflow-hidden group/canvas shadow-inner">
              <canvas
                ref={visualizerCanvasRef}
                width={300}
                height={180}
                className="w-full h-full object-cover"
              />

              {!activeSound && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] animate-fade">
                  <Zap className="w-8 h-8 text-stone-600 mb-2 opacity-20" />
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.3em] border border-white/5 px-4 py-2 rounded-full bg-black/60 shadow-xl">
                    No active frequency
                  </span>
                </div>
              )}

              {activeSound && (
                <div className="absolute top-4 left-4 flex items-center gap-2 px-2 py-1 bg-primary/20 backdrop-blur-md rounded-lg border border-primary/20 animate-fade">
                  <div className="w-1.5 h-1.5 bg-accent-neon rounded-full animate-pulse" />
                  <span className="text-[8px] font-bold text-primary uppercase tracking-widest">Live Capture</span>
                </div>
              )}
            </div>

            <div className="mt-6 p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Active Emitter</span>
              <span className="text-[10px] font-mono font-bold text-primary">
                {activeSound ? `NODE: ${activeSound}` : 'SYSTEM STANDBY'}
              </span>
            </div>
          </div>

          <div className="glass-card p-10 flex flex-col h-[520px]">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-bold flex items-center gap-3 text-main">
                <Activity className="w-6 h-6 text-emerald-500" /> Event Narrative
              </h3>
              <div className="px-3 py-1 bg-white dark:bg-stone-800 rounded-full border border-soft text-[10px] font-bold text-primary uppercase tracking-widest shadow-sm">
                Live Feed
              </div>
            </div>

            <div className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
              {events.map(event => (
                <div key={event.id} className="relative pl-8 border-l-2 border-primary/20 pb-2">
                  <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-app" />
                  <div className="p-6 rounded-[2rem] border border-soft bg-stone-50 dark:bg-stone-900/40">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] block mb-1">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                        <h5 className="text-lg font-bold text-main">{event.deviceId}: Movement Detection</h5>
                      </div>
                      <div className="bg-primary/20 text-primary text-[10px] font-bold px-3 py-1.5 rounded-xl border border-primary/10">
                        {event.effectiveness}% Eff.
                      </div>
                    </div>

                    {event.imageUrl && (
                      <div className="relative rounded-3xl overflow-hidden mb-6 group/img cursor-pointer border border-soft">
                        <img src={event.imageUrl} alt="Detection" className="w-full h-40 object-cover opacity-90 group-hover/img:opacity-100 transition-all duration-500 group-hover/img:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-5 opacity-0 group-hover/img:opacity-100 transition-opacity">
                          <span className="text-[11px] font-bold text-white flex items-center gap-2">
                            <PlayCircle className="w-4 h-4 text-primary" /> Review Biological Frame
                          </span>
                        </div>
                      </div>
                    )}

                    <p className="text-sm text-muted leading-relaxed mb-6 font-medium">
                      Sensor fusion (PIR + Ultrasonic) confirmed presence of <span className="text-main font-bold">{event.birdDetected}</span>. {event.actionTaken} successfully deterred flight.
                    </p>

                    <div className="flex gap-4 border-t border-soft pt-6">
                      <button className="text-[10px] font-bold text-stone-400 hover:text-primary uppercase tracking-widest transition-colors">Correct ID</button>
                      <div className="w-[1px] h-3 bg-soft self-center" />
                      <button className="text-[10px] font-bold text-stone-400 hover:text-red-500 uppercase tracking-widest transition-colors">Dismiss</button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="text-center py-8">
                <p className="text-stone-500 text-[10px] font-bold uppercase tracking-[0.3em] italic animate-pulse">Waiting for field events...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HardwareDashboard;
