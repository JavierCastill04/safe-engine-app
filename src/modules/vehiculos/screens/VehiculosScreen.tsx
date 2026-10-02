import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { commonStyles } from '@/theme';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { seleccionarVehiculo } from '@/redux/slices/vehiculoSlice';
import type { Vehiculo } from '@/types';
import { VehiculosCard } from '../components/VehiculosCard';
import { MantenimientoFormModal } from '../../mantenimientos/components/MantenimientoFormModal';

export default function VehiculosScreen() {
  const dispatch = useAppDispatch();
  const { vehiculos, vehiculoSeleccionadoId } = useAppSelector((state) => state.vehiculos);

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [vehiculoParaMantenimiento, setVehiculoParaMantenimiento] = useState<Vehiculo | null>(null);

  const handleSeleccionar = (id: string) => {
    dispatch(seleccionarVehiculo(id));
  };

  const handleAbrirMantenimiento = (vehiculo: Vehiculo) => {
    setVehiculoParaMantenimiento(vehiculo);
    setModalVisible(true);
  };

  return (
    <View style={commonStyles.containerScreen}>
      <Text style={commonStyles.title}>Vehículos Registrados</Text>

      <FlatList
        data={vehiculos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <VehiculosCard
            vehiculo={item}
            esSeleccionado={item.id === vehiculoSeleccionadoId}
            onSelect={handleSeleccionar}
            onRegistrarMantenimiento={handleAbrirMantenimiento}
          />
        )}
        contentContainerStyle={styles.listContent}
      />

      {vehiculoParaMantenimiento && (
        <MantenimientoFormModal
          visible={modalVisible}
          vehiculoId={vehiculoParaMantenimiento.id}
          kilometrajeActualVehiculo={vehiculoParaMantenimiento.kilometrajeActual}
          onClose={() => {
            setModalVisible(false);
            setVehiculoParaMantenimiento(null);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 20,
  },
});