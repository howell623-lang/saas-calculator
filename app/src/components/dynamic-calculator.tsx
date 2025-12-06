"use client";

import { useMemo, useState } from "react";
import { InputField, OutputField, ToolConfig, ToolResult } from "@/lib/types";

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
  const argNames = Object.keys(inputs);
  const argValues = Object.values(inputs);
  const runner = new Function(...argNames, formula);
  const result = runner(...argValues);
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
        <h3 className="text-lg font-semibold text-gray-900">Results</h3>
        {result ? (
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
        ) : (
          <p className="mt-2 text-sm text-gray-600">
            Enter your inputs and run the calculation to see results.
          </p>
        )}
      </div>
    </div>
  );
}
