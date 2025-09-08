import { configureStore } from "@reduxjs/toolkit";
import recordReducer from "./record/recordSlice";

const store = configureStore({
  reducer: {
    record: recordReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
