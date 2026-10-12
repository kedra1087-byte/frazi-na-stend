import { useState } from "react";
import { Button } from "@/components/ui/button";
import { hands, minutes, rules } from "@/content";
import { Booth } from "@/Booth";
import { Library } from "@/Library";

type Mode = "cover" | "booth" | "library";

export default function App() {
  const [mode, setMode] = useState<Mode>("cover");

  if (mode === "booth") {
    return <Booth onCover={() => setMode("cover")} onLibrary={() => setMode("library")} />;
  }

  if (mode === "library") {
    return <Library onBooth={() => setMode("booth")} />;
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-lg flex-col px-4 py-6">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">
        Cloud.ru · облачные и ИИ-сервисы
      </p>
      <h1 className="mt-3 text-4xl leading-[1.05] font-semibold text-balance">
        Фразы, которые говорят за вас
      </h1>
      <p className="mt-4 text-base leading-relaxed text-faint">
        Кейсовая игра на стенде. Пять–семь минут, одна карточка, без правильного ответа.
        Вы задаёте вопрос и молчите. Гость говорит. Потом вы называете вариант с оборота и код.
      </p>

      <div className="mt-6 flex flex-col gap-2">
        <Button size="lg" className="w-full" onClick={() => setMode("booth")}>
          Я у стола
        </Button>
        <Button variant="outline" size="lg" className="w-full" onClick={() => setMode("library")}>
          Прогнать фразы заранее
        </Button>
      </div>

      <section className="mt-8">
        <h2 className="text-sm font-semibold tracking-wide text-faint uppercase">Четыре опоры</h2>
        <ol className="mt-3 flex flex-col gap-3">
          {rules.map((rule, index) => (
            <li key={rule.title} className="flex gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {index + 1}
              </span>
              <span>
                <span className="block font-semibold">{rule.title}</span>
                <span className="mt-0.5 block text-sm leading-relaxed text-faint">{rule.text}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold tracking-wide text-faint uppercase">
          Куда уходят семь минут
        </h2>
        <ul className="mt-3 flex flex-col gap-2">
          {minutes.map((item) => (
            <li key={item.what} className="flex gap-3 text-sm leading-relaxed">
              <span className="w-24 shrink-0 font-semibold text-primary">{item.at}</span>
              <span>{item.what}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold tracking-wide text-faint uppercase">Руки</h2>
        <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed text-faint">
          {hands.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <p className="mt-8 text-sm leading-relaxed text-faint">
        В механике написано 12 карточек, в наборе кейсов их 13. На стенде сверьтесь со стопкой.
        Вслух произносите только фразы в ёлочках.
      </p>
    </main>
  );
}
