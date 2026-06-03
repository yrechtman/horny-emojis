"use client";

import {
  Clipboard,
  Flame,
  Loader2,
  MessageSquareText,
  RefreshCcw,
  Scissors,
  Sparkles,
  Stars,
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
  full: "sendable",
  brainstorm: "bullets",
  emojify: "punch-up",
  variants: "4 takes",
};

const iterationActions: Array<{
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  request: string;
}> = [
  {
    label: "hornier",
    icon: Flame,
    request:
      "Revise the current output to be hornier, more pun-dense, and more committed while keeping the logistics intact.",
  },
  {
    label: "shorter",
    icon: Scissors,
    request:
      "Revise the current output to be shorter and tighter while preserving the best jokes.",
  },
  {
    label: "glitter",
    icon: Sparkles,
    request:
      "Revise the current output with more emojis, more visual rhythm, and more chaotic group-chat texture.",
  },
  {
    label: "reroll",
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
    setLoadingLabel(revisionRequest ? "remixing" : "hornifying");

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
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 opacity-70 [background-image:linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-4 bg-[repeating-linear-gradient(90deg,#ff2bd6_0_28px,#00f0ff_28px_56px,#fff200_56px_84px,#62ff00_84px_112px)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-5 pt-7 sm:px-6 lg:px-8">
        <header className="grid gap-4 border-4 border-black bg-[#fff200] p-3 shadow-[8px_8px_0_#000] sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="flex items-end gap-3">
            <div className="grid size-16 shrink-0 place-items-center border-4 border-black bg-[#00f0ff] text-4xl shadow-[4px_4px_0_#ff2bd6]">
              💦
            </div>
            <div>
              <p className="font-mono text-sm font-black uppercase text-[#0014ff]">
                horny dot exe
              </p>
              <h1 className="text-5xl font-black leading-none text-black sm:text-7xl">
                Hornify
              </h1>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-1 border-4 border-black bg-white p-1 text-center font-mono text-xl shadow-[4px_4px_0_#000]">
            <span>🍑</span>
            <span>💿</span>
            <span>🫦</span>
            <span>✨</span>
          </div>
        </header>

        <div className="mt-4 overflow-hidden border-4 border-black bg-black text-white shadow-[8px_8px_0_#ff2bd6]">
          <div className="flex gap-8 whitespace-nowrap py-2 font-mono text-sm font-black uppercase">
            <span className="animate-[ticker_18s_linear_infinite]">
              HOT NOTES IN HOTTER TEXT ::: TIP OFF ::: LOAD JOKES ::: PRESS
              BUTTON ::: COPY INTO CHAT ::: HOT NOTES IN HOTTER TEXT ::: TIP OFF
              ::: LOAD JOKES ::: PRESS BUTTON ::: COPY INTO CHAT :::
            </span>
          </div>
        </div>

        <div className="mt-5 grid flex-1 gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,.95fr)]">
          <section className="flex min-h-[680px] flex-col border-4 border-black bg-[#ff7ac8] p-3 shadow-[8px_8px_0_#0014ff]">
            <div className="mb-3 flex items-center justify-between gap-3 border-4 border-black bg-[#c8ff00] px-3 py-2 text-black">
              <div className="flex items-center gap-2 font-mono text-sm font-black uppercase">
                <Stars className="size-4" aria-hidden="true" />
                Context Dump
              </div>
              <div className="flex gap-1" aria-hidden="true">
                <span className="size-3 border-2 border-black bg-[#ff2bd6]" />
                <span className="size-3 border-2 border-black bg-[#00f0ff]" />
                <span className="size-3 border-2 border-black bg-[#fff200]" />
              </div>
            </div>

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
              className="min-h-[420px] flex-1 resize-y border-4 border-black bg-white p-4 font-mono text-base font-bold leading-7 text-black shadow-[inset_5px_5px_0_rgba(0,0,0,.18)] outline-none placeholder:text-black/45 focus:bg-[#fffde8] focus:ring-4 focus:ring-[#00f0ff]"
            />

            <div className="mt-3 grid gap-3 border-4 border-black bg-white p-3 text-black">
              <div className="grid gap-2 lg:grid-cols-[1.2fr_1fr_1fr]">
                <DialGroup
                  active={mode}
                  items={MODES}
                  labels={modeLabels}
                  title="mode"
                  onChange={setMode}
                  tone="blue"
                />
                <DialGroup
                  active={intensity}
                  items={INTENSITIES}
                  title="heat"
                  onChange={setIntensity}
                  tone="pink"
                />
                <DialGroup
                  active={length}
                  items={LENGTHS}
                  title="size"
                  onChange={setLength}
                  tone="green"
                />
              </div>

              <div className="flex flex-col gap-3 border-t-4 border-black pt-3 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex items-center gap-2 font-mono text-sm font-black uppercase">
                  <input
                    type="checkbox"
                    checked={includeLogistics}
                    onChange={(event) => setIncludeLogistics(event.target.checked)}
                    className="size-5 accent-[#ff2bd6]"
                  />
                  keep logistics visible
                </label>
                <button
                  type="button"
                  disabled={!contextDump.trim() || Boolean(loadingLabel)}
                  onClick={() => generate()}
                  className="inline-flex h-14 items-center justify-center gap-2 border-4 border-black bg-[#fff200] px-6 text-xl font-black uppercase text-black shadow-[5px_5px_0_#000] transition hover:-translate-y-0.5 hover:bg-[#c8ff00] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {loadingLabel ? (
                    <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                  ) : (
                    <WandSparkles className="size-5" aria-hidden="true" />
                  )}
                  {loadingLabel || "hornify"}
                </button>
              </div>
            </div>
          </section>

          <section className="flex min-h-[680px] flex-col border-4 border-black bg-[#00f0ff] p-3 shadow-[8px_8px_0_#c8ff00]">
            <div className="mb-3 flex flex-col gap-2 border-4 border-black bg-[#0014ff] p-3 text-white">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 font-mono text-sm font-black uppercase">
                  <MessageSquareText
                    className="size-4 text-[#fff200]"
                    aria-hidden="true"
                  />
                  Outbox
                </div>
                <button
                  type="button"
                  disabled={!output}
                  onClick={copyOutput}
                  className="inline-flex h-9 items-center gap-2 border-2 border-white bg-[#ff2bd6] px-3 text-sm font-black uppercase text-white transition hover:bg-[#fff200] hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Clipboard className="size-4" aria-hidden="true" />
                  {copied ? "copied" : "copy"}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {iterationActions.map((action) => {
                  const Icon = action.icon;

                  return (
                    <button
                      key={action.label}
                      type="button"
                      disabled={!output || Boolean(loadingLabel)}
                      onClick={() => generate(action.request)}
                      className="inline-flex h-10 items-center justify-center gap-1 border-2 border-white bg-black px-2 text-xs font-black uppercase transition hover:bg-[#c8ff00] hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Icon className="size-3.5" aria-hidden="true" />
                      {action.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {error ? (
              <div className="mb-3 border-4 border-black bg-[#fff200] p-3 font-mono text-sm font-black text-black">
                {error}
              </div>
            ) : null}

            <div className="flex flex-1 border-4 border-black bg-white text-black shadow-[inset_5px_5px_0_rgba(0,0,0,.18)]">
              {output ? (
                <pre className="min-h-full w-full whitespace-pre-wrap break-words p-4 font-sans text-lg font-semibold leading-8">
                  {output}
                </pre>
              ) : (
                <div className="grid w-full place-items-center p-6 text-center">
                  <div className="max-w-sm border-4 border-black bg-[#fff200] p-5 shadow-[6px_6px_0_#ff2bd6]">
                    <p className="text-6xl" aria-hidden="true">
                      💿💋📟
                    </p>
                    <p className="mt-3 font-mono text-lg font-black uppercase">
                      Awaiting corruption
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function DialGroup<T extends string>({
  active,
  items,
  labels,
  title,
  tone,
  onChange,
}: {
  active: T;
  items: readonly T[];
  labels?: Partial<Record<T, string>>;
  title: string;
  tone: "blue" | "green" | "pink";
  onChange: (item: T) => void;
}) {
  const activeColor = {
    blue: "bg-[#0014ff] text-white",
    green: "bg-[#c8ff00] text-black",
    pink: "bg-[#ff2bd6] text-white",
  }[tone];

  return (
    <div className="grid gap-1">
      <span className="font-mono text-xs font-black uppercase">{title}</span>
      <div className="grid grid-cols-2 gap-1">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={clsx(
              "min-h-10 border-2 border-black px-2 text-sm font-black uppercase transition hover:-translate-y-0.5",
              active === item ? activeColor : "bg-white text-black",
            )}
          >
            {labels?.[item] ?? item}
          </button>
        ))}
      </div>
    </div>
  );
}
