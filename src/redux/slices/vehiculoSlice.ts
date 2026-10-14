
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Vehiculo } from '@/types/Vehiculo';

interface VehiculosState {
  vehiculos: Vehiculo[];
  vehiculoSeleccionadoId: string | null;
}

const initialState: VehiculosState = {
  vehiculos: [
    {
      id: '1',
      marca: 'Toyota',
      modelo: 'Corolla',
      anio: 2020,
      placa: 'P123-456',
      kilometrajeActual: 45000,
    },
    {
      id: '2',
      marca: 'Honda',
      modelo: 'Civic',
      anio: 2022,
      placa: 'P789-012',
      kilometrajeActual: 22000,
    },
  ],
  vehiculoSeleccionadoId: '1',
};

const vehiculoSlice = createSlice({
  name: 'vehiculos',
  initialState,
  reducers: {
    limpiarTodosLosVehiculos: (state) => {
      state.vehiculos = [];
      state.vehiculoSeleccionadoId = null;
    },

    agregarVehiculo: (
      state,
      action: PayloadAction<Omit<Vehiculo, 'id'>>
    ) => {
      const nuevo: Vehiculo = {
        ...action.payload,
        id: Date.now().toString(),
      };

      state.vehiculos.push(nuevo);
    },

    actualizarVehiculo: (
      state,
      action: PayloadAction<Vehiculo>
    ) => {
      const indice = state.vehiculos.findIndex(
        (vehiculo) => vehiculo.id === action.payload.id
      );

      if (indice !== -1) {
        state.vehiculos[indice] = action.payload;
      }
    },

    eliminarVehiculo: (
      state,
      action: PayloadAction<string>
    ) => {
      state.vehiculos = state.vehiculos.filter(
        (vehiculo) => vehiculo.id !== action.payload
      );

      if (state.vehiculoSeleccionadoId === action.payload) {
        state.vehiculoSeleccionadoId = null;
      }
    },

    actualizarKilometraje: (
      state,
      action: PayloadAction<{
        id: string;
        nuevoKilometraje: number;
      }>
    ) => {
      const vehiculo = state.vehiculos.find(
        (v) => v.id === action.payload.id
      );

      if (vehiculo) {
        vehiculo.kilometrajeActual =
          action.payload.nuevoKilometraje;
      }
    },

    seleccionarVehiculo: (
      state,
      action: PayloadAction<string>
    ) => {
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