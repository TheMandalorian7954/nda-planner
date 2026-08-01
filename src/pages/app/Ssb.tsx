import { useState } from "react";
import {
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock,
  FolderOpen,
  Lightbulb,
  MessageSquare,
  PenLine,
  Target,
  Timer,
} from "lucide-react";
import { PageHeader, PaperCard, SectionHeading, Stamp, HandNote } from "@/components/notebook";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  GTO_TASKS,
  LECTURETTE_TOPICS,
  OIR_SAMPLES,
  PI_QUESTIONS,
  SD_PROMPTS,
  SRT_SITUATIONS,
  TAT_PROMPTS,
  WAT_WORDS,
} from "@/data/ssb";

const TAT_SECONDS = 240;
const WAT_SECONDS = 15;
const SRT_SECONDS = 30;

export default function Ssb() {
  const [tab, setTab] = useState("stage1");

  return (
    <div className="space-y-8">
      <PageHeader
        kicker="module 6 · ssb preparation"
        title="SSB — 900 marks"
        description="Stage I (OIR) then Stage II: TAT, WAT, SRT, SD, GTO tasks and the Personal Interview. Practice with timers and banks below."
      />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="h-auto flex-wrap gap-1 rounded-xl bg-transparent p-0">
          {[
            ["stage1", "Stage I · OIR"],
            ["tat", "TAT"],
            ["wat", "WAT"],
            ["srt", "SRT"],
            ["sd", "Self Description"],
            ["gto", "GTO Tasks"],
            ["pi", "Personal Interview"],
          ].map(([v, l]) => (
            <TabsTrigger
              key={v}
              value={v}
              className="rounded-lg border border-border/70 bg-card px-4 py-2 data-[state=active]:border-transparent data-[state=active]:bg-chart-2 data-[state=active]:text-white"
            >
              {l}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="stage1" className="mt-6">
          <SectionHeading title="Officer Intelligence Rating" note="verbal + non-verbal" className="mb-4" />
          <div className="grid gap-4 md:grid-cols-2">
            {OIR_SAMPLES.map((o, i) => (
              <PaperCard key={i} withMargin className="p-4">
                <p className="text-sm font-medium">{o.q}</p>
                <p className="font-hand mt-2 text-base text-chart-3">✓ {o.a}</p>
              </PaperCard>
            ))}
          </div>
          <p className="font-hand mt-4 text-lg text-muted-foreground">
            Tip: OIR tests speed and accuracy — aim for 2 seconds per easy question.
          </p>
        </TabsContent>

        <TabsContent value="tat" className="mt-6">
          <TatPractice />
        </TabsContent>

        <TabsContent value="wat" className="mt-6">
          <WatPractice />
        </TabsContent>

        <TabsContent value="srt" className="mt-6">
          <SrtPractice />
        </TabsContent>

        <TabsContent value="sd" className="mt-6">
          <SectionHeading title="Self Description" note="5 paragraphs, 5 minutes" className="mb-4" />
          <div className="grid gap-4 md:grid-cols-2">
            {SD_PROMPTS.map((p) => (
              <PaperCard key={p.id} withMargin className="p-5">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <PenLine className="size-4 text-chart-1" /> {p.label}
                </p>
                <Textarea
                  placeholder={`Write what ${p.label.toLowerCase()}…`}
                  className="mt-3 min-h-[120px] bg-background/50"
                />
              </PaperCard>
            ))}
          </div>
          <HandNote className="mt-4 text-lg">
            Be positive and specific — avoid generic lines. Practice writing all five within 5 minutes.
          </HandNote>
        </TabsContent>

        <TabsContent value="gto" className="mt-6">
          <SectionHeading title="Group Testing Officer tasks" note="know each task cold" className="mb-4" />
          <div className="grid gap-4 md:grid-cols-2">
            {GTO_TASKS.map((t) => (
              <PaperCard key={t.name} className="p-5">
                <div className="flex items-center gap-2">
                  <Target className="size-4 text-chart-1" />
                  <h3 className="font-display text-base font-bold">{t.name}</h3>
                </div>
                <p className="mt-2 text-[13px] leading-5 text-muted-foreground">{t.desc}</p>
                <p className="mt-2 flex items-start gap-2 rounded-md bg-muted/60 p-2.5 text-[13px] leading-5">
                  <Lightbulb className="mt-0.5 size-4 shrink-0 text-chart-4" />
                  <span><strong className="font-semibold">Tip:</strong> {t.tips}</span>
                </p>
              </PaperCard>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pi" className="mt-6">
          <PiBank />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function useCountdown(seconds: number) {
  const [left, setLeft] = useState(seconds);
  const [running, setRunning] = useState(false);
  const start = () => {
    setLeft(seconds);
    setRunning(true);
    const id = window.setInterval(() => {
      setLeft((l) => {
        if (l <= 1) {
          window.clearInterval(id);
          setRunning(false);
          return 0;
        }
        return l - 1;
      });
    }, 1000);
  };
  return { left, running, start };
}

function TimerView({ seconds, running }: { seconds: number; running: boolean }) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return (
    <span className={running ? "inline-flex items-center gap-1.5 font-mono text-sm font-bold text-chart-1" : "inline-flex items-center gap-1.5 font-mono text-sm font-bold text-muted-foreground"}>
      <Timer className="size-4" />
      {m}:{String(s).padStart(2, "0")}
    </span>
  );
}

function TatPractice() {
  const [idx, setIdx] = useState(0);
  const [story, setStory] = useState("");
  const { left, running, start } = useCountdown(TAT_SECONDS);
  const prompt = TAT_PROMPTS[idx % TAT_PROMPTS.length];

  return (
    <div className="space-y-4">
      <SectionHeading title="Thematic Apperception Test" note="100+ images · story practice" className="mb-1" />
      <PaperCard ruled tape className="p-6">
        <div className="flex items-center justify-between">
          <Stamp>image {idx + 1}</Stamp>
          <TimerView seconds={left} running={running} />
        </div>
        <p className="font-display mt-4 text-lg font-semibold">{prompt}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Write a story with: what led to this scene · what's happening now · what the characters feel & will do next. (3–4 min)
        </p>
        <Textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          placeholder="Your story…"
          className="mt-4 min-h-[160px] bg-background/50"
        />
        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" onClick={start} className="gap-1.5">
            <Timer className="size-4" /> Start timer ({Math.floor(TAT_SECONDS / 60)} min)
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setIdx((i) => i + 1);
              setStory("");
            }}
          >
            Next image <ChevronRight className="size-4" />
          </Button>
        </div>
      </PaperCard>
      <HandNote className="text-lg">Real stories win — use your own life, never movie plots.</HandNote>
    </div>
  );
}

function WatPractice() {
  const [idx, setIdx] = useState(0);
  const [reaction, setReaction] = useState("");
  const { left, running, start } = useCountdown(WAT_SECONDS);
  const word = WAT_WORDS[idx % WAT_WORDS.length];

  return (
    <div className="space-y-4">
      <SectionHeading title="Word Association Test" note="3000+ words · 15s each" className="mb-1" />
      <PaperCard ruled tape className="p-6">
        <div className="flex items-center justify-between">
          <Stamp>word {idx + 1}</Stamp>
          <TimerView seconds={left} running={running} />
        </div>
        <p className="font-display mt-5 text-center text-4xl font-bold tracking-tight">{word}</p>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Write the FIRST thought that comes to mind. Keep it positive.
        </p>
        <Textarea
          value={reaction}
          onChange={(e) => setReaction(e.target.value)}
          placeholder="One sentence…"
          className="mt-4 min-h-[80px] bg-background/50"
        />
        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" onClick={start} className="gap-1.5">
            <Timer className="size-4" /> Start ({WAT_SECONDS}s)
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setIdx((i) => i + 1);
              setReaction("");
            }}
          >
            Next word <ChevronRight className="size-4" />
          </Button>
        </div>
      </PaperCard>
      <HandNote className="text-lg">Vocabulary bank: {WAT_WORDS.length} words included — add your own as you practice.</HandNote>
    </div>
  );
}

function SrtPractice() {
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  const { left, running, start } = useCountdown(SRT_SECONDS);
  const s = SRT_SITUATIONS[idx % SRT_SITUATIONS.length];

  return (
    <div className="space-y-4">
      <SectionHeading title="Situation Reaction Test" note="5000 situations · 30s each" className="mb-1" />
      <PaperCard ruled tape className="p-6">
        <div className="flex items-center justify-between">
          <Stamp>situation {idx + 1}</Stamp>
          <TimerView seconds={left} running={running} />
        </div>
        <p className="mt-4 text-sm font-medium leading-6">{s.s}</p>
        <Textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="How would you react? (2–3 lines)…"
          className="mt-4 min-h-[110px] bg-background/50"
        />
        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" onClick={start} className="gap-1.5">
            <Timer className="size-4" /> Start ({SRT_SECONDS}s)
          </Button>
          <Button size="sm" variant="outline" onClick={() => setRevealed((r) => !r)}>
            {revealed ? "Hide" : "Show"} the ideal theme
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setIdx((i) => i + 1);
              setAnswer("");
              setRevealed(false);
            }}
          >
            Next <ChevronRight className="size-4" />
          </Button>
        </div>
        {revealed && (
          <div className="mt-4 flex items-start gap-2 rounded-md bg-muted/60 p-3">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-chart-3" />
            <p className="text-[13px] leading-5">{s.theme}</p>
          </div>
        )}
      </PaperCard>
      <HandNote className="text-lg">Assessors look for: presence of mind, social confidence, and a solution-first attitude.</HandNote>
    </div>
  );
}

function PiBank() {
  const [cat, setCat] = useState(PI_QUESTIONS[0].category);
  const current = PI_QUESTIONS.find((c) => c.category === cat)!;
  const [qIdx, setQIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const { left, running, start } = useCountdown(120);

  return (
    <div className="space-y-4">
      <SectionHeading title="Personal Interview question bank" note="practice out loud" className="mb-1" />
      <div className="flex flex-wrap gap-2">
        {PI_QUESTIONS.map((c) => (
          <Badge
            key={c.category}
            variant={c.category === cat ? "default" : "outline"}
            className={c.category === cat ? "cursor-pointer bg-chart-2 hover:bg-chart-2" : "cursor-pointer"}
            onClick={() => {
              setCat(c.category);
              setQIdx(0);
              setAnswer("");
            }}
          >
            {c.category}
          </Badge>
        ))}
      </div>
      <PaperCard ruled tape className="p-6">
        <div className="flex items-center justify-between">
          <Stamp>{cat}</Stamp>
          <TimerView seconds={left} running={running} />
        </div>
        <p className="font-display mt-4 text-lg font-semibold">{current.questions[qIdx % current.questions.length]}</p>
        <Textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Answer aloud first, then jot notes here…"
          className="mt-4 min-h-[110px] bg-background/50"
        />
        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" onClick={start} className="gap-1.5">
            <Timer className="size-4" /> 2-min answer timer
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setQIdx((i) => i + 1);
              setAnswer("");
            }}
          >
            Next question <ChevronRight className="size-4" />
          </Button>
        </div>
      </PaperCard>
      <div className="grid gap-4 md:grid-cols-2">
        <PaperCard className="p-5">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <FolderOpen className="size-4 text-chart-2" /> Lecturette topics
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {LECTURETTE_TOPICS.map((t) => (
              <span key={t} className="rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs">
                {t}
              </span>
            ))}
          </div>
        </PaperCard>
        <PaperCard className="p-5">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Brain className="size-4 text-chart-4" /> Why the PI matters
          </p>
          <p className="mt-2 text-[13px] leading-5 text-muted-foreground">
            The interview weighs your personality as a whole — your answers must match your
            SD and remain consistent across the week. Use the{" "}
            <span className="font-medium">Mock Interview Recorder</span> in Communication to
            rehearse with a timer and self-score confidence.
          </p>
        </PaperCard>
      </div>
      <HandNote className="text-lg">
        <MessageSquare className="mr-1 inline size-4" /> 120-second answers keep you crisp.
      </HandNote>
    </div>
  );
}
