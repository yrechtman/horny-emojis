# Hornify

A small Next.js app for turning a messy context dump into chaotic emoji-heavy group texts.

## Public repo, private corpus

The repo is safe to make public because the real example corpus is intentionally ignored:

- `prompts/style-guide.md` is committed and contains distilled voice rules.
- `prompts/private-examples.md` is loaded server-side when present and is ignored by git.
- `.env.local` is ignored and holds `OPENAI_API_KEY`.

For local development, put the private examples at `prompts/private-examples.md`. For deployment, use `PRIVATE_EXAMPLE_CORPUS` or point `PRIVATE_CORPUS_PATH` at private storage available to the server.

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Add `OPENAI_API_KEY` to `.env.local` before generating.

## Scripts

```bash
npm run dev
npm run build
npm run lint
```
