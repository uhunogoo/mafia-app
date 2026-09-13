import { RULES } from '@/lib/rules';

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/UI/Dialog';
import Title from '@/components/UI/Title';

function RulesModal() {
  return (
    <DialogContent className="max-h-[85vh] overflow-hidden sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle asChild>
          <Title as="h2" className="text-lg">Правила гри «Мафія»</Title>
        </DialogTitle>
        <DialogDescription>Класичні правила для гри компанією</DialogDescription>
      </DialogHeader>
      <div className="flex max-h-[60vh] flex-col gap-5 overflow-y-auto pr-1">
        {RULES.map((section) => (
          <section key={section.title} className="flex flex-col gap-2">
            <Title as="h3" className="uppercase tracking-wide text-muted-foreground">
              {section.title}
            </Title>
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
    </DialogContent>
  );
}

export default RulesModal;
