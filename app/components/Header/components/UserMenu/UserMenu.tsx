import React, { useState, useCallback } from 'react';
import { MenuIcon } from '@shopify/polaris-icons';
import { Icon, Button, Popover, ActionList } from '@shopify/polaris';
import { useNavigate } from "@remix-run/react";

import styles from './UserMenu.module.css';

const UserMenu = () => {
  const [popoverActive, setPopoverActive] = useState(false);
  const navigate = useNavigate();

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    [],
  );

  const itemsActions = [
    {
      content: 'Users',
      onAction: () => navigate('/app/users'),
    },
    {
      content: 'News',
      onAction: () => navigate('/app/news'),
    },
    {
      content: 'RSS imports',
      onAction: () => navigate('/app/rss'),
    },
    {
      content: 'Advertisements',
      onAction: () => navigate('/app/advertisements'),
    },
    {
      content: 'My account',
      onAction: () => navigate('/app/account'),
    },
  ];

  const activator = (
    <Button onClick={togglePopoverActive} variant="tertiary" size={"large"}>
      <div className={"UserMenu__icon"} >
        <Icon source={MenuIcon}/>
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