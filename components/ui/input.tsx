import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      label,
      hint,
      error,
      id,
      className = "",
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hintId = `${inputId}-hint`;
    const errorId = `${inputId}-error`;
    const describedBy = [
      ariaDescribedBy,
      hint ? hintId : undefined,
      error ? errorId : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

    return (
      <div className="grid gap-2">
        {label ? (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-foreground"
          >
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={`min-h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm text-foreground shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-muted/80 hover:border-muted/60 focus:border-ring focus:ring-4 focus:ring-ring/15 disabled:cursor-not-allowed disabled:opacity-60 ${error ? "border-danger focus:border-danger focus:ring-danger/15" : ""} ${className}`}
          {...props}
          aria-invalid={error ? true : ariaInvalid}
          aria-describedby={describedBy}
        />
        {hint ? (
          <p id={hintId} className="text-xs leading-relaxed text-muted">
            {hint}
          </p>
        ) : null}
        {error ? (
          <p id={errorId} className="text-xs leading-relaxed text-danger">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
