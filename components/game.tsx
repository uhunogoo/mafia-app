'use client';
import { client } from "@/lib/colyseus/client";
import { useRoom, useRoomState } from "@colyseus/react";

function Game() {
  const { room, error, isConnecting } = useRoom(
    () => client.joinOrCreate("mafia_room", {name: "player"}),
  );
  const players = useRoomState(room, (state) => state.players);

  if (isConnecting) return <p>Connecting...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!players) return <p>Waiting for state...</p>;
  console.log(Object.values(players ?? {}))

  return (
    <>
      <ul>
        {Object.values(players ?? {}).map( (player) => (
          <li key={ `${player.sessionId}-${player.name}` }>
            {player.name} — {player.isAlive ? "живий" : "мертвий"}
          </li>
        ))}
      </ul>
    </>
  );
  // return <GameView room={room} />;
}

export default Game;
