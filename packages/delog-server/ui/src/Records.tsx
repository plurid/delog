import { useState } from 'react';
import {
  delogLevels,
  delogLevelsText,
  type Entity,
  type LoggedRecord,
  type RecordPage,
} from '@plurid/delog-contracts';
import { api, useResource } from './api';
import { Confirm, Empty, ErrorMessage } from './components';
import { RecordDetail } from './RecordDetail';
import { SpatialRecordLink } from './SpatialLink';

export function Records({ spatial = false, admin = true }: { spatial?: boolean; admin?: boolean }) {
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState('');
  const [project, setProject] = useState('');
  const [level, setLevel] = useState('');
  const [cursor, setCursor] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [revision, setRevision] = useState(0);
  const [live, setLive] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [detail, setDetail] = useState<LoggedRecord>();
  const query = new URLSearchParams({
    count: '100',
    ...(search ? { search } : {}),
    ...(project ? { project } : {}),
    ...(level ? { level } : {}),
    ...(cursor ? { start: cursor } : {}),
  });
  const result = useResource<RecordPage>(
    'records?' + query.toString(),
    revision,
    live && !cursor ? 3000 : 0,
  );
  const projects = useResource<Entity[]>(admin ? 'entities/projects' : 'config');
  const records = result.data?.records ?? [];
  function reset() {
    setCursor('');
    setHistory([]);
    setSelected(new Set());
  }
  return (
    <section aria-labelledby="records-title">
      <header className="section-heading">
        <div>
          <h1 id="records-title">Records</h1>
          <p>Follow what’s happening across your services.</p>
        </div>
        <div className="actions">
          <button
            aria-pressed={live}
            onClick={() => {
              reset();
              setLive(!live);
            }}
          >
            {live ? 'Pause updates' : 'Live updates'}
          </button>
          <button
            onClick={() => {
              reset();
              setRevision((value) => value + 1);
            }}
          >
            Refresh
          </button>
          {admin ? (
            <a className="button" href={'/api/export?' + query.toString()}>
              Export
            </a>
          ) : null}
        </div>
      </header>
      <form
        className="filters"
        onSubmit={(event) => {
          event.preventDefault();
          reset();
          setSearch(draft);
        }}
      >
        <label className="search-field">
          Search records
          <input
            type="search"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Text or error…"
          />
        </label>
        <label>
          Project
          <select
            value={project}
            onChange={(event) => {
              reset();
              setProject(event.target.value);
            }}
          >
            <option value="">All projects</option>
            {Array.isArray(projects.data)
              ? projects.data.map((item) => (
                  <option key={item.id} value={String(item.name)}>
                    {String(item.name)}
                  </option>
                ))
              : null}
          </select>
        </label>
        <label>
          Minimum level
          <select
            value={level}
            onChange={(event) => {
              reset();
              setLevel(event.target.value);
            }}
          >
            <option value="">All levels</option>
            {Object.entries(delogLevels).map(([name, value]) => (
              <option key={name} value={value}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Search</button>
      </form>
      <div className="result-summary">
        <span aria-live="polite">
          {result.loading
            ? 'Loading records…'
            : `${records.length} ${records.length === 1 ? 'record' : 'records'}${cursor ? ' · older page' : ''}${live ? ' · updating every 3 seconds' : ''}`}
        </span>
        {selected.size ? (
          <button className="danger" onClick={() => setDeleting(true)}>
            Delete {selected.size} selected
          </button>
        ) : null}
      </div>
      <ErrorMessage message={result.error} />
      {!result.loading && !result.error && !records.length ? (
        <Empty
          title={search || project || level ? 'No matching records' : 'Your logging space is ready'}
        >
          {search || project || level
            ? 'Change the search or filters to see more records.'
            : 'Create an ingestion token in Tokens, then point your client at this server’s GraphQL endpoint.'}
        </Empty>
      ) : null}
      {records.length ? (
        <div className="table-scroll" role="region" aria-label="Record results" tabIndex={0}>
          <table className="record-table">
            <thead>
              <tr>
                {admin ? (
                  <th>
                    <input
                      type="checkbox"
                      aria-label="Select this page"
                      checked={
                        records.length > 0 && records.every((record) => selected.has(record.id))
                      }
                      onChange={(event) =>
                        setSelected(
                          event.target.checked
                            ? new Set(records.map((record) => record.id))
                            : new Set(),
                        )
                      }
                    />
                  </th>
                ) : null}
                <th>Time</th>
                <th>Level</th>
                <th>Project / space</th>
                <th>Text</th>
                <th>
                  <span className="visually-hidden">Details</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  {admin ? (
                    <td>
                      <input
                        type="checkbox"
                        aria-label={`Select ${record.text}`}
                        checked={selected.has(record.id)}
                        onChange={() =>
                          setSelected((previous) => {
                            const next = new Set(previous);
                            if (next.has(record.id)) next.delete(record.id);
                            else next.add(record.id);
                            return next;
                          })
                        }
                      />
                    </td>
                  ) : null}
                  <td className="timestamp">
                    <time dateTime={new Date(record.time / 1000).toISOString()}>
                      {new Date(record.time / 1000).toLocaleTimeString([], { hour12: false })}
                      <small>{new Date(record.time / 1000).toLocaleDateString()}</small>
                    </time>
                  </td>
                  <td>
                    <span className={`level level-${record.level}`}>
                      {delogLevelsText[record.level as keyof typeof delogLevelsText]}
                    </span>
                  </td>
                  <td className="record-project">
                    {record.project || '—'}
                    <small>{record.space || '—'}</small>
                  </td>
                  <td className="record-text">
                    {record.text}
                    {record.error ? <small className="error-preview">{record.error}</small> : null}
                  </td>
                  <td>
                    {spatial ? (
                      <SpatialRecordLink id={record.id}>Explore</SpatialRecordLink>
                    ) : (
                      <button className="text-button" onClick={() => setDetail(record)}>
                        Inspect
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      <div className="pagination">
        <button
          disabled={!history.length || result.loading}
          onClick={() => {
            setCursor(history.at(-1) ?? '');
            setHistory((previous) => previous.slice(0, -1));
            setSelected(new Set());
          }}
        >
          Newer
        </button>
        <button
          disabled={!result.data?.next || result.loading || Boolean(result.error)}
          onClick={() => {
            setHistory((previous) => [...previous, cursor]);
            setCursor(result.data!.next!);
            setSelected(new Set());
          }}
        >
          Older
        </button>
      </div>
      {deleting ? (
        <Confirm
          title={`Delete ${selected.size} records?`}
          onClose={() => setDeleting(false)}
          onConfirm={async () => {
            await api('records', {
              method: 'DELETE',
              body: JSON.stringify({ ids: [...selected] }),
            });
            reset();
            setRevision((value) => value + 1);
          }}
        >
          This permanently removes the selected records.
        </Confirm>
      ) : null}
      {detail ? (
        <div className="detail-inline">
          <button onClick={() => setDetail(undefined)}>Close details</button>
          <RecordDetail record={detail} />
        </div>
      ) : null}
    </section>
  );
}
