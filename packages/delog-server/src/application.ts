import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import type { Express } from 'express';
import { resolveConfig, type DelogConfig, type DelogOptions } from './config.js';
import { Repository } from './repository.js';
import { DelogService } from './service.js';
import { Automation } from './automation.js';
import { createHttp } from './http.js';

export class DelogApplication {
  readonly config: DelogConfig;
  private server?: Server;
  private repository?: Repository;
  private automation?: Automation;
  private starting?: Promise<string>;
  private stopping?: Promise<void>;
  private accepting = false;
  app?: Express;
  service?: DelogService;
  url?: string;
  constructor(options: DelogOptions = {}) {
    this.config = resolveConfig(options);
  }
  start(port = this.config.port): Promise<string> {
    if (this.starting) return this.starting;
    if (this.stopping) return this.stopping.then(() => this.start(port));
    if (this.server && this.url) return Promise.resolve(this.url);
    this.starting = this.open(port).finally(() => {
      this.starting = undefined;
    });
    return this.starting;
  }
  private async open(port: number): Promise<string> {
    try {
      this.repository = new Repository(this.config.dataRoot);
      this.service = new DelogService(this.repository);
      this.app = createHttp(this.config, this.service, () => this.accepting);
      this.server = createServer(this.app);
      this.server.requestTimeout = 30000;
      this.server.headersTimeout = 15000;
      await new Promise<void>((resolve, reject) => {
        const onError = (error: Error) => {
          this.server!.off('listening', onListen);
          reject(error);
        };
        const onListen = () => {
          this.server!.off('error', onError);
          resolve();
        };
        this.server!.once('error', onError);
        this.server!.once('listening', onListen);
        this.server!.listen(port, this.config.host);
      });
      this.accepting = true;
      this.automation = new Automation(
        this.service,
        this.config.retentionDays,
        this.config.onBackgroundError,
      );
      this.automation.start(this.config.notificationIntervalMs);
      const address = this.server.address() as AddressInfo;
      this.url = `http://${address.address.includes(':') ? '[' + address.address + ']' : address.address}:${address.port}`;
      return this.url;
    } catch (error) {
      this.server?.close();
      this.server = undefined;
      this.repository?.close();
      this.repository = undefined;
      throw error;
    }
  }
  close(): Promise<void> {
    if (this.stopping) return this.stopping;
    this.stopping = (async () => {
      await this.starting?.catch(() => {});
      this.accepting = false;
      if (this.server) {
        const server = this.server;
        await new Promise<void>((resolve) => {
          const timeout = setTimeout(() => server.closeAllConnections(), 5000);
          timeout.unref();
          server.close(() => {
            clearTimeout(timeout);
            resolve();
          });
          server.closeIdleConnections();
        });
      }
      await this.automation?.close();
      this.repository?.close();
      this.server = undefined;
      this.repository = undefined;
      this.automation = undefined;
      this.service = undefined;
      this.app = undefined;
      this.url = undefined;
    })().finally(() => {
      this.stopping = undefined;
    });
    return this.stopping;
  }
}
export const createDelog = (options: DelogOptions = {}): DelogApplication =>
  new DelogApplication(options);
