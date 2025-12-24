
import React, { useState, useEffect, Suspense } from 'react';
import Scene from './components/Scene';
import InteractionOverlay from './components/InteractionOverlay';
import { Volume2, VolumeX, ImagePlus } from 'lucide-react';

// --- 背景音乐配置 ---
// 你可以替换为任何 MP3 直链
const BGM_URL = "https://cdn.pixabay.com/audio/2022/11/22/audio_feb9372138.mp3"; // 温馨圣诞钢琴曲

const INITIAL_PHOTOS = [
  "https://images.unsplash.com/photo-1544273677-277914c9ad31?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512389142860-9c449e58a543?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1543589077-47d816067da1?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511268011861-691ed210aae8?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1576919228236-a097c32a5cd4?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1513297844881-47406a13297e?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1482331008587-036662778403?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1514064019862-23e2a332a6a6?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1545048702-79362596cdc9?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1513297887559-90696a40590a?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=800&auto=format&fit=crop",
];

const App: React.FC = () => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [interactionMode, setInteractionMode] = useState<'idle' | 'explode'>('idle');
  const [isLoaded, setIsLoaded] = useState(false);
  const [photos, setPhotos] = useState<string[]>(INITIAL_PHOTOS);
  const [hasExplodedOnce, setHasExplodedOnce] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleAudio = () => setIsAudioEnabled(!isAudioEnabled);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files).map((file: File) => URL.createObjectURL(file));
      setPhotos(prev => [...newPhotos, ...prev].slice(0, 12)); 
    }
  };

  const toggleInteractionMode = () => {
    setInteractionMode(prev => {
      const next = prev === 'idle' ? 'explode' : 'idle';
      if (next === 'explode') setHasExplodedOnce(true);
      return next;
    });
  };

  return (
    <div className="relative w-full h-screen bg-[#050505] overflow-hidden select-none text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(40,80,50,0.25)_0%,_rgba(0,0,0,1)_100%)] pointer-events-none" />

      <div className="absolute inset-0 z-10">
        <Suspense fallback={null}>
          <Scene 
            interactionMode={interactionMode} 
            setInteractionMode={toggleInteractionMode}
            isAudioEnabled={isAudioEnabled}
            photos={photos}
            isPostExplosion={hasExplodedOnce}
            bgmUrl={BGM_URL}
          />
        </Suspense>
      </div>

      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-8 md:p-12">
        <header className="flex justify-between items-start">
          <div className="transition-opacity duration-1500" style={{ opacity: isLoaded ? 1 : 0 }}>
            <h1 className="text-white text-4xl md:text-6xl font-serif tracking-tight leading-none drop-shadow-2xl">Merry Christmas</h1>
            <p className="text-white/50 text-[11px] mt-3 uppercase tracking-[0.6em] font-light italic">Loooong Time No See</p>
          </div>
          
          <div className="flex gap-4 pointer-events-auto">
            <label className="p-3.5 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-500 backdrop-blur-md cursor-pointer group flex items-center gap-2">
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
              <ImagePlus size={20} />
              <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-700 ease-in-out whitespace-nowrap text-[10px] uppercase tracking-widest px-0 group-hover:px-3">Update Memories</span>
            </label>
            <button 
              onClick={handleToggleAudio}
              className="p-3.5 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-500 backdrop-blur-md"
            >
              {isAudioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
          </div>
        </header>

        <footer className="flex justify-center items-end">
          <InteractionOverlay mode={interactionMode} hasPhotos={photos.length > 0} isPostExplosion={hasExplodedOnce} />
        </footer>
      </div>

      {!isLoaded && (
        <div className="absolute inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-t-2 border-white/10 border-r-2 border-white/30 rounded-full animate-spin mb-8" />
          <p className="text-white/20 text-[10px] uppercase tracking-[0.6em] font-light animate-pulse">Loading Your Memory Garden...</p>
        </div>
      )}
    </div>
  );
};

export default App;
