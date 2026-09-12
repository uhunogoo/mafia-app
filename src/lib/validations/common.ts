import { z } from 'zod';

export const emailSchema = z.email('Некоректний email');
export const passwordSchema = z
  .string()
  .min(6, 'Пароль має бути щонайменше 6 символів')
  .max(100, 'Пароль задовгий');
