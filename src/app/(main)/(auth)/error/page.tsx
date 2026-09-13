import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/Card';

async function ErrorContent({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      {params?.error ? (
        <p className="text-sm text-muted-foreground">Код помилки: {params.error}</p>
      ) : (
        <p className="text-sm text-muted-foreground">Сталася невідома помилка.</p>
      )}
    </>
  );
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Щось пішло не так.</CardTitle>
      </CardHeader>
      <CardContent>
        <React.Suspense>
          <ErrorContent searchParams={searchParams} />
        </React.Suspense>
      </CardContent>
    </Card>
  );
}
