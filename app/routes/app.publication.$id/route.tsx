import { json } from '@remix-run/node';
import type {
    MetaFunction,
    LoaderFunction,
    LoaderFunctionArgs,
} from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { Page } from '@shopify/polaris';
import { useEffect, useState } from 'react';

import type { News } from '~/@types/news';
import NewsSingle from '~/components/NewsSingle/NewsSingle';
import { getNewsById } from '~/repositories/newsRepository.server';

export const loader: LoaderFunction = async ({
    params,
    request,
}: LoaderFunctionArgs) => {
    let newsData = null;

    if (params?.id) {
        newsData = await getNewsById(Number(params.id));
    }

    return json({ newsData });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    if (!data) {
        return { title: 'News not found' };
    }

    return [
        {
            title: data?.title,
            description: data?.content?.substring(0, 150),
            'og:title': data?.title,
            'og:description': data?.content?.substring(0, 150),
            'og:image': data.media?.[0]?.url || '/default-thumbnail.jpg',
            /** Add link to <head> */
            link: {
                rel: 'canonical',
                href: `http://localhost:5173/app/publication/${data.id}`,
            },
        },
    ];
};

export default function Publication() {
    const [newsData, setNewsData] = useState<News>({});
    const loaderData = useLoaderData<typeof loader>();
    const navigate = useNavigate();

    useEffect(() => {
        if (loaderData?.newsData?.id) {
            setNewsData(loaderData.newsData);
        }
    }, [loaderData, setNewsData]);

    return (
        <Page
            title={newsData?.title}
            backAction={{
                content: 'Go back',
                onAction() {
                    navigate(-1);
                },
            }}
        >
            <NewsSingle newsData={newsData} />
        </Page>
    );
}
