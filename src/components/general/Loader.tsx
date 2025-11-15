export default function Loader(): JSX.Element {
  return (
    <div className="flex h-screen items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="relative flex flex-col items-center">
        {/* Brand Pulse / Inner Dot */}
        <div className="absolute w-4 h-4 bg-blue-500 rounded-full top-[calc(50%-0.5rem)] left-[calc(50%-0.5rem)] animate-ping" />
      </div>
    </div>
  );
}
