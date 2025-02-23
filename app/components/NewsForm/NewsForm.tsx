import React from 'react';
import type {FC} from "react";
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
import type { News } from "~/@types/news";
import type { Tag } from "~/@types/tag";

interface INewsFormProps {
  newsData: News;
  handleChange: (value: any, field: string) => void;
  tags: Tag[];
  handleCreateNews: () => void;
  handleEditNews: () => void;
  handleDeleteNews: () => void;
}

const NewsForm: FC<INewsFormProps> = (props) => {
  const { newsData, handleChange, tags, handleCreateNews, handleEditNews, handleDeleteNews } = props;
  const isEditing = Boolean(newsData?.id);

  return (
    <InlineStack align={"center"} blockAlign={"center"}>
      <div style={{maxWidth: "500px", width: "100%"}}>
        <Box>
          <Card>
            <Form onSubmit={isEditing ? handleEditNews : handleCreateNews}>
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

                <TagsSelector tags={tags} newsTags={newsData?.tags} handleChange={handleChange}/>

                <Checkbox
                  label="Published"
                  checked={newsData?.published}
                  onChange={(value) => handleChange(value, "published")}
                />

                {
                  isEditing
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