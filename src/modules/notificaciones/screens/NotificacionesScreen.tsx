import React, { useMemo } from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { useAppSelector } from '@/redux/hooks';
import {useStyles,useTheme,type ThemeContextType,} from '@/hook/hooks';
import { conAlpha } from '@/theme/theme';
import NotificacionesCard from '../components/NotificacionesCard';
import { obtenerNotificaciones } from '../utils/NotificacionesUtils';

export default function NotificacionesScreen() {
  const { estilos, espaciado } = useTheme();
  const styles = useStyles(makeStyles);

  const vehiculos = useAppSelector(
    (state) => state.vehiculos.vehiculos
  );

  const mantenimientos = useAppSelector(
    (state) => state.mantenimientos.mantenimientos
  );

  const notificaciones = useMemo(
    () => obtenerNotificaciones(vehiculos, mantenimientos),
    [vehiculos, mantenimientos]
  );

  return (
    <View
      style={[
        estilos.containerScreen,
        { paddingTop: espaciado.sm },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.titulo}>Notificaciones</Text>

        <Text style={styles.descripcion}>
          Avisos sobre los próximos mantenimientos y servicios
          pendientes de tus vehículos.
        </Text>
      </View>

      <View
        style={[
          estilos.surface,
          styles.resumen,
        ]}
      >
        <Text style={styles.resumenTexto}>
          Avisos pendientes
        </Text>

        <View style={styles.contador}>
          <Text style={styles.contadorTexto}>
            {notificaciones.length}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.lista}
      >
        {notificaciones.length === 0 ? (
          <View
            style={[
              estilos.surface,
              styles.estadoVacio,
            ]}
          >
            <Text style={styles.estadoVacioTitulo}>
              Todo está al día
            </Text>

            <Text style={styles.estadoVacioDescripcion}>
              No se encontraron mantenimientos próximos o vencidos
              entre los servicios registrados.
            </Text>
          </View>
        ) : (
          notificaciones.map((notificacion) => (
            <NotificacionesCard
              key={notificacion.id}
              notificacion={notificacion}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const makeStyles = (t: ThemeContextType) =>
  StyleSheet.create({
    header: {
      marginBottom: t.espaciado.md,
    },

    titulo: {
      fontSize: 22,
      fontWeight: 'bold',
      color: t.colores.texto,
      marginBottom: t.espaciado.sm,
    },

    descripcion: {
      color: t.colores.textoSecundario,
      fontSize: 14,
      lineHeight: 21,
    },

    resumen: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: t.espaciado.md,
      marginBottom: t.espaciado.md,
      borderWidth: 1,
      borderColor: conAlpha(t.colores.borde, 30),
      borderRadius: 12,
    },

    resumenTexto: {
      flex: 1,
      color: t.colores.texto,
      fontSize: 15,
      fontWeight: '600',
    },

    contador: {
      minWidth: 36,
      height: 36,
      paddingHorizontal: t.espaciado.sm,
      borderRadius: 18,
      backgroundColor: t.colores.primario,
      alignItems: 'center',
      justifyContent: 'center',
    },

    contadorTexto: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: 'bold',
    },

    lista: {
      gap: t.espaciado.md,
      paddingBottom: t.espaciado.xl,
    },

    estadoVacio: {
      alignItems: 'center',
      padding: t.espaciado.lg,
      borderWidth: 1,
      borderColor: conAlpha(t.colores.borde, 30),
      borderRadius: 12,
    },

    estadoVacioTitulo: {
      color: t.colores.texto,
      fontSize: 17,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: t.espaciado.sm,
    },

    estadoVacioDescripcion: {
      color: t.colores.textoSecundario,
      fontSize: 14,
      textAlign: 'center',
      lineHeight: 21,
    },
  });