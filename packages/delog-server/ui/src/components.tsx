import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { api } from './api';
export function ErrorMessage({ message }: { message?: string }) {
  return message ? (
    <p className="error-message" role="alert">
      {message}
    </p>
  ) : null;
}
export function Empty({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="empty">
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}
export function Confirm({
  title,
  children,
  onConfirm,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      onCancel={(event) => {
        if (busy) event.preventDefault();
        else onClose();
      }}
      aria-labelledby="confirm-title"
    >
      <h2 id="confirm-title">{title}</h2>
      <p>{children}</p>
      <ErrorMessage message={error} />
      <div className="actions">
        <button autoFocus disabled={busy} onClick={onClose}>
          Cancel
        </button>
        <button
          className="danger"
          disabled={busy}
          onClick={() => {
            setBusy(true);
            void onConfirm()
              .then(onClose)
              .catch((error) => setError(error.message))
              .finally(() => setBusy(false));
          }}
        >
          {busy ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </dialog>
  );
}
export function Login({ onLogin, onCancel }: { onLogin: () => void; onCancel?: () => void }) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setBusy(true);
    const data = new FormData(event.currentTarget);
    try {
      await api('session', {
        method: 'POST',
        body: JSON.stringify({ identonym: data.get('identonym'), key: data.get('key') }),
      });
      onLogin();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Sign-in failed.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="login-page">
      <form
        className="login-form"
        onSubmit={(event) => {
          void submit(event);
        }}
      >
        <img src="/delog-logo.png" alt="" width="52" height="52" />
        <h1>delog</h1>
        <p>Sign in to your cluster’s logging space.</p>
        <label>
          Identonym
          <input name="identonym" autoComplete="username" defaultValue="owner" required autoFocus />
        </label>
        <label>
          Key
          <input name="key" type="password" autoComplete="current-password" required />
        </label>
        <ErrorMessage message={error} />
        <button className="primary" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
        {onCancel ? (
          <button type="button" onClick={onCancel} disabled={busy}>
            Back to records
          </button>
        ) : null}
      </form>
    </main>
  );
}
