import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Car, Plus, ChevronRight, Gauge } from 'lucide-react-native';

import { useAppSelector } from '@/redux/hooks';
import { VehiculoFormModal } from '../components/VehiculosFormModal';
import { commonStyles, colores, espaciado } from '@/theme';
import type { Vehiculo } from '@/types';

export const VehiculosScreen = ({ navigation }: any) => {
  const [modalVisible, setModalVisible] = useState(false);

  const vehiculos = useAppSelector((state) => state.vehiculos.vehiculos);

  const formatearNumero = (num: number) => {
    return num.toFixed(1).replace(',', '.');
  };

  const irADetalleVehiculo = (vehiculoId: string) => {
    // Intenta navegar desde el RootNavigator (si están en stacks separados) o directamente
    const parentNav = navigation.getParent();
    if (parentNav) {
      parentNav.navigate('VehiculoDetalleScreen', { vehiculoId });
    } else {
      navigation.navigate('VehiculoDetalleScreen', { vehiculoId });
    }
  };

  return (
    <View style={commonStyles.containerScreen}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: espaciado.md,
        }}
      >
        <Text style={commonStyles.title}>Tus Vehículos</Text>

        <TouchableOpacity
          style={{
            backgroundColor: colores.primario,
            paddingVertical: 8,
            paddingHorizontal: 14,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
          }}
          onPress={() => setModalVisible(true)}
        >
          <Plus size={18} color={colores.blanco} />
          <Text style={{ color: colores.blanco, fontWeight: 'bold', fontSize: 13 }}>
            Agregar
          </Text>
        </TouchableOpacity>
      </View>

      {vehiculos.length === 0 ? (
        <View
          style={[
            commonStyles.surface,
            commonStyles.notificacionesEstadoVacio,
            { paddingVertical: espaciado.xxl },
          ]}
        >
          <Car size={56} color={colores.gris} />
          <Text
            style={[
              commonStyles.title,
              commonStyles.notificacionesEstadoVacioTitulo,
              { fontSize: 20 },
            ]}
          >
            No tienes vehículos registrados
          </Text>
          <Text
            style={[
              commonStyles.secondaryText,
              commonStyles.notificacionesEstadoVacioDescripcion,
            ]}
          >
            Presiona el botón "Agregar" en la esquina superior derecha para ingresar tu primer vehículo y gestionar sus mantenimientos.
          </Text>
        </View>
      ) : (
        <FlatList
          data={vehiculos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: espaciado.md, paddingBottom: espaciado.xl }}
          renderItem={({ item }: { item: Vehiculo }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                commonStyles.surface,
                {
                  padding: espaciado.md,
                  borderRadius: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderLeftWidth: 4,
                  borderLeftColor: colores.primario,
                },
              ]}
              onPress={() => irADetalleVehiculo(item.id)}
            >
              <View style={{ gap: 4, flex: 1 }}>
                <Text style={[commonStyles.heading, { fontSize: 17 }]}>
                  {item.marca} {item.modelo} ({item.anio})
                </Text>
                <Text style={commonStyles.secondaryText}>Placa: {item.placa}</Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <Gauge size={15} color={colores.azulClaro} />
                  <Text style={{ color: colores.blanco, fontWeight: '600', fontSize: 14 }}>
                    {formatearNumero(item.kilometrajeActual)} km
                  </Text>
                </View>
              </View>

              <ChevronRight size={22} color={colores.gris} />
            </TouchableOpacity>
          )}
        />
      )}

      <VehiculoFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default VehiculosScreen;