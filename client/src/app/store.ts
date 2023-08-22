import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import employeeReducer from "../features/employees/employeeSlice";
import cafeReducer from "../features/cafe/cafeSlice";

export const store = configureStore({
  reducer: {
    cafes: cafeReducer,
    employees: employeeReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
