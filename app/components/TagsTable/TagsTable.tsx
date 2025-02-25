import { useSearchParams } from '@remix-run/react';
import {
    Box,
    Card,
    Text,
    IndexTable,
    EmptySearchResult,
} from '@shopify/polaris';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import type { FC } from 'react';

import type { Tag } from '~/@types/tag';

interface ITagsTableProps {
    tags: Tag[];
    page: number;
    sortDirection: string;
    sortColumn: string;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    handleTagEdit: (id: number) => void;
}

const TagsTable: FC<ITagsTableProps> = ({
    tags,
    page,
    sortDirection,
    sortColumn,
    hasNextPage,
    hasPreviousPage,
    handleTagEdit,
}) => {
    const [sortedTags, setSortedTags] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();

    const resourceName = {
        singular: 'tag',
        plural: 'tags',
    };

    useEffect(() => {
        if (tags && Array.isArray(tags)) {
            setSortedTags(tags);
        }
    }, [tags, setSortedTags]);

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

    const emptyStateMarkup = (
        <EmptySearchResult
            title={'No tags yet'}
            description={'Try changing the filters or search term'}
            withIllustration
        />
    );

    const rowMarkup = useMemo(() => {
        if (sortedTags && Array.isArray(sortedTags) && sortedTags.length > 0) {
            return sortedTags.map((tag, index) => {
                const { id, name } = tag;

                return (
                    <IndexTable.Row
                        key={id}
                        id={id}
                        position={index}
                        onClick={() => handleTagEdit(id)}
                    >
                        <IndexTable.Cell>
                            <Text variant="bodyMd" as="span">
                                {id}
                            </Text>
                        </IndexTable.Cell>
                        <IndexTable.Cell>
                            <Text variant="bodyMd" as="span">
                                {name}
                            </Text>
                        </IndexTable.Cell>
                    </IndexTable.Row>
                );
            });
        } else {
            return [];
        }
    }, [sortedTags, handleTagEdit]);

    return (
        <Box maxWidth={'500px'} width={'100%'}>
            <Card>
                <IndexTable
                    resourceName={resourceName}
                    // itemCount={tags?.length}
                    itemCount={sortedTags?.length}
                    headings={[{ title: 'Id' }, { title: 'Tag name' }]}
                    selectable={false}
                    pagination={{
                        hasPrevious: hasPreviousPage,
                        hasNext: hasNextPage,
                        onNext: () => handleNextPage(),
                        onPrevious: () => handlePrevPage(),
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

export default TagsTable;
