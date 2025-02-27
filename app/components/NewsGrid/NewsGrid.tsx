import { useNavigate } from '@remix-run/react';
import { Box, Grid, BlockStack } from '@shopify/polaris';
import React, { useMemo } from 'react';
import type { FC } from 'react';

import type { News } from '~/@types/news';
import BlockTitle from '~/components/common/BlockTitle/BlockTitle';
import InjectionCard from '~/components/InjectionCard/InjectionCard';
import NewsCard from '~/components/NewsCard/NewsCard';
import NewsMediaCard from '~/components/NewsGrid/components/NewsMediaCard/NewsMediaCard';
import NewsPagination from '~/components/NewsGrid/components/NewsPagination/NewsPagination';

interface INewsGridProps {
    news: Array<News>;
    latestNews?: News;
    onSort: (column?: string, direction?: 'asc' | 'desc') => void;
    onNextPage: () => void;
    onPrevPage: () => void;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    totalNews: number;
    page: number;
    handleFilterByTags: (tags?: string) => void;
}

const NewsGrid: FC<INewsGridProps> = (props) => {
    const {
        news,
        latestNews,
        onSort,
        onNextPage,
        onPrevPage,
        hasNextPage,
        hasPrevPage,
        totalNews,
        page,
        handleFilterByTags,
    } = props;
    const navigate = useNavigate();

    const renderNewsCards = useMemo(() => {
        return news?.map((newsItem, index) => {
            return (
                <Grid.Cell key={`${index}_${newsItem?.title}_news`}>
                    {newsItem?.hasOwnProperty('injectionType') ? (
                        <InjectionCard
                            itemData={newsItem}
                            handleFilterByTags={handleFilterByTags}
                        />
                    ) : (
                        <NewsCard
                            newsItem={newsItem}
                            handleFilterByTags={handleFilterByTags}
                            newsIndex={index}
                        />
                    )}
                </Grid.Cell>
            );
        });
    }, [news, handleFilterByTags]);

    return (
        <Box paddingBlockStart={400}>
            <BlockStack gap={800}>
                {latestNews && (
                    <div
                        style={{ cursor: 'pointer' }}
                        onClick={() =>
                            navigate(`/app/publication/${latestNews?.id}`)
                        }
                    >
                        <NewsMediaCard role="article" newsData={latestNews} />
                    </div>
                )}

                <BlockStack>
                    <BlockTitle title={'Main news'} />

                    <Grid columns={{ xs: 1, sm: 1, md: 2, lg: 4, xl: 4 }}>
                        {renderNewsCards}
                    </Grid>
                </BlockStack>

                <NewsPagination
                    page={page}
                    onNextPage={onNextPage}
                    onPrevPage={onPrevPage}
                    hasNextPage={hasNextPage}
                    hasPrevPage={hasPrevPage}
                    totalNews={totalNews}
                />
            </BlockStack>
        </Box>
    );
};

export default NewsGrid;
