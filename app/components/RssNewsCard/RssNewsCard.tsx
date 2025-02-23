import {
    Link,
    Box,
    BlockStack,
    Card,
    InlineStack,
    Text,
} from '@shopify/polaris';
import React from 'react';
import type { FC } from 'react';

import type { RssNews } from '~/@types/rssNews';

import styles from './RssNewsCard.module.css';

interface IRssNewsCardProps {
    rssNews: RssNews;
}

const RssNewsCard: FC<IRssNewsCardProps> = ({ rssNews }) => {
    return (
        <Box paddingInlineEnd={200}>
            <Box paddingBlockEnd={100}>
                <Text variant="bodyXs" as="p" tone="subdued">
                    Rss news
                </Text>
            </Box>

            <Link
                url={rssNews?.rssLink}
                removeUnderline
                monochrome
                target={'_blank'}
            >
                <Card>
                    <BlockStack gap={200}>
                        <Text variant="headingMd" as="h6">
                            {rssNews?.title}
                        </Text>

                        {rssNews.mediaUrl && (
                            <InlineStack align={'center'} blockAlign={'center'}>
                                <img
                                    src={rssNews.mediaUrl}
                                    alt="Rss news media"
                                    style={{ maxHeight: 'inherit' }}
                                    loading="lazy"
                                />
                            </InlineStack>
                        )}

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
