import React, { ReactNode } from 'react';
import ErrorBoundary from '../ErrorBoundary';

interface DataStateHandlerProps {
    isLoading?: boolean;
    isEmpty?: boolean;
    error?: Error | null;
    loadingComponent: ReactNode;
    emptyComponent: ReactNode;
    errorComponent?: ReactNode;
    children: ReactNode;
}

const DataStateHandler = ({
    isLoading,
    isEmpty,
    error,
    loadingComponent,
    emptyComponent,
    errorComponent = <div>Something went wrong</div>,
    children
}: DataStateHandlerProps) => {
    // First check loading state
    if (isLoading) {
        return <>{loadingComponent}</>;
    }

    // Then check error state
    if (error) {
        return <>{errorComponent}</>;
    }

    // Then check empty state
    if (isEmpty) {
        return <>{emptyComponent}</>;
    }

    // Finally render children
    return <>{children}</>;
};

export const withDataStateHandler = (
    WrappedComponent: React.ComponentType<any>,
    loadingComponent: ReactNode,
    emptyComponent: ReactNode,
    errorComponent?: ReactNode
) => {
    return function WithDataStateHandler(props: any) {
        return (
            <ErrorBoundary fallback={errorComponent}>
                <DataStateHandler
                    loadingComponent={loadingComponent}
                    emptyComponent={emptyComponent}
                    errorComponent={errorComponent}
                    {...props}
                >
                    <WrappedComponent {...props} />
                </DataStateHandler>
            </ErrorBoundary>
        );
    };
};

export default DataStateHandler; 