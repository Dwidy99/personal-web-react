import type { ButtonHTMLAttributes, ReactNode } from "react";

type SubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  loadingText?: string;
  icon?: ReactNode;
};

export default function SubmitButton({
  children,
  className = "",
  disabled,
  icon,
  loading = false,
  loadingText = "Saving...",
  type = "submit",
  ...props
}: SubmitButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading}
      className={`inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent"
        />
      ) : (
        icon && <span className="mr-2 inline-flex items-center">{icon}</span>
      )}
      <span>{loading ? loadingText : children}</span>
    </button>
  );
}
