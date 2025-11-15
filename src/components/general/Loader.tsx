export default function Loader(): JSX.Element {
  return (
    <div className="flex h-screen items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="relative flex flex-col items-center">
        {/* Outer Spinner */}
        <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 rounded-full animate-spin" />

        {/* Brand Pulse / Inner Dot */}
        <div className="absolute w-4 h-4 bg-blue-500 rounded-full top-[calc(50%-0.5rem)] left-[calc(50%-0.5rem)] animate-ping" />

        {/* Subtle Text */}
        <p className="mt-6 text-gray-600 dark:text-gray-400 font-medium tracking-wide animate-pulse">
          Loading, please wait...
        </p>
      </div>
    </div>
  );
}
