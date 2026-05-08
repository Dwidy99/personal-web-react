type LoadingProps = {
  className?: string;
  message?: string;
  variant?: "card" | "inline" | "page";
};

export default function Loading({
  className = "",
  message = "Loading...",
  variant = "card",
}: LoadingProps) {
  const spinner = (
    <span
      aria-hidden="true"
      className="h-5 w-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary"
    />
  );

  if (variant === "inline") {
    return (
      <div
        role="status"
        className={`flex items-center gap-3 rounded-lg border border-stroke p-4 text-sm text-gray-500 dark:border-strokedark dark:text-gray-400 ${className}`}
      >
        {spinner}
        <span>{message}</span>
      </div>
    );
  }

  if (variant === "page") {
    return (
      <div
        role="status"
        className={`flex min-h-[16rem] flex-col items-center justify-center gap-3 text-sm text-gray-500 dark:text-gray-400 ${className}`}
      >
        {spinner}
        <span className="font-medium">{message}</span>
      </div>
    );
  }

  return (
    <div
      role="status"
      className={`rounded-lg border border-stroke bg-white p-8 text-center shadow-sm dark:border-strokedark dark:bg-boxdark ${className}`}
    >
      <div className="flex flex-col items-center justify-center gap-3 text-sm text-gray-500 dark:text-gray-400">
        {spinner}
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
}
