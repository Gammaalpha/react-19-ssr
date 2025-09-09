import { RECORDS_URL } from "@client/utils/constants";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Record } from "@server/models/Record";
import axios from "axios";

// Async thunk for fetching records from Express backend
export const fetchAllRecords = createAsyncThunk(
  "records/getAllRecords",
  async () => {
    try {
      const response = await axios.get(RECORDS_URL);
      return [...response.data];
    } catch (error: any) {
      console.error("API call failed: ", error || error?.message);
    }
  }
);

// Async thunk for adding a record
export const addRecord = createAsyncThunk(
  "records/addRecord",
  async (record: Record) => {
    try {
      const response = await axios.post(RECORDS_URL, record);
      return response.data;
    } catch (error: any) {
      console.error("API call failed: ", error || error?.message);
    }
  }
);

interface RecordState {
  recordItems: Record[];
  loading: boolean;
  error: any;
}

const initialState: RecordState = {
  recordItems: [],
  loading: false,
  error: null,
};

export const recordsSlice = createSlice({
  name: "record",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // use for simple operations for sync state updates
  reducers: {
    getRecordsCount: (state) => {
      state.recordItems.length;
    },
  },
  // use for complex async thunk state updates with actions.
  // addCase for every async opeartion
  extraReducers: (builder) => {
    builder
      // start for fetchRecords
      .addCase(fetchAllRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllRecords.fulfilled, (state, action) => {
        state.loading = false;
        if (action?.payload) {
          state.recordItems = action.payload;
        }
      })
      .addCase(fetchAllRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // end for fetchRecords
      // start for addRecord
      .addCase(addRecord.fulfilled, (state, action) => {
        state.recordItems.push(action.payload);
      });
    //end for addRecord
  },
});

export const { getRecordsCount } = recordsSlice.actions;

export default recordsSlice.reducer;
