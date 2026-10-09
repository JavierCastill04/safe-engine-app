import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Mantenimiento } from '@/types';

interface MantenimientoState {
  mantenimientos: Mantenimiento[];
}

const initialState: MantenimientoState = {
  mantenimientos: [
    {
      id: 'm1',
      vehiculoId: '1',
      fecha: '2026-09-15',
      kilometraje: 44500,
      tipo: 'aceite',
      costo: 45.0,
      notas: 'Cambio de aceite sintético 5W-30 y filtro de aceite.',
      detallesEspecificos: {
        tipoAceite: '5W-30 Sintético',
        filtroCambiado: true,
      },
    },
  ],
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
      state.mantenimientos.unshift(nuevo); // Agregar al inicio para mostrar el más reciente
    },
    eliminarMantenimiento: (state, action: PayloadAction<string>) => {
      state.mantenimientos = state.mantenimientos.filter((m) => m.id !== action.payload);
    },
  },
});

export const { agregarMantenimiento, eliminarMantenimiento, limpiarTodosLosMantenimientos } = mantenimientoSlice.actions;
export default mantenimientoSlice.reducer;