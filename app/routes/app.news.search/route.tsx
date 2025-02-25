import { json } from '@remix-run/node';
import { useLoaderData, useNavigate, useSearchParams } from '@remix-run/react';
import { Page, TextField, Button } from '@shopify/polaris';
import { SearchIcon } from '@shopify/polaris-icons';
import React, { useCallback, useState } from 'react';

import NewsGrid from '~/components/NewsGrid/NewsGrid';
import { NAV_BLOCK_CONTENT } from '~/constants/contents';
import { mainPageNewsLoader } from '~/loaders/newsLoader';

export const loader = async ({ request }: { request: Request }) => {
    const url = new URL(request.url);

    if (!url.searchParams.has('searchedPage')) {
        url.searchParams.set('searchedPage', 'SEARCH');
    }

    const fetchedNews = await mainPageNewsLoader({
        ...request,
        url: url.toString(),
    });
    return json({ fetchedNews });
};

export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchValue, setSearchValue] = useState<string>('');
    const { fetchedNews } = useLoaderData<typeof loader>();
    const navigate = useNavigate();

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

    const handleSearch = () =>
        updateSearchParams({ searchColumn: 'title', searchValue });

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

    const handleSearchChange = useCallback(
        (newValue: string) => {
            setSearchValue(newValue);
        },
        [setSearchValue]
    );

    const handleClearButtonClick = useCallback(
        () => setSearchValue(''),
        [setSearchValue]
    );

    const handleFilterByTags = (tags?: string) =>
        updateSearchParams({ newsTags: tags });

    return (
        <Page
            title={'Search page'}
            backAction={{
                content: 'Go back',
                onAction() {
                    navigate('/app/news/grid');
                },
            }}
        >
            <TextField
                label={'Search news'}
                labelHidden
                clearButton
                value={searchValue}
                onChange={handleSearchChange}
                onClearButtonClick={handleClearButtonClick}
                placeholder={NAV_BLOCK_CONTENT.searchPlaceholder}
                autoComplete={'off'}
                connectedRight={
                    <Button icon={SearchIcon} onClick={handleSearch} />
                }
            />

            <NewsGrid
                news={fetchedNews?.news}
                latestNews={null}
                onSort={handleSort}
                page={fetchedNews?.page}
                onNextPage={handleNextPage}
                onPrevPage={handlePrevPage}
                hasNextPage={fetchedNews?.hasNextPage}
                hasPrevPage={fetchedNews?.hasPreviousPage}
                totalNews={fetchedNews?.totalNews}
                handleFilterByTags={handleFilterByTags}
            />
        </Page>
    );
}
