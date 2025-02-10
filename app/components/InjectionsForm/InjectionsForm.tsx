import React from 'react';
import {
  Button,
  Card,
  Form,
  Checkbox,
  FormLayout,
  InlineStack,
  BlockStack,
  Select,
  TextField
} from "@shopify/polaris";
import { INJECTION_DISPLAY_ON_TYPES, INJECTION_TYPES } from "~/constants/common";

const InjectionsForm = (props) => {
  const { injectionData, settingsData, news, handleChange, handleSettingsChange, handleCreateInjection, handleEditInjection, handleDeleteInjection } = props;

  return (
    <InlineStack align={"center"} blockAlign={"center"}>
      <div style={{maxWidth: "500px", width: "100%"}}>
        <BlockStack gap={300}>
          <Card>
            <Form onSubmit={injectionData?.id ? handleEditInjection : handleCreateInjection}>
              <FormLayout>
                <Select
                  label="Type"
                  options={INJECTION_TYPES}
                  value={injectionData?.injectionType || undefined}
                  onChange={(value) => handleChange(value, "injectionType")}
                  placeholder={"Please select injection type"}
                />

                {
                  injectionData?.injectionType === INJECTION_TYPES[0].value &&
                    <TextField
                      label="Image URL"
                      value={injectionData?.imageUrl || undefined}
                      // onChange={handleChange("url")}
                      onChange={(value) => handleChange(value, "imageUrl")}
                      autoComplete="off"
                    />
                }

                {
                  injectionData?.injectionType === INJECTION_TYPES[1].value &&
                    <BlockStack gap={300}>
                      <TextField
                        label="Text"
                        value={injectionData?.text || undefined}
                        // onChange={handleChange("text")}
                        onChange={(value) => handleChange(value, "text")}
                        autoComplete="off"
                      />

                      <TextField
                        label="Link (optional)"
                        value={injectionData?.linkUrl || undefined}
                        // onChange={handleChange("url")}
                        onChange={(value) => handleChange(value, "linkUrl")}
                        autoComplete="off"
                      />
                    </BlockStack>
                }

                {
                  injectionData?.injectionType === INJECTION_TYPES[2].value &&
                    <Select
                      label="Linked news"
                      options={news}
                      value={
                        injectionData?.newsId
                          ? Number(injectionData.newsId)
                          : undefined
                      }
                      onChange={(value) => handleChange(value, "newsId")}
                      placeholder={"Please select news id"}
                    />
                }

                <TextField
                  label="Priority"
                  type="number"
                  value={injectionData?.priority || undefined}
                  onChange={(value) => handleChange(Number(value), "priority")}
                  autoComplete="off"
                  prefix="%"
                  min={0}
                  max={100}
                />

                <TextField
                  label="Regular expression (optional)"
                  value={injectionData?.regex || undefined}
                  onChange={(value) => handleChange(value, "regex")}
                  autoComplete="off"
                />

                <Select
                  label="Page Display"
                  options={INJECTION_DISPLAY_ON_TYPES}
                  value={injectionData.displayOn || undefined}
                  onChange={(value) => handleChange(value, "displayOn")}
                  placeholder={"Please select display page"}
                />

                <Checkbox
                  label="Save as Draft"
                  checked={injectionData.isDraft || undefined}
                  onChange={(value) => handleChange(value, "isDraft")}
                />

                {
                  injectionData?.id
                    ?
                      <InlineStack align={"space-between"}>
                        <Button variant="primary" tone={"critical"} onClick={handleDeleteInjection}>Delete</Button>
                        <Button variant="primary" submit>Edit</Button>
                      </InlineStack>
                    :
                      <Button variant="primary" submit>Create injection</Button>
                }
              </FormLayout>
            </Form>
          </Card>

          <Card>
            <TextField
              label="Number of injections for one pagination News page"
              type="number"
              value={settingsData?.listInjections || undefined}
              onChange={(value) => handleSettingsChange(Number(value), "listInjections")}
              autoComplete="off"
              min={0}
              max={8}
              helpText={"Min: 0, max: 8"}
            />

            <TextField
              label="Number of injections for one pagination Search page"
              type="number"
              value={settingsData?.searchInjections || undefined}
              onChange={(value) => handleSettingsChange(Number(value), "searchInjections")}
              autoComplete="off"
              min={0}
              max={8}
              helpText={"Min: 0, max: 8"}
            />
          </Card>
        </BlockStack>
      </div>
    </InlineStack>
  );
};

export default InjectionsForm;