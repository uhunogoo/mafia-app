'use client';

import React from 'react';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { RULES } from '@/lib/rules';

export default function RulesModal({ onClose }: { onClose: () => void }) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Повні правила гри"
      onClick={onClose}
    >
      <div
        className="flex max-h-[80vh] w-full max-w-2xl flex-col rounded-xl border bg-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold">Правила гри «Мафія»</h2>
          <Button variant="ghost" size="icon" aria-label="Закрити" onClick={onClose}>
            <X />
          </Button>
        </div>
        <div className="flex flex-col gap-5 overflow-y-auto px-6 py-4">
          {RULES.map((section) => (
            <section key={section.title} className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {section.title}
              </h3>
              <ul className="flex flex-col gap-1.5">
                {section.items.map((item) => (
                  <li key={item} className="list-disc pl-5 text-sm">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
