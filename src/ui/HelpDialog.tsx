import { useEffect, useMemo, useState } from 'react';
import { describeRuntimeAction, getSolutionProgress, validateLevelAgainstSolution } from '../game/levels/solution';
import { useGameStore } from '../game/state/store';
import { t, translateCoreMessage } from '../i18n/text';

export function HelpDialog() {
  const [open, setOpen] = useState(false);
  const [hintRequested, setHintRequested] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const language = useGameStore((state) => state.language);
  const level = useGameStore((state) => state.level);
  const runtime = useGameStore((state) => state.runtime);
  const validation = useMemo(() => validateLevelAgainstSolution(level), [level]);
  const progress = useMemo(() => getSolutionProgress(level, runtime), [level, runtime]);

  useEffect(() => {
    setHintRequested(false);
    setShowSolution(false);
  }, [level.id, open]);

  let hintText = t(language, 'help.hint.default');

  if (hintRequested) {
    if (progress.status === 'solved') {
      hintText = t(language, 'help.hint.solved');
    } else if (progress.status === 'missing') {
      hintText = t(language, 'help.hint.missing');
    } else if (progress.status === 'diverged') {
      hintText = t(language, 'help.hint.diverged');
    } else if (progress.nextAction) {
      hintText = describeRuntimeAction(progress.nextAction, language);
    } else {
      hintText = t(language, 'help.hint.none');
    }
  }

  return (
    <>
      <button type="button" className="help-button" onClick={() => setOpen(true)}>
        {t(language, 'controls.help')}
      </button>

      {open ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setOpen(false)}>
          <section
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-label={t(language, 'help.dialogAria')}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-card__header">
              <div>
                <p className="panel-label">{t(language, 'controls.help')}</p>
                <h2>{t(language, 'help.title')}</h2>
              </div>
              <button type="button" className="help-button help-button--ghost" onClick={() => setOpen(false)}>
                {t(language, 'help.close')}
              </button>
            </div>

            <div className="modal-card__body">
              <p>{t(language, 'help.rule.1')}</p>
              <p>{t(language, 'help.rule.2')}</p>
              <p>{t(language, 'help.rule.3')}</p>
              <p>{t(language, 'help.rule.4')}</p>
              <p>{t(language, 'help.rule.5')}</p>
              <p>{t(language, 'help.rule.6')}</p>
              <p>{t(language, 'help.rule.7')}</p>
              <p>{t(language, 'help.rule.8')}</p>
              <p>{t(language, 'help.rule.9')}</p>
            </div>

            <div className="panel-section">
              <p className="panel-label">{t(language, 'help.canonicalTitle')}</p>
              <p className="target-panel__summary">
                {validation.ok
                  ? t(language, 'help.validationOk', { steps: validation.totalSteps })
                  : validation.reason
                    ? translateCoreMessage(validation.reason, language)
                    : t(language, 'help.validationFailed')}
              </p>

              <div className="control-row">
                <button type="button" className="control-button" onClick={() => setHintRequested(true)}>
                  {t(language, 'help.hint')}
                </button>
                <button
                  type="button"
                  className="control-button"
                  onClick={() => setShowSolution((value) => !value)}
                >
                  {showSolution ? t(language, 'help.hideSolution') : t(language, 'help.showSolution')}
                </button>
              </div>

              <div className="message-box">
                {hintRequested ? (
                  <>
                    <strong>
                      {t(language, 'help.step', {
                        step: Math.min(progress.completedSteps + 1, Math.max(progress.totalSteps, 1)),
                      })}
                    </strong>{' '}
                    {hintText}
                  </>
                ) : (
                  hintText
                )}
              </div>

              {level.metadata?.solutionNotation?.length ? (
                <p className="target-panel__summary">
                  {t(language, 'help.notationLabel')}: {level.metadata.solutionNotation.join('  ')}
                </p>
              ) : null}

              {showSolution ? (
                <ol className="solution-list">
                  {progress.solution.map((action, index) => {
                    const isCompleted = index < progress.matchedPrefixLength;
                    const isCurrent =
                      progress.status === 'available' && index === progress.matchedPrefixLength;
                    const isDivergedStep =
                      progress.status === 'diverged' &&
                      index === progress.matchedPrefixLength &&
                      progress.matchedPrefixLength < progress.totalSteps;

                    return (
                      <li
                        key={`${action.type}-${index}`}
                        className={`solution-item${isCompleted ? ' solution-item--completed' : ''}${isCurrent ? ' solution-item--current' : ''}${isDivergedStep ? ' solution-item--diverged' : ''}`}
                      >
                        {describeRuntimeAction(action, language)}
                      </li>
                    );
                  })}
                </ol>
              ) : null}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
