export type InputField = {
  id: string;
  label: string;
  type: "number" | "text" | "select";
  placeholder?: string;
  required?: boolean;
  step?: number;
  options?: string[];
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

export type ChartConfig = {
  type: "pie" | "bar" | "line";
  title?: string;
  data: {
    key: string; 
    label: string;
    color: string;
  }[];
  benchmarks?: {
    value: number;
    label: string;
    color: string;
  }[];
};

export type DiagnosticRule = {
  condition: string;
  message: string;
  type?: "warning" | "success" | "info";
};

export type GlossaryEntry = {
  term: string;
  definition: string;
  category: string;
  source?: string;
  relatedSlug?: string;
};

export type ToolConfig = {
  slug: string;
  title: string;
  seo: SEOConfig;
  summary?: string;
  isPremium?: boolean;
  author?: {
    name: string;
    role: string;
    avatar?: string;
  };
  aiContext?: string; 
  diagnostics?: DiagnosticRule[]; 
  inputs: InputField[];
  outputs: OutputField[];
  formula: string;
  cta?: string;
  faq?: FAQItem[];
  tags?: string[];
  related?: string[];
  article?: ArticleSection[];
  calculationSteps?: string[];
  chart?: ChartConfig;
  sources?: {
    name: string;
    url?: string;
  }[];
  reviewer?: {
    name: string;
    role: string;
    verificationDate: string;
  };
  updatedAt?: string;
};

export type ToolResult = Record<string, number | string>;
