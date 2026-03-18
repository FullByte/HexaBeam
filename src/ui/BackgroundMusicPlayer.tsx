import { useEffect, useRef, useState } from 'react';
import { t } from '../i18n/text';
import { useGameStore } from '../game/state/store';

interface MusicTrack {
  title: string;
  src: string;
}

function isValidTrack(value: unknown): value is MusicTrack {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<MusicTrack>;
  return typeof candidate.title === 'string' && typeof candidate.src === 'string';
}

export function BackgroundMusicPlayer() {
  const language = useGameStore((state) => state.language);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [currentTrackSrc, setCurrentTrackSrc] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasTrackListError, setHasTrackListError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadTrackConfig() {
      try {
        const response = await fetch('/audio/tracks.json', { cache: 'no-store' });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data: unknown = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Invalid track list format.');
        }

        const validTracks = data.filter(isValidTrack);

        if (cancelled) {
          return;
        }

        setTracks(validTracks);
        setHasTrackListError(false);
      } catch {
        if (!cancelled) {
          setTracks([]);
          setCurrentTrackSrc('');
          setHasTrackListError(true);
        }
      }
    }

    loadTrackConfig();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  function pickRandomTrackSrc() {
    if (tracks.length === 0) {
      return '';
    }

    if (tracks.length === 1) {
      return tracks[0]!.src;
    }

    const filtered = tracks.filter((track) => track.src !== currentTrackSrc);
    const pool = filtered.length > 0 ? filtered : tracks;
    return pool[Math.floor(Math.random() * pool.length)]!.src;
  }

  async function togglePlayback() {
    const audio = audioRef.current;

    if (!audio || tracks.length === 0) {
      return;
    }

    if (audio.paused) {
      const randomTrackSrc = pickRandomTrackSrc();

      if (!randomTrackSrc) {
        return;
      }

      if (audio.src !== new URL(randomTrackSrc, window.location.origin).toString()) {
        audio.src = randomTrackSrc;
        audio.load();
      }

      setCurrentTrackSrc(randomTrackSrc);

      try {
        await audio.play();
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    audio.pause();
  }

  return (
    <div className="music-player">
      <audio ref={audioRef} preload="none" loop />
      <button
        type="button"
        className="control-button music-player__button"
        onClick={() => void togglePlayback()}
        disabled={tracks.length === 0}
        title={tracks.length === 0 ? (hasTrackListError ? t(language, 'music.noList') : t(language, 'music.noTracks')) : undefined}
      >
        {isPlaying ? t(language, 'controls.pause') : t(language, 'controls.play')}
      </button>
    </div>
  );
}
