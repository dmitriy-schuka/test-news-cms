import { useSearchParams } from '@remix-run/react';
import { Box, Card, Text, IndexTable, Badge } from '@shopify/polaris';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import type { FC } from 'react';
import type { RssNews } from '~/@types/rssNews';
import EmptyStateMarkup from '~/components/common/EmptyStateMarkup/EmptyStateMarkup';
import { checkIsArray } from '~/utils/common';

import styles from './RssSourceTable.module.css';

interface IRssSourceTableProps {
    rssData: RssNews,
    page: number;
    sortDirection: string;
    sortColumn: string;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    handleEditRssSource: (id: number) => void;
}

const RssSourceTable: FC<IRssSourceTableProps> = ({
    rssData,
    page,
    sortDirection,
    sortColumn,
    hasNextPage,
    hasPreviousPage,
    handleEditRssSource,
}) => {
    const [sortedRss, setSortedRss] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();

    const resourceName = {
        singular: 'Rss source',
        plural: 'Rss sources',
    };

    useEffect(() => {
        if (rssData && Array.isArray(rssData)) {
            setSortedRss(rssData);
        }
    }, [rssData, setSortedRss]);

    const handleSort = useCallback(
        (_: number, direction: 'ascending' | 'descending') => {
            const sort = direction === 'ascending' ? 'asc' : 'desc';
            setSearchParams({ sort, column: 'id', page: '1' });
        },
        [setSearchParams]
    );

    const handleNextPage = useCallback(() => {
        setSearchParams({
            sort: sortDirection,
            column: sortColumn,
            page: String(page + 1),
        });
    }, [page, sortDirection, sortColumn, setSearchParams]);

    const handlePrevPage = useCallback(() => {
        setSearchParams({
            sort: sortDirection,
            column: sortColumn,
            page: String(page - 1),
        });
    }, [page, sortDirection, sortColumn, setSearchParams]);

    const rowMarkup = useMemo(() => {
        if (checkIsArray(sortedRss)) {
            return sortedRss.map((rss, index) => {
                const {
                    id,
                    name,
                    url,
                    isActive,
                    fieldMapping,
                    stopTags,
                    importInterval,
                } = rss;

                return (
                    <IndexTable.Row
                        key={`${id}_rss`}
                        id={id}
                        position={index}
                        onClick={() => handleEditRssSource(id)}
                    >
                        <IndexTable.Cell>
                            <Text variant="bodyMd" as="span">
                                {name}
                            </Text>
                        </IndexTable.Cell>

                        <IndexTable.Cell>
                            <Box maxWidth={'360px'} width={'100%'}>
                                <p className={styles.Text__truncate}>{url}</p>
                            </Box>
                        </IndexTable.Cell>

                        <IndexTable.Cell>
                            <Badge tone={isActive ? 'success' : 'critical'}>
                                {isActive ? 'TRUE' : 'FALSE'}
                            </Badge>
                        </IndexTable.Cell>

                        <IndexTable.Cell>
                            <Box maxWidth={'360px'} width={'100%'}>
                                <p className={styles.Text__truncate}>
                                    {JSON.stringify(fieldMapping)}
                                </p>
                            </Box>
                        </IndexTable.Cell>

                        <IndexTable.Cell>
                            <Box maxWidth={'360px'} width={'100%'}>
                                <p className={styles.Text__truncate}>
                                    {JSON.stringify(stopTags)}
                                </p>
                            </Box>
                        </IndexTable.Cell>

                        <IndexTable.Cell>
                            <Text variant="bodyMd" as="span">
                                {importInterval}
                            </Text>
                        </IndexTable.Cell>
                    </IndexTable.Row>
                );
            });
        } else {
            return [];
        }
    }, [sortedRss, checkIsArray]);

    return (
        <Box>
            <Card>
                <IndexTable
                    resourceName={resourceName}
                    itemCount={sortedRss?.length}
                    headings={[
                        { title: 'Name' },
                        { title: 'Url' },
                        { title: 'Is active' },
                        { title: 'Field mapping' },
                        { title: 'Stop tags' },
                        { title: 'Import interval' },
                    ]}
                    selectable={false}
                    pagination={{
                        hasPrevious: hasPreviousPage,
                        hasNext: hasNextPage,
                        onNext: () => handleNextPage(),
                        onPrevious: () => handlePrevPage(),
                    }}
                    emptyState={
                        <EmptyStateMarkup resourceName={resourceName.plural} />
                    }
                    onSort={handleSort}
                >
                    {rowMarkup}
                </IndexTable>
            </Card>
        </Box>
    );
};

export default RssSourceTable;
