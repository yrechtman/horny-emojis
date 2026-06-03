"use client";

import {
  Clipboard,
  Flame,
  Loader2,
  MessageSquareText,
  RefreshCcw,
  Scissors,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { type ComponentType, type SVGProps, useState } from "react";

import {
  INTENSITIES,
  LENGTHS,
  MODES,
  type GenerateRequest,
  type GenerateResponse,
  type GeneratorFields,
  type Intensity,
  type Length,
  type Mode,
} from "@/lib/generator-types";

const emptyFields: GeneratorFields = {
  eventType: "",
  dateTime: "",
  venue: "",
  location: "",
  occasion: "",
  people: "",
  foodDrinks: "",
  insideJokes: "",
  ownJokes: "",
  avoidJokes: "",
};

const modeLabels: Record<Mode, string> = {
  full: "Sendable",
  brainstorm: "Bullets",
  emojify: "Punch Up",
  variants: "4 Takes",
};

const iterationActions: Array<{
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  request: string;
}> = [
  {
    label: "Hornier",
    icon: Flame,
    request:
      "Revise the current output to be hornier, more pun-dense, and more committed while keeping the logistics intact.",
  },
  {
    label: "Shorter",
    icon: Scissors,
    request:
      "Revise the current output to be shorter and tighter while preserving the best jokes.",
  },
  {
    label: "Gloss",
    icon: Sparkles,
    request:
      "Revise the current output with more emojis, more visual rhythm, and more chaotic group-chat texture.",
  },
  {
    label: "Reroll",
    icon: RefreshCcw,
    request:
      "Rewrite the current output from a fresh angle with new puns and a stronger closing refrain.",
  },
];

function clsx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function GeneratorApp() {
  const [contextDump, setContextDump] = useState("");
  const [mode, setMode] = useState<Mode>("full");
  const [intensity, setIntensity] = useState<Intensity>("unhinged");
  const [length, setLength] = useState<Length>("medium");
  const [includeLogistics, setIncludeLogistics] = useState(true);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loadingLabel, setLoadingLabel] = useState("");
  const [copied, setCopied] = useState(false);

  async function generate(revisionRequest?: string) {
    setError("");
    setCopied(false);
    setLoadingLabel(revisionRequest ? "Remixing" : "Hornifying");

    const payload: GenerateRequest = {
      mode,
      intensity,
      length,
      includeLogistics,
      fields: emptyFields,
      draft: contextDump,
      existingOutput: revisionRequest ? output : "",
      revisionRequest,
    };

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as Partial<GenerateResponse> & {
        error?: string;
      };

      if (!response.ok || !data.text) {
        throw new Error(data.error || "No text came back.");
      }

      setOutput(data.text);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something broke.");
    } finally {
      setLoadingLabel("");
    }
  }

  async function copyOutput() {
    if (!output) return;

    await navigator.clipboard.writeText(output);
    setCopied(true);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="soft-focus-bg" aria-hidden="true" />
      <div className="pointer-events-none fixed inset-0 bg-black/20" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <div className="aqua-menubar flex h-8 items-center justify-between px-3 text-[13px] font-semibold text-black/80">
          <div className="flex min-w-0 items-center gap-4">
            <span className="font-black">Hornify</span>
            <span className="hidden sm:inline">File</span>
            <span className="hidden sm:inline">Edit</span>
            <span className="hidden sm:inline">Special</span>
          </div>
          <span className="font-mono text-xs">💿 9:41 PM</span>
        </div>

        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
          <header className="grid gap-5 rounded-[28px] border border-white/35 bg-black/20 p-5 text-white shadow-[0_26px_80px_rgba(0,0,0,.35)] backdrop-blur-xl sm:p-7 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="mb-2 text-sm font-semibold text-white/80">
                100% Horny Guarantee
              </p>
              <h1 className="font-serif text-6xl leading-none text-white drop-shadow-[0_3px_18px_rgba(0,0,0,.55)] sm:text-8xl">
                Hornify
              </h1>
            </div>
            <button
              type="button"
              disabled={!contextDump.trim() || Boolean(loadingLabel)}
              onClick={() => generate()}
              className="aqua-button inline-flex h-20 w-full items-center justify-center gap-3 rounded-full px-8 text-2xl font-black text-white shadow-[0_18px_38px_rgba(0,0,0,.36)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-55 sm:w-[360px]"
            >
              {loadingLabel ? (
                <Loader2 className="size-6 animate-spin" aria-hidden="true" />
              ) : (
                <WandSparkles className="size-6" aria-hidden="true" />
              )}
              {loadingLabel || "Hornify"}
            </button>
          </header>

          <div className="grid flex-1 gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,.95fr)]">
            <MacWindow title="Context Dump" className="min-h-[650px]">
              <textarea
                aria-label="Context dump"
                value={contextDump}
                onChange={(event) => setContextDump(event.target.value)}
                placeholder={`dump everything here:
event / time / place
teams / people / characters
food / drinks
inside jokes
lines you already like
things to avoid`}
                className="min-h-[390px] flex-1 resize-y rounded-b-[18px] border-x border-b border-black/20 bg-white/82 p-5 font-mono text-base leading-7 text-[#191924] shadow-[inset_0_2px_18px_rgba(40,25,50,.16)] outline-none placeholder:text-[#5d6474]/70 focus:bg-white focus:ring-4 focus:ring-[#28b7f7]/35"
              />

              <div className="mt-4 grid gap-4 rounded-[20px] border border-white/60 bg-white/54 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.8)] backdrop-blur-xl">
                <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr_1fr]">
                  <PillGroup
                    active={mode}
                    items={MODES}
                    labels={modeLabels}
                    title="Mode"
                    onChange={setMode}
                  />
                  <PillGroup
                    active={intensity}
                    items={INTENSITIES}
                    title="Heat"
                    onChange={setIntensity}
                  />
                  <PillGroup
                    active={length}
                    items={LENGTHS}
                    title="Size"
                    onChange={setLength}
                  />
                </div>

                <label className="flex items-center gap-3 text-sm font-semibold text-[#242332]">
                  <input
                    type="checkbox"
                    checked={includeLogistics}
                    onChange={(event) => setIncludeLogistics(event.target.checked)}
                    className="size-5 accent-[#1eacdf]"
                  />
                  Keep logistics visible
                </label>
              </div>
            </MacWindow>

            <MacWindow title="Outbox" className="min-h-[650px]">
              <div className="mb-4 grid gap-2 rounded-[18px] border border-white/55 bg-white/45 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,.85)] backdrop-blur-xl sm:grid-cols-[auto_1fr] sm:items-center">
                <button
                  type="button"
                  disabled={!output}
                  onClick={copyOutput}
                  className="aqua-mini-button inline-flex h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <Clipboard className="size-4" aria-hidden="true" />
                  {copied ? "Copied" : "Copy"}
                </button>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {iterationActions.map((action) => {
                    const Icon = action.icon;

                    return (
                      <button
                        key={action.label}
                        type="button"
                        disabled={!output || Boolean(loadingLabel)}
                        onClick={() => generate(action.request)}
                        className="inline-flex h-10 items-center justify-center gap-1 rounded-full border border-white/65 bg-white/60 px-2 text-xs font-bold text-[#242332] shadow-[inset_0_1px_0_rgba(255,255,255,.9),0_5px_14px_rgba(0,0,0,.12)] backdrop-blur transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        <Icon className="size-3.5" aria-hidden="true" />
                        {action.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {error ? (
                <div className="mb-4 rounded-[18px] border border-[#a77213]/25 bg-[#fff2b8]/90 p-3 text-sm font-semibold text-[#5a3b00] shadow-[0_10px_24px_rgba(0,0,0,.12)]">
                  {error}
                </div>
              ) : null}

              <div className="flex flex-1 rounded-b-[18px] border-x border-b border-black/20 bg-white/84 text-[#191924] shadow-[inset_0_2px_18px_rgba(40,25,50,.16)]">
                {output ? (
                  <pre className="min-h-full w-full whitespace-pre-wrap break-words p-5 font-sans text-lg leading-8">
                    {output}
                  </pre>
                ) : (
                  <div className="grid w-full place-items-center p-6 text-center">
                    <div className="rounded-[24px] border border-white/70 bg-white/58 p-6 text-[#2b2b3a] shadow-[0_18px_40px_rgba(0,0,0,.16)] backdrop-blur-xl">
                      <MessageSquareText
                        className="mx-auto size-10 text-[#1eacdf]"
                        aria-hidden="true"
                      />
                      <p className="mt-3 font-serif text-3xl">Awaiting corruption</p>
                    </div>
                  </div>
                )}
              </div>
            </MacWindow>
          </div>
        </div>
      </div>
    </main>
  );
}

function MacWindow({
  children,
  className,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title: string;
}) {
  return (
    <section
      className={clsx(
        "mac-window flex flex-col rounded-[24px] border border-white/45 p-3 shadow-[0_28px_70px_rgba(0,0,0,.32)] backdrop-blur-xl",
        className,
      )}
    >
      <div className="mac-titlebar flex h-9 items-center justify-between rounded-t-[18px] border border-white/55 px-3 text-sm font-semibold text-[#242332] shadow-[inset_0_1px_0_rgba(255,255,255,.86)]">
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="size-3 rounded-full border border-[#9b2f29]/35 bg-[#ff5f57]" />
          <span className="size-3 rounded-full border border-[#996915]/35 bg-[#ffbd2e]" />
          <span className="size-3 rounded-full border border-[#1b7d31]/35 bg-[#28c840]" />
        </div>
        <span>{title}</span>
        <span className="w-14" aria-hidden="true" />
      </div>
      {children}
    </section>
  );
}

function PillGroup<T extends string>({
  active,
  items,
  labels,
  title,
  onChange,
}: {
  active: T;
  items: readonly T[];
  labels?: Partial<Record<T, string>>;
  title: string;
  onChange: (item: T) => void;
}) {
  return (
    <div className="grid gap-2">
      <span className="text-xs font-bold text-[#4e5160]">{title}</span>
      <div className="grid grid-cols-2 gap-1.5">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={clsx(
              "min-h-10 rounded-full border px-3 text-sm font-bold shadow-[inset_0_1px_0_rgba(255,255,255,.85),0_4px_12px_rgba(0,0,0,.1)] transition",
              active === item
                ? "aqua-mini-button border-white/55 text-white"
                : "border-white/70 bg-white/58 text-[#242332] hover:bg-white",
            )}
          >
            {labels?.[item] ?? item}
          </button>
        ))}
      </div>
    </div>
  );
}
