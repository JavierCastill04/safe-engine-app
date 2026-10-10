import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAppDispatch } from '@/redux/hooks';
import {
  agregarVehiculo,
  actualizarVehiculo,
} from '@/redux/slices/vehiculoSlice';
import type { Vehiculo } from '@/types/Vehiculo';
import { commonStyles, colores } from '@/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  vehiculo?: Vehiculo | null;
}

export const VehiculoFormModal: React.FC<Props> = ({
  visible,
  onClose,
  vehiculo = null,
}) => {
  const dispatch = useAppDispatch();

  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [anio, setAnio] = useState('');
  const [placa, setPlaca] = useState('');
  const [kilometraje, setKilometraje] = useState('');

  useEffect(() => {
    if (visible && vehiculo) {
      setMarca(vehiculo.marca);
      setModelo(vehiculo.modelo);
      setAnio(String(vehiculo.anio));
      setPlaca(vehiculo.placa);
      setKilometraje(String(vehiculo.kilometrajeActual));
    } else if (visible) {
      limpiarFormulario();
    }
  }, [visible, vehiculo]);

  const limpiarFormulario = () => {
    setMarca('');
    setModelo('');
    setAnio('');
    setPlaca('');
    setKilometraje('');
  };

  const cerrar = () => {
    limpiarFormulario();
    onClose();
  };

  const guardar = () => {
    if (
      !marca.trim() ||
      !modelo.trim() ||
      !placa.trim() ||
      !anio.trim() ||
      !kilometraje.trim()
    ) {
      Alert.alert(
        'Campos incompletos',
        'Completa todos los campos antes de guardar.'
      );
      return;
    }

    const anioNumero = Number(anio);
    const kmNumero = Number(kilometraje);
    const anioActual = new Date().getFullYear();

    if (
      !Number.isInteger(anioNumero) ||
      anioNumero < 1886 ||
      anioNumero > anioActual + 1
    ) {
      Alert.alert('Año inválido', 'Ingresa un año válido.');
      return;
    }

    if (!Number.isFinite(kmNumero) || kmNumero < 0) {
      Alert.alert(
        'Kilometraje inválido',
        'Ingresa un kilometraje igual o mayor que cero.'
      );
      return;
    }

    const datosVehiculo = {
      marca: marca.trim(),
      modelo: modelo.trim(),
      anio: anioNumero,
      placa: placa.trim().toUpperCase(),
      kilometrajeActual: kmNumero,
    };

    if (vehiculo) {
      dispatch(
        actualizarVehiculo({
          ...datosVehiculo,
          id: vehiculo.id,
        })
      );

      Alert.alert('Vehículo actualizado', 'Los cambios se guardaron correctamente.');
    } else {
      dispatch(agregarVehiculo(datosVehiculo));

      Alert.alert('Vehículo registrado', 'El vehículo se agregó correctamente.');
    }

    cerrar();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={cerrar}
    >
      <KeyboardAvoidingView
        style={commonStyles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={commonStyles.modal}>
          <Text style={commonStyles.title}>
            {vehiculo ? 'Editar vehículo' : 'Registrar vehículo'}
          </Text>

          <ScrollView keyboardShouldPersistTaps="handled">
            <Text style={commonStyles.label}>Marca</Text>
            <TextInput
              style={commonStyles.input}
              value={marca}
              onChangeText={setMarca}
              placeholder="Ej. Toyota"
              placeholderTextColor={colores.gris}
            />

            <Text style={commonStyles.label}>Modelo</Text>
            <TextInput
              style={commonStyles.input}
              value={modelo}
              onChangeText={setModelo}
              placeholder="Ej. Corolla"
              placeholderTextColor={colores.gris}
            />

            <Text style={commonStyles.label}>Año</Text>
            <TextInput
              style={commonStyles.input}
              value={anio}
              onChangeText={setAnio}
              keyboardType="numeric"
              maxLength={4}
              placeholder="Ej. 2022"
              placeholderTextColor={colores.gris}
            />

            <Text style={commonStyles.label}>Placa o matrícula</Text>
            <TextInput
              style={commonStyles.input}
              value={placa}
              onChangeText={setPlaca}
              autoCapitalize="characters"
              placeholder="Ej. P123-456"
              placeholderTextColor={colores.gris}
            />

            <Text style={commonStyles.label}>Kilometraje actual</Text>
            <TextInput
              style={commonStyles.input}
              value={kilometraje}
              onChangeText={setKilometraje}
              keyboardType="numeric"
              placeholder="Ej. 45000"
              placeholderTextColor={colores.gris}
            />

            <View style={commonStyles.modalButtons}>
              <TouchableOpacity
                style={commonStyles.modalButtonCancelar}
                onPress={cerrar}
              >
                <Text style={commonStyles.modalButtonCancelarText}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={commonStyles.modalButton}
                onPress={guardar}
              >
                <Text style={commonStyles.buttonText}>
                  {vehiculo ? 'Guardar cambios' : 'Registrar'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};