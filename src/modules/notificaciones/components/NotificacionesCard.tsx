import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import {
  useStyles,
  useTheme,
  type ThemeContextType,
} from '@/hook/hooks';
import { conAlpha } from '@/theme/theme';

import type { NotificacionMantenimiento } from '../utils/NotificacionesUtils';

interface Props {
  notificacion: NotificacionMantenimiento;
}

export default function NotificacionesCard({ notificacion }: Props) {
  const { estilos } = useTheme();
  const styles = useStyles(makeStyles);

  const vencido = notificacion.estado === 'vencido';

  return (
    <View
      style={[
        estilos.surface,
        styles.tarjeta,
        vencido && styles.tarjetaVencida,
      ]}
    >
      <View style={styles.encabezado}>
        <View style={styles.encabezadoTexto}>
          <Text style={styles.titulo}>
            {notificacion.titulo}
          </Text>

          <Text style={styles.vehiculo}>
            {notificacion.vehiculoNombre}
          </Text>
        </View>

        <View
          style={[
            styles.estadoBadge,
            vencido ? styles.badgeVencido : styles.badgePendiente,
          ]}
        >
          <Text
            style={[
              styles.estadoTexto,
              vencido
                ? styles.textoVencido
                : styles.textoPendiente,
            ]}
          >
            {vencido ? 'Vencido' : 'Próximo'}
          </Text>
        </View>
      </View>

      <Text style={styles.mensaje}>
        {notificacion.mensaje}
      </Text>

      <View style={styles.detalles}>
        <View style={styles.detalleFila}>
          <Text style={styles.detalleEtiqueta}>
            Fecha estimada
          </Text>

          <Text style={styles.detalleValor}>
            {notificacion.fecha}
          </Text>
        </View>

        <View style={styles.separador} />

        <View style={styles.detalleFila}>
          <Text style={styles.detalleEtiqueta}>
            Kilometraje recomendado
          </Text>

          <Text style={styles.detalleValor}>
            {notificacion.kilometraje.toLocaleString()} km
          </Text>
        </View>
      </View>
    </View>
  );
}

const makeStyles = (t: ThemeContextType) =>
  StyleSheet.create({
    tarjeta: {
      padding: t.espaciado.md,
      borderWidth: 1,
      borderColor: conAlpha(t.colores.borde, 30),
      borderRadius: 12,
    },

    tarjetaVencida: {
      borderLeftWidth: 4,
      borderLeftColor: t.colores.error ?? '#DC2626',
    },

    encabezado: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: t.espaciado.sm,
    },

    encabezadoTexto: {
      flex: 1,
    },

    titulo: {
      color: t.colores.texto,
      fontSize: 16,
      fontWeight: 'bold',
      lineHeight: 23,
      marginBottom: 4,
    },

    vehiculo: {
      color: t.colores.textoSecundario,
      fontSize: 13,
      lineHeight: 20,
    },

    estadoBadge: {
      paddingHorizontal: t.espaciado.sm,
      paddingVertical: 4,
      borderRadius: 6,
    },

    badgeVencido: {
      backgroundColor: conAlpha(
        t.colores.error ?? '#DC2626',
        15
      ),
    },

    badgePendiente: {
      backgroundColor: conAlpha(t.colores.primario, 15),
    },

    estadoTexto: {
      fontSize: 11,
      fontWeight: 'bold',
    },

    textoVencido: {
      color: t.colores.error ?? '#DC2626',
    },

    textoPendiente: {
      color: t.colores.primario,
    },

    mensaje: {
      color: t.colores.textoSecundario,
      fontSize: 14,
      lineHeight: 22,
      marginTop: t.espaciado.md,
      marginBottom: t.espaciado.md,
    },

    detalles: {
      padding: t.espaciado.sm,
      borderRadius: 8,
      backgroundColor: conAlpha(t.colores.texto, 4),
      gap: t.espaciado.sm,
    },

    detalleFila: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: t.espaciado.sm,
    },

    detalleEtiqueta: {
      flex: 1,
      color: t.colores.textoSecundario,
      fontSize: 12,
      lineHeight: 20,
    },

    detalleValor: {
      flex: 1,
      color: t.colores.texto,
      fontSize: 12,
      fontWeight: '600',
      lineHeight: 20,
      textAlign: 'right',
    },

    separador: {
      height: 1,
      backgroundColor: conAlpha(t.colores.borde, 30),
    },
  });