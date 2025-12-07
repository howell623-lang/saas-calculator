export type InputField = {
  id: string;
  label: string;
  type: "number" | "text";
  placeholder?: string;
  required?: boolean;
  step?: number;
};

export type OutputField = {
  id: string;
  label: string;
  unit?: string;
  precision?: number;
};

export type SeoBlock = {
  title: string;
  description: string;
};

export type ToolConfig = {
  slug: string;
  title: string;
  summary?: string;
  seo: SeoBlock;
  inputs: InputField[];
  outputs: OutputField[];
  formula: string;
  cta?: string;
  faq?: { q: string; a: string }[];
  tags?: string[];
  related?: string[];
  article?: { heading: string; body: string }[];
};

export type ToolResult = Record<string, number | string>;
