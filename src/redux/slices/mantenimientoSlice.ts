import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Mantenimiento } from '@/types';

interface MantenimientoState {
  mantenimientos: Mantenimiento[];
}

const initialState: MantenimientoState = {
  mantenimientos: [], // Inicializado completamente vacío
};

const mantenimientoSlice = createSlice({
  name: 'mantenimientos',
  initialState,
  reducers: {
    limpiarTodosLosMantenimientos: (state) => {
      state.mantenimientos = [];
    },
    agregarMantenimiento: (state, action: PayloadAction<Omit<Mantenimiento, 'id'>>) => {
      const nuevo: Mantenimiento = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.mantenimientos.unshift(nuevo);
    },
    eliminarMantenimiento: (state, action: PayloadAction<string>) => {
      state.mantenimientos = state.mantenimientos.filter((m) => m.id !== action.payload);
    },
  },
});

export const { agregarMantenimiento, eliminarMantenimiento, limpiarTodosLosMantenimientos } =
  mantenimientoSlice.actions;
export default mantenimientoSlice.reducer;