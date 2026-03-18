import { useGameStore } from '../game/state/store';
import { getLocalizedLevelTitle, t, translateCoreMessage, type Language } from '../i18n/text';
import { BackgroundMusicPlayer } from './BackgroundMusicPlayer';
import { HelpDialog } from './HelpDialog';

interface BoardTopBarProps {
  showTargetOverlay: boolean;
  onToggleTargetOverlay: () => void;
}

export function BoardTopBar({ showTargetOverlay, onToggleTargetOverlay }: BoardTopBarProps) {
  const language = useGameStore((state) => state.language);
  const setLanguage = useGameStore((state) => state.setLanguage);
  const totalPlayerBlocks = useGameStore((state) => state.level.playerBlockCount);
  const remainingPlayerBlocks = useGameStore((state) => state.runtime.remainingPlayerBlocks);
  const message = useGameStore((state) => state.runtime.lastActionMessage);
  const levels = useGameStore((state) => state.levels);
  const currentLevelId = useGameStore((state) => state.currentLevelId);
  const loadLevel = useGameStore((state) => state.loadLevel);
  const canUndo = useGameStore((state) => state.history.length > 0);
  const undo = useGameStore((state) => state.undo);
  const reset = useGameStore((state) => state.reset);

  return (
    <div className="board-topbar">
      <div className="board-topbar__row">
        <div className="block-window" aria-label={t(language, 'blocks.label')}>
          <span className="block-window__label">{t(language, 'blocks.label')}</span>
          <div className="block-window__slots">
            {Array.from({ length: totalPlayerBlocks }, (_, index) => {
              const isUsed = index >= remainingPlayerBlocks;

              return (
                <span
                  key={`reserve-block-${index}`}
                  className={`block-window__slot${isUsed ? ' block-window__slot--used' : ''}`}
                />
              );
            })}
          </div>
        </div>

        <div className="board-topbar__controls">
          <select
            className="level-select-inline language-select"
            value={language}
            onChange={(event) => setLanguage(event.target.value as Language)}
            aria-label={t(language, 'language.label')}
          >
            <option value="en">{t(language, 'language.en')}</option>
            <option value="de">{t(language, 'language.de')}</option>
          </select>
          <select
            className="level-select-inline"
            value={currentLevelId}
            onChange={(event) => loadLevel(event.target.value)}
          >
            {levels.map((level) => (
              <option key={level.id} value={level.id}>
                {getLocalizedLevelTitle(level, language)}
              </option>
            ))}
          </select>
          <button type="button" className="control-button" onClick={undo} disabled={!canUndo}>
            {t(language, 'controls.undo')}
          </button>
          <button type="button" className="control-button" onClick={reset}>
            {t(language, 'controls.reset')}
          </button>
          <HelpDialog />
          <button
            type="button"
            className={`help-button${showTargetOverlay ? ' help-button--active' : ''}`}
            onClick={onToggleTargetOverlay}
          >
            {t(language, 'controls.target')}
          </button>
          <BackgroundMusicPlayer />
        </div>
      </div>

      {message ? (
        <div className="message-box board-topbar__message">{translateCoreMessage(message, language)}</div>
      ) : null}
    </div>
  );
}
