import React from 'react';
import { Card, Box, Button, BlockStack, FormLayout, Text, InlineStack, /*Form, Link*/ } from "@shopify/polaris";
import { Form, Link, useNavigate } from "@remix-run/react";
import FormInput from "~/components/common/FormInput/FormInput";

const Login = ({closeModal}) => {
  return (
    <Card>
      <Box>
        <BlockStack
          gap={500}
          align={"center"}
          inlineAlign={"center"}
        >
          <Text variant="heading2xl" as="h3">
            Login
          </Text>

          <Form method="post" action="/login" onSubmit={closeModal}>
            <FormLayout>
              <FormInput
                type={"email"}
                name={"email"}
                required={true}
                placeholder={"Your Email"}
              />
              <FormInput
                type={"password"}
                name={"password"}
                required={true}
                placeholder={"Your Password"}
              />

              <Box paddingBlockStart={300}>
                <Button
                  submit
                  fullWidth
                  size="large"
                  variant={"primary"}
                >
                  Login
                </Button>
              </Box>
            </FormLayout>
          </Form>

          <InlineStack gap={"100"}>
            <Text variant="bodyMd" as="p">
              Don't have an account?
            </Text>

            <Link to={"/signup"}>
              <p className="underline text-blue-600">Sign up</p>
            </Link>
          </InlineStack>
        </BlockStack>
      </Box>
    </Card>
  );
};

export default Login;