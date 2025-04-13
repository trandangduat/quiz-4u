import { ClipboardList } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, index) => (
          <div key={index} className="bg-gray-100 dark:bg-gray-800 rounded-md p-6 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-4">
                <ClipboardList size={32} strokeWidth={1.25} className="text-gray-300 dark:text-gray-600" />
              </div>
              <div className="flex flex-col items-start gap-1 w-full">
                <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}