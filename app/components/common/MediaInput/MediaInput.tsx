import React, { useState, useCallback } from 'react';
import {
  Button,
  BlockStack,
  ButtonGroup,
  InlineStack,
  Text,
  DropZone,
} from "@shopify/polaris";
import { NoteIcon } from '@shopify/polaris-icons';

const MediaInput = () => {
  const [files, setFiles] = useState<File[]>([]);

  const handleDropZoneDrop = useCallback(
    (_dropFiles: File[], acceptedFiles: File[], _rejectedFiles: File[]) =>
      setFiles([...acceptedFiles]),
    [],
  );

  const clearImages = useCallback(() => {
    setFiles([]);
  }, [setFiles]);

  const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
  const validVideoTypes = ['video/mp4'];

  const fileUpload = !files.length && <DropZone.FileUpload />;
  const uploadedFiles = files.length > 0 && (
    <div style={{padding: '0'}}>
      <BlockStack>
        {
          files.map((file, index) => (
            <InlineStack key={index} align={"center"} blockAlign={"center"}>
              {
                validImageTypes.includes(file.type)
                  ?
                    <img
                      src={window.URL.createObjectURL(file)}
                      alt={"Media image"}
                      style={{maxWidth: "373px", maxHeight: "118px"}}
                    />
                  :
                    validVideoTypes.includes(file.type)
                      ?
                        <video
                          src={window.URL.createObjectURL(file)}
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