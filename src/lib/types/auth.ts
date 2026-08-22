export type AuthActionResult = {
  success: boolean;
  errors?: Partial<Record<string, string[]>>;
  message?: string;
};
