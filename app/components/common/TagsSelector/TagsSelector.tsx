import React, { useState, useCallback, useMemo, useEffect } from 'react';
import type { FC } from "react";
import {
  BlockStack,
  InlineStack,
  Text,
  Tag,
  Icon,
  Combobox,
  Listbox,
} from "@shopify/polaris";
import { SearchIcon } from '@shopify/polaris-icons';
import { checkIsArray } from "~/utils/common";
import type { Tag as TagType } from "~/@types/tag";

interface ITagsSelectorProps {
  tags: TagType[];
  newsTags: string[];
  handleChange: (value: string[], field: string) => void;
}

const TagsSelector: FC<ITagsSelectorProps> = ({tags, newsTags, handleChange}) => {
  const deselectedOptions = useMemo(() => {
    if (checkIsArray(tags)) {
      return tags.map(({id, name}) => ({
        value: id,
        label: name
      }));
    } else {
      return []
    }
  }, [tags]);

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [options, setOptions] = useState(deselectedOptions);

  useEffect(() => {
    if (checkIsArray(newsTags)) {
      setSelectedOptions(newsTags);
    }
  }, [setSelectedOptions, newsTags])

  const escapeSpecialRegExCharacters = useCallback(
    (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    [],
  );

  const updateText = useCallback(
    (value: string) => {
      setInputValue(value);

      if (value === '') {
        setOptions(deselectedOptions);
        return;
      }

      const filterRegex = new RegExp(escapeSpecialRegExCharacters(value), 'i');
      const resultOptions = deselectedOptions.filter((option) =>
        option.label.match(filterRegex),
      );
      setOptions(resultOptions);
    },
    [deselectedOptions, escapeSpecialRegExCharacters],
  );

  const updateSelection = useCallback(
    (selected: string) => {
      if (selectedOptions.includes(selected)) {
        const newOptions = selectedOptions.filter((option) => option !== selected);
        setSelectedOptions(newOptions);

        handleChange(newOptions, "tags");
      } else {
        setSelectedOptions([...selectedOptions, selected]);
        handleChange([...selectedOptions, selected], "tags");
      }

      updateText('');
    },
    [selectedOptions, updateText],
  );

  const removeTag = useCallback(
    (tag: string) => () => {
      const options = [...selectedOptions];
      options.splice(options.indexOf(tag), 1);
      setSelectedOptions(options);
      handleChange(options, "tags");
    },
    [selectedOptions],
  );

  const tagsMarkup = selectedOptions.map((option) => {
    const optionLabel = tags?.find(({id}) => id === option).name;

    return (
      <Tag key={`option-${option}`} onRemove={removeTag(option)}>
        {optionLabel}
      </Tag>
    )
  });

  const optionsMarkup =
    options.length > 0
      ? options.map((option) => {
        const {label, value} = option;

        return (
          <Listbox.Option
            key={`${value}`}
            value={value}
            selected={selectedOptions.includes(value)}
            accessibilityLabel={label}
          >
            {label}
          </Listbox.Option>
        );
      })
      : null;

  return (
    <BlockStack gap={200}>
      <Text variant="bodyMd" as="p">
        News tags
      </Text>

      <Combobox
        allowMultiple
        activator={
          <Combobox.TextField
            prefix={<Icon source={SearchIcon} />}
            onChange={updateText}
            label="Search tags"
            labelHidden
            value={inputValue}
            placeholder="Search tags"
            autoComplete="off"
          />
        }
      >
        {
          optionsMarkup &&
            <Listbox onSelect={updateSelection}>{optionsMarkup}</Listbox>
        }
      </Combobox>

      <InlineStack gap={200} align={"start"}>
        {tagsMarkup}
      </InlineStack>
    </BlockStack>
  );
};

export default TagsSelector;