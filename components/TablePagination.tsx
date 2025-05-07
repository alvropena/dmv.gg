import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function TablePagination({
  currentPage,
  totalPages,
  onPageChange,
}: TablePaginationProps) {
  return (
    <div className="my-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(currentPage - 1)}
              className={`cursor-pointer ${
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }`}
            />
          </PaginationItem>

          {(() => {
            const pageNumbers = [];
            const totalPagesToShow = 7;
            let startPage: number;
            let endPage: number;

            if (totalPages <= totalPagesToShow) {
              startPage = 1;
              endPage = totalPages;
            } else {
              if (currentPage <= 4) {
                startPage = 1;
                endPage = 7;
              } else if (currentPage >= totalPages - 3) {
                startPage = totalPages - 6;
                endPage = totalPages;
              } else {
                startPage = currentPage - 3;
                endPage = currentPage + 3;
              }
            }

            for (let i = startPage; i <= endPage; i++) {
              pageNumbers.push(
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => onPageChange(i)}
                    isActive={i === currentPage}
                    className="cursor-pointer"
                  >
                    {i}
                  </PaginationLink>
                </PaginationItem>
              );
            }

            return pageNumbers;
          })()}

          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(currentPage + 1)}
              className={`cursor-pointer ${
                currentPage === totalPages ? "pointer-events-none opacity-50" : ""
              }`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
} 