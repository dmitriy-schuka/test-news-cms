import { Box, Button, Avatar, Thumbnail, FullscreenBar, ButtonGroup, InlineStack } from "@shopify/polaris";
import { useState, useCallback } from "react";
import SearchBar from "~/components/common/SearchBar/SearchBar";
import NewsLogo from "/Fox-News-Channel-Emblem.png";
import styles from './Header.module.css';


const Header = () => {
  const [user, setUser] = useState();
  const [searchValue, setSearchValue] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <div className={styles.Header__main}>
      <InlineStack
        align={"space-between"}
        blockAlign={"center"}
        // gap
      >
        <Box>
          <img
            src={NewsLogo}
            alt="NewsLogo"
            className={styles.Header__icon}
          />

          {/*<Thumbnail source={NewsLogo} alt={"NewsLogo"}/>*/}
        </Box>

        <SearchBar/>

        <Box padding="400">
          <Button variant={"plain"}>
            {
              user
                ? <Avatar initials="WW" name="Woluwayemisi Weun-Jung" size={"xl"}/>
                : <Avatar customer size={"xl"}/>
            }
          </Button>
        </Box>
      </InlineStack>
    </div>
  );
};

export default Header;