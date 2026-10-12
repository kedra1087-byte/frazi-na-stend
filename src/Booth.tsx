import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { PhraseCard } from "@/components/PhraseCard";
import {
  cases,
  caseById,
  catalog,
  codeFollow,
  codeLine,
  curveballs,
  deepenLines,
  doneLine,
  inviteLines,
  lingerLine,
  openerAnswer,
  openerSilence,
  receipts,
  shortLine,
  silenceLines,
  themeLabel,
  themeLines,
  themes,
  type ThemeId,
} from "@/content";

type From = ThemeId | "all";

type Step =
  | { id: "invite"; variant: number }
  | { id: "theme"; variant: number }
  | { id: "pick"; from: From }
  | { id: "ask"; caseId: string; from: From }
  | { id: "silence"; caseId: string; from: From; variant: number }
  | { id: "deepen"; caseId: string; from: From; variant: number }
  | { id: "bridge"; caseId: string; from: From; hadAnswer: boolean }
  | { id: "done"; caseId: string };

type BoothProps = {
  onCover: () => void;
  onLibrary: () => void;
};

const beatLabels = ["Позвать", "Карточка", "Вопрос", "Оборот"];

function beatIndex(step: Step) {
  if (step.id === "invite") return 0;
  if (step.id === "theme" || step.id === "pick") return 1;
  if (step.id === "ask" || step.id === "silence" || step.id === "deepen") return 2;
  return 3;
}

export function Booth({ onCover, onLibrary }: BoothProps) {
  const [step, setStep] = useState<Step>({ id: "invite", variant: 0 });
  const [asksOpen, setAsksOpen] = useState(false);
  const [openCurve, setOpenCurve] = useState<number | null>(null);
  const [bridgeMode, setBridgeMode] = useState<"full" | "short" | "scanned">("full");

  function go(next: Step, mode: "full" | "short" | "scanned" = "full") {
    setBridgeMode(mode);
    setAsksOpen(false);
    setStep(next);
  }

  function back() {
    setBridgeMode("full");
    setAsksOpen(false);
    switch (step.id) {
      case "invite":
        onCover();
        break;
      case "theme":
        setStep({ id: "invite", variant: 0 });
        break;
      case "pick":
        setStep({ id: "theme", variant: 0 });
        break;
      case "ask":
        setStep({ id: "pick", from: step.from });
        break;
      case "silence":
      case "deepen":
      case "bridge":
        setStep({ id: "ask", caseId: step.caseId, from: step.from });
        break;
      case "done":
        setStep({
          id: "bridge",
          caseId: step.caseId,
          from: "all",
          hadAnswer: true,
        });
        break;
    }
  }

  const beat = beatIndex(step);
  const card = "caseId" in step ? caseById(step.caseId) : undefined;

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-lg flex-col px-4 pt-4 pb-8">
      <header className="mb-4 flex items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={back} className="-ml-3">
          Назад
        </Button>
        <p className="text-xs font-medium tracking-wide text-faint uppercase">
          {beatLabels[beat]} · {beat + 1}/4
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setAsksOpen((open) => !open);
            setOpenCurve(null);
          }}
          aria-expanded={asksOpen}
        >
          Спросят
        </Button>
      </header>

      <div className="mb-4 flex gap-1.5" aria-hidden="true">
        {beatLabels.map((label, index) => (
          <span
            key={label}
            className={`h-1 flex-1 rounded-full ${index <= beat ? "bg-primary" : "bg-border"}`}
          />
        ))}
      </div>

      {asksOpen ? (
        <CurveballPanel
          openIndex={openCurve}
          onToggle={(index) => setOpenCurve((current) => (current === index ? null : index))}
          onClose={() => setAsksOpen(false)}
        />
      ) : (
        <BoothBody
          step={step}
          cardMissing={Boolean("caseId" in step && !card)}
          bridgeMode={bridgeMode}
          onBridgeMode={setBridgeMode}
          onStep={go}
          onLibrary={onLibrary}
        />
      )}
    </div>
  );
}

function BoothBody({
  step,
  cardMissing,
  bridgeMode,
  onBridgeMode,
  onStep,
  onLibrary,
}: {
  step: Step;
  cardMissing: boolean;
  bridgeMode: "full" | "short" | "scanned";
  onBridgeMode: (mode: "full" | "short" | "scanned") => void;
  onStep: (step: Step, mode?: "full" | "short" | "scanned") => void;
  onLibrary: () => void;
}) {
  if (cardMissing) {
    return (
      <PhraseCard kicker="Сбой" note="Вернитесь к списку карточек и нажмите ту, что вытянули.">
        Карточка не нашлась.
      </PhraseCard>
    );
  }

  if (step.id === "invite") {
    const line = inviteLines[step.variant % inviteLines.length];
    return (
      <>
        <PhraseCard
          kicker="Скажите, если человек ещё не у стола"
          note="Если уже стоят рядом, не зовите второй раз. Жмите «Подошли»."
        >
          {line}
        </PhraseCard>
        <Actions>
          <Button size="lg" className="w-full" onClick={() => onStep({ id: "theme", variant: 0 })}>
            Подошли
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => onStep({ id: "invite", variant: (step.variant + 1) % inviteLines.length })}
          >
            Другая фраза
          </Button>
        </Actions>
      </>
    );
  }

  if (step.id === "theme") {
    const line = themeLines[step.variant % themeLines.length];
    return (
      <>
        <PhraseCard
          kicker="Спросите и покажите три стопки"
          note="Карточку берут сами. Вы не выбираете за них, только называете темы."
        >
          {line}
        </PhraseCard>
        <div className="mt-4 flex flex-col gap-2">
          {themes.map((theme) => (
            <Button
              key={theme.id}
              variant="outline"
              className="h-auto w-full flex-col items-start gap-1 rounded-2xl px-4 py-4 text-left whitespace-normal"
              onClick={() => onStep({ id: "pick", from: theme.id })}
            >
              <span className="text-base font-semibold">{theme.short}</span>
              <span className="text-sm font-normal text-faint">{theme.hint}</span>
            </Button>
          ))}
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => onStep({ id: "pick", from: "all" })}
          >
            Берёт любую, показать все
          </Button>
          <Button
            variant="ghost"
            onClick={() => onStep({ id: "theme", variant: (step.variant + 1) % themeLines.length })}
          >
            Другая фраза
          </Button>
        </div>
      </>
    );
  }

  if (step.id === "pick") {
    const list = step.from === "all" ? cases : cases.filter((item) => item.theme === step.from);
    return (
      <>
        <div className="mb-3">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">
            Нажмите ту, что вытянули
          </p>
          <p className="mt-2 text-sm leading-relaxed text-faint">
            <span className="font-semibold text-foreground/90">Себе, не вслух. </span>
            Оборот пока к вам. Гостю отдайте лицевую сторону.
          </p>
        </div>
        <ul className="flex flex-col gap-2">
          {list.map((item) => (
            <li key={item.id}>
              <Button
                variant="outline"
                className="h-auto w-full flex-col items-start gap-1 rounded-2xl px-4 py-4 text-left whitespace-normal"
                onClick={() => onStep({ id: "ask", caseId: item.id, from: step.from })}
              >
                <span className="text-[11px] font-semibold tracking-wide text-primary uppercase">
                  {themeLabel(item.theme)} · {item.person}
                </span>
                <span className="text-base leading-snug font-semibold">{item.title}</span>
              </Button>
            </li>
          ))}
        </ul>
      </>
    );
  }

  const card = caseById(step.caseId);
  if (!card) return null;

  if (step.id === "ask") {
    return (
      <>
        <p className="mb-3 text-sm text-faint">
          {card.person} · {card.title}
        </p>
        <PhraseCard
          kicker="Прочитайте заголовок вслух, потом спросите"
          note="Ситуацию пусть дочитают сами. Задали вопрос и молчите, пока не досчитаете до четырёх."
        >
          {card.ask}
        </PhraseCard>
        <Actions>
          <Button
            size="lg"
            className="w-full"
            onClick={() => onStep({ id: "bridge", caseId: card.id, from: step.from, hadAnswer: true })}
          >
            Есть ответ
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => onStep({ id: "silence", caseId: card.id, from: step.from, variant: 0 })}
          >
            Молчит
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => onStep({ id: "deepen", caseId: card.id, from: step.from, variant: 0 })}
          >
            Ответ слишком общий
          </Button>
          <Button
            variant="ghost"
            onClick={() =>
              onStep({ id: "bridge", caseId: card.id, from: step.from, hadAnswer: false }, "short")
            }
          >
            Спешит
          </Button>
        </Actions>
      </>
    );
  }

  if (step.id === "silence") {
    const lines = silenceLines(card);
    const line = lines[step.variant % lines.length];
    const last = step.variant >= lines.length - 1;
    return (
      <>
        <p className="mb-3 text-sm text-faint">
          {card.person} · тишина, фраза {Math.min(step.variant + 1, lines.length)} из {lines.length}
        </p>
        <PhraseCard
          kicker="Скажите и снова замолчите"
          note="Не заполняйте паузу второй мыслью. Если и после этой фразы пусто, идите к обороту: игра не экзамен."
        >
          {line}
        </PhraseCard>
        <Actions>
          <Button
            size="lg"
            className="w-full"
            onClick={() => onStep({ id: "bridge", caseId: card.id, from: step.from, hadAnswer: true })}
          >
            Заговорил
          </Button>
          {last ? (
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={() => onStep({ id: "bridge", caseId: card.id, from: step.from, hadAnswer: false })}
            >
              Всё ещё молчит, к обороту
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={() =>
                onStep({
                  id: "silence",
                  caseId: card.id,
                  from: step.from,
                  variant: step.variant + 1,
                })
              }
            >
              Другая поддержка
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={() =>
              onStep({ id: "bridge", caseId: card.id, from: step.from, hadAnswer: false }, "short")
            }
          >
            Спешит
          </Button>
        </Actions>
      </>
    );
  }

  if (step.id === "deepen") {
    const lines = deepenLines(card);
    const line = lines[step.variant % lines.length];
    const last = step.variant >= lines.length - 1;
    return (
      <>
        <p className="mb-3 text-sm text-faint">{card.person} · уточнение</p>
        <PhraseCard
          kicker="Один уточняющий, не интервью"
          note="Если ответ уже есть, кнопка «К обороту» важнее нового вопроса. В семь минут лекция не влезает."
        >
          {line}
        </PhraseCard>
        <details className="mt-4 rounded-2xl border border-border px-4 py-3">
          <summary className="cursor-pointer text-sm font-semibold">
            Если говорят много, вставьте одну фразу
          </summary>
          <ul className="mt-3 flex flex-col gap-3">
            {receipts.map((item) => (
              <li key={item.say}>
                <p className="text-base font-semibold">{item.say}</p>
                <p className="mt-1 text-sm text-faint">{item.note}</p>
              </li>
            ))}
          </ul>
        </details>
        <Actions>
          <Button
            size="lg"
            className="w-full"
            onClick={() => onStep({ id: "bridge", caseId: card.id, from: step.from, hadAnswer: true })}
          >
            К обороту
          </Button>
          {!last && (
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={() =>
                onStep({
                  id: "deepen",
                  caseId: card.id,
                  from: step.from,
                  variant: step.variant + 1,
                })
              }
            >
              Ещё вопрос
            </Button>
          )}
        </Actions>
      </>
    );
  }

  if (step.id === "bridge") {
    const opener = step.hadAnswer ? openerAnswer : openerSilence;
    return (
      <>
        <p className="mb-3 text-sm text-faint">
          {card.official}
          {card.kind === "cert" ? " · это экзамен, не видеокурс" : ""}
        </p>
        {bridgeMode === "short" ? (
          <PhraseCard
            kicker="Коротко, если человек уже уходит"
            note="Хватит имени материала."
          >
            {shortLine(card)}
          </PhraseCard>
        ) : bridgeMode === "scanned" ? (
          <PhraseCard
            kicker="Код уже открыли"
            note="Сказали это и отпустите."
          >
            {codeFollow}
          </PhraseCard>
        ) : (
          <article className="rounded-[28px] border border-border bg-card px-5 py-6">
            <ol className="flex flex-col gap-5">
              <li>
                <p className="text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">
                  1. Сначала, всегда одно и то же
                </p>
                <p className="mt-2 text-xl leading-snug font-semibold">{opener}</p>
              </li>
              <li>
                <p className="text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">
                  2. Потом по этой карточке
                </p>
                <p className="mt-2 text-[1.45rem] leading-[1.28] font-semibold text-balance">
                  {card.bridge}
                </p>
              </li>
              <li>
                <p className="text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">
                  3. Затем про код
                </p>
                <p className="mt-2 text-xl leading-snug font-semibold">{codeLine}</p>
              </li>
            </ol>
            <p className="mt-6 text-sm leading-relaxed text-faint">
              <span className="font-semibold text-foreground/90">Себе, не вслух. </span>
              Переверните карточку к гостю только сейчас. Оборот называйте нашим вариантом. Заявку оставляют сами.
            </p>
          </article>
        )}

        <div className="mt-4 rounded-2xl border border-border px-4 py-3">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">
            Если спросят, что внутри. Назовите один пункт
          </p>
          <ul className="mt-2 flex flex-col gap-1 text-sm leading-relaxed">
            {card.bits.map((bit) => (
              <li key={bit}>{bit}</li>
            ))}
          </ul>
          {card.url && (
            <p className="mt-2 text-sm break-all text-faint">
              Если код не считывается: {card.url}
            </p>
          )}
        </div>

        <Actions>
          <Button size="lg" className="w-full" onClick={() => onStep({ id: "done", caseId: card.id })}>
            Сказали, закрыть
          </Button>
          {bridgeMode !== "scanned" && (
            <Button variant="secondary" size="lg" className="w-full" onClick={() => onBridgeMode("scanned")}>
              Уже открыли код
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={() => onBridgeMode(bridgeMode === "short" ? "full" : "short")}
          >
            {bridgeMode === "short" ? "Вернуть полный оборот" : "Сказать короче"}
          </Button>
        </Actions>
      </>
    );
  }

  return (
    <>
      <PhraseCard
        kicker="Отпустите"
        note="Один человек играет один раз. Балл команды ставится за разбор. Заявка на него не влияет, гостю про балл ничего не говорят."
      >
        {doneLine}
      </PhraseCard>
      <div className="mt-4 rounded-2xl border border-border px-4 py-4">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">
          Если не уходит
        </p>
        <p className="mt-2 text-lg leading-snug font-semibold">{lingerLine}</p>
      </div>
      <Actions>
        <Button size="lg" className="w-full" onClick={() => onStep({ id: "invite", variant: 0 })}>
          Следующий человек
        </Button>
        <Button variant="ghost" onClick={onLibrary}>
          Ещё раз прогнать фразы
        </Button>
      </Actions>
    </>
  );
}

function Actions({ children }: { children: ReactNode }) {
  return <div className="mt-4 flex flex-col gap-2 pb-2">{children}</div>;
}

function CurveballPanel({
  openIndex,
  onToggle,
  onClose,
}: {
  openIndex: number | null;
  onToggle: (index: number) => void;
  onClose: () => void;
}) {
  return (
    <div>
      <div className="mb-3 flex items-end justify-between gap-3">
        <h1 className="text-2xl font-semibold">Если разговор свернул</h1>
        <Button variant="secondary" size="sm" onClick={onClose}>
          К игре
        </Button>
      </div>
      <p className="mb-4 text-sm leading-relaxed text-faint">
        Нажмите реплику гостя. Вслух только строка «Ответьте».
      </p>
      <ul className="flex flex-col gap-2">
        {curveballs.map((item, index) => {
          const open = openIndex === index;
          return (
            <li key={item.hear}>
              <Button
                variant="outline"
                className="h-auto w-full flex-col items-start rounded-2xl px-4 py-4 text-left whitespace-normal"
                aria-expanded={open}
                onClick={() => onToggle(index)}
              >
                <span className="block text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">
                  Вас спросили
                </span>
                <span className="mt-1 block text-base font-semibold">{item.hear}</span>
                {open && (
                  <span className="mt-3 block border-t border-border pt-3">
                    <span className="block text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">
                      Ответьте
                    </span>
                    <span className="mt-1 block text-lg leading-snug font-semibold">{item.say}</span>
                    {item.note && (
                      <span className="mt-2 block text-sm leading-relaxed text-faint">
                        Себе, не вслух. {item.note}
                      </span>
                    )}
                  </span>
                )}
              </Button>
            </li>
          );
        })}
      </ul>
      <h2 className="mt-8 text-lg font-semibold">Каталог, если просят без игры</h2>
      <p className="mt-2 text-sm leading-relaxed text-faint">
        Назовите один пункт под их тему. Весь список вслух не читайте.
      </p>
      <ul className="mt-3 flex flex-col gap-3">
        {catalog.map((item) => (
          <li key={item.official}>
            <p className="font-semibold">{item.official}</p>
            <p className="mt-1 text-sm text-faint">{item.line}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
