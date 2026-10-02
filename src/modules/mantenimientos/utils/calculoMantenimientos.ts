

import type { TipoMantenimiento, Mantenimiento } from '@/types';

export interface IntervaloMantenimiento {
  kilometros: number;
  meses: number;
}

export const INTERVALOS_MANTENIMIENTO: Record<TipoMantenimiento, IntervaloMantenimiento> = {
  aceite: { kilometros: 5000, meses: 6 },
  frenos: { kilometros: 20000, meses: 12 },
  neumaticos: { kilometros: 10000, meses: 6 },
  bateria: { kilometros: 40000, meses: 24 },
  general: { kilometros: 10000, meses: 12 }, 
};
export interface ProximoMantenimiento {
  tipo: TipoMantenimiento;
  ultimoKilometraje: number;
  ultimaFecha: string;
  proximoKilometraje: number;
  proximaFechaEstimada: string;
  kmRestantes: number;
  diasRestantes: number;
  estado: 'al_dia' | 'proximo' | 'vencido';
}

export const calcularProximoMantenimiento = (
  mantenimientosVehiculo: Mantenimiento[],
  tipo: TipoMantenimiento,
  kilometrajeActualVehiculo: number
): ProximoMantenimiento | null => {
  // Filtrar los mantenimientos del tipo solicitado
  const mantenimientosTipo = mantenimientosVehiculo
    .filter((m) => m.tipo === tipo)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  if (mantenimientosTipo.length === 0) {
    return null; // Aún no hay registros de este tipo
  }

  const ultimo = mantenimientosTipo[0];
  const intervalo = INTERVALOS_MANTENIMIENTO[tipo];

  // Cálculo por Kilometraje
  const proximoKilometraje = ultimo.kilometraje + intervalo.kilometros;
  const kmRestantes = proximoKilometraje - kilometrajeActualVehiculo;

  // Cálculo por Fecha
  const fechaUltimo = new Date(ultimo.fecha);
  const proximaFecha = new Date(fechaUltimo);
  proximaFecha.setMonth(proximaFecha.getMonth() + intervalo.meses);

  const hoy = new Date();
  const diferenciaTiempo = proximaFecha.getTime() - hoy.getTime();
  const diasRestantes = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));

  // Determinar Estado del Mantenimiento
  let estado: ProximoMantenimiento['estado'] = 'al_dia';
  if (kmRestantes <= 0 || diasRestantes <= 0) {
    estado = 'vencido';
  } else if (kmRestantes <= 1000 || diasRestantes <= 15) {
    estado = 'proximo';
  }

  return {
    tipo,
    ultimoKilometraje: ultimo.kilometraje,
    ultimaFecha: ultimo.fecha,
    proximoKilometraje,
    proximaFechaEstimada: proximaFecha.toISOString().split('T')[0],
    kmRestantes,
    diasRestantes,
    estado,
  };
};