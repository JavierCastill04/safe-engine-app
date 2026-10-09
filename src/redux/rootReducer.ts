import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import vehiculosReducer from './slices/vehiculoSlice';
import mantenimientosReducer from './slices/mantenimientoSlice';
import configReducer from './slices/configSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  vehiculos: vehiculosReducer,
  mantenimientos: mantenimientosReducer,
  config: configReducer, 
});

export default rootReducer;