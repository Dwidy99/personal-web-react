type LoadingProps = {
  className?: string;
  message?: string;
  variant?: "page" | "section" | "inline";
};

export default function Loading({
  className = "",
  message,
  variant = "page",
}: LoadingProps): JSX.Element {
  const spinner = (
    <span
      aria-hidden="true"
      className="h-5 w-5 animate-ping rounded-full bg-slate-900 dark:bg-white"
    />
  );

  if (variant === "inline") {
    return (
      <div
        role="status"
        className={`inline-flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 ${className}`}
      >
        {spinner}
        {message && <span>{message}</span>}
      </div>
    );
  }

  if (variant === "section") {
    return (
      <div
        role="status"
        className={`flex min-h-[10rem] flex-col items-center justify-center gap-3 p-6 text-sm text-gray-500 dark:text-gray-400 ${className}`}
      >
        {spinner}
        {message && <span>{message}</span>}
      </div>
    );
  }

  return (
    <div
      role="status"
      className={`flex h-screen items-center justify-center bg-white transition-colors duration-300 dark:bg-gray-900 ${className}`}
    >
      <div className="relative flex flex-col items-center">
        {spinner}
        {message && (
          <span className="mt-4 text-sm text-gray-500 dark:text-gray-400">{message}</span>
        )}
      </div>
    </div>
  );
}
