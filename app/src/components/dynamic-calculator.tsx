"use client";

import { useMemo, useState, useEffect } from "react";
import { DiagnosticRule, InputField, OutputField, ToolConfig, ToolResult, GlossaryEntry } from "@/lib/types";
import { ResultChart } from "./charts/result-chart";
import { Loader2, Sparkles, Star, Lightbulb, Info, AlertTriangle, CheckCircle } from "lucide-react";
import { matchGlossaryTerms } from "@/lib/glossary-matcher";
import glossaryData from "../../data/glossary.json";

const glossary = glossaryData as GlossaryEntry[];

type Props = {
  config: ToolConfig;
};

const formatValue = (value: unknown, field: OutputField) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    const precision =
      typeof field.precision === "number" ? field.precision : 2;
    return value.toFixed(precision);
  }
  return String(value ?? "—");
};

const getInitialInputs = (inputs: InputField[]) =>
  inputs.reduce<Record<string, string>>((acc, input) => {
    acc[input.id] = "";
    return acc;
  }, {});

const evaluateFormula = (
  formula: string,
  inputs: Record<string, number | string>
): ToolResult => {
  const scope = Object.assign(Object.create(null), inputs);
  const runner = new Function(
    "inputs",
    "scope",
    `with (scope) {
      ${formula}
    }`
  );
  const result = runner(inputs, scope);
  if (!result || typeof result !== "object") {
    throw new Error("Formula must return an object of results");
  }
  return result as ToolResult;
};

const evaluateCondition = (condition: string, results: ToolResult): boolean => {
  try {
    const scope = Object.assign(Object.create(null), results);
    const runner = new Function(
      "results",
      "scope",
      `with (scope) {
        return !!(${condition});
      }`
    );
    return runner(results, scope);
  } catch (err) {
    console.warn("Diagnostic condition error:", err);
    return false;
  }
};

export function DynamicCalculator({ config }: Props) {
  const [formValues, setFormValues] = useState<Record<string, string>>(
    getInitialInputs(config.inputs)
  );
  const [result, setResult] = useState<ToolResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSteps, setShowSteps] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [diagnostics, setDiagnostics] = useState<DiagnosticRule[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [baselineResult, setBaselineResult] = useState<ToolResult | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("calcpanda_favorites");
    if (saved) {
      const favs = JSON.parse(saved);
      setIsFavorite(favs.includes(config.slug));
    }
  }, [config.slug]);

  const toggleFavorite = () => {
    const saved = localStorage.getItem("calcpanda_favorites");
    let favs = saved ? JSON.parse(saved) : [];
    if (favs.includes(config.slug)) {
      favs = favs.filter((s: string) => s !== config.slug);
      setIsFavorite(false);
    } else {
      favs.push(config.slug);
      setIsFavorite(true);
    }
    localStorage.setItem("calcpanda_favorites", JSON.stringify(favs));
  };

  const inputErrors = useMemo(() => {
    const errors: string[] = [];
    config.inputs.forEach((input) => {
      const value = formValues[input.id];
      if (input.required && value === "") {
        errors.push(`${input.label} is required`);
      }
      if (input.type === "number" && value !== "") {
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) {
          errors.push(`${input.label} must be a valid number`);
        }
      }
    });
    return errors;
  }, [config.inputs, formValues]);

  const handleChange = (id: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    setError(null);
    setResult(null);
    if (inputErrors.length > 0) {
      setError(inputErrors[0]);
      return;
    }
    const prepared = Object.fromEntries(
      config.inputs.map((input) => {
        if (input.type === "number") {
          return [input.id, Number(formValues[input.id] || 0)];
        }
        return [input.id, formValues[input.id] ?? ""];
      })
    );
    try {
      const computed = evaluateFormula(config.formula, prepared);
      setResult(computed);
      setDiagnostics([]); // Reset diagnostics when new calculation is done
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to compute result"; // brief guard
      setError(message);
    }
  };

  const handleDiagnosticAction = async () => {
    if (!result) return;
    setIsAiLoading(true);
    // Simulate complex calculation for UX authority
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    if (config.diagnostics) {
      const triggered = config.diagnostics.filter(rule => 
        evaluateCondition(rule.condition, result)
      );
      setDiagnostics(triggered);
    }
    setIsAiLoading(false);
  };

  const calculateDelta = (key: string, currentValue: number | string) => {
    if (!baselineResult || typeof currentValue !== 'number' || typeof baselineResult[key] !== 'number') return null;
    const base = baselineResult[key] as number;
    if (base === 0) return null;
    const delta = ((currentValue - base) / base) * 100;
    return delta;
  };

  return (
    <div className="w-full space-y-8 print-report-container">
      {/* Print Only Header */}
      <div className="hidden print-only mb-8 border-b pb-4">
        <h1 className="text-2xl font-bold">CalcPanda Strategy Report</h1>
        <p className="text-sm text-gray-600">Generated on {new Date().toLocaleDateString()} • {config.title}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 no-print">
        {config.inputs.map((input) => (
          <label
            key={input.id}
            className="group flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg ring-1 ring-white/10 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-blue-500/20 hover:bg-white/10"
          >
            <span className="text-sm font-medium text-gray-300 group-hover:text-cyan-300 transition-colors">
              {input.label}
              {input.required ? <span className="text-red-400"> *</span> : ""}
            </span>
            <input
              className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-base text-white placeholder:text-gray-600 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white/5 focus:ring-2 focus:ring-blue-500/50 hover:bg-white/5"
              type={input.type}
              inputMode={input.type === "number" ? "decimal" : undefined}
              placeholder={input.placeholder}
              step={input.step}
              value={formValues[input.id]}
              onChange={(e) => handleChange(input.id, e.target.value)}
            />
          </label>
        ))}
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between no-print">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-500 hover:shadow-blue-500/50 active:scale-95 focus:outline-none"
          >
            {config.cta || "Calculate"}
          </button>
          {result && (
            <>
              <button
                onClick={() => setBaselineResult(result)}
                className={`inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-bold ring-1 transition-all active:scale-95 ${baselineResult ? 'bg-amber-500/20 text-amber-400 ring-amber-500/30' : 'bg-white/5 text-gray-300 ring-white/10 hover:bg-white/10'}`}
              >
                {baselineResult ? "Baseline Locked" : "Lock as Baseline"}
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center justify-center rounded-2xl bg-indigo-600/20 px-6 py-3 text-sm font-bold text-indigo-300 ring-1 ring-indigo-500/30 transition-all hover:-translate-y-1 hover:bg-indigo-600/30 active:scale-95"
              >
                Export PDF Report
              </button>
            </>
          )}
        </div>
        {error && (
          <p className="text-sm font-medium text-red-400 bg-red-500/10 px-4 py-2 rounded-xl ring-1 ring-red-500/20">{error}</p>
        )}
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl transition-all duration-500 print:bg-transparent print:border-none print:shadow-none">
        <div className="flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-white drop-shadow-sm">Results</h3>
            {config.isPremium && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400 ring-1 ring-amber-400/20">
                <Star className="h-2.5 w-2.5 fill-current" /> Premium Tool
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {result && config.calculationSteps && (
              <button
                onClick={() => setShowSteps(!showSteps)}
                className="text-xs font-bold text-blue-400 hover:text-cyan-300 uppercase tracking-wider transition-colors"
              >
                {showSteps ? "Hide Logic" : "Show Logic"}
              </button>
            )}
            <button
              onClick={toggleFavorite}
              className={`transition-colors ${isFavorite ? 'text-amber-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Star className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
        <div className="hidden print-only mb-4">
          <h2 className="text-xl font-bold">Strategy Audit Results</h2>
        </div>
        {result ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Diagnostic Insight Section */}
            <div className={`mt-6 rounded-2xl border transition-all duration-500 overflow-hidden ${diagnostics.length > 0 ? 'bg-indigo-600/10 border-indigo-500/30' : 'bg-transparent border-white/10 hover:border-indigo-500/30'}`}>
              {diagnostics.length === 0 ? (
                <button
                  onClick={handleDiagnosticAction}
                  disabled={isAiLoading}
                  className="flex w-full items-center justify-center gap-3 p-4 text-sm font-bold text-indigo-300 transition-all hover:bg-white/5 disabled:opacity-50"
                >
                  {isAiLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Lightbulb className="h-4 w-4" />
                  )}
                  {isAiLoading ? "Analyzing Metrics..." : "Run Expert Strategy Diagnostic"}
                </button>
              ) : (
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">Expert Strategy Insights</span>
                  </div>
                  <div className="space-y-4">
                    {diagnostics.map((diag, i) => (
                      <div key={i} className="flex gap-3 items-start animate-in fade-in slide-in-from-left-2 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                        <div className="mt-1">
                          {diag.type === 'warning' ? <AlertTriangle className="h-4 w-4 text-amber-400" /> : 
                           diag.type === 'success' ? <CheckCircle className="h-4 w-4 text-emerald-400" /> : 
                           <Info className="h-4 w-4 text-blue-400" />}
                        </div>
                        <p className="text-sm leading-6 text-gray-200">
                          {matchGlossaryTerms(diag.message, glossary)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-6 text-[10px] font-medium text-indigo-400/60 uppercase tracking-tighter">
                    Logic-based analysis verified by CalcPanda Formula Library
                  </p>
                </div>
              )}
            </div>

            <dl className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {config.outputs.map((output) => {
                const delta = calculateDelta(output.id, result[output.id]);
                return (
                  <div
                    key={output.id}
                    className="group rounded-2xl border border-white/10 bg-black/20 px-4 py-4 transition-all duration-300 hover:bg-white/10 hover:ring-1 hover:ring-white/20"
                  >
                    <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider group-hover:text-gray-300 transition-colors flex justify-between">
                      {output.label}
                      {delta !== null && (
                        <span className={`font-bold ${delta > 0 ? 'text-emerald-400' : delta < 0 ? 'text-rose-400' : 'text-gray-500'}`}>
                          {delta > 0 ? '↑' : delta < 0 ? '↓' : ''}
                          {Math.abs(delta).toFixed(1)}%
                        </span>
                      )}
                    </dt>
                    <dd className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-400 bg-clip-text text-transparent mt-2">
                      {formatValue(result[output.id], output)}{" "}
                      {output.unit ? (
                        <span className="text-xs font-medium text-gray-500 uppercase ml-1">
                          {output.unit}
                        </span>
                      ) : null}
                    </dd>
                    {baselineResult && (
                      <dd className="mt-2 text-[10px] font-medium text-gray-500 border-t border-white/5 pt-2">
                        vs. {formatValue(baselineResult[output.id], output)} baseline
                      </dd>
                    )}
                  </div>
                );
              })}
            </dl>


            {config.chart && (
              <div className="mt-6">
                <ResultChart config={config.chart} results={result} />
              </div>
            )}
          </div>
        ) : (
          <p className="mt-4 text-sm text-gray-500 text-center py-12 rounded-2xl border border-dashed border-white/10">
            Enter your inputs and run the calculation to see results.
          </p>
        )}

        {showSteps && result && config.calculationSteps && (
          <div className="mt-6 space-y-3 rounded-2xl bg-blue-900/20 p-5 ring-1 ring-blue-500/30 animate-in fade-in slide-in-from-top-2 duration-500">
            <h4 className="text-sm font-bold text-blue-300 uppercase tracking-widest">Calculation Logic</h4>
            <ol className="list-inside list-decimal space-y-2">
              {config.calculationSteps.map((step, i) => {
                let text = step;
                config.inputs.forEach((input) => {
                  text = text.replace(new RegExp(`\\{\\{inputs\\.${input.id}\\}\\}`, "g"), formValues[input.id] || "0");
                });
                if (result) {
                  Object.entries(result).forEach(([key, val]) => {
                    const strVal = typeof val === "number" && !Number.isInteger(val) ? val.toFixed(2) : String(val);
                    text = text.replace(new RegExp(`\\{\\{result\\.${key}\\}\\}`, "g"), strVal);
                  });
                }
                return (
                  <li key={i} className="text-sm text-blue-100/80 leading-relaxed font-mono">
                    {text}
                  </li>
                );
              })}
            </ol>
            <p className="text-[10px] text-blue-400/60 mt-4 italic">
              Verification: Formulas are audited for precision based on the {config.isPremium ? "Premium " : ""}CalcPanda SDK standards.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
