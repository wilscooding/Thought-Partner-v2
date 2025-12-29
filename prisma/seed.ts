import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";
import mammoth from "mammoth";
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from "@prisma/adapter-pg"; // This is the new part
import pg from "pg"; // This is the new part
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

async function readDocxText(filePath: string) {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value.trim();
}

// Keeps this robust if the docx formatting changes a bit
async function parseProfileDescriptionsDocx(docxPath: string) {
    const text = await readDocxText(docxPath);
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

    // Map: avatar name -> { profileBlurb, bestUsedWhen (as multi-line string) }
    const map = new Map<string, { profileBlurb?: string; bestUsedWhen?: string }>();

    let currentName: string | null = null;
    let currentBlurb: string | null = null;
    let collectingBest = false;
    let bestLines: string[] = [];

    // We detect avatar sections by a line that looks like a full name (2 words) and appears before a blurb.
    // If your docx uses a consistent “Name” line, this works well.
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        const isBestHeader = /^best to use when/i.test(line);

        // Heuristic: avatar name lines often look like "First Last"
        const looksLikeName = AVATAR_NAMES.has(line);
        if (looksLikeName && !isBestHeader) {
            // flush previous
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
            // first line after the name is usually the blurb
            currentBlurb = line;
            continue;
        }

        if (collectingBest) {
            bestLines.push(line);
        }
    }

    // flush last
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
    if (!fs.existsSync(universalPromptPath)) throw new Error(`Missing file: ${universalPromptPath}`);
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
        const engagedWhen = String(row["Engaged When User Context Mindset is Selected"] ?? "").trim() || null;

        const personalityDescription =
            String(row["Avatar Personality Description for Prompt"] ?? "").trim() || null;
        const physicalDescription =
            String(row["Avatar Physical Description"] ?? "").trim() || null;
        const voiceDescription =
            String(row["Avatar Voice Description"] ?? "").trim() || null;

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
            },
        });

        count++;
        console.log(`✅ Seeded: ${name} → ${id}`);
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
