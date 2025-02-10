import React, { useCallback } from 'react';
import { BlockStack, Card, InlineStack, Tag, Text } from "@shopify/polaris";
import { VALID_IMAGE_TYPES, VALID_VIDEO_TYPES } from "~/constants/common";
import { checkIsArray, formatTimeAgo } from "~/utils/common";
import { useNavigate } from "@remix-run/react";
import DefaultImage from "~/assets/images/default-image.jpg";
import styles from "./NewsCard.module.css";

const NewsCard = ({ newsItem, handleFilterByTags }) => {
  const navigate = useNavigate();

  const renderNewsMedia = useCallback((newsMedia) => {
    return (
      newsMedia?.map((mediaItem, index) => {
        const mediaUrl = mediaItem?.url || DefaultImage;

        switch (true) {
          case VALID_IMAGE_TYPES.includes(mediaItem?.mediaType):
            return (
              <div key={`${index}-${mediaItem?.url}`} className={styles.NewsCard__media}>
                <img
                  src={mediaUrl}
                  alt="News media"
                  style={{maxHeight: "inherit"}}
                />
              </div>
            )
          case VALID_VIDEO_TYPES.includes(mediaItem?.mediaType):
            return (
              <div key={`${index}-${mediaItem?.url}`} className={styles.NewsCard__media}>
                <BlockStack inlineAlign={"start"} align={"center"}>
                  <video
                    src={mediaUrl}
                    autoPlay
                    loop
                    className={styles.NewsCard__media}
                  />
                </BlockStack>
              </div>
            )
          default:
            return null;
        }
      })
    );
  }, [newsItem]);

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
  }, [newsItem, handleFilterByTags]);

  return (
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
              <span className={styles.NewsCard__content}>
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
  );
};

export default NewsCard;