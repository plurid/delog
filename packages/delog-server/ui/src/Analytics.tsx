import { useState } from 'react';
import type { Analytics as AnalyticsData, TestResult } from '@plurid/delog-contracts';
import { api, useResource } from './api';
import { Confirm, Empty, ErrorMessage } from './components';
export function Analytics() {
  const [period, setPeriod] = useState('day');
  const result = useResource<AnalyticsData>('analytics?period=' + period);
  const data = result.data;
  const max = Math.max(1, ...(data?.levels.map((level) => level.value) ?? []));
  return (
    <section>
      <header className="section-heading">
        <div>
          <h1>Analytics</h1>
          <p>Record volume, faults, and notification delivery.</p>
        </div>
        <label>
          Period
          <select value={period} onChange={(event) => setPeriod(event.target.value)}>
            <option value="hour">Last hour</option>
            <option value="day">Last day</option>
            <option value="week">Last week</option>
            <option value="month">Last month</option>
          </select>
        </label>
      </header>
      <ErrorMessage message={result.error} />
      {result.loading ? <p role="status">Loading analytics…</p> : null}
      {data ? (
        <>
          <dl className="record-facts">
            <div>
              <dt>Total retained records</dt>
              <dd>{data.total.toLocaleString()}</dd>
            </div>
            <div>
              <dt>Warnings and errors</dt>
              <dd>{data.faults.toLocaleString()}</dd>
            </div>
            <div>
              <dt>Stored record data</dt>
              <dd>{(data.bytes / 1048576).toFixed(2)} MiB</dd>
            </div>
            <div>
              <dt>Notification queue</dt>
              <dd>
                {data.pendingNotifications} pending · {data.failedNotifications} failed
              </dd>
            </div>
          </dl>
          <h2>Severity in this period</h2>
          <div className="level-chart">
            {data.levels.map((level, index) => (
              <div key={level.name}>
                <span className={'level level-' + (index + 1)}>{level.name}</span>
                <meter min={0} max={max} value={level.value} aria-label={level.name + ' records'} />
                <span>{level.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <h2>Activity</h2>
          {data.timeline.length ? (
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Period beginning</th>
                    <th>Records</th>
                    <th>Warnings and errors</th>
                  </tr>
                </thead>
                <tbody>
                  {data.timeline.map((row) => (
                    <tr key={row.time}>
                      <td>{new Date(row.time / 1000).toLocaleString()}</td>
                      <td>{row.total}</td>
                      <td>{row.faults}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty title="No activity in this period">
              Activity appears when clients start submitting records.
            </Empty>
          )}
        </>
      ) : null}
    </section>
  );
}
export function Tests({ admin }: { admin: boolean }) {
  const [revision, setRevision] = useState(0);
  const [removing, setRemoving] = useState<TestResult>();
  const result = useResource<TestResult[]>('tests', revision, 5000);
  return (
    <section>
      <header className="section-heading">
        <div>
          <h1>Tests</h1>
          <p>Results of log sequences evaluated by your testers.</p>
        </div>
        <button onClick={() => setRevision((value) => value + 1)}>Refresh</button>
      </header>
      <ErrorMessage message={result.error} />
      {result.loading && !result.data ? <p role="status">Loading tests…</p> : null}
      {!result.loading && !result.error && !result.data?.length ? (
        <Empty title="No test runs yet">
          Create a tester, then send TESTING records with a sharedID to evaluate their sequence.
        </Empty>
      ) : null}
      {result.data?.length ? (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Run</th>
                <th>Result</th>
                <th>Completed</th>
                <th>Phases</th>
                {admin ? <th>Actions</th> : null}
              </tr>
            </thead>
            <tbody>
              {result.data.map((test) => (
                <tr key={test.id}>
                  <td className="mono">{test.id}</td>
                  <td className={test.status ? 'success' : 'danger'}>
                    {test.status ? 'Passed' : 'Failed'}
                  </td>
                  <td>{new Date(test.time * 1000).toLocaleString()}</td>
                  <td>
                    {test.phasesStatus
                      .map((status, index) => `${index + 1}: ${status ? 'pass' : 'fail'}`)
                      .join(' · ')}
                  </td>
                  {admin ? (
                    <td>
                      <button className="text-button danger" onClick={() => setRemoving(test)}>
                        Delete
                      </button>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {removing ? (
        <Confirm
          title="Delete test result?"
          onClose={() => setRemoving(undefined)}
          onConfirm={async () => {
            await api('tests/' + encodeURIComponent(removing.id), { method: 'DELETE' });
            setRevision((value) => value + 1);
          }}
        >
          The correlated records are retained.
        </Confirm>
      ) : null}
    </section>
  );
}
