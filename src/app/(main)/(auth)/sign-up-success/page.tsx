import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/UI/Card';

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Дякуємо за реєстрацію!</CardTitle>
          <CardDescription>Підтвердіть свою пошту</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Ви успішно зареєструвалися. Перевірте пошту та підтвердіть
            акаунт перед входом.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
