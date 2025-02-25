import { Button, Popover, ActionList, Text } from '@shopify/polaris';
import React, { useState, useCallback } from 'react';
import type { FC } from 'react';

interface INavPopover {
    activatorTitle: string;
    actionListItems: Array<{ content: string; onAction: () => void }>;
}

const NavPopover: FC<INavPopover> = (props) => {
    const { activatorTitle, actionListItems } = props;
    const [popoverActive, setPopoverActive] = useState(false);

    const togglePopoverActive = useCallback(
        () => setPopoverActive((popoverActive) => !popoverActive),
        []
    );

    const activator = (
        <Button
            onClick={togglePopoverActive}
            disclosure={popoverActive ? 'up' : 'down'}
        >
            <Text variant="bodyLg" as="p" breakWord={false} truncate>
                {activatorTitle}
            </Text>
        </Button>
    );

    return (
        <div>
            <Popover
                activator={activator}
                active={popoverActive}
                autofocusTarget="first-node"
                onClose={togglePopoverActive}
            >
                <ActionList
                    actionRole="menuitem"
                    items={actionListItems}
                    onActionAnyItem={togglePopoverActive}
                />
            </Popover>
        </div>
    );
};

export default NavPopover;
