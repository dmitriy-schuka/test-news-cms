import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Card,
  InlineStack,
  Text,
  IndexTable,
  useIndexResourceState,
  Pagination,
  Thumbnail,
  EmptySearchResult,
  Tag,
  Badge,
} from "@shopify/polaris";
import { useSearchParams } from "@remix-run/react";
import { checkIsArray } from "~/utils/common";

const NewsTable = ({ news, page, sortDirection, sortColumn, hasNextPage, hasPreviousPage, handleNewsEdit }) => {
  const [sortedNews, setSortedNews] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const resourceName = {
    singular: "news",
    plural: "news",
  };

  useEffect(() => {
    if (news && Array.isArray(news)) {
      setSortedNews(news);
    }
  }, [news, setSortedNews]);

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

  const emptyStateMarkup = (
    <EmptySearchResult
      title={'No news yet'}
      description={'Try changing the filters or search term'}
      withIllustration
    />
  );

  const rowMarkup = useMemo(() => {
    if (checkIsArray(sortedNews)) {
      return (
        sortedNews.map((news, index) => {
          const { id, title, content, published, tags, media } = news;

          const tagsMarkup = tags.map((tag, index) => {
            return (
              <Tag key={`tag-${index}-${tag.name}`}>
                {tag.name}
              </Tag>
            )
          });

          return (
            <IndexTable.Row key={id} id={id} position={index} onClick={() => handleNewsEdit(id)} >
              <IndexTable.Cell>
                <Text variant="bodyMd" as="span">
                  {title}
                </Text>
              </IndexTable.Cell>

              <IndexTable.Cell flush>
                <Box maxWidth={"360px"} width={"100%"}>
                  <p className={"truncate"}>
                    {content}
                  </p>
                </Box>
              </IndexTable.Cell>

              <IndexTable.Cell>
                <Badge tone={published ? "success" : "critical"}>
                  {published ? "TRUE" : "FALSE"}
                </Badge>
              </IndexTable.Cell>

              <IndexTable.Cell>
                <InlineStack gap={200} align={"start"}>
                  {tagsMarkup}
                </InlineStack>
              </IndexTable.Cell>

              <IndexTable.Cell>
                <Thumbnail
                  source="https://burst.shopifycdn.com/photos/black-leather-choker-necklace_373x@2x.jpg"
                  alt="Black choker necklace"
                />
              </IndexTable.Cell>
            </IndexTable.Row>
          )
        })
      )
    } else {
      return []
    }
  }, [sortedNews, checkIsArray]);

  return (
    <Box>
      <Card>
        <IndexTable
          resourceName={resourceName}
          itemCount={sortedNews?.length}
          headings={[
            { title: 'Title' },
            { title: 'News content' },
            { title: 'Is published' },
            { title: 'News tags' },
            { title: 'Media' },
          ]}
          selectable={false}
          pagination={{
            hasPrevious: hasPreviousPage,
            hasNext: hasNextPage,
            onNext: () => handleNextPage(),
            onPrevious: () => handlePrevPage(),
          }}
          emptyState={emptyStateMarkup}
          onSort={handleSort}
        >
          {rowMarkup}
        </IndexTable>
      </Card>
    </Box>
  );
};

export default NewsTable;