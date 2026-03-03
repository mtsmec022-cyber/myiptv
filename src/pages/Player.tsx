import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Volume2, AlertCircle, Loader2 } from 'lucide-react';

export function Player() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const rawUrl = searchParams.get('url') || '';
  const title = searchParams.get('title') || 'Canal ao Vivo';

  // Ensure the URL is proxied if it's an external IPTV URL
  const url = React.useMemo(() => {
    if (!rawUrl) return '';
    if (rawUrl.startsWith('/') || rawUrl.startsWith('http://localhost') || rawUrl.startsWith('https://ais-')) {
      return rawUrl;
    }
    return `/api/stream?url=${encodeURIComponent(rawUrl)}`;
  }, [rawUrl]);

  useEffect(() => {
    // Optimization: prevent background rendering issues on some TVs
    document.body.style.backgroundColor = 'black';

    if (!url) {
      navigate(-1);
      return;
    }

    if (!playerRef.current && videoRef.current) {
      const videoElement = document.createElement('video-js');
      videoElement.classList.add('vjs-big-play-centered');
      videoRef.current.appendChild(videoElement);

      // Determine type based on original URL if it's proxied
      const decodedUrl = decodeURIComponent(url);
      const isHLS = decodedUrl.includes('.m3u8') || decodedUrl.includes('action=get_live_streams');
      const isMP4 = decodedUrl.includes('.mp4') || decodedUrl.includes('.mkv');
      const isTS = decodedUrl.includes('.ts');

      // For Xtream Live TV, .ts streams are best handled by the HLS engine (VHS)
      // which can remux TS to fMP4 in the browser.
      const mimeType = isHLS ? 'application/x-mpegURL' : (isTS ? 'application/x-mpegURL' : 'video/mp4');

      const player = playerRef.current = videojs(videoElement, {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        playbackRates: [0.5, 1, 1.5, 2],
        userActions: {
          hotkeys: true
        },
        html5: {
          vhs: {
            overrideNative: true,
            fastQualityChange: true,
            useDevicePixelRatio: true
          }
        },
        sources: [{
          src: url,
          type: mimeType
        }]
      });

      player.on('waiting', () => setLoading(true));
      player.on('playing', () => {
        setLoading(false);
        setIsPlaying(true);
      });
      player.on('pause', () => setIsPlaying(false));
      player.on('canplay', () => setLoading(false));

      player.on('error', () => {
        const err = player.error();
        console.error('Detailed Player Error:', {
          code: err?.code,
          message: err?.message,
          url: url,
          mimeType: mimeType
        });
        setError(`Erro ao reproduzir conteúdo: ${err?.message || 'Erro de conexão ou formato não suportado'}`);
        setLoading(false);
      });
    }

    return () => {
      document.body.style.backgroundColor = '';
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [url]);

  const [showDebug, setShowDebug] = useState(false);

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col overflow-hidden">
      {/* Overlay Controls */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between p-12 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity bg-gradient-to-b from-black/80 via-transparent to-black/80">
        <header className="flex items-center gap-6">
          <button 
            id="player-back"
            data-focusable="true"
            onClick={() => navigate(-1)}
            className="p-4 bg-white/10 rounded-full hover:bg-tv-accent transition-colors tv-focus"
          >
            <ArrowLeft size={32} />
          </button>
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-white/60">Reproduzindo em Alta Definição</p>
          </div>
        </header>

        {loading && !error && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Loader2 size={80} className="animate-spin text-tv-accent" />
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-black/80 backdrop-blur-sm z-50">
            <AlertCircle size={80} className="text-red-500" />
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-red-500">Erro de Reprodução</h2>
              <p className="text-xl text-gray-400 max-w-lg">{error}</p>
            </div>
            <div className="flex flex-col gap-4 items-center">
              <div className="flex gap-4">
                <button 
                  onClick={() => window.location.reload()}
                  className="px-8 py-3 bg-tv-accent rounded-full font-bold hover:scale-105 transition-transform tv-focus"
                >
                  Tentar Novamente
                </button>
                <button 
                  onClick={() => navigate(-1)}
                  className="px-8 py-3 bg-white/10 rounded-full font-bold hover:bg-white/20 transition-colors tv-focus"
                >
                  Voltar
                </button>
              </div>
              <button 
                onClick={() => setShowDebug(!showDebug)}
                className="text-xs text-gray-500 underline"
              >
                {showDebug ? 'Ocultar Detalhes' : 'Ver Detalhes Técnicos'}
              </button>
              {showDebug && (
                <div className="mt-4 p-4 bg-black/60 rounded text-left font-mono text-[10px] max-w-2xl overflow-auto border border-white/10">
                  <p>URL: {url}</p>
                  <p>Decoded: {decodeURIComponent(url)}</p>
                  <p>Mime: {error.includes('formato') ? 'Incompatível' : 'Detectado'}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <footer className="flex flex-col gap-8">
          <div className="flex items-center justify-center gap-12">
            <button id="player-rewind" data-focusable="true" className="p-4 hover:text-tv-accent transition-colors tv-focus"><SkipBack size={48} /></button>
            <button 
              id="player-play-pause" 
              data-focusable="true" 
              onClick={() => {
                if (playerRef.current) {
                  if (playerRef.current.paused()) {
                    playerRef.current.play();
                  } else {
                    playerRef.current.pause();
                  }
                }
              }}
              className="p-6 bg-white text-black rounded-full hover:scale-110 transition-transform tv-focus"
            >
              {isPlaying ? <Pause size={48} fill="currentColor" /> : <Play size={48} fill="currentColor" />}
            </button>
            <button id="player-forward" data-focusable="true" className="p-4 hover:text-tv-accent transition-colors tv-focus"><SkipForward size={48} /></button>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-sm font-mono opacity-60">00:00:00</span>
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-tv-accent w-0" />
            </div>
            <span className="text-sm font-mono opacity-60">LIVE</span>
            <Volume2 size={24} className="opacity-60" />
          </div>
        </footer>
      </div>

      <div data-vjs-player className="flex-1">
        <div ref={videoRef} className="w-full h-full" />
      </div>
    </div>
  );
}
