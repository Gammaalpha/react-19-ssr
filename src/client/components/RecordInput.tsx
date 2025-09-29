import { ChevronLeft, ChevronRight } from "@carbon/icons-react";
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
  SkeletonText,
} from "@carbon/react";
import {
  addRecord,
  fetchAllTopRecords,
  fetchRecordsHistory,
} from "@client/store/record/singleRecordSlice";
import { useAppDispatch, useAppSelector } from "@client/storeHooks";
import { Record, RecordType } from "@server/models/Record";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../styles/RecordInput.module.scss";

interface RecordsProps {
  recordItems?: Record[];
}

interface FormProps {
  description: string;
  selectedIndex: number;
  type: RecordType;
}

const initialFormInfo: FormProps = {
  description: "",
  selectedIndex: 0,
  type: "NEW",
};

const RecordInput: React.FC<RecordsProps> = () => {
  const { t } = useTranslation();
  const {
    recordItems = [],
    recordHistory = null,
    loading,
    error,
  } = useAppSelector((state: any) => state.record);
  const dispatch = useAppDispatch();

  const [formInfo, setFormInfo] = useState<FormProps>(initialFormInfo);

  const [selectedRecord, setSelectedRecord] = useState<Record>();

  const handleFormInput = (key: string, value: string | number | undefined) => {
    setFormInfo((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    console.log(formInfo);
  }, [formInfo]);

  const handleRecordDropdownChange = (data: any) => {
    setSelectedRecord(data.selectedItem);
    dispatch(fetchRecordsHistory(data.selectedItem.recordId));
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

  const handleDateChange = (changeKind: string) => {
    if (selectedRecord?.recordId) {
      let position = formInfo.selectedIndex;
      if (
        changeKind === "back" &&
        position < recordHistory[selectedRecord.recordId].length - 1
      ) {
        position += 1;
      } else if (changeKind === "forward") {
        position -= 1;
      } else if (changeKind === "latest") {
        position = 0;
      } else if (changeKind === "oldest") {
        position = recordHistory[selectedRecord.recordId].length - 1;
      }
      const desc =
        selectedRecord.recordId &&
        recordHistory[selectedRecord.recordId] &&
        recordHistory[selectedRecord.recordId][position].description;
      setFormInfo((prev: any) => ({
        ...prev,
        selectedIndex: position,
        description: desc,
      }));
    }
  };

  useEffect(() => {
    if (formInfo.type === "UPDATED") {
      dispatch(fetchAllTopRecords());
      if (selectedRecord && formInfo.description === "") {
        setFormInfo((prev: any) => ({
          ...prev,
          description: selectedRecord.description,
        }));
      }
    } else if (formInfo.type === "NEW") {
      setFormInfo(initialFormInfo);
    }
  }, [formInfo.type]);

  useEffect(() => {
    if (selectedRecord && recordHistory && !loading) {
      setFormInfo((prev: any) => ({
        ...prev,
        description:
          selectedRecord && selectedRecord.description
            ? selectedRecord.description
            : "",
      }));
    }
  }, [selectedRecord, recordHistory]);

  const itemToString = (item: any) => {
    return `${item.recordId} - ${new Date(item?.createdAt).toLocaleString()}`;
  };

  let descriptionFieldDisabled = true;
  let forwardDisabled = true;
  let backDisabled = false;
  if (formInfo.type === "NEW") {
    descriptionFieldDisabled = false;
  } else if (
    selectedRecord?.recordId &&
    recordHistory[selectedRecord.recordId]
  ) {
    descriptionFieldDisabled = formInfo.selectedIndex > 0;
    forwardDisabled =
      recordHistory[selectedRecord.recordId].length === 1 ||
      formInfo.selectedIndex === 0;

    backDisabled =
      recordHistory[selectedRecord.recordId].length === 1 ||
      recordHistory[selectedRecord.recordId].length - 1 ===
        formInfo.selectedIndex;
  }
  const dateObj =
    selectedRecord?.recordId &&
    recordHistory[selectedRecord.recordId] &&
    new Date(
      recordHistory[selectedRecord.recordId][formInfo.selectedIndex].createdAt
    ).toLocaleString();

  return (
    <div className="record-input-form">
      <FormGroup legendId="form-group-1" legendText="">
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
          {formInfo.type === "UPDATED" && (
            <Dropdown
              id="records-dropdown"
              items={recordItems}
              disabled={recordItems.length === 0}
              titleText={t("recordsList")}
              label={t("selectRecord")}
              onChange={handleRecordDropdownChange}
              itemToString={itemToString}
            />
          )}
          {/* Date picker */}
          {selectedRecord?.recordId &&
            formInfo.type === "UPDATED" &&
            recordHistory[selectedRecord.recordId] && (
              <div className="date-btn-group">
                <Button
                  disabled={backDisabled}
                  onClick={() => handleDateChange("oldest")}
                >
                  {t("oldest")}
                </Button>
                <Button
                  hasIconOnly
                  onClick={() => handleDateChange("back")}
                  iconDescription={t("navigateDateBack")}
                  renderIcon={() => <ChevronLeft />}
                  disabled={backDisabled}
                />
                {dateObj}
                <Button
                  hasIconOnly
                  onClick={() => handleDateChange("forward")}
                  iconDescription={t("navigateDateForward")}
                  renderIcon={() => <ChevronRight />}
                  disabled={forwardDisabled}
                />
                <Button
                  disabled={forwardDisabled}
                  onClick={() => handleDateChange("latest")}
                >
                  {t("latest")}
                </Button>
              </div>
            )}
          {loading && <SkeletonText />}
          {selectedRecord?.recordId &&
            formInfo.type === "UPDATED" &&
            recordHistory[selectedRecord.recordId] && (
              <div>
                Record History Count:
                {recordHistory[selectedRecord.recordId].length}
              </div>
            )}
          <TextInput
            id="description"
            key={`description-${formInfo.selectedIndex}`}
            labelText={t("description")}
            disabled={descriptionFieldDisabled}
            defaultValue={formInfo.description}
            onChange={(e) =>
              handleFormInput(
                "description",
                String(e.currentTarget.value).trim()
              )
            }
          />
          {loading ? (
            <ButtonSkeleton />
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={formInfo.selectedIndex > 0}
            >
              {t("submit")}
            </Button>
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
