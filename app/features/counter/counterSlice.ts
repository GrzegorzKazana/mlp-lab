import { createSlice, ThunkAction, Action } from '@reduxjs/toolkit';

export const name = 'counter';

const counterSlice = createSlice({
  name,
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
});

type State = ReturnType<typeof counterSlice.reducer>;
type AppState = { [name]: State };
type Selector<T> = (state: AppState) => T;
type Thunk<T extends unknown[] = []> = (
  ...props: T
) => ThunkAction<void, AppState, unknown, Action<string>>;

export const { increment, decrement } = counterSlice.actions;

export const incrementIfOdd: Thunk = () => {
  return (dispatch, getState) => {
    const state = getState();
    if (state.counter.value % 2 === 0) {
      return;
    }
    dispatch(increment());
  };
};

export const incrementAsync: Thunk<[number?]> = (delay = 1000) => (
  dispatch
) => {
  setTimeout(() => {
    dispatch(increment());
  }, delay);
};

export default counterSlice.reducer;

export const selectCount: Selector<number> = ({ counter }) => counter.value;
