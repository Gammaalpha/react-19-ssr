import {
  FormGroup,
  Stack,
  TextInput,
  RadioButtonGroup,
  RadioButton,
  Button,
  Dropdown,
  ButtonSkeleton,
  InlineNotification,
} from "@carbon/react";
import {
  addRecord,
  fetchAllRecords,
} from "@client/store/record/singleRecordSlice";
import { useAppDispatch, useAppSelector } from "@client/storeHooks";
import { Record } from "@server/models/Record";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface RecordsProps {
  recordItems?: Record[];
}

const RecordInput: React.FC<RecordsProps> = () => {
  const { t } = useTranslation();
  const {
    recordItems = [],
    loading,
    error,
  } = useAppSelector((state: any) => state.record);
  const dispatch = useAppDispatch();

  const [formInfo, setFormInfo] = useState<any>({
    description: "",
    type: "NEW",
  });

  const [selectedRecord, setSelectedRecord] = useState<Record>();

  const handleFormInput = (key: string, value: string | number | undefined) => {
    setFormInfo((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleRecordDropdownChange = (data: any) => {
    setSelectedRecord(data.selectedItem);
  };

  const handleSubmit = () => {
    if (formInfo.type === "NEW") {
      dispatch(addRecord(formInfo));
    } else if (formInfo.type === "UPDATED" && selectedRecord) {
      dispatch(
        addRecord({
          ...formInfo,
          recordId: selectedRecord.recordId,
        })
      );
    }
  };

  useEffect(() => {
    if (formInfo.type === "UPDATED" && recordItems.length === 0) {
      dispatch(fetchAllRecords());
    }
  }, [formInfo]);

  // useEffect(() => {
  //   console.log(recordItems);
  // }, [recordItems]);

  useEffect(() => {
    setFormInfo((prev: any) => ({
      ...prev,
      description:
        selectedRecord && selectedRecord.description
          ? selectedRecord.description
          : "",
    }));
  }, [selectedRecord]);

  const itemToString = (item: any) => {
    return `${item.recordId} - ${new Date(item?.createdAt).toLocaleString()}`;
  };

  return (
    <div>
      <FormGroup
        legendId="form-group-1"
        legendText=""
        style={{
          maxWidth: "400px",
        }}
      >
        <Stack gap={7}>
          <RadioButtonGroup
            defaultSelected="NEW"
            legendText={t("entryType")}
            name="formgroup-default-radio-button-group"
            onChange={(e) => handleFormInput("type", e)}
          >
            <RadioButton id="new" labelText="New" value="NEW" />
            <RadioButton id="updated" labelText="Updated" value="UPDATED" />
          </RadioButtonGroup>
          <Dropdown
            id="records-dropdown"
            items={recordItems}
            disabled={recordItems.length === 0 || formInfo.type === "NEW"}
            titleText={t("recordsList")}
            label={t("selectRecord")}
            onChange={handleRecordDropdownChange}
            itemToString={itemToString}
          />
          {/* Date picker */}
          <TextInput
            id="description"
            labelText={t("description")}
            defaultValue={formInfo.description}
            onChange={(e) =>
              handleFormInput("description", e.currentTarget.value)
            }
          />
          {loading ? (
            <ButtonSkeleton />
          ) : (
            <Button onClick={handleSubmit}>{t("submit")}</Button>
          )}
          {error && (
            <InlineNotification
              onClose={() => {}}
              onCloseButtonClick={() => {}}
              title={t("recordSaveError.title")}
              subtitle={t("recordSaveError.description")}
            />
          )}
        </Stack>
      </FormGroup>
    </div>
  );
};

export default RecordInput;
