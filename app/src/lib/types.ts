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

export type SEOConfig = {
  title: string;
  description: string;
};

export type FAQItem = {
  q: string;
  a: string;
};

export type ArticleSection = {
  heading: string;
  body: string;
};

export type ToolConfig = {
  slug: string;
  title: string;
  seo: SEOConfig;
  summary?: string;
  inputs: InputField[];
  outputs: OutputField[];
  formula: string;
  cta?: string;
  faq?: FAQItem[];
  tags?: string[];
  related?: string[];
  article?: ArticleSection[];
  calculationSteps?: string[];
};

export type ToolResult = Record<string, number | string>;
