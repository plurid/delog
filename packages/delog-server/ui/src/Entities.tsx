import { useState, type FormEvent } from 'react';
import type { Entity, EntityKind } from '@plurid/delog-contracts';
import { api, useResource } from './api';
import { Confirm, Empty, ErrorMessage } from './components';

const descriptions: Record<EntityKind, string> = {
  projects: 'Organize the services that belong to an application.',
  spaces: 'Group a project’s logs by subsystem or environment.',
  tokens: 'Create revocable credentials that can submit logs.',
  formats:
    'Format logs with %TIME, %LEVEL, %TEXT, %PROJECT, %SPACE, %METHOD, %ERROR, and %EXTRADATA.',
  testers: 'Check an ordered sequence of logs from a correlated run.',
  notifiers: 'Send record, test, and project events to an HTTP endpoint or email.',
  providers: 'Connect a source provider to explore the code behind a record.',
  repositories: 'Link repositories that Delog may read for source context.',
};
const singular: Record<EntityKind, string> = {
  projects: 'project',
  spaces: 'space',
  tokens: 'token',
  formats: 'format',
  testers: 'tester',
  notifiers: 'notifier',
  providers: 'provider',
  repositories: 'repository',
};
const testExample = JSON.stringify(
  {
    phases: [
      { text: 'started', level: 'info' },
      { text: 'completed', level: 'info' },
    ],
    startDelay: 5000,
    retryDelay: 1000,
    timeout: 60000,
  },
  null,
  2,
);
const smtpExample = JSON.stringify(
  {
    notifyTo: ['you@example.com'],
    authentication: {
      host: 'smtp.example.com',
      port: 465,
      secure: true,
      username: '',
      password: '',
      sender: 'delog@example.com',
    },
  },
  null,
  2,
);

function EntityForm({
  kind,
  initial,
  onSaved,
  onCancel,
}: {
  kind: EntityKind;
  initial?: Entity;
  onSaved: (entity: Entity) => void;
  onCancel: () => void;
}) {
  const [type, setType] = useState('api');
  const [project, setProject] = useState(String(initial?.project ?? ''));
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const options = useResource<Entity[]>(
    kind === 'repositories'
      ? 'entities/providers'
      : kind === 'spaces' || kind === 'testers'
        ? 'entities/projects'
        : 'config',
  );
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setBusy(true);
    const form = new FormData(event.currentTarget);
    const value: Record<string, unknown> = Object.fromEntries(form);
    if (initial) value.id = initial.id;
    if (kind === 'notifiers') {
      value.notifyOn = form.getAll('notifyOn');
      value.data =
        type === 'api'
          ? JSON.stringify({ endpoint: form.get('endpoint'), secret: form.get('secret') })
          : form.get('data');
      delete value.endpoint;
      delete value.secret;
    }
    try {
      onSaved(
        await api<Entity>('entities/' + kind, { method: 'POST', body: JSON.stringify(value) }),
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Could not save.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <form
      className="entity-form"
      onSubmit={(event) => {
        void submit(event);
      }}
    >
      <h2>
        {initial ? 'Edit' : 'Create'} {singular[kind]}
      </h2>
      {kind === 'formats' ? (
        <>
          <label>
            Identifier
            <input name="identifier" required maxLength={128} autoFocus placeholder="compact" />
          </label>
          <label>
            Template
            <textarea
              name="transform"
              required
              defaultValue="%TIME [%LEVEL] %PROJECT/%SPACE · %TEXT"
              rows={3}
            />
          </label>
        </>
      ) : kind === 'repositories' ? (
        <>
          <label>
            Provider
            <select name="providerID" required>
              <option value="">Choose provider</option>
              {Array.isArray(options.data)
                ? options.data.map((item) => (
                    <option key={item.id} value={item.id}>
                      {String(item.name)}
                    </option>
                  ))
                : null}
            </select>
          </label>
          <label>
            Repository
            <input name="nameWithOwner" placeholder="owner/repository" required autoFocus />
          </label>
        </>
      ) : (
        <label>
          Name
          <input
            name="name"
            required
            maxLength={256}
            autoFocus
            defaultValue={String(initial?.name ?? '')}
          />
        </label>
      )}
      {kind === 'spaces' || kind === 'testers' ? (
        <label>
          Project
          <select
            name="project"
            required
            value={project}
            onChange={(event) => setProject(event.target.value)}
          >
            <option value="">Choose project</option>
            {Array.isArray(options.data)
              ? options.data.map((item) => (
                  <option key={item.id} value={String(item.name)}>
                    {String(item.name)}
                  </option>
                ))
              : null}
          </select>
        </label>
      ) : null}
      {kind === 'providers' ? (
        <>
          <label>
            Provider type
            <select name="type">
              <option value="github">GitHub</option>
              <option value="bitbucket">Bitbucket</option>
            </select>
          </label>
          <label>
            Access token
            <input name="token" type="password" autoComplete="off" required />
          </label>
        </>
      ) : null}
      {kind === 'testers' ? (
        <>
          <div className="form-pair">
            <label>
              Suite
              <input name="suite" required defaultValue={String(initial?.suite ?? '')} />
            </label>
            <label>
              Scenario
              <input name="scenario" required defaultValue={String(initial?.scenario ?? '')} />
            </label>
          </div>
          <label>
            Expected phases and timing (JSON)
            <textarea
              className="mono"
              name="configuration"
              rows={12}
              required
              defaultValue={
                initial?.configuration
                  ? JSON.stringify(JSON.parse(String(initial.configuration)), null, 2)
                  : testExample
              }
            />
          </label>
          <p className="muted">
            Send TESTING records with the same project, suite, scenario and sharedID. sharedOrder
            starts at 0.
          </p>
        </>
      ) : null}
      {kind === 'notifiers' ? (
        <>
          <label>
            Delivery
            <select name="type" value={type} onChange={(event) => setType(event.target.value)}>
              <option value="api">HTTP endpoint</option>
              <option value="email">Email</option>
            </select>
          </label>
          <fieldset>
            <legend>Notify on</legend>
            {[
              'RECORDED_FATAL',
              'RECORDED_ERROR',
              'RECORDED_WARN',
              'TEST_FAIL',
              'TEST_SUCCESS',
              'ENTITY_REGISTRATION',
              'ENTITY_DEREGISTRATION',
            ].map((event) => (
              <label className="checkbox-label" key={event}>
                <input
                  type="checkbox"
                  name="notifyOn"
                  value={event}
                  defaultChecked={event === 'RECORDED_ERROR'}
                />
                {event.toLowerCase().replaceAll('_', ' ')}
              </label>
            ))}
          </fieldset>
          {type === 'api' ? (
            <>
              <label>
                Endpoint
                <input
                  name="endpoint"
                  type="url"
                  placeholder="http://notification-receiver:3000/"
                  required
                />
              </label>
              <label>
                Shared secret
                <input name="secret" type="password" autoComplete="off" />
              </label>
            </>
          ) : (
            <label>
              SMTP and recipients (JSON)
              <textarea
                name="data"
                className="mono"
                rows={14}
                defaultValue={smtpExample}
                required
              />
            </label>
          )}
        </>
      ) : null}
      <ErrorMessage message={options.error} />
      <ErrorMessage message={error} />
      <div className="actions">
        <button type="button" disabled={busy} onClick={onCancel}>
          Cancel
        </button>
        <button className="primary" disabled={busy}>
          {busy ? 'Saving…' : initial ? 'Save changes' : `Create ${singular[kind]}`}
        </button>
      </div>
    </form>
  );
}
export function Entities({ kind }: { kind: EntityKind }) {
  const [revision, setRevision] = useState(0);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Entity>();
  const [removing, setRemoving] = useState<Entity>();
  const [secret, setSecret] = useState('');
  const [copy, setCopy] = useState('');
  const result = useResource<Entity[]>('entities/' + kind, revision);
  return (
    <section>
      <header className="section-heading">
        <div>
          <h1>{kind[0]!.toUpperCase() + kind.slice(1)}</h1>
          <p>{descriptions[kind]}</p>
        </div>
        <button
          className="primary"
          onClick={() => setCreating(true)}
          disabled={creating || Boolean(editing)}
        >
          Create {singular[kind]}
        </button>
      </header>
      <ErrorMessage message={result.error} />
      {secret ? (
        <div className="token-reveal">
          <h2>Save your ingestion token</h2>
          <p>This value is shown once. Use it as DELOG_TOKEN in your clients.</p>
          <code>{secret}</code>
          <div className="actions">
            <button
              onClick={() => {
                void navigator.clipboard
                  .writeText(secret)
                  .then(() => setCopy('Copied'))
                  .catch(() => setCopy('Copy failed'));
              }}
            >
              Copy token
            </button>
            <button
              onClick={() => {
                setSecret('');
                setCopy('');
              }}
            >
              I’ve saved it
            </button>
            <span role="status">{copy}</span>
          </div>
        </div>
      ) : null}
      {creating || editing ? (
        <EntityForm
          key={editing?.id ?? 'create'}
          kind={kind}
          initial={editing}
          onCancel={() => {
            setCreating(false);
            setEditing(undefined);
          }}
          onSaved={(entity) => {
            setCreating(false);
            setEditing(undefined);
            setRevision((value) => value + 1);
            if (typeof entity.value === 'string') setSecret(entity.value);
          }}
        />
      ) : null}
      {result.loading ? (
        <p role="status">Loading {kind}…</p>
      ) : !result.error && !result.data?.length ? (
        <Empty title={`No ${kind} yet`}>{descriptions[kind]}</Empty>
      ) : null}
      <ul className="entity-list">
        {result.data?.map((entity) => (
          <li key={entity.id}>
            <div>
              <strong>{String(entity.name ?? entity.identifier)}</strong>
              <p>
                {['project', 'suite', 'scenario', 'type', 'startsWith']
                  .filter((key) => entity[key])
                  .map((key) => String(entity[key]))
                  .join(' · ')}
              </p>
              {typeof entity.transform === 'string' ? <code>{entity.transform}</code> : null}
              {typeof entity.configuration === 'string' ? (
                <details>
                  <summary>Configuration</summary>
                  <pre>{JSON.stringify(JSON.parse(entity.configuration), null, 2)}</pre>
                </details>
              ) : null}
              {typeof entity.data === 'string' ? (
                <details>
                  <summary>Delivery settings</summary>
                  <pre>{JSON.stringify(JSON.parse(entity.data), null, 2)}</pre>
                </details>
              ) : null}
            </div>
            <div className="actions">
              {kind === 'testers' ? (
                <button
                  className="text-button"
                  disabled={creating || Boolean(editing)}
                  onClick={() => setEditing(entity)}
                >
                  Edit {String(entity.name)}
                </button>
              ) : null}
              <button className="text-button danger" onClick={() => setRemoving(entity)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      {removing ? (
        <Confirm
          title={`Delete ${String(removing.name ?? removing.identifier)}?`}
          onClose={() => setRemoving(undefined)}
          onConfirm={async () => {
            await api('entities/' + kind + '/' + encodeURIComponent(removing.id), {
              method: 'DELETE',
            });
            setRevision((value) => value + 1);
          }}
        >
          {kind === 'tokens'
            ? 'Clients using this token will no longer be able to submit records.'
            : kind === 'projects'
              ? 'This removes the project and its spaces. Existing records are retained.'
              : 'This action cannot be undone.'}
        </Confirm>
      ) : null}
    </section>
  );
}
