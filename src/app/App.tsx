import { useEffect, useMemo, useState } from 'react';
import { BoardCanvas } from '../game/render/BoardCanvas';
import { useGameStore } from '../game/state/store';
import { getLocalizedLevelTitle } from '../i18n/text';
import { BoardTopBar } from '../ui/BoardTopBar';
import { TargetOverlay } from '../ui/TargetOverlay';
import { WinCelebrationOverlay } from '../ui/WinCelebrationOverlay';

export function App() {
  const isWin = useGameStore((state) => state.runtime.isWin);
  const language = useGameStore((state) => state.language);
  const levels = useGameStore((state) => state.levels);
  const currentLevelId = useGameStore((state) => state.currentLevelId);
  const loadLevel = useGameStore((state) => state.loadLevel);
  const reset = useGameStore((state) => state.reset);
  const [showTargetOverlay, setShowTargetOverlay] = useState(false);
  const levelIndex = useMemo(
    () => levels.findIndex((level) => level.id === currentLevelId),
    [levels, currentLevelId],
  );
  const nextLevel = levelIndex >= 0 && levelIndex < levels.length - 1 ? levels[levelIndex + 1] : null;

  useEffect(() => {
    if (isWin) {
      setShowTargetOverlay(false);
    }
  }, [isWin]);

  function handleNextLevel() {
    if (nextLevel) {
      loadLevel(nextLevel.id);
      return;
    }

    if (levels[0]) {
      loadLevel(levels[0].id);
    }
  }

  return (
    <div className={`app-shell${isWin ? ' app-shell--win' : ''}`}>
      <main className="board-page">
        <BoardTopBar
          showTargetOverlay={showTargetOverlay}
          onToggleTargetOverlay={() => setShowTargetOverlay((value) => !value)}
        />

        <div className="board-canvas-shell">
          <TargetOverlay active={showTargetOverlay} />
          <BoardCanvas />
        </div>
      </main>

      <WinCelebrationOverlay
        open={isWin}
        language={language}
        hasNextLevel={Boolean(nextLevel)}
        nextLevelTitle={nextLevel ? getLocalizedLevelTitle(nextLevel, language) : undefined}
        onReplayLevel={reset}
        onNextLevel={handleNextLevel}
      />
    </div>
  );
}
