export class DelogError extends Error {
  constructor(
    public code: string,
    message: string,
    public status = 400,
  ) {
    super(message);
    this.name = 'DelogError';
  }
}
export function object(value: unknown, name = 'input'): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new DelogError('INVALID_INPUT', `${name} must be an object.`);
  return value as Record<string, unknown>;
}
export function text(value: unknown, name: string, max = 256, empty = false): string {
  if (typeof value !== 'string' || (!empty && !value.trim()) || value.length > max)
    throw new DelogError(
      'INVALID_INPUT',
      `${name} must be ${empty ? 'at most' : '1–'}${max} characters.`,
    );
  return value;
}
export function integer(value: unknown, name: string, min: number, max: number): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < min || value > max)
    throw new DelogError('INVALID_INPUT', `${name} must be an integer from ${min} to ${max}.`);
  return value;
}
export function httpUrl(value: unknown, name: string): URL {
  let url: URL;
  try {
    url = new URL(text(value, name, 2048));
  } catch {
    throw new DelogError('INVALID_INPUT', `${name} must be an absolute HTTP(S) URL.`);
  }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password)
    throw new DelogError('INVALID_INPUT', `${name} must use HTTP(S) without URL credentials.`);
  return url;
}
