
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  // Generate page numbers to show (current, prev 1-2, next 1-2)
  // const getPageNumbers = () => {
  //   const pages = [];
    
  //   // Always include page 1
  //   pages.push(1);
    
  //   // Add ellipsis after page 1 if current page > 3
  //   if (currentPage > 3) {
  //     pages.push("ellipsis1");
  //   }
    
  //   // Add page before current if it exists and is not page 1
  //   if (currentPage - 1 > 1) {
  //     pages.push(currentPage - 1);
  //   }
    
  //   // Add current page if it's not page 1
  //   if (currentPage !== 1) {
  //     pages.push(currentPage);
  //   }
    
  //   // Add page after current if it exists and is not the last page
  //   if (currentPage + 1 < totalPages) {
  //     pages.push(currentPage + 1);
  //   }
    
  //   // Add ellipsis before last page if needed
  //   if (currentPage < totalPages - 2) {
  //     pages.push("ellipsis2");
  //   }
    
  //   // Always include last page if it's not page 1
  //   if (totalPages > 1) {
  //     pages.push(totalPages);
  //   }
    
  //   return pages;
  // };

  const getPageNumbers = () => {
    const pagesSet = new Set<number | string>();
  
    pagesSet.add(1);
  
    if (currentPage > 3) {
      pagesSet.add("ellipsis1");
    }
  
    if (currentPage - 1 > 1) {
      pagesSet.add(currentPage - 1);
    }
  
    if (currentPage !== 1 && currentPage !== totalPages) {
      pagesSet.add(currentPage);
    }
  
    if (currentPage + 1 < totalPages) {
      pagesSet.add(currentPage + 1);
    }
  
    if (currentPage < totalPages - 2) {
      pagesSet.add("ellipsis2");
    }
  
    if (totalPages > 1) {
      pagesSet.add(totalPages);
    }
  
    return Array.from(pagesSet);
  };
  

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </Button>
      
      {getPageNumbers().map((page, index) => {
        if (page === "ellipsis1" || page === "ellipsis2") {
          return (
            <span
              key={`ellipsis-${index}`}
              className="flex items-center justify-center h-9 w-9"
            >
              ...
            </span>
          );
        }
        
        return (
          <Button
            key={`page-${page}`}
            variant={currentPage === page ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(page as number)}
            className={currentPage === page ? "bg-primary" : ""}
          >
            {page}
          </Button>
        );
      })}
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </Button>
    </div>
  );
};

export default Pagination;
