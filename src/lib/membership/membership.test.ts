import assert from 'node:assert/strict';

import { beforeEach, describe, it } from 'mocha';

import {
  createMemorySources,
  performClaim,
  performSetHostClaim,
  performSetToken,
  resolveMembership,
  type MemorySources,
} from '@/lib/membership';
import { playerKey, roomHostClaimKey, roomTokenKey } from '@/lib/membership/keys';

const ROOM = 'r1';

describe('membership.resolveMembership', () => {
  let sources: MemorySources;

  beforeEach(() => {
    sources = createMemorySources();
  });

  it('returns null token and identity and hostClaim when nothing is stored', () => {
    const m = resolveMembership(ROOM, sources);
    assert.deepStrictEqual(m, {
      identity: null,
      token: null,
      hostClaim: null,
      sources: { token: null, identity: null, hostClaim: null },
    });
  });

  it('reads token from URL hash (precedence over session)', () => {
    sources.records.setHash('token=hashTok');
    sources.writeSession(roomTokenKey(ROOM), 'sessionTok');

    const m = resolveMembership(ROOM, sources);

    assert.strictEqual(m.token, 'hashTok');
    assert.strictEqual(m.sources.token, 'hash');
  });

  it('reads token from sessionStorage when hash is empty', () => {
    sources.writeSession(roomTokenKey(ROOM), 'sessionTok');

    const m = resolveMembership(ROOM, sources);

    assert.strictEqual(m.token, 'sessionTok');
    assert.strictEqual(m.sources.token, 'session');
  });

  it('reads identity from localStorage', () => {
    sources.writeLocal(
      playerKey(ROOM),
      JSON.stringify({ name: 'Alice', password: 'g1' }),
    );

    const m = resolveMembership(ROOM, sources);

    assert.deepStrictEqual(m.identity, { name: 'Alice', password: 'g1' });
    assert.strictEqual(m.sources.identity, 'storage');
  });

  it('returns null identity when localStorage has malformed JSON', () => {
    sources.writeLocal(playerKey(ROOM), 'not-json{');

    const m = resolveMembership(ROOM, sources);

    assert.strictEqual(m.identity, null);
    assert.strictEqual(m.sources.identity, null);
  });

  it('reads hostClaim from sessionStorage', () => {
    sources.writeSession(roomHostClaimKey(ROOM), 'h1');

    const m = resolveMembership(ROOM, sources);

    assert.strictEqual(m.hostClaim, 'h1');
    assert.strictEqual(m.sources.hostClaim, 'session');
  });
});

describe('membership.performClaim', () => {
  let sources: MemorySources;

  beforeEach(() => {
    sources = createMemorySources();
  });

  it('returns current membership unchanged when name is empty', () => {
    sources.writeLocal(
      playerKey(ROOM),
      JSON.stringify({ name: 'Alice', password: 'g1' }),
    );
    sources.writeSession(roomHostClaimKey(ROOM), 'h1');
    sources.writeSession(roomTokenKey(ROOM), 'tok');
    sources.records.setHash('token=hashTok');

    const before = resolveMembership(ROOM, sources);
    sources.records.writes.length = 0;
    sources.records.reads.length = 0;

    const after = performClaim({ roomId: ROOM, name: '   ' }, sources);

    assert.deepStrictEqual(after, before);
    assert.strictEqual(sources.records.writes.length, 0, 'no writes performed');
  });

  it('writes a fresh password to localStorage when no hostClaim is present', () => {
    const m = performClaim({ roomId: ROOM, name: 'Alice' }, sources);

    assert.ok(m.identity, 'identity is set');
    assert.strictEqual(m.identity?.name, 'Alice');
    assert.ok(m.identity?.password && m.identity.password.length > 0, 'fresh password');
    assert.strictEqual(m.sources.identity, 'storage');

    assert.strictEqual(sources.records.writes.length, 1);
    const write = sources.records.writes[0];
    assert.strictEqual(write.kind, 'local');
    assert.strictEqual(write.key, playerKey(ROOM));
    assert.deepStrictEqual(
      JSON.parse(write.value),
      { name: 'Alice', password: m.identity?.password },
    );
  });

  it('uses the hostClaim as password when hostClaim is present', () => {
    sources.writeSession(roomHostClaimKey(ROOM), 'host-1');

    const m = performClaim({ roomId: ROOM, name: 'Alice' }, sources);

    assert.deepStrictEqual(m.identity, { name: 'Alice', password: 'host-1' });
    assert.strictEqual(m.sources.identity, 'storage');
  });

  it('reads the hostClaim from sources (records a session read)', () => {
    sources.writeSession(roomHostClaimKey(ROOM), 'host-1');

    performClaim({ roomId: ROOM, name: 'Alice' }, sources);

    const hostClaimRead = sources.records.reads.find(
      (r) => r.kind === 'session' && r.key === roomHostClaimKey(ROOM),
    );
    assert.ok(hostClaimRead, 'hostClaim was read from session');
    assert.strictEqual(hostClaimRead?.value, 'host-1');
  });
});

describe('membership.performSetHostClaim', () => {
  let sources: MemorySources;

  beforeEach(() => {
    sources = createMemorySources();
  });

  it('writes hostClaim to sessionStorage and returns updated membership', () => {
    const m = performSetHostClaim({ roomId: ROOM, password: 'host-1' }, sources);

    assert.strictEqual(m.hostClaim, 'host-1');
    assert.strictEqual(m.sources.hostClaim, 'session');

    assert.strictEqual(sources.records.writes.length, 1);
    const write = sources.records.writes[0];
    assert.strictEqual(write.kind, 'session');
    assert.strictEqual(write.key, roomHostClaimKey(ROOM));
    assert.strictEqual(write.value, 'host-1');
  });
});

describe('membership.performSetToken', () => {
  let sources: MemorySources;

  beforeEach(() => {
    sources = createMemorySources();
  });

  it('writes token to sessionStorage and returns updated membership', () => {
    const m = performSetToken({ roomId: ROOM, token: 'tok1' }, sources);

    assert.strictEqual(m.token, 'tok1');
    assert.strictEqual(m.sources.token, 'session');

    assert.strictEqual(sources.records.writes.length, 1);
    const write = sources.records.writes[0];
    assert.strictEqual(write.kind, 'session');
    assert.strictEqual(write.key, roomTokenKey(ROOM));
    assert.strictEqual(write.value, 'tok1');
  });
});

describe('membership.keys', () => {
  it('derives keys that match the legacy shapes', () => {
    assert.strictEqual(playerKey('r1'), 'player:r1');
    assert.strictEqual(roomTokenKey('r1'), 'room_r1_token');
    assert.strictEqual(roomHostClaimKey('r1'), 'room_r1_hostClaim');
  });
});
