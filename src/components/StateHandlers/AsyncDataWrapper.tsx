import { ReactNode, Suspense } from 'react';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';
import ShimmerHorizontalCards from '../shimmers/ShimmerHorizontalCards';
import { ZodError } from 'zod';

interface AsyncDataWrapperProps<T> {
    fetchData: () => Promise<T>;
    isEmpty?: (data: T) => boolean;
    children: (data: T) => ReactNode;

    loadingComponent?: ReactNode;
    emptyMessage?: string;
    errorMessage?: string;
}

// Separate async component to handle data fetching
async function AsyncContent<T>({
    fetchData,
    isEmpty = () => false,
    children,
    emptyMessage = "No data found",
    errorMessage = "Error loading data"
}: Pick<AsyncDataWrapperProps<T>, 'fetchData' | 'isEmpty' | 'children' | 'emptyMessage' | 'errorMessage'>) {
    try {
        const data = await fetchData();

        if (isEmpty(data)) {
            return <EmptyState message={emptyMessage} />;
        }

        return <>{children(data)}</>;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error loading data";
        return <ErrorState message={errorMessage} />;
    }
}

export default function AsyncDataWrapper<T>({
    fetchData,
    isEmpty,
    children,
    loadingComponent = <ShimmerHorizontalCards />,
    emptyMessage,
    errorMessage
}: AsyncDataWrapperProps<T>) {
    return (

        <Suspense fallback={loadingComponent}>
            <AsyncContent
                fetchData={fetchData}
                isEmpty={isEmpty}
                emptyMessage={emptyMessage}
                errorMessage={errorMessage}
            >
                {children}
            </AsyncContent>
        </Suspense>

    );
} 