import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Alert } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { actualizarKilometraje } from '@/redux/slices/vehiculoSlice';
import { ProximosMantenimientosCard } from '@/modules/mantenimientos/components/ProximosMantenimientosCard';
import { MantenimientoFormModal } from '@/modules/mantenimientos/components/MantenimientoFormModal';
import { ViajeTrackerModal } from '@/modules/odometro/components/viajeTrackerModal';
import { commonStyles, colores, espaciado } from '@/theme';
import { Edit3, Navigation, PlusCircle } from 'lucide-react-native';

interface Props {
  route: {
    params: {
      vehiculoId: string;
    };
  };
}

export const VehiculoDetalleScreen: React.FC<Props> = ({ route }) => {
  const dispatch = useAppDispatch();
  const { vehiculoId } = route.params;

  const [mantenimientoModalVisible, setMantenimientoModalVisible] = useState(false);
  const [viajeModalVisible, setViajeModalVisible] = useState(false);

  const vehiculo = useAppSelector((state) =>
    state.vehiculos.vehiculos.find((v) => v.id === vehiculoId)
  );

  const mantenimientos = useAppSelector((state) =>
    state.mantenimientos.mantenimientos.filter((m) => m.vehiculoId === vehiculoId)
  );

  const formatearDecimales = (num: number) => {
    return num.toFixed(1).replace(',', '.');
  };

  const handleEditarKilometraje = () => {
    if (!vehiculo) return;

    Alert.prompt(
      'Editar Kilometraje',
      `Ingresa el nuevo kilometraje actual para el vehículo ${vehiculo.marca} ${vehiculo.modelo}:`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Guardar',
          onPress: (valor?: string) => {
            const nuevoKm = parseFloat(valor || '');
            if (isNaN(nuevoKm) || nuevoKm < 0) {
              Alert.alert('Valor inválido', 'Ingresa un número de kilometraje válido.');
              return;
            }

            Alert.alert(
              'Confirmar actualización',
              `¿Estás seguro de actualizar el kilometraje a ${formatearDecimales(nuevoKm)} km?`,
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Confirmar',
                  onPress: () => {
                    dispatch(
                      actualizarKilometraje({
                        id: vehiculo.id,
                        nuevoKilometraje: nuevoKm,
                      })
                    );
                    Alert.alert('Éxito', 'El kilometraje ha sido actualizado correctamente.');
                  },
                },
              ]
            );
          },
        },
      ],
      'plain-text',
      String(vehiculo.kilometrajeActual)
    );
  };

  if (!vehiculo) {
    return (
      <View style={commonStyles.containerScreen}>
        <Text style={commonStyles.title}>Vehículo no encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={commonStyles.containerScreen}>
      {/* Encabezado e información del vehículo */}
      <View style={{ marginBottom: espaciado.md }}>
        <Text style={commonStyles.title}>
          {vehiculo.marca} {vehiculo.modelo} ({vehiculo.anio})
        </Text>
        <Text style={commonStyles.secondaryText}>Placa: {vehiculo.placa}</Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: espaciado.xs,
            gap: espaciado.sm,
          }}
        >
          <Text style={{ color: colores.texto, fontSize: 16, fontWeight: '600' }}>
            Kilometraje actual: {formatearDecimales(vehiculo.kilometrajeActual)} km
          </Text>
          <TouchableOpacity onPress={handleEditarKilometraje} hitSlop={8}>
            <Edit3 size={18} color={colores.primario} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Proximidad de mantenimientos */}
      <ProximosMantenimientosCard
        mantenimientos={mantenimientos}
        kilometrajeActual={vehiculo.kilometrajeActual}
      />

      {/* Botones de acción principal */}
      <View style={{ marginVertical: espaciado.md, gap: espaciado.sm }}>
        <TouchableOpacity
          style={[
            commonStyles.surface,
            {
              padding: espaciado.md,
              borderRadius: 8,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: espaciado.sm,
            },
          ]}
          onPress={() => setViajeModalVisible(true)}
        >
          <Navigation size={18} color={colores.primario} />
          <Text style={{ color: colores.primario, fontWeight: 'bold' }}>
            Registrar Viaje (GPS)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            commonStyles.surface,
            {
              padding: espaciado.md,
              borderRadius: 8,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: espaciado.sm,
            },
          ]}
          onPress={() => setMantenimientoModalVisible(true)}
        >
          <PlusCircle size={18} color={colores.primario} />
          <Text style={{ color: colores.primario, fontWeight: 'bold' }}>
            Registrar Mantenimiento
          </Text>
        </TouchableOpacity>
      </View>

      {/* Historial de Mantenimientos */}
      <View style={{ marginTop: espaciado.sm, marginBottom: espaciado.xl }}>
        <Text style={[commonStyles.title, { fontSize: 18, marginBottom: 10 }]}>
          Historial de Mantenimientos
        </Text>
        {mantenimientos.length === 0 ? (
          <Text style={{ color: colores.textoSecundario }}>
            No hay mantenimientos registrados aún.
          </Text>
        ) : (
          mantenimientos.map((m) => (
            <View
              key={m.id}
              style={[
                commonStyles.surface,
                { padding: espaciado.md, borderRadius: 8, marginBottom: espaciado.sm },
              ]}
            >
              <Text style={{ color: colores.texto, fontWeight: 'bold' }}>
                {m.tipo.toUpperCase()} - {m.fecha}
              </Text>
              <Text style={{ color: colores.textoSecundario }}>
                {formatearDecimales(m.kilometraje || m.kilometrajeRealiz || 0)} km | \$
                {formatearDecimales(m.costo)}
              </Text>
              {(m.notas || m.descripcion) && (
                <Text
                  style={{
                    color: colores.textoSecundario,
                    fontStyle: 'italic',
                    marginTop: 4,
                  }}
                >
                  "{m.notas || m.descripcion}"
                </Text>
              )}
            </View>
          ))
        )}
      </View>

      <MantenimientoFormModal
        visible={mantenimientoModalVisible}
        vehiculoId={vehiculo.id}
        kilometrajeActualVehiculo={vehiculo.kilometrajeActual}
        onClose={() => setMantenimientoModalVisible(false)}
      />

      <ViajeTrackerModal
        visible={viajeModalVisible}
        vehiculoId={vehiculo.id}
        kilometrajeActual={vehiculo.kilometrajeActual}
        onClose={() => setViajeModalVisible(false)}
      />
    </ScrollView>
  );
};

export default VehiculoDetalleScreen;