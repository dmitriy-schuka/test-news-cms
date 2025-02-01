import React from 'react';
import { checkIsArray } from "~/utils/common";
import { MediaCard, Text, BlockStack } from "@shopify/polaris";
import { VALID_VIDEO_TYPES } from "~/constants/common";

const NewsMediaCard = ({ newsData }) => {
  const newsMedia = checkIsArray(newsData?.media) && newsData.media[0];

  return (
    <BlockStack>
      <Text variant="headingSm" as="h6">
        Latest news
      </Text>

      <MediaCard
        title={
          <Text variant="heading2xl" as="h3">
            {newsData?.title}
          </Text>
        }
        description={
          <Text variant="bodyLg" as="span">
            {newsData?.content}
          </Text>
        }
        portrait
        size={"small"}
      >
        {
          VALID_VIDEO_TYPES.includes(newsMedia?.mediaType)
            ?
              <video
                src={newsMedia?.url}
                autoPlay
                loop
              />
            :
              <img
                alt=""
                width="100%"
                height="100%"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
                src={newsMedia?.url}
              />
        }
      </MediaCard>
    </BlockStack>
  )
};

export default NewsMediaCard;