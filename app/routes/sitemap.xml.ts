import { prisma } from '~/db/prisma.server';

export const loader = async () => {
    const newsList = await prisma.news.findMany({
        select: { id: true, updatedAt: true },
    });

    const urls = newsList
        .map(
            (news) =>
                `<url><loc>http://localhost:5173/news/${
                    news.id
                }</loc><lastmod>${news.updatedAt.toISOString()}</lastmod></url>`
        )
        .join('');

    return new Response(
        `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls}
    </urlset>`,
        {
            headers: { 'Content-Type': 'application/xml' },
        }
    );
};
