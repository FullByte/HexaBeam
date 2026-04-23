import type { Level } from '../core/types';

export const DIFFICULTY_ORDER = ['easy', 'normal', 'hard'] as const;
export type Difficulty = (typeof DIFFICULTY_ORDER)[number];

export type PuzzlePool = Record<Difficulty, Level[]>;

export interface PuzzlePoolDocument {
  generatedAt: string;
  puzzles: PuzzlePool;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function hasDifficulty(value: unknown): value is Difficulty {
  return value === 'easy' || value === 'normal' || value === 'hard';
}

function isGridPosition(value: unknown): value is { x: number; y: number } {
  if (!isObject(value)) {
    return false;
  }

  return typeof value.x === 'number' && typeof value.y === 'number';
}

function isRuntimeAction(value: unknown): boolean {
  if (!isObject(value) || typeof value.type !== 'string') {
    return false;
  }

  if (value.type === 'place-block') {
    return isGridPosition(value.position);
  }

  if (value.type === 'fire-edge') {
    if (!isObject(value.edge)) {
      return false;
    }

    return (
      (value.edge.side === 'top' ||
        value.edge.side === 'right' ||
        value.edge.side === 'bottom' ||
        value.edge.side === 'left') &&
      typeof value.edge.index === 'number'
    );
  }

  return false;
}

function isTargetImage(value: unknown): boolean {
  if (!Array.isArray(value)) {
    return false;
  }

  return value.every((row) => Array.isArray(row));
}

function isLevelLike(value: unknown): value is Level {
  if (!isObject(value)) {
    return false;
  }

  if (
    typeof value.id !== 'string' ||
    typeof value.title !== 'string' ||
    typeof value.description !== 'string' ||
    typeof value.gridSize !== 'number' ||
    !Array.isArray(value.fixedBlocks) ||
    typeof value.playerBlockCount !== 'number' ||
    !isTargetImage(value.targetImage)
  ) {
    return false;
  }

  if (!value.fixedBlocks.every((position) => isGridPosition(position))) {
    return false;
  }

  if (value.metadata === undefined) {
    return true;
  }

  if (!isObject(value.metadata)) {
    return false;
  }

  if (value.metadata.difficulty !== undefined && !hasDifficulty(value.metadata.difficulty)) {
    return false;
  }

  if (value.metadata.solution !== undefined) {
    if (!Array.isArray(value.metadata.solution) || !value.metadata.solution.every((action) => isRuntimeAction(action))) {
      return false;
    }
  }

  if (value.metadata.solutionNotation !== undefined) {
    if (!Array.isArray(value.metadata.solutionNotation) || !value.metadata.solutionNotation.every((item) => typeof item === 'string')) {
      return false;
    }
  }

  return true;
}

export function createEmptyPuzzlePool(): PuzzlePool {
  return {
    easy: [],
    normal: [],
    hard: [],
  };
}

export function getLevelDifficulty(level: Level): Difficulty {
  return level.metadata?.difficulty ?? 'normal';
}

export function buildPuzzlePoolFromLevels(levels: Level[]): PuzzlePool {
  const pool = createEmptyPuzzlePool();

  for (const level of levels) {
    const difficulty = getLevelDifficulty(level);
    pool[difficulty].push(level);
  }

  return pool;
}

export function pickRandomPuzzle(levels: Level[], currentLevelId?: string): Level | null {
  if (levels.length === 0) {
    return null;
  }

  if (levels.length === 1) {
    return levels[0]!;
  }

  const pool = currentLevelId ? levels.filter((level) => level.id !== currentLevelId) : levels;
  const source = pool.length > 0 ? pool : levels;
  return source[Math.floor(Math.random() * source.length)] ?? null;
}

export function parsePuzzlePoolDocument(data: unknown): PuzzlePoolDocument {
  if (!isObject(data)) {
    throw new Error('Puzzle pool payload must be an object.');
  }

  if (!isObject(data.puzzles)) {
    throw new Error('Puzzle pool payload misses "puzzles" object.');
  }

  const pool = createEmptyPuzzlePool();

  for (const difficulty of DIFFICULTY_ORDER) {
    const rawLevels = data.puzzles[difficulty];

    if (!Array.isArray(rawLevels)) {
      throw new Error(`Puzzle list for difficulty "${difficulty}" must be an array.`);
    }

    for (const rawLevel of rawLevels) {
      if (!isLevelLike(rawLevel)) {
        throw new Error(`Invalid level entry in "${difficulty}" puzzle list.`);
      }

      const level: Level = {
        ...rawLevel,
        metadata: {
          ...rawLevel.metadata,
          difficulty,
        },
      };
      pool[difficulty].push(level);
    }
  }

  return {
    generatedAt: typeof data.generatedAt === 'string' ? data.generatedAt : new Date().toISOString(),
    puzzles: pool,
  };
}
