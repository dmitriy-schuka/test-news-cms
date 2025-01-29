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
  const { newsData, handleChange, tags, handleCreateNews, handleEditNews, handleDeleteNews } = props;

  return (
    <InlineStack align={"center"} blockAlign={"center"}>
      <div style={{maxWidth: "500px", width: "100%"}}>
        <Box>
          <Card>
            <Form onSubmit={newsData?.id ? handleEditNews : handleCreateNews}>
              <FormLayout>
                <MediaInput newsData={newsData} handleChange={handleChange}/>

                <TextField
                  label={"News title"}
                  type={"text"}
                  placeholder={"News title"}
                  value={newsData?.title || undefined}
                  onChange={(value) => handleChange(value, "title")}
                  autoComplete={"off"}
                />

                <TextField
                  label={"News content"}
                  type={"text"}
                  placeholder={"News content"}
                  value={newsData?.content || undefined}
                  onChange={(value) => handleChange(value, "content")}
                  autoComplete={"off"}
                  multiline={10}
                  maxHeight={200}
                />

                <TagsSelector tags={tags} newsData={newsData} handleChange={handleChange}/>

                <Checkbox
                  label="Published"
                  checked={newsData?.published}
                  onChange={(value) => handleChange(value, "published")}
                />

                {
                  newsData?.id
                    ?
                      <InlineStack align={"space-between"}>
                        <Button variant="primary" tone={"critical"} onClick={handleDeleteNews}>Delete</Button>
                        <Button variant="primary" submit>Edit</Button>
                      </InlineStack>
                    :
                      <Button variant="primary" submit>Create news</Button>
                }
              </FormLayout>
            </Form>
          </Card>
        </Box>
      </div>
    </InlineStack>
  );
};

export default NewsForm;