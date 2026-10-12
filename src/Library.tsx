import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  cases,
  catalog,
  codeLine,
  curveballs,
  doneLine,
  eitherLine,
  hands,
  inviteLines,
  lingerLine,
  minutes,
  openerAnswer,
  receipts,
  rules,
  themeLines,
  themes,
} from "@/content";

type LibraryProps = {
  onBooth: () => void;
};

export function Library({ onBooth }: LibraryProps) {
  return (
    <div className="mx-auto w-full max-w-lg px-4 pt-5 pb-16">
      <header className="mb-6 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">
            До конференции
          </p>
          <h1 className="mt-2 text-3xl leading-tight font-semibold">Все фразы подряд</h1>
        </div>
        <Button size="sm" onClick={onBooth}>
          Я у стола
        </Button>
      </header>

      <p className="text-sm leading-relaxed text-faint">
        Вслух только текст в ёлочках. Серое и заголовки «себе» гость слышать не должен.
        На стенде удобнее режим по кнопкам: там одна фраза на экран.
      </p>

      <Section title="Куда уходят семь минут">
        <ul className="flex flex-col gap-2">
          {minutes.map((item) => (
            <li key={item.what} className="flex gap-3 text-sm leading-relaxed">
              <span className="w-24 shrink-0 font-semibold text-primary">{item.at}</span>
              <span>{item.what}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Четыре опоры">
        <ul className="flex flex-col gap-3">
          {rules.map((rule) => (
            <li key={rule.title}>
              <p className="font-semibold">{rule.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-faint">{rule.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Руки и карточки">
        <ul className="flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed">
          {hands.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section title="Позвать">
        <Quotes lines={inviteLines} />
      </Section>

      <Section title="Выбор стопки">
        <Quotes lines={themeLines} />
        <ul className="mt-3 flex flex-col gap-2 text-sm leading-relaxed text-faint">
          {themes.map((theme) => (
            <li key={theme.id}>
              <span className="font-semibold text-foreground">{theme.short}. </span>
              {theme.hint}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Если молчат">
        <p className="mb-3 text-sm leading-relaxed text-faint">
          Первая помощь на стенде подставится из карточки: два конкретных края. Ниже запасные, они одни на все кейсы.
        </p>
        <Quotes
          lines={[
            "«Можно первое, что пришло в голову. Короткая версия тоже ответ.»",
            "«Не для начальства. Что бы вы сказали коллеге?»",
            "«Один шаг на завтра, не весь план. С чего начнёте?»",
            "«Тогда со стороны: что здесь выглядит рискованным?»",
          ]}
        />
      </Section>

      <Section title="Если говорят много">
        <ul className="flex flex-col gap-3">
          {receipts.map((item) => (
            <li key={item.say}>
              <p className="text-lg font-semibold">{item.say}</p>
              <p className="mt-1 text-sm text-faint">{item.note}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Оборот и код">
        <Quotes lines={[openerAnswer, "«Тогда покажу, как смотрим мы.»", codeLine]} />
        <p className="mt-3 text-sm leading-relaxed text-faint">
          После благодарности читайте абзац конкретного кейса ниже. Потом код. Заявку не предлагайте второй раз.
        </p>
      </Section>

      <Section title="Закрыть">
        <Quotes lines={[doneLine, lingerLine]} />
      </Section>

      <Section title="Если спросят не про кейс">
        <ul className="flex flex-col gap-4">
          {curveballs.map((item) => (
            <li key={item.hear} className="border-t border-border pt-4 first:border-t-0 first:pt-0">
              <p className="text-sm text-faint">{item.hear}</p>
              <p className="mt-1 text-lg leading-snug font-semibold">{item.say}</p>
              {item.note && <p className="mt-1 text-sm text-faint">Себе. {item.note}</p>}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Каталог одной строкой">
        <p className="mb-3 text-sm leading-relaxed text-faint">
          Если человек хочет материалы без игры, назовите один пункт.
        </p>
        <ul className="flex flex-col gap-3">
          {catalog.map((item) => (
            <li key={item.official}>
              <p className="font-semibold">{item.official}</p>
              <p className="mt-1 text-sm text-faint">{item.line}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="По карточкам">
        <p className="mb-4 text-sm leading-relaxed text-faint">
          В файле механики написано 12 карточек, в наборе кейсов их 13: шесть про машинное обучение, четыре про облака, три про сертификацию. На стенде сверьтесь с живой колодой.
        </p>
        <ul className="flex flex-col gap-5">
          {cases.map((item) => (
            <li key={item.id} className="rounded-[24px] border border-border bg-card px-4 py-4">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">
                {themes.find((theme) => theme.id === item.theme)?.short} · {item.person}
              </p>
              <h2 className="mt-2 text-xl leading-snug font-semibold">{item.title}</h2>
              <Label>Вопрос</Label>
              <p className="text-base leading-snug font-semibold">{item.ask}</p>
              <Label>Если молчит</Label>
              <p className="text-base leading-snug font-semibold">{eitherLine(item.fork)}</p>
              <Label>Если ответил</Label>
              <p className="text-base leading-snug font-semibold">{item.deepen}</p>
              <Label>Оборот</Label>
              <p className="text-base leading-snug font-semibold">{item.bridge}</p>
              <p className="mt-3 text-sm text-faint">{item.official}</p>
              <ul className="mt-2 flex flex-col gap-1 text-sm text-faint">
                {item.bits.map((bit) => (
                  <li key={bit}>{bit}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Quotes({ lines }: { lines: string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {lines.map((line) => (
        <li key={line} className="text-lg leading-snug font-semibold">
          {line}
        </li>
      ))}
    </ul>
  );
}

function Label({ children }: { children: string }) {
  return (
    <p className="mt-3 mb-1 text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">
      {children}
    </p>
  );
}
