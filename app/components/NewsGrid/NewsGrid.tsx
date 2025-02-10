import React, { useCallback, useMemo } from 'react';
import { Tag, Box, Grid, Card, Text, BlockStack, InlineStack, Thumbnail, VideoThumbnail } from "@shopify/polaris";
import { checkIsArray, formatTimeAgo } from "~/utils/common";
import { VALID_IMAGE_TYPES, VALID_VIDEO_TYPES } from "~/constants/common";
import NewsMediaCard from "~/components/NewsGrid/components/NewsMediaCard/NewsMediaCard";
import DefaultImage from "~/assets/images/default-image.jpg";
import styles from './NewsGrid.module.css';
import NewsPagination from "~/components/NewsGrid/components/NewsPagination/NewsPagination";
import BlockTitle from "~/components/common/BlockTitle/BlockTitle";
import { useNavigate } from "@remix-run/react";
import InjectionCard from "~/components/InjectionCard/InjectionCard";

const NewsGrid = (props) => {
  const { news, latestNews, onSort, onNextPage, onPrevPage, hasNextPage, hasPrevPage, totalNews, page, handleFilterByTags } = props;
  const navigate = useNavigate();

  const renderNewsMedia = useCallback((newsMedia) => {
    return (
      newsMedia?.map((mediaItem, index) => {
        const mediaUrl = mediaItem?.url || DefaultImage;

        switch (true) {
          case VALID_IMAGE_TYPES.includes(mediaItem?.mediaType):
            return (
              <div key={`${index}-${mediaItem?.url}`} className={styles.News__media}>
                <img
                  src={mediaUrl}
                  alt="News media"
                  style={{/*maxWidth: "fit-content",*/ maxHeight: "inherit"}}
                />
              </div>
            )
          case VALID_VIDEO_TYPES.includes(mediaItem?.mediaType):
            return (
              <div key={`${index}-${mediaItem?.url}`} className={styles.News__media}>
                <BlockStack inlineAlign={"start"} align={"center"}>
                  <video
                    src={mediaUrl}
                    autoPlay
                    loop
                    className={styles.News__media}
                  />
                </BlockStack>
              </div>
            )
          default:
            return null;
        }
      })
    );
  }, [news]);

  const renderNewsTags = useCallback((tags) => {
    return (
      tags?.map((tag, index) => (
        <Tag
          key={`${index}_${tag?.name}`} url="#"
          onClick={() => handleFilterByTags([tag?.id])}
        >
          {tag?.name}
        </Tag>
      ))
    )
  }, [news, handleFilterByTags]);

  const renderNewsCards = useMemo(() => {
    return (
      news?.map((newsItem, index) => {
        return (
          <Grid.Cell key={`${index}_${newsItem?.title}_news`}>
            {
              newsItem?.hasOwnProperty("injectionType")
                ? <InjectionCard itemData={newsItem}/>
                :
                  <Card>
                    <BlockStack gap={200}>
                      <div className={styles.NewsCard__wrapper} onClick={() => navigate(`/app/publication/${newsItem?.id}`)}>
                        <BlockStack gap={200}>
                          <Text variant="headingLg" as="h5">
                            {newsItem?.title}
                          </Text>

                          {
                            checkIsArray(newsItem?.media) && renderNewsMedia(newsItem.media)
                          }

                          <Text variant="bodyLg" as="p">
                        <span className={styles.News__content}>
                          {newsItem?.content}
                        </span>
                          </Text>
                        </BlockStack>
                      </div>

                      <InlineStack gap={100}>
                        {
                          checkIsArray(newsItem?.tags) && renderNewsTags(newsItem.tags)
                        }
                      </InlineStack>

                      <Text variant="bodySm" as="p">
                        {
                          formatTimeAgo(newsItem?.createdAt)
                        }
                      </Text>
                    </BlockStack>
                  </Card>
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