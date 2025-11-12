const Pagination = ({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
  previousLabel = "Previous",
  nextLabel = "Next",
  pageRangeDisplayed = 5,
  className = "",
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);
  const startPage = Math.max(
    1,
    currentPage - Math.floor(pageRangeDisplayed / 2)
  );
  const endPage = Math.min(totalPages, startPage + pageRangeDisplayed - 1);

  // Create an array of page numbers to display
  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <nav aria-label="Page navigation" className={className}>
      <ul className="inline-flex -space-x-px text-sm">
        {/* Previous Button */}
        <li>
          <a
            href="#"
            onClick={() => handlePageChange(currentPage - 1)}
            className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            disabled={currentPage === 1}
          >
            {previousLabel}
          </a>
        </li>

        {/* Page Number Buttons */}
        {pages.map((page) => (
          <li key={page}>
            <a
              href="#"
              onClick={() => handlePageChange(page)}
              className={`flex items-center justify-center px-3 h-8 leading-tight ${
                page === currentPage
                  ? "text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                  : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              }`}
            >
              {page}
            </a>
          </li>
        ))}

        {/* Next Button */}
        <li>
          <a
            href="#"
            onClick={() => handlePageChange(currentPage + 1)}
            className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            disabled={currentPage === totalPages}
          >
            {nextLabel}
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
