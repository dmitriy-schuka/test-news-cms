import React from 'react';
import {
  Box,
  Button,
  Card,
  Form,
  Checkbox,
  FormLayout,
  InlineStack,
  TextField
} from "@shopify/polaris";
import MediaInput from "~/components/common/MediaInput/MediaInput";
import TagsSelector from "~/components/common/TagsSelector/TagsSelector";

const NewsForm = (props) => {
  const { newsData, handleChange } = props;

  return (
    <InlineStack align={"center"} blockAlign={"center"}>
      <div style={{maxWidth: "500px", width: "100%"}}>
        <Box>
          <Card>
            <Form onSubmit={() => {}}>
              <FormLayout>
                <MediaInput/>

                <TextField
                  label={"News title"}
                  type={"text"}
                  placeholder={"News title"}
                  value={newsData?.title}
                  onChange={(value) => handleChange(value, "title")}
                  autoComplete={"off"}
                />

                <TextField
                  label={"News content"}
                  type={"text"}
                  placeholder={"News content"}
                  value={newsData?.content}
                  onChange={(value) => handleChange(value, "content")}
                  autoComplete={"off"}
                  multiline={10}
                  maxHeight={200}
                />

                <TagsSelector/>

                <Checkbox
                  label="Published"
                  checked={newsData?.published}
                  onChange={(value) => handleChange(value, "published")}
                />

                <Button variant="primary" submit>Create news</Button>
              </FormLayout>
            </Form>
          </Card>
        </Box>
      </div>
    </InlineStack>
  );
};

export default NewsForm;