import type { AuthActionResult } from '@/lib/types/auth';

/** Стандартний розмір кімнати, поки сервер не повідомив своє значення. */
export const DEFAULT_MAX_PLAYERS = 12;

/** Початковий стан useActionState в auth-формах. */
export const AUTH_ACTION_INITIAL_STATE: AuthActionResult = {
  success: false,
};
