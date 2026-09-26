import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import type { IncomingMessage } from 'node:http';
import type { Request, Response } from 'express';
import type { DelogConfig } from './config.js';
import type { Repository } from './repository.js';
import { DelogError, text } from './errors.js';

export type Action = 'read' | 'ingest' | 'admin';
export interface Principal {
  owner: string;
  role: 'admin' | 'ingest' | 'reader';
}
export interface AccessPolicy {
  authenticate(request: IncomingMessage): Promise<Principal | null>;
  authorize(principal: Principal, action: Action): boolean | Promise<boolean>;
  login?(identonym: string, key: string): Promise<Principal | null>;
}
export const hash = (value: string): string => createHash('sha256').update(value).digest('hex');
const equal = (left: string, right: string): boolean =>
  timingSafeEqual(Buffer.from(hash(left)), Buffer.from(hash(right)));
export const SESSION_COOKIE = 'delog_session';

export class Authentication {
  private readonly attempts = new Map<string, { count: number; until: number }>();
  constructor(
    private config: DelogConfig,
    private repository: Repository,
  ) {}
  private credential(request: IncomingMessage): string {
    const authorization = request.headers.authorization;
    if (authorization?.startsWith('Bearer ')) return authorization.slice(7);
    const cookie = request.headers.cookie
      ?.split(';')
      .map((value) => value.trim())
      .find((value) => value.startsWith(`${SESSION_COOKIE}=`));
    return cookie?.slice(SESSION_COOKIE.length + 1) ?? '';
  }
  async principal(request: IncomingMessage): Promise<Principal | null> {
    const token = this.credential(request);
    if (token) {
      const session = this.repository.db
        .prepare('SELECT owner FROM sessions WHERE hash=? AND expires>?')
        .get(hash(token), Date.now());
      if (session) return { owner: String(session.owner), role: 'admin' };
      if (this.config.mode === 'custom') return this.config.accessPolicy!.authenticate(request);
      if (this.config.ingestToken && equal(token, this.config.ingestToken))
        return { owner: this.config.owner.identonym, role: 'ingest' };
      const entities = this.repository.list('tokens', this.config.owner.identonym);
      if (
        entities.some(
          (entity) => typeof entity.hash === 'string' && equal(entity.hash, hash(token)),
        )
      )
        return { owner: this.config.owner.identonym, role: 'ingest' };
      return null;
    }
    if (this.config.mode === 'custom') return this.config.accessPolicy!.authenticate(request);
    return this.config.mode === 'public'
      ? { owner: this.config.owner.identonym, role: 'reader' }
      : null;
  }
  async require(request: IncomingMessage, action: Action): Promise<Principal> {
    const principal = await this.principal(request);
    if (!principal)
      throw new DelogError('UNAUTHENTICATED', 'Sign in or supply a valid token.', 401);
    text(principal.owner, 'principal owner');
    const allowed =
      this.config.mode === 'custom'
        ? await this.config.accessPolicy!.authorize(principal, action)
        : principal.role === 'admin' ||
          (principal.role === 'ingest' && action === 'ingest') ||
          (principal.role === 'reader' && action === 'read');
    if (!allowed)
      throw new DelogError('FORBIDDEN', 'This credential does not permit that operation.', 403);
    return principal;
  }
  async login(
    request: Request,
    response: Response,
    identonym: string,
    key: string,
  ): Promise<{ token: string; owner: string }> {
    const ip = request.ip ?? request.socket.remoteAddress ?? 'unknown';
    const now = Date.now();
    const attempt = this.attempts.get(ip);
    if (attempt && attempt.until > now && attempt.count >= 10)
      throw new DelogError(
        'RATE_LIMITED',
        'Too many sign-in attempts. Try again in one minute.',
        429,
      );
    if (this.attempts.size > 10000)
      for (const [key, value] of this.attempts) if (value.until <= now) this.attempts.delete(key);
    if (this.attempts.size > 10000)
      throw new DelogError('RATE_LIMITED', 'Sign-in is busy. Try again shortly.', 429);
    this.attempts.set(ip, {
      count: attempt && attempt.until > now ? attempt.count + 1 : 1,
      until: attempt && attempt.until > now ? attempt.until : now + 60000,
    });
    let owner = identonym;
    if (this.config.mode === 'custom') {
      const login = this.config.accessPolicy!.login;
      if (!login) {
        throw new DelogError('CUSTOM_AUTH', 'Use the authentication provided by this deployment.');
      }
      const principal = await login(identonym, key);
      if (!principal || principal.role !== 'admin') {
        throw new DelogError('UNAUTHENTICATED', 'Incorrect identonym or key.', 401);
      }
      owner = text(principal.owner, 'principal owner');
    } else if (
      !equal(identonym, this.config.owner.identonym) ||
      !equal(key, this.config.owner.key)
    ) {
      throw new DelogError('UNAUTHENTICATED', 'Incorrect identonym or key.', 401);
    }
    const token = randomBytes(32).toString('base64url');
    this.repository.db.prepare('DELETE FROM sessions WHERE expires<=?').run(now);
    this.repository.db
      .prepare('INSERT INTO sessions VALUES (?,?,?)')
      .run(hash(token), owner, now + 8 * 3600000);
    response.cookie(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: request.secure,
      path: '/',
      maxAge: 8 * 3600000,
    });
    response.setHeader('Cache-Control', 'no-store');
    this.attempts.delete(ip);
    return { token, owner };
  }
  logout(request: Request, response: Response): void {
    this.repository.db
      .prepare('DELETE FROM sessions WHERE hash=?')
      .run(hash(this.credential(request)));
    response.clearCookie(SESSION_COOKIE, {
      httpOnly: true,
      sameSite: 'strict',
      secure: request.secure,
      path: '/',
    });
  }
}
