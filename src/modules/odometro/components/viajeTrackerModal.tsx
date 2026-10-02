// src/modules/viajes/components/ViajeTrackerModal.tsx

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as Location from 'expo-location';
import { useAppDispatch } from '@/redux/hooks';
import { actualizarKilometraje } from '@/redux/slices/vehiculoSlice';
import { commonStyles, colores, espaciado } from '@/theme';
import { calcularDistanciaKm } from '@/modules/odometro/utils/geoUtils';

interface Props {
  visible: boolean;
  vehiculoId: string;
  kilometrajeActual: number;
  onClose: () => void;
}

export const ViajeTrackerModal: React.FC<Props> = ({
  visible,
  vehiculoId,
  kilometrajeActual,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const [enViaje, setEnViaje] = useState(false);
  const [distanciaRecorrida, setDistanciaRecorrida] = useState(0);

  const ultimaUbicacion = useRef<Location.LocationObject | null>(null);
  const subscription = useRef<Location.LocationSubscription | null>(null);

  // Iniciar Rastreos GPS
  const iniciarViaje = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se requiere acceso a la ubicación para registrar el viaje.');
      return;
    }

    setDistanciaRecorrida(0);
    setEnViaje(true);
    ultimaUbicacion.current = null;

    // Escuchar ubicación en tiempo real
    subscription.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 10, // Actualiza cada 10 metros
      },
      (location) => {
        if (ultimaUbicacion.current) {
          const delta = calcularDistanciaKm(
            ultimaUbicacion.current.coords.latitude,
            ultimaUbicacion.current.coords.longitude,
            location.coords.latitude,
            location.coords.longitude
          );
          setDistanciaRecorrida((prev) => prev + delta);
        }
        ultimaUbicacion.current = location;
      }
    );
  };

  // Finalizar Viaje y Actualizar Kilometraje del Vehículo
  const finalizarViaje = () => {
    if (subscription.current) {
      subscription.current.remove();
      subscription.current = null;
    }

    const kmGanados = Math.round(distanciaRecorrida);
    const nuevoKilometraje = kilometrajeActual + kmGanados;

    // Actualizar el kilometraje global del vehículo en Redux
    dispatch(actualizarKilometraje({ id: vehiculoId, nuevoKilometraje }));

    Alert.alert(
      'Viaje Finalizado',
      `Recorriste ${distanciaRecorrida.toFixed(2)} km. El nuevo kilometraje es ${nuevoKilometraje.toLocaleString()} km.`
    );

    setEnViaje(false);
    onClose();
  };

  useEffect(() => {
    return () => {
      if (subscription.current) {
        subscription.current.remove();
      }
    };
  }, []);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[commonStyles.surface, styles.modalContainer]}>
          <Text style={commonStyles.title}>Registro de Viaje (GPS)</Text>

          <View style={styles.metricsContainer}>
            <Text style={{ color: colores.textoSecundario }}>Distancia Recorrida:</Text>
            <Text style={styles.distanciaText}>{distanciaRecorrida.toFixed(2)} km</Text>
          </View>

          {!enViaje ? (
            <TouchableOpacity style={styles.btnIniciar} onPress={iniciarViaje}>
              <Text style={styles.btnTexto}>Iniciar Viaje</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.btnFinalizar} onPress={finalizarViaje}>
              <Text style={styles.btnTexto}>Finalizar y Guardar Viaje</Text>
            </TouchableOpacity>
          )}

          {!enViaje && (
            <TouchableOpacity style={styles.btnCancelar} onPress={onClose}>
              <Text style={{ color: colores.textoSecundario }}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: espaciado.md,
  },
  modalContainer: {
    padding: espaciado.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  metricsContainer: {
    marginVertical: espaciado.lg,
    alignItems: 'center',
  },
  distanciaText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colores.primario,
  },
  btnIniciar: {
    backgroundColor: '#2ecc71',
    paddingVertical: espaciado.md,
    paddingHorizontal: espaciado.xl,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  btnFinalizar: {
    backgroundColor: '#e74c3c',
    paddingVertical: espaciado.md,
    paddingHorizontal: espaciado.xl,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  btnTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  btnCancelar: {
    marginTop: espaciado.md,
  },
});