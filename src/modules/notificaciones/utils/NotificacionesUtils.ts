import type { Vehiculo, Mantenimiento, TipoMantenimiento } from '@/types';
import { calcularProximoMantenimiento } from '@/modules/mantenimientos/utils/calculoMantenimientos';

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

export const obtenerNotificaciones = (
  vehiculos: Vehiculo[],
  mantenimientos: Mantenimiento[]
): NotificacionMantenimiento[] => {
  const notificaciones: NotificacionMantenimiento[] = [];

  vehiculos.forEach((vehiculo) => {
    const mantenimientosVehiculo = mantenimientos.filter(
      (mantenimiento) => mantenimiento.vehiculoId === vehiculo.id
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
        mensaje: vencido
          ? `El mantenimiento está vencido. Kilometraje recomendado: ${proximo.proximoKilometraje.toLocaleString()} km.`
          : `Quedan aproximadamente ${Math.max(0, proximo.kmRestantes).toLocaleString()} km o ${Math.max(0, proximo.diasRestantes)} días para el mantenimiento.`,
        estado: proximo.estado,
        fecha: proximo.proximaFechaEstimada,
        kilometraje: proximo.proximoKilometraje,
      });
    });
  });

  return notificaciones.sort((a, b) => {
    if (a.estado === b.estado) {
      return a.fecha.localeCompare(b.fecha);
    }

    return a.estado === 'vencido' ? -1 : 1;
  });
};