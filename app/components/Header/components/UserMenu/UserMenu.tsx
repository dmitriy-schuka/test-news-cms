import { useNavigate } from '@remix-run/react';
import { Icon, Button, Popover, ActionList } from '@shopify/polaris';
import { MenuIcon } from '@shopify/polaris-icons';
import React, { useState, useCallback } from 'react';

const UserMenu = () => {
    const [popoverActive, setPopoverActive] = useState(false);
    const navigate = useNavigate();

    const togglePopoverActive = useCallback(
        () => setPopoverActive((popoverActive) => !popoverActive),
        []
    );

    const itemsActions = [
        {
            content: 'News',
            onAction: () => navigate('/app/news/list'),
        },
        {
            content: 'Tags',
            onAction: () => navigate('/app/tags/list'),
        },
        {
            content: 'RSS imports',
            onAction: () => navigate('/app/rss-sources/list'),
        },
        {
            content: 'Injections',
            onAction: () => navigate('/app/injections/list'),
        },
        {
            content: 'My account',
            onAction: () => navigate('/app/account'),
        },
    ];

    const activator = (
        <Button onClick={togglePopoverActive} variant="tertiary" size={'large'}>
            <div className={'UserMenu__icon'}>
                <Icon source={MenuIcon} />
            </div>
        </Button>
    );

    return (
        <div>
            <Popover
                active={popoverActive}
                activator={activator}
                onClose={togglePopoverActive}
            >
                <ActionList
                    actionRole="menuitem"
                    items={itemsActions}
                    onActionAnyItem={() => setPopoverActive(false)}
                />
            </Popover>
        </div>
    );
};

export default UserMenu;
