import React, { useMemo } from 'react';
import { Box, Grid, BlockStack } from "@shopify/polaris";
import NewsMediaCard from "~/components/NewsGrid/components/NewsMediaCard/NewsMediaCard";
import NewsPagination from "~/components/NewsGrid/components/NewsPagination/NewsPagination";
import BlockTitle from "~/components/common/BlockTitle/BlockTitle";
import { useNavigate } from "@remix-run/react";
import InjectionCard from "~/components/InjectionCard/InjectionCard";
import NewsCard from "~/components/NewsCard/NewsCard";

const NewsGrid = (props) => {
  const { news, latestNews, onSort, onNextPage, onPrevPage, hasNextPage, hasPrevPage, totalNews, page, handleFilterByTags } = props;
  const navigate = useNavigate();

  const renderNewsCards = useMemo(() => {
    return (
      news?.map((newsItem, index) => {
        return (
          <Grid.Cell key={`${index}_${newsItem?.title}_news`}>
            {
              newsItem?.hasOwnProperty("injectionType")
                ? <InjectionCard itemData={newsItem} handleFilterByTags={handleFilterByTags}/>
                : <NewsCard newsItem={newsItem} handleFilterByTags={handleFilterByTags}/>
            }
          </Grid.Cell>
        )
      })
    )
  }, [news]);

  return (
    <Box paddingBlockStart={400}>
      <BlockStack gap={800}>
        {
          latestNews &&
            <div style={{cursor: "pointer"}} onClick={() => navigate(`/app/publication/${latestNews?.id}`)}>
              <NewsMediaCard newsData={latestNews} />
            </div>
        }

        <BlockStack>
          <BlockTitle title={"Main news"} />

          <Grid columns={{xs: 1, sm: 1, md: 2, lg: 4, xl: 4}}>
            {renderNewsCards}
          </Grid>
        </BlockStack>

        <NewsPagination
          page={page}
          onNextPage={onNextPage}
          onPrevPage={onPrevPage}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          totalNews={totalNews}
        />
      </BlockStack>
    </Box>
  );
};

export default NewsGrid;