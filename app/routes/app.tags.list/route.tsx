import { json } from '@remix-run/node';
import type {
    LoaderFunction,
    LoaderFunctionArgs,
} from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { Page, InlineStack } from '@shopify/polaris';
import { useCallback } from 'react';

import TagsTable from '~/components/TagsTable/TagsTable';
import { getTags } from '~/repositories/tagRepository.server';
import { checkUserAuth } from '~/utils/checkUserAuth.server';

export const loader: LoaderFunction = async ({
    request,
}: LoaderFunctionArgs) => {
    await checkUserAuth(request);

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') ?? '1');

    const fetchedTags = await getTags({
        page,
        sortOrder: url.searchParams.get('sort') as 'asc' | 'desc',
        sortColumn: url.searchParams.get('column') ?? 'id',
    });

    return json({ tagsData: fetchedTags });
};

export default function TagsList() {
    const { tagsData } = useLoaderData<typeof loader>();
    const navigate = useNavigate();

    const handleTagEdit = useCallback(
        (id: number) => {
            navigate(`/app/tag/${id}`);
        },
        [navigate]
    );

    return (
        <Page
            title={'Tags list'}
            primaryAction={{
                content: 'Create tag',
                onAction: () => navigate('/app/tag/new'),
            }}
        >
            <InlineStack align={'center'}>
                <TagsTable
                    tags={tagsData?.tags}
                    page={tagsData?.page}
                    handleTagEdit={handleTagEdit}
                    sortDirection={tagsData?.sortDirection}
                    sortColumn={tagsData?.sortColumn}
                    hasNextPage={tagsData?.hasNextPage}
                    hasPreviousPage={tagsData?.hasPreviousPage}
                />
            </InlineStack>
        </Page>
    );
}
