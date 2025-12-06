import fs from "fs";
import path from "path";
import { InputField, OutputField, ToolConfig } from "./types";

const toolsDir = path.join(process.cwd(), "data", "tools");

const isString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isInputField = (value: unknown): value is InputField => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    isString(candidate.id) &&
    isString(candidate.label) &&
    (candidate.type === "number" || candidate.type === "text")
  );
};

const isOutputField = (value: unknown): value is OutputField => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return isString(candidate.id) && isString(candidate.label);
};

const assertToolConfig = (value: unknown, slug: string): ToolConfig => {
  if (!value || typeof value !== "object") {
    throw new Error(`Invalid tool config for "${slug}"`);
  }
  const candidate = value as Record<string, unknown>;
  if (!isString(candidate.slug) || !isString(candidate.title)) {
    throw new Error(`Missing slug or title for "${slug}"`);
  }
  if (!candidate.seo || typeof candidate.seo !== "object") {
    throw new Error(`Missing SEO block for "${slug}"`);
  }
  const seo = candidate.seo as Record<string, unknown>;
  if (!isString(seo.title) || !isString(seo.description)) {
    throw new Error(`SEO title/description invalid for "${slug}"`);
  }
  if (!Array.isArray(candidate.inputs) || candidate.inputs.length === 0) {
    throw new Error(`Inputs missing for "${slug}"`);
  }
  if (!Array.isArray(candidate.outputs) || candidate.outputs.length === 0) {
    throw new Error(`Outputs missing for "${slug}"`);
  }
  if (!isString(candidate.formula)) {
    throw new Error(`Formula missing for "${slug}"`);
  }
  if (candidate.slug !== slug) {
    throw new Error(`Slug mismatch in file for "${slug}"`);
  }
  const inputs = candidate.inputs.filter(isInputField) as InputField[];
  const outputs = candidate.outputs.filter(isOutputField) as OutputField[];
  if (inputs.length !== candidate.inputs.length) {
    throw new Error(`One or more inputs invalid for "${slug}"`);
  }
  if (outputs.length !== candidate.outputs.length) {
    throw new Error(`One or more outputs invalid for "${slug}"`);
  }
  return {
    slug: candidate.slug,
    title: candidate.title,
    summary: isString(candidate.summary) ? candidate.summary : undefined,
    seo: { title: seo.title, description: seo.description },
    inputs,
    outputs,
    formula: candidate.formula,
    cta: isString(candidate.cta) ? candidate.cta : undefined,
    faq: Array.isArray(candidate.faq)
      ? (candidate.faq as { q?: unknown; a?: unknown }[])
          .filter((item) => isString(item.q) && isString(item.a))
          .map((item) => ({ q: item.q as string, a: item.a as string }))
      : undefined,
    tags: Array.isArray(candidate.tags)
      ? (candidate.tags as unknown[]).filter(isString)
      : undefined,
  };
};

export const listToolSlugs = (): string[] => {
  if (!fs.existsSync(toolsDir)) return [];
  return fs
    .readdirSync(toolsDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => file.replace(/\.json$/, ""));
};

export const loadToolConfig = (slug: string): ToolConfig | null => {
  const filePath = path.join(toolsDir, `${slug}.json`);
  const exists = fs.existsSync(filePath);
  if (!exists) {
    console.warn(`[tool-loader] Missing file for slug ${slug} at ${filePath}`);
    return null;
  }
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);
    const config = assertToolConfig(data, slug);
    console.log(`[tool-loader] Loaded slug ${slug} from ${filePath}`);
    return config;
  } catch (err) {
    console.error(`[tool-loader] Failed to load ${slug}:`, err);
    return null;
  }
};

export const loadAllToolConfigs = (): ToolConfig[] =>
  listToolSlugs()
    .map((slug) => loadToolConfig(slug))
    .filter((tool): tool is ToolConfig => Boolean(tool));
