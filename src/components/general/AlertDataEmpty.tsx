import { FileExclamationPoint } from "lucide-react";

interface AlertDataEmptyProps {
  message?: string;
  className?: string;
}

export default function AlertDataEmpty({
  message = "No data available.",
  className = "",
}: AlertDataEmptyProps) {
  return (
    <div
      className={`flex items-center gap-2 justify-center p-4 rounded-md bg-gray-50 border border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 ${className}`}
    >
      <FileExclamationPoint className="h-5 w-5 text-gray-500" />
      <span className="font-medium">{message}</span>
    </div>
  );
}
