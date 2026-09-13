import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/UI/Card';
import Title from '@/components/UI/Title';

export default function Page() {
  return (
    <Card>
      <CardHeader>
        <CardTitle asChild>
          <Title as="h1" className="text-2xl font-semibold">
            Дякуємо за реєстрацію!
          </Title>
        </CardTitle>
        <CardDescription>Підтвердіть свою пошту</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Ви успішно зареєструвалися. Перевірте пошту та підтвердіть
          акаунт перед входом.
        </p>
      </CardContent>
    </Card>
  );
}
