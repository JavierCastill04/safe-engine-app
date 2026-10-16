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
import { agregarMantenimiento } from '@/redux/slices/mantenimientoSlice';
import { commonStyles, colores } from '@/theme';
import type { TipoMantenimiento } from '@/types';

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

  const [tipo, setTipo] = useState<TipoMantenimiento>('aceite');
  const [costo, setCosto] = useState('');
  const [notas, setNotas] = useState('');
  const [intervaloKm, setIntervaloKm] = useState('5000');
  const [siguienteFecha, setSiguienteFecha] = useState('');

  const handleGuardar = async () => {
    try {
      // Limpieza segura de entradas numéricas
      const costoLimpio = String(costo || '0').replace(',', '.');
      const intervaloLimpio = String(intervaloKm || '5000').replace(',', '.');

      const costoNum = parseFloat(costoLimpio);
      const intervaloKmNum = parseFloat(intervaloLimpio);

      if (isNaN(costoNum) || costoNum < 0) {
        Alert.alert('Error', 'Ingresa un costo válido.');
        return;
      }

      const kmRealizado = typeof kilometrajeActualVehiculo === 'number' ? kilometrajeActualVehiculo : 0;
      const kmIntervaloValido = isNaN(intervaloKmNum) || intervaloKmNum <= 0 ? 5000 : intervaloKmNum;
      const siguienteKm = kmRealizado + kmIntervaloValido;

      // Creación del objeto payload asegurando que no existan campos undefined
      const nuevoMantenimiento = {
        vehiculoId: String(vehiculoId),
        fecha: new Date().toISOString().split('T')[0],
        kilometraje: kmRealizado,
        kilometrajeRealiz: kmRealizado,
        tipo: tipo || 'general',
        costo: costoNum,
        notas: String(notas || ''),
        descripcion: String(notas || ''),
        intervaloKm: kmIntervaloValido,
        siguienteMantenimientoKm: siguienteKm,
        siguienteMantenimientoFecha: siguienteFecha.trim() ? siguienteFecha.trim() : undefined,
        detallesEspecificos: {},
      };

      // Despachar a Redux
      dispatch(agregarMantenimiento(nuevoMantenimiento));

      // Limpiar formulario y cerrar modal
      setCosto('');
      setNotas('');
      setIntervaloKm('5000');
      setSiguienteFecha('');
      onClose();
    } catch (error) {
      console.error('Error al guardar mantenimiento:', error);
      Alert.alert('Error', 'Ocurrió un problema al guardar el registro.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={commonStyles.modalOverlay}>
        <View style={commonStyles.modal}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <Text style={commonStyles.title}>Registrar Mantenimiento</Text>

            <View style={commonStyles.inputView}>
              <Text style={commonStyles.label}>Tipo de Mantenimiento</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {(['aceite', 'frenos', 'neumaticos', 'bateria', 'general'] as TipoMantenimiento[]).map(
                  (item) => (
                    <TouchableOpacity
                      key={item}
                      style={{
                        paddingVertical: 6,
                        paddingHorizontal: 12,
                        borderRadius: 6,
                        backgroundColor:
                          tipo === item ? colores.primario : colores.superficie,
                        borderWidth: 1,
                        borderColor: colores.borde,
                      }}
                      onPress={() => setTipo(item)}
                    >
                      <Text
                        style={{
                          color: colores.blanco,
                          fontSize: 12,
                          textTransform: 'capitalize',
                        }}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>

            <View style={commonStyles.inputView}>
              <Text style={commonStyles.label}>Costo ($)</Text>
              <TextInput
                style={commonStyles.input}
                placeholder="0.00"
                placeholderTextColor={colores.gris}
                keyboardType="numeric"
                value={costo}
                onChangeText={setCosto}
              />
            </View>

            <View style={commonStyles.inputView}>
              <Text style={commonStyles.label}>Intervalo para siguiente cambio (km)</Text>
              <TextInput
                style={commonStyles.input}
                placeholder="Ej: 5000"
                placeholderTextColor={colores.gris}
                keyboardType="numeric"
                value={intervaloKm}
                onChangeText={setIntervaloKm}
              />
            </View>

            <View style={commonStyles.inputView}>
              <Text style={commonStyles.label}>Próxima fecha estimada (Opcional, AAAA-MM-DD)</Text>
              <TextInput
                style={commonStyles.input}
                placeholder="2027-01-15"
                placeholderTextColor={colores.gris}
                value={siguienteFecha}
                onChangeText={setSiguienteFecha}
              />
            </View>

            <View style={commonStyles.inputView}>
              <Text style={commonStyles.label}>Notas o Descripción</Text>
              <TextInput
                style={[commonStyles.input, { height: 70 }]}
                placeholder="Detalles sobre repuestos o trabajo realizado..."
                placeholderTextColor={colores.gris}
                multiline
                value={notas}
                onChangeText={setNotas}
              />
            </View>

            <View style={commonStyles.modalButtons}>
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

export default MantenimientoFormModal;