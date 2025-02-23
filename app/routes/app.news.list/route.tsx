import { json } from '@remix-run/node';
import type { LoaderFunction, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { Page } from '@shopify/polaris';
import { useCallback } from 'react';

import NewsTable from '~/components/NewsTable/NewsTable';
import { newsLoader } from '~/loaders/newsLoader';
import { checkUserAuth } from '~/utils/checkUserAuth.server';

export const loader: LoaderFunction = async ({
    request,
}: LoaderFunctionArgs) => {
    // TODO: uncomment for production
    // await checkUserAuth(request);

    const fetchedNews = await newsLoader(request);

    return json({ newsData: fetchedNews });
};

export default function NewsList() {
    const { newsData } = useLoaderData<typeof loader>();
    const navigate = useNavigate();

    const handleNewsEdit = useCallback(
        (id: number) => {
            navigate(`/app/news/${id}`);
        },
        [navigate]
    );

    return (
        <Page
            title={'News list'}
            primaryAction={{
                content: 'Create news',
                onAction: () => navigate('/app/news/new'),
            }}
        >
            <NewsTable
                news={newsData?.news}
                page={newsData?.page}
                handleNewsEdit={handleNewsEdit}
                sortDirection={newsData?.sortDirection}
                sortColumn={newsData?.sortColumn}
                hasNextPage={newsData?.hasNextPage}
                hasPreviousPage={newsData?.hasPreviousPage}
            />
        </Page>
    );
}
