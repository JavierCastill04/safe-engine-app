import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Wrench, Calendar, Gauge, DollarSign } from 'lucide-react-native';

import { useAppSelector } from '@/redux/hooks';
import { commonStyles, colores } from '@/theme';
import type { Mantenimiento } from '@/types';

export const HistorialMantenimientosScreen = ({ route }: any) => {
  const vehiculoId = route?.params?.vehiculoId;
  const vehiculoNombre = route?.params?.vehiculoNombre || 'Vehículo';

  const mantenimientos = useAppSelector((state) =>
    state.mantenimientos.mantenimientos.filter((m) =>
      vehiculoId ? m.vehiculoId === vehiculoId : true
    )
  );

  const formatearNumero = (num: number) => {
    return num.toFixed(1).replace(',', '.');
  };

  return (
    <View style={commonStyles.containerScreen}>
      <Text style={commonStyles.title}>Historial: {vehiculoNombre}</Text>

      {mantenimientos.length === 0 ? (
        <View style={[commonStyles.surface, commonStyles.notificacionesEstadoVacio]}>
          <Wrench size={48} color={colores.gris} />
          <Text style={[commonStyles.title, commonStyles.notificacionesEstadoVacioTitulo]}>
            Sin mantenimientos
          </Text>
          <Text style={[commonStyles.secondaryText, commonStyles.notificacionesEstadoVacioDescripcion]}>
            No hay mantenimientos registrados para este vehículo.
          </Text>
        </View>
      ) : (
        <FlatList
          data={mantenimientos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
          renderItem={({ item }: { item: Mantenimiento }) => {
            const kmMostrar = item.kilometraje || item.kilometrajeRealiz || item.kilometrajeActual || 0;
            return (
              <View style={[commonStyles.surface, { padding: 16 }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={[commonStyles.heading, { textTransform: 'capitalize' }]}>
                    {item.tipo}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Calendar size={14} color={colores.gris} />
                    <Text style={commonStyles.secondaryText}>{item.fecha}</Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', gap: 16, marginBottom: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Gauge size={16} color={colores.primario} />
                    <Text style={commonStyles.text}>{formatearNumero(kmMostrar)} km</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <DollarSign size={16} color={colores.primario} />
                    <Text style={commonStyles.text}>${formatearNumero(item.costo)}</Text>
                  </View>
                </View>

                {item.siguienteMantenimientoKm ? (
                  <Text style={[commonStyles.secondaryText, { fontSize: 13, color: colores.azulClaro }]}>
                    Siguiente cambio a los: {formatearNumero(item.siguienteMantenimientoKm)} km
                  </Text>
                ) : null}

                {item.siguienteMantenimientoFecha ? (
                  <Text style={[commonStyles.secondaryText, { fontSize: 13, color: colores.azulClaro }]}>
                    Siguiente revisión por fecha: {item.siguienteMantenimientoFecha}
                  </Text>
                ) : null}

                {(item.notas || item.descripcion) && (
                  <Text style={[commonStyles.secondaryText, { fontStyle: 'italic', marginTop: 6 }]}>
                    "{item.notas || item.descripcion}"
                  </Text>
                )}
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

export default HistorialMantenimientosScreen;