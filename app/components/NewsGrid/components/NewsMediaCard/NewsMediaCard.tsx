import { MediaCard, Text, BlockStack } from '@shopify/polaris';
import React, { useMemo } from 'react';
import type { FC } from 'react';

import type { News } from '~/@types/news';
import BlockTitle from '~/components/common/BlockTitle/BlockTitle';
import { VALID_VIDEO_TYPES } from '~/constants/common';

interface INewsMediaCardProps {
    newsData: News;
}

const NewsMediaCard: FC<INewsMediaCardProps> = ({ newsData }) => {
    const newsMedia = useMemo(() => newsData?.media?.[0], [newsData.media]);

    return (
        <BlockStack>
            <BlockTitle title={'Latest news'} />

            <MediaCard
                title={
                    <Text variant="heading2xl" as="h3" id="news-title-latest">
                        {newsData?.title}
                    </Text>
                }
                description={
                    <Text variant="bodyLg" as="span">
                        {newsData?.content}
                    </Text>
                }
                portrait
                size="small"
                aria-labelledby="news-title-latest"
            >
                {newsMedia &&
                    (VALID_VIDEO_TYPES.includes(newsMedia?.mediaType) ? (
                        <video
                            src={newsMedia?.url}
                            autoPlay
                            loop
                            aria-label="News video"
                        />
                    ) : (
                        <img
                            alt=""
                            width="100%"
                            height="100%"
                            style={{
                                objectFit: 'cover',
                                objectPosition: 'center',
                            }}
                            src={newsMedia?.url ?? ''}
                            loading="lazy"
                        />
                    ))}
            </MediaCard>
        </BlockStack>
    );
};

export default NewsMediaCard;
