import { useState } from 'react';
import { delogLevelsText, type LoggedRecord, type RecordPage } from '@plurid/delog-contracts';
import { api, useResource } from './api';
import { ErrorMessage } from './components';
import { SpatialRecordLink, SpatialSourceLink } from './SpatialLink';

export function SourceDetail({ record }: { record: LoggedRecord }) {
  const [result, setResult] = useState<{ lines: string[]; startLine: number }>();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const call = record.context?.call;
  if (!call) return <p>This record has no source context.</p>;
  return (
    <section>
      <h2>Source</h2>
      <p className="mono">
        {call.repository.name} · {call.caller.file}:{call.caller.line}
      </p>
      <ErrorMessage message={error} />
      {result ? (
        <pre className="source-code">
          {result.lines.map((line, index) => (
            <span
              className={index + result.startLine === call.caller.line ? 'source-highlight' : ''}
              key={index}
            >
              <span className="line-number">{index + result.startLine}</span>
              {line}
              {'\n'}
            </span>
          ))}
        </pre>
      ) : (
        <button
          disabled={busy}
          onClick={() => {
            setBusy(true);
            setError('');
            void api<{ lines: string[]; startLine: number }>('source', {
              method: 'POST',
              body: JSON.stringify({ repository: call.repository, context: call.caller }),
            })
              .then(setResult)
              .catch((error) => setError(error.message))
              .finally(() => setBusy(false));
          }}
        >
          {busy ? 'Loading source…' : 'Load source from linked repository'}
        </button>
      )}
    </section>
  );
}
function Correlated({ id, spatial }: { id: string; spatial: boolean }) {
  const result = useResource<RecordPage>(
    'records?' + new URLSearchParams({ sharedID: id, count: '100' }),
  );
  return (
    <section>
      <h2>Correlated records</h2>
      <ErrorMessage message={result.error} />
      {result.loading ? (
        <p>Loading related records…</p>
      ) : (
        <ul className="related-list">
          {result.data?.records.map((record) => (
            <li key={record.id}>
              <span>{record.context?.sharedOrder ?? '—'}</span>
              {spatial ? (
                <SpatialRecordLink id={record.id}>{record.text}</SpatialRecordLink>
              ) : (
                <span>{record.text}</span>
              )}
              <small>{record.project}</small>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
export function RecordDetail({
  record,
  spatial = false,
}: {
  record: LoggedRecord;
  spatial?: boolean;
}) {
  const [copied, setCopied] = useState('');
  return (
    <article className="record-detail">
      <header className="section-heading">
        <div>
          <span className={`level level-${record.level}`}>
            {delogLevelsText[record.level as keyof typeof delogLevelsText]}
          </span>
          <h1>{record.text || 'Empty record'}</h1>
        </div>
        <button
          onClick={() => {
            void navigator.clipboard
              .writeText(JSON.stringify(record, null, 2))
              .then(() => setCopied('Copied'))
              .catch(() => setCopied('Copy failed'));
          }}
        >
          Copy JSON
        </button>
      </header>
      <p role="status">{copied}</p>
      <dl className="record-facts">
        <div>
          <dt>Time</dt>
          <dd>{new Date(record.time / 1000).toISOString()}</dd>
        </div>
        <div>
          <dt>Project / space</dt>
          <dd>
            {record.project || '—'} / {record.space || '—'}
          </dd>
        </div>
        <div>
          <dt>Method</dt>
          <dd>{record.method || '—'}</dd>
        </div>
        <div>
          <dt>Record ID</dt>
          <dd>{record.id}</dd>
        </div>
      </dl>
      <section>
        <h2>Formatted log</h2>
        <pre>{record.log}</pre>
      </section>
      {record.error ? (
        <section>
          <h2>Error</h2>
          <pre>{record.error}</pre>
        </section>
      ) : null}
      {record.extradata ? (
        <section>
          <h2>Extra data</h2>
          <pre>{record.extradata}</pre>
        </section>
      ) : null}
      {record.context?.call ? (
        spatial ? (
          <SpatialSourceLink id={record.id}>
            Explore source: {record.context.call.caller.file}:{record.context.call.caller.line}
          </SpatialSourceLink>
        ) : (
          <SourceDetail record={record} />
        )
      ) : null}
      {record.context?.sharedID ? (
        <Correlated id={record.context.sharedID} spatial={spatial} />
      ) : null}
    </article>
  );
}
