import { useState, type ReactNode } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import {
  caseById,
  casesByTheme,
  qrLine,
  themes,
  type ThemeId,
} from "@/content";

export default function App() {
  const [theme, setTheme] = useState<ThemeId>("ml");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = selectedId ? caseById(selectedId) : undefined;
  const cards = casesByTheme(theme);

  function pickTheme(next: ThemeId) {
    setTheme(next);
    setSelectedId(null);
  }

  return (
    <div className="mx-auto grid min-h-svh w-full max-w-6xl md:grid-cols-[320px_1fr]">
      <aside className={selected ? "hidden border-border md:block md:border-r" : "block"}>
        <div className="px-4 pt-5 pb-3">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">
            Cloud.ru · кейсы
          </p>
          <h1 className="mt-2 text-2xl leading-tight font-semibold">Выберите карточку</h1>
          <p className="mt-2 text-sm leading-relaxed text-faint">
            Участник читает кейс. Вы слушаете, задаёте один вопрос из подсказок, потом читаете учебный ответ и просите открыть код. Балл за переход по QR.
          </p>
        </div>
        <div className="flex gap-2 overflow-x-auto px-4 pb-3">
          {themes.map((item) => (
            <Button
              key={item.id}
              size="sm"
              variant={item.id === theme ? "default" : "outline"}
              className="shrink-0"
              aria-pressed={item.id === theme}
              onClick={() => pickTheme(item.id)}
            >
              {item.label}
            </Button>
          ))}
        </div>
        <ul className="flex flex-col gap-2 px-4 pb-8">
          {cards.map((card) => {
            const active = card.id === selectedId;
            return (
              <li key={card.id}>
                <button
                  type="button"
                  aria-current={active ? "true" : undefined}
                  onClick={() => setSelectedId(card.id)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left ${
                    active ? "border-primary bg-card" : "border-border bg-card/60"
                  }`}
                >
                  <span className="block text-[11px] font-semibold tracking-wide text-primary uppercase">
                    {card.person}
                  </span>
                  <span className="mt-1 block text-base leading-snug font-semibold">{card.title}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <main className={selected ? "block px-4 pt-4 pb-16" : "hidden px-4 pt-8 md:block"}>
        {selected ? (
          <CardSheet cardId={selected.id} onBack={() => setSelectedId(null)} />
        ) : (
          <p className="text-faint">Выберите карточку слева. Здесь появится текст для участника и ваши подсказки.</p>
        )}
      </main>
    </div>
  );
}

function CardSheet({ cardId, onBack }: { cardId: string; onBack: () => void }) {
  const card = caseById(cardId);
  if (!card) return null;
  const themeLabel = themes.find((item) => item.id === card.theme)?.label;

  return (
    <article className="mx-auto max-w-2xl">
      <Button variant="ghost" size="sm" className="-ml-3 md:hidden" onClick={onBack}>
        К карточкам
      </Button>
      <p className="mt-2 text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">
        {themeLabel} · {card.person}
      </p>
      <h2 className="mt-2 text-3xl leading-tight font-semibold">{card.title}</h2>

      <Section kicker="Участнику" title="Описание кейса">
        <p className="text-base leading-relaxed">{card.description}</p>
        <p className="mt-3 text-sm text-faint">
          Себе. Можно прочитать вслух или отдать карточку. Оборот пока держите у себя.
        </p>
      </Section>

      <Section kicker="Сверьте с тем, что услышите" title="Возможные ответы участника">
        <ul className="flex flex-col gap-2">
          {card.possibleAnswers.map((answer) => (
            <li key={answer} className="rounded-2xl border border-border px-4 py-3 text-sm leading-relaxed">
              {answer}
            </li>
          ))}
        </ul>
      </Section>

      <Section kicker="Задайте один" title="Вопросы и подсказки">
        <ol className="flex flex-col gap-3">
          {card.prompts.map((prompt, index) => (
            <li key={prompt.question} className="rounded-2xl border border-border px-4 py-3">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">
                Вариант {index + 1}
              </p>
              <p className="mt-2 text-base leading-relaxed font-semibold">{prompt.question}</p>
              <p className="mt-2 text-sm leading-relaxed text-faint">Себе. {prompt.hint}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section kicker="После ответа" title="Подводка к финалу">
        <p className="text-base leading-relaxed font-semibold">{card.finale}</p>
      </Section>

      <Section kicker="Учебный ответ с оборота" title={card.course}>
        <p className="text-base leading-relaxed">{card.answer}</p>
        <ul className="mt-3 flex flex-col gap-1 text-sm leading-relaxed text-faint">
          {card.program.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <section className="mt-4 rounded-[28px] border border-primary/40 bg-primary/10 px-5 py-5">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">
          Балл за QR
        </p>
        <p className="mt-2 text-lg leading-relaxed font-semibold">{qrLine(card)}</p>
        <div className="mt-4 flex justify-center">
          <div className="rounded-2xl bg-white p-3">
            <QRCodeSVG
              value={card.url}
              size={220}
              level="Q"
              marginSize={2}
              bgColor="#ffffff"
              fgColor="#101410"
              title={card.course}
            />
          </div>
        </div>
        <p className="mt-3 text-center text-sm leading-relaxed text-faint">
          Покажите этот код участнику. Камера читает его с экрана. {card.course}
        </p>
        <a
          href={card.url}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground"
        >
          Открыть страницу, если код не читается
        </a>
      </section>
    </article>
  );
}

function Section({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-4 rounded-[28px] border border-border bg-card px-5 py-5">
      <p className="text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">{kicker}</p>
      <h3 className="mt-1 text-lg font-semibold">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}
