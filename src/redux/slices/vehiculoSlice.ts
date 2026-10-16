import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Vehiculo } from '@/types/Vehiculo';

interface VehiculosState {
  vehiculos: Vehiculo[];
  vehiculoSeleccionadoId: string | null;
}

const initialState: VehiculosState = {
  vehiculos: [], // Inicializado completamente vacío
  vehiculoSeleccionadoId: null,
};

const vehiculoSlice = createSlice({
  name: 'vehiculos',
  initialState,
  reducers: {
    limpiarTodosLosVehiculos: (state) => {
      state.vehiculos = [];
      state.vehiculoSeleccionadoId = null;
    },
    agregarVehiculo: (state, action: PayloadAction<Omit<Vehiculo, 'id'>>) => {
      const nuevo: Vehiculo = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.vehiculos.push(nuevo);
      if (!state.vehiculoSeleccionadoId) {
        state.vehiculoSeleccionadoId = nuevo.id;
      }
    },
    actualizarVehiculo: (state, action: PayloadAction<Vehiculo>) => {
      const indice = state.vehiculos.findIndex((vehiculo) => vehiculo.id === action.payload.id);
      if (indice !== -1) {
        state.vehiculos[indice] = action.payload;
      }
    },
    eliminarVehiculo: (state, action: PayloadAction<string>) => {
      state.vehiculos = state.vehiculos.filter((vehiculo) => vehiculo.id !== action.payload);
      if (state.vehiculoSeleccionadoId === action.payload) {
        state.vehiculoSeleccionadoId = state.vehiculos[0]?.id || null;
      }
    },
    actualizarKilometraje: (
      state,
      action: PayloadAction<{ id: string; nuevoKilometraje: number }>
    ) => {
      const vehiculo = state.vehiculos.find((v) => v.id === action.payload.id);
      if (vehiculo) {
        vehiculo.kilometrajeActual = action.payload.nuevoKilometraje;
      }
    },
    seleccionarVehiculo: (state, action: PayloadAction<string>) => {
      state.vehiculoSeleccionadoId = action.payload;
    },
  },
});

export const {
  agregarVehiculo,
  actualizarVehiculo,
  eliminarVehiculo,
  actualizarKilometraje,
  seleccionarVehiculo,
  limpiarTodosLosVehiculos,
} = vehiculoSlice.actions;

export default vehiculoSlice.reducer;