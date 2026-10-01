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
    agregarVehiculo: (state, action: PayloadAction<Omit<Vehiculo, 'id'>>) => {
      const nuevo: Vehiculo = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.vehiculos.push(nuevo);
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

export const { agregarVehiculo, actualizarKilometraje, seleccionarVehiculo } =
  vehiculoSlice.actions;

export default vehiculoSlice.reducer;