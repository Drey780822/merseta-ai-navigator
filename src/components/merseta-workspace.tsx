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
import logoIcon from "@/assets/merseta-extractor-icon.png.asset.json";
import logoLockup from "@/assets/merseta-extractor-lockup.png.asset.json";
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
      <img src={logoIcon.url} alt="merSETA Extractor" className="size-6 shrink-0 object-contain" />
      {!compact && (
        <div className="min-w-0 leading-none">
          <p className="truncate text-sm font-semibold text-foreground">merSETA Extractor</p>
        </div>
      )}
    </div>
  );
}

function InstitutionalMarks({ compact = false }: { compact?: boolean }) {
  if (compact) return null;
  return (
    <div
      className="flex h-7 items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.13em] text-muted-foreground"
      aria-label="Wits and merSETA partnership"
    >
      <span>Wits</span>
      <span className="h-4 w-px bg-border" />
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
        "flex h-full flex-col bg-muted/60 editorial-transition",
        slim ? "w-16" : "w-[248px]",
      )}
    >
      <div className="flex h-16 items-center justify-between px-3">
        <ProductMark compact={slim} />
        {!mobile && (
          <IconButton
            label={slim ? "Expand sidebar" : "Collapse sidebar"}
            onClick={onCollapse}
            className="size-8 text-muted-foreground"
          >
            {slim ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          </IconButton>
        )}
      </div>
      <nav className="min-h-0 flex-1 overflow-y-auto px-2 pt-2" aria-label="Primary navigation">
        <Button
          variant="ghost"
          className={cn(
            "mb-1 h-10 w-full justify-start gap-3 font-normal",
            slim && "justify-center px-0",
          )}
          onClick={() => onView("welcome")}
          aria-label="New session"
        >
          <Plus className="size-4" />
          {!slim && "New session"}
        </Button>
        <Button
          variant="ghost"
          onClick={onSearch}
          aria-label="Search"
          className={cn(
            "mb-5 h-10 w-full justify-start gap-3 font-normal text-muted-foreground",
            slim && "justify-center px-0",
          )}
        >
          <Search className="size-4" />
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
                "h-10 w-full justify-start gap-3 font-normal text-muted-foreground",
                active && "bg-secondary text-foreground",
                slim && "justify-center px-0",
              )}
            >
              <item.icon className="size-4 shrink-0" />
              {!slim && <span className="truncate">{item.label}</span>}
            </Button>
          );
        })}
        {!slim && (
          <div className="mt-8">
            <p className="mb-2 px-3 text-xs text-muted-foreground">Recent sessions</p>
            {recentItems.map((item) => (
              <Button
                variant="ghost"
                key={item}
                onClick={() => onView("session")}
                className="h-10 w-full justify-start px-3 text-left text-[13px] font-normal text-foreground"
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
            "h-10 w-full justify-start gap-3 font-normal text-muted-foreground",
            slim && "justify-center px-0",
          )}
        >
          <Settings className="size-4" />
          {!slim && "Settings"}
        </Button>
        <div className={cn("flex items-center gap-3 px-3 py-3", slim && "justify-center px-0")}>
          <div className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
            TD
          </div>
          {!slim && <p className="truncate text-[13px]">Tshepang Dikotope</p>}
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
    <header className="flex h-16 shrink-0 items-center gap-2 bg-background px-3 sm:px-5">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenu}
        aria-label="Open navigation"
      >
        <Menu />
      </Button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-muted-foreground">
          {title === "Workspace" || title === "Research session" ? "merSETA Extractor" : title}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <IconButton label="Search workspace" onClick={onSearch}>
          <Search />
        </IconButton>
        <IconButton label={dark ? "Use light mode" : "Use dark mode"} onClick={onDark}>
          {dark ? <Sun /> : <Moon />}
        </IconButton>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open profile menu">
              <div className="grid size-7 place-items-center rounded-full border border-border bg-card text-[10px] font-bold">
                TD
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="text-sm">Tshepang Dikotope</p>
              <p className="font-normal text-muted-foreground">Research workspace</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserRound /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings /> Preferences
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <CircleHelp /> Help centre
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow text-amber">{children}</p>;
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
        <div className="mb-7 flex justify-center">
          <img src={logoIcon.url} alt="" className="size-10 object-contain" />
        </div>
        <h1 className="text-center text-2xl font-medium leading-8 text-foreground">
          How can I help you today?
        </h1>
        <p className="mx-auto mt-3 max-w-[360px] text-center text-sm leading-6 text-muted-foreground">
          Explore skills, understand a report, or ask about your documents.
        </p>
        <div className="mt-8 hidden md:block">
          <Composer inline onSubmit={onSubmit} onAttach={() => onView("upload")} />
        </div>
        <div className="mt-5 hidden items-center justify-center gap-2 md:flex">
          <Button
            variant="ghost"
            size="sm"
            className="font-normal text-muted-foreground"
            onClick={() => onView("upload")}
          >
            <FileText className="size-4" />
            Analyze a report
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="font-normal text-muted-foreground"
            onClick={() => onView("skills")}
          >
            <Gauge className="size-4" />
            Explore skills
          </Button>
        </div>
      </div>
      <div className="mx-auto w-full max-w-[680px] md:hidden">
        <Composer inline onSubmit={onSubmit} onAttach={() => onView("upload")} />
        <div className="mt-3 flex flex-wrap justify-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="font-normal text-muted-foreground"
            onClick={() => onView("upload")}
          >
            Analyze a report
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="font-normal text-muted-foreground"
            onClick={() => onView("skills")}
          >
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
      <h1 className="mt-4 text-3xl font-medium text-foreground">Add a document</h1>
      <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
        Bring a report into the workspace to inspect its structure and reveal skills intelligence.
      </p>
      <div
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={cn(
          "mt-14 flex min-h-72 flex-col items-center justify-center border bg-card px-6 text-center editorial-transition",
          dragging ? "border-navy ring-1 ring-gold" : "border-border hover:border-navy",
        )}
      >
        <div
          className={cn(
            "mb-6 grid size-11 place-items-center rounded-md border border-border text-navy dark:text-gold",
            dragging && "border-gold bg-accent",
          )}
        >
          <Upload className="size-5" />
        </div>
        <h2 className="text-xl font-semibold">
          {dragging ? "Release to add document" : "Drop a file here or browse"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">PDF · DOCX · CSV · TXT · up to 20 MB</p>
        <Button className="mt-7" onClick={() => onView("processing")}>
          <Plus /> Add document
        </Button>
      </div>
      <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
        <div>
          <p className="text-sm font-semibold">Need to test an exception?</p>
          <p className="text-xs text-muted-foreground">
            Preview a calm, recoverable failure state.
          </p>
        </div>
        <Button variant="ghost" onClick={() => setFailed(!failed)}>
          Toggle error
        </Button>
      </div>
      {failed && (
        <div className="mt-5 border-l-2 border-amber bg-card px-5 py-4">
          <p className="font-semibold">Something interrupted the process.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            The document is still available. You can try again.
          </p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => setFailed(false)}>
            <RefreshCw /> Try again
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
        <h1 className="mt-4 text-3xl font-medium sm:text-4xl">Manufacturing Sector Skills Plan</h1>
        <div className="mt-12 grid grid-cols-4 gap-2" aria-label="Extraction progress">
          {stages.map((name, i) => (
            <div key={name}>
              <div
                className={cn(
                  "h-0.5 bg-border",
                  i <= step && "bg-gold",
                  i === step && "quiet-line",
                )}
              />
              <p
                className={cn(
                  "mt-3 text-xs",
                  i <= step ? "font-semibold text-foreground" : "text-muted-foreground",
                )}
              >
                {i < step ? <Check className="mr-1 inline size-3 text-verified" /> : null}
                {name}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-16 border-y border-border py-8">
          <Shimmer
            className="text-base font-semibold"
            children={
              step < 3
                ? (["Preparing document", "Reading content", "Building skill map"][step] ??
                  "Reading content")
                : "Structured knowledge ready"
            }
          />
          <p className="mt-2 text-sm text-muted-foreground">
            {step < 3
              ? "Mapping language, evidence and occupational relationships."
              : "32 skills and 14 occupations were identified."}
          </p>
        </div>
        {step === 3 && (
          <Button className="mt-8" onClick={() => onView("knowledge")}>
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
  return (
    <div
      className={
        inline
          ? "w-full"
          : "pointer-events-none fixed inset-x-0 bottom-0 z-20 bg-background px-4 pb-4 md:left-[var(--app-sidebar-width)] sm:px-6 sm:pb-5"
      }
    >
      <div className="pointer-events-auto mx-auto max-w-[760px]">
        <PromptInput
          onSubmit={(message) => {
            const value = message.text.trim();
            if (value) {
              onSubmit?.(value);
              setText("");
              textareaRef.current?.focus();
            }
          }}
          className="rounded-lg border-border bg-card shadow-none"
        >
          <PromptInputTextarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Message merSETA Extractor..."
            aria-label="Message merSETA Extractor"
            className="min-h-[88px] px-4 pt-4 text-[15px] leading-6"
          />
          <PromptInputFooter className="px-3 pb-3">
            <PromptInputTools>
              <PromptInputButton
                tooltip="Add document"
                onClick={onAttach}
                className="size-9 text-muted-foreground"
              >
                <Plus className="size-5" />
              </PromptInputButton>
            </PromptInputTools>
            <PromptInputSubmit
              aria-label="Send message"
              status={thinking ? "submitted" : "ready"}
              disabled={!text.trim() || thinking}
              className="size-9 rounded-md bg-primary text-primary-foreground shadow-none"
            >
              {!thinking && <ArrowUp className="size-5" />}
            </PromptInputSubmit>
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}

function SessionView({ prompt, onAttach }: { prompt?: string; onAttach: () => void }) {
  const [thinking, setThinking] = useState(false);
  return (
    <main className="view-enter relative flex min-h-0 flex-1 flex-col">
      <div className="border-b border-border px-5 py-4 sm:px-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="min-w-0">
            <p className="truncate font-semibold">Industrial Automation Skills Report</p>
            <p className="text-xs text-muted-foreground">Research session · 1 document</p>
          </div>
          <IconButton label="Session options">
            <MoreHorizontal />
          </IconButton>
        </div>
      </div>
      <Conversation className="min-h-0">
        <ConversationContent className="mx-auto w-full max-w-4xl gap-12 px-5 pb-40 pt-10 sm:px-8">
          <Message from="user" className="max-w-xl">
            <p className="eyebrow text-muted-foreground">You</p>
            <MessageContent className="rounded-md bg-secondary px-4 py-3">
              {prompt ||
                "Analyse the skills contained in this document and map them to relevant occupations."}
            </MessageContent>
          </Message>
          <Message from="assistant" className="max-w-none">
            <div className="flex items-center gap-2">
              <img src={logoIcon.url} alt="" className="size-6 object-contain" />
              <p className="text-xs font-bold">merSETA Extractor</p>
            </div>
            <MessageContent className="w-full max-w-[800px] gap-5 text-[15px] leading-7">
              <MessageResponse>{`## Skills intelligence summary

The report signals a shift from routine maintenance toward **integrated automation capability**. I identified four high-confidence competency areas supported by direct evidence.

### Priority skills

- **Industrial Automation** — control architecture, commissioning and process optimisation
- **PLC Programming** — logic development, diagnostics and control sequencing
- **Systems Integration** — connecting plant systems, sensors and operational data
- **Predictive Maintenance** — condition monitoring and failure prevention`}</MessageResponse>
              <div className="grid gap-px border-y border-border bg-border sm:grid-cols-2">
                {skills.slice(0, 4).map((skill) => (
                  <div key={skill.name} className="bg-background px-4 py-4">
                    <p className="eyebrow text-muted-foreground">Identified skill</p>
                    <p className="mt-2 font-semibold">{skill.name}</p>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Confidence</span>
                      <span className="font-bold text-verified">{skill.confidence}%</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-l-2 border-gold bg-card px-5 py-4">
                <p className="eyebrow text-amber">Evidence</p>
                <p className="mt-2 text-sm">
                  “Technicians require stronger capability in integrated control systems and
                  real-time plant diagnostics.”
                </p>
                <p className="mt-2 text-xs text-muted-foreground">Page 17 · Section 4.2</p>
              </div>
            </MessageContent>
            <MessageActions className="opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
              <MessageAction tooltip="Copy response">
                <Copy />
              </MessageAction>
              <MessageAction tooltip="Regenerate">
                <RefreshCw />
              </MessageAction>
              <MessageAction tooltip="More">
                <MoreHorizontal />
              </MessageAction>
            </MessageActions>
          </Message>
          {thinking && (
            <div className="flex items-center gap-3 text-sm">
              <img src={logoIcon.url} alt="" className="size-6 object-contain" />
              <Shimmer>Examining evidence...</Shimmer>
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
      <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">Manufacturing Sector Skills Plan</p>
          <p className="text-xs text-muted-foreground">42 pages · PDF</p>
        </div>
        <div className="flex items-center gap-1">
          <IconButton label="Zoom out" onClick={() => setZoom(Math.max(80, zoom - 10))}>
            <ZoomOut />
          </IconButton>
          <span className="w-10 text-center text-xs text-muted-foreground">{zoom}%</span>
          <IconButton label="Zoom in" onClick={() => setZoom(Math.min(120, zoom + 10))}>
            <ZoomIn />
          </IconButton>
          <IconButton label="More">
            <MoreHorizontal />
          </IconButton>
        </div>
      </div>
      <div className="grid min-h-0 flex-1 md:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="hidden border-r border-border bg-card p-4 md:block">
          <p className="eyebrow mb-4 text-muted-foreground">Document outline</p>
          {outline.map((item) => (
            <button
              key={item}
              onClick={() => setSection(item)}
              className={cn(
                "flex w-full items-center border-l px-3 py-2 text-left text-xs text-muted-foreground",
                item === section && "border-gold font-semibold text-foreground",
              )}
            >
              {item}
            </button>
          ))}
        </aside>
        <div className="min-h-0 overflow-y-auto bg-mist p-4 pb-28 sm:p-8">
          <article
            className="mx-auto min-h-[900px] max-w-[760px] border border-border bg-paper px-7 py-12 text-ink shadow-[0_1px_5px_color-mix(in_oklab,var(--navy)_6%,transparent)] sm:px-14"
            style={{ maxWidth: `${(760 * zoom) / 100}px` }}
          >
            <p className="eyebrow text-amber">04 · Skills priorities</p>
            <h1 className="mt-5 text-3xl font-medium text-navy-dark sm:text-4xl">
              Advanced manufacturing capability
            </h1>
            <p className="mt-6 text-[15px] leading-8 text-muted-foreground">
              The sector is entering a period in which digital systems, maintenance intelligence and
              adaptable technical expertise will determine productive capacity.
            </p>
            <div className="my-8 h-px bg-line" />
            <h2 className="text-xl font-semibold text-navy-dark">Industrial automation</h2>
            <p className="mt-4 text-[15px] leading-8">
              Employers report a growing need for technicians who can work across conventional
              mechanical systems and digitally enabled production environments.{" "}
              <mark className="bg-gold-light/60 text-ink">
                Priority capabilities include programmable logic controllers, systems integration,
                control engineering and production data analysis.
              </mark>
            </p>
            <p className="mt-5 text-[15px] leading-8">
              These capabilities are increasingly linked to the occupations of Industrial Automation
              Technician, Systems Engineer and Reliability Specialist.
            </p>
            <aside className="mt-8 border-l-2 border-gold pl-5">
              <p className="eyebrow text-amber">Extraction note</p>
              <p className="mt-2 text-sm leading-6">
                Four skills and three occupational relationships identified in this passage.
              </p>
            </aside>
            <div className="mt-12 flex items-center justify-between border-t border-line pt-4 text-xs text-muted-foreground">
              <span>Manufacturing Sector Skills Plan</span>
              <span>17</span>
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
          <h1 className="mt-3 text-3xl font-medium">Extraction complete</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Manufacturing Sector Skills Plan · processed moments ago
          </p>
        </div>
        <Button variant="outline" onClick={() => onView("document")}>
          <BookOpen /> Open document
        </Button>
      </div>
      <section className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,.7fr)]">
        <div>
          <div className="border-y border-border py-6">
            <p className="eyebrow text-muted-foreground">Document overview</p>
            <p className="mt-4 max-w-2xl text-lg leading-8">
              A sector-wide analysis of advanced manufacturing demand, highlighting automation,
              maintenance and systems integration as priority capability clusters.
            </p>
          </div>
          <h2 className="mt-10 text-xl font-semibold">Identified skills</h2>
          <div className="mt-4 divide-y divide-border border-y border-border">
            {skills.map((skill) => (
              <button
                key={skill.name}
                onClick={() => onView("skills")}
                className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-5 py-5 text-left hover:bg-muted/60"
              >
                <div className="min-w-0">
                  <p className="font-semibold">{skill.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Evidence · {skill.evidence}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-verified">{skill.confidence}%</p>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
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
    <section className="mb-8 border-t border-border pt-5">
      <p className="eyebrow text-muted-foreground">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className={cn(
              "rounded-full border border-border px-3 py-1.5 text-xs",
              tone ? "border-gold/50 bg-accent text-amber-dark dark:text-gold-light" : "bg-card",
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
      <h1 className="mt-3 text-3xl font-medium">Capability map</h1>
      <div className="mt-10 grid gap-10 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="divide-y divide-border border-y border-border">
          {skills.map((skill) => (
            <button
              key={skill.name}
              onClick={() => setSelected(skill)}
              className={cn(
                "grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-3 py-5 text-left",
                selected?.name === skill.name && "border-l-2 border-gold bg-muted",
              )}
            >
              <span className="truncate text-sm font-semibold">{skill.name}</span>
              <span className="text-xs font-bold text-verified">{skill.confidence}%</span>
            </button>
          ))}
        </div>
        <article>
          <p className="eyebrow text-amber">Identified skill</p>
          <h2 className="mt-4 text-3xl font-medium sm:text-4xl">{selected?.name}</h2>
          <div className="mt-8 flex items-end justify-between border-b border-border pb-5">
            <span className="text-sm text-muted-foreground">Confidence</span>
            <span className="text-3xl font-semibold text-verified">{selected?.confidence}%</span>
          </div>
          <section className="mt-8">
            <p className="eyebrow text-muted-foreground">Related capabilities</p>
            <div className="mt-4 grid gap-px bg-border sm:grid-cols-2">
              {["PLC Programming", "Systems Integration", "SCADA", "Control Systems"].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 bg-background px-4 py-4 text-sm"
                  >
                    <span className="size-1.5 rounded-full bg-gold" />
                    {item}
                  </div>
                ),
              )}
            </div>
          </section>
          <section className="mt-9 border-l-2 border-gold bg-card px-5 py-5">
            <p className="eyebrow text-amber">Evidence</p>
            <p className="mt-3 font-semibold">3 references found</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              The strongest reference appears in the advanced manufacturing capability section.
            </p>
            <button className="mt-4 flex items-center gap-2 text-xs font-semibold text-navy dark:text-gold">
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
      <h1 className="mt-3 text-3xl font-medium">Settings</h1>
      <div className="mt-10 grid gap-8 md:grid-cols-[200px_minmax(0,1fr)]">
        <nav className="flex gap-1 overflow-x-auto border-b border-border pb-3 md:block md:border-b-0 md:border-r md:pb-0 md:pr-5">
          {cats.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "shrink-0 rounded-md px-3 py-2 text-left text-sm text-muted-foreground md:w-full",
                cat === category && "bg-muted font-semibold text-foreground",
              )}
            >
              {cat}
            </button>
          ))}
        </nav>
        <section className="max-w-2xl">
          <h2 className="text-2xl font-semibold">{category}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage how merSETA Extractor behaves in this workspace.
          </p>
          <div className="mt-8 divide-y divide-border border-y border-border">
            <SettingRow
              title="Night workspace"
              description="Use the deliberate dark research theme."
            >
              <Switch checked={dark} onCheckedChange={onDark} aria-label="Toggle night workspace" />
            </SettingRow>
            <SettingRow
              title="Response detail"
              description="Control how much supporting evidence appears by default."
            >
              <Button variant="outline" size="sm">
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
            <div className="mt-10 border-t border-border pt-8">
              <img
                src={logoLockup.url}
                alt="merSETA Extractor — AI Workspace"
                className="h-auto w-full max-w-md object-contain dark:rounded-md dark:bg-paper dark:p-3"
              />
              <p className="mt-6 text-sm text-muted-foreground">
                Wits × merSETA · Darkroom Initiative
              </p>
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
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
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
      <DialogContent className="top-[18%] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Search workspace</DialogTitle>
          <DialogDescription>Search documents, sessions and skills.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="size-4 text-muted-foreground" />
          <input
            autoFocus
            className="h-14 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            placeholder="Search documents, sessions, skills..."
          />
          <kbd className="text-[10px] text-muted-foreground">ESC</kbd>
        </div>
        <div className="max-h-[420px] overflow-y-auto p-2">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="eyebrow px-3 pb-2 pt-4 text-muted-foreground">{group.label}</p>
              {group.items.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    onView(group.view);
                    onOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <group.icon className="size-4 text-muted-foreground" />
                  <span className="flex-1">{item}</span>
                  <ChevronRight className="size-3 text-muted-foreground" />
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="flex gap-4 border-t border-border px-4 py-3 text-[10px] text-muted-foreground">
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
