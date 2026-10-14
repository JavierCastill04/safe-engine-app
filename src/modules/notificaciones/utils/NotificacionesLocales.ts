
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { NotificacionMantenimiento } from './NotificacionesUtils';

const CANAL_MANTENIMIENTO = 'mantenimientos';
const CLAVE_AVISOS = '@safe_engine/avisos_locales';

let sincronizando = false;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const configurarNotificacionesLocales =
  async (): Promise<boolean> => {
    if (Platform.OS === 'web') return false;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(
        CANAL_MANTENIMIENTO,
        {
          name: 'Mantenimientos',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
        }
      );
    }

    const permisos = await Notifications.getPermissionsAsync();

    if (permisos.granted) return true;

    const respuesta = await Notifications.requestPermissionsAsync();

    return respuesta.granted;
  };

const obtenerClaveAviso = (
  notificacion: NotificacionMantenimiento
): string =>
  [
    notificacion.id,
    notificacion.estado,
    notificacion.fecha,
    notificacion.kilometraje,
  ].join('|');

export const sincronizarNotificacionesLocales = async (
  notificaciones: NotificacionMantenimiento[]
): Promise<void> => {
  if (sincronizando) return;

  sincronizando = true;

  try {
    // No solicitar permisos cuando no existen avisos.
    if (notificaciones.length === 0) return;

    const permitido = await configurarNotificacionesLocales();

    if (!permitido) return;

    const guardados = await AsyncStorage.getItem(CLAVE_AVISOS);

    const clavesEnviadas: string[] = guardados
      ? JSON.parse(guardados)
      : [];

    const historial = new Set(clavesEnviadas);

    for (const notificacion of notificaciones) {
      const clave = obtenerClaveAviso(notificacion);

      if (historial.has(clave)) continue;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: notificacion.titulo,
          body: `${notificacion.vehiculoNombre}: ${notificacion.mensaje}`,
          data: {
            vehiculoId: notificacion.vehiculoId,
            tipo: notificacion.tipo,
          },
        },
        trigger:
          Platform.OS === 'android'
            ? {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: 1,
                channelId: CANAL_MANTENIMIENTO,
              }
            : null,
      });

      historial.add(clave);

      // Guardar después de cada programación exitosa.
      await AsyncStorage.setItem(
        CLAVE_AVISOS,
        JSON.stringify([...historial])
      );
    }
  } catch (error) {
    console.error(
      'Error al sincronizar notificaciones locales:',
      error
    );
  } finally {
    sincronizando = false;
  }
};
