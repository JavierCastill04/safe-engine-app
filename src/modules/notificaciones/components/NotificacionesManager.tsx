import React, { useEffect } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { evaluarNotificacionesMantenimiento } from '../utils/NotificacionesUtils';

export const NotificacionesManager = () => {
  const vehiculos = useAppSelector((state) => state.vehiculos.vehiculos);
  const mantenimientos = useAppSelector((state) => state.mantenimientos.mantenimientos);

  useEffect(() => {
    if (!vehiculos.length || !mantenimientos.length) return;

    const notificacionesActivas = evaluarNotificacionesMantenimiento(vehiculos, mantenimientos);

    // Las notificaciones quedan calculadas y listas para la vista
    if (notificacionesActivas.length > 0) {
      // Manejador centralizado para logs o badges de la tab de notificaciones
    }
  }, [vehiculos, mantenimientos]);

  return null;
};

export default NotificacionesManager;