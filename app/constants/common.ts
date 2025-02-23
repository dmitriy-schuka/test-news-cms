export const SALT_ROUNDS = 10;

export const VALID_IMAGE_TYPES = [
    'image/gif',
    'image/jpg',
    'image/jpeg',
    'image/png',
];
export const VALID_VIDEO_TYPES = ['video/mp4'];

export const NEWS_MENU_ITEMS = [
    {
        title: 'All news',
        redirectUrl: '/app/news/grid',
    },
    {
        title: 'Search page',
        redirectUrl: '/app/news/grid',
    },
    {
        title: 'Search by tags page',
        redirectUrl: '/app/news/grid',
    },
];

export const DEVICES_BREAKPOINTS = {
    mobile: 576,
    tablet: 768,
    desktop: 1024,
};

export const INJECTION_TYPES = [
    {
        label: 'Image',
        value: 'IMAGE',
    },
    {
        label: 'Text',
        value: 'TEXT',
    },
    {
        label: 'News',
        value: 'NEWS',
    },
];

export const INJECTION_DISPLAY_ON_TYPES = [
    {
        label: 'List',
        value: 'LIST',
    },
    {
        label: 'Search page',
        value: 'SEARCH',
    },
    {
        label: 'List and Search page',
        value: 'BOTH',
    },
];
