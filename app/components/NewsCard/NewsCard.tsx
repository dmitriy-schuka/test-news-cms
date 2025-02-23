import type {FC} from "react";
import React, { useMemo, useCallback } from 'react';
import { BlockStack, Card, InlineStack, Tag, Text } from "@shopify/polaris";
import { VALID_IMAGE_TYPES, VALID_VIDEO_TYPES } from "~/constants/common";
import { formatTimeAgo } from "~/utils/common";
import { useNavigate } from "@remix-run/react";
import DefaultImage from "~/assets/images/default-image.jpg";
import type { News } from "~/@types/news";
import styles from "./NewsCard.module.css";

interface INewsCardProps {
  newsItem: News;
  handleFilterByTags: (tags: string[]) => void;
  newsIndex?: number;
}

const NewsCard: FC<INewsCardProps> = ({ newsItem, handleFilterByTags, newsIndex }) => {
  const navigate = useNavigate();

  const newsMediaList = useMemo(() => {
    if (!newsItem?.media?.length) {
      return null;
    }

    return (
      newsItem.media.map((mediaItem, index) => {
        const mediaUrl = mediaItem?.url || DefaultImage;
        const mediaId = `news-media-${newsIndex}-${index}`;

        switch (true) {
          case VALID_IMAGE_TYPES.includes(mediaItem?.mediaType):
            return (
              <div key={mediaId} className={styles.NewsCard__media}>
                <img
                  src={mediaUrl}
                  alt="News media"
                  style={{maxHeight: "inherit"}}
                  loading="lazy"
                  aria-labelledby={`news-title-${newsIndex}`}
                />
              </div>
            )
          case VALID_VIDEO_TYPES.includes(mediaItem?.mediaType):
            return (
              <div key={mediaId} className={styles.NewsCard__media}>
                <BlockStack inlineAlign={"start"} align={"center"}>
                  <video
                    src={mediaUrl}
                    autoPlay
                    loop
                    className={styles.NewsCard__media}
                    aria-labelledby={`news-title-${newsIndex}`}
                  />
                </BlockStack>
              </div>
            )
          default:
            return null;
        }
      })
    );
  }, [newsItem.media, newsIndex]);

  const newsTagsList = useMemo(() => {
    if (!newsItem?.tags?.length) {
      return null;
    }

    return (
      newsItem.tags.map((tag, index) => (
        <Tag
          key={`${index}_${tag?.name}`} url="#"
          onClick={() => handleFilterByTags([tag?.id])}
        >
          {tag?.name}
        </Tag>
      ))
    )
  }, [newsItem.tags, handleFilterByTags]);

  return (
    <Card>
      <BlockStack gap={200}>
        <div
          className={styles.NewsCard__wrapper}
          onClick={() => navigate(`/app/publication/${newsItem?.id}`)}
          role="button"
          tabIndex={0}
          aria-labelledby={`news-title-${newsIndex}`}
        >
          <BlockStack gap={200}>
            <Text id={`news-title-${newsIndex}`} variant="headingLg" as="h5">
              {newsItem?.title}
            </Text>

            { newsMediaList }

            <Text variant="bodyLg" as="p">
              <span className={styles.NewsCard__content}>
                {newsItem?.content}
              </span>
            </Text>
          </BlockStack>
        </div>

        <InlineStack gap={100}>
          { newsTagsList }
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