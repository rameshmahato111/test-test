'use client'
import React, { useState, useEffect, useCallback } from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

interface CustomPaginationProps {
    totalPages: number;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
    totalPages,
}) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const getCurrentPage = useCallback(() => {
        return parseInt(searchParams.get('page') || '1', 10);
    }, [searchParams]);

    const [currentPage, setCurrentPage] = useState(getCurrentPage());

    useEffect(() => {
        setCurrentPage(getCurrentPage());
    }, [getCurrentPage]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        const queryString = createQueryString('page', newPage.toString());
        router.push(`${pathname}?${queryString}`);
    };

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set(name, value)
            return params.toString()
        },
        [searchParams]
    )

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 3;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            pageNumbers.push(
                <PaginationItem key={1}>
                    <PaginationLink className='max-sm:w-8 max-sm:h-8' onClick={() => handlePageChange(1)}>
                        1
                    </PaginationLink>
                </PaginationItem>
            );
            if (startPage > 2) {
                pageNumbers.push(
                    <PaginationItem key="ellipsis-start">
                        <PaginationEllipsis className='max-sm:w-5 max-sm:h-5' />
                    </PaginationItem>
                );
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        onClick={() => handlePageChange(i)}
                        isActive={currentPage === i}
                        className={`max-sm:w-8 max-sm:h-8 ${currentPage === i ? 'bg-primary-400 text-background' : ''}`}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pageNumbers.push(
                    <PaginationItem key="ellipsis-end">
                        <PaginationEllipsis className='max-sm:w-5 max-sm:h-5' />
                    </PaginationItem>
                );
            }
            pageNumbers.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink className='max-sm:w-8 max-sm:h-8' onClick={() => handlePageChange(totalPages)}>
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return pageNumbers;
    };

    return (
        <Pagination className=''>
            <PaginationContent className=' md:gap-3'>
                <PaginationItem>
                    <PaginationPrevious
                        className={`border-primary-400 max-sm:px-2 max-sm:py-1  border-2 duration-300 text-primary-400 font-semibold ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    />
                </PaginationItem>
                {renderPageNumbers()}
                <PaginationItem>
                    <PaginationNext
                        className={`border-primary-400 max-sm:px-2 max-sm:py-1  border-2 duration-300 text-primary-400 font-semibold ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

export default CustomPagination;
