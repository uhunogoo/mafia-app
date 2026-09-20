export interface PlayerIdentity {
  name: string;
  password: string;
}

/**
 * Storage abstraction that the membership module reads and writes
 * exclusively through. Production: {@link createBrowserSources}.
 * Tests: {@link createMemorySources}.
 */
export interface Sources {
  readLocal(key: string): string | null;
  writeLocal(key: string, value: string): void;
  readSession(key: string): string | null;
  writeSession(key: string, value: string): void;
  readHashParam(name: string): string | null;
}

export interface Membership {
  identity: PlayerIdentity | null;
  token: string | null;
  hostClaim: string | null;
  /**
   * Tracks which {@link Sources} backend each piece was loaded from. `'null'`
   * means the value is absent. After a write function (e.g. `performClaim`),
   * the source reflects the most recent write location.
   */
  sources: {
    token: 'hash' | 'session' | null;
    identity: 'storage' | null;
    hostClaim: 'session' | null;
  };
}

export interface ClaimInput {
  roomId: string;
  name: string;
}

export interface SetHostClaimInput {
  roomId: string;
  password: string;
}

export interface SetTokenInput {
  roomId: string;
  token: string;
}
