import React from 'react';
import { Text } from "@shopify/polaris";

const BlockTitle = ({title}) => {
  return (
    <Text variant="headingSm" as="h6">
      {title}
    </Text>
  );
};

export default BlockTitle;