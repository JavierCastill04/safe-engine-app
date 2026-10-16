import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SchedulableTriggerInputTypes } from 'expo-notifications/build/Notifications.types';
import { setNotificationHandler } from 'expo-notifications/build/NotificationsHandler';
import {
  getPermissionsAsync,
  requestPermissionsAsync,
} from 'expo-notifications/build/NotificationPermissions';
import { setNotificationChannelAsync } from 'expo-notifications/build/setNotificationChannelAsync';
import { scheduleNotificationAsync } from 'expo-notifications/build/scheduleNotificationAsync';

import type { NotificacionItem } from './NotificacionesUtils'; // 👈 Se corrige la importación

const CANAL_MANTENIMIENTO = 'mantenimientos';
const CLAVE_AVISOS = '@safe_engine/avisos_locales';

let sincronizando = false;

if (Platform.OS !== 'web') {
  setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

export const configurarNotificacionesLocales = async (): Promise<boolean> => {
  if (Platform.OS === 'web') return false;

  if (Platform.OS === 'android') {
    await setNotificationChannelAsync(CANAL_MANTENIMIENTO, {
      name: 'Mantenimientos',
      importance: 4,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const permisos = await getPermissionsAsync();

  if (permisos.granted) return true;

  const respuesta = await requestPermissionsAsync();

  return respuesta.granted;
};

const obtenerClaveAviso = (notificacion: NotificacionItem): string =>
  [
    notificacion.id,
    notificacion.tipo,
    notificacion.vehiculoId,
    notificacion.kilometrajeLímite || 0,
  ].join('|');

export const sincronizarNotificacionesLocales = async (
  notificaciones: NotificacionItem[]
): Promise<void> => {
  if (sincronizando) return;

  sincronizando = true;

  try {
    if (notificaciones.length === 0) return;

    const permitido = await configurarNotificacionesLocales();

    if (!permitido) return;

    const guardados = await AsyncStorage.getItem(CLAVE_AVISOS);

    const clavesEnviadas: string[] = guardados ? JSON.parse(guardados) : [];

    const historial = new Set(clavesEnviadas);

    for (const notificacion of notificaciones) {
      const clave = obtenerClaveAviso(notificacion);

      if (historial.has(clave)) continue;

      await scheduleNotificationAsync({
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
                type: SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: 1,
                channelId: CANAL_MANTENIMIENTO,
              }
            : null,
      });

      historial.add(clave);

      await AsyncStorage.setItem(CLAVE_AVISOS, JSON.stringify([...historial]));
    }
  } catch (error) {
    console.error('Error al sincronizar notificaciones locales:', error);
  } finally {
    sincronizando = false;
  }
};