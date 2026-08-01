import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import {
  BarChart3,
  Bot,
  BookOpen,
  Dumbbell,
  Home,
  Library,
  LogOut,
  Map,
  Mic,
  Repeat,
  Shield,
  Stethoscope,
  Target,
  Utensils,
  FileCheck2,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { daysBetween, fmtLong, todayStr } from "@/lib/date";

const NAV = [
  { to: "/app", label: "Dashboard", icon: Home, end: true },
  { to: "/app/written", label: "Written Exam", icon: BookOpen },
  { to: "/app/ssb", label: "SSB Preparation", icon: Shield },
  { to: "/app/communication", label: "Communication", icon: Mic },
  { to: "/app/olq", label: "Officer Like Qualities", icon: Target },
  { to: "/app/fitness", label: "Physical Fitness", icon: Dumbbell },
  { to: "/app/medical", label: "Medical Standards", icon: Stethoscope },
  { to: "/app/diet", label: "Diet & Nutrition", icon: Utensils },
  { to: "/app/habits", label: "Habits & Streaks", icon: Repeat },
  { to: "/app/mock", label: "Mock Tests", icon: FileCheck2 },
  { to: "/app/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/app/resources", label: "Resources", icon: Library },
  { to: "/app/coach", label: "AI Coach", icon: Bot },
  { to: "/app/roadmap", label: "Dev Roadmap", icon: Map },
];

export default function AppShell() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const profile = useQuery(api.profile.getProfile);

  const examDate = profile?.examDate ?? "2027-04-18";
  const daysLeft = Math.max(0, daysBetween(todayStr(), examDate));

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex max-w-[1400px]">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border/70 bg-sidebar/60 backdrop-blur lg:flex">
          <div className="flex items-center gap-2 px-5 pb-4 pt-5">
            <div className="flex size-8 items-center justify-center rounded-md bg-chart-1 text-primary-foreground">
              <Shield className="size-4" />
            </div>
            <div>
              <p className="font-display text-sm font-bold leading-none">NDA OS</p>
              <p className="font-hand text-sm text-muted-foreground">cadet notebook</p>
            </div>
          </div>
          <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "nav-link flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground active"
                      : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                  )
                }
              >
                <item.icon className="size-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="border-t border-border/70 p-3">
            <div className="mb-2 rounded-lg border border-border/70 bg-background/60 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Days to NDA
              </p>
              <p className="font-display text-2xl font-bold text-chart-1">
                {daysLeft}
                <span className="ml-1 text-xs font-normal text-muted-foreground">days</span>
              </p>
              <p className="font-hand text-xs text-muted-foreground">{fmtLong(examDate)}</p>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-destructive"
            >
              <LogOut className="size-4" />
              Sign out
              {user?.name && <span className="ml-auto truncate text-xs">{user.name}</span>}
            </button>
          </div>
        </aside>

        {/* Mobile topbar */}
        <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-border/70 bg-background/85 px-4 py-2.5 backdrop-blur lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-chart-1 text-primary-foreground">
              <Shield className="size-3.5" />
            </div>
            <p className="font-display text-sm font-bold">NDA OS</p>
          </div>
          <p className="font-hand text-base text-muted-foreground">
            {daysLeft} days to NDA
          </p>
        </div>

        {/* Main */}
        <main className="min-w-0 flex-1 px-4 pb-16 pt-14 lg:px-8 lg:pb-10 lg:pt-8">
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <p className="text-sm text-muted-foreground">{fmtLong(todayStr())}</p>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
