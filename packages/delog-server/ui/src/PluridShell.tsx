import {
  PluridApplication,
  definePluridConfiguration,
  PLURID_PUBSUB_TOPIC,
  type PluridPlaneComponentProperty,
  type PluridReactPlane,
} from '@plurid/plurid-react';
import type { LoggedRecord } from '@plurid/delog-contracts';
import { Console } from './Console';
import { useResource } from './api';
import { ErrorMessage } from './components';
import { RecordDetail, SourceDetail } from './RecordDetail';

function ConsolePlane() {
  return <Console spatial />;
}

interface PlaneProperties {
  plurid: PluridPlaneComponentProperty;
}

function returnToParent(plurid: PluridPlaneComponentProperty, close = false) {
  const { parentPlaneID, planeID } = plurid.plane;

  if (parentPlaneID) {
    plurid.pubSub.publish({
      topic: PLURID_PUBSUB_TOPIC.NAVIGATE_TO_PLANE,
      data: { id: parentPlaneID },
    });
  }

  if (close) {
    plurid.pubSub.publish({
      topic: PLURID_PUBSUB_TOPIC.CLOSE_PLANE,
      data: { id: planeID },
    });
  }
}

function DetailPlane({ plurid }: PlaneProperties) {
  const id = String(plurid.plane.parameters.id);
  const result = useResource<LoggedRecord>('records/' + encodeURIComponent(id));
  return (
    <div className="detail-plane">
      <div className="actions">
        <button onClick={() => returnToParent(plurid, true)}>Close plane</button>
        <button onClick={() => returnToParent(plurid)}>Back to parent</button>
      </div>
      <ErrorMessage message={result.error} />
      {result.loading ? (
        <p role="status">Loading record…</p>
      ) : result.data ? (
        <RecordDetail record={result.data} spatial />
      ) : null}
    </div>
  );
}
function SourcePlane({ plurid }: PlaneProperties) {
  const result = useResource<LoggedRecord>(
    'records/' + encodeURIComponent(String(plurid.plane.parameters.id)),
  );
  return (
    <div className="detail-plane">
      <button onClick={() => returnToParent(plurid, true)}>Close source</button>
      <ErrorMessage message={result.error} />
      {result.loading ? (
        <p>Loading record…</p>
      ) : result.data ? (
        <SourceDetail record={result.data} />
      ) : null}
    </div>
  );
}
const planes: PluridReactPlane[] = [
  { route: '/console', component: ConsolePlane },
  { route: '/record/:id', component: DetailPlane },
  { route: '/source/:id', component: SourcePlane },
];
const view = ['/console'];
const configuration = definePluridConfiguration({
  theme: 'plurid',
  toolbar: true,
  viewcube: true,
  planeControls: false,
  spaceDimensions: { width: '100%', height: '100dvh' },
  extend: {
    elements: {
      toolbar: { conceal: false },
      viewcube: { conceal: false },
    },
  },
});
export default function PluridShell() {
  return (
    <PluridApplication
      id="delog-space"
      planes={planes}
      view={view}
      centerView="/console"
      configuration={configuration}
    />
  );
}
