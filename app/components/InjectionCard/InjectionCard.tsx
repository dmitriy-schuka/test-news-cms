import React from 'react';
import type {FC} from "react";
import { Text } from "@shopify/polaris";
import type { News } from "~/@types/news";
import { INJECTION_TYPES } from "~/constants/common";
import NewsCard from "~/components/NewsCard/NewsCard";
import styles from './InjectionCard.module.css';

type InjectionItem = {
  imageUrl?: string | null;
  linkUrl?: string | null;
  text?: string | null;
  injectionType?: string;
  news?: News;
}

interface InjectionCardProps {
  itemData: InjectionItem;
  handleFilterByTags: (tags?: string) => void;
}

const InjectionCard: FC<InjectionCardProps> = ({itemData, handleFilterByTags}) => {
  const { imageUrl, linkUrl, text, injectionType, news } = itemData;
  const hasLink = linkUrl && linkUrl !== 'null';
  const Wrapper = hasLink ? "a" : "div";

  return (
    <div className={styles.Injection__container}>
      <div className={styles.Injection__label}>
        <Text variant="bodyXs" as="p" tone="subdued">
          Advertisement
        </Text>
      </div>

      <Wrapper
        {...(hasLink
          ? { href: linkUrl ?? "#", target: "_blank", "aria-label": "Advertisement" }
          : {})}
        style={{ cursor: hasLink ? "pointer" : "default" }}
        className={styles.Injection__content}
        onClick={(e) => !hasLink && e.preventDefault()}
      >
        {
          (imageUrl && imageUrl !== 'null') &&
            <div className={styles.Injection__media}>
              <img
                src={imageUrl}
                alt="Advertisement"
                style={{maxHeight: "inherit"}}
                loading="lazy"
              />
            </div>
        }

        {
          (text && text !== 'null') &&
            <Text variant="bodyLg" as="p">
              {text}
            </Text>
        }

        {
          (injectionType === INJECTION_TYPES[2].value && news) &&
            <NewsCard newsItem={news} handleFilterByTags={handleFilterByTags}/>
        }
      </Wrapper>
    </div>
  );
};

export default InjectionCard;