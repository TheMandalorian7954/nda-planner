import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Bot,
  Dumbbell,
  FileCheck2,
  HeartPulse,
  Library,
  Map,
  Mic,
  NotebookPen,
  Repeat,
  Shield,
  Stethoscope,
  Target,
  Utensils,
} from "lucide-react";
import { Link } from "react-router";
import { PaperCard, Stamp, HandNote } from "@/components/notebook";
import { daysBetween, fmtLong, todayStr } from "@/lib/date";

const EXAM_DATE = "2027-04-18";

const MODULES = [
  { icon: BookOpen, name: "Written Exam", desc: "Full Maths, English & GK syllabus with progress tracking.", accent: "var(--chart-1)" },
  { icon: Shield, name: "SSB Preparation", desc: "TAT, WAT, SRT, SD, GTO tasks and the full PI question bank.", accent: "var(--chart-2)" },
  { icon: Target, name: "Officer Like Qualities", desc: "Daily reflection and scoring on all 15 OLQs.", accent: "var(--chart-3)" },
  { icon: Dumbbell, name: "Physical Fitness", desc: "Exercises, measurements, sleep, water and recovery logs.", accent: "var(--chart-4)" },
  { icon: Stethoscope, name: "Medical Standards", desc: "Readiness checklist plus a knock-knee measurement tracker.", accent: "var(--chart-5)" },
  { icon: Utensils, name: "Diet & Nutrition", desc: "Vegetarian protein tracker, calories, meals and water.", accent: "var(--chart-1)" },
  { icon: Repeat, name: "Habits & Streaks", desc: "12 core habits with daily check-ins and streak tracking.", accent: "var(--chart-2)" },
  { icon: FileCheck2, name: "Mock Tests", desc: "Sectional & full tests with NDA negative marking and analytics.", accent: "var(--chart-3)" },
  { icon: BarChart3, name: "Analytics", desc: "Heatmaps, study graphs, mock trends and score predictions.", accent: "var(--chart-4)" },
  { icon: Mic, name: "Communication", desc: "Speaking checklists, lecturette timer and practice logs.", accent: "var(--chart-5)" },
  { icon: Library, name: "Resources", desc: "Ranks, aircraft, ships, missiles, commands, formulas & dates.", accent: "var(--chart-1)" },
  { icon: Bot, name: "AI Coach", desc: "Daily briefing, quiz generator, interview simulator & study planner.", accent: "var(--chart-2)" },
  { icon: NotebookPen, name: "Mission Mode", desc: "Every day auto-planned — fitness, study blocks, revision, SSB task.", accent: "var(--chart-3)" },
  { icon: Map, name: "Dev Roadmap", desc: "The 11-phase engineer roadmap — date-agnostic and updateable.", accent: "var(--chart-4)" },
];

export default function Landing() {
  const daysLeft = Math.max(0, daysBetween(todayStr(), EXAM_DATE));

  return (
    <div className="relative overflow-hidden">
      {/* ambient pencil lines */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0, transparent 31px, var(--rule-line) 31px, var(--rule-line) 32px)",
        }}
      />

      {/* Nav */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-chart-1 text-primary-foreground shadow-sm">
            <Shield className="size-5" />
          </div>
          <div>
            <p className="font-display text-base font-bold leading-none">NDA Operating System</p>
            <p className="font-hand text-sm text-muted-foreground">one notebook for everything</p>
          </div>
        </div>
        <Link
          to="/auth?returnTo=/app"
          className="group inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium shadow-sm transition-all hover:border-primary/40 hover:shadow"
        >
          Open your notebook
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-16 pt-10 sm:pt-16">
        <div className="grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-hand text-xl text-accent"
            >
              from average student → recommended candidate
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="font-display mt-3 text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl"
            >
              Your NDA prep,{" "}
              <span className="hi">written</span> in one{" "}
              <span className="relative inline-block">
                notebook
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 120 8"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 6C30 2 60 7 118 3"
                    stroke="var(--chart-1)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="mt-6 max-w-xl text-base leading-7 text-muted-foreground"
            >
              The complete NDA Operating System — written exam (900 marks), SSB (900 marks),
              physical standards, medical readiness, habits, mock tests, analytics and a
              personal AI coach, all tracked in one place alongside your 1st-year B.Tech
              engineering roadmap.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link
                to="/auth?returnTo=/app"
                className="inline-flex items-center gap-2 rounded-lg bg-chart-1 px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                Start today's mission
                <ArrowRight className="size-4" />
              </Link>
              <a
                href="#modules"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-medium shadow-sm transition-all hover:-translate-y-0.5 hover:shadow"
              >
                Browse the modules
              </a>
            </motion.div>
            <div className="mt-8 flex flex-wrap gap-6">
              {[
                ["2 stages", "Written + SSB, 900 each"],
                ["16 modules", "everything under one roof"],
                ["1 mission", "a planned day, every day"],
              ].map(([big, small]) => (
                <div key={big}>
                  <p className="font-display text-xl font-bold text-chart-1">{big}</p>
                  <p className="font-hand text-base text-muted-foreground">{small}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Countdown card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <PaperCard tape withMargin className="p-6 sm:p-8">
              <div className="flex items-start justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Countdown to NDA
                </p>
                <Stamp>Target</Stamp>
              </div>
              <p className="font-display mt-4 text-7xl font-bold leading-none text-chart-1">
                {daysLeft}
              </p>
              <p className="mt-2 text-sm font-medium">days remaining</p>
              <p className="font-hand mt-1 text-lg text-muted-foreground">{fmtLong(EXAM_DATE)}</p>
              <div className="mt-6 space-y-3 border-t border-border/70 pt-5">
                {[
                  { label: "Mathematics", marks: "300" },
                  { label: "English", marks: "200" },
                  { label: "General Knowledge (GAT)", marks: "400" },
                  { label: "SSB Interview", marks: "900" },
                ].map((r) => (
                  <div key={r.label} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{r.label}</span>
                    <span className="font-display font-bold">{r.marks}</span>
                  </div>
                ))}
              </div>
              <p className="margin-note mt-4 text-lg">paper &amp; pencil, but digital ✎</p>
            </PaperCard>
          </motion.div>
        </div>
      </section>

      {/* Mission Mode strip */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-14">
        <PaperCard ruled className="p-6 sm:p-8" withMargin>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-hand text-xl text-accent">the core loop</p>
              <h2 className="font-display mt-1 text-2xl font-bold sm:text-3xl">
                Mission Mode plans every single day
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Morning fitness → subject study blocks → current affairs quiz → English
                vocabulary → SSB task of the day → spaced revision → evening reflection.
                A weekly mock test and a monthly review keep you compounding.
              </p>
            </div>
            <Link
              to="/auth?returnTo=/app"
              className="inline-flex items-center gap-2 rounded-lg bg-chart-1 px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:-translate-y-0.5"
            >
              Plan my day
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </PaperCard>
      </section>

      {/* Modules grid */}
      <section id="modules" className="relative z-10 mx-auto max-w-6xl px-5 pb-16">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            <span className="hi">Sixteen modules</span>, one rhythm
          </h2>
          <HandNote className="text-lg">tick them daily, not once</HandNote>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.06 }}
            >
              <PaperCard className="h-full p-5 transition-transform duration-200 hover:-translate-y-1">
                <div
                  className="mb-3 flex size-10 items-center justify-center rounded-lg"
                  style={{ background: `color-mix(in oklch, ${m.accent} 13%, transparent)`, color: m.accent }}
                >
                  <m.icon className="size-5" />
                </div>
                <h3 className="font-display text-base font-bold">{m.name}</h3>
                <p className="mt-1.5 text-[13px] leading-5 text-muted-foreground">{m.desc}</p>
              </PaperCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Two stages */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-16">
        <h2 className="font-display mb-6 text-2xl font-bold sm:text-3xl">
          <span className="hi">The UPSC structure</span>, respected
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              n: "1",
              t: "Written Exam — 900 marks",
              d: "Mathematics (300) + English (200) + General Knowledge & Current Affairs (400), all mapped topic-by-topic so you always know where you stand.",
            },
            {
              n: "2",
              t: "SSB Interview — 900 marks",
              d: "Stage I & Stage II: TAT, WAT, SRT, SD, GTO tasks and the personal interview — with practice banks, timers and self-scoring.",
            },
            {
              n: "3",
              t: "Medical & Merit",
              d: "Track medical standards readiness and the knock-knee measurements honestly, then let the merit list follow the consistency.",
            },
          ].map((s) => (
            <PaperCard key={s.n} className="p-5" withMargin>
              <div className="flex items-center gap-3">
                <div className="scribble-ring flex size-9 shrink-0 items-center justify-center font-display text-lg font-bold text-accent">
                  {s.n}
                </div>
                <h3 className="font-display text-base font-bold">{s.t}</h3>
              </div>
              <p className="mt-3 text-[13px] leading-5 text-muted-foreground">{s.d}</p>
            </PaperCard>
          ))}
        </div>
      </section>

      {/* Roadmap teaser */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-20">
        <PaperCard tape className="p-6 sm:p-8" withMargin>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="max-w-xl">
              <p className="font-hand text-xl text-accent">while you're at it</p>
              <h2 className="font-display mt-1 text-2xl font-bold sm:text-3xl">
                The 11-phase engineer roadmap
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Python → full-stack → ML → deep learning → computer vision → LLMs →
                robotics → drones → cybersecurity → DevOps → cloud. Built for a 1st-year
                B.Tech schedule alongside NDA prep, with no fake deadlines — you own the
                phases and tick them off as you go.
              </p>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              {["≈ 20 portfolio repos", "5–6 hrs/day routine", "23-skill checklist"].map((x) => (
                <p key={x} className="font-hand text-lg text-muted-foreground">
                  ✓ {x}
                </p>
              ))}
            </div>
          </div>
        </PaperCard>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 border-t border-border/70 bg-sidebar/50">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 py-16 text-center">
          <HeartPulse className="size-8 text-chart-1" />
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Your first entry is free.
          </h2>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            Sign in, set your exam date, and let Mission Mode lay out today — the notebook
            does the rest.
          </p>
          <Link
            to="/auth?returnTo=/app"
            className="mt-2 inline-flex items-center gap-2 rounded-lg bg-chart-1 px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            Open the notebook
            <ArrowRight className="size-4" />
          </Link>
          <p className="font-hand mt-2 text-lg text-muted-foreground">
            — signed, the cadet's OS
          </p>
        </div>
      </section>
    </div>
  );
}
