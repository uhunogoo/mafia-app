import type { Sources } from './types';

/**
 * Production {@link Sources}: reads/writes `window.localStorage`,
 * `window.sessionStorage`, and the `window.location.hash` query string.
 * Intended to be created fresh on each use (in particular: after a `roomId`
 * change, so the URL hash parser sees the new hash).
 */
export function createBrowserSources(): Sources {
  return {
    readLocal: (key) => window.localStorage.getItem(key),
    writeLocal: (key, value) => {
      window.localStorage.setItem(key, value);
    },
    readSession: (key) => window.sessionStorage.getItem(key),
    writeSession: (key, value) => {
      window.sessionStorage.setItem(key, value);
    },
    readHashParam: (name) => {
      const raw = window.location.hash.startsWith('#')
        ? window.location.hash.slice(1)
        : window.location.hash;
      if (!raw) return null;
      return new URLSearchParams(raw).get(name);
    },
  };
}

export interface SourcesRecord {
  kind: 'local' | 'session' | 'hash';
  key: string;
  value: string | null;
}

export interface SourcesWriteRecord {
  kind: 'local' | 'session';
  key: string;
  value: string;
}

export interface MemorySourcesRecords {
  reads: SourcesRecord[];
  writes: SourcesWriteRecord[];
  /** Seed the hash that {@link Sources.readHashParam} reads from. */
  setHash(hash: string): void;
}

export interface MemorySources extends Sources {
  records: MemorySourcesRecords;
}

/**
 * In-memory {@link Sources} for tests. No DOM, no browser globals. Every read
 * and write is appended to {@link MemorySources.records} so tests can assert
 * on what the module actually touched at the seam.
 */
export function createMemorySources(): MemorySources {
  const local = new Map<string, string>();
  const session = new Map<string, string>();
  let hash = '';

  const records: MemorySourcesRecords = {
    reads: [],
    writes: [],
    setHash: (next: string) => {
      hash = next;
    },
  };

  return {
    readLocal: (key) => {
      const value = local.get(key) ?? null;
      records.reads.push({ kind: 'local', key, value });
      return value;
    },
    writeLocal: (key, value) => {
      records.writes.push({ kind: 'local', key, value });
      local.set(key, value);
    },
    readSession: (key) => {
      const value = session.get(key) ?? null;
      records.reads.push({ kind: 'session', key, value });
      return value;
    },
    writeSession: (key, value) => {
      records.writes.push({ kind: 'session', key, value });
      session.set(key, value);
    },
    readHashParam: (name) => {
      const value = hash ? new URLSearchParams(hash).get(name) : null;
      records.reads.push({ kind: 'hash', key: name, value });
      return value;
    },
    records,
  };
}