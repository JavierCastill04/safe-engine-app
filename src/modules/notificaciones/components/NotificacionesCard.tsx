import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { AlertTriangle, BellRing, CalendarDays, Gauge } from 'lucide-react-native';

import { commonStyles, colores, espaciado } from '@/theme';
import type { NotificacionMantenimiento } from '../utils/NotificacionesUtils';

interface Props {
  notificacion: NotificacionMantenimiento;
}

export default function NotificacionesCard({ notificacion }: Props) {
  const vencido = notificacion.estado === 'vencido';

  return (
    <View style={[commonStyles.card, styles.tarjeta]}>
      <View style={styles.encabezado}>
        <View style={styles.iconoEncabezado}>
          {vencido ? (
            <AlertTriangle color={colores.rojo} size={22} />
          ) : (
            <BellRing color={colores.azulClaro} size={22} />
          )}
        </View>
        <View style={styles.encabezadoTexto}>
          <Text style={[commonStyles.cardTitle, styles.titulo]}>
            {notificacion.titulo}
          </Text>
          <Text style={[commonStyles.secondaryText, styles.vehiculo]}>
            {notificacion.vehiculoNombre}
          </Text>
        </View>
      </View>

      <Text style={[commonStyles.text, styles.mensaje]}>
        {notificacion.mensaje}
      </Text>

      <View style={styles.detalles}>
        <View style={styles.detalleFila}>
          <CalendarDays color={colores.gris} size={17} />
          <Text style={[commonStyles.secondaryText, styles.detalleTexto]}>
            Fecha estimada: {notificacion.fecha}
          </Text>
        </View>

        <View style={styles.detalleFila}>
          <Gauge color={colores.gris} size={17} />
          <Text style={[commonStyles.secondaryText, styles.detalleTexto]}>
            Kilometraje recomendado: {notificacion.kilometraje.toLocaleString()} km
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    padding: espaciado.md,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: espaciado.sm,
  },
  iconoEncabezado: {
    paddingTop: 2,
  },
  encabezadoTexto: {
    flex: 1,
  },
  titulo: {
    lineHeight: 23,
    marginBottom: 4,
  },
  vehiculo: {
    lineHeight: 20,
  },
  mensaje: {
    lineHeight: 22,
    marginTop: espaciado.md,
    marginBottom: espaciado.md,
  },
  detalles: {
    gap: espaciado.sm,
  },
  detalleFila: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: espaciado.sm,
  },
  detalleTexto: {
    flex: 1,
    lineHeight: 20,
  },
});
