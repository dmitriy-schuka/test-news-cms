import React from 'react';
import type {FC} from "react";
import { Text } from "@shopify/polaris";

interface IBlockTitleProps {
  title: string;
}

const BlockTitle: FC<IBlockTitleProps> = ({title}) => {
  return (
    <Text variant="headingSm" as="h6">
      {title}
    </Text>
  );
};

export default BlockTitle;