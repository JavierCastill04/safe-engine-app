import type { Mantenimiento, Vehiculo } from '@/types';

export interface NotificacionItem {
  id: string;
  vehiculoId: string;
  vehiculoNombre: string;
  titulo: string;
  mensaje: string;
  tipo: 'vencido' | 'proximo';
  kilometrajeLímite?: number;
}

export const evaluarNotificacionesMantenimiento = (
  vehiculos: Vehiculo[],
  mantenimientos: Mantenimiento[]
): NotificacionItem[] => {
  const notificaciones: NotificacionItem[] = [];

  vehiculos.forEach((vehiculo) => {
    const mantenimientosVehiculo = mantenimientos.filter(
      (m) => m.vehiculoId === vehiculo.id
    );

    mantenimientosVehiculo.forEach((mantenimiento) => {
      const kmRealizado = mantenimiento.kilometraje || mantenimiento.kilometrajeRealiz || 0;
      const intervalo = mantenimiento.intervaloKm || 5000;
      const kmLimite = mantenimiento.siguienteMantenimientoKm || (kmRealizado + intervalo);

      const diferenciaKm = kmLimite - vehiculo.kilometrajeActual;

      // Condición 1: Vencido (se pasó del límite)
      if (diferenciaKm <= 0) {
        const kmExcedidos = Math.abs(diferenciaKm).toFixed(1).replace(',', '.');
        notificaciones.push({
          id: `vencido-${mantenimiento.id}`,
          vehiculoId: vehiculo.id,
          vehiculoNombre: `${vehiculo.marca} ${vehiculo.modelo}`,
          titulo: `Mantenimiento Vencido: ${mantenimiento.tipo.toUpperCase()}`,
          mensaje: `Se ha superado el límite sugerido por ${kmExcedidos} km. Por favor realiza la revisión.`,
          tipo: 'vencido',
          kilometrajeLímite: kmLimite,
        });
      }
      // Condición 2: Próximo (faltan 500 km o menos)
      else if (diferenciaKm <= 500) {
        const kmRestantes = diferenciaKm.toFixed(1).replace(',', '.');
        notificaciones.push({
          id: `proximo-${mantenimiento.id}`,
          vehiculoId: vehiculo.id,
          vehiculoNombre: `${vehiculo.marca} ${vehiculo.modelo}`,
          titulo: `Próximo Mantenimiento: ${mantenimiento.tipo.toUpperCase()}`,
          mensaje: `Faltan ${kmRestantes} km para alcanzar el límite de ${kmLimite.toFixed(1).replace(',', '.')} km.`,
          tipo: 'proximo',
          kilometrajeLímite: kmLimite,
        });
      }
    });
  });

  return notificaciones;
};