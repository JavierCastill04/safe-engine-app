import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { X, Calendar as CalendarIcon, Save } from 'lucide-react-native';
import { commonStyles, colores, espaciado } from '@/theme';
import type { TipoMantenimiento, Mantenimiento } from '@/types';
import { OpcionesTipoMantenimiento } from '@/modules/mantenimientos/utils/MantenimientosUtils';
import { useAppDispatch } from '@/redux/hooks';
import { agregarMantenimiento } from '@/redux/slices/mantenimientoSlice';
import { actualizarKilometraje } from '@/redux/slices/vehiculoSlice';

interface Props {
  visible: boolean;
  vehiculoId: string;
  kilometrajeActualVehiculo: number;
  onClose: () => void;
}

export const MantenimientoFormModal: React.FC<Props> = ({
  visible,
  vehiculoId,
  kilometrajeActualVehiculo,
  onClose,
}) => {
  const dispatch = useAppDispatch();

  // Campos del formulario
  const [fecha, setFecha] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [kilometraje, setKilometraje] = useState<string>(kilometrajeActualVehiculo.toString());
  const [tipo, setTipo] = useState<TipoMantenimiento>('aceite');
  const [costo, setCosto] = useState<string>('');
  const [notas, setNotas] = useState<string>('');

  // Detalles opcionales por tipo
  const [tipoAceite, setTipoAceite] = useState<string>('5W-30 Sintético');
  const [filtroCambiado, setFiltroCambiado] = useState<boolean>(true);
  const [frenosDelanteros, setFrenosDelanteros] = useState<boolean>(true);
  const [frenosTraseros, setFrenosTraseros] = useState<boolean>(false);
  const [presionPSI, setPresionPSI] = useState<string>('32');
  const [rotacionRealizada, setRotacionRealizada] = useState<boolean>(true);
  const [voltajeBateria, setVoltajeBateria] = useState<string>('12.6');

  const handleGuardar = () => {
    const kmNumero = parseInt(kilometraje, 10);
    const costoNumero = parseFloat(costo);

    if (isNaN(kmNumero) || kmNumero <= 0) {
      alert('Ingresa un kilometraje válido.');
      return;
    }

    if (isNaN(costoNumero) || costoNumero < 0) {
      alert('Ingresa un costo válido.');
      return;
    }

    const detallesEspecificos: Mantenimiento['detallesEspecificos'] = {};

    if (tipo === 'aceite') {
      detallesEspecificos.tipoAceite = tipoAceite;
      detallesEspecificos.filtroCambiado = filtroCambiado;
    } else if (tipo === 'frenos') {
      detallesEspecificos.frenosDelanteros = frenosDelanteros;
      detallesEspecificos.frenosTraseros = frenosTraseros;
    } else if (tipo === 'neumaticos') {
      detallesEspecificos.presionPSI = parseFloat(presionPSI) || 0;
      detallesEspecificos.rotacionRealizada = rotacionRealizada;
    } else if (tipo === 'bateria') {
      detallesEspecificos.voltajeBateria = parseFloat(voltajeBateria) || 0;
    }

    dispatch(
      agregarMantenimiento({
        vehiculoId,
        fecha: fecha.toISOString().split('T')[0],
        kilometraje: kmNumero,
        tipo,
        costo: costoNumero,
        notas,
        detallesEspecificos,
      })
    );

    if (kmNumero > kilometrajeActualVehiculo) {
      dispatch(actualizarKilometraje({ id: vehiculoId, nuevoKilometraje: kmNumero }));
    }

    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={commonStyles.modalOverlay}>
        <View style={commonStyles.modal}>
          <View style={styles.header}>
            <Text style={commonStyles.heading}>Registrar Servicio</Text>
            <TouchableOpacity onPress={onClose}>
              <X color={colores.blanco} size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
            {/* Fecha */}
            <Text style={commonStyles.label}>Fecha del Mantenimiento</Text>
            <TouchableOpacity
              style={[commonStyles.input, styles.datePickerBtn]}
              onPress={() => setShowDatePicker(true)}
            >
              <CalendarIcon color={colores.enfasis} size={20} />
              <Text style={commonStyles.text}>{fecha.toISOString().split('T')[0]}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={fecha}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setFecha(selectedDate);
                }}
              />
            )}

            {/* Kilometraje */}
            <View style={commonStyles.inputView}>
              <Text style={commonStyles.label}>Kilometraje al realizar servicio</Text>
              <TextInput
                style={commonStyles.input}
                keyboardType="numeric"
                value={kilometraje}
                onChangeText={setKilometraje}
                placeholder="Ej. 45000"
                placeholderTextColor={colores.gris}
              />
            </View>

            {/* Tipo de Servicio */}
            <Text style={commonStyles.label}>Tipo de Servicio</Text>
            <View style={[commonStyles.input, { paddingVertical: 0 }]}>
              <Picker
                selectedValue={tipo}
                onValueChange={(itemValue) => setTipo(itemValue as TipoMantenimiento)}
                dropdownIconColor={colores.enfasis}
                style={{ color: colores.texto }}
              >
                {OpcionesTipoMantenimiento.map((opcion) => (
                  <Picker.Item key={opcion.value} label={opcion.label} value={opcion.value} />
                ))}
              </Picker>
            </View>

            {/* Campos Dinámicos */}
            <View style={styles.dynamicContainer}>
              {tipo === 'aceite' && (
                <>
                  <Text style={commonStyles.label}>Marca / Especificación de Aceite</Text>
                  <TextInput
                    style={commonStyles.input}
                    value={tipoAceite}
                    onChangeText={setTipoAceite}
                    placeholder="Ej. Mobil 1 5W-30"
                    placeholderTextColor={colores.gris}
                  />
                  <View style={styles.switchRow}>
                    <Text style={commonStyles.text}>¿Filtro de aceite cambiado?</Text>
                    <Switch
                      value={filtroCambiado}
                      onValueChange={setFiltroCambiado}
                      trackColor={{ false: colores.gris, true: colores.enfasis }}
                    />
                  </View>
                </>
              )}

              {tipo === 'frenos' && (
                <>
                  <View style={styles.switchRow}>
                    <Text style={commonStyles.text}>Frenos Delanteros</Text>
                    <Switch
                      value={frenosDelanteros}
                      onValueChange={setFrenosDelanteros}
                      trackColor={{ false: colores.gris, true: colores.enfasis }}
                    />
                  </View>
                  <View style={styles.switchRow}>
                    <Text style={commonStyles.text}>Frenos Traseros</Text>
                    <Switch
                      value={frenosTraseros}
                      onValueChange={setFrenosTraseros}
                      trackColor={{ false: colores.gris, true: colores.enfasis }}
                    />
                  </View>
                </>
              )}

              {tipo === 'neumaticos' && (
                <>
                  <Text style={commonStyles.label}>Presión PSI Calibrada</Text>
                  <TextInput
                    style={commonStyles.input}
                    keyboardType="numeric"
                    value={presionPSI}
                    onChangeText={setPresionPSI}
                  />
                  <View style={styles.switchRow}>
                    <Text style={commonStyles.text}>¿Rotación de llantas realizada?</Text>
                    <Switch
                      value={rotacionRealizada}
                      onValueChange={setRotacionRealizada}
                      trackColor={{ false: colores.gris, true: colores.enfasis }}
                    />
                  </View>
                </>
              )}

              {tipo === 'bateria' && (
                <>
                  <Text style={commonStyles.label}>Voltaje Medido (V)</Text>
                  <TextInput
                    style={commonStyles.input}
                    keyboardType="numeric"
                    value={voltajeBateria}
                    onChangeText={setVoltajeBateria}
                  />
                </>
              )}
            </View>

            {/* Costo */}
            <View style={commonStyles.inputView}>
              <Text style={commonStyles.label}>Costo ($)</Text>
              <TextInput
                style={commonStyles.input}
                keyboardType="decimal-pad"
                value={costo}
                onChangeText={setCosto}
                placeholder="0.00"
                placeholderTextColor={colores.gris}
              />
            </View>

            {/* Notas */}
            <View style={commonStyles.inputView}>
              <Text style={commonStyles.label}>Notas adicionales</Text>
              <TextInput
                style={[commonStyles.input, { height: 70, textAlignVertical: 'top' }]}
                multiline
                numberOfLines={3}
                value={notas}
                onChangeText={setNotas}
                placeholder="Observaciones de la revisión..."
                placeholderTextColor={colores.gris}
              />
            </View>
          </ScrollView>

          {/* Botones de Acción */}
          <View style={commonStyles.modalButtons}>
            <TouchableOpacity
              style={commonStyles.modalButtonCancelar}
              onPress={onClose}
            >
              <Text style={commonStyles.modalButtonCancelarText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={commonStyles.modalButton} onPress={handleGuardar}>
              <Save color={colores.blanco} size={18} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: espaciado.md,
  },
  datePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.md,
  },
  dynamicContainer: {
    backgroundColor: colores.fondo,
    borderRadius: 8,
    padding: espaciado.md,
    marginVertical: espaciado.sm,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: espaciado.sm,
  },
});