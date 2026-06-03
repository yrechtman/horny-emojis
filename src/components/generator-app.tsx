"use client";

import {
  Clipboard,
  Flame,
  ListChecks,
  Loader2,
  MessageSquareText,
  RefreshCcw,
  Scissors,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { type ComponentType, type SVGProps, useMemo, useState } from "react";

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

const fieldConfig: Array<{
  key: keyof GeneratorFields;
  label: string;
  placeholder: string;
  area?: boolean;
}> = [
  {
    key: "eventType",
    label: "Event",
    placeholder: "Basketball watch party, beach day, finale night",
  },
  { key: "dateTime", label: "Date / time", placeholder: "Tonight, 8pm" },
  { key: "venue", label: "Venue", placeholder: "Your bar, apartment, arena, roof" },
  { key: "location", label: "Location", placeholder: "Neighborhood, city, state" },
  { key: "occasion", label: "Occasion", placeholder: "Birthday, Game 1, reunion" },
  {
    key: "people",
    label: "People / teams",
    placeholder: "Home team, rival, players, characters, friends",
    area: true,
  },
  {
    key: "foodDrinks",
    label: "Food / drinks",
    placeholder: "Snacks, cocktails, dinner special, ridiculous dessert",
    area: true,
  },
  {
    key: "insideJokes",
    label: "Inside jokes",
    placeholder: "Recurring bits, nicknames, cursed phrases",
    area: true,
  },
  {
    key: "ownJokes",
    label: "Must-use jokes",
    placeholder: "Venue pun, food riff, closing refrain",
    area: true,
  },
  {
    key: "avoidJokes",
    label: "Avoid",
    placeholder: "Anything too specific, stale, or cursed in the wrong way",
    area: true,
  },
];

const modeLabels: Record<Mode, string> = {
  brainstorm: "Brainstorm",
  emojify: "Emoji-fy",
  full: "Full text",
  variants: "Variants",
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
    label: "More emojis",
    icon: Sparkles,
    request:
      "Revise the current output with more emojis, especially after nouns, verbs, food, venue, and team-color phrases.",
  },
  {
    label: "New angle",
    icon: RefreshCcw,
    request:
      "Rewrite the current output from a fresh angle with new puns and a stronger closing refrain.",
  },
];

function clsx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function GeneratorApp() {
  const [fields, setFields] = useState<GeneratorFields>(emptyFields);
  const [draft, setDraft] = useState("");
  const [mode, setMode] = useState<Mode>("full");
  const [intensity, setIntensity] = useState<Intensity>("unhinged");
  const [length, setLength] = useState<Length>("medium");
  const [includeLogistics, setIncludeLogistics] = useState(true);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loadingLabel, setLoadingLabel] = useState("");
  const [copied, setCopied] = useState(false);

  const canGenerate = useMemo(
    () => draft.trim() || Object.values(fields).some((value) => value.trim()),
    [draft, fields],
  );

  function updateField(key: keyof GeneratorFields, value: string) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  async function generate(revisionRequest?: string) {
    setError("");
    setCopied(false);
    setLoadingLabel(revisionRequest ? "Reworking" : "Generating");

    const payload: GenerateRequest = {
      mode,
      intensity,
      length,
      includeLogistics,
      fields,
      draft,
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
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex flex-col justify-between gap-3 border-b border-black/15 pb-4 sm:flex-row sm:items-end dark:border-white/15">
          <div className="flex items-end gap-3">
            <div className="grid size-12 shrink-0 place-items-center rounded-md border border-black/15 bg-[#fff7a8] text-2xl shadow-[3px_3px_0_#191915] dark:border-white/20 dark:text-black">
              💬
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#197278]">
                draft desk
              </p>
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                Horny Emoji Group Text Generator
              </h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {MODES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMode(item)}
                className={clsx(
                  "h-10 rounded-md border px-3 text-sm font-semibold transition",
                  mode === item
                    ? "border-[#191915] bg-[#191915] text-white dark:border-[#f4f6f1] dark:bg-[#f4f6f1] dark:text-[#10110f]"
                    : "border-black/15 bg-white text-[#191915] hover:border-[#191915] dark:border-white/15 dark:bg-[#191915] dark:text-[#f4f6f1]",
                )}
              >
                {modeLabels[item]}
              </button>
            ))}
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[minmax(360px,0.86fr)_minmax(420px,1.14fr)]">
          <section className="rounded-md border border-black/15 bg-white p-4 shadow-[4px_4px_0_#191915] dark:border-white/15 dark:bg-[#161814] dark:shadow-[4px_4px_0_#f4f6f1]">
            <div className="grid gap-3 sm:grid-cols-2">
              {fieldConfig.map((field) => (
                <label
                  key={field.key}
                  className={clsx(
                    "grid gap-1 text-sm font-semibold",
                    field.area && "sm:col-span-2",
                  )}
                >
                  <span>{field.label}</span>
                  {field.area ? (
                    <textarea
                      value={fields[field.key]}
                      onChange={(event) => updateField(field.key, event.target.value)}
                      placeholder={field.placeholder}
                      rows={3}
                      className="min-h-24 resize-y rounded-md border border-black/15 bg-[#f8faf5] px-3 py-2 text-sm font-normal outline-none transition placeholder:text-black/35 focus:border-[#d62828] focus:ring-2 focus:ring-[#d62828]/20 dark:border-white/15 dark:bg-[#10110f] dark:placeholder:text-white/35"
                    />
                  ) : (
                    <input
                      value={fields[field.key]}
                      onChange={(event) => updateField(field.key, event.target.value)}
                      placeholder={field.placeholder}
                      className="h-11 rounded-md border border-black/15 bg-[#f8faf5] px-3 text-sm font-normal outline-none transition placeholder:text-black/35 focus:border-[#d62828] focus:ring-2 focus:ring-[#d62828]/20 dark:border-white/15 dark:bg-[#10110f] dark:placeholder:text-white/35"
                    />
                  )}
                </label>
              ))}
            </div>

            <label className="mt-3 grid gap-1 text-sm font-semibold">
              <span>Draft</span>
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Paste a rough text or a few lines you already like."
                rows={6}
                className="min-h-36 resize-y rounded-md border border-black/15 bg-[#f8faf5] px-3 py-2 text-sm font-normal outline-none transition placeholder:text-black/35 focus:border-[#197278] focus:ring-2 focus:ring-[#197278]/20 dark:border-white/15 dark:bg-[#10110f] dark:placeholder:text-white/35"
              />
            </label>

            <div className="mt-4 grid gap-3 border-t border-black/10 pt-4 sm:grid-cols-2 dark:border-white/10">
              <div className="grid gap-2">
                <span className="text-sm font-semibold">Intensity</span>
                <div className="grid grid-cols-2 gap-2">
                  {INTENSITIES.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setIntensity(item)}
                      className={clsx(
                        "h-10 rounded-md border px-2 text-sm font-semibold capitalize transition",
                        intensity === item
                          ? "border-[#d62828] bg-[#d62828] text-white"
                          : "border-black/15 bg-[#f8faf5] hover:border-[#d62828] dark:border-white/15 dark:bg-[#10110f]",
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <span className="text-sm font-semibold">Length</span>
                <div className="grid grid-cols-3 gap-2">
                  {LENGTHS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setLength(item)}
                      className={clsx(
                        "h-10 rounded-md border px-2 text-sm font-semibold capitalize transition",
                        length === item
                          ? "border-[#197278] bg-[#197278] text-white"
                          : "border-black/15 bg-[#f8faf5] hover:border-[#197278] dark:border-white/15 dark:bg-[#10110f]",
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-2 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={includeLogistics}
                  onChange={(event) => setIncludeLogistics(event.target.checked)}
                  className="size-4 accent-[#d62828]"
                />
                Include logistics
              </label>
              <button
                type="button"
                disabled={!canGenerate || Boolean(loadingLabel)}
                onClick={() => generate()}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#ffb703] px-4 text-sm font-bold text-[#191915] transition hover:bg-[#f7a600] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loadingLabel ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : mode === "brainstorm" ? (
                  <ListChecks className="size-4" aria-hidden="true" />
                ) : (
                  <WandSparkles className="size-4" aria-hidden="true" />
                )}
                {loadingLabel || "Generate"}
              </button>
            </div>
          </section>

          <section className="flex min-h-[620px] flex-col rounded-md border border-black/15 bg-[#191915] p-4 text-white shadow-[4px_4px_0_#d62828] dark:border-white/15">
            <div className="flex flex-col gap-3 border-b border-white/15 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <MessageSquareText className="size-5 text-[#ffb703]" aria-hidden="true" />
                <h2 className="text-lg font-semibold">Output</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {iterationActions.map((action) => {
                  const Icon = action.icon;

                  return (
                    <button
                      key={action.label}
                      type="button"
                      disabled={!output || Boolean(loadingLabel)}
                      onClick={() => generate(action.request)}
                      className="inline-flex h-9 items-center gap-2 rounded-md border border-white/15 px-3 text-sm font-semibold transition hover:border-[#ffb703] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Icon className="size-4" aria-hidden="true" />
                      {action.label}
                    </button>
                  );
                })}
                <button
                  type="button"
                  disabled={!output}
                  onClick={copyOutput}
                  className="inline-flex h-9 items-center gap-2 rounded-md bg-white px-3 text-sm font-bold text-[#191915] transition hover:bg-[#fff7a8] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Clipboard className="size-4" aria-hidden="true" />
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            {error ? (
              <div className="mt-4 rounded-md border border-[#ffb703] bg-[#ffb703]/10 p-3 text-sm text-[#fff7a8]">
                {error}
              </div>
            ) : null}

            <div className="mt-4 flex flex-1 rounded-md border border-white/15 bg-[#10110f]">
              {output ? (
                <pre className="min-h-full w-full whitespace-pre-wrap break-words p-4 font-sans text-base leading-7">
                  {output}
                </pre>
              ) : (
                <div className="grid w-full place-items-center p-6 text-center text-white/55">
                  <div className="max-w-xs">
                    <p className="text-5xl" aria-hidden="true">
                      🥵🏀🌭
                    </p>
                    <p className="mt-3 text-sm font-medium">
                      The first draft will land here.
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
