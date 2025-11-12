interface PaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  previousLabel?: string;
  nextLabel?: string;
  pageRangeDisplayed?: number;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
  previousLabel = "Previous",
  nextLabel = "Next",
  pageRangeDisplayed = 5,
  className = "",
}: PaginationProps) {
  const totalPages = Math.ceil(totalCount / pageSize);
  const startPage = Math.max(1, currentPage - Math.floor(pageRangeDisplayed / 2));
  const endPage = Math.min(totalPages, startPage + pageRangeDisplayed - 1);

  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) onPageChange(page);
  };

  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination Navigation" className={`flex justify-center mt-6 ${className}`}>
      <ul className="inline-flex -space-x-px text-sm rounded-md overflow-hidden border border-gray-300 dark:border-gray-700">
        {/* Previous */}
        <li>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-2 text-gray-500 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {previousLabel}
          </button>
        </li>

        {/* Page Numbers */}
        {pages.map((page) => (
          <li key={page}>
            <button
              onClick={() => handlePageChange(page)}
              className={`px-3 py-2 border-l border-gray-300 dark:border-gray-700 ${
                page === currentPage
                  ? "bg-blue-600 text-white font-semibold"
                  : "bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {page}
            </button>
          </li>
        ))}

        {/* Next */}
        <li>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 border-l border-gray-300 dark:border-gray-700 text-gray-500 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {nextLabel}
          </button>
        </li>
      </ul>
    </nav>
  );
}
