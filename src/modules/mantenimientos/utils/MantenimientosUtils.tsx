import type { TipoMantenimiento } from '@/types';

export const OpcionesTipoMantenimiento: { label: string; value: TipoMantenimiento }[] = [
  { label: 'Cambio de Aceite', value: 'aceite' },
  { label: 'Frenos', value: 'frenos' },
  { label: 'Neumáticos / Llantas', value: 'neumaticos' },
  { label: 'Batería y Sistema Eléctrico', value: 'bateria' },
  { label: 'Mantenimiento General', value: 'general' },
];

export const obtenerEtiquetaTipo = (tipo: TipoMantenimiento): string => {
  const opcion = OpcionesTipoMantenimiento.find((o) => o.value === tipo);
  return opcion ? opcion.label : tipo;
};

export const formatearMoneda = (monto: number): string => {
  return `$${monto.toFixed(2)}`;
};

export const formatearKilometraje = (km: number): string => {
  return `${km.toLocaleString()} km`;
};