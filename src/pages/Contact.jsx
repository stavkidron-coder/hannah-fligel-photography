import { Fragment, useContext } from 'react';
import { AppContext } from '../hooks/useApp';
import { css } from '../lib/css';
import { inboxEmail } from '../config';

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
    <main id="main" style={css(`max-width:620px;margin:0 auto;padding:clamp(64px,9vw,108px) 32px clamp(80px,11vw,120px);`)}>
      <h1 style={css(`margin:0 0 clamp(40px,5vw,56px);font-family:'Cormorant Garamond',serif;font-weight:400;font-size:clamp(40px,5.5vw,64px);line-height:1;color:var(--ink);`)}>Let's talk.</h1>

      {isRealSent && (<>
        <p style={css(`margin:0 0 14px;font-family:'Cormorant Garamond',serif;font-weight:300;font-style:italic;font-size:clamp(24px,3.2vw,34px);line-height:1.35;color:var(--soft);`)}>Thank you — I've got it.</p>
        <p style={css(`margin:0 0 32px;font-size:18px;line-height:1.6;color:var(--soft);`)}>I answer every inquiry within three business days. If you haven't heard from me by then, check your spam folder or email me directly at <a href={inboxMailto} style={css(`color:#6F6252;text-underline-offset:3px;`)}>{inboxEmail}</a>.</p>
        <button onClick={onSendAnother} style={css(`background:none;border:1px solid var(--ink);border-radius:9px;cursor:pointer;padding:15px 28px;font-family:'Mulish',sans-serif;font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--ink);`)}>Send another inquiry</button>
      </>)}

      {isHandoff && (<>
        <p style={css(`margin:0 0 14px;font-family:'Cormorant Garamond',serif;font-weight:300;font-style:italic;font-size:clamp(24px,3.2vw,34px);line-height:1.35;color:var(--soft);`)}>Almost there — one more step.</p>
        <p style={css(`margin:0 0 24px;font-size:18px;line-height:1.6;color:var(--soft);`)}>Your details are drafted in your email app. <strong style={css(`font-weight:600;color:var(--ink);`)}>Press send there</strong> to finish — nothing reaches me until you do.</p>
        <div style={css(`padding:24px;border:1px solid var(--line);border-radius:9px;background:var(--paper);`)}>
          <p style={css(`margin:0 0 12px;font-family:'Mulish',sans-serif;font-size:11px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);`)}>No email app opened?</p>
          <p style={css(`margin:0 0 16px;font-size:17px;line-height:1.6;color:var(--soft);`)}><a href={draftHref} style={css(`color:var(--ink);text-decoration:underline;text-underline-offset:3px;`)}>Reopen the draft</a>, or email me directly:</p>
          <div style={css(`display:flex;flex-wrap:wrap;align-items:center;gap:12px;`)}>
            <a href={inboxMailto} style={css(`font-size:19px;color:var(--ink);text-decoration:underline;text-underline-offset:3px;`)}>{inboxEmail}</a>
            <button onClick={onCopyEmail} type="button" style={css(`background:none;border:1px solid var(--muted);border-radius:9px;cursor:pointer;padding:9px 16px;font-family:'Mulish',sans-serif;font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--ink);`)}>{copyLabel}</button>
          </div>
        </div>
        <div style={css(`margin-top:28px;`)}><button onClick={onSendAnother} style={css(`background:none;border:1px solid var(--ink);border-radius:9px;cursor:pointer;padding:15px 28px;font-family:'Mulish',sans-serif;font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--ink);`)}>Start over</button></div>
      </>)}

      {notSent && (<>
      <p style={css(`margin:0 0 clamp(28px,3.5vw,38px);font-size:18px;line-height:1.6;color:var(--soft);`)}>Sessions start at $650. For more information, visit the <button onClick={navInvest} style={css(`background:none;border:none;padding:0;margin:0;font:inherit;color:var(--soft);text-decoration:underline;cursor:pointer;`)} type="button">pricing page</button>.<br /><br />I typically reply to inquiries within three business days.</p>
      <form onSubmit={onSubmit} noValidate={true} style={css(`display:flex;flex-direction:column;gap:clamp(24px,3vw,32px);`)}>
        <input type="checkbox" name="botcheck" tabIndex="-1" autoComplete="off" aria-hidden="true" onChange={onBotcheck} style={css(`position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;`)} />
        {hasErrors && (<>
          <div data-error-summary="1" role="alert" style={css(`padding:16px 20px;border:1px solid #9E3322;border-left-width:3px;border-radius:9px;background:#FBF0ED;`)}>
            <p style={css(`margin:0;font-family:'Mulish',sans-serif;font-size:14px;line-height:1.5;color:#7E2A1B;`)}>A few fields still need attention — they're marked below.</p>
          </div>
        </>)}
        {hasSendError && (<>
          <div role="alert" style={css(`padding:16px 20px;border:1px solid #9E3322;border-left-width:3px;border-radius:9px;background:#FBF0ED;`)}>
            <p style={css(`margin:0 0 6px;font-family:'Mulish',sans-serif;font-size:14px;font-weight:600;color:#7E2A1B;`)}>That didn't send.</p>
            <p style={css(`margin:0;font-family:'Mulish',sans-serif;font-size:14px;line-height:1.5;color:#7E2A1B;`)}>Please try again, or email me directly at <a href={inboxMailto} style={css(`color:#7E2A1B;`)}>{inboxEmail}</a>.</p>
          </div>
        </>)}
        <label style={css(`display:flex;flex-direction:column;gap:9px;`)}>
          <span style={css(`font-family: 'Mulish',sans-serif; font-size: 11px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase; color: #5f574c`)}>Name</span>
          <input type="text" value={formValues.name} onChange={onNameChange} required={true} aria-required="true" autoComplete="name" aria-invalid={invalid.name} aria-describedby="err-name" style={fieldStyle.name} />
          {formErrors.name && (<><span id="err-name" style={css(`font-family:'Mulish',sans-serif;font-size:13px;color:#9E3322;`)}>Name is required.</span></>)}
        </label>
        <label style={css(`display:flex;flex-direction:column;gap:9px;`)}>
          <span style={css(`font-family: 'Mulish',sans-serif; font-size: 11px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase; color: #5F574C`)}>Email</span>
          <input type="email" value={formValues.email} onChange={onEmailChange} required={true} aria-required="true" autoComplete="email" aria-invalid={invalid.email} aria-describedby="err-email" style={fieldStyle.email} />
          {formErrors.email && (<><span id="err-email" style={css(`font-family:'Mulish',sans-serif;font-size:13px;color:#9E3322;`)}>A valid email is required.</span></>)}
        </label>
        <label style={css(`display:flex;flex-direction:column;gap:9px;`)}>
          <span style={css(`font-family: 'Mulish',sans-serif; font-size: 11px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase; color: #5F574C`)}>Session type</span>
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
          {formErrors.sessionType && (<><span id="err-session" style={css(`font-family:'Mulish',sans-serif;font-size:13px;color:#9E3322;`)}>Please choose a session type.</span></>)}
        </label>
        <label style={css(`display:flex;flex-direction:column;gap:9px;`)}>
          <span style={css(`font-family: 'Mulish',sans-serif; font-size: 11px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase; color: #5F574C`)}>Ideal date or timeframe (optional)</span>
          <input type="text" value={formValues.date} onChange={onDateChange} style={fieldStyle.date} />
        </label>
        <label style={css(`display:flex;flex-direction:column;gap:9px;`)}>
          <span style={css(`font-family: 'Mulish',sans-serif; font-size: 11px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase; color: #5F574C`)}>Tell me a little about what you're looking for</span>
          <textarea rows="8" value={formValues.message} onChange={onMessageChange} required={true} aria-required="true" aria-invalid={invalid.message} aria-describedby="err-message" style={css(fieldTextareaStyle + ' width: 100%; min-height: 300px;')}></textarea>
          {formErrors.message && (<><span id="err-message" style={css(`font-family:'Mulish',sans-serif;font-size:13px;color:#9E3322;`)}>Let me know a bit about what you're looking for.</span></>)}
        </label>
        <div style={css(`margin-top:8px;display:flex;flex-wrap:wrap;align-items:center;gap:20px;`)}>
          <button type="submit" disabled={isSending} style={css(`background: var(--ink); color: #FAF6EF; border: none; border-radius: 9px; cursor: pointer; padding: 17px 34px; font-family: 'Mulish',sans-serif; font-size: 12px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase`)}>{submitLabel}</button>
        </div>
      </form>

      <div style={css(`margin:clamp(48px,6vw,64px) 0 0;text-align:center;`)}>
        <p style={css(`margin:0;font-family:'Cormorant Garamond',serif;font-weight:300;font-style:italic;font-size:clamp(21px,2.4vw,26px);line-height:1.35;color:var(--ink);`)}>“OMG, I am obsessed with every single photo. These are so stunning and dreamy.”</p>
        <p style={css(`margin:20px 0 0;font-family:'Mulish',sans-serif;font-size:12px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);`)}>— MANA &amp; CHRIS, MATERNITY SESSION</p>
      </div>
      </>)}

      <div style={css(`margin-top:clamp(56px,7vw,80px);padding-top:clamp(32px,4vw,40px);border-top:1px solid var(--line);`)}>
        <p style={css(`margin:0;font-size:18px;line-height:1.6;color:var(--soft);`)}>Based in and shooting throughout San Diego County.</p>
        <p style={css(`margin:4px 0 0;font-size:18px;line-height:1.6;color:var(--soft);`)}>Available for travel inquiries outside San Diego.</p>
        <p style={css(`margin:20px 0 0;font-family:'Mulish',sans-serif;font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);`)}>Email&nbsp;&nbsp;<a href={inboxMailto} target="_blank" rel="noopener" style={css(`color:#6F6252;text-decoration:underline;text-underline-offset:3px;text-transform:none;letter-spacing:.02em;font-size:14px;`)}>{inboxEmail}</a></p>
        <p style={css(`margin:8px 0 0;font-family:'Mulish',sans-serif;font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);`)}>Instagram&nbsp;&nbsp;<a href="https://www.instagram.com/hannahfphoto/" target="_blank" rel="noopener noreferrer" style={css(`color:#6F6252;text-decoration:underline;text-underline-offset:3px;`)}>@hannahfphoto</a></p>
      </div>
    </main>
  );
}
