
import type {
  Vehiculo,
  Mantenimiento,
  TipoMantenimiento,
} from '@/types';

import {
  calcularProximoMantenimiento,
  type ProximoMantenimiento,
} from '@/modules/mantenimientos/utils/calculoMantenimientos';

export interface NotificacionMantenimiento {
  id: string;
  vehiculoId: string;
  vehiculoNombre: string;
  tipo: TipoMantenimiento;
  titulo: string;
  mensaje: string;
  estado: 'proximo' | 'vencido';
  fecha: string;
  kilometraje: number;
}

const TIPOS_MANTENIMIENTO: TipoMantenimiento[] = [
  'aceite',
  'frenos',
  'neumaticos',
  'bateria',
  'general',
];

const nombresMantenimiento: Record<TipoMantenimiento, string> = {
  aceite: 'Cambio de aceite',
  frenos: 'Revisión de frenos',
  neumaticos: 'Mantenimiento de neumáticos',
  bateria: 'Revisión de batería',
  general: 'Mantenimiento general',
};

const generarMensaje = (
  proximo: ProximoMantenimiento
): string => {
  const {
    estado,
    vencidoPorFecha,
    vencidoPorKilometraje,
    kmRestantes,
    diasRestantes,
  } = proximo;

  if (estado === 'vencido') {
    if (vencidoPorFecha && vencidoPorKilometraje) {
      return (
        'Este mantenimiento está vencido por fecha y ' +
        'kilometraje. Se recomienda realizarlo cuanto antes.'
      );
    }

    if (vencidoPorFecha) {
      return (
        'Este mantenimiento está vencido por fecha. ' +
        `Han transcurrido ${Math.abs(diasRestantes)} días ` +
        'desde la fecha recomendada.'
      );
    }

    return (
      'Este mantenimiento está vencido por kilometraje. ' +
      `Se ha superado el límite recomendado por ` +
      `${Math.abs(kmRestantes).toLocaleString()} km.`
    );
  }

  const detalles: string[] = [];

  if (diasRestantes <= 15) {
    detalles.push(
      `faltan ${diasRestantes} días para la fecha recomendada`
    );
  }

  if (kmRestantes <= 1000) {
    detalles.push(
      `faltan ${kmRestantes.toLocaleString()} km para el límite recomendado`
    );
  }

  return (
    'Este mantenimiento está próximo: ' +
    detalles.join(' y ') +
    '.'
  );
};

export const obtenerNotificaciones = (
  vehiculos: Vehiculo[],
  mantenimientos: Mantenimiento[]
): NotificacionMantenimiento[] => {
  const notificaciones: NotificacionMantenimiento[] = [];

  vehiculos.forEach((vehiculo) => {
    const mantenimientosVehiculo = mantenimientos.filter(
      (mantenimiento) =>
        mantenimiento.vehiculoId === vehiculo.id
    );

    TIPOS_MANTENIMIENTO.forEach((tipo) => {
      const proximo = calcularProximoMantenimiento(
        mantenimientosVehiculo,
        tipo,
        vehiculo.kilometrajeActual
      );

      if (!proximo || proximo.estado === 'al_dia') {
        return;
      }

      const nombreTipo = nombresMantenimiento[tipo];
      const vencido = proximo.estado === 'vencido';

      notificaciones.push({
        id: `${vehiculo.id}-${tipo}`,
        vehiculoId: vehiculo.id,
        vehiculoNombre: `${vehiculo.marca} ${vehiculo.modelo}`,
        tipo,
        titulo: vencido
          ? `Mantenimiento pendiente: ${nombreTipo}`
          : `Mantenimiento próximo: ${nombreTipo}`,
        mensaje: generarMensaje(proximo),
        estado: proximo.estado,
        fecha: proximo.proximaFechaEstimada,
        kilometraje: proximo.proximoKilometraje,
      });
    });
  });

  return notificaciones.sort((a, b) => {
    if (a.estado !== b.estado) {
      return a.estado === 'vencido' ? -1 : 1;
    }

    return a.fecha.localeCompare(b.fecha);
  });
};
