import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Card,
  IndexTable,
  Text,
  Box,
  Badge
} from "@shopify/polaris";
import { useSearchParams } from "@remix-run/react";
import EmptyStateMarkup from "~/components/common/EmptyStateMarkup/EmptyStateMarkup";
import styles from "./InjectionsTable.module.css";
import { checkIsArray } from "~/utils/common";

const InjectionsTable = ({ injections, page, sortDirection, sortColumn, hasNextPage, hasPreviousPage, handleInjectionEdit }) => {
  const [injectionItems, setInjectionItems] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const resourceName = {
    singular: "injection",
    plural: "injections",
  };

  useEffect(() => {
    if (injections && Array.isArray(injections)) {
      setInjectionItems(injections);
    }
  }, [injections, setInjectionItems]);

  const handleSort = useCallback(
    (_: number, direction: "ascending" | "descending") => {
      const sort = direction === "ascending" ? "asc" : "desc";
      setSearchParams({ sort, column: "id", page: "1" });
    },
    [setSearchParams],
  );

  const handleNextPage = useCallback(() => {
    setSearchParams({
      sort: sortDirection,
      column: sortColumn,
      page: String(page + 1),
    });
  }, [page, sortDirection, sortColumn, setSearchParams]);

  const handlePrevPage = useCallback(() => {
    setSearchParams({
      sort: sortDirection,
      column: sortColumn,
      page: String(page - 1),
    });
  }, [page, sortDirection, sortColumn, setSearchParams]);

  const rowMarkup = useMemo(() => {
    if (checkIsArray(injectionItems)) {
      return (
        injectionItems.map((injection, index) => {
          const { id, injectionType, imageUrl, linkUrl, text, newsId, isDraft, priority, displayOn, regex } = injection;

          return (
            <IndexTable.Row key={id} id={id} position={index} onClick={() => handleInjectionEdit(id)}>
              <IndexTable.Cell>
                <Text variant="bodyMd" as="span">
                  {injectionType}
                </Text>
              </IndexTable.Cell>

              <IndexTable.Cell>
                <Text variant="bodyMd" as="span">
                  {newsId}
                </Text>
              </IndexTable.Cell>

              <IndexTable.Cell>
                <Box maxWidth={"200px"} width={"100%"}>
                  {/*<p className={"truncate"}>*/}
                  <p className={styles.Text__truncate}>
                    {imageUrl}
                  </p>
                </Box>
              </IndexTable.Cell>

              <IndexTable.Cell>
                <Box maxWidth={"200px"} width={"100%"}>
                  {/*<p className={"truncate"}>*/}
                  <p className={styles.Text__truncate}>
                    {linkUrl}
                  </p>
                </Box>
              </IndexTable.Cell>

              <IndexTable.Cell flush>
                <Box maxWidth={"200px"} width={"100%"}>
                  {/*<p className={"truncate"}>*/}
                  <p className={styles.Text__truncate}>
                    {text}
                  </p>
                </Box>
              </IndexTable.Cell>

              <IndexTable.Cell>
                <Text variant="bodyMd" as="span">
                  {priority}
                </Text>
              </IndexTable.Cell>

              <IndexTable.Cell>
                <Text variant="bodyMd" as="span">
                  {displayOn}
                </Text>
              </IndexTable.Cell>

              <IndexTable.Cell>
                <Box maxWidth={"200px"} width={"100%"}>
                  {/*<p className={"truncate"}>*/}
                  <p className={styles.Text__truncate}>
                    {regex}
                  </p>
                </Box>
              </IndexTable.Cell>

              <IndexTable.Cell>
                <Badge tone={isDraft ? "success" : "critical"}>
                  {isDraft ? "TRUE" : "FALSE"}
                </Badge>
              </IndexTable.Cell>
            </IndexTable.Row>
          )
        })
      )
    } else {
      return [];
    }
  }, [injectionItems, handleInjectionEdit])

  return (
    <Box>
      <Card>
        <IndexTable
          resourceName={resourceName}
          itemCount={injectionItems?.length}
          headings={[
            { title: 'Type' },
            { title: 'News Id' },
            { title: 'Image Url' },
            { title: 'Link Url' },
            { title: 'Content' },
            { title: 'Priority' },
            { title: 'Display on' },
            { title: 'Regex' },
            { title: 'Is Draft' },
          ]}
          selectable={false}
          pagination={{
            hasPrevious: hasPreviousPage,
            hasNext: hasNextPage,
            onNext: () => handleNextPage(),
            onPrevious: () => handlePrevPage(),
          }}
          emptyState={
            <EmptyStateMarkup resourceName={resourceName.plural}/>
          }
          onSort={handleSort}
        >
          {rowMarkup}
        </IndexTable>
      </Card>
    </Box>
  );
};

export default InjectionsTable;