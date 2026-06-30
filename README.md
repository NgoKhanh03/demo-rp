# Vietnamese TTS MVP

Prototype UI + backend for a cost-conscious Vietnamese Text-to-Speech MVP focused on creator voiceover.

## Run locally

```bash
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8787

## MVP defaults

- Economy quality tier is default for voiceover, learning, and blog use cases.
- Work Pro demo quota: 500,000 characters/month.
- Per-job limit: 12,000 characters.
- Expected quota-hit rate: 30%.
- Saved export limits: Free/demo 5, Work Pro 30, Creator Pro 120.
- Retention: 30 days, with storage guardrails based on limiting saved exports.
- Voiceover editor supports control tokens such as `...`, `[pause]`, `[short pause]`, `[long pause]`, `[whispers]`, `[excited]`, `[sighs]`, and `[throught]`.
