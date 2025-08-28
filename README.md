# AI Dashboard (Next.js + Hugging Face)

A sleek, dynamic dashboard that lets users run prompts against free-tier AI APIs via your backend. Ready for one-click deploy to Vercel.

## Features
- Text → Text via Hugging Face Inference API (default: Mistral 7B Instruct).
- Text → Image via Stable Diffusion 2 on Hugging Face.
- Modern UI (Tailwind + Framer Motion), dark theme, responsive.
- API keys kept server-side (Vercel environment variables).

## Quick Start

```bash
# 1) Clone
git clone <your-repo-url>.git ai-dashboard
cd ai-dashboard

# 2) Install deps
pnpm i  # or npm i / yarn

# 3) Create env
cp .env.example .env.local
# set HUGGINGFACE_API_KEY

# 4) Dev
pnpm dev  # or npm run dev
```

## Deploy on Vercel
1. Push this repo to GitHub.
2. Create a new Vercel project from the repo.
3. In **Project Settings → Environment Variables** add:
   - `HUGGINGFACE_API_KEY` (Required)
   - `TEXT_MODEL` (Optional, default shown in .env.example)
   - `IMAGE_MODEL` (Optional, default shown in .env.example)
4. Deploy.

## Notes
- Free-tier models can be cold-started; first request may be slow.
- This code avoids streaming for broad model compatibility.
- Swap models anytime: update env vars and redeploy.

## License
MIT
