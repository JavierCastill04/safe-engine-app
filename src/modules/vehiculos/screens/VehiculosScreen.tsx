import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { actualizarKilometraje } from '@/redux/slices/vehiculoSlice';
import { VehiculoFormModal } from '../components/VehiculosFormModal';
import { MantenimientoFormModal } from '@/modules/mantenimientos/components/MantenimientoFormModal';
import { commonStyles, colores, espaciado } from '@/theme';

export const VehiculosScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const vehiculos = useAppSelector((state) => state.vehiculos.vehiculos);

  // Estados para modales
  const [modalAgregarVehiculo, setModalAgregarVehiculo] = useState(false);
  const [modalMantenimiento, setModalMantenimiento] = useState<{
    visible: boolean;
    vehiculoId: string;
    kmActual: number;
  }>({ visible: false, vehiculoId: '', kmActual: 0 });

  // Unidad de simulación para pruebas
  const [unidadPrueba, setUnidadPrueba] = useState<'metros' | 'millas'>('millas');

  const SIMULAR_INCREMENTO = (vehiculoId: string, kilometrajeActual: number, cantidad: number) => {
    let kmAumento = unidadPrueba === 'metros' ? cantidad / 1000 : cantidad * 1.60934;
    const nuevoKm = Math.round(kilometrajeActual + kmAumento);
    dispatch(actualizarKilometraje({ id: vehiculoId, nuevoKilometraje: nuevoKm }));
  };

  return (
    <View style={commonStyles.containerScreen}>
      {/* Encabezado */}
      <View style={styles.headerRow}>
        <Text style={commonStyles.title}>Vehículos Registrados</Text>
        <TouchableOpacity
          style={styles.btnAgregar}
          onPress={() => setModalAgregarVehiculo(true)}
        >
          <Text style={styles.btnAgregarTexto}>+ Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* Selector de Unidades */}
      <View style={styles.testBar}>
        <Text style={{ color: colores.textoSecundario, fontSize: 12 }}>
          Simular Odómetro:
        </Text>
        <View style={styles.switchContainer}>
          <TouchableOpacity
            style={[styles.switchBtn, unidadPrueba === 'millas' && styles.switchBtnActive]}
            onPress={() => setUnidadPrueba('millas')}
          >
            <Text style={[styles.switchText, unidadPrueba === 'millas' && styles.switchTextActive]}>
              Millas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.switchBtn, unidadPrueba === 'metros' && styles.switchBtnActive]}
            onPress={() => setUnidadPrueba('metros')}
          >
            <Text style={[styles.switchText, unidadPrueba === 'metros' && styles.switchTextActive]}>
              Metros
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de Vehículos */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {vehiculos.map((v) => (
          <View key={v.id} style={[commonStyles.surface, styles.cardVehiculo]}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('VehiculoDetalleScreen', { vehiculoId: v.id })
              }
            >
              <Text style={styles.vehiculoNombre}>
                {v.marca} {v.modelo} ({v.anio || '2020'})
              </Text>
              <Text style={{ color: colores.textoSecundario, marginBottom: 4 }}>
                Placa: {v.placa}
              </Text>

              {/* Odómetro Actual */}
              <View style={styles.odometroRow}>
                <Text style={styles.odometroText}>
                  ⏱ Odómetro: {v.kilometrajeActual.toLocaleString()} km
                </Text>
                <Text style={styles.odometroSubtext}>
                  (
                  {unidadPrueba === 'millas'
                    ? `${(v.kilometrajeActual / 1.60934).toFixed(1)} mi`
                    : `${(v.kilometrajeActual * 1000).toLocaleString()} m`}
                  )
                </Text>
              </View>
            </TouchableOpacity>

            {/* Controles de prueba */}
            <View style={styles.odometroControls}>
              <Text style={styles.controlTitle}>Simular recorrido:</Text>
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

            {/* BOTONES DE ACCIÓN: REGISTRAR E HISTORIAL */}
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
                onPress={() =>
                  navigation.navigate('HistorialMantenimientoScreen', {
                    vehiculoId: v.id,
                    vehiculoNombre: `${v.marca} ${v.modelo}`,
                  })
                }
              >
                <Text style={styles.btnTexto}>📋 Historial</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: espaciado.sm,
  },
  btnAgregar: {
    backgroundColor: colores.primario,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  btnAgregarTexto: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  testBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E293B',
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
  switchBtnActive: {
    backgroundColor: colores.primario,
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
    paddingBottom: espaciado.xl,
    gap: espaciado.md,
  },
  cardVehiculo: {
    padding: espaciado.md,
    borderRadius: 12,
  },
  vehiculoNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colores.texto,
  },
  odometroRow: {
    marginVertical: 6,
  },
  odometroText: {
    color: colores.texto,
    fontSize: 15,
    fontWeight: '600',
  },
  odometroSubtext: {
    color: colores.textoSecundario,
    fontSize: 13,
  },
  odometroControls: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 8,
    borderRadius: 6,
    marginVertical: 8,
  },
  controlTitle: {
    color: colores.textoSecundario,
    fontSize: 11,
    marginBottom: 4,
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
});