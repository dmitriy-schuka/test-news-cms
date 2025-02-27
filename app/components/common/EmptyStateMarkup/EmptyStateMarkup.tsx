import { EmptySearchResult } from '@shopify/polaris';
import React from 'react';

const EmptyStateMarkup = ({ resourceName }: { resourceName: string }) => {
    return (
        <EmptySearchResult
            title={`No ${resourceName} yet`}
            description={'Try changing the filters or search term'}
            withIllustration
        />
    );
};

export default EmptyStateMarkup;
