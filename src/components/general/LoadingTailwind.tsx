export default function LoadingTailwind(): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      {/* Spinner */}
      <div className="relative flex items-center justify-center">
        {/* Outer circle (track) */}
        <div className="w-10 h-10 border-4 border-gray-200 dark:border-gray-700 rounded-full" />
        {/* Rotating highlight */}
        <div className="absolute w-10 h-10 border-4 border-t-blue-500 border-transparent rounded-full animate-spin" />
      </div>

      {/* Text */}
      <p className="mt-3 text-gray-700 dark:text-gray-300 font-medium text-sm tracking-wide animate-pulse">
        Loading...
      </p>
    </div>
  );
}
