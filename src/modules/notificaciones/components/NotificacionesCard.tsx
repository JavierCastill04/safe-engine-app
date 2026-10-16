import React from 'react';
import { Text, View } from 'react-native';
import {
  AlertTriangle,
  BellRing,
  Gauge,
} from 'lucide-react-native';

import { commonStyles, colores } from '@/theme';
import type { NotificacionItem } from '../utils/NotificacionesUtils';

interface Props {
  notificacion: NotificacionItem;
}

export default function NotificacionesCard({ notificacion }: Props) {
  const vencido = notificacion.tipo === 'vencido';

  const formatearNumero = (num?: number) => {
    if (typeof num !== 'number' || isNaN(num)) return '0.0';
    return num.toFixed(1).replace(',', '.');
  };

  return (
    <View
      style={[
        commonStyles.surface,
        commonStyles.notificacionesTarjeta,
        {
          borderLeftWidth: 4,
          borderLeftColor: vencido ? colores.rojo : colores.primario,
        },
      ]}
    >
      <View style={commonStyles.notificacionesEncabezado}>
        <View style={commonStyles.notificacionesIconoEncabezado}>
          {vencido ? (
            <AlertTriangle color={colores.rojo} size={22} />
          ) : (
            <BellRing color={colores.primario} size={22} />
          )}
        </View>

        <View style={commonStyles.notificacionesEncabezadoTexto}>
          <Text
            style={[
              commonStyles.heading,
              commonStyles.notificacionesTarjetaTitulo,
            ]}
          >
            {notificacion.titulo}
          </Text>

          <Text style={commonStyles.secondaryText}>
            {notificacion.vehiculoNombre}
          </Text>
        </View>
      </View>

      <Text style={commonStyles.text}>
        {notificacion.mensaje}
      </Text>

      {typeof notificacion.kilometrajeLímite === 'number' && (
        <View style={[commonStyles.notificacionesDetalleFila, { marginTop: 8 }]}>
          <Gauge color={colores.gris} size={16} />
          <Text style={commonStyles.secondaryText}>
            Kilometraje límite:{' '}
            {formatearNumero(notificacion.kilometrajeLímite)} km
          </Text>
        </View>
      )}
    </View>
  );
}