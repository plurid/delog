import { useEffect, useState } from 'react';
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch('/api/' + path, {
    ...init,
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', ...init.headers },
  });
  const value = (await response.json()) as T & { error?: { message?: string } };
  if (!response.ok) {
    // A rejected sign-in belongs to its form; resetting the app would erase the error.
    if (response.status === 401 && path !== 'session') {
      window.dispatchEvent(new Event('delog-session-expired'));
    }
    throw new APIError(
      value.error?.message ?? `Request failed (${response.status}).`,
      response.status,
    );
  }
  return value;
}
export function useResource<T>(path: string, revision = 0, poll = 0) {
  const [state, setState] = useState<{ path: string; data?: T; error?: string; loading: boolean }>({
    path,
    loading: true,
  });
  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    const load = async () => {
      try {
        const data = await api<T>(path, { signal: controller.signal });
        if (!controller.signal.aborted) setState({ path, data, loading: false });
      } catch (error) {
        if (!controller.signal.aborted)
          setState((previous) => ({
            path,
            data: previous.path === path ? previous.data : undefined,
            error: error instanceof Error ? error.message : 'Could not load data.',
            loading: false,
          }));
      }
      if (poll && !controller.signal.aborted)
        timer = setTimeout(() => {
          void load();
        }, poll);
    };
    setState((previous) => ({
      path,
      data: previous.path === path ? previous.data : undefined,
      loading: true,
    }));
    void load();
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [path, revision, poll]);
  return state.path === path ? state : { path, loading: true };
}
