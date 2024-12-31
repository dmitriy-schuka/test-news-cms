import React, { useState, useCallback } from 'react';
import { Box, TextField } from "@shopify/polaris";

const SearchBar = () => {
  const [value, setValue] = useState("");

  const handleSearchChange = useCallback(
    (newValue: string) => setValue(newValue),
    [],
  );

  return (
    <Box>
      <TextField
        label={"Search"}
        labelHidden
        value={value}
        onChange={handleSearchChange}
        placeholder={"Search"}
        autoComplete={"off"}
      />
    </Box>
  );
};

export default SearchBar;