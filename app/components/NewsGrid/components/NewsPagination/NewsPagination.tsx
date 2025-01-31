import React from 'react';
import { InlineStack, Pagination } from "@shopify/polaris";

const NewsPagination = ({onNextPage, onPrevPage, hasNextPage, hasPrevPage, totalNews, page}) => {
  const maxPage = Math.ceil((Number(totalNews) / 8));
  const paginationLabel = `Page ${page} of ${maxPage}`;

  return (
    <InlineStack align={"center"}>
      <Pagination
        onNext={onNextPage}
        onPrevious={onPrevPage}
        type="page"
        hasNext={hasNextPage}
        hasPrevious={hasPrevPage}
        label={paginationLabel}
      />
    </InlineStack>
  );
};

export default NewsPagination;