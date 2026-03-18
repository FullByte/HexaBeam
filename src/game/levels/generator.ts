import { createRuntimeState, reduceGameState } from '../core/reducer';
import type {
  CellColor,
  EdgeShot,
  GameState,
  Level,
  RuntimeAction,
  RuntimeState,
} from '../core/types';
import { createLevelFromBlueprint, type LevelBlueprint } from './levelBuilder';
import { validateLevelAgainstSolution } from './solution';

type Difficulty = NonNullable<NonNullable<Level['metadata']>['difficulty']>;

interface DifficultyProfile {
  fixedBlockCount: number;
  playerBlockCount: number;
  shotCount: number;
  minShotLength: number;
  minPaintedCells: number;
  minBlockedShots: number;
  minColors: Record<'cyan' | 'magenta' | 'mix' | 'white', number>;
}

const GRID_SIZE = 16;
const MAX_ATTEMPTS_PER_DIFFICULTY = 1800;

const DIFFICULTY_ORDER: Difficulty[] = ['easy', 'normal', 'hard'];

const DIFFICULTY_PROFILES: Record<Difficulty, DifficultyProfile> = {
  easy: {
    fixedBlockCount: 2,
    playerBlockCount: 1,
    shotCount: 6,
    minShotLength: 4,
    minPaintedCells: 52,
    minBlockedShots: 1,
    minColors: {
      cyan: 8,
      magenta: 8,
      mix: 2,
      white: 1,
    },
  },
  normal: {
    fixedBlockCount: 3,
    playerBlockCount: 2,
    shotCount: 8,
    minShotLength: 4,
    minPaintedCells: 78,
    minBlockedShots: 2,
    minColors: {
      cyan: 10,
      magenta: 10,
      mix: 6,
      white: 3,
    },
  },
  hard: {
    fixedBlockCount: 4,
    playerBlockCount: 3,
    shotCount: 10,
    minShotLength: 3,
    minPaintedCells: 104,
    minBlockedShots: 3,
    minColors: {
      cyan: 14,
      magenta: 14,
      mix: 10,
      white: 6,
    },
  },
};

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomInt(random: () => number, min: number, max: number): number {
  return min + Math.floor(random() * (max - min + 1));
}

function pickRandom<T>(items: readonly T[], random: () => number): T {
  return items[Math.floor(random() * items.length)]!;
}

function positionKey(x: number, y: number): string {
  return `${x}:${y}`;
}

function allEdges(size: number): EdgeShot[] {
  const edges: EdgeShot[] = [];

  for (let index = 0; index < size; index += 1) {
    edges.push({ side: 'top', index });
    edges.push({ side: 'right', index });
    edges.push({ side: 'bottom', index });
    edges.push({ side: 'left', index });
  }

  return edges;
}

function createColorCounts(runtime: RuntimeState): Record<CellColor, number> {
  const counts: Record<CellColor, number> = {
    empty: 0,
    cyan: 0,
    magenta: 0,
    mix: 0,
    white: 0,
  };

  for (const row of runtime.grid) {
    for (const cell of row) {
      counts[cell.color] += 1;
    }
  }

  return counts;
}

function meetsDifficultyConstraints(runtime: RuntimeState, profile: DifficultyProfile): boolean {
  const counts = createColorCounts(runtime);
  const paintedCells = GRID_SIZE * GRID_SIZE - counts.empty;
  const blockedShotCount = runtime.shots.filter((shot) => shot.blockedBy !== null).length;

  return (
    paintedCells >= profile.minPaintedCells &&
    blockedShotCount >= profile.minBlockedShots &&
    counts.cyan >= profile.minColors.cyan &&
    counts.magenta >= profile.minColors.magenta &&
    counts.mix >= profile.minColors.mix &&
    counts.white >= profile.minColors.white
  );
}

function createFixedBlocks(random: () => number, count: number) {
  const used = new Set<string>();
  const blocks: Array<{ x: number; y: number }> = [];

  while (blocks.length < count) {
    const x = randomInt(random, 1, GRID_SIZE - 2);
    const y = randomInt(random, 1, GRID_SIZE - 2);
    const key = positionKey(x, y);

    if (used.has(key)) {
      continue;
    }

    used.add(key);
    blocks.push({ x, y });
  }

  return blocks;
}

function generateActionSequence(
  random: () => number,
  fixedBlocks: Array<{ x: number; y: number }>,
  profile: DifficultyProfile,
): RuntimeAction[] | null {
  const draftLevel: Level = {
    id: '__draft__',
    title: '__draft__',
    description: '__draft__',
    gridSize: GRID_SIZE,
    fixedBlocks,
    playerBlockCount: profile.playerBlockCount,
    targetImage: Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => 'empty' as const),
    ),
  };

  let state: GameState = {
    level: draftLevel,
    runtime: createRuntimeState(draftLevel),
    history: [],
  };
  const actions: RuntimeAction[] = [];

  for (let blockIndex = 0; blockIndex < profile.playerBlockCount; blockIndex += 1) {
    const candidates = state.runtime.grid.flatMap((row, y) =>
      row.flatMap((cell, x) => (!cell.block && cell.color === 'empty' ? [{ x, y }] : [])),
    );

    if (candidates.length === 0) {
      return null;
    }

    const position = pickRandom(candidates, random);
    const action: RuntimeAction = { type: 'place-block', position };
    const nextState = reduceGameState(state, action);

    if (nextState.runtime.moveCount === state.runtime.moveCount) {
      return null;
    }

    actions.push(action);
    state = nextState;
  }

  const edgeCandidates = allEdges(GRID_SIZE);

  for (let shotIndex = 0; shotIndex < profile.shotCount; shotIndex += 1) {
    const availableEdges = edgeCandidates.filter(
      (edge) => !state.runtime.usedEdges.includes(`${edge.side}:${edge.index}`),
    );

    if (availableEdges.length === 0) {
      return null;
    }

    const viableEdges = availableEdges.filter((edge) => {
      const previewState = reduceGameState(state, { type: 'fire-edge', edge });

      if (previewState.runtime.moveCount === state.runtime.moveCount) {
        return false;
      }

      const shot = previewState.runtime.shots[previewState.runtime.shots.length - 1];
      return Boolean(shot && shot.path.length >= profile.minShotLength);
    });

    const shotEdge = pickRandom(
      viableEdges.length > 0 ? viableEdges : availableEdges,
      random,
    );
    const action: RuntimeAction = { type: 'fire-edge', edge: shotEdge };
    const nextState = reduceGameState(state, action);

    if (nextState.runtime.moveCount === state.runtime.moveCount) {
      return null;
    }

    actions.push(action);
    state = nextState;
  }

  if (!meetsDifficultyConstraints(state.runtime, profile)) {
    return null;
  }

  return actions;
}

function generateBlueprintForDifficulty(
  difficulty: Difficulty,
  baseSeed: number,
): LevelBlueprint {
  const profile = DIFFICULTY_PROFILES[difficulty];

  for (let attempt = 0; attempt < MAX_ATTEMPTS_PER_DIFFICULTY; attempt += 1) {
    const random = mulberry32(baseSeed + attempt * 7919);
    const fixedBlocks = createFixedBlocks(random, profile.fixedBlockCount);
    const solution = generateActionSequence(random, fixedBlocks, profile);

    if (!solution) {
      continue;
    }

    return {
      id: `generated-${difficulty}`,
      title: `${difficulty.charAt(0).toUpperCase()}${difficulty.slice(1)}`,
      description: `Procedurally generated ${difficulty} puzzle with canonical notation.`,
      difficulty,
      playerBlockCount: profile.playerBlockCount,
      fixedBlocks,
      solution,
    };
  }

  throw new Error(`Unable to generate a valid ${difficulty} puzzle within attempt budget.`);
}

export function generateDifficultyLevels(): Level[] {
  const baseSeed = 0x50ec7a;
  const levels: Level[] = DIFFICULTY_ORDER.map((difficulty, index) => {
    const blueprint = generateBlueprintForDifficulty(difficulty, baseSeed + index * 1299721);
    const level = createLevelFromBlueprint(blueprint);
    const validation = validateLevelAgainstSolution(level);

    if (!validation.ok) {
      throw new Error(`Generated level '${difficulty}' failed validation: ${validation.reason}`);
    }

    return level;
  });

  return levels;
}
