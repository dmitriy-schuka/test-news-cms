import React, { useState, useCallback, useMemo } from 'react';
import type { FC } from "react";
import NavPopover from "~/components/common/NavPopover/NavPopover";
import { SearchIcon } from '@shopify/polaris-icons';
import { Button, InlineStack, TextField } from "@shopify/polaris";
import { NEWS_MENU_ITEMS } from "~/constants/common";
import { NAV_BLOCK_CONTENT } from "~/constants/contents";
import { useNavigate } from "@remix-run/react";

interface ISearchBarProps {
  placeholder?: string;
  handleSearch: (field: string, value: string) => void;
  isMobile: boolean;
}

const SearchBar: FC<ISearchBarProps> = ({placeholder = "Search", handleSearch, isMobile}) => {
  const [value, setValue] = useState<string>("");
  const navigate = useNavigate();

  const handleSearchChange = useCallback(
    (newValue: string) => {
      setValue(newValue);
    },
    [setValue],
  );

  const onSearch = useCallback(
    () => {
      handleSearch("title", value);
    },
    [value, handleSearch],
  );

  const navMenuItems = useMemo(() => {
    return (
      NEWS_MENU_ITEMS.map((item) => ({
        content: item.title,
        onAction() {
          navigate(item.redirectUrl);
        }
      }))
    );
  }, [navigate]);

  return (
    <InlineStack wrap={false} gap={200} blockAlign={"center"}>
      <TextField
        label={"Search"}
        labelHidden
        value={value}
        onChange={handleSearchChange}
        placeholder={placeholder}
        autoComplete={"off"}
      />

      <Button icon={SearchIcon} onClick={onSearch}/>

      {
        isMobile &&
          <NavPopover
            activatorTitle={NAV_BLOCK_CONTENT.navMenu.activatorTitle}
            actionListItems={navMenuItems}
          />
      }
    </InlineStack>
  );
};

export default SearchBar;