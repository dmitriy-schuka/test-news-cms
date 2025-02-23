import { json } from '@remix-run/node';
import { useLoaderData, useSearchParams } from '@remix-run/react';
import { Page, BlockStack } from '@shopify/polaris';
import { useCallback } from 'react';

import NewsGrid from '~/components/NewsGrid/NewsGrid';
import NewsMenu from '~/components/NewsMenu/NewsMenu';
import RssNewsCard from '~/components/RssNewsCard/RssNewsCard';
import { mainPageNewsLoader } from '~/loaders/newsLoader';
import { getAllRssNews } from '~/repositories/rssNewsRepository.server';

import styles from './styles.module.css';

export const loader = async ({ request }: { request: Request }) => {
    const [fetchedNews, fetchedRssNews] = await Promise.all([
        mainPageNewsLoader(request),
        getAllRssNews(),
    ]);

    return json({ fetchedNews, fetchedRssNews });
};

export default function NewsMainPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { fetchedNews, fetchedRssNews } = useLoaderData<typeof loader>();

    const updateSearchParams = useCallback(
        (params: Record<string, string | undefined>) => {
            setSearchParams((prev) => ({
                ...Object.fromEntries(prev),
                ...params,
            }));
        },
        [setSearchParams]
    );

    const handleSort = (column?: string, direction?: 'asc' | 'desc') =>
        updateSearchParams({
            sort: direction || 'desc',
            column: column || 'id',
            page: '1',
        });

    const handleSearch = (column?: string, value?: string) =>
        updateSearchParams({ searchColumn: column, searchValue: value });

    const handleFilterByTags = (tags?: string) =>
        updateSearchParams({ newsTags: tags });

    const changePage = useCallback(
        (offset: number) => {
            updateSearchParams({
                sort: fetchedNews?.sortDirection,
                column: fetchedNews?.sortColumn,
                page: String((fetchedNews?.page || 1) + offset),
            });
        },
        [fetchedNews, updateSearchParams]
    );

    const handleNextPage = () => changePage(1);
    const handlePrevPage = () => changePage(-1);

    const renderRssNews = () => {
        return fetchedRssNews.map((rssNews, index) => {
            return <RssNewsCard key={`RssNews_${index}`} rssNews={rssNews} />;
        });
    };

    return (
        <Page title={'News'} titleHidden fullWidth>
            <div className={styles.NewsContent__container}>
                <BlockStack gap={400}>
                    <NewsMenu
                        role="navigation"
                        aria-label="News filters and navigation"
                        handleSearch={handleSearch}
                    />

                    {fetchedRssNews &&
                        fetchedRssNews?.length > 0 &&
                        renderRssNews()}
                </BlockStack>

                <NewsGrid
                    news={fetchedNews?.news}
                    latestNews={fetchedNews?.latestNews}
                    onSort={handleSort}
                    page={fetchedNews?.page}
                    onNextPage={handleNextPage}
                    onPrevPage={handlePrevPage}
                    hasNextPage={fetchedNews?.hasNextPage}
                    hasPrevPage={fetchedNews?.hasPreviousPage}
                    totalNews={fetchedNews?.totalNews}
                    handleFilterByTags={handleFilterByTags}
                />
            </div>
        </Page>
    );
}
