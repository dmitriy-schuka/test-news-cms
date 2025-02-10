import React from 'react';
import { Text } from "@shopify/polaris";
import styles from './InjectionCard.module.css';
import { INJECTION_TYPES } from "~/constants/common";
import NewsCard from "~/components/NewsCard/NewsCard";

const InjectionCard = ({itemData, handleFilterByTags}) => {
  const { imageUrl, linkUrl, text, injectionType, news } = itemData;
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

        {
          injectionType === INJECTION_TYPES[2].value && news &&
            <NewsCard newsItem={news} handleFilterByTags={handleFilterByTags}/>
        }
      </a>
    </div>
  );
};

export default InjectionCard;