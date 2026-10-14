
import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { useAppSelector } from '@/redux/hooks';
import { obtenerNotificaciones } from '../utils/NotificacionesUtils';
import {
  sincronizarNotificacionesLocales,
} from '../utils/NotificacionesLocales';

export default function NotificacionesManager() {
  const vehiculos = useAppSelector(
    (state) => state.vehiculos.vehiculos
  );

  const mantenimientos = useAppSelector(
    (state) => state.mantenimientos.mantenimientos
  );

  const [revision, setRevision] = useState(0);

  // Volver a comprobar las fechas al regresar a la aplicación.
  useEffect(() => {
    const suscripcion = AppState.addEventListener(
      'change',
      (estado) => {
        if (estado === 'active') {
          setRevision((valor) => valor + 1);
        }
      }
    );

    return () => suscripcion.remove();
  }, []);

  const revisarMantenimientos = useCallback(async () => {
    const notificaciones = obtenerNotificaciones(
      vehiculos,
      mantenimientos
    );

    await sincronizarNotificacionesLocales(notificaciones);
  }, [vehiculos, mantenimientos]);

  useEffect(() => {
    void revisarMantenimientos();
  }, [revisarMantenimientos, revision]);

  return null;
}
