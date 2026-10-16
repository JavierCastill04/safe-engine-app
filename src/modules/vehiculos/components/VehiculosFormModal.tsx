import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

import { useAppDispatch } from '@/redux/hooks';
import { agregarVehiculo } from '@/redux/slices/vehiculoSlice';
import { commonStyles, colores, espaciado } from '@/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const VehiculoFormModal: React.FC<Props> = ({ visible, onClose }) => {
  const dispatch = useAppDispatch();

  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [anio, setAnio] = useState('');
  const [placa, setPlaca] = useState('');
  const [kilometraje, setKilometraje] = useState('');

  const handleGuardar = () => {
    if (!marca.trim() || !modelo.trim() || !placa.trim()) {
      Alert.alert('Campos incompletos', 'Por favor ingresa la marca, modelo y placa del vehículo.');
      return;
    }

    const anioNum = parseInt(anio, 10) || new Date().getFullYear();
    const kmNum = parseFloat(String(kilometraje || '0').replace(',', '.')) || 0;

    if (kmNum < 0) {
      Alert.alert('Valor inválido', 'El kilometraje no puede ser un valor negativo.');
      return;
    }

    // Se remueve 'id' ya que el slice lo genera automáticamente
    dispatch(
      agregarVehiculo({
        marca: marca.trim(),
        modelo: modelo.trim(),
        anio: anioNum,
        placa: placa.trim().toUpperCase(),
        kilometrajeActual: kmNum,
      })
    );

    // Limpieza de campos y cierre
    setMarca('');
    setModelo('');
    setAnio('');
    setPlaca('');
    setKilometraje('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={commonStyles.modalOverlay}>
        <View style={commonStyles.modal}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <Text style={commonStyles.title}>Agregar Nuevo Vehículo</Text>

            <View style={commonStyles.inputView}>
              <Text style={commonStyles.label}>Marca</Text>
              <TextInput
                style={commonStyles.input}
                placeholder="Ej. Toyota"
                placeholderTextColor={colores.gris}
                value={marca}
                onChangeText={setMarca}
              />
            </View>

            <View style={commonStyles.inputView}>
              <Text style={commonStyles.label}>Modelo</Text>
              <TextInput
                style={commonStyles.input}
                placeholder="Ej. Corolla"
                placeholderTextColor={colores.gris}
                value={modelo}
                onChangeText={setModelo}
              />
            </View>

            <View style={commonStyles.inputView}>
              <Text style={commonStyles.label}>Año</Text>
              <TextInput
                style={commonStyles.input}
                placeholder="Ej. 2020"
                placeholderTextColor={colores.gris}
                keyboardType="numeric"
                value={anio}
                onChangeText={setAnio}
              />
            </View>

            <View style={commonStyles.inputView}>
              <Text style={commonStyles.label}>Placa</Text>
              <TextInput
                style={commonStyles.input}
                placeholder="Ej. P123-456"
                placeholderTextColor={colores.gris}
                autoCapitalize="characters"
                value={placa}
                onChangeText={setPlaca}
              />
            </View>

            <View style={commonStyles.inputView}>
              <Text style={commonStyles.label}>Kilometraje Inicial (km)</Text>
              <TextInput
                style={commonStyles.input}
                placeholder="Ej. 45000.0"
                placeholderTextColor={colores.gris}
                keyboardType="numeric"
                value={kilometraje}
                onChangeText={setKilometraje}
              />
            </View>

            <View style={[commonStyles.modalButtons, { marginTop: espaciado.md }]}>
              <TouchableOpacity
                style={commonStyles.modalButtonCancelar}
                onPress={onClose}
              >
                <Text style={commonStyles.modalButtonCancelarText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={commonStyles.modalButton}
                onPress={handleGuardar}
              >
                <Text style={commonStyles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default VehiculoFormModal;