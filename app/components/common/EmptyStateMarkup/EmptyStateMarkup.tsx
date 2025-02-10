import React from 'react';
import { EmptySearchResult } from "@shopify/polaris";

const EmptyStateMarkup = ({ resourceName }) => {
  return (
    <EmptySearchResult
      title={`No ${resourceName} yet`}
      description={'Try changing the filters or search term'}
      withIllustration
    />
  );
};

export default EmptyStateMarkup;