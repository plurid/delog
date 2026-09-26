import { createDelog, type DelogApplication } from './application.js';
import type { DelogOptions } from './config.js';
import type { AccessPolicy } from './auth.js';
export { createDelog, DelogApplication } from './application.js';
export { resolveConfig } from './config.js';
export type { DelogOptions, DelogConfig } from './config.js';
export type { AccessPolicy, Principal, Action } from './auth.js';
export { DelogError } from './errors.js';
export type * from '@plurid/delog-contracts';

export interface DelogLogic {
  getCurrentOwner: () => Promise<{ id: string }>;
  checkOwnerToken: (token: string) => Promise<boolean>;
  getOwnerToken: (identonym: string, key: string) => Promise<{ token: string }>;
  logger: { log: (data: string, level?: number, error?: unknown) => void };
  provider?: {
    register: (input: { type: string; token: string; name: string }) => Promise<unknown>;
    deregister: (input: { value: string }) => Promise<boolean>;
  };
}
let compatibilityOptions: DelogOptions = {};
let compatibilityApplication: DelogApplication | undefined;
export function delogSetup(logic?: DelogLogic, options: DelogOptions = {}): void {
  if (compatibilityApplication)
    throw new Error('Close the running compatibility server before configuring it.');
  if (logic) {
    const accessPolicy: AccessPolicy = {
      async login(identonym, key) {
        const credential = await logic.getOwnerToken(identonym, key);
        if (!credential?.token || !(await logic.checkOwnerToken(credential.token))) return null;
        const owner = await logic.getCurrentOwner();
        return { owner: owner.id, role: 'admin' };
      },
      async authenticate(request) {
        const header = request.headers.authorization;
        const token = header?.startsWith('Bearer ') ? header.slice(7) : '';
        if (!token || !(await logic.checkOwnerToken(token))) return null;
        const owner = await logic.getCurrentOwner();
        return { owner: owner.id, role: 'admin' };
      },
      authorize: () => true,
    };
    compatibilityOptions = { ...options, mode: 'custom', accessPolicy };
  } else compatibilityOptions = options;
}
const delogServer = {
  async start(port?: number) {
    compatibilityApplication ??= createDelog(compatibilityOptions);
    return compatibilityApplication.start(port);
  },
  async close() {
    await compatibilityApplication?.close();
    compatibilityApplication = undefined;
  },
  get instance() {
    return compatibilityApplication?.app;
  },
};
export default delogServer;
