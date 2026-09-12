import { Client } from '@colyseus/sdk';

export const client = new Client(
  process.env.NEXT_PUBLIC_COLYEUS_URL ?? 'ws://localhost:2567',
);
