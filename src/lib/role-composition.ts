/**
 * Склад ролей для лобі. Шериф і лікар є завжди,
 * мафія: 2 до 10 гравців, далі 3 (Дон + решта).
 */
export function roleComposition(maxPlayers: number): string {
  const players = Math.max(6, Math.min(12, Math.floor(maxPlayers) || 12));
  const mafia = players <= 10 ? 2 : 3;
  const civilians = players - mafia - 2;

  return `${mafia} мафії (Дон + ${mafia - 1}), 1 лікар, 1 Шериф, ${civilians} мирних`;
}
