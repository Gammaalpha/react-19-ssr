import { RECORDS_URL } from "@client/utils/constants";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Record } from "@server/models/Record";
import axios from "axios";
import { RootState } from "..";

// Async thunk for fetching records from Express backend
export const fetchAllTopRecords = createAsyncThunk(
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

// Async thunk for fetching a record history from Express backend
export const fetchRecordsHistory = createAsyncThunk(
  "records/fetchRecordsHistory",
  async (recordId: string) => {
    try {
      const response = await axios.get(`${RECORDS_URL}/${recordId}/all`);
      return [...response.data];
    } catch (error: any) {
      console.error("API call failed: ", error || error?.message);
    }
  },
  {
    condition: (recordId, { getState }) => {
      const { record } = getState() as RootState;
      return !record.recordHistory[recordId];
    },
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
  recordHistory: any;
  recordItems: Record[];
  loading: boolean;
  error: any;
}

const initialState: RecordState = {
  recordHistory: {},
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
    clearRecordItems: (state) => {
      state.recordItems = [];
    },
  },
  // use for complex async thunk state updates with actions.
  // addCase for every async opeartion
  extraReducers: (builder) => {
    builder
      // start for fetchRecords
      .addCase(fetchAllTopRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTopRecords.fulfilled, (state, action) => {
        state.loading = false;
        if (action?.payload) {
          state.recordItems = action.payload;
        }
      })
      .addCase(fetchAllTopRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // end for fetchRecords
      // start for addRecord
      .addCase(addRecord.fulfilled, (state, action) => {
        const { type, recordId } = action.payload;
        if (type === "UPDATED") {
          // update individual record with new info
          const updatedRecordItems = state.recordItems.reduce(
            (acc: Record[], curr: Record) => {
              if (curr.recordId === recordId) {
                return [action.payload, ...acc];
              }
              return [curr, ...acc];
            },
            []
          );
          state.recordItems = updatedRecordItems;
          // update record history for that item
          state.recordHistory[action.payload.recordId].unshift(action.payload);
        } else {
          state.recordItems.push(action.payload);
        }
      })
      //end for addRecord
      //start for getRecordsHistory
      .addCase(fetchRecordsHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecordsHistory.fulfilled, (state, action: any) => {
        state.loading = false;
        if (action?.payload[0]?.recordId) {
          state.recordHistory[action.payload[0].recordId] = action.payload;
        }
      })
      .addCase(fetchRecordsHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
    //end for getRecordsHistory
  },
});

export const { clearRecordItems } = recordsSlice.actions;

export default recordsSlice.reducer;
