import React from 'react';
import { Tag, Box, Grid, Card, Text, MediaCard, BlockStack, InlineStack, Thumbnail, VideoThumbnail } from "@shopify/polaris";
import styles from './InjectionCard.module.css';

const InjectionCard = ({itemData}) => {
  const { imageUrl, linkUrl, text } = itemData;
  const isRedirect = linkUrl && linkUrl !== 'null';

  return (
    <div className={styles.Injection__container}>
      <div className={styles.Injection__label}>
        <Text variant="bodyXs" as="p" tone="subdued">
          Advertisement
        </Text>
      </div>

      <a
        href={linkUrl ?? "#"}
        target="_blank"
        style={{cursor: !isRedirect && "default"}}
        className={styles.Injection__content}
        onClick={(e) => !isRedirect && e.preventDefault()}
      >
        {
          imageUrl && imageUrl !== 'null' &&
            <div className={styles.Injection__media}>
              <img
                src={imageUrl}
                alt="Advertisement"
                style={{maxHeight: "inherit"}}
              />
            </div>
        }

        {
          text && text !== 'null' &&
            <Text variant="bodyLg" as="p">
              {text}
            </Text>
        }
      </a>
    </div>
  );
};

export default InjectionCard;