import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Gauge, Navigation, Plus } from 'lucide-react-native';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { actualizarKilometraje, seleccionarVehiculo } from '@/redux/slices/vehiculoSlice';
import { commonStyles, colores, espaciado } from '@/theme';
import { ViajeTrackerModal } from '../components/viajeTrackerModal';

export const OdometroScreen = () => {
  const dispatch = useAppDispatch();
  const [modalViajeVisible, setModalViajeVisible] = useState(false);

  const vehiculos = useAppSelector((state) => state.vehiculos.vehiculos);
  const vehiculoSeleccionadoId = useAppSelector(
    (state) => state.vehiculos.vehiculoSeleccionadoId
  );

  // Solución aplicada: Buscar por el ID seleccionado y, si no se encuentra o es nulo, tomar el primer vehículo del arreglo
  const vehiculoActivo = vehiculos.find((v) => v.id === vehiculoSeleccionadoId) || vehiculos[0];

  const formatearNumero = (num?: number) => {
    if (typeof num !== 'number' || isNaN(num)) return '0.0';
    return num.toFixed(1).replace(',', '.');
  };

  const handleEditarOdometroManual = () => {
    if (!vehiculoActivo) return;

    Alert.prompt(
      'Actualizar Odómetro',
      `Ingresa la lectura actual del odómetro para ${vehiculoActivo.marca} ${vehiculoActivo.modelo}:`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Guardar',
          onPress: (valor?: string) => {
            const nuevoKm = parseFloat(valor?.replace(',', '.') || '');
            if (isNaN(nuevoKm) || nuevoKm < 0) {
              Alert.alert('Error', 'Ingresa una lectura válida.');
              return;
            }

            if (nuevoKm < vehiculoActivo.kilometrajeActual) {
              Alert.alert(
                'Advertencia',
                'El nuevo kilometraje es menor al registrado previamente. ¿Deseas continuar?',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  {
                    text: 'Confirmar',
                    onPress: () => {
                      dispatch(
                        actualizarKilometraje({
                          id: vehiculoActivo.id,
                          nuevoKilometraje: nuevoKm,
                        })
                      );
                    },
                  },
                ]
              );
            } else {
              dispatch(
                actualizarKilometraje({
                  id: vehiculoActivo.id,
                  nuevoKilometraje: nuevoKm,
                })
              );
              Alert.alert('Éxito', 'Odómetro actualizado correctamente.');
            }
          },
        },
      ],
      'plain-text',
      String(vehiculoActivo.kilometrajeActual)
    );
  };

  if (!vehiculoActivo) {
    return (
      <View style={commonStyles.containerScreen}>
        <View style={[commonStyles.surface, commonStyles.notificacionesEstadoVacio]}>
          <Gauge size={56} color={colores.gris} />
          <Text style={[commonStyles.title, commonStyles.notificacionesEstadoVacioTitulo]}>
            Sin vehículos registrados
          </Text>
          <Text
            style={[
              commonStyles.secondaryText,
              commonStyles.notificacionesEstadoVacioDescripcion,
            ]}
          >
            Registra un vehículo en la sección de Vehículos para comenzar el seguimiento de viajes y odómetro.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={commonStyles.containerScreen}>
      <Text style={commonStyles.title}>Odómetro y Tracker GPS</Text>

      {/* Selector de Vehículo si hay más de uno */}
      {vehiculos.length > 1 && (
        <View style={{ marginBottom: espaciado.md }}>
          <Text style={commonStyles.label}>Seleccionar Vehículo:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 6 }}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {vehiculos.map((v) => (
                <TouchableOpacity
                  key={v.id}
                  style={{
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    borderRadius: 6,
                    backgroundColor:
                      v.id === vehiculoActivo.id ? colores.primario : colores.superficie,
                    borderWidth: 1,
                    borderColor: colores.borde,
                  }}
                  onPress={() => dispatch(seleccionarVehiculo(v.id))}
                >
                  <Text style={{ color: colores.blanco, fontWeight: '600', fontSize: 13 }}>
                    {v.marca} {v.modelo}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Tarjeta Principal del Odómetro */}
      <View style={[commonStyles.surface, { padding: espaciado.lg, borderRadius: 12, alignItems: 'center', marginBottom: espaciado.md }]}>
        <Gauge size={48} color={colores.primario} />
        <Text style={[commonStyles.secondaryText, { marginTop: espaciado.xs }]}>Lectura Actual</Text>
        <Text style={[commonStyles.title, { fontSize: 32, marginVertical: espaciado.xs }]}>
          {formatearNumero(vehiculoActivo.kilometrajeActual)} <Text style={{ fontSize: 18 }}>km</Text>
        </Text>

        <View style={{ flexDirection: 'row', gap: espaciado.sm, marginTop: espaciado.sm }}>
          <TouchableOpacity
            style={[commonStyles.button, { paddingHorizontal: 16, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 6 }]}
            onPress={() => setModalViajeVisible(true)}
          >
            <Navigation size={18} color={colores.blanco} />
            <Text style={commonStyles.buttonText}>Iniciar Viaje GPS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              commonStyles.surface,
              {
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colores.primario,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
              },
            ]}
            onPress={handleEditarOdometroManual}
          >
            <Plus size={18} color={colores.primario} />
            <Text style={{ color: colores.primario, fontWeight: 'bold' }}>Ajustar Manual</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ViajeTrackerModal
        visible={modalViajeVisible}
        vehiculoId={vehiculoActivo.id}
        kilometrajeActual={vehiculoActivo.kilometrajeActual}
        onClose={() => setModalViajeVisible(false)}
      />
    </ScrollView>
  );
};

export default OdometroScreen;