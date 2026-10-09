import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TemaColor = 'oscuro' | 'azul';

interface ConfigState {
  tema: TemaColor;
}

const initialState: ConfigState = {
  tema: 'oscuro',
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    cambiarTema: (state, action: PayloadAction<TemaColor>) => {
      state.tema = action.payload;
    },
  },
});

export const { cambiarTema } = configSlice.actions;
export default configSlice.reducer;