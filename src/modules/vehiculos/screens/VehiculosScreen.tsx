import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Plus } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { actualizarKilometraje } from '@/redux/slices/vehiculoSlice';
import { VehiculoFormModal } from '@/modules/vehiculos/components/VehiculosFormModal';
import { MantenimientoFormModal } from '@/modules/mantenimientos/components/MantenimientoFormModal';
import { commonStyles, colores, espaciado } from '@/theme';
import { getColores } from '@/theme/colores';

export const VehiculosScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const vehiculos = useAppSelector((state) => state.vehiculos.vehiculos);
  const temaActual = useAppSelector((state) => state.config?.tema || 'oscuro');
  const palette = getColores(temaActual);

  const [modalAgregarVehiculo, setModalAgregarVehiculo] = useState(false);
  const [modalMantenimiento, setModalMantenimiento] = useState<{
    visible: boolean;
    vehiculoId: string;
    kmActual: number;
  }>({ visible: false, vehiculoId: '', kmActual: 0 });

  const [unidadPrueba, setUnidadPrueba] = useState<'metros' | 'millas'>('millas');

  const SIMULAR_INCREMENTO = (vehiculoId: string, kilometrajeActual: number, cantidad: number) => {
    let kmAumento = unidadPrueba === 'metros' ? cantidad / 1000 : cantidad * 1.60934;
    const nuevoKm = Math.round(kilometrajeActual + kmAumento);
    dispatch(actualizarKilometraje({ id: vehiculoId, nuevoKilometraje: nuevoKm }));
  };

  return (
    <View style={[commonStyles.containerScreen, { backgroundColor: palette.fondo }]}>
      {/* Encabezado limpio sin botón superior */}
      <View style={styles.headerRow}>
        <Text style={[commonStyles.title, { color: palette.texto }]}>Vehículos Registrados</Text>
      </View>

      {/* Selector de Unidades */}
      <View style={[styles.testBar, { backgroundColor: palette.superficie }]}>
        <Text style={{ color: palette.textoSecundario, fontSize: 12 }}>
          Recorrido total del
        </Text>
        <View style={styles.switchContainer}>
          <TouchableOpacity
            style={[styles.switchBtn, unidadPrueba === 'millas' && { backgroundColor: palette.primario }]}
            onPress={() => setUnidadPrueba('millas')}
          >
            <Text style={[styles.switchText, unidadPrueba === 'millas' && styles.switchTextActive]}>
              Milla
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.switchBtn, unidadPrueba === 'metros' && { backgroundColor: palette.primario }]}
            onPress={() => setUnidadPrueba('metros')}
          >
            <Text style={[styles.switchText, unidadPrueba === 'metros' && styles.switchTextActive]}>
              Metro
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de Vehículos */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {vehiculos.map((v) => (
          <View key={v.id} style={[commonStyles.surface, styles.cardVehiculo, { backgroundColor: palette.superficie }]}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('VehiculoDetalleScreen', { vehiculoId: v.id })
              }
            >
              <Text style={[styles.vehiculoNombre, { color: palette.texto }]}>
                {v.marca} {v.modelo} ({v.anio || '2020'})
              </Text>
              <Text style={{ color: palette.textoSecundario, marginBottom: 4 }}>
                Placa: {v.placa}
              </Text>

              <View style={styles.odometroRow}>
                <Text style={[styles.odometroText, { color: palette.texto }]}>
                  ⏱ Odómetro: {v.kilometrajeActual.toLocaleString()} km
                </Text>
                <Text style={{ color: palette.textoSecundario, fontSize: 13 }}>
                  (
                  {unidadPrueba === 'millas'
                    ? `${(v.kilometrajeActual / 1.60934).toFixed(1)} mi`
                    : `${(v.kilometrajeActual * 1000).toLocaleString()} m`}
                  )
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.odometroControls}>
              <Text style={{ color: palette.textoSecundario, fontSize: 11, marginBottom: 4 }}>
                Simular recorrido:
              </Text>
              <View style={styles.btnRow}>
                <TouchableOpacity
                  style={styles.btnIncremento}
                  onPress={() =>
                    SIMULAR_INCREMENTO(v.id, v.kilometrajeActual, unidadPrueba === 'metros' ? 100 : 1)
                  }
                >
                  <Text style={styles.btnIncrementoText}>
                    +{unidadPrueba === 'metros' ? '100m' : '1 mi'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.btnIncremento}
                  onPress={() =>
                    SIMULAR_INCREMENTO(v.id, v.kilometrajeActual, unidadPrueba === 'metros' ? 500 : 10)
                  }
                >
                  <Text style={styles.btnIncrementoText}>
                    +{unidadPrueba === 'metros' ? '500m' : '10 mi'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.accionesRow}>
              <TouchableOpacity
                style={[styles.btnAccion, styles.btnRegistrar]}
                onPress={() =>
                  setModalMantenimiento({
                    visible: true,
                    vehiculoId: v.id,
                    kmActual: v.kilometrajeActual,
                  })
                }
              >
                <Text style={styles.btnTexto}>🔧 Registrar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btnAccion, styles.btnHistorial]}
                onPress={() => {
                  navigation.getParent()?.navigate('HistorialMantenimientoScreen', {
                    vehiculoId: v.id,
                    vehiculoNombre: `${v.marca} ${v.modelo}`,
                  });
                }}
              >
                <Text style={styles.btnTexto}>📋 Historial</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* BOTÓN FLOTANTE CIRCULAR (FAB) */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 20 }]}
        onPress={() => setModalAgregarVehiculo(true)}
        activeOpacity={0.8}
      >
        <Plus color="#FFFFFF" size={28} />
      </TouchableOpacity>

      {/* Modales */}
      <VehiculoFormModal
        visible={modalAgregarVehiculo}
        onClose={() => setModalAgregarVehiculo(false)}
      />

      {modalMantenimiento.visible && (
        <MantenimientoFormModal
          visible={modalMantenimiento.visible}
          vehiculoId={modalMantenimiento.vehiculoId}
          kilometrajeActualVehiculo={modalMantenimiento.kmActual}
          onClose={() =>
            setModalMantenimiento({ visible: false, vehiculoId: '', kmActual: 0 })
          }
        />
      )}
    </View>
  );
};

export default VehiculosScreen;

const styles = StyleSheet.create({
  headerRow: {
    marginBottom: espaciado.sm,
  },
  testBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: espaciado.sm,
    borderRadius: 8,
    marginBottom: espaciado.md,
  },
  switchContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  switchBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: '#334155',
  },
  switchText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  switchTextActive: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  scrollContainer: {
    paddingBottom: 80, // Margen suficiente para que la última tarjeta no tape el FAB
    gap: espaciado.md,
  },
  cardVehiculo: {
    padding: espaciado.md,
    borderRadius: 12,
  },
  vehiculoNombre: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  odometroRow: {
    marginVertical: 6,
  },
  odometroText: {
    fontSize: 15,
    fontWeight: '600',
  },
  odometroControls: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 8,
    borderRadius: 6,
    marginVertical: 8,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  btnIncremento: {
    backgroundColor: '#334155',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  btnIncrementoText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: 'bold',
  },
  accionesRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  btnAccion: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnRegistrar: {
    backgroundColor: '#DC2626',
  },
  btnHistorial: {
    backgroundColor: '#2563EB',
  },
  btnTexto: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  /* ESTILOS DEL BOTÓN FLOTANTE (FAB) */
  fab: {
    position: 'absolute',
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29, // Hace la forma perfectamente circular
    backgroundColor: '#2563EB', // Color azul vibrante
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6, // Sombra en Android
    shadowColor: '#000', // Sombra en iOS
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4.5,
  },
});