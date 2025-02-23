import { useSearchParams } from '@remix-run/react';
import {
    Box,
    Card,
    InlineStack,
    BlockStack,
    Text,
    IndexTable,
    Thumbnail,
    EmptySearchResult,
    Tag,
    Badge,
} from '@shopify/polaris';
import type { FC } from 'react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import type { Media } from '~/@types/media';
import type { News } from '~/@types/news';
import DefaultImage from '~/assets/images/default-image.jpg';
import { VALID_IMAGE_TYPES, VALID_VIDEO_TYPES } from '~/constants/common';
import { checkIsArray } from '~/utils/common';

import styles from './NewsTable.module.css';

interface INewsTable {
    news: Array<News>;
    page: number;
    sortDirection: string;
    sortColumn: string;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    handleNewsEdit: (id: number) => void;
}

const NewsTable: FC<INewsTable> = ({
    news,
    page,
    sortDirection,
    sortColumn,
    hasNextPage,
    hasPreviousPage,
    handleNewsEdit,
}) => {
    const [sortedNews, setSortedNews] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();

    const resourceName = {
        singular: 'news',
        plural: 'news',
    };

    useEffect(() => {
        if (news && Array.isArray(news)) {
            setSortedNews(news);
        }
    }, [news, setSortedNews]);

    const handleSort = useCallback(
        (_: number, direction: 'ascending' | 'descending') => {
            const sort = direction === 'ascending' ? 'asc' : 'desc';
            setSearchParams({ sort, column: 'id', page: '1' });
        },
        [setSearchParams]
    );

    const changePage = useCallback(
        (offset: number) => {
            setSearchParams({
                sort: sortDirection,
                column: sortColumn,
                page: String((page || 1) + offset),
            });
        },
        [sortDirection, sortColumn, page, setSearchParams]
    );

    const handleNextPage = () => changePage(1);
    const handlePrevPage = () => changePage(-1);

    const emptyStateMarkup = (
        <EmptySearchResult
            title={'No news yet'}
            description={'Try changing the filters or search term'}
            withIllustration
        />
    );

    const renderMedia = (media: Media[]) => {
        return media.map((mediaItem, index) => {
            const mediaUrl = mediaItem?.url || DefaultImage;

            switch (true) {
                case VALID_IMAGE_TYPES.includes(mediaItem?.mediaType):
                    return (
                        <Thumbnail
                            key={`${index}-${mediaItem?.url}`}
                            source={mediaUrl}
                            alt="News media"
                        />
                    );
                case VALID_VIDEO_TYPES.includes(mediaItem?.mediaType):
                    return (
                        <div
                            className={styles.NewsVideo__container}
                            key={`${index}-${mediaItem?.url}`}
                        >
                            <BlockStack inlineAlign={'start'} align={'center'}>
                                <video
                                    src={mediaUrl}
                                    autoPlay
                                    loop
                                    style={{
                                        maxWidth: '60px',
                                        maxHeight: '60px',
                                    }}
                                />
                            </BlockStack>
                        </div>
                    );
                default:
                    return (
                        <Thumbnail
                            key={`${index}-${mediaItem?.url}`}
                            source={mediaUrl}
                            alt="News media"
                        />
                    );
            }
        });
    };

    const rowMarkup = useMemo(() => {
        if (checkIsArray(sortedNews)) {
            return sortedNews.map((news, index) => {
                const { id, title, content, published, tags, media } = news;

                const tagsMarkup = tags.map((tag, index) => {
                    return (
                        <Tag key={`tag-${index}-${tag.name}`}>{tag.name}</Tag>
                    );
                });

                return (
                    <IndexTable.Row
                        key={id}
                        id={id}
                        position={index}
                        onClick={() => handleNewsEdit(id)}
                    >
                        <IndexTable.Cell>
                            <Text variant="bodyMd" as="span">
                                {title}
                            </Text>
                        </IndexTable.Cell>

                        <IndexTable.Cell>
                            <Box maxWidth={'360px'} width={'100%'}>
                                <p className={styles.Text__truncate}>
                                    {content}
                                </p>
                            </Box>
                        </IndexTable.Cell>

                        <IndexTable.Cell>
                            <Badge tone={published ? 'success' : 'critical'}>
                                {published ? 'TRUE' : 'FALSE'}
                            </Badge>
                        </IndexTable.Cell>

                        <IndexTable.Cell>
                            <InlineStack gap={200} align={'start'}>
                                {tagsMarkup}
                            </InlineStack>
                        </IndexTable.Cell>

                        <IndexTable.Cell>
                            {checkIsArray(media) ? (
                                renderMedia(media)
                            ) : (
                                <Thumbnail
                                    source={DefaultImage}
                                    alt="Black choker necklace"
                                />
                            )}
                        </IndexTable.Cell>
                    </IndexTable.Row>
                );
            });
        } else {
            return [];
        }
    }, [sortedNews, checkIsArray, handleNewsEdit]);

    return (
        <Box>
            <Card>
                <IndexTable
                    resourceName={resourceName}
                    itemCount={sortedNews?.length}
                    headings={[
                        { title: 'Title' },
                        { title: 'News content' },
                        { title: 'Is published' },
                        { title: 'News tags' },
                        { title: 'Media' },
                    ]}
                    selectable={false}
                    pagination={{
                        hasPrevious: hasPreviousPage,
                        hasNext: hasNextPage,
                        onNext: handleNextPage,
                        onPrevious: handlePrevPage,
                    }}
                    emptyState={emptyStateMarkup}
                    onSort={handleSort}
                >
                    {rowMarkup}
                </IndexTable>
            </Card>
        </Box>
    );
};

export default NewsTable;
