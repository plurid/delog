import { createContext, useContext, useState } from 'react';
import type { EntityKind } from '@plurid/delog-contracts';
import { api } from './api';
import { Records } from './Records';
import { Entities } from './Entities';
import { Analytics, Tests } from './Analytics';
export const SessionContext = createContext({
  owner: '',
  admin: false,
  onLogout: () => {},
  onSignIn: () => {},
});
type Page = 'records' | 'analytics' | 'tests' | EntityKind;
const pages: { page: Page; name: string; group: string }[] = [
  { page: 'records', name: 'Records', group: 'Observe' },
  { page: 'analytics', name: 'Analytics', group: 'Observe' },
  { page: 'tests', name: 'Tests', group: 'Observe' },
  { page: 'projects', name: 'Projects', group: 'Organize' },
  { page: 'spaces', name: 'Spaces', group: 'Organize' },
  { page: 'tokens', name: 'Tokens', group: 'Connect' },
  { page: 'formats', name: 'Formats', group: 'Connect' },
  { page: 'testers', name: 'Testers', group: 'Automate' },
  { page: 'notifiers', name: 'Notifiers', group: 'Automate' },
  { page: 'providers', name: 'Providers', group: 'Source' },
  { page: 'repositories', name: 'Repositories', group: 'Source' },
];
export function Console({ spatial = false }: { spatial?: boolean }) {
  const session = useContext(SessionContext);
  const [page, setPage] = useState<Page>('records');
  const [error, setError] = useState('');
  const available = pages.filter(
    (item) => session.admin || ['records', 'analytics', 'tests'].includes(item.page),
  );
  return (
    <div className="console">
      <a className="skip-link" href="#workspace">
        Skip to workspace
      </a>
      <aside className="sidebar">
        <a href="/" className="brand">
          <img src="/delog-logo.png" alt="" width="32" height="32" />
          <strong>delog</strong>
        </a>
        <nav aria-label="Workspace">
          {available.map((item, index) => (
            <div key={item.page}>
              {index === 0 || available[index - 1]?.group !== item.group ? (
                <p className="nav-group">{item.group}</p>
              ) : null}
              <button
                aria-current={page === item.page ? 'page' : undefined}
                onClick={() => setPage(item.page)}
              >
                {item.name}
              </button>
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <span>{session.owner}</span>
          <small>{session.admin ? 'Administrator' : 'Public access'}</small>
          <a href={spatial ? '/?view=list' : '/'}>
            {spatial ? 'Switch to list view' : 'Switch to spatial view'}
          </a>
          {session.admin ? (
            <button
              onClick={() => {
                void api('session', { method: 'DELETE' })
                  .then(session.onLogout)
                  .catch((error) => setError(error.message));
              }}
            >
              Sign out
            </button>
          ) : (
            <button onClick={session.onSignIn}>Administrator sign in</button>
          )}
          {error ? <p role="alert">{error}</p> : null}
        </div>
      </aside>
      <main id="workspace" className="workspace" tabIndex={-1}>
        {page === 'records' ? (
          <Records spatial={spatial} admin={session.admin} />
        ) : page === 'analytics' ? (
          <Analytics />
        ) : page === 'tests' ? (
          <Tests admin={session.admin} />
        ) : (
          <Entities key={page} kind={page} />
        )}
        <footer>delog · your cluster, one logging space</footer>
      </main>
    </div>
  );
}
