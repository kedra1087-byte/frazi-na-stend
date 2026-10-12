import { useEffect, useRef, type ReactNode } from "react";

type PhraseCardProps = {
  kicker: string;
  children: ReactNode;
  note: string;
};

export function PhraseCard({ kicker, children, note }: PhraseCardProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [children]);

  return (
    <article className="flex min-h-[18rem] flex-col rounded-[28px] border border-border bg-card px-5 py-6">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">
        {kicker}
      </p>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="mt-4 text-xl leading-relaxed font-semibold outline-none"
      >
        {children}
      </h1>
      <p className="mt-auto pt-8 text-sm leading-relaxed text-faint">
        <span className="font-semibold text-foreground/90">Себе, не вслух. </span>
        {note}
      </p>
    </article>
  );
}
