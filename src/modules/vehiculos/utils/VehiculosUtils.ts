import { Vehiculo } from '@/types/Vehiculo';

export const formatearKilometraje = (km: number): string => {
  return `${km.toLocaleString('es-ES')} km`;
};

export const validarPlaca = (placa: string): boolean => {
  return placa.trim().length >= 6;
};

export const obtenerNombreCompletoVehiculo = (vehiculo: Vehiculo): string => {
  return `${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.anio})`;
};