import React from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Form,
  FormLayout,
  InlineStack,
  Layout,
  Text,
  TextField
} from "@shopify/polaris";

const AccountForm = (props) => {
  const {
    accountData,
    handleChange,
    handleEditAccount,
    newPassword,
    setNewPassword,
    currentPassword,
    handleCurrentPass,
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
                    onChange={(value) => handleChange(value, "firstName")}
                    autoComplete={"off"}
                  />

                  <TextField
                    label={"Last name"}
                    type={"text"}
                    placeholder={"Last name"}
                    value={accountData?.lastName}
                    onChange={(value) => handleChange(value, "lastName")}
                    autoComplete={"off"}
                  />

                  <TextField
                    label={"Email"}
                    type={"email"}
                    placeholder={"Your email"}
                    value={accountData?.email}
                    onChange={(value) => handleChange(value, "email")}
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
                    onChange={(value) => handleCurrentPass(value)}
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
                    onChange={(value) => setNewPassword(value)}
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