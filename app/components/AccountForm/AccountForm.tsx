import React from 'react';
import type {FC} from "react";
import {
  Box,
  Button,
  Card,
  Form,
  FormLayout,
  InlineStack,
  Layout,
  Text,
  TextField
} from "@shopify/polaris";
import type { User } from "~/@types/user";

interface IAccountForm {
  accountData: User,
  handleChange: (field: string, value: string) => void;
  handleEditAccount: () => void;
  newPassword: string;
  currentPassword: string;
  handlePasswordChange: (field: string, value: string) => void;
  isPassVerify: boolean;
  handleEditPassword: () => void;
  handleDeleteAccount: () => void;
}

const AccountForm: FC<IAccountForm> = (props) => {
  const {
    accountData,
    handleChange,
    handleEditAccount,
    newPassword,
    currentPassword,
    handlePasswordChange,
    isPassVerify,
    handleEditPassword,
    handleDeleteAccount,
  } = props;

  return (
    <InlineStack align={"center"}>
      <Box maxWidth={"500px"} paddingBlockStart={600}>
        <Layout>
          <Layout.Section>
            <Text variant="headingXl" as="h4">
              My Account
            </Text>
          </Layout.Section>

          <Layout.Section>
            <Card>
              <Form onSubmit={handleEditAccount}>
                <FormLayout>
                  <TextField
                    label={"First name"}
                    type={"text"}
                    placeholder={"First name"}
                    value={accountData?.firstName}
                    onChange={(value) => handleChange("firstName", value)}
                    autoComplete={"off"}
                  />

                  <TextField
                    label={"Last name"}
                    type={"text"}
                    placeholder={"Last name"}
                    value={accountData?.lastName}
                    onChange={(value) => handleChange("lastName", value)}
                    autoComplete={"off"}
                  />

                  <TextField
                    label={"Email"}
                    type={"email"}
                    placeholder={"Your email"}
                    value={accountData?.email}
                    onChange={(value) => handleChange("email", value)}
                    autoComplete={"off"}
                  />

                  <InlineStack align={"space-between"}>
                    <Button variant="primary" tone={"critical"} onClick={handleDeleteAccount}>Delete</Button>
                    <Button variant="primary" submit>Edit</Button>
                  </InlineStack>
                </FormLayout>
              </Form>
            </Card>
          </Layout.Section>

          <Layout.Section>
            <Card>
              <Box paddingBlockEnd={600}>
                <Text variant="bodyLg" as="p">
                  Change password
                </Text>
              </Box>

              <Form onSubmit={handleEditPassword}>
                <FormLayout>
                  <TextField
                    label={"Current password"}
                    type={"password"}
                    placeholder={"Your password"}
                    value={currentPassword}
                    onChange={(value) => handlePasswordChange('currentPassword', value)}
                    autoComplete={"off"}
                    helpText={
                      !isPassVerify &&
                        <Text variant="bodyLg" as="p" tone="critical">
                          Wrong password
                        </Text>
                    }
                  />

                  <TextField
                    label={"New password"}
                    type={"password"}
                    placeholder={"Your new password"}
                    value={newPassword}
                    onChange={(value) => handlePasswordChange('newPassword', value)}
                    autoComplete={"off"}
                  />

                  <Button variant="primary" submit>Change password</Button>
                </FormLayout>
              </Form>
            </Card>
          </Layout.Section>
        </Layout>
      </Box>
    </InlineStack>
  );
};

export default AccountForm;