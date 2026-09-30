import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { commonStyles, colores } from '../../../theme';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { Vehiculo } from '@/types/Vehiculo';
import { seleccionarVehiculo } from '@/redux/slices/vehiculoSlice';
import { VehiculosCard } from '../components/VehiculosCard';

export default function VehiculosScreen() {
  const dispatch = useAppDispatch();
  const { vehiculos, vehiculoSeleccionadoId } = useAppSelector((state) => state.vehiculos);

  const handleSeleccionar = (id: string) => {
    dispatch(seleccionarVehiculo(id));
  };

  const handleRegistrarMantenimiento = (vehiculo: Vehiculo) => {
    // Próximo paso: Abrir modal o navegar a la pantalla de Mantenimientos pasándole el ID
    console.log('Ir a registrar mantenimiento para:', vehiculo.placa);
  };

  return (
    <View style={commonStyles.containerScreen}>
      <Text style={styles.tituloHeader}>Vehículos Registrados</Text>

      <FlatList
        data={vehiculos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <VehiculosCard
            vehiculo={item}
            esSeleccionado={item.id === vehiculoSeleccionadoId}
            onSelect={handleSeleccionar}
            onRegistrarMantenimiento={handleRegistrarMantenimiento}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tituloHeader: {
    color: colores.texto,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 8,
  },
  listContent: {
    paddingBottom: 20,
  },
});