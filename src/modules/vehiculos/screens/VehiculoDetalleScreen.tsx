import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppSelector } from '@/redux/hooks';
import { ProximosMantenimientosCard } from '@/modules/mantenimientos/components/ProximosMantenimientosCard';
import { MantenimientoFormModal } from '@/modules/mantenimientos/components/MantenimientoFormModal';
import { ViajeTrackerModal } from '@/modules/odometro/components/viajeTrackerModal'; // Asegúrate de importar el modal de GPS
import { commonStyles, colores, espaciado } from '@/theme';

interface Props {
  route: {
    params: {
      vehiculoId: string;
    };
  };
}

export const VehiculoDetalleScreen: React.FC<Props> = ({ route }) => {
  const { vehiculoId } = route.params;

  // Estados para controlar los modales
  const [mantenimientoModalVisible, setMantenimientoModalVisible] = useState(false);
  const [viajeModalVisible, setViajeModalVisible] = useState(false);

  // 1. Obtener la información del vehículo y los mantenimientos desde Redux
  const vehiculo = useAppSelector((state) =>
    state.vehiculos.vehiculos.find((v) => v.id === vehiculoId)
  );

  const mantenimientos = useAppSelector((state) =>
    state.mantenimientos.mantenimientos.filter((m) => m.vehiculoId === vehiculoId)
  );

  if (!vehiculo) {
    return (
      <View style={commonStyles.containerScreen}>
        <Text style={commonStyles.title}>Vehículo no encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={commonStyles.containerScreen}>
      {/* Información del vehículo */}
      <View style={styles.header}>
        <Text style={commonStyles.title}>
          {vehiculo.marca} {vehiculo.modelo}
        </Text>
        <Text style={{ color: colores.textoSecundario }}>
          Kilometraje actual: {vehiculo.kilometrajeActual.toLocaleString()} km
        </Text>
      </View>

      {/* Tarjeta de seguimiento y proximidad de mantenimientos */}
      <ProximosMantenimientosCard
        mantenimientos={mantenimientos}
        kilometrajeActual={vehiculo.kilometrajeActual}
      />

      {/* Botones de Acción */}
      <View style={styles.accionesContainer}>
        {/* Botón para Iniciar Viaje GPS */}
        <TouchableOpacity
          style={[commonStyles.surface, styles.btnAccion, styles.btnViaje]}
          onPress={() => setViajeModalVisible(true)}
        >
          <Text style={{ color: colores.primario, fontWeight: 'bold' }}>
            📍 Registrar Viaje (GPS)
          </Text>
        </TouchableOpacity>

        {/* Botón para Registrar Nuevo Mantenimiento */}
        <TouchableOpacity
          style={[commonStyles.surface, styles.btnAccion]}
          onPress={() => setMantenimientoModalVisible(true)}
        >
          <Text style={{ color: colores.primario, fontWeight: 'bold' }}>
            + Registrar Mantenimiento
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista Historial de Mantenimientos */}
      <View style={styles.historialContainer}>
        <Text style={[commonStyles.title, { fontSize: 18, marginBottom: 10 }]}>
          Historial de Mantenimientos
        </Text>
        {mantenimientos.length === 0 ? (
          <Text style={{ color: colores.textoSecundario }}>
            No hay mantenimientos registrados aún.
          </Text>
        ) : (
          mantenimientos.map((m) => (
            <View key={m.id} style={[commonStyles.surface, styles.itemHistorial]}>
              <Text style={{ color: colores.texto, fontWeight: 'bold' }}>
                {m.tipo.toUpperCase()} - {m.fecha}
              </Text>
              <Text style={{ color: colores.textoSecundario }}>
                {m.kilometraje.toLocaleString()} km | ${m.costo.toFixed(2)}
              </Text>
              {m.notas && (
                <Text style={{ color: colores.textoSecundario, fontStyle: 'italic', marginTop: 4 }}>
                  "{m.notas}"
                </Text>
              )}
            </View>
          ))
        )}
      </View>

      {/* Modal para registrar nuevos mantenimientos */}
      <MantenimientoFormModal
        visible={mantenimientoModalVisible}
        vehiculoId={vehiculo.id}
        kilometrajeActualVehiculo={vehiculo.kilometrajeActual}
        onClose={() => setMantenimientoModalVisible(false)}
      />

      {/* Modal para registrar viajes por GPS */}
      <ViajeTrackerModal
        visible={viajeModalVisible}
        vehiculoId={vehiculo.id}
        kilometrajeActual={vehiculo.kilometrajeActual}
        onClose={() => setViajeModalVisible(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: espaciado.md,
  },
  accionesContainer: {
    marginVertical: espaciado.md,
    gap: espaciado.sm,
  },
  btnAccion: {
    padding: espaciado.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnViaje: {
    borderWidth: 1,
    borderColor: colores.primario,
  },
  historialContainer: {
    marginTop: espaciado.sm,
    marginBottom: espaciado.xl,
  },
  itemHistorial: {
    padding: espaciado.md,
    borderRadius: 8,
    marginBottom: espaciado.sm,
  },
});