import React, { useState } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { BellOff } from 'lucide-react-native';

import { useAppSelector } from '@/redux/hooks';
import { commonStyles, colores, espaciado } from '@/theme';
import NotificacionesCard from '../components/NotificacionesCard';
import { evaluarNotificacionesMantenimiento } from '../utils/NotificacionesUtils';

export const NotificacionesScreen = () => {
  const [refrescando, setRefrescando] = useState(false);

  const vehiculos = useAppSelector((state) => state.vehiculos.vehiculos);
  const mantenimientos = useAppSelector((state) => state.mantenimientos.mantenimientos);

  const listaNotificaciones = evaluarNotificacionesMantenimiento(vehiculos, mantenimientos);

  const alRefrescar = () => {
    setRefrescando(true);
    setTimeout(() => {
      setRefrescando(false);
    }, 600);
  };

  return (
    <View style={commonStyles.containerScreen}>
      <Text style={commonStyles.title}>Notificaciones de Mantenimiento</Text>

      {listaNotificaciones.length === 0 ? (
        <View style={[commonStyles.surface, commonStyles.notificacionesEstadoVacio]}>
          <BellOff size={56} color={colores.gris} />
          <Text style={[commonStyles.title, commonStyles.notificacionesEstadoVacioTitulo]}>
            Sin alertas pendientes
          </Text>
          <Text style={[commonStyles.secondaryText, commonStyles.notificacionesEstadoVacioDescripcion]}>
            Todos los mantenimientos de tus vehículos se encuentran al día y dentro de los rangos de kilometraje programados.
          </Text>
        </View>
      ) : (
        <FlatList
          data={listaNotificaciones}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: espaciado.md, paddingBottom: espaciado.xl }}
          refreshControl={
            <RefreshControl
              refreshing={refrescando}
              onRefresh={alRefrescar}
              tintColor={colores.primario}
              colors={[colores.primario]}
            />
          }
          renderItem={({ item }) => <NotificacionesCard notificacion={item} />}
        />
      )}
    </View>
  );
};

export default NotificacionesScreen;