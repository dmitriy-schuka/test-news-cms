export const loader = async () => {
    return new Response(
        `User-agent: *
    Allow: /
    Sitemap: http://localhost:5173/sitemap.xml`,
        { headers: { 'Content-Type': 'text/plain' } }
    );
};
