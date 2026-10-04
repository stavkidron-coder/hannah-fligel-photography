import { useState } from 'react';
import { inboxEmail, web3formsKey, formEndpoint } from '../config';

const EMPTY_VALUES = { name: '', email: '', sessionType: '', date: '', message: '' };

const baseFieldStyle = "border: none; border-bottom: 1px solid var(--line); background: transparent; padding: 8px 0; font-size: 19px; color: var(--ink); outline: none; border-radius: 6px; border-style: solid; border-width: 1px; padding-left: 8px; padding-right: 8px;";

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = true;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = true;
  if (!values.sessionType) errors.sessionType = true;
  if (!values.message.trim()) errors.message = true;
  return errors;
}

// Contact form state lives at the app level (as in the original), so typed
// values and the sent/handoff state survive navigating to another page.
export function useContactForm() {
  const [state, setState] = useState({
    sent: false, sendState: 'idle', sendError: '', copied: false, draftHref: undefined, botcheck: undefined,
    formValues: { ...EMPTY_VALUES }, formErrors: {},
  });
  const patch = (p) => setState((s) => ({ ...s, ...(typeof p === 'function' ? p(s) : p) }));

  const fieldStyle = (key) => baseFieldStyle + (state.formErrors[key] ? 'border-color: #a03a28;' : 'border-color: #8A7F70;');

  const onFieldChange = (key, val) => {
    patch((s) => {
      const formValues = { ...s.formValues, [key]: val };
      const formErrors = { ...s.formErrors };
      if (formErrors[key]) {
        const revalidated = validate(formValues);
        if (!revalidated[key]) delete formErrors[key];
      }
      return { formValues, formErrors };
    });
  };

  const onCopyEmail = () => {
    try {
      navigator.clipboard.writeText(inboxEmail);
      patch({ copied: true });
      setTimeout(() => patch({ copied: false }), 2000);
    } catch (err) {}
  };

  const onSendAnother = () => patch({ sent: false, sendState: 'idle', sendError: '', formValues: { ...EMPTY_VALUES }, formErrors: {} });

  const onSubmit = (e) => {
    e.preventDefault();
    const errors = validate(state.formValues);
    if (Object.keys(errors).length) {
      patch({ formErrors: errors });
      // original ran this in the setState callback, i.e. after the re-render
      setTimeout(() => {
        try {
          const el = document.querySelector('[data-error-summary]');
          if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 100, behavior: 'smooth' });
        } catch (err) {}
      }, 0);
      return;
    }
    const v = state.formValues;
    const web3Key = (web3formsKey || '').trim();
    const endpoint = formEndpoint;
    if (web3Key || endpoint) {
      patch({ sendState: 'sending', formErrors: {} });
      const url = web3Key ? 'https://api.web3forms.com/submit' : endpoint;
      const payload = web3Key
        ? {
            access_key: web3Key,
            subject: `New inquiry from ${v.name}${v.sessionType ? ' — ' + v.sessionType : ''}`,
            from_name: 'Hannah Fligel Photography — website inquiry',
            name: v.name,
            email: v.email,
            replyto: v.email,
            'Session type': v.sessionType || 'Not specified',
            'Ideal date/timeframe': v.date || 'Not specified',
            message: v.message,
            botcheck: state.botcheck || '',
          }
        : { name: v.name, email: v.email, sessionType: v.sessionType, date: v.date, message: v.message };
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })
        .then((r) => r.json().catch(() => ({ success: r.ok })).then((d) => {
          if (!r.ok || d.success === false) throw new Error(d.message || 'Server responded ' + r.status);
          patch({ sent: true, sendState: 'sent' });
        }))
        .catch((err) => patch({ sendState: 'error', sendError: err.message || 'Something went wrong.' }));
      return;
    }
    const subject = `New inquiry from ${v.name}${v.sessionType ? ' — ' + v.sessionType : ''}`;
    const body = `Name: ${v.name}\nEmail: ${v.email}\nSession type: ${v.sessionType || 'Not specified'}\nIdeal date/timeframe: ${v.date || 'Not specified'}\n\nMessage:\n${v.message}`;
    const href = `mailto:${inboxEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    try {
      const a = document.createElement('a');
      a.href = href; a.target = '_blank'; a.rel = 'noopener';
      document.body.appendChild(a); a.click(); a.remove();
    } catch (err) {}
    patch({ sent: true, sendState: 'handoff', formErrors: {}, draftHref: href });
  };

  const { sendState, formValues, formErrors } = state;
  return {
    formValues, formErrors,
    isHandoff: sendState === 'handoff',
    isRealSent: sendState === 'sent',
    isSending: sendState === 'sending',
    hasSendError: sendState === 'error',
    notSent: !state.sent,
    inboxMailto: 'mailto:' + inboxEmail,
    draftHref: state.draftHref || ('mailto:' + inboxEmail),
    copyLabel: state.copied ? 'Copied' : 'Copy address',
    hasErrors: Object.keys(formErrors).length > 0,
    submitLabel: sendState === 'sending' ? 'Sending…' : 'Send it over →',
    fieldStyle: {
      name: fieldStyle('name'), email: fieldStyle('email'),
      sessionType: fieldStyle('sessionType'), date: fieldStyle('date'),
    },
    invalid: {
      name: formErrors.name ? 'true' : 'false',
      email: formErrors.email ? 'true' : 'false',
      sessionType: formErrors.sessionType ? 'true' : 'false',
      message: formErrors.message ? 'true' : 'false',
    },
    fieldTextareaStyle: fieldStyle('message') + 'line-height:1.5;resize:vertical;',
    onNameChange: (e) => onFieldChange('name', e.target.value),
    onEmailChange: (e) => onFieldChange('email', e.target.value),
    onSessionTypeChange: (e) => onFieldChange('sessionType', e.target.value),
    onDateChange: (e) => onFieldChange('date', e.target.value),
    onMessageChange: (e) => onFieldChange('message', e.target.value),
    onBotcheck: (e) => patch({ botcheck: e.target.checked }),
    onCopyEmail, onSendAnother, onSubmit,
  };
}
