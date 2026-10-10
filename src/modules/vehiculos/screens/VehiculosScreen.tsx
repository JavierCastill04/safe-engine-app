import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Plus, FileText, Gauge, Wrench, History, ChevronsUp } from 'lucide-react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { generarHTMLReporte } from '@/modules/reportes/utils/ReportesUtils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { actualizarKilometraje } from '@/redux/slices/vehiculoSlice';
import { VehiculoFormModal } from '@/modules/vehiculos/components/VehiculosFormModal';
import { MantenimientoFormModal } from '@/modules/mantenimientos/components/MantenimientoFormModal';
import { commonStyles, espaciado } from '@/theme';
import { getColores } from '@/theme/colores';
export const VehiculosScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const vehiculos = useAppSelector(
    (state) => state.vehiculos.vehiculos
  );
  const mantenimientos = useAppSelector(
    (state) => state.mantenimientos.mantenimientos
  );
  const temaActual = useAppSelector(
    (state) => state.config?.tema || 'oscuro'
  );
  const palette = getColores(temaActual);
  const [modalAgregarVehiculo, setModalAgregarVehiculo] = useState(false);
  const [modalMantenimiento, setModalMantenimiento] = useState<{
    visible: boolean;
    vehiculoId: string;
    kmActual: number;
  }>({
    visible: false,
    vehiculoId: '',
    kmActual: 0,
  });
  const [unidadPrueba, setUnidadPrueba] = useState<'metros' | 'millas'>(
    'millas'
  );
  const SIMULAR_INCREMENTO = (
    vehiculoId: string,
    kilometrajeActual: number,
    cantidad: number
  ) => {
    const kmAumento =
      unidadPrueba === 'metros'
        ? cantidad / 1000
        : cantidad * 1.60934;
    const nuevoKm = Math.round(kilometrajeActual + kmAumento);
    dispatch(
      actualizarKilometraje({
        id: vehiculoId,
        nuevoKilometraje: nuevoKm,
      })
    );
  };
  const generarReporteVehiculo = async (
    vehiculo: (typeof vehiculos)[number]
  ) => {
    const mantenimientosVehiculo = mantenimientos.filter(
      (m) => m.vehiculoId === vehiculo.id
    );
    if (mantenimientosVehiculo.length === 0) {
      Alert.alert(
        'Sin historial',
        `El vehículo ${vehiculo.marca} ${vehiculo.modelo} no tiene mantenimientos registrados.`
      );
      return;
    }
    try {
      const html = generarHTMLReporte(
        [vehiculo],
        mantenimientosVehiculo
      );
      const archivo = await Print.printToFileAsync({ html });
      const puedeCompartir = await Sharing.isAvailableAsync();
      if (puedeCompartir) {
        await Sharing.shareAsync(archivo.uri, {
          mimeType: 'application/pdf',
          UTI: 'com.adobe.pdf',
          dialogTitle: `Reporte de ${vehiculo.marca} ${vehiculo.modelo}`,
        });
      } else {
        Alert.alert(
          'PDF generado',
          'El reporte se generó, pero compartir archivos no está disponible en este dispositivo.'
        );
      }
    } catch (error) {
      console.error('Error al generar el reporte:', error);
      Alert.alert(
        'Error',
        'No fue posible generar el reporte. Inténtalo nuevamente.'
      );
    }
  };
  return (
    <View
      style={[
        commonStyles.containerScreen,
        { backgroundColor: palette.fondo },
      ]}
    >
      {/* Encabezado */}
      <View style={styles.headerRow}>
        <Text style={[commonStyles.title, { color: palette.texto }]}>
          Vehículos Registrados
        </Text>
      </View>
      {/* Selector de unidades */}
      <View
        style={[
          styles.testBar,
          { backgroundColor: palette.superficie },
        ]}
      >
        <Text
          style={{
            color: palette.textoSecundario,
            fontSize: 12,
          }}
        >
          Recorrido total del
        </Text>
        <View style={styles.switchContainer}>
          <TouchableOpacity
            style={[
              styles.switchBtn,
              unidadPrueba === 'millas' && {
                backgroundColor: palette.primario,
              },
            ]}
            onPress={() => setUnidadPrueba('millas')}
          >
            <Text
              style={[
                styles.switchText,
                unidadPrueba === 'millas' && styles.switchTextActive,
              ]}
            >
              Milla
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.switchBtn,
              unidadPrueba === 'metros' && {
                backgroundColor: palette.primario,
              },
            ]}
            onPress={() => setUnidadPrueba('metros')}
          >
            <Text
              style={[
                styles.switchText,
                unidadPrueba === 'metros' && styles.switchTextActive,
              ]}
            >
              Metro
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Lista de vehículos */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {vehiculos.map((v) => (
          <View
            key={v.id}
            style={[
              commonStyles.surface,
              styles.cardVehiculo,
              { backgroundColor: palette.superficie },
            ]}
          >
            {/* Nombre del vehículo y botón de reporte PDF */}
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() =>
                    navigation.navigate('VehiculoDetalleScreen', {
                      vehiculoId: v.id,
                    })
                  }
                >
                  <Text
                    style={[
                      styles.vehiculoNombre,
                      { color: palette.texto },
                    ]}
                  >
                    {v.marca} {v.modelo} ({v.anio || '2020'})
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => generarReporteVehiculo(v)}
                  accessibilityRole="button"
                  accessibilityLabel={`Generar reporte PDF de ${v.marca} ${v.modelo}`}
                  hitSlop={8}
                  style={{ padding: 4, marginLeft: 8 }}
                >
                  <FileText color={palette.primario} size={23} />
                </TouchableOpacity>
              </View>
              {/* Placa y odómetro */}
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('VehiculoDetalleScreen', {
                    vehiculoId: v.id,
                  })
                }
              >
                <Text
                  style={{
                    color: palette.textoSecundario,
                    marginBottom: 4,
                  }}
                >
                  Placa: {v.placa}
                </Text>
                <View style={styles.odometroRow}>
                  <Text
                    style={[
                      styles.odometroText,
                      { color: palette.texto },
                    ]}
                  >
                    Odómetro: {v.kilometrajeActual.toLocaleString()} km
                  </Text>
                  <Text
                    style={{
                      color: palette.textoSecundario,
                      fontSize: 13,
                    }}
                  >
                    (
                    {unidadPrueba === 'millas'
                      ? `${(
                          v.kilometrajeActual / 1.60934
                        ).toFixed(1)} mi`
                      : `${(
                          v.kilometrajeActual * 1000
                        ).toLocaleString()} m`}
                    )
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            {/* Controles para simular recorrido */}
            <View style={styles.odometroControls}>
              <Text
                style={{
                  color: palette.textoSecundario,
                  fontSize: 11,
                  marginBottom: 4,
                }}
              >
                Simular recorrido:
              </Text>
              <View style={styles.btnRow}>
                <TouchableOpacity
                  style={styles.btnIncremento}
                  accessibilityRole="button"
                  accessibilityLabel={`Agregar ${unidadPrueba === 'metros' ? '100 metros' : '1 milla'} al recorrido simulado`}
                  onPress={() =>
                    SIMULAR_INCREMENTO(
                      v.id,
                      v.kilometrajeActual,
                      unidadPrueba === 'metros' ? 100 : 1
                    )
                  }
                >
                  <Plus color="#38BDF8" size={20} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnIncremento}
                  accessibilityRole="button"
                  accessibilityLabel={`Agregar ${unidadPrueba === 'metros' ? '500 metros' : '10 millas'} al recorrido simulado`}
                  onPress={() =>
                    SIMULAR_INCREMENTO(
                      v.id,
                      v.kilometrajeActual,
                      unidadPrueba === 'metros' ? 500 : 10
                    )
                  }
                >
                  <ChevronsUp color="#38BDF8" size={20} />
                </TouchableOpacity>
              </View>
            </View>
            {/* Acciones del vehículo */}
            <View style={styles.accionesRow}>
              <TouchableOpacity
                style={[styles.btnAccion, styles.btnRegistrar]}
                accessibilityRole="button"
                accessibilityLabel={`Registrar mantenimiento de ${v.marca} ${v.modelo}`}
                onPress={() =>
                  setModalMantenimiento({
                    visible: true,
                    vehiculoId: v.id,
                    kmActual: v.kilometrajeActual,
                  })
                }
              >
                <Wrench color="#FFF" size={22} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnAccion, styles.btnHistorial]}
                accessibilityRole="button"
                accessibilityLabel={`Ver historial de ${v.marca} ${v.modelo}`}
                onPress={() => {
                  navigation.getParent()?.navigate(
                    'HistorialMantenimientoScreen',
                    {
                      vehiculoId: v.id,
                      vehiculoNombre: `${v.marca} ${v.modelo}`,
                    }
                  );
                }}
              >
                <History color="#FFF" size={22} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      {/* Botón flotante para agregar vehículo */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 20 }]}
        onPress={() => setModalAgregarVehiculo(true)}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Agregar vehículo"
      >
        <Plus color="#FFFFFF" size={28} />
      </TouchableOpacity>
      {/* Modal para agregar vehículo */}
      <VehiculoFormModal
        visible={modalAgregarVehiculo}
        onClose={() => setModalAgregarVehiculo(false)}
      />
      {/* Modal para registrar mantenimiento */}
      {modalMantenimiento.visible && (
        <MantenimientoFormModal
          visible={modalMantenimiento.visible}
          vehiculoId={modalMantenimiento.vehiculoId}
          kilometrajeActualVehiculo={modalMantenimiento.kmActual}
          onClose={() =>
            setModalMantenimiento({
              visible: false,
              vehiculoId: '',
              kmActual: 0,
            })
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
    paddingBottom: 80,
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
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
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
  fab: {
    position: 'absolute',
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4.5,
  },
});