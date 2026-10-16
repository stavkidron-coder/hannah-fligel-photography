import { Fragment, useContext } from 'react';
import { AppContext } from '../hooks/useApp';
import { css } from '../lib/css';
import { inboxEmail } from '../config';
import Button from '../components/Button';

export default function Contact() {
  const { go, contact } = useContext(AppContext);
  const navInvest = () => go('pricing');
  const {
    isRealSent, isHandoff, notSent, hasErrors, hasSendError, isSending,
    inboxMailto, draftHref, copyLabel, submitLabel, formValues, formErrors, invalid, fieldTextareaStyle,
    onSendAnother, onCopyEmail, onSubmit, onBotcheck,
    onNameChange, onEmailChange, onSessionTypeChange, onDateChange, onMessageChange,
  } = contact;
  const fieldStyle = {
    name: css(contact.fieldStyle.name), email: css(contact.fieldStyle.email),
    sessionType: css(contact.fieldStyle.sessionType), date: css(contact.fieldStyle.date),
  };
  return (
    <main id="main" style={css(`max-width:620px;margin:0 auto;padding:clamp(64px,9vw,108px) var(--layout-page-margin) clamp(80px,11vw,120px);`)}>
      <h1 className="t-h1" style={css(`margin:0 0 clamp(40px,5vw,56px);`)}>Let's talk.</h1>

      {isRealSent && (<>
        <p className="t-quote-lg" style={css(`margin:0 0 var(--space-12);color:var(--color-text-secondary);`)}>Thank you — I've got it.</p>
        <p className="t-body" style={css(`margin:0 0 var(--space-32);color:var(--color-text-secondary);`)}>I answer every inquiry within three business days. If you haven't heard from me by then, check your spam folder or email me directly at <a href={inboxMailto} style={css(`color:var(--color-text-tertiary);text-underline-offset:3px;`)}>{inboxEmail}</a>.</p>
        <Button variant="outline" onClick={onSendAnother}>Send another inquiry</Button>
      </>)}

      {isHandoff && (<>
        <p className="t-quote-lg" style={css(`margin:0 0 var(--space-12);color:var(--color-text-secondary);`)}>Almost there — one more step.</p>
        <p className="t-body" style={css(`margin:0 0 var(--space-24);color:var(--color-text-secondary);`)}>Your details are drafted in your email app. <strong style={css(`font-weight:600;color:var(--color-text-primary);`)}>Press send there</strong> to finish — nothing reaches me until you do.</p>
        <div style={css(`padding:24px;border:1px solid var(--color-border-default);border-radius:var(--radius-md);background:var(--color-bg-surface);`)}>
          <p className="t-label" style={css(`margin:0 0 12px;color:var(--color-text-tertiary);`)}>No email app opened?</p>
          <p className="t-body" style={css(`margin:0 0 var(--space-16);color:var(--color-text-secondary);`)}><a href={draftHref} style={css(`color:var(--color-text-primary);text-decoration:underline;text-underline-offset:3px;`)}>Reopen the draft</a>, or email me directly:</p>
          <div style={css(`display:flex;flex-wrap:wrap;align-items:center;gap:12px;`)}>
            <a href={inboxMailto} style={css(`font-size:1.125rem;color:var(--color-text-primary);text-decoration:underline;text-underline-offset:3px;`)}>{inboxEmail}</a>
            <Button variant="outline" onClick={onCopyEmail}>{copyLabel}</Button>
          </div>
        </div>
        <div style={css(`margin-top:28px;`)}><Button variant="outline" onClick={onSendAnother}>Start over</Button></div>
      </>)}

      {notSent && (<>
      <p className="t-body" style={css(`margin:0 0 clamp(28px,3.5vw,38px);color:var(--color-text-secondary);`)}>Sessions start at $650. For more information, visit the <button onClick={navInvest} style={css(`background:none;border:none;padding:0;margin:0;font:inherit;color:var(--color-text-secondary);text-decoration:underline;cursor:pointer;`)} type="button">pricing page</button>.<br /><br />I typically reply to inquiries within three business days.</p>
      <form onSubmit={onSubmit} noValidate={true} style={css(`display:flex;flex-direction:column;gap:clamp(24px,3vw,32px);`)}>
        <input type="checkbox" name="botcheck" tabIndex="-1" autoComplete="off" aria-hidden="true" onChange={onBotcheck} style={css(`position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;`)} />
        {hasErrors && (<>
          <div data-error-summary="1" role="alert" style={css(`padding:16px 20px;border:1px solid var(--color-feedback-error);border-left-width:3px;border-radius:var(--radius-md);background:var(--color-feedback-error-bg);`)}>
            <p className="t-small" style={css(`color:var(--color-feedback-error-strong);`)}>A few fields still need attention — they're marked below.</p>
          </div>
        </>)}
        {hasSendError && (<>
          <div role="alert" style={css(`padding:16px 20px;border:1px solid var(--color-feedback-error);border-left-width:3px;border-radius:var(--radius-md);background:var(--color-feedback-error-bg);`)}>
            <p className="t-small" style={css(`margin:0 0 var(--space-4);font-weight:600;color:var(--color-feedback-error-strong);`)}>That didn't send.</p>
            <p className="t-small" style={css(`color:var(--color-feedback-error-strong);`)}>Please try again, or email me directly at <a href={inboxMailto} style={css(`color:var(--color-feedback-error-strong);`)}>{inboxEmail}</a>.</p>
          </div>
        </>)}
        <label style={css(`display:flex;flex-direction:column;gap:9px;`)}>
          <span className="t-label" style={css(`color:var(--color-text-secondary);`)}>Name</span>
          <input type="text" value={formValues.name} onChange={onNameChange} required={true} aria-required="true" autoComplete="name" aria-invalid={invalid.name} aria-describedby="err-name" style={fieldStyle.name} />
          {formErrors.name && (<><span id="err-name" className="t-small" style={css(`color:var(--color-feedback-error);`)}>Name is required.</span></>)}
        </label>
        <label style={css(`display:flex;flex-direction:column;gap:9px;`)}>
          <span className="t-label" style={css(`color:var(--color-text-secondary);`)}>Email</span>
          <input type="email" value={formValues.email} onChange={onEmailChange} required={true} aria-required="true" autoComplete="email" aria-invalid={invalid.email} aria-describedby="err-email" style={fieldStyle.email} />
          {formErrors.email && (<><span id="err-email" className="t-small" style={css(`color:var(--color-feedback-error);`)}>A valid email is required.</span></>)}
        </label>
        <label style={css(`display:flex;flex-direction:column;gap:9px;`)}>
          <span className="t-label" style={css(`color:var(--color-text-secondary);`)}>Session type</span>
          <select value={formValues.sessionType} onChange={onSessionTypeChange} required={true} aria-required="true" aria-invalid={invalid.sessionType} aria-describedby="err-session" style={fieldStyle.sessionType}>
            <option value="">Select one</option>
            <option>Individual Portrait</option>
            <option>Couples</option>
            <option>Family</option>
            <option>Newborn</option>
            <option>Maternity</option>
            <option>Engagement</option>
            <option>Proposal</option>
            <option>Something Else</option>
          </select>
          {formErrors.sessionType && (<><span id="err-session" className="t-small" style={css(`color:var(--color-feedback-error);`)}>Please choose a session type.</span></>)}
        </label>
        <label style={css(`display:flex;flex-direction:column;gap:9px;`)}>
          <span className="t-label" style={css(`color:var(--color-text-secondary);`)}>Ideal date or timeframe (optional)</span>
          <input type="text" value={formValues.date} onChange={onDateChange} style={fieldStyle.date} />
        </label>
        <label style={css(`display:flex;flex-direction:column;gap:9px;`)}>
          <span className="t-label" style={css(`color:var(--color-text-secondary);`)}>Tell me a little about what you're looking for</span>
          <textarea rows="8" value={formValues.message} onChange={onMessageChange} required={true} aria-required="true" aria-invalid={invalid.message} aria-describedby="err-message" style={css(fieldTextareaStyle + ' width: 100%; min-height: 300px;')}></textarea>
          {formErrors.message && (<><span id="err-message" className="t-small" style={css(`color:var(--color-feedback-error);`)}>Let me know a bit about what you're looking for.</span></>)}
        </label>
        <div style={css(`margin-top:8px;display:flex;flex-wrap:wrap;align-items:center;gap:20px;`)}>
          <Button variant="primary" type="submit" disabled={isSending}>{submitLabel}</Button>
        </div>
      </form>

      <div style={css(`margin:clamp(48px,6vw,64px) 0 0;text-align:center;`)}>
        <p className="t-quote-md">“OMG, I am obsessed with every single photo. These are so stunning and dreamy.”</p>
        <p className="t-label" style={css(`margin:20px 0 0;color:var(--color-text-tertiary);`)}>— MANA &amp; CHRIS, MATERNITY SESSION</p>
      </div>
      </>)}

      <div style={css(`margin-top:clamp(56px,7vw,80px);padding-top:clamp(32px,4vw,40px);border-top:1px solid var(--color-border-default);`)}>
        <p className="t-body" style={css(`color:var(--color-text-secondary);`)}>Based in and shooting throughout San Diego County.</p>
        <p className="t-body" style={css(`margin:var(--space-4) 0 0;color:var(--color-text-secondary);`)}>Available for travel inquiries outside San Diego.</p>
        <p className="t-label" style={css(`margin:20px 0 0;color:var(--color-text-tertiary);`)}>Email&nbsp;&nbsp;<a href={inboxMailto} target="_blank" rel="noopener" style={css(`color:var(--color-text-tertiary);text-decoration:underline;text-underline-offset:3px;text-transform:none;letter-spacing:0;`)}>{inboxEmail}</a></p>
        <p className="t-label" style={css(`margin:8px 0 0;color:var(--color-text-tertiary);`)}>Instagram&nbsp;&nbsp;<a href="https://www.instagram.com/hannahfphoto/" target="_blank" rel="noopener noreferrer" style={css(`color:var(--color-text-tertiary);text-decoration:underline;text-underline-offset:3px;`)}>@hannahfphoto</a></p>
      </div>
    </main>
  );
}
