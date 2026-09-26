import {
  buildSchema,
  graphql,
  parse,
  type ExecutionResult,
  type FragmentDefinitionNode,
  type SelectionSetNode,
} from 'graphql';
import { legacySchema, type EntityKind, type RecordQuery } from '@plurid/delog-contracts';
import type { Request, Response } from 'express';
import { Authentication, type Action } from './auth.js';
import { DelogError, object, text } from './errors.js';
import { DelogService } from './service.js';
import { SourceService } from './source.js';

export const schema = buildSchema(
  legacySchema +
    `
  extend input InputQuery { project: String, space: String, level: Int, search: String, sharedID: String, from: Float, to: Float }
  extend type Code { startLine: Int }
`,
);
const names: {
  kind: EntityKind;
  singular: string;
  list: string;
  create: string;
  remove: string;
}[] = [
  {
    kind: 'projects',
    singular: 'Project',
    list: 'getProjects',
    create: 'generateProject',
    remove: 'obliterateProject',
  },
  {
    kind: 'spaces',
    singular: 'Space',
    list: 'getSpaces',
    create: 'generateSpace',
    remove: 'obliterateSpace',
  },
  {
    kind: 'tokens',
    singular: 'Token',
    list: 'getTokens',
    create: 'generateToken',
    remove: 'obliterateToken',
  },
  {
    kind: 'formats',
    singular: 'Format',
    list: 'getFormats',
    create: 'generateFormat',
    remove: 'obliterateFormat',
  },
  {
    kind: 'testers',
    singular: 'Tester',
    list: 'getTesters',
    create: 'generateTester',
    remove: 'obliterateTester',
  },
  {
    kind: 'notifiers',
    singular: 'Notifier',
    list: 'getNotifiers',
    create: 'generateNotifier',
    remove: 'obliterateNotifier',
  },
  {
    kind: 'providers',
    singular: 'Provider',
    list: 'getProviders',
    create: 'addProvider',
    remove: 'obliterateProvider',
  },
  {
    kind: 'repositories',
    singular: 'Repository',
    list: 'getRepositories',
    create: 'linkRepository',
    remove: 'delinkRepository',
  },
];
const input = (args: unknown): Record<string, unknown> => object(object(args).input ?? {});
export function createRoot(
  service: DelogService,
  auth: Authentication,
  source: SourceService,
  request: Request,
  response: Response,
  mode: string,
): Record<string, unknown> {
  const wrap =
    (action: Action, work: (owner: string, args: unknown) => unknown) => async (args: unknown) => {
      try {
        const principal = await auth.require(request, action);
        return { status: true, data: await work(principal.owner, args) };
      } catch (error) {
        return {
          status: false,
          error: {
            code: error instanceof DelogError ? error.code : 'INTERNAL',
            message: error instanceof DelogError ? error.message : 'The operation failed.',
          },
        };
      }
    };
  const ownerData = (owner: string): Record<string, unknown> => {
    const data: Record<string, unknown> = { id: owner };
    for (const item of names) data[item.kind] = () => service.list(item.kind, owner);
    data.analytics = {
      entries: (args: unknown) => {
        const value = input(args);
        const analytics = service.analytics(
          owner,
          String(value.project ?? 'all'),
          String(value.period ?? 'day'),
        );
        return {
          project: value.project ?? 'all',
          period: value.period ?? 'day',
          data: analytics.timeline.map((row) => ({
            name: new Date(row.time / 1000).toISOString(),
            value: row.total,
          })),
        };
      },
      faults: (args: unknown) => {
        const value = input(args);
        const analytics = service.analytics(
          owner,
          String(value.project ?? 'all'),
          String(value.period ?? 'day'),
        );
        return {
          project: value.project ?? 'all',
          period: value.period ?? 'day',
          data: analytics.timeline.map((row) => ({
            name: new Date(row.time / 1000).toISOString(),
            value: row.faults,
          })),
        };
      },
      size: (args: unknown) => {
        const value = input(args);
        return {
          project: value.project ?? 'all',
          value: Math.min(
            2147483647,
            service.analytics(owner, String(value.project ?? 'all')).bytes,
          ),
        };
      },
    };
    return data;
  };
  const root: Record<string, unknown> = {
    health: () => true,
    getUsageType: () => ({ status: true, data: mode.toUpperCase() }),
    getCurrentOwner: wrap('admin', (owner) => ownerData(owner)),
    login: async (args: unknown) => {
      try {
        const value = input(args);
        const identonym = text(value.identonym, 'identonym');
        const session = await auth.login(
          request,
          response,
          identonym,
          text(value.key, 'key', 4096),
        );
        return { status: true, data: ownerData(session.owner) };
      } catch (error) {
        return {
          status: false,
          error: {
            code: error instanceof DelogError ? error.code : 'INTERNAL',
            message: error instanceof DelogError ? error.message : 'Sign-in failed.',
          },
        };
      }
    },
    logout: () => {
      auth.logout(request, response);
      return { status: true };
    },
    getRecords: wrap(
      'read',
      (owner, args) => service.repository.query(owner, input(args) as RecordQuery).records,
    ),
    delogMutationRecord: wrap('ingest', (owner, args) => {
      service.ingest(owner, input(args));
    }),
    getTests: wrap('read', (owner, args) => {
      const value = input(args);
      return service.repository.tests(
        owner,
        value.count as number | undefined,
        value.start as string | undefined,
      );
    }),
    getSetup: wrap('admin', (owner) => ({ projects: service.list('projects', owner) })),
    verifyUniqueID: wrap('admin', (owner, args) => {
      const value = input(args);
      const name = String(value.type).toLowerCase();
      const kind = names.find(
        (item) => item.kind === name || item.singular.toLowerCase() === name,
      )?.kind;
      if (!kind) throw new DelogError('INVALID_INPUT', 'Unknown entity type.');
      if (
        service.repository
          .list(kind, owner)
          .some((entity) => entity.name === value.value || entity.identifier === value.value)
      )
        throw new DelogError('CONFLICT', 'Name already exists.', 409);
    }),
    getProviderRepositories: wrap('admin', (owner, args) =>
      source.repositories(owner, text(input(args).value, 'provider')),
    ),
    getCode: wrap('admin', (owner, args) => source.code(owner, input(args))),
    getAnalyticsLastPeriod: wrap('read', (owner, args) => {
      const value = input(args);
      return Object.fromEntries(
        service
          .analytics(owner, String(value.project), String(value.period))
          .levels.map((level) => [level.name, level.value]),
      );
    }),
    getAnalyticsSize: wrap('read', (owner, args) => {
      const value = input(args);
      return {
        project: value.project,
        value: Math.min(2147483647, service.analytics(owner, String(value.project)).bytes),
      };
    }),
  };
  for (const item of names) {
    root[item.list] = wrap('admin', (owner) => service.list(item.kind, owner));
    root[item.create] = wrap('admin', (owner, args) =>
      service.create(item.kind, owner, input(args)),
    );
    root[item.remove] = wrap('admin', (owner, args) =>
      service.remove(item.kind, owner, text(input(args).value, 'id')),
    );
  }
  for (const [single, many, tests] of [
    ['obliterateRecord', 'obliterateRecords', false],
    ['obliterateTest', 'obliterateTests', true],
  ] as const) {
    root[single] = wrap('admin', (owner, args) =>
      service.deleteRecords(owner, [text(input(args).value, 'id')], tests),
    );
    root[many] = wrap('admin', (owner, args) => {
      const value = input(args);
      if (value.filter)
        throw new DelogError('INVALID_INPUT', 'Use explicit ids to delete a filtered result.');
      return service.deleteRecords(owner, value.ids as string[] | undefined, tests);
    });
  }
  return root;
}
export async function executeGraphQL(
  body: unknown,
  root: Record<string, unknown>,
): Promise<ExecutionResult> {
  const value = object(body);
  const query = text(value.query, 'query', 65536);
  let document;
  try {
    document = parse(query);
  } catch {
    throw new DelogError('INVALID_QUERY', 'Invalid GraphQL syntax.');
  }
  const fragments = new Map<string, FragmentDefinitionNode>();
  for (const definition of document.definitions) {
    if (definition.kind === 'FragmentDefinition') {
      fragments.set(definition.name.value, definition);
    }
  }
  let fields = 0;
  let selections = 0;
  function checkSelections(set: SelectionSetNode, depth: number, ancestors: Set<string>) {
    for (const selection of set.selections) {
      selections++;
      if (depth > 12 || selections > 1000) {
        throw new DelogError('QUERY_LIMIT', 'Query is too complex.');
      }
      if (selection.kind === 'Field') {
        fields++;
        if (fields > 200) {
          throw new DelogError('QUERY_LIMIT', 'Query is too complex.');
        }
        if (selection.selectionSet) {
          checkSelections(selection.selectionSet, depth + 1, ancestors);
        }
      } else if (selection.kind === 'InlineFragment') {
        checkSelections(selection.selectionSet, depth, ancestors);
      } else {
        const name = selection.name.value;
        if (ancestors.has(name)) {
          throw new DelogError('QUERY_LIMIT', 'Fragment cycles are not allowed.');
        }
        const fragment = fragments.get(name);
        if (fragment) {
          checkSelections(fragment.selectionSet, depth, new Set([...ancestors, name]));
        }
      }
    }
  }
  for (const definition of document.definitions) {
    if (definition.kind === 'OperationDefinition') {
      checkSelections(definition.selectionSet, 1, new Set());
    }
  }
  return graphql({
    schema,
    source: query,
    rootValue: root,
    variableValues: value.variables == null ? undefined : object(value.variables),
    operationName: typeof value.operationName === 'string' ? value.operationName : undefined,
  });
}
