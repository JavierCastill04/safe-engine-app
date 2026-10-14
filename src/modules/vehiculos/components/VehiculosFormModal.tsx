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
  StyleSheet,
} from 'react-native';

import { useAppDispatch } from '@/redux/hooks';
import {
  agregarVehiculo,
  actualizarVehiculo,
} from '@/redux/slices/vehiculoSlice';
import type { Vehiculo } from '@/types/Vehiculo';

import {
  useStyles,
  useTheme,
  type ThemeContextType,
} from '@/hook/hooks';
import { conAlpha } from '@/theme/theme';

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

  const { estilos, espaciado } = useTheme();
  const styles = useStyles(makeStyles);

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
      Alert.alert(
        'Año inválido',
        'Ingresa un año válido.'
      );
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

      Alert.alert(
        'Vehículo actualizado',
        'Los cambios se guardaron correctamente.'
      );
    } else {
      dispatch(agregarVehiculo(datosVehiculo));

      Alert.alert(
        'Vehículo registrado',
        'El vehículo se agregó correctamente.'
      );
    }

    cerrar();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={cerrar}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View
          style={[
            estilos.surface,
            styles.modal,
          ]}
        >
          {/* Encabezado */}
          <View style={styles.modalHeader}>
            <View style={styles.headerTexto}>
              <Text style={styles.titulo}>
                {vehiculo
                  ? 'Editar vehículo'
                  : 'Registrar vehículo'}
              </Text>

              <Text style={styles.subtitulo}>
                {vehiculo
                  ? 'Actualiza la información de tu vehículo.'
                  : 'Completa los datos para agregar un vehículo.'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={cerrar}
              style={styles.btnCerrar}
              accessibilityRole="button"
              accessibilityLabel="Cerrar formulario"
              activeOpacity={0.7}
            >
              <Text style={styles.btnCerrarTexto}>×</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.separador} />

          {/* Formulario */}
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.formulario}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Marca */}
            <View style={styles.campo}>
              <Text style={styles.label}>Marca</Text>

              <TextInput
                style={styles.input}
                value={marca}
                onChangeText={setMarca}
                placeholder="Ej. Toyota"
                placeholderTextColor={styles.placeholder.color as string}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>

            {/* Modelo */}
            <View style={styles.campo}>
              <Text style={styles.label}>Modelo</Text>

              <TextInput
                style={styles.input}
                value={modelo}
                onChangeText={setModelo}
                placeholder="Ej. Corolla"
                placeholderTextColor={styles.placeholder.color as string}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>

            {/* Año */}
            <View style={styles.campo}>
              <Text style={styles.label}>Año</Text>

              <TextInput
                style={styles.input}
                value={anio}
                onChangeText={setAnio}
                keyboardType="numeric"
                maxLength={4}
                placeholder="Ej. 2022"
                placeholderTextColor={styles.placeholder.color as string}
                returnKeyType="next"
              />
            </View>

            {/* Placa */}
            <View style={styles.campo}>
              <Text style={styles.label}>Placa o matrícula</Text>

              <TextInput
                style={styles.input}
                value={placa}
                onChangeText={setPlaca}
                autoCapitalize="characters"
                placeholder="Ej. P123-456"
                placeholderTextColor={styles.placeholder.color as string}
                returnKeyType="next"
              />
            </View>

            {/* Kilometraje */}
            <View style={styles.campo}>
              <Text style={styles.label}>
                Kilometraje actual (km)
              </Text>

              <TextInput
                style={styles.input}
                value={kilometraje}
                onChangeText={setKilometraje}
                keyboardType="numeric"
                placeholder="Ej. 45000"
                placeholderTextColor={styles.placeholder.color as string}
                returnKeyType="done"
                onSubmitEditing={guardar}
              />

              <Text style={styles.ayuda}>
                Introduce el kilometraje actual del odómetro.
              </Text>
            </View>
          </ScrollView>

          {/* Botones */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.btnCancelar}
              onPress={cerrar}
              activeOpacity={0.8}
              accessibilityRole="button"
            >
              <Text style={styles.btnCancelarTexto}>
                Cancelar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnGuardar}
              onPress={guardar}
              activeOpacity={0.8}
              accessibilityRole="button"
            >
              <Text style={styles.btnGuardarTexto}>
                {vehiculo ? 'Guardar cambios' : 'Registrar vehículo'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const makeStyles = (t: ThemeContextType) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: t.espaciado.md,
      paddingVertical: t.espaciado.lg,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
    },

    modal: {
      width: '100%',
      maxWidth: 500,
      maxHeight: '90%',
      borderRadius: 18,
      padding: t.espaciado.md,
      borderWidth: 1,
      borderColor: conAlpha(t.colores.borde, 40),
      overflow: 'hidden',
    },

    modalHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: t.espaciado.sm,
      paddingBottom: t.espaciado.sm,
    },

    headerTexto: {
      flex: 1,
    },

    titulo: {
      fontSize: 20,
      fontWeight: 'bold',
      color: t.colores.texto,
    },

    subtitulo: {
      fontSize: 13,
      lineHeight: 19,
      color: t.colores.textoSecundario,
      marginTop: 5,
    },

    btnCerrar: {
      width: 34,
      height: 34,
      borderRadius: 10,
      backgroundColor: conAlpha(t.colores.texto, 7),
      alignItems: 'center',
      justifyContent: 'center',
    },

    btnCerrarTexto: {
      fontSize: 27,
      lineHeight: 30,
      color: t.colores.textoSecundario,
    },

    separador: {
      height: 1,
      backgroundColor: conAlpha(t.colores.borde, 35),
      marginVertical: t.espaciado.sm,
    },

    scroll: {
      flexShrink: 1,
    },

    formulario: {
      paddingVertical: t.espaciado.sm,
      gap: t.espaciado.md,
    },

    campo: {
      gap: 7,
    },

    label: {
      fontSize: 13,
      fontWeight: '600',
      color: t.colores.texto,
    },

    input: {
      minHeight: 48,
      borderWidth: 1,
      borderColor: conAlpha(t.colores.borde, 50),
      borderRadius: 10,
      paddingHorizontal: t.espaciado.md,
      paddingVertical: 11,
      fontSize: 14,
      color: t.colores.texto,
      backgroundColor: conAlpha(t.colores.texto, 4),
    },

    placeholder: {
      color: t.colores.gris,
    },

    ayuda: {
      fontSize: 11,
      lineHeight: 16,
      color: t.colores.textoSecundario,
    },

    footer: {
      flexDirection: 'row',
      gap: t.espaciado.sm,
      paddingTop: t.espaciado.md,
      marginTop: t.espaciado.xs,
      borderTopWidth: 1,
      borderTopColor: conAlpha(t.colores.borde, 30),
    },

    btnCancelar: {
      flex: 1,
      minHeight: 46,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: t.espaciado.sm,
      borderWidth: 1,
      borderColor: conAlpha(t.colores.borde, 50),
      backgroundColor: conAlpha(t.colores.texto, 5),
    },

    btnCancelarTexto: {
      color: t.colores.texto,
      fontSize: 13,
      fontWeight: '600',
    },

    btnGuardar: {
      flex: 1.5,
      minHeight: 46,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: t.espaciado.sm,
      backgroundColor: t.colores.primario,
    },

    btnGuardarTexto: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });

export default VehiculoFormModal;