import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Alert } from 'react-native';
import { Navigation, Play, Square, Check } from 'lucide-react-native';

import { useAppDispatch } from '@/redux/hooks';
import { actualizarKilometraje } from '@/redux/slices/vehiculoSlice';
import { commonStyles, colores, espaciado } from '@/theme';

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

  const [enRuta, setEnRuta] = useState(false);
  const [distanciaRecorrida, setDistanciaRecorrida] = useState(0);

  const formatearNumero = (num: number) => num.toFixed(1).replace(',', '.');

  const handleIniciarViaje = () => {
    setEnRuta(true);
    setDistanciaRecorrida(0);
  };

  const handleDetenerViaje = () => {
    // Simulación de adición o parada de tracker
    setEnRuta(false);
  };

  const handleGuardarViaje = () => {
    if (distanciaRecorrida <= 0) {
      Alert.alert('Aviso', 'No se ha registrado distancia en este viaje.');
      onClose();
      return;
    }

    const nuevoTotal = (kilometrajeActual || 0) + distanciaRecorrida;

    Alert.alert(
      'Confirmar Viaje',
      `¿Deseas agregar ${formatearNumero(distanciaRecorrida)} km al odómetro actual? Nuevo total: ${formatearNumero(nuevoTotal)} km`,
      [
        { text: 'Descartar', style: 'cancel', onPress: onClose },
        {
          text: 'Guardar',
          onPress: () => {
            dispatch(
              actualizarKilometraje({
                id: vehiculoId,
                nuevoKilometraje: nuevoTotal,
              })
            );
            setDistanciaRecorrida(0);
            onClose();
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={commonStyles.modalOverlay}>
        <View style={commonStyles.modal}>
          <Text style={commonStyles.title}>Seguimiento de Viaje (GPS)</Text>

          <View style={{ alignItems: 'center', marginVertical: espaciado.lg }}>
            <Navigation size={48} color={enRuta ? colores.primario : colores.gris} />
            <Text style={[commonStyles.secondaryText, { marginTop: espaciado.xs }]}>
              {enRuta ? 'Registrando trayecto...' : 'Listo para iniciar'}
            </Text>
            <Text style={[commonStyles.title, { fontSize: 36, marginTop: espaciado.xs }]}>
              {formatearNumero(distanciaRecorrida)} <Text style={{ fontSize: 18 }}>km</Text>
            </Text>
          </View>

          <View style={{ gap: espaciado.sm }}>
            {!enRuta ? (
              <TouchableOpacity
                style={[commonStyles.button, { flexDirection: 'row', justifyContent: 'center', gap: 8 }]}
                onPress={handleIniciarViaje}
              >
                <Play size={18} color={colores.blanco} />
                <Text style={commonStyles.buttonText}>Iniciar GPS</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[commonStyles.button, { backgroundColor: colores.rojo, flexDirection: 'row', justifyContent: 'center', gap: 8 }]}
                onPress={handleDetenerViaje}
              >
                <Square size={18} color={colores.blanco} />
                <Text style={commonStyles.buttonText}>Detener Viaje</Text>
              </TouchableOpacity>
            )}

            {!enRuta && distanciaRecorrida > 0 && (
              <TouchableOpacity
                style={[commonStyles.button, { backgroundColor: colores.primario, flexDirection: 'row', justifyContent: 'center', gap: 8 }]}
                onPress={handleGuardarViaje}
              >
                <Check size={18} color={colores.blanco} />
                <Text style={commonStyles.buttonText}>Guardar en Odómetro</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={commonStyles.modalButtonCancelar}
              onPress={onClose}
              disabled={enRuta}
            >
              <Text style={commonStyles.modalButtonCancelarText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};