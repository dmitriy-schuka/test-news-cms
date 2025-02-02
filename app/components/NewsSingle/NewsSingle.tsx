import React, { useCallback, useMemo } from 'react';
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  Tag,
} from "@shopify/polaris";
import { checkIsArray, formatTimeAgo } from "~/utils/common";
import { VALID_IMAGE_TYPES, VALID_VIDEO_TYPES } from "~/constants/common";
import styles from './NewsSingle.module.css';

const NewsSingle = ({ newsData }) => {
  const renderNewsMedia = useMemo(() => {
    return (
      newsData?.media?.map((mediaItem, index) => {
        const mediaUrl = mediaItem?.url;
        const mediaType = mediaItem?.mediaType;

        switch (true) {
          case VALID_IMAGE_TYPES.includes(mediaType):
            return (
              <div key={`${index}-${mediaItem?.url}`} className={styles.News__media}>
                <img
                  src={mediaUrl}
                  alt="News media"
                  style={{/*maxWidth: "fit-content",*/ maxHeight: "inherit"}}
                />
              </div>
            )
          case VALID_VIDEO_TYPES.includes(mediaType):
            return (
              <div key={`${index}-${mediaItem?.url}`} className={styles.News__media}>
                <BlockStack inlineAlign={"start"} align={"center"}>
                  <video
                    src={mediaUrl}
                    autoPlay
                    loop
                  />
                </BlockStack>
              </div>
            )
        }
      })
    );
  }, [newsData?.media]);

  const renderNewsTags = useCallback((tags) => {
    return (
      tags?.map((tag, index) => (
        <Tag key={`${index}_${tag?.name}`}>
          {tag?.name}
        </Tag>
      ))
    )
  }, [newsData?.tags]);

  return (
    <BlockStack gap={400}>
      {
        checkIsArray(newsData?.media) && renderNewsMedia
      }

      <Card>
        <Text variant="bodyLg" as="p">
          {newsData?.content}
        </Text>
      </Card>

      {
        checkIsArray(newsData?.tagsData) &&
          <InlineStack gap={100}>
            {
              renderNewsTags(newsData.tagsData)
            }
          </InlineStack>
      }

      <Text variant="bodySm" as="p">
        {
          formatTimeAgo(newsData?.createdAt)
        }
      </Text>
    </BlockStack>
  );
};

export default NewsSingle;