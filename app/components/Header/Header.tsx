import { Box, InlineStack } from "@shopify/polaris";
import { useLoaderData, Link } from "@remix-run/react";
import { useState, useCallback } from "react";
import SearchBar from "~/components/common/SearchBar/SearchBar";
import UserMenu from "~/components/Header/components/UserMenu/UserMenu";
import NewsLogo from "/Fox-News-Channel-Emblem.png";
import styles from './Header.module.css';

const Header = ({ user }: { user: { email: string, name: string } | null }) => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className={styles.Header__main}>
      <InlineStack
        align={"space-between"}
        blockAlign={"center"}
      >
        <Box>
          <Link to={"/app"}>
            <img
              src={NewsLogo}
              alt="NewsLogo"
              className={styles.Header__icon}
            />
          </Link>
        </Box>

        <SearchBar/>

        <Box padding="400">
          <UserMenu user={user} />
        </Box>
      </InlineStack>
    </div>
  );
};

export default Header;