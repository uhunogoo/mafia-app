const PHASE_LABELS: Record<string, string> = {
  LOBBY: 'Лобі',
  NIGHT: 'Ніч',
  DAY_ANNOUNCEMENT: 'Оголошення жертв',
  DAY_BALAGAN: 'Балаган',
  DAY_SPEECHES: 'Промови',
  DAY_DEFENSE: 'Захист',
  DAY_VOTING: 'Голосування',
  GAME_OVER: 'Гра завершена',
};

export function phaseLabel(phase: string | undefined | null): string {
  if (!phase) return PHASE_LABELS.LOBBY;
  return PHASE_LABELS[phase] ?? PHASE_LABELS.LOBBY;
}
