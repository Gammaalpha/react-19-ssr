import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Record } from "@server/models/Record";

interface RecordState {
  recordItems: Record[];
}

const initialState: RecordState = {
  recordItems: [],
};

export const recordSlice = createSlice({
  name: "record",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    saveRecord: (record) => {},
    // Use the PayloadAction type to declare the contents of `action.payload`
    getRecords: (state, action: PayloadAction<Record[]>) => {},
  },
});

export const { saveRecord, getRecords } = recordSlice.actions;

export default recordSlice.reducer;
