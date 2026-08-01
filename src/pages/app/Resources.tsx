import { useState } from "react";
import { BookMarked, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader, PaperCard, SectionHeading, HandNote } from "@/components/notebook";
import { FORMULA_SHEET, RESOURCES } from "@/data/resources";

export default function Resources() {
  const [open, setOpen] = useState<string>(RESOURCES[0].title);

  return (
    <div className="space-y-8">
      <PageHeader
        kicker="module 15 · resources"
        title="Reference Notebook"
        description="Ranks, commands, aircraft, ships, missiles, abbreviations, important dates, acts and NCERT books — everything static, at your fingertips."
      />

      {/* Formula sheet */}
      <section>
        <SectionHeading title="Formula Sheet" note="quick maths" className="mb-3" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FORMULA_SHEET.map((f) => (
            <PaperCard key={f.title} withMargin className="p-4">
              <p className="mb-2 flex items-center gap-2 text-sm font-bold">
                <BookMarked className="size-4 text-chart-1" /> {f.title}
              </p>
              <ul className="space-y-1.5">
                {f.lines.map((l) => (
                  <li key={l} className="font-mono text-[12.5px] leading-5 text-muted-foreground">
                    {l}
                  </li>
                ))}
              </ul>
            </PaperCard>
          ))}
        </div>
      </section>

      {/* Resource accordion */}
      <section>
        <SectionHeading title="Defence & GK Sheets" note="tap to expand" className="mb-3" />
        <div className="space-y-3">
          {RESOURCES.map((g) => {
            const isOpen = open === g.title;
            return (
              <PaperCard key={g.title} className="overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? "" : g.title)}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                >
                  <span className="font-display text-base font-bold">{g.title}</span>
                  <ChevronDown
                    className={cn("size-4 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-180")}
                  />
                </button>
                {isOpen && (
                  <ul className="divide-y divide-border/60 border-t border-border/60">
                    {g.rows.map((r) => (
                      <li key={r.name + r.detail} className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 px-5 py-2.5">
                        <span className="text-sm font-medium">{r.name}</span>
                        <span className="font-hand text-sm text-muted-foreground">{r.detail}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </PaperCard>
            );
          })}
        </div>
      </section>

      <div className="flex items-center gap-2">
        <HandNote className="text-lg">print a few sheets & pin them where you study — memory loves paper</HandNote>
      </div>
    </div>
  );
}
