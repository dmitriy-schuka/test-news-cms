import React from 'react';
import { Link, Box, BlockStack, Card, InlineStack, Text } from "@shopify/polaris";
import styles from "./RssNewsCard.module.css";

const RssNewsCard = ({ rssNews }) => {
  return (
    <Box paddingInlineEnd={200}>
      <Box paddingBlockEnd={100}>
        <Text variant="bodyXs" as="p" tone="subdued">
          Rss news
        </Text>
      </Box>

      <Link url={rssNews?.rssLink} removeUnderline monochrome target={'_blank'}>
        <Card>
          <BlockStack gap={200}>
            <Text variant="headingMd" as="h6">
              {rssNews?.title}
            </Text>

            {
              rssNews.mediaUrl &&
                <InlineStack align={"center"} blockAlign={"center"}>
                  <img
                    src={rssNews.mediaUrl}
                    alt="Rss news media"
                    style={{maxHeight: "inherit"}}
                  />
                </InlineStack>
            }

            <Text variant="bodyMd" as="p">
            <span className={styles.NewsCard__content}>
              {rssNews?.content}
            </span>
            </Text>
          </BlockStack>
        </Card>
      </Link>
    </Box>
  );
};

export default RssNewsCard;