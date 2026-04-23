import type { Side, Level } from '../game/core/types';

export type Language = 'en' | 'de';

type TranslationKey =
  | 'language.label'
  | 'language.en'
  | 'language.de'
  | 'blocks.label'
  | 'controls.undo'
  | 'controls.reset'
  | 'controls.help'
  | 'controls.solution'
  | 'controls.music'
  | 'controls.target'
  | 'controls.play'
  | 'controls.pause'
  | 'music.noTracks'
  | 'music.noList'
  | 'help.dialogAria'
  | 'help.title'
  | 'help.close'
  | 'help.rule.1'
  | 'help.rule.2'
  | 'help.rule.3'
  | 'help.rule.4'
  | 'help.rule.5'
  | 'help.rule.6'
  | 'help.rule.7'
  | 'help.rule.8'
  | 'help.rule.9'
  | 'help.canonicalTitle'
  | 'help.validationOk'
  | 'help.validationFailed'
  | 'help.hint'
  | 'help.showSolution'
  | 'help.hideSolution'
  | 'help.step'
  | 'help.hint.default'
  | 'help.hint.solved'
  | 'help.hint.missing'
  | 'help.hint.diverged'
  | 'help.hint.none'
  | 'help.notationLabel'
  | 'win.dialogAria'
  | 'win.levelComplete'
  | 'win.youWin'
  | 'win.subtitle'
  | 'win.nextLevel'
  | 'win.restartAtLevel1'
  | 'win.replayLevel'
  | 'difficulty.easy'
  | 'difficulty.normal'
  | 'difficulty.hard'
  | 'difficulty.blocks'
  | 'action.placeBlock'
  | 'action.fireEdge'
  | 'side.top'
  | 'side.right'
  | 'side.bottom'
  | 'side.left'
  | 'message.outsideGrid'
  | 'message.noBlocksRemaining'
  | 'message.blockOccupied'
  | 'message.cellColored'
  | 'message.edgeUsed'
  | 'message.blockPlacementNotAllowed'
  | 'message.edgeCannotFireAgain'
  | 'message.nothingToUndo'
  | 'message.levelNoCanonical'
  | 'message.solutionRejected'
  | 'message.solutionDidNotMatch';

type TranslationDictionary = Record<TranslationKey, string>;

const translations: Record<Language, TranslationDictionary> = {
  en: {
    'language.label': 'Language',
    'language.en': 'English',
    'language.de': 'Deutsch',
    'blocks.label': 'Blocks',
    'controls.undo': 'Undo',
    'controls.reset': 'Reset',
    'controls.help': 'Rules',
    'controls.solution': 'Solution',
    'controls.music': 'Music',
    'controls.target': 'Target',
    'controls.play': 'Play',
    'controls.pause': 'Pause',
    'music.noTracks': 'No tracks',
    'music.noList': 'No music list found',
    'help.dialogAria': 'Game rules',
    'help.title': 'Rules',
    'help.close': 'Close',
    'help.rule.1': 'Build the color image on the 16x16 board exactly like the target image.',
    'help.rule.2': 'Top and bottom fire Cyan, left and right fire Magenta.',
    'help.rule.3': 'If Cyan and Magenta meet on a cell, the result becomes Mix.',
    'help.rule.4': 'If a beam meets an already mixed beam, the remaining path becomes White.',
    'help.rule.5': 'Beams travel straight and stop before the first block.',
    'help.rule.6': 'Player blocks can only be placed on empty, uncolored cells.',
    'help.rule.7': 'Each edge node can only be used once.',
    'help.rule.8': 'Undo reverts the last move, Reset restarts the level.',
    'help.rule.9': 'Notation: T/B/L/R + hex slot for beams, X + hex XY for blocks (e.g. X6A).',
    'help.canonicalTitle': 'Verified Canonical Solution',
    'help.validationOk': 'Validated against the core rules with {steps} canonical steps.',
    'help.validationFailed': 'Validation failed.',
    'help.hint': 'Solution',
    'help.showSolution': 'Show Solution',
    'help.hideSolution': 'Hide Solution',
    'help.step': 'Step {step}:',
    'help.hint.default': 'Reveal the next recommended move for the verified canonical path.',
    'help.hint.solved': 'This board is already solved.',
    'help.hint.missing': 'No canonical hint data is available for this level.',
    'help.hint.diverged':
      'Your current attempt diverges from the verified solution path. Use Undo/Reset or open the full solution.',
    'help.hint.none': 'No further hint step is available.',
    'help.notationLabel': 'Canonical notation',
    'win.dialogAria': 'Level complete',
    'win.levelComplete': 'Level Complete',
    'win.youWin': 'YOU WIN',
    'win.subtitle': 'Target matched exactly. Choose your next move.',
    'win.nextLevel': 'Next Level: {title}',
    'win.restartAtLevel1': 'Restart At Level 1',
    'win.replayLevel': 'Replay Level',
    'difficulty.easy': 'Easy',
    'difficulty.normal': 'Normal',
    'difficulty.hard': 'Hard',
    'difficulty.blocks': 'blocks',
    'action.placeBlock': 'Place a player block at column {x}, row {y}.',
    'action.fireEdge': 'Fire the {side} edge at slot {index}.',
    'side.top': 'Top',
    'side.right': 'Right',
    'side.bottom': 'Bottom',
    'side.left': 'Left',
    'message.outsideGrid': 'Outside of the playable grid.',
    'message.noBlocksRemaining': 'No player blocks remaining.',
    'message.blockOccupied': 'A block already occupies this cell.',
    'message.cellColored': 'Colored cells can no longer receive blocks.',
    'message.edgeUsed': 'This edge node has already been used.',
    'message.blockPlacementNotAllowed': 'Block placement is not allowed.',
    'message.edgeCannotFireAgain': 'This edge node cannot fire again.',
    'message.nothingToUndo': 'Nothing to undo yet.',
    'message.levelNoCanonical': 'Level has no canonical solution metadata.',
    'message.solutionRejected': 'Solution action rejected: {reason}',
    'message.solutionDidNotMatch': 'Canonical solution did not reach the target image.',
  },
  de: {
    'language.label': 'Sprache',
    'language.en': 'English',
    'language.de': 'Deutsch',
    'blocks.label': 'Blöcke',
    'controls.undo': 'Rückgängig',
    'controls.reset': 'Zurücksetzen',
    'controls.help': 'Regeln',
    'controls.solution': 'Lösung',
    'controls.music': 'Musik',
    'controls.target': 'Ziel',
    'controls.play': 'Play',
    'controls.pause': 'Pause',
    'music.noTracks': 'Keine Tracks',
    'music.noList': 'Keine Musikliste gefunden',
    'help.dialogAria': 'Spielregeln',
    'help.title': 'Spielregeln',
    'help.close': 'Schließen',
    'help.rule.1': 'Baue das Farbbild auf dem 16x16-Feld exakt so nach wie im Zielbild.',
    'help.rule.2': 'Oben und unten feuern Cyan, links und rechts feuern Magenta.',
    'help.rule.3': 'Treffen Cyan und Magenta auf derselben Zelle zusammen, wird daraus Mix.',
    'help.rule.4': 'Trifft ein Strahl auf einen bereits gemischten Strahl, wird der restliche Verlauf Weiß.',
    'help.rule.5': 'Strahlen laufen gerade und stoppen vor dem ersten Block.',
    'help.rule.6': 'Spieler-Blöcke dürfen nur auf leere, noch ungefärbte Zellen gesetzt werden.',
    'help.rule.7': 'Jeder Randpunkt darf nur einmal benutzt werden.',
    'help.rule.8': 'Rückgängig setzt den letzten Zug zurück, Zurücksetzen startet das Level neu.',
    'help.rule.9': 'Notation: T/B/L/R + Hex-Slot für Strahlen, X + Hex-XY für Blöcke (z. B. X6A).',
    'help.canonicalTitle': 'Verifizierte kanonische Lösung',
    'help.validationOk': 'Mit den Core-Regeln verifiziert ({steps} kanonische Schritte).',
    'help.validationFailed': 'Validierung fehlgeschlagen.',
    'help.hint': 'Lösung',
    'help.showSolution': 'Lösung zeigen',
    'help.hideSolution': 'Lösung ausblenden',
    'help.step': 'Schritt {step}:',
    'help.hint.default': 'Zeigt den nächsten empfohlenen Zug auf dem verifizierten Lösungsweg.',
    'help.hint.solved': 'Dieses Feld ist bereits gelöst.',
    'help.hint.missing': 'Für dieses Level sind keine kanonischen Hinweisdaten vorhanden.',
    'help.hint.diverged':
      'Dein aktueller Versuch weicht vom verifizierten Lösungsweg ab. Nutze Rückgängig/Zurücksetzen oder öffne die komplette Lösung.',
    'help.hint.none': 'Kein weiterer Hinweis-Schritt verfügbar.',
    'help.notationLabel': 'Kanonische Notation',
    'win.dialogAria': 'Level abgeschlossen',
    'win.levelComplete': 'Level abgeschlossen',
    'win.youWin': 'DU HAST GEWONNEN',
    'win.subtitle': 'Zielbild exakt getroffen. Wähle deinen nächsten Schritt.',
    'win.nextLevel': 'Nächstes Level: {title}',
    'win.restartAtLevel1': 'Bei Level 1 neu starten',
    'win.replayLevel': 'Level erneut spielen',
    'difficulty.easy': 'Einfach',
    'difficulty.normal': 'Normal',
    'difficulty.hard': 'Schwer',
    'difficulty.blocks': 'Blöcke',
    'action.placeBlock': 'Setze einen Spieler-Block bei Spalte {x}, Zeile {y}.',
    'action.fireEdge': 'Feuere den {side}-Rand am Slot {index}.',
    'side.top': 'oberen',
    'side.right': 'rechten',
    'side.bottom': 'unteren',
    'side.left': 'linken',
    'message.outsideGrid': 'Außerhalb des Spielfelds.',
    'message.noBlocksRemaining': 'Keine Spieler-Blöcke mehr übrig.',
    'message.blockOccupied': 'Diese Zelle ist bereits von einem Block belegt.',
    'message.cellColored': 'Auf bereits gefärbte Zellen können keine Blöcke gesetzt werden.',
    'message.edgeUsed': 'Dieser Randpunkt wurde bereits verwendet.',
    'message.blockPlacementNotAllowed': 'Block kann hier nicht gesetzt werden.',
    'message.edgeCannotFireAgain': 'Dieser Randpunkt kann nicht erneut feuern.',
    'message.nothingToUndo': 'Noch kein Zug zum Rückgängig machen.',
    'message.levelNoCanonical': 'Level enthält keine kanonischen Lösungsdaten.',
    'message.solutionRejected': 'Lösungsaktion abgelehnt: {reason}',
    'message.solutionDidNotMatch': 'Kanonische Lösung erreicht das Zielbild nicht.',
  },
};

export function t(
  language: Language,
  key: TranslationKey,
  params?: Record<string, string | number>,
): string {
  let value = translations[language][key];

  if (!params) {
    return value;
  }

  for (const [name, parameter] of Object.entries(params)) {
    value = value.replace(`{${name}}`, String(parameter));
  }

  return value;
}

const coreMessageByEnglishValue: Record<string, TranslationKey> = {
  'Outside of the playable grid.': 'message.outsideGrid',
  'No player blocks remaining.': 'message.noBlocksRemaining',
  'A block already occupies this cell.': 'message.blockOccupied',
  'Colored cells can no longer receive blocks.': 'message.cellColored',
  'This edge node has already been used.': 'message.edgeUsed',
  'Block placement is not allowed.': 'message.blockPlacementNotAllowed',
  'This edge node cannot fire again.': 'message.edgeCannotFireAgain',
  'Nothing to undo yet.': 'message.nothingToUndo',
  'Level has no canonical solution metadata.': 'message.levelNoCanonical',
  'Canonical solution did not reach the target image.': 'message.solutionDidNotMatch',
};

export function translateCoreMessage(message: string, language: Language): string {
  const knownKey = coreMessageByEnglishValue[message];

  if (knownKey) {
    return t(language, knownKey);
  }

  const rejectedPrefix = 'Solution action rejected: ';

  if (message.startsWith(rejectedPrefix)) {
    const inner = message.slice(rejectedPrefix.length);
    return t(language, 'message.solutionRejected', {
      reason: translateCoreMessage(inner, language),
    });
  }

  return message;
}

export function getLocalizedLevelTitle(level: Pick<Level, 'title' | 'metadata'>, language: Language): string {
  const difficulty = level.metadata?.difficulty;

  if (difficulty === 'easy') {
    return t(language, 'difficulty.easy');
  }

  if (difficulty === 'normal') {
    return t(language, 'difficulty.normal');
  }

  if (difficulty === 'hard') {
    return t(language, 'difficulty.hard');
  }

  return level.title;
}

export function getSideDisplayName(side: Side, language: Language): string {
  return t(language, `side.${side}` as const);
}
