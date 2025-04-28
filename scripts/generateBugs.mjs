/**
 * Generate /public/bugs.json with fresh sarcastic "profiles".
 *
 * Usage:  node scripts/generateBugs.mjs 15   // 15 bugs (default 10)
 * Reads OPENAI_API_KEY from .env (via dotenv) or the shell environment
 */

import "dotenv/config"

import OpenAI from "openai"
import { zodTextFormat } from "openai/helpers/zod"
import { z } from "zod"
import { rm, access, constants, mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { v4 as uuidv4 } from "uuid"

const COUNT = Number.parseInt(process.argv[2] || "10", 10)
const CLEAN = process.argv.includes("--clean")

const OUT_DIR = "public/bug-images"
await ensureFreshRun()
await mkdir(OUT_DIR, { recursive: true })

const BugStats = z.object({
  Severity: z.number().int(),
  Complexity: z.number().int(),
  Reproducibility: z.number().int(),
  Legacy: z.number().int(),
  Priority: z.number().int(),
})

const Bug = z.object({
  name: z.string().describe("Bug's display name"),
  pickupLine: z.string(),
  stats: BugStats,
  tags: z.array(z.string()),
  prompt: z
    .string()
    .describe(
      "Image-generation prompt in the style of Studio Ghibli. Must mention selfie, hiking, cooking, or sipping coffee."
    ),
})

const BugsResponse = z.object({
  bugs: z.array(Bug),
})

const openai = new OpenAI()

async function ensureFreshRun() {
  if (!CLEAN) return

  try {
    await access("public/bugs.json", constants.F_OK)
    await rm("public/bugs.json")
  } catch {}

  try {
    await rm("public/bug-images", { recursive: true, force: true })
  } catch {}
}

/** Produce COUNT bugs via the Responses API (not Chat). */
async function createBugProfiles() {
  const SYSTEM_PROMPT = `
You are a brutally sarcastic Cupid for software bugs in ${new Date().getFullYear()}.

For each bug object:
• \`name\` – ≤ 25 chars, pun-heavy, Title Case. (ex: "VisionPro Void")
• \`pickupLine\` – ≤ 140 chars, savage flirt referencing **fresh** tech memes.  
  The list below is **inspiration, not a checklist**—mix, mutate, or invent:
    – Apple Vision Pro dev headaches  
    – “Rust-rewrite-everything” crusade  
    – soaring K8s cloud bills (“FinOps confessional”)  
    – AI pull-requests that autogen —and auto-break— your build  
    – Copilot break-up jokes (“I saw you pair-programming with GPT-6-Lite…”)  
    – quantum-laptop vaporware
• \`stats\` – five integers 1-10 that *match the gag*.  
  (Legacy is 9 if it jokes about COBOL; Complexity is 10 for recursive LLM calls.)
• \`tags\` – ≥ 3 buzzwords (languages, stacks, niches).
• \`prompt\` – ONE vivid, comma-separated **gpt-image-1** prompt for a nerdy dating-profile photo in dreamy Studio Ghibli style.  
  – Think of any photo trope you’d swipe past on a dating app (travel flex, café candid, gym mirror, pet cameo, etc.) and re-imagine it through a bug-or-dev lens.  
  – Stay original—do **not** reuse examples verbatim.  
  – Finish with: “dreamy Studio Ghibli, bright pastels, cinematic lighting”.

Tone: witty, PG-13 sarcasm—no profanity.

Always vary wording so successive bugs feel unique.
  `.trim()

  const res = await openai.responses.parse({
    model: "gpt-4.1",
    input: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: `Generate ${COUNT} unique bugs`,
      },
    ],
    text: {
      format: zodTextFormat(BugsResponse, "bugs_response"),
    },
    temperature: 0.9,
    max_output_tokens: 2048,
    top_p: 1,
  })

  return res.output_parsed.bugs
}

const bugs = await createBugProfiles()

for (const bug of bugs) {
  bug.id = uuidv4()

  const imgName = `${bug.id}.png`
  bug.image = `/bug-match/bug-images/${imgName}`

  const { data } = await openai.images.generate({
    model: "gpt-image-1",
    prompt: bug.prompt,
    size: "1024x1024",
    quality: "high",
  })

  const base64 = data[0].b64_json
  const bytes = Buffer.from(base64, "base64")
  await writeFile(path.join(OUT_DIR, imgName), bytes)
}

const outPath = path.resolve("public/bugs.json")
await writeFile(outPath, JSON.stringify(bugs, null, 2))
console.log(`✅  Wrote ${bugs.length} bugs to ${outPath}`)
