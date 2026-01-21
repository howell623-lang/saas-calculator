"use client";

import { useMemo, useState, useEffect } from "react";
import { InputField, OutputField, ToolConfig, ToolResult } from "@/lib/types";
import { ResultChart } from "./charts/result-chart";

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

export function DynamicCalculator({ config }: Props) {
  const [formValues, setFormValues] = useState<Record<string, string>>(
    getInitialInputs(config.inputs)
  );
  const [result, setResult] = useState<ToolResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSteps, setShowSteps] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

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
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to compute result"; // brief guard
      setError(message);
    }
  };

  return (
    <div className="w-full space-y-8">
      <div className="grid gap-4 md:grid-cols-2">
        {config.inputs.map((input) => (
          <label
            key={input.id}
            className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/40 p-4 shadow-sm ring-1 ring-gray-200 backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <span className="text-sm font-medium text-gray-800">
              {input.label}
              {input.required ? " *" : ""}
            </span>
            <input
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-base text-gray-900 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
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

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <button
          type="button"
          onClick={handleSubmit}
          className="inline-flex items-center justify-center rounded-2xl bg-gray-900 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-gray-900/20 transition hover:-translate-y-0.5 hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          {config.cta || "Calculate"}
        </button>
        {error && (
          <p className="text-sm font-medium text-red-600">{error}</p>
        )}
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Results</h3>
          {result && config.calculationSteps && (
            <button
              onClick={() => setShowSteps(!showSteps)}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider transition"
            >
              {showSteps ? "Hide Logic" : "Show Logic"}
            </button>
          )}
        </div>
        {result ? (
          <>
            <dl className="mt-4 grid gap-3 md:grid-cols-2">
              {config.outputs.map((output) => (
                <div
                  key={output.id}
                  className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3"
                >
                  <dt className="text-sm text-gray-600">{output.label}</dt>
                  <dd className="text-xl font-semibold text-gray-900">
                    {formatValue(result[output.id], output)}{" "}
                    {output.unit ? (
                      <span className="text-sm font-normal text-gray-600">
                        {output.unit}
                      </span>
                    ) : null}
                  </dd>
                </div>
              ))}
            </dl>

            {config.chart && (
              <ResultChart config={config.chart} results={result} />
            )}
          </>
        ) : (
          <p className="mt-2 text-sm text-gray-600">
            Enter your inputs and run the calculation to see results.
          </p>
        )}

        {showSteps && result && config.calculationSteps && (
          <div className="mt-6 space-y-3 rounded-2xl bg-blue-50/50 p-5 ring-1 ring-blue-100">
            <h4 className="text-sm font-bold text-blue-900 uppercase tracking-widest">Calculation Steps</h4>
            <ol className="list-inside list-decimal space-y-2">
              {config.calculationSteps.map((step, i) => (
                <li key={i} className="text-sm text-blue-800 leading-relaxed">
                  {step}
                </li>
              ))}
            </ol>
            <p className="text-[10px] text-blue-400 mt-4 italic">
              Note: This logic is verified for accuracy based on industry-standard formulas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
