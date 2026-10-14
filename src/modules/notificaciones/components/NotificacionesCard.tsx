
import React from 'react';
import { Text, View } from 'react-native';
import {
  AlertTriangle,
  BellRing,
  CalendarDays,
  Gauge,
} from 'lucide-react-native';

import { commonStyles, colores } from '@/theme';

import type { NotificacionMantenimiento } from '../utils/NotificacionesUtils';

interface Props {
  notificacion: NotificacionMantenimiento;
}

export default function NotificacionesCard({
  notificacion,
}: Props) {
  const vencido = notificacion.estado === 'vencido';

  return (
    <View
      style={[
        commonStyles.card,
        commonStyles.notificacionesTarjeta,
      ]}
    >
      <View style={commonStyles.notificacionesEncabezado}>
        <View style={commonStyles.notificacionesIconoEncabezado}>
          {vencido ? (
            <AlertTriangle
              color={colores.rojo}
              size={22}
            />
          ) : (
            <BellRing
              color={colores.azulClaro}
              size={22}
            />
          )}
        </View>

        <View style={commonStyles.notificacionesEncabezadoTexto}>
          <Text
            style={[
              commonStyles.cardTitle,
              commonStyles.notificacionesTarjetaTitulo,
            ]}
          >
            {notificacion.titulo}
          </Text>

          <Text
            style={[
              commonStyles.secondaryText,
              commonStyles.notificacionesVehiculo,
            ]}
          >
            {notificacion.vehiculoNombre}
          </Text>
        </View>
      </View>

      <Text
        style={[
          commonStyles.text,
          commonStyles.notificacionesMensaje,
        ]}
      >
        {notificacion.mensaje}
      </Text>

      <View style={commonStyles.notificacionesDetalles}>
        <View style={commonStyles.notificacionesDetalleFila}>
          <CalendarDays color={colores.gris} size={17} />

          <Text
            style={[
              commonStyles.secondaryText,
              commonStyles.notificacionesDetalleTexto,
            ]}
          >
            Fecha estimada: {notificacion.fecha}
          </Text>
        </View>

        <View style={commonStyles.notificacionesDetalleFila}>
          <Gauge color={colores.gris} size={17} />

          <Text
            style={[
              commonStyles.secondaryText,
              commonStyles.notificacionesDetalleTexto,
            ]}
          >
            Kilometraje recomendado:{' '}
            {notificacion.kilometraje.toLocaleString()} km
          </Text>
        </View>
      </View>
    </View>
  );
}
