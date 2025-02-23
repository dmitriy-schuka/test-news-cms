import { Text } from '@shopify/polaris';
import React from 'react';
import type { FC } from 'react';

interface IBlockTitleProps {
    title: string;
}

const BlockTitle: FC<IBlockTitleProps> = ({ title }) => {
    return (
        <Text variant="headingSm" as="h6">
            {title}
        </Text>
    );
};

export default BlockTitle;
