'use client';

import React from 'react';
import { BookOpen } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import RulesModal from '@/components/room/rules-modal';

const HINTS = [
  'Мертві гравці не говорять і не жестикулюють',
  'Ролі приховані до кінця гри',
  'Ніч триває, поки всі активні ролі не зроблять хід',
  'Голосування відбувається після промов',
];

export default function RulesCard() {
  const [open, setOpen] = React.useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Правила та підказки:
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ul className="flex flex-col gap-2">
          {HINTS.map((hint) => (
            <li key={hint} className="flex gap-2 text-sm text-muted-foreground">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-muted-foreground/60" aria-hidden />
              {hint}
            </li>
          ))}
        </ul>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <BookOpen />
              Читати повні правила
            </Button>
          </DialogTrigger>
          <RulesModal />
        </Dialog>
      </CardContent>
    </Card>
  );
}
