import { useState } from 'react';
import { useGameStore } from '../game/state/store';
import { t } from '../i18n/text';

export function HelpDialog() {
  const [open, setOpen] = useState(false);
  const language = useGameStore((state) => state.language);

  return (
    <>
      <button
        type="button"
        className={`help-button${open ? ' help-button--active' : ''}`}
        aria-pressed={open}
        onClick={() => setOpen(true)}
      >
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
          </section>
        </div>
      ) : null}
    </>
  );
}
