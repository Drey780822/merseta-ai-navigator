"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  Archive,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clipboard,
  Command as CommandIcon,
  Copy,
  FileCheck2,
  FileSearch,
  FileText,
  FolderOpen,
  Gauge,
  GraduationCap,
  HelpCircle,
  Home,
  Library,
  Menu,
  MessageSquareText,
  Mic,
  Moon,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Paperclip,
  Plus,
  RefreshCw,
  Search,
  Settings,
  SlidersHorizontal,
  Sparkle,
  Sun,
  Upload,
  UserRound,
  X,
  ZoomIn,
  ZoomOut,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputButton,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Seed } from "@/components/seed";
import { BRAND_ASSETS } from "@/lib/brand-assets";
import { occupations, recentItems, skills, type WorkspaceView } from "@/lib/merseta-data";
import { cn } from "@/lib/utils";

const nav: { id: WorkspaceView; label: string; icon: LucideIcon }[] = [
  { id: "welcome", label: "Workspace", icon: Home },
  { id: "document", label: "Documents", icon: FileText },
  { id: "knowledge", label: "Extractions", icon: Archive },
  { id: "knowledge", label: "Knowledge", icon: Library },
  { id: "skills", label: "Skills Intelligence", icon: Gauge },
];

function ProductMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <img
        src={BRAND_ASSETS.icon}
        alt={compact ? "merSETA Extractor" : ""}
        className="size-6 shrink-0 object-contain"
      />
      {!compact && (
        <div className="min-w-0 leading-none">
          <p className="truncate text-sm font-semibold text-ink-primary">merSETA Extractor</p>
        </div>
      )}
    </div>
  );
}

function InstitutionalMarks({ compact = false }: { compact?: boolean }) {
  if (compact) return null;
  return (
    <div
      className="flex h-7 items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.14em] text-ink-tertiary"
      aria-label="Wits and merSETA partnership"
    >
      <span>Wits</span>
      <span className="h-3.5 w-px bg-line-subtle" />
      <span>merSETA</span>
    </div>
  );
}

function IconButton({
  label,
  children,
  onClick,
  className,
}: {
  label: string;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClick}
          aria-label={label}
          className={cn("shrink-0", className)}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function AppSidebar({
  collapsed,
  view,
  onView,
  onCollapse,
  onSearch,
  mobile = false,
}: {
  collapsed: boolean;
  view: WorkspaceView;
  onView: (view: WorkspaceView) => void;
  onCollapse: () => void;
  onSearch: () => void;
  mobile?: boolean;
}) {
  const slim = collapsed && !mobile;
  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-line-subtle bg-ground-sunken/60 editorial-transition",
        slim ? "w-16" : "w-[248px]",
      )}
    >
      <div className="flex h-16 items-center justify-between px-3">
        <ProductMark compact={slim} />
        {!mobile && (
          <IconButton
            label={slim ? "Expand sidebar" : "Collapse sidebar"}
            onClick={onCollapse}
            className="size-8 text-ink-secondary hover:text-ink-primary hover:bg-ground-raised"
          >
            {slim ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          </IconButton>
        )}
      </div>
      <nav className="min-h-0 flex-1 overflow-y-auto px-2 pt-2" aria-label="Primary navigation">
        <Button
          variant="ghost"
          className={cn(
            "mb-1 h-10 w-full justify-start gap-3 font-medium text-ink-primary hover:bg-ground-raised",
            slim && "justify-center px-0",
          )}
          onClick={() => onView("welcome")}
          aria-label="New session"
        >
          <Plus className="size-4 text-clay" />
          {!slim && "New session"}
        </Button>
        <Button
          variant="ghost"
          onClick={onSearch}
          aria-label="Search"
          className={cn(
            "mb-5 h-10 w-full justify-start gap-3 font-normal text-ink-secondary hover:text-ink-primary hover:bg-ground-raised",
            slim && "justify-center px-0",
          )}
        >
          <Search className="size-4 text-ink-tertiary" />
          {!slim && "Search"}
        </Button>
        {nav.map((item, index) => {
          const active = item.id === view && !(item.id === "knowledge" && index === 2);
          return (
            <Button
              variant="ghost"
              key={item.label}
              onClick={() => onView(item.id)}
              aria-label={item.label}
              className={cn(
                "h-10 w-full justify-start gap-3 font-normal transition-colors",
                active
                  ? "border border-line-subtle bg-ground-raised font-semibold text-ink-primary shadow-[var(--shadow-e1)]"
                  : "text-ink-secondary hover:bg-ground-raised/60 hover:text-ink-primary",
                slim && "justify-center px-0",
              )}
            >
              <item.icon
                className={cn("size-4 shrink-0", active ? "text-clay" : "text-ink-tertiary")}
              />
              {!slim && <span className="truncate">{item.label}</span>}
            </Button>
          );
        })}
        {!slim && (
          <div className="mt-8">
            <p className="mb-2 px-3 text-xs font-medium text-ink-tertiary">Recent sessions</p>
            {recentItems.map((item) => (
              <Button
                variant="ghost"
                key={item}
                onClick={() => onView("session")}
                className="h-10 w-full justify-start px-3 text-left text-[13px] font-normal text-ink-secondary hover:bg-ground-raised hover:text-ink-primary"
              >
                <span className="truncate">{item}</span>
              </Button>
            ))}
          </div>
        )}
      </nav>
      <div className="p-2">
        {!slim && (
          <div className="px-3 pb-2">
            <InstitutionalMarks />
          </div>
        )}
        <Button
          variant="ghost"
          onClick={() => onView("settings")}
          aria-label="Settings"
          className={cn(
            "h-10 w-full justify-start gap-3 font-normal text-ink-secondary hover:bg-ground-raised hover:text-ink-primary",
            slim && "justify-center px-0",
          )}
        >
          <Settings className="size-4 text-ink-tertiary" />
          {!slim && "Settings"}
        </Button>
        <div className={cn("flex items-center gap-3 px-3 py-3", slim && "justify-center px-0")}>
          <div className="grid size-7 shrink-0 place-items-center rounded-full bg-clay text-[10px] font-semibold text-primary-foreground shadow-[var(--shadow-e1)]">
            TD
          </div>
          {!slim && (
            <p className="truncate text-[13px] font-medium text-ink-primary">Tshepang Dikotope</p>
          )}
        </div>
      </div>
    </aside>
  );
}

function AppHeader({
  title,
  dark,
  onDark,
  onMenu,
  onSearch,
}: {
  title: string;
  dark: boolean;
  onDark: () => void;
  onMenu: () => void;
  onSearch: () => void;
}) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-line-subtle bg-background/80 px-3 backdrop-blur sm:px-5">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden text-ink-secondary hover:text-ink-primary hover:bg-ground-raised"
        onClick={onMenu}
        aria-label="Open navigation"
      >
        <Menu />
      </Button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink-secondary">
          {title === "Workspace" || title === "Research session" ? "merSETA Extractor" : title}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <IconButton
          label="Search workspace"
          onClick={onSearch}
          className="text-ink-secondary hover:text-ink-primary hover:bg-ground-raised"
        >
          <Search />
        </IconButton>
        <IconButton
          label={dark ? "Use daylight mode" : "Use night workspace"}
          onClick={onDark}
          className="text-ink-secondary hover:text-ink-primary hover:bg-ground-raised"
        >
          {dark ? <Sun /> : <Moon />}
        </IconButton>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open profile menu"
              className="hover:bg-ground-raised"
            >
              <div className="grid size-7 place-items-center rounded-full border border-line-subtle bg-card text-[10px] font-bold text-ink-primary shadow-[var(--shadow-e1)]">
                TD
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 rounded-xl border border-line-subtle bg-card shadow-[var(--shadow-e2)]"
          >
            <DropdownMenuLabel>
              <p className="text-sm font-semibold text-ink-primary">Tshepang Dikotope</p>
              <p className="font-normal text-xs text-ink-secondary">
                Wits–merSETA Research Workspace
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-line-subtle" />
            <DropdownMenuItem className="text-ink-secondary hover:text-ink-primary focus:bg-ground-raised">
              <UserRound className="text-ink-tertiary" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="text-ink-secondary hover:text-ink-primary focus:bg-ground-raised">
              <Settings className="text-ink-tertiary" /> Preferences
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-line-subtle" />
            <DropdownMenuItem className="text-ink-secondary hover:text-ink-primary focus:bg-ground-raised">
              <CircleHelp className="text-ink-tertiary" /> Help centre
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow text-ink-tertiary">{children}</p>;
}

function WelcomeView({
  onView,
  onSubmit,
}: {
  onView: (v: WorkspaceView) => void;
  onSubmit: (text: string) => void;
}) {
  return (
    <main className="view-enter flex h-full min-h-[440px] flex-col px-5 pb-6 sm:px-8">
      <div className="mx-auto flex w-full max-w-[680px] flex-1 flex-col justify-center pb-8 md:pb-16">
        <div className="mb-7 flex items-center justify-center gap-3">
          <img src={BRAND_ASSETS.icon} alt="" className="size-10 object-contain" />
          <Seed size={32} state="idle" />
        </div>
        <h1 className="text-center font-serif text-3xl sm:text-4xl font-normal tracking-[-0.015em] text-ink-primary">
          How can I help you today?
        </h1>
        <p className="mx-auto mt-3 max-w-[420px] text-center text-base leading-relaxed text-ink-secondary">
          Explore skills intelligence, analyze workforce reports, or query occupational
          qualifications.
        </p>
        <div className="mt-8 hidden md:block">
          <Composer inline onSubmit={onSubmit} onAttach={() => onView("upload")} />
        </div>
        <div className="mt-6 hidden items-center justify-center gap-3 md:flex">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full border border-line-subtle bg-card px-4 py-2 text-sm font-medium text-ink-secondary hover:border-line-strong hover:bg-ground-raised hover:text-ink-primary shadow-[var(--shadow-e1)]"
            onClick={() => onView("upload")}
          >
            <FileText className="size-4 text-clay" />
            Analyze a report
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full border border-line-subtle bg-card px-4 py-2 text-sm font-medium text-ink-secondary hover:border-line-strong hover:bg-ground-raised hover:text-ink-primary shadow-[var(--shadow-e1)]"
            onClick={() => onView("skills")}
          >
            <Gauge className="size-4 text-tide" />
            Explore skills
          </Button>
        </div>
      </div>
      <div className="mx-auto w-full max-w-[680px] md:hidden">
        <Composer inline onSubmit={onSubmit} onAttach={() => onView("upload")} />
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full border border-line-subtle bg-card px-4 py-2 text-xs font-medium text-ink-secondary hover:bg-ground-raised hover:text-ink-primary shadow-[var(--shadow-e1)]"
            onClick={() => onView("upload")}
          >
            <FileText className="size-3.5 text-clay" />
            Analyze a report
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full border border-line-subtle bg-card px-4 py-2 text-xs font-medium text-ink-secondary hover:bg-ground-raised hover:text-ink-primary shadow-[var(--shadow-e1)]"
            onClick={() => onView("skills")}
          >
            <Gauge className="size-3.5 text-tide" />
            Explore skills
          </Button>
        </div>
      </div>
    </main>
  );
}

function UploadView({ onView }: { onView: (v: WorkspaceView) => void }) {
  const [dragging, setDragging] = useState(false);
  const [failed, setFailed] = useState(false);
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    onView("processing");
  };
  return (
    <main className="view-enter mx-auto flex min-h-full w-full max-w-4xl flex-col px-5 pb-28 pt-12 sm:px-8 sm:pt-20">
      <Eyebrow>Document intake</Eyebrow>
      <h1 className="mt-4 font-serif text-3xl sm:text-4xl font-normal text-ink-primary">
        Add a document
      </h1>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-secondary">
        Bring a sector skills report or occupational standard into the workspace to inspect its
        structure and reveal skills intelligence.
      </p>
      <div
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={cn(
          "mt-12 flex min-h-72 flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-card px-6 text-center editorial-transition shadow-[var(--shadow-e1)]",
          dragging
            ? "border-tide bg-tide-tint/20 ring-2 ring-tide/30"
            : "border-line-strong hover:border-tide",
        )}
      >
        <div
          className={cn(
            "mb-6 grid size-12 place-items-center rounded-xl border border-line-subtle bg-ground-raised text-tide shadow-[var(--shadow-e1)]",
            dragging && "border-tide bg-tide-tint text-tide",
          )}
        >
          <Upload className="size-5" />
        </div>
        <h2 className="text-xl font-semibold text-ink-primary">
          {dragging ? "Release to add document" : "Drop a file here or browse"}
        </h2>
        <p className="mt-2 text-sm text-ink-tertiary">PDF · DOCX · CSV · TXT · up to 20 MB</p>
        <Button
          className="mt-7 rounded-full bg-clay px-6 text-primary-foreground hover:bg-clay/90 shadow-[var(--shadow-e1)] transition-transform active:scale-95"
          onClick={() => onView("processing")}
        >
          <Plus /> Add document
        </Button>
      </div>
      <div className="mt-10 flex items-center justify-between border-t border-line-subtle pt-6">
        <div>
          <p className="text-sm font-semibold text-ink-primary">Need to test an exception?</p>
          <p className="text-xs text-ink-secondary">
            Preview a calm, recoverable failure state with no jarring alerts.
          </p>
        </div>
        <Button
          variant="ghost"
          className="rounded-lg text-ink-secondary hover:text-ink-primary hover:bg-ground-raised"
          onClick={() => setFailed(!failed)}
        >
          Toggle error
        </Button>
      </div>
      {failed && (
        <div className="mt-5 rounded-xl border-l-4 border-madder bg-card p-5 shadow-[var(--shadow-e1)]">
          <p className="font-semibold text-ink-primary">Something interrupted the process.</p>
          <p className="mt-1 text-sm text-ink-secondary">
            The document is still available in your local session. You can safely try again.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 rounded-full border-line-strong text-ink-primary hover:bg-ground-raised"
            onClick={() => setFailed(false)}
          >
            <RefreshCw className="size-3.5" /> Try again
          </Button>
        </div>
      )}
    </main>
  );
}

function ProcessingView({ onView }: { onView: (v: WorkspaceView) => void }) {
  const [step, setStep] = useState(1);
  useEffect(() => {
    const timer = window.setInterval(() => setStep((s) => (s < 3 ? s + 1 : s)), 900);
    return () => window.clearInterval(timer);
  }, []);
  const stages = ["Reading", "Identifying", "Structuring", "Ready"];
  return (
    <main className="view-enter flex min-h-full items-center justify-center px-5 pb-28">
      <div className="w-full max-w-2xl">
        <Eyebrow>Understanding document</Eyebrow>
        <h1 className="mt-4 font-serif text-3xl sm:text-4xl font-normal text-ink-primary">
          Manufacturing Sector Skills Plan
        </h1>
        <div className="mt-12 grid grid-cols-4 gap-2" aria-label="Extraction progress">
          {stages.map((name, i) => (
            <div key={name}>
              <div
                className={cn(
                  "h-1 rounded-full bg-line-subtle transition-colors",
                  i <= step && "bg-ochre",
                  i < step && "bg-moss",
                  i === step && "quiet-line",
                )}
              />
              <p
                className={cn(
                  "mt-3 text-xs flex items-center",
                  i <= step ? "font-semibold text-ink-primary" : "text-ink-tertiary",
                )}
              >
                {i < step ? <Check className="mr-1 inline size-3.5 text-moss" /> : null}
                {name}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-14 rounded-2xl border border-line-subtle bg-card p-8 shadow-[var(--shadow-e1)]">
          <div className="flex items-center gap-3">
            <Seed size={24} state={step < 3 ? "thinking" : "idle"} />
            <Shimmer
              className="text-base font-semibold text-tide"
              children={
                step < 3
                  ? (["Preparing document", "Reading content", "Building skill map"][step] ??
                    "Reading content")
                  : "Structured knowledge ready"
              }
            />
          </div>
          <p className="mt-3 text-sm text-ink-secondary leading-relaxed">
            {step < 3
              ? "Mapping language, evidence and occupational relationships."
              : "32 skills and 14 occupations were identified with high confidence."}
          </p>
        </div>
        {step === 3 && (
          <Button
            className="mt-8 rounded-full bg-clay px-6 text-primary-foreground hover:bg-clay/90 shadow-[var(--shadow-e1)] transition-transform active:scale-95"
            onClick={() => onView("knowledge")}
          >
            Review extracted knowledge <ArrowRight />
          </Button>
        )}
      </div>
    </main>
  );
}

function Composer({
  onSubmit,
  onAttach,
  inline = false,
  thinking = false,
}: {
  onSubmit?: (text: string) => void;
  onAttach?: () => void;
  inline?: boolean;
  thinking?: boolean;
}) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (!thinking) textareaRef.current?.focus();
  }, [thinking]);

  const seedState = thinking ? "thinking" : text.trim() ? "listening" : "idle";

  return (
    <div
      className={
        inline
          ? "w-full"
          : "pointer-events-none fixed inset-x-0 bottom-0 z-20 bg-background/80 px-4 pb-4 backdrop-blur md:left-[var(--app-sidebar-width)] sm:px-6 sm:pb-5"
      }
    >
      <div className="pointer-events-auto mx-auto max-w-[760px]">
        <div className="flex items-end gap-3">
          <div className="hidden pb-3 sm:flex shrink-0" title={`Presence: ${seedState}`}>
            <Seed size={28} state={seedState} />
          </div>
          <div className="min-w-0 flex-1">
            <PromptInput
              onSubmit={(message) => {
                const value = message.text.trim();
                if (value) {
                  onSubmit?.(value);
                  setText("");
                  textareaRef.current?.focus();
                }
              }}
              className="rounded-2xl border border-line-subtle bg-card shadow-[var(--shadow-e1)] transition-all focus-within:border-transparent focus-within:ring-2 focus-within:ring-tide"
            >
              <PromptInputTextarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ask about qualifications, sector skills, or documents..."
                aria-label="Message merSETA Extractor"
                className="min-h-[88px] px-4 pt-4 font-sans text-[15px] leading-6 text-ink-primary placeholder:text-ink-tertiary"
              />
              <PromptInputFooter className="px-3 pb-3">
                <PromptInputTools className="flex items-center gap-2">
                  <div className="sm:hidden">
                    <Seed size={22} state={seedState} />
                  </div>
                  <PromptInputButton
                    tooltip="Add document or report"
                    onClick={onAttach}
                    className="size-9 rounded-full text-ink-secondary hover:bg-ground-sunken hover:text-ink-primary"
                  >
                    <Plus className="size-5" />
                  </PromptInputButton>
                </PromptInputTools>
                <PromptInputSubmit
                  aria-label="Send message"
                  status={thinking ? "submitted" : "ready"}
                  disabled={!text.trim() || thinking}
                  className="size-9 rounded-full bg-clay text-primary-foreground shadow-[var(--shadow-e1)] transition-transform hover:bg-clay/90 active:scale-95 disabled:opacity-40"
                >
                  {!thinking && <ArrowUp className="size-5" />}
                </PromptInputSubmit>
              </PromptInputFooter>
            </PromptInput>
          </div>
        </div>
      </div>
    </div>
  );
}

function SessionView({ prompt, onAttach }: { prompt?: string; onAttach: () => void }) {
  const [thinking, setThinking] = useState(false);
  return (
    <main className="view-enter relative flex min-h-0 flex-1 flex-col">
      <div className="border-b border-line-subtle bg-card/40 px-5 py-4 sm:px-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="min-w-0">
            <p className="truncate font-semibold text-ink-primary">
              Industrial Automation Skills Report
            </p>
            <p className="text-xs text-ink-secondary">Research session · 1 document</p>
          </div>
          <IconButton
            label="Session options"
            className="text-ink-secondary hover:text-ink-primary hover:bg-ground-raised"
          >
            <MoreHorizontal />
          </IconButton>
        </div>
      </div>
      <Conversation className="min-h-0">
        <ConversationContent className="mx-auto w-full max-w-4xl gap-10 px-5 pb-40 pt-10 sm:px-8">
          {/* Human input sits on a Clay-tint surface, right-weighted */}
          <Message from="user" className="ml-auto max-w-xl">
            <div className="flex flex-col items-end">
              <span className="eyebrow mb-1.5 text-clay font-bold">You (Researcher)</span>
              <MessageContent className="rounded-2xl border border-clay/20 bg-clay-tint px-5 py-3.5 text-[15px] leading-relaxed text-ink-primary shadow-[var(--shadow-e1)]">
                {prompt ||
                  "Analyse the skills contained in this document and map them to relevant occupations."}
              </MessageContent>
            </div>
          </Message>

          {/* System output sits directly on ground.base, unboxed, in body type, with a Seed attribution mark. Boxing the AI's text makes it feel like a widget; leaving it open makes it feel like a page. */}
          <Message from="assistant" className="max-w-none">
            <div className="flex items-center gap-2.5">
              <Seed size={20} state={thinking ? "thinking" : "idle"} />
              <img src={BRAND_ASSETS.icon} alt="" className="size-4 object-contain" />
              <p className="text-xs font-semibold tracking-wide text-ink-primary">
                merSETA Extractor
              </p>
              <span className="text-[11px] text-ink-tertiary">· Grounded evidence analysis</span>
            </div>
            <MessageContent className="w-full max-w-[800px] gap-6 text-[15px] sm:text-[16px] leading-[1.65] text-ink-primary font-sans">
              <div className="space-y-4">
                <h2 className="font-serif text-2xl font-normal tracking-tight text-ink-primary">
                  Skills intelligence summary
                </h2>
                <p className="text-ink-primary">
                  The report signals a shift from routine maintenance toward{" "}
                  <strong className="font-semibold text-ink-primary">
                    integrated automation capability
                  </strong>
                  . I identified four high-confidence competency areas supported by direct evidence
                  <span
                    className="mx-1 inline-flex items-center justify-center rounded bg-tide-tint px-1.5 py-0.5 font-mono text-[11px] font-bold text-tide cursor-pointer hover:bg-tide/20"
                    title="Direct citation 1: Manufacturing Sector Skills Plan, Section 4.2"
                  >
                    1
                  </span>
                  and one emerging capability bridge{" "}
                  <span
                    className="underline decoration-ochre decoration-dotted underline-offset-4 cursor-help"
                    title="Inferred synthesis: Systems integration demand requires cross-disciplinary technicians"
                  >
                    spanning operational analytics
                  </span>
                  .
                </p>
                <h3 className="font-serif text-lg font-normal text-ink-primary pt-2">
                  Priority skills
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-ink-primary">
                  <li>
                    <strong className="font-semibold">Industrial Automation</strong> — control
                    architecture, commissioning and process optimisation
                  </li>
                  <li>
                    <strong className="font-semibold">PLC Programming</strong> — logic development,
                    diagnostics and control sequencing
                  </li>
                  <li>
                    <strong className="font-semibold">Systems Integration</strong> — connecting
                    plant systems, sensors and operational data
                  </li>
                  <li>
                    <strong className="font-semibold">Predictive Maintenance</strong> — condition
                    monitoring and failure prevention
                  </li>
                </ul>
              </div>

              {/* Priority skills cards */}
              <div className="grid gap-3 sm:grid-cols-2">
                {skills.slice(0, 4).map((skill) => (
                  <div
                    key={skill.name}
                    className="rounded-xl border border-line-subtle bg-card p-4 shadow-[var(--shadow-e1)]"
                  >
                    <div className="flex items-center justify-between">
                      <p className="eyebrow text-ink-tertiary">Identified skill</p>
                      <span className="inline-flex items-center rounded-full border border-moss/20 bg-moss-tint px-2 py-0.5 font-mono text-xs font-bold text-moss">
                        {skill.confidence}% verified
                      </span>
                    </div>
                    <p className="mt-2 font-semibold text-ink-primary">{skill.name}</p>
                    <p className="mt-1 text-xs text-ink-secondary">{skill.evidence}</p>
                  </div>
                ))}
              </div>

              {/* Provenance and Evidence Tray */}
              <div className="rounded-xl border-l-4 border-ochre bg-card p-4 shadow-[var(--shadow-e1)]">
                <div className="flex items-center gap-2">
                  <span className="inline-flex size-5 items-center justify-center rounded bg-tide-tint font-mono text-xs font-semibold text-tide">
                    1
                  </span>
                  <p className="eyebrow text-clay">Direct Evidence Citation</p>
                </div>
                <blockquote className="my-2 border-l-2 border-line-subtle pl-3 text-sm italic text-ink-primary leading-relaxed">
                  “Technicians require stronger capability in integrated control systems and
                  real-time plant diagnostics.”
                </blockquote>
                <p className="text-xs text-ink-secondary">
                  Source:{" "}
                  <span className="font-medium text-ink-primary">
                    Manufacturing Sector Skills Plan
                  </span>{" "}
                  · Page 17 · Section 4.2
                </p>
              </div>
            </MessageContent>
            <MessageActions className="opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
              <MessageAction tooltip="Copy response">
                <Copy className="size-4 text-ink-secondary" />
              </MessageAction>
              <MessageAction tooltip="Regenerate">
                <RefreshCw className="size-4 text-ink-secondary" />
              </MessageAction>
              <MessageAction tooltip="More">
                <MoreHorizontal className="size-4 text-ink-secondary" />
              </MessageAction>
            </MessageActions>
          </Message>

          {thinking && (
            <div className="flex items-center gap-3 text-sm text-tide">
              <Seed size={22} state="thinking" />
              <img src={BRAND_ASSETS.icon} alt="" className="size-4 object-contain" />
              <Shimmer className="font-medium text-tide">
                Examining evidence and mapping capabilities...
              </Shimmer>
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <Composer
        thinking={thinking}
        onAttach={onAttach}
        onSubmit={() => {
          setThinking(true);
          window.setTimeout(() => setThinking(false), 2400);
        }}
      />
    </main>
  );
}

function DocumentView() {
  const [zoom, setZoom] = useState(100);
  const [section, setSection] = useState("Skills priorities");
  const outline = [
    "Executive summary",
    "Sector context",
    "Skills priorities",
    "Occupations",
    "Recommendations",
  ];
  return (
    <main className="view-enter flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between border-b border-line-subtle bg-card/40 px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink-primary">
            Manufacturing Sector Skills Plan
          </p>
          <p className="text-xs text-ink-secondary">42 pages · PDF</p>
        </div>
        <div className="flex items-center gap-1">
          <IconButton
            label="Zoom out"
            onClick={() => setZoom(Math.max(80, zoom - 10))}
            className="text-ink-secondary hover:text-ink-primary hover:bg-ground-raised"
          >
            <ZoomOut />
          </IconButton>
          <span className="w-10 text-center font-mono text-xs text-ink-secondary">{zoom}%</span>
          <IconButton
            label="Zoom in"
            onClick={() => setZoom(Math.min(120, zoom + 10))}
            className="text-ink-secondary hover:text-ink-primary hover:bg-ground-raised"
          >
            <ZoomIn />
          </IconButton>
          <IconButton
            label="More"
            className="text-ink-secondary hover:text-ink-primary hover:bg-ground-raised"
          >
            <MoreHorizontal />
          </IconButton>
        </div>
      </div>
      <div className="grid min-h-0 flex-1 md:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="hidden border-r border-line-subtle bg-ground-sunken/40 p-4 md:block">
          <p className="eyebrow mb-4 text-ink-tertiary">Document outline</p>
          {outline.map((item) => (
            <button
              key={item}
              onClick={() => setSection(item)}
              className={cn(
                "flex w-full items-center border-l-2 px-3 py-2 text-left text-xs transition-colors rounded-r-md",
                item === section
                  ? "border-ochre bg-ground-raised font-semibold text-ink-primary shadow-[var(--shadow-e1)]"
                  : "border-transparent text-ink-secondary hover:bg-ground-raised/60 hover:text-ink-primary",
              )}
            >
              {item}
            </button>
          ))}
        </aside>
        <div className="min-h-0 overflow-y-auto bg-ground-sunken/30 p-4 pb-28 sm:p-8">
          <article
            className="mx-auto min-h-[900px] max-w-[760px] rounded-2xl border border-line-subtle bg-ground-raised px-7 py-12 text-ink-primary shadow-[var(--shadow-e2)] sm:px-14"
            style={{ maxWidth: `${(760 * zoom) / 100}px` }}
          >
            <p className="eyebrow text-clay">04 · Skills priorities</p>
            <h1 className="mt-5 font-serif text-3xl font-normal text-ink-primary sm:text-4xl">
              Advanced manufacturing capability
            </h1>
            <p className="mt-6 text-[15px] leading-relaxed text-ink-secondary">
              The sector is entering a period in which digital systems, maintenance intelligence and
              adaptable technical expertise will determine productive capacity.
            </p>
            <div className="my-8 h-px bg-line-subtle" />
            <h2 className="font-serif text-xl font-normal text-ink-primary">
              Industrial automation
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-primary">
              Employers report a growing need for technicians who can work across conventional
              mechanical systems and digitally enabled production environments.{" "}
              <mark className="rounded bg-ochre-tint px-1.5 py-0.5 text-ink-primary">
                Priority capabilities include programmable logic controllers, systems integration,
                control engineering and production data analysis.
              </mark>
            </p>
            <p className="mt-5 text-[15px] leading-relaxed text-ink-primary">
              These capabilities are increasingly linked to the occupations of Industrial Automation
              Technician, Systems Engineer and Reliability Specialist.
            </p>
            <aside className="mt-8 rounded-r-xl border-l-4 border-ochre bg-ochre-tint/20 p-4">
              <p className="eyebrow text-clay">Extraction note</p>
              <p className="mt-2 text-sm leading-6 text-ink-primary">
                Four skills and three occupational relationships identified in this passage.
              </p>
            </aside>
            <div className="mt-12 flex items-center justify-between border-t border-line-subtle pt-4 text-xs text-ink-tertiary">
              <span>Manufacturing Sector Skills Plan</span>
              <span className="font-mono">Page 17</span>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}

function KnowledgeView({ onView }: { onView: (v: WorkspaceView) => void }) {
  return (
    <main className="view-enter mx-auto w-full max-w-6xl px-5 pb-28 pt-10 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <Eyebrow>Structured knowledge</Eyebrow>
          <h1 className="mt-3 font-serif text-3xl font-normal text-ink-primary sm:text-4xl">
            Extraction complete
          </h1>
          <p className="mt-3 text-sm text-ink-secondary">
            Manufacturing Sector Skills Plan · processed moments ago
          </p>
        </div>
        <Button
          variant="outline"
          className="rounded-full border-line-strong text-ink-primary hover:bg-ground-raised shadow-[var(--shadow-e1)]"
          onClick={() => onView("document")}
        >
          <BookOpen className="size-4 text-clay" /> Open document
        </Button>
      </div>
      <section className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,.7fr)]">
        <div>
          <div className="border-y border-line-subtle py-6">
            <p className="eyebrow text-ink-tertiary">Document overview</p>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-primary">
              A sector-wide analysis of advanced manufacturing demand, highlighting automation,
              maintenance and systems integration as priority capability clusters.
            </p>
          </div>
          <h2 className="mt-10 font-serif text-2xl font-normal text-ink-primary">
            Identified skills
          </h2>
          <div className="mt-4 divide-y divide-line-subtle border-y border-line-subtle">
            {skills.map((skill) => (
              <button
                key={skill.name}
                onClick={() => onView("skills")}
                className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-5 rounded-xl px-3 py-5 text-left transition-colors hover:bg-ground-raised"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-ink-primary">{skill.name}</p>
                  <p className="mt-1 text-xs text-ink-secondary">Evidence · {skill.evidence}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-bold text-moss">{skill.confidence}%</p>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-ink-tertiary">
                    Confidence
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
        <aside>
          <KnowledgeGroup
            label="Competencies"
            items={["Control architecture", "Fault diagnostics", "Process optimisation"]}
          />
          <KnowledgeGroup label="Occupations" items={occupations.slice(0, 3)} />
          <KnowledgeGroup label="Technologies" items={["SCADA", "PLC", "Industrial IoT"]} tone />
        </aside>
      </section>
    </main>
  );
}

function KnowledgeGroup({
  label,
  items,
  tone = false,
}: {
  label: string;
  items: string[];
  tone?: boolean;
}) {
  return (
    <section className="mb-8 border-t border-line-subtle pt-5">
      <p className="eyebrow text-ink-tertiary">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs transition-colors",
              tone
                ? "border-tide/20 bg-tide-tint text-tide font-medium"
                : "border-line-subtle bg-card text-ink-primary shadow-[var(--shadow-e1)]",
            )}
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}

function SkillsView() {
  const [selected, setSelected] = useState(skills[0]);
  return (
    <main className="view-enter mx-auto w-full max-w-6xl px-5 pb-28 pt-10 sm:px-8">
      <Eyebrow>Skills intelligence</Eyebrow>
      <h1 className="mt-3 font-serif text-3xl font-normal text-ink-primary sm:text-4xl">
        Capability map
      </h1>
      <div className="mt-10 grid gap-10 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="divide-y divide-line-subtle border-y border-line-subtle">
          {skills.map((skill) => (
            <button
              key={skill.name}
              onClick={() => setSelected(skill)}
              className={cn(
                "grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-3 py-5 text-left transition-colors rounded-xl",
                selected?.name === skill.name
                  ? "border-l-3 border-ochre bg-ground-raised text-ink-primary shadow-[var(--shadow-e1)]"
                  : "text-ink-secondary hover:bg-ground-raised/60 hover:text-ink-primary",
              )}
            >
              <span className="truncate text-sm font-semibold">{skill.name}</span>
              <span className="font-mono text-xs font-bold text-moss">{skill.confidence}%</span>
            </button>
          ))}
        </div>
        <article>
          <p className="eyebrow text-clay">Identified skill</p>
          <h2 className="mt-4 font-serif text-3xl font-normal text-ink-primary sm:text-4xl">
            {selected?.name}
          </h2>
          <div className="mt-8 flex items-end justify-between border-b border-line-subtle pb-5">
            <span className="text-sm text-ink-secondary">Confidence score</span>
            <span className="font-mono text-3xl font-semibold text-moss">
              {selected?.confidence}%
            </span>
          </div>
          <section className="mt-8">
            <p className="eyebrow text-ink-tertiary">Related capabilities</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {["PLC Programming", "Systems Integration", "SCADA", "Control Systems"].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-line-subtle bg-card px-4 py-4 text-sm text-ink-primary shadow-[var(--shadow-e1)]"
                  >
                    <span className="size-2 rounded-full bg-ochre" />
                    {item}
                  </div>
                ),
              )}
            </div>
          </section>
          <section className="mt-9 rounded-r-2xl border-l-4 border-ochre bg-card p-5 shadow-[var(--shadow-e1)]">
            <p className="eyebrow text-clay">Direct Evidence</p>
            <p className="mt-3 font-semibold text-ink-primary">
              3 references found in sector documentation
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
              The strongest reference appears in the advanced manufacturing capability section.
            </p>
            <button className="mt-4 flex items-center gap-2 text-xs font-semibold text-tide hover:underline">
              Open {selected?.evidence} <ArrowRight className="size-3" />
            </button>
          </section>
        </article>
      </div>
    </main>
  );
}

function SettingsView({ dark, onDark }: { dark: boolean; onDark: () => void }) {
  const [category, setCategory] = useState("General");
  const cats = [
    "General",
    "Appearance",
    "Language",
    "Workspace",
    "AI",
    "Documents",
    "Privacy",
    "About",
  ];
  return (
    <main className="view-enter mx-auto w-full max-w-6xl px-5 pb-24 pt-10 sm:px-8">
      <Eyebrow>Preferences</Eyebrow>
      <h1 className="mt-3 font-serif text-3xl font-normal text-ink-primary sm:text-4xl">
        Settings
      </h1>
      <div className="mt-10 grid gap-8 md:grid-cols-[200px_minmax(0,1fr)]">
        <nav className="flex gap-1 overflow-x-auto border-b border-line-subtle pb-3 md:block md:border-b-0 md:border-r md:pb-0 md:pr-5">
          {cats.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "shrink-0 rounded-lg px-3 py-2 text-left text-sm transition-colors md:w-full",
                cat === category
                  ? "border border-line-subtle bg-ground-raised font-semibold text-ink-primary shadow-[var(--shadow-e1)]"
                  : "text-ink-secondary hover:bg-ground-raised/60 hover:text-ink-primary",
              )}
            >
              {cat}
            </button>
          ))}
        </nav>
        <section className="max-w-2xl">
          <h2 className="font-serif text-2xl font-normal text-ink-primary">{category}</h2>
          <p className="mt-2 text-sm text-ink-secondary">
            Manage how merSETA Extractor behaves in this workspace.
          </p>
          <div className="mt-8 divide-y divide-line-subtle border-y border-line-subtle">
            <SettingRow
              title="Night workspace"
              description="Use the deliberate LOAM dark theme (night soil)."
            >
              <Switch checked={dark} onCheckedChange={onDark} aria-label="Toggle night workspace" />
            </SettingRow>
            <SettingRow
              title="Response detail"
              description="Control how much supporting evidence appears by default."
            >
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg border-line-strong text-ink-primary"
              >
                Balanced <ChevronDown />
              </Button>
            </SettingRow>
            <SettingRow
              title="Default extraction"
              description="Identify skills, occupations, qualifications and technologies."
            >
              <Switch defaultChecked aria-label="Toggle default extraction" />
            </SettingRow>
            <SettingRow
              title="Document handling"
              description="Keep uploaded files available in the current workspace."
            >
              <Switch defaultChecked aria-label="Toggle document handling" />
            </SettingRow>
          </div>
          {category === "About" && (
            <div className="mt-10 border-t border-line-subtle pt-8">
              <img
                src={BRAND_ASSETS.lockup}
                alt="merSETA Extractor — AI Workspace"
                className="h-auto w-full max-w-md object-contain dark:rounded-xl dark:bg-ground-raised dark:p-3"
              />
              <p className="mt-6 text-sm font-semibold text-ink-primary">
                Wits × merSETA · Darkroom Initiative
              </p>
              <div className="mt-4 rounded-xl border border-line-subtle bg-card p-4 shadow-[var(--shadow-e1)]">
                <p className="text-xs font-semibold text-clay">Design Language: LOAM</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-secondary">
                  A universal, earth-grounded, humanist system. Soil, clay, moss, stone, water.
                  Built so people feel accompanied, not managed. Zero performed sentience.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function SettingRow({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-5 py-5">
      <div>
        <p className="text-sm font-semibold text-ink-primary">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-ink-secondary">{description}</p>
      </div>
      {children}
    </div>
  );
}

function SearchCommand({
  open,
  onOpen,
  onView,
}: {
  open: boolean;
  onOpen: (v: boolean) => void;
  onView: (v: WorkspaceView) => void;
}) {
  const groups = [
    { label: "Recent", items: recentItems, icon: FileText, view: "session" as WorkspaceView },
    {
      label: "Skills",
      items: skills.slice(0, 3).map((s) => s.name),
      icon: Gauge,
      view: "skills" as WorkspaceView,
    },
  ];
  return (
    <Dialog open={open} onOpenChange={onOpen}>
      <DialogContent className="top-[18%] translate-y-0 gap-0 overflow-hidden rounded-2xl border border-line-subtle bg-card p-0 shadow-[var(--shadow-e3)] sm:max-w-xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Search workspace</DialogTitle>
          <DialogDescription>Search documents, sessions and skills.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-3 border-b border-line-subtle px-4">
          <Search className="size-4 text-ink-tertiary" />
          <input
            autoFocus
            className="h-14 min-w-0 flex-1 bg-transparent text-sm text-ink-primary outline-none placeholder:text-ink-tertiary font-sans"
            placeholder="Search documents, sessions, skills..."
          />
          <kbd className="rounded border border-line-subtle bg-ground-raised px-1.5 py-0.5 text-[10px] font-mono text-ink-tertiary">
            ESC
          </kbd>
        </div>
        <div className="max-h-[420px] overflow-y-auto p-2">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="eyebrow px-3 pb-2 pt-4 text-ink-tertiary">{group.label}</p>
              {group.items.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    onView(group.view);
                    onOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-ink-primary hover:bg-ground-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tide transition-colors"
                >
                  <group.icon className="size-4 text-ink-tertiary" />
                  <span className="flex-1 font-medium">{item}</span>
                  <ChevronRight className="size-3 text-ink-tertiary" />
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="flex gap-4 border-t border-line-subtle px-4 py-3 text-[10px] font-mono text-ink-tertiary">
          <span>↑↓ Navigate</span>
          <span>↵ Open</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const titles: Record<WorkspaceView, string> = {
  welcome: "Workspace",
  session: "Research session",
  upload: "Add document",
  processing: "Document extraction",
  document: "Document reader",
  knowledge: "Extracted knowledge",
  skills: "Skills intelligence",
  settings: "Settings",
};

export function MersetaWorkspace() {
  const [view, setView] = useState<WorkspaceView>("welcome");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    return () => document.documentElement.classList.remove("dark");
  }, [dark]);
  const [prompt, setPrompt] = useState("");
  const sidebarWidth = collapsed ? "4rem" : "15.5rem";
  const content = useMemo(() => {
    switch (view) {
      case "welcome":
        return (
          <WelcomeView
            onView={setView}
            onSubmit={(text) => {
              setPrompt(text);
              setView("session");
            }}
          />
        );
      case "upload":
        return <UploadView onView={setView} />;
      case "processing":
        return <ProcessingView onView={setView} />;
      case "session":
        return <SessionView prompt={prompt} onAttach={() => setView("upload")} />;
      case "document":
        return <DocumentView />;
      case "knowledge":
        return <KnowledgeView onView={setView} />;
      case "skills":
        return <SkillsView />;
      case "settings":
        return <SettingsView dark={dark} onDark={() => setDark((v) => !v)} />;
    }
  }, [view, dark, prompt]);
  return (
    <TooltipProvider delayDuration={400}>
      <div
        className="flex h-dvh w-full overflow-hidden bg-background text-foreground"
        style={{ "--app-sidebar-width": sidebarWidth } as React.CSSProperties}
      >
        <div className="hidden shrink-0 md:block">
          <AppSidebar
            collapsed={collapsed}
            view={view}
            onView={setView}
            onCollapse={() => setCollapsed((v) => !v)}
            onSearch={() => setSearchOpen(true)}
          />
        </div>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-[286px] p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation</SheetTitle>
              <SheetDescription>merSETA Extractor workspace navigation</SheetDescription>
            </SheetHeader>
            <AppSidebar
              mobile
              collapsed={false}
              view={view}
              onView={(v) => {
                setView(v);
                setMobileOpen(false);
              }}
              onCollapse={() => undefined}
              onSearch={() => {
                setSearchOpen(true);
                setMobileOpen(false);
              }}
            />
          </SheetContent>
        </Sheet>
        <div className="flex min-w-0 flex-1 flex-col">
          <AppHeader
            title={titles[view]}
            dark={dark}
            onDark={() => setDark((v) => !v)}
            onMenu={() => setMobileOpen(true)}
            onSearch={() => setSearchOpen(true)}
          />
          <div className="min-h-0 flex-1 overflow-y-auto">{content}</div>
        </div>
        <SearchCommand open={searchOpen} onOpen={setSearchOpen} onView={setView} />
      </div>
    </TooltipProvider>
  );
}
