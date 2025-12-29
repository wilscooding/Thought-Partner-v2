import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";
import mammoth from "mammoth";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

// Setup the driver connection
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// Initialize with the adapter
const prisma = new PrismaClient({ adapter });

const AVATAR_NAMES = new Set([
    "Denise Okoro",
    "Ellis Reed",
    "River Quinn",
    "Theo Lane",
    "Rosa Alvarez",
    "Leo Tran",
    "Nadine Shah",
    "Elliott Stein",
    "Rami Ellis",
    "Jordan Lane",
    "Alex Rowan",
    "Emery Jules",
]);

function slugify(name: string) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
}

/**
 * ✅ ElevenLabs voice IDs (you provided)
 * Key MUST match your avatar `id` (slugified name).
 */
const VOICE_MAP: Record<string, string> = {
    denise_okoro: "EXAVITQu4vr4xnSDxMaL", // Sarah
    ellis_reed: "onwK4e9ZLuTAKqWW03F9", // Daniel
    river_quinn: "SAz9YHcvj6GT2YYXdXww", // River
    theo_lane: "JBFqnCBsd6RMkjVDRZzb", // George
    rosa_alvarez: "pNInz6obpgDQGcFmaJgB", // Adam
    leo_tran: "XrExE9yKIg1WjnnlVkGX", // Matilda
    nadine_shah: "pqHfZKP75CvOlQylNhV4", // Bill
    elliott_stein: "IKne3meq5aSn9XLyUdCD", // Charlie
    rami_ellis: "nPczCjzI2devNBz1zQrb", // Brian
    jordan_lane: "TX3LPaxmHKxFdv7VOQHJ", // Liam
    alex_rowan: "cjVigY5qzO86Huf0OWal", // Eric
    emery_jules: "pFZP5JQG7iQjIQuC4Bku", // Lily
};

/**
 * Fallback voices if anything is missing (re-use is fine)
 * If an avatar ID isn't in VOICE_MAP, we assign a fallback (stable).
 */
const FALLBACK_VOICES = [
    "EXAVITQu4vr4xnSDxMaL", // Sarah
    "onwK4e9ZLuTAKqWW03F9", // Daniel
    "SAz9YHcvj6GT2YYXdXww", // River
    "JBFqnCBsd6RMkjVDRZzb", // George
];

function stableFallbackVoiceId(avatarId: string) {
    // simple stable hash so it doesn't change run-to-run
    let h = 0;
    for (let i = 0; i < avatarId.length; i++) h = (h * 31 + avatarId.charCodeAt(i)) >>> 0;
    return FALLBACK_VOICES[h % FALLBACK_VOICES.length];
}

async function readDocxText(filePath: string) {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value.trim();
}

// Keeps this robust if the docx formatting changes a bit
async function parseProfileDescriptionsDocx(docxPath: string) {
    const text = await readDocxText(docxPath);
    const lines = text
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

    // Map: avatar name -> { profileBlurb, bestUsedWhen (as multi-line string) }
    const map = new Map<string, { profileBlurb?: string; bestUsedWhen?: string }>();

    let currentName: string | null = null;
    let currentBlurb: string | null = null;
    let collectingBest = false;
    let bestLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        const isBestHeader = /^best to use when/i.test(line);
        const looksLikeName = AVATAR_NAMES.has(line);

        if (looksLikeName && !isBestHeader) {
            if (currentName) {
                map.set(currentName, {
                    profileBlurb: currentBlurb ?? undefined,
                    bestUsedWhen: bestLines.length ? bestLines.join("\n") : undefined,
                });
            }
            currentName = line;
            currentBlurb = null;
            collectingBest = false;
            bestLines = [];
            continue;
        }

        if (!currentName) continue;

        if (isBestHeader) {
            collectingBest = true;
            continue;
        }

        if (!collectingBest && !currentBlurb) {
            currentBlurb = line;
            continue;
        }

        if (collectingBest) {
            bestLines.push(line);
        }
    }

    if (currentName) {
        map.set(currentName, {
            profileBlurb: currentBlurb ?? undefined,
            bestUsedWhen: bestLines.length ? bestLines.join("\n") : undefined,
        });
    }

    return map;
}

async function main() {
    const seedRoot = path.join(process.cwd(), "seed_source");
    const xlsxPath = path.join(seedRoot, "V2 Thought Partner Connectivity.xlsx");
    const promptsDir = path.join(seedRoot, "TP Avatar Prompts");
    const universalPromptPath = path.join(promptsDir, "V2 Avatar Universal Prompt.docx");
    const profileDescPath = path.join(seedRoot, "Avatar Profile Descriptions.docx");

    if (!fs.existsSync(seedRoot)) throw new Error(`Missing folder: ${seedRoot}`);
    if (!fs.existsSync(xlsxPath)) throw new Error(`Missing file: ${xlsxPath}`);
    if (!fs.existsSync(promptsDir)) throw new Error(`Missing folder: ${promptsDir}`);
    if (!fs.existsSync(universalPromptPath))
        throw new Error(`Missing file: ${universalPromptPath}`);
    if (!fs.existsSync(profileDescPath)) throw new Error(`Missing file: ${profileDescPath}`);

    const universalPrompt = await readDocxText(universalPromptPath);
    const profiles = await parseProfileDescriptionsDocx(profileDescPath);

    // Read avatars from Excel
    const workbook = XLSX.readFile(xlsxPath);
    const sheet = workbook.Sheets["Avatars"];
    if (!sheet) throw new Error(`Sheet "Avatars" not found in ${xlsxPath}`);

    const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet);

    let count = 0;

    for (const row of rows) {
        let name = String(row["Avatar Name"] ?? "").trim();
        if (!name) continue;

        // Normalize known typo
        if (name === "Eillis Reed") name = "Ellis Reed";

        const id = slugify(name);

        const archetype = String(row["Archetype"] ?? "").trim() || null;
        const gender = String(row["Gender"] ?? "").trim() || null;
        const engagedWhen =
            String(row["Engaged When User Context Mindset is Selected"] ?? "").trim() || null;

        const personalityDescription =
            String(row["Avatar Personality Description for Prompt"] ?? "").trim() || null;
        const physicalDescription = String(row["Avatar Physical Description"] ?? "").trim() || null;
        const voiceDescription = String(row["Avatar Voice Description"] ?? "").trim() || null;

        // ✅ Choose ElevenLabs voiceId (mapped or fallback)
        const elevenLabsVoiceId = VOICE_MAP[id] ?? stableFallbackVoiceId(id);

        // Avatar-specific prompt file
        const specificPromptPath = path.join(promptsDir, `${name} Avatar System Prompt.docx`);
        if (!fs.existsSync(specificPromptPath)) {
            throw new Error(`Missing prompt for "${name}": ${specificPromptPath}`);
        }
        const specificPrompt = await readDocxText(specificPromptPath);

        const systemPrompt = `${universalPrompt}\n\n${specificPrompt}`.trim();

        const profile = profiles.get(name);
        const profileBlurb = profile?.profileBlurb ?? null;
        const bestUsedWhen = profile?.bestUsedWhen ?? null;

        // photoKey points to frontend public assets: /public/avatars/{photoKey}.png
        const photoKey = id;

        await prisma.avatar.upsert({
            where: { id },
            update: {
                name,
                archetype,
                gender,
                engagedWhen,
                profileBlurb,
                bestUsedWhen,
                personalityDescription,
                physicalDescription,
                voiceDescription,
                systemPrompt,
                photoKey,

                // ✅ ADD THIS
                elevenLabsVoiceId,
            },
            create: {
                id,
                name,
                archetype,
                gender,
                engagedWhen,
                profileBlurb,
                bestUsedWhen,
                personalityDescription,
                physicalDescription,
                voiceDescription,
                systemPrompt,
                photoKey,

                // ✅ ADD THIS
                elevenLabsVoiceId,
            },
        });

        count++;
        console.log(`✅ Seeded: ${name} → ${id} (voice=${elevenLabsVoiceId})`);
    }

    console.log(`🎉 Done. Seeded/updated ${count} avatars.`);
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
