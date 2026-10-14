import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Acento, Modo } from '@/theme/themeA';
 
export type ConfigState = {
  modo: Modo;
  acento: Acento;
};
 
const initialState: ConfigState = {
  modo: 'oscuro',
  acento: 'sky',
};
 
const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    cambiarModo(state, action: PayloadAction<Modo>) {
      state.modo = action.payload;
    },
    cambiarAcento(state, action: PayloadAction<Acento>) {
      state.acento = action.payload;
    },
  },
});
 
export const { cambiarModo, cambiarAcento } = configSlice.actions;
export default configSlice.reducer;
 