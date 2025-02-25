import { json } from '@remix-run/node';
import type { LoaderFunction, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { Page, InlineStack } from '@shopify/polaris';
import { useCallback } from 'react';

import RssSourceTable from '~/components/RssSourceTable/RssSourceTable';
import { getRssSources } from '~/repositories/rssSourceRepository.server';

export const loader: LoaderFunction = async ({
    request,
}: LoaderFunctionArgs) => {
    //await checkUserAuth(request);

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') ?? '1');

    const fetchedRssSources = await getRssSources({
        page,
        sortOrder: url.searchParams.get('sort') as 'asc' | 'desc',
        sortColumn: url.searchParams.get('column') ?? 'id',
    });

    return json({ rssData: fetchedRssSources });
};

export default function RssList() {
    const { rssData } = useLoaderData<typeof loader>();
    const navigate = useNavigate();

    const handleEditRssSource = useCallback(
        (id: number) => {
            navigate(`/app/rss-source/${id}`);
        },
        [navigate]
    );

    return (
        <Page
            title={'Rss source list'}
            primaryAction={{
                content: 'Create Rss source',
                onAction: () => navigate('/app/rss-source/new'),
            }}
        >
            <InlineStack align={'center'}>
                <RssSourceTable
                    rssData={rssData?.rssSources}
                    page={rssData?.page}
                    handleEditRssSource={handleEditRssSource}
                    sortDirection={rssData?.sortDirection}
                    sortColumn={rssData?.sortColumn}
                    hasNextPage={rssData?.hasNextPage}
                    hasPreviousPage={rssData?.hasPreviousPage}
                />
            </InlineStack>
        </Page>
    );
}
