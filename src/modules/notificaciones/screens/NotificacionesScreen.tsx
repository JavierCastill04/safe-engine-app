import React, { useMemo } from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { Bell, CheckCircle } from 'lucide-react-native';

import { useAppSelector } from '@/redux/hooks';
import { commonStyles, colores, espaciado } from '@/theme';
import NotificacionesCard from '../components/NotificacionesCard';
import { obtenerNotificaciones } from '../utils/NotificacionesUtils';

export default function NotificacionesScreen() {
  const vehiculos = useAppSelector((state) => state.vehiculos.vehiculos);
  const mantenimientos = useAppSelector((state) => state.mantenimientos.mantenimientos);

  const notificaciones = useMemo(
    () => obtenerNotificaciones(vehiculos, mantenimientos),
    [vehiculos, mantenimientos]
  );

  return (
    <View style={commonStyles.containerScreen}>
      <Text style={[commonStyles.title, styles.titulo]}>Notificaciones</Text>

      <Text style={[commonStyles.secondaryText, styles.descripcion]}>
        Avisos sobre los próximos mantenimientos y servicios pendientes de tus vehículos.
      </Text>

      <View style={[commonStyles.card, styles.resumen]}>
        <Bell color={colores.azulClaro} size={22} />
        <Text style={[commonStyles.text, styles.resumenTexto]}>
          Avisos pendientes: {notificaciones.length}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.lista}
      >
        {notificaciones.length === 0 ? (
          <View style={[commonStyles.card, styles.estadoVacio]}>
            <CheckCircle color={colores.azulClaro} size={30} />
            <Text style={[commonStyles.cardTitle, styles.estadoVacioTitulo]}>
              No hay mantenimientos próximos
            </Text>
            <Text style={[commonStyles.secondaryText, styles.estadoVacioDescripcion]}>
              No se encontraron mantenimientos próximos o vencidos entre los servicios registrados.
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

const styles = StyleSheet.create({
  titulo: {
    marginBottom: espaciado.sm,
  },
  descripcion: {
    lineHeight: 21,
    marginBottom: espaciado.md,
  },
  resumen: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.sm,
    padding: espaciado.md,
    marginBottom: espaciado.md,
  },
  resumenTexto: {
    flex: 1,
    lineHeight: 21,
  },
  lista: {
    gap: espaciado.md,
    paddingBottom: espaciado.xl,
  },
  estadoVacio: {
    alignItems: 'center',
    padding: espaciado.lg,
  },
  estadoVacioTitulo: {
    textAlign: 'center',
    marginTop: espaciado.md,
    marginBottom: espaciado.sm,
    lineHeight: 24,
  },
  estadoVacioDescripcion: {
    textAlign: 'center',
    lineHeight: 21,
  },
});
