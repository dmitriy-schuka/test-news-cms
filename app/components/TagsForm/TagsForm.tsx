import React from 'react';
import {
  Button,
  Card,
  Form,
  FormLayout,
  InlineStack,
  TextField
} from "@shopify/polaris";

const TagsForm = (props) => {
  const { tagData, handleChange, handleCreateTag, handleEditTag, handleDeleteTag } = props;

  return (
    <InlineStack align={"center"} blockAlign={"center"}>
      <div style={{maxWidth: "500px", width: "100%"}}>
        <Card>
          <Form onSubmit={tagData?.id ? handleEditTag : handleCreateTag}>
            <FormLayout>
              <TextField
                label={"Tag name"}
                type={"text"}
                placeholder={"Tag name"}
                value={tagData?.name}
                onChange={(value) => handleChange(value, "name")}
                autoComplete={"off"}
              />

              {
                tagData?.id
                  ?
                    <InlineStack align={"space-between"}>
                      <Button variant="primary" tone={"critical"} onClick={handleDeleteTag}>Delete</Button>
                      <Button variant="primary" submit>Edit</Button>
                    </InlineStack>
                  :
                    <Button variant="primary" submit>Create tag</Button>
              }
            </FormLayout>
          </Form>
        </Card>
      </div>
    </InlineStack>
  );
};

export default TagsForm;