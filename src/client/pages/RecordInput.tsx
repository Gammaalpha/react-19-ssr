import {
  FormGroup,
  Stack,
  TextInput,
  RadioButtonGroup,
  RadioButton,
  Button,
  Dropdown,
} from "@carbon/react";
import React, { useRef } from "react";
// import { useTranslation } from "react-i18next";

const RecordInput: React.FC = () => {
  const formInfo = useRef({
    description: "",
    type: "",
  });

  const handleFormInput = (key: string, value: string | number | undefined) => {
    formInfo.current = {
      ...formInfo.current,
      [key]: value,
    };
  };

  const handleSubmit = () => {};

  return (
    <div>
      <FormGroup
        legendId="form-group-1"
        legendText="Simple mongodb entry system with history"
        style={{
          maxWidth: "400px",
        }}
      >
        <Stack gap={7}>
          <Dropdown
            id="records-dropdown"
            items={[]}
            titleText="Records list"
            label="Select a record from the list"
          />

          <TextInput
            id="description"
            labelText="Description"
            onChange={(e) =>
              handleFormInput("description", e.currentTarget.value)
            }
          />
          <RadioButtonGroup
            // defaultSelected="new"
            legendText="Entry Type"
            name="formgroup-default-radio-button-group"
            onChange={(e) => handleFormInput("type", e)}
          >
            <RadioButton id="new" labelText="New" value="NEW" />
            <RadioButton id="updated" labelText="Updated" value="UPDATED" />
          </RadioButtonGroup>
          <Button>Submit</Button>
        </Stack>
      </FormGroup>
    </div>
  );
};

export default RecordInput;
