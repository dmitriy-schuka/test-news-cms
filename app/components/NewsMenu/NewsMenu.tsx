import React, { useMemo } from 'react';
import { useNavigate } from "@remix-run/react";
import useBreakpoints from "~/hooks/useBreakpoints";
import SearchBar from "~/components/common/SearchBar/SearchBar";
import { Box, Button, BlockStack, Text } from "@shopify/polaris";
import { NEWS_MENU_ITEMS } from "~/constants/common";
import BlockTitle from "~/components/common/BlockTitle/BlockTitle";
import { NAV_BLOCK_CONTENT } from "~/constants/contents";

const NewsMenu = (props) => {
  const { handleSearch } = props;
  const navigate = useNavigate();
  const { isMobile } = useBreakpoints();

  const renderMenuItems = useMemo(() => {
    return (
      NEWS_MENU_ITEMS.map((item, index) => (
        <Button
          key={`news_menu_item_${index}`}
          fullWidth
          textAlign="left"
          variant="tertiary"
          onClick={() => navigate(item.redirectUrl)}
        >
          <Text variant="bodyLg" as="p">
            {item.title}
          </Text>
        </Button>
      ))
    );
  }, []);

  return (
    <Box minWidth={"200px"} paddingInlineEnd={200} paddingBlockStart={400}>
      <BlockStack>
        <BlockTitle title={NAV_BLOCK_CONTENT.blockTitle} />

        <SearchBar placeholder={NAV_BLOCK_CONTENT.searchPlaceholder} handleSearch={handleSearch} isMobile={isMobile}/>

        {
          !isMobile &&
            <Box paddingBlockStart={400}>
              <BlockTitle title={NAV_BLOCK_CONTENT.navMenu.activatorTitle} />

              <BlockStack gap={200} inlineAlign={"start"}>
                {renderMenuItems}
              </BlockStack>
            </Box>
        }
      </BlockStack>
    </Box>
  );
};

export default NewsMenu;