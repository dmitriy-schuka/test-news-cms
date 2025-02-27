export const ADMIN_SEED = {
    firstName: 'Admin',
    lastName: 'Adminich',
    email: 'admin@gmail.com',
    defaultPassword: 'admin',
    role: 'admin',
};

export const FIRST_RSS = {
    name: 'Test',
    url: 'https://feeds.bbci.co.uk/news/rss.xml',
    isActive: true,
    fieldMapping: {
        "title": "title",
        "content": "description",
        "rssLink": "link",
        "mediaUrl": "media:thumbnail",
        "publicatedDate": "pubDate"
    },
    stopTags: [
        "Sports"
    ],
    importInterval: 60,
};
