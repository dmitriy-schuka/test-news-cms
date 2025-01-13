import React from 'react';
import { Card, Button, BlockStack, Text, ButtonGroup, } from "@shopify/polaris";
import { Form } from "@remix-run/react";

const Logout = ({closeModal}) => {

  return (
    <Card padding={600}>
      <BlockStack gap={400}>
        <Text variant="bodyLg" as="p">
          Are you sure want to log out?
        </Text>

        <Form method={"POST"} action={"/logout"}>
          <ButtonGroup fullWidth>
            <Button fullWidth onClick={closeModal}>
              Cancel
            </Button>

            <Button variant={"primary"} fullWidth submit onClick={closeModal}>
              Logout
            </Button>
          </ButtonGroup>
        </Form>
      </BlockStack>

    </Card>
  );
};

export default Logout;