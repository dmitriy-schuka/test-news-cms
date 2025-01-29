import React, { useState, useCallback, useEffect } from 'react';
import {
  Button,
  BlockStack,
  ButtonGroup,
  InlineStack,
  Text,
  DropZone,
} from "@shopify/polaris";
import { NoteIcon } from '@shopify/polaris-icons';
import { checkIsArray } from "~/utils/common";
import { VALID_IMAGE_TYPES, VALID_VIDEO_TYPES } from "~/constants/common";

const MediaInput = ({ newsData, handleChange }) => {
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (newsData?.media && checkIsArray(newsData.media)) {

      const newsFiles = newsData.media.map((media) => ({
        url: media?.url,
        type: media?.mediaType,
      }));
      setFiles(newsFiles);
    }
  }, [newsData]);

  const handleDropZoneDrop = useCallback(
    async (_dropFiles: File[], acceptedFiles: File[], _rejectedFiles: File[]) => {
      setFiles([...acceptedFiles]);
      handleChange(acceptedFiles ,'files');
    },
    [setFiles, handleChange],
  );

  const clearImages = useCallback(() => {
    setFiles([]);
  }, [setFiles]);

  const fileUpload = !files.length && <DropZone.FileUpload />;
  const uploadedFiles = files.length > 0 && (
    <div style={{padding: '0'}}>
      <BlockStack>
        {
          files.map((file, index) => (
            <InlineStack key={index} align={"center"} blockAlign={"center"}>
              {
                VALID_IMAGE_TYPES.includes(file.type)
                  ?
                    <img
                      src={file?.url ? file.url : window.URL.createObjectURL(file)}
                      alt={"Media image"}
                      style={{maxWidth: "373px", maxHeight: "118px"}}
                    />
                  :
                  VALID_VIDEO_TYPES.includes(file.type)
                      ?
                        <video
                          src={file?.url ? file.url : window.URL.createObjectURL(file)}
                          autoPlay
                          style={{maxWidth: "373px", maxHeight: "118px"}}
                        />
                      :
                        <img
                          src={NoteIcon}
                          alt={"Media image"}
                          style={{maxWidth: "373px", maxHeight: "118px"}}
                        />
              }

              {/*<Text variant="bodySm" as="p">*/}
              {/*  {file.type}*/}
              {/*</Text>*/}
            </InlineStack>
          ))
        }
      </BlockStack>
    </div>
  );

  return (
    <BlockStack gap={200}>
      <Text variant="bodyMd" as="p">
        News media
      </Text>

      <DropZone onDrop={handleDropZoneDrop}>
        {uploadedFiles}
        {fileUpload}
      </DropZone>

      <ButtonGroup>
        <Button tone={"critical"} variant={"primary"} onClick={clearImages}>
          Clear media
        </Button>
      </ButtonGroup>
    </BlockStack>
  );
};

export default MediaInput;