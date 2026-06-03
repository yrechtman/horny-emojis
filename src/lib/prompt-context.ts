import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_PRIVATE_CORPUS_PATH = path.join(
  /*turbopackIgnore: true*/ process.cwd(),
  "prompts",
  "private-examples.md",
);

async function readOptionalFile(filePath: string) {
  try {
    return await readFile(filePath, "utf8");
  } catch {
    return "";
  }
}

function resolvePath(filePath: string) {
  return path.isAbsolute(filePath)
    ? filePath
    : path.join(/*turbopackIgnore: true*/ process.cwd(), filePath);
}

function limitCorpus(text: string) {
  const limit = Number(process.env.PRIVATE_CORPUS_CHAR_LIMIT ?? 40000);

  if (!Number.isFinite(limit) || limit <= 0 || text.length <= limit) {
    return text;
  }

  return text.slice(0, limit);
}

export async function loadPromptContext() {
  const styleGuide = await readOptionalFile(
    path.join(/*turbopackIgnore: true*/ process.cwd(), "prompts", "style-guide.md"),
  );
  const privateCorpusFromEnv = process.env.PRIVATE_EXAMPLE_CORPUS?.trim() ?? "";
  const privateCorpusPath = resolvePath(
    process.env.PRIVATE_CORPUS_PATH || DEFAULT_PRIVATE_CORPUS_PATH,
  );
  const privateCorpus =
    privateCorpusFromEnv || (await readOptionalFile(privateCorpusPath));

  return {
    styleGuide,
    privateCorpus: limitCorpus(privateCorpus.trim()),
  };
}
