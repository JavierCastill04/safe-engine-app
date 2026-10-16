import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { Bell, AlertTriangle, Clock, CheckCircle } from 'lucide-react-native';

import { useAppSelector } from '@/redux/hooks';
import { commonStyles, colores } from '@/theme';
import { evaluarNotificacionesMantenimiento } from '../utils/NotificacionesUtils';

export const NotificacionesScreen = () => {
  const [refrescando, setRefrescando] = useState(false);

  const vehiculos = useAppSelector((state) => state.vehiculos.vehiculos);
  const mantenimientos = useAppSelector((state) => state.mantenimientos.mantenimientos);

  const notificaciones = evaluarNotificacionesMantenimiento(vehiculos, mantenimientos);

  const alRefrescar = useCallback(() => {
    setRefrescando(true);
    setTimeout(() => {
      setRefrescando(false);
    }, 800);
  }, []);

  return (
    <View style={commonStyles.containerScreen}>
      <FlatList
        data={notificaciones}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          notificaciones.length === 0
            ? { flexGrow: 1, justifyContent: 'center', alignItems: 'center' }
            : commonStyles.notificacionesLista
        }
        refreshControl={
          <RefreshControl
            refreshing={refrescando}
            onRefresh={alRefrescar}
            tintColor={colores.primario}
            colors={[colores.primario]}
            progressViewOffset={10}
          />
        }
        ListEmptyComponent={
          <View style={[commonStyles.surface, commonStyles.notificacionesEstadoVacio]}>
            <CheckCircle size={52} color={colores.primario} />
            <Text style={[commonStyles.title, commonStyles.notificacionesEstadoVacioTitulo]}>
              Todo al día
            </Text>
            <Text
              style={[
                commonStyles.secondaryText,
                commonStyles.notificacionesEstadoVacioDescripcion,
              ]}
            >
              No tienes alertas pendientes de mantenimiento para tus vehículos.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={[
              commonStyles.surface,
              commonStyles.notificacionesTarjeta,
              {
                borderLeftWidth: 4,
                borderLeftColor: item.tipo === 'vencido' ? colores.rojo : colores.primario,
              },
            ]}
          >
            <View style={commonStyles.notificacionesEncabezado}>
              {item.tipo === 'vencido' ? (
                <AlertTriangle size={22} color={colores.rojo} />
              ) : (
                <Clock size={22} color={colores.primario} />
              )}
              <View style={commonStyles.notificacionesEncabezadoTexto}>
                <Text style={[commonStyles.heading, commonStyles.notificacionesTarjetaTitulo]}>
                  {item.titulo}
                </Text>
                <Text style={commonStyles.secondaryText}>{item.vehiculoNombre}</Text>
              </View>
            </View>
            <Text style={commonStyles.text}>{item.mensaje}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default NotificacionesScreen;