import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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

  // Estados del formulario
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [anio, setAnio] = useState('');
  const [placa, setPlaca] = useState('');
  const [kilometrajeInicial, setKilometrajeInicial] = useState('');

  // Limpiar campos al cerrar
  const resetForm = () => {
    setMarca('');
    setModelo('');
    setAnio('');
    setPlaca('');
    setKilometrajeInicial('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleGuardar = () => {
  if (!marca.trim() || !modelo.trim() || !placa.trim() || !kilometrajeInicial.trim()) {
    Alert.alert('Campos incompletos', 'Por favor llena todos los campos obligatorios.');
    return;
  }

  const kmNumber = Number(kilometrajeInicial);
  const anioNumber = anio.trim() ? parseInt(anio.trim(), 10) : new Date().getFullYear();

  if (isNaN(kmNumber) || kmNumber < 0) {
    Alert.alert('Kilometraje inválido', 'Ingresa un número válido para el kilometraje.');
    return;
  }

  if (isNaN(anioNumber)) {
    Alert.alert('Año inválido', 'Ingresa un año válido.');
    return;
  }

  // Objeto con `anio` como number y sin `id`
  const nuevoVehiculo = {
    marca: marca.trim(),
    modelo: modelo.trim(),
    anio: anioNumber,
    placa: placa.trim().toUpperCase(),
    kilometrajeActual: kmNumber,
  };

  dispatch(agregarVehiculo(nuevoVehiculo));

  Alert.alert('Éxito', 'Vehículo agregado correctamente.');
  handleClose();
};

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={[commonStyles.surface, styles.modalContainer]}>
          <Text style={[commonStyles.title, styles.titleModal]}>
            🚘 Agregar Nuevo Vehículo
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Campo: Marca */}
            <Text style={styles.label}>Marca *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Toyota, Honda, Nissan"
              placeholderTextColor={colores.textoSecundario}
              value={marca}
              onChangeText={setMarca}
            />

            {/* Campo: Modelo */}
            <Text style={styles.label}>Modelo *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Corolla, Civic, Sentra"
              placeholderTextColor={colores.textoSecundario}
              value={modelo}
              onChangeText={setModelo}
            />

            {/* Campo: Año */}
            <Text style={styles.label}>Año</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. 2022"
              placeholderTextColor={colores.textoSecundario}
              keyboardType="numeric"
              maxLength={4}
              value={anio}
              onChangeText={setAnio}
            />

            {/* Campo: Placa */}
            <Text style={styles.label}>Placa / Matrícula *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. P123-456"
              placeholderTextColor={colores.textoSecundario}
              autoCapitalize="characters"
              value={placa}
              onChangeText={setPlaca}
            />

            {/* Campo: Kilometraje Inicial */}
            <Text style={styles.label}>Kilometraje Actual (km) *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. 45000"
              placeholderTextColor={colores.textoSecundario}
              keyboardType="numeric"
              value={kilometrajeInicial}
              onChangeText={setKilometrajeInicial}
            />

            {/* Botones de Acción */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.btn, styles.btnCancelar]}
                onPress={handleClose}
              >
                <Text style={{ color: colores.textoSecundario, fontWeight: 'bold' }}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, styles.btnGuardar]}
                onPress={handleGuardar}
              >
                <Text style={styles.btnGuardarTexto}>Guardar Vehículo</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    padding: espaciado.md,
  },
  modalContainer: {
    maxHeight: '85%',
    padding: espaciado.lg,
    borderRadius: 16,
  },
  titleModal: {
    fontSize: 20,
    marginBottom: espaciado.md,
    textAlign: 'center',
  },
  label: {
    color: colores.texto,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    marginTop: espaciado.sm,
  },
  input: {
    backgroundColor: '#1E293B',
    color: '#FFF',
    paddingHorizontal: espaciado.md,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#334155',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: espaciado.lg,
    gap: espaciado.sm,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnCancelar: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#334155',
  },
  btnGuardar: {
    backgroundColor: colores.primario,
  },
  btnGuardarTexto: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});