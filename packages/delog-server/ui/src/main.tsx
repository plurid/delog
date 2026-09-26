import { Component, Suspense, lazy, useEffect, useState, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { useResource } from './api';
import { ErrorMessage, Login } from './components';
import { Console, SessionContext } from './Console';
import './styles.css';
const PluridShell = lazy(() => import('./PluridShell'));
class ErrorBoundary extends Component<{ children: ReactNode }, { error: boolean }> {
  override state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  override render() {
    return this.state.error ? (
      <main className="fatal-error">
        <h1>The workspace could not open</h1>
        <p>Reload the page to try again.</p>
        <a href="/?view=list">Open list view</a>
      </main>
    ) : (
      this.props.children
    );
  }
}
function App() {
  const [revision, setRevision] = useState(0);
  const [signingIn, setSigningIn] = useState(false);
  const session = useResource<{
    owner: string | null;
    role: string | null;
    authenticated: boolean;
  }>('session', revision);
  useEffect(() => {
    const refresh = () => setRevision((value) => value + 1);
    window.addEventListener('delog-session-expired', refresh);
    return () => window.removeEventListener('delog-session-expired', refresh);
  }, []);
  if (session.loading)
    return (
      <main className="application-loading" role="status">
        Opening delog…
      </main>
    );
  if (session.error)
    return (
      <main className="fatal-error">
        <h1>Unable to reach delog</h1>
        <ErrorMessage message={session.error} />
        <button onClick={() => setRevision((value) => value + 1)}>Try again</button>
      </main>
    );
  if (!session.data?.role || session.data.role === 'ingest' || signingIn) {
    return (
      <Login
        onLogin={() => {
          setSigningIn(false);
          setRevision((value) => value + 1);
        }}
        onCancel={signingIn ? () => setSigningIn(false) : undefined}
      />
    );
  }
  return (
    <SessionContext
      value={{
        owner: session.data.owner ?? '',
        admin: session.data.authenticated,
        onLogout: () => setRevision((value) => value + 1),
        onSignIn: () => setSigningIn(true),
      }}
    >
      <Suspense
        fallback={
          <main className="application-loading" role="status">
            Opening spatial workspace…
          </main>
        }
      >
        {new URLSearchParams(location.search).get('view') === 'list' ? (
          <Console />
        ) : (
          <PluridShell />
        )}
      </Suspense>
    </SessionContext>
  );
}
createRoot(document.getElementById('delog-application')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
