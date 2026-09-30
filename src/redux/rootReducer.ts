import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import vehiculosReducer from './slices/vehiculoSlice';
import mantenimientosReducer from './slices/mantenimientoSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  vehiculos: vehiculosReducer,
  mantenimientos: mantenimientosReducer,
});

export default rootReducer;