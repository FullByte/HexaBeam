import { create } from 'zustand';
import type { Language } from '../../i18n/text';
import { createEmptyPreviewState, getBlockPreview, getShotPreview } from '../core/preview';
import { createGameState, reduceGameState } from '../core/reducer';
import type { EdgeShot, GameState, GridPosition, Level, PreviewState } from '../core/types';
import { levels, levelsById } from '../levels/levels';

const initialLevel = levels[0]!;
const initialState = createGameState(initialLevel);

export interface GameStore extends GameState {
  language: Language;
  levels: Level[];
  currentLevelId: string;
  preview: PreviewState;
  setLanguage: (language: Language) => void;
  loadLevel: (levelId: string) => void;
  setHoveredCell: (position: GridPosition | null) => void;
  setHoveredEdge: (edge: EdgeShot | null) => void;
  clearPreview: () => void;
  placeBlock: (position: GridPosition) => void;
  fireEdge: (edge: EdgeShot) => void;
  undo: () => void;
  reset: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,
  language: 'de',
  levels,
  currentLevelId: initialLevel.id,
  preview: createEmptyPreviewState(),
  setLanguage: (language) => {
    set((state) => ({
      ...state,
      language,
    }));
  },
  loadLevel: (levelId) => {
    const level = levelsById.get(levelId);

    if (!level) {
      return;
    }

    set((state) => ({
      ...state,
      ...createGameState(level),
      currentLevelId: level.id,
      preview: createEmptyPreviewState(),
    }));
  },
  setHoveredCell: (position) => {
    const runtime = get().runtime;

    set((state) => ({
      ...state,
      preview: {
        hoveredCell: position,
        hoveredEdge: null,
        block: position ? getBlockPreview(runtime, position) : null,
        shot: null,
      },
    }));
  },
  setHoveredEdge: (edge) => {
    const runtime = get().runtime;

    set((state) => ({
      ...state,
      preview: {
        hoveredCell: null,
        hoveredEdge: edge,
        block: null,
        shot: edge ? getShotPreview(runtime, edge) : null,
      },
    }));
  },
  clearPreview: () => {
    set((state) => ({
      ...state,
      preview: createEmptyPreviewState(),
    }));
  },
  placeBlock: (position) => {
    set((state) =>
      state.runtime.isWin
        ? {
            ...state,
            preview: createEmptyPreviewState(),
          }
        : {
            ...state,
            ...reduceGameState(state, { type: 'place-block', position }),
            preview: createEmptyPreviewState(),
          },
    );
  },
  fireEdge: (edge) => {
    set((state) =>
      state.runtime.isWin
        ? {
            ...state,
            preview: createEmptyPreviewState(),
          }
        : {
            ...state,
            ...reduceGameState(state, { type: 'fire-edge', edge }),
            preview: createEmptyPreviewState(),
          },
    );
  },
  undo: () => {
    set((state) => ({
      ...state,
      ...reduceGameState(state, { type: 'undo' }),
      preview: createEmptyPreviewState(),
    }));
  },
  reset: () => {
    set((state) => ({
      ...state,
      ...reduceGameState(state, { type: 'reset' }),
      preview: createEmptyPreviewState(),
    }));
  },
}));
