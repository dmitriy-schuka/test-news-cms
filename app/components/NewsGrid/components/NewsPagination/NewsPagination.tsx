import React from 'react';
import type {FC} from "react";
import { InlineStack, Pagination } from "@shopify/polaris";
import styles from './NewsPagination.module.css';

interface INewsPaginationProps {
  onNextPage: () => void;
  onPrevPage: () => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalNews: number;
  page: number;
}

const NewsPagination: FC<INewsPaginationProps> = ({onNextPage, onPrevPage, hasNextPage, hasPrevPage, totalNews, page}) => {
  const maxPage = Math.max(1, Math.ceil(totalNews / 8));
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
      >
        <span aria-live="polite" className={styles.PaginationLabel__hidden}>
          {paginationLabel}
        </span>
      </Pagination>
    </InlineStack>
  );
};

export default NewsPagination;