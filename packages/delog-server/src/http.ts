import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { entityKinds, type EntityKind, type RecordQuery } from '@plurid/delog-contracts';
import type { DelogConfig } from './config.js';
import { Authentication } from './auth.js';
import { DelogService } from './service.js';
import { SourceService } from './source.js';
import { createRoot, executeGraphQL } from './graphql.js';
import { DelogError, object, text } from './errors.js';

const kind = (value: unknown): EntityKind => {
  if (!entityKinds.includes(value as EntityKind))
    throw new DelogError('NOT_FOUND', 'Unknown resource.', 404);
  return value as EntityKind;
};
function recordQuery(request: Request): RecordQuery {
  const query: RecordQuery = {};
  for (const key of ['count', 'level', 'from', 'to'] as const)
    if (request.query[key] !== undefined) query[key] = Number(request.query[key]);
  for (const key of ['project', 'space', 'start', 'search', 'sharedID'] as const)
    if (request.query[key] !== undefined)
      query[key] = text(request.query[key], key, key === 'search' ? 512 : 256, true);
  return query;
}
export function createHttp(
  config: DelogConfig,
  service: DelogService,
  ready: () => boolean,
): Express {
  const app = express();
  const auth = new Authentication(config, service.repository);
  const source = new SourceService(service.repository);
  app.disable('x-powered-by');
  app.set('trust proxy', config.trustProxy);
  app.use((request, response, next) => {
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Referrer-Policy', 'same-origin');
    response.setHeader('X-Frame-Options', 'DENY');
    response.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; font-src 'self' data:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
    );
    if (
      request.path.startsWith('/api') ||
      request.path === config.graphqlPath ||
      request.path === '/graphql' ||
      request.path === '/delog'
    )
      response.setHeader('Cache-Control', 'no-store');
    if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      const origin = request.get('origin');
      if (origin && origin !== `${request.protocol}://${request.get('host')}`) {
        next(new DelogError('ORIGIN', 'Cross-origin writes are not allowed.', 403));
        return;
      }
      if (
        request.headers['content-length'] !== '0' &&
        request.headers['content-length'] !== undefined &&
        !request.is('application/json')
      ) {
        next(new DelogError('CONTENT_TYPE', 'Use application/json.', 415));
        return;
      }
    }
    next();
  });
  app.use(express.json({ limit: '1mb', strict: true }));
  app.all('/health', (_request, response) => response.json({ status: true }));
  app.get('/ready', (_request, response) =>
    response.status(ready() ? 200 : 503).json({ status: ready() }),
  );
  app.get('/api/config', (_request, response) =>
    response.json({ graphqlPath: config.graphqlPath, mode: config.mode }),
  );
  app.get('/api/session', async (request, response) => {
    const principal = await auth.principal(request);
    response.json({
      authenticated: principal?.role === 'admin',
      owner: principal?.owner ?? null,
      role: principal?.role ?? null,
    });
  });
  app.post('/api/session', async (request, response) => {
    const value = object(request.body);
    const { token } = await auth.login(
      request,
      response,
      text(value.identonym, 'identonym'),
      text(value.key, 'key', 4096),
    );
    response.json({ status: true, token });
  });
  app.delete('/api/session', (request, response) => {
    auth.logout(request, response);
    response.json({ status: true });
  });
  app.post('/api/records', async (request, response) => {
    const { owner } = await auth.require(request, 'ingest');
    const records = service.ingest(owner, request.body);
    response.status(201).json({ records });
  });
  app.get('/api/records', async (request, response) => {
    const { owner } = await auth.require(request, 'read');
    response.json(service.repository.query(owner, recordQuery(request)));
  });
  app.get('/api/records/:id', async (request, response) => {
    const { owner } = await auth.require(request, 'read');
    const record = service.repository.record(owner, text(request.params.id, 'id'));
    if (!record) throw new DelogError('NOT_FOUND', 'Record not found.', 404);
    response.json(record);
  });
  app.delete('/api/records', async (request, response) => {
    const { owner } = await auth.require(request, 'admin');
    const value = object(request.body);
    if (!Array.isArray(value.ids)) throw new DelogError('INVALID_INPUT', 'Supply explicit ids.');
    response.json({ deleted: service.deleteRecords(owner, value.ids as string[]) });
  });
  app.get('/api/entities/:kind', async (request, response) => {
    const { owner } = await auth.require(request, 'admin');
    response.json(service.list(kind(request.params.kind), owner));
  });
  app.post('/api/entities/:kind', async (request, response) => {
    const { owner } = await auth.require(request, 'admin');
    response.status(201).json(service.create(kind(request.params.kind), owner, request.body));
  });
  app.delete('/api/entities/:kind/:id', async (request, response) => {
    const { owner } = await auth.require(request, 'admin');
    service.remove(kind(request.params.kind), owner, text(request.params.id, 'id'));
    response.json({ status: true });
  });
  app.get('/api/tests', async (request, response) => {
    const { owner } = await auth.require(request, 'read');
    response.json(
      service.repository.tests(
        owner,
        request.query.count ? Number(request.query.count) : 100,
        request.query.start as string | undefined,
      ),
    );
  });
  app.delete('/api/tests/:id', async (request, response) => {
    const { owner } = await auth.require(request, 'admin');
    response.json({ deleted: service.deleteRecords(owner, [text(request.params.id, 'id')], true) });
  });
  app.get('/api/analytics', async (request, response) => {
    const { owner } = await auth.require(request, 'read');
    response.json(
      service.analytics(
        owner,
        request.query.project as string | undefined,
        request.query.period as string | undefined,
      ),
    );
  });
  app.post('/api/source', async (request, response) => {
    const { owner } = await auth.require(request, 'admin');
    response.json(await source.code(owner, request.body));
  });
  app.get('/api/providers/:id/repositories', async (request, response) => {
    const { owner } = await auth.require(request, 'admin');
    response.json(await source.repositories(owner, text(request.params.id, 'provider')));
  });
  app.get('/api/export', async (request, response) => {
    const { owner } = await auth.require(request, 'admin');
    const query = recordQuery(request);
    response.setHeader('Content-Type', 'application/x-ndjson');
    response.setHeader('Content-Disposition', 'attachment; filename="delog-records.ndjson"');
    // Each page is bounded; stop on disconnect and honor network backpressure.
    let cursor = query.start;
    do {
      const page = service.repository.query(owner, { ...query, count: 500, start: cursor });
      for (const record of page.records) {
        if (response.destroyed) return;
        if (!response.write(JSON.stringify(record) + '\n'))
          await new Promise<void>((resolve) => {
            const done = () => {
              response.off('drain', done);
              response.off('close', done);
              resolve();
            };
            response.once('drain', done);
            response.once('close', done);
          });
      }
      cursor = page.next ?? undefined;
    } while (cursor && !response.destroyed);
    response.end();
  });
  for (const path of new Set(['/graphql', '/delog', config.graphqlPath]))
    app.post(path, async (request, response) => {
      response.json(
        await executeGraphQL(
          request.body,
          createRoot(service, auth, source, request, response, config.mode),
        ),
      );
    });
  const client = join(fileURLToPath(new URL('.', import.meta.url)), 'client');
  if (config.serveAdmin && existsSync(join(client, 'index.html'))) {
    app.use(express.static(client, { index: false, maxAge: 0 }));
    app.get(['/', '/spatial'], (_request, response) =>
      response.sendFile(join(client, 'index.html')),
    );
  }
  app.use((_request, _response, next) =>
    next(new DelogError('NOT_FOUND', 'Route not found.', 404)),
  );
  app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
    if (response.headersSent) {
      response.destroy();
      return;
    }
    const known = error instanceof DelogError;
    const parser =
      error instanceof Error && 'status' in error && [400, 413].includes(Number(error.status));
    response
      .status(
        known ? error.status : parser ? Number((error as Error & { status: number }).status) : 500,
      )
      .json({
        error: {
          code: known ? error.code : parser ? 'INVALID_JSON' : 'INTERNAL',
          message: known
            ? error.message
            : parser
              ? 'Invalid or oversized JSON body.'
              : 'The operation failed.',
        },
      });
  });
  return app;
}
