import { Link } from '@remix-run/react';
import { Box, InlineStack } from '@shopify/polaris';

import AuthMenu from '~/components/Header/components/AuthMenu/AuthMenu';
import UserMenu from '~/components/Header/components/UserMenu/UserMenu';

import NewsLogo from '/Fox-News-Channel-Emblem.png';

import styles from './Header.module.css';

const Header = ({ user }: { user: { email: string; name: string } | null }) => {
    return (
        <div className={styles.Header__main}>
            <InlineStack align={'space-between'} blockAlign={'center'}>
                <Box>
                    <Link to={'/app/news/grid'}>
                        <img
                            src={NewsLogo}
                            alt="NewsLogo"
                            className={styles.Header__icon}
                            loading="lazy"
                        />
                    </Link>
                </Box>

                <Box padding={400}>
                    <InlineStack gap={500}>
                        <UserMenu user={user} />
                        <AuthMenu user={user} />
                    </InlineStack>
                </Box>
            </InlineStack>
        </div>
    );
};

export default Header;
