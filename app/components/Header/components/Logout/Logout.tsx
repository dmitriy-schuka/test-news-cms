import { Form } from '@remix-run/react';
import { Card, Button, BlockStack, Text, ButtonGroup } from '@shopify/polaris';
import React from 'react';

const Logout = ({ closeModal }: { closeModal: () => void }) => {
    return (
        <Card padding={600}>
            <BlockStack gap={400}>
                <Text variant="bodyLg" as="p">
                    Are you sure want to log out?
                </Text>

                <Form method={'POST'} action={'/logout'}>
                    <ButtonGroup fullWidth>
                        <Button fullWidth onClick={closeModal}>
                            Cancel
                        </Button>

                        <Button
                            variant={'primary'}
                            fullWidth
                            submit
                            onClick={closeModal}
                        >
                            Logout
                        </Button>
                    </ButtonGroup>
                </Form>
            </BlockStack>
        </Card>
    );
};

export default Logout;
