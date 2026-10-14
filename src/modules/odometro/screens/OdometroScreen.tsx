import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';
import { Circle, Pause, Play, RotateCcw, Save } from 'lucide-react-native';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { actualizarKilometraje } from '@/redux/slices/vehiculoSlice';
import { esMovimientoValido } from '../utils/geoUtils';
import { commonStyles, colores, espaciado } from '@/theme';
export const OdometroScreen = () => {
  const dispatch = useAppDispatch();
  const vehiculos = useAppSelector((state) => state.vehiculos.vehiculos);
  // Estados del rastreador GPS y Sensores
  const [corriendo, setCorriendo] = useState(false);
  const [distanciaMetros, setDistanciaMetros] = useState(0);
  const [unidad, setUnidad] = useState<'metros' | 'millas'>('millas');
  const [vehiculoSeleccionadoId, setVehiculoSeleccionadoId] = useState<string>('');
  const [estaEnMovimiento, setEstaEnMovimiento] = useState(true);
  // Referencias para guardar la última ubicación y las suscripciones
  const ultimaUbicacion = useRef<Location.LocationObject | null>(null);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);
  const accelSubscription = useRef<any>(null);
  // Seleccionar primer vehículo por defecto
  useEffect(() => {
    if (vehiculos.length > 0 && !vehiculoSeleccionadoId) {
      setVehiculoSeleccionadoId(vehiculos[0].id);
    }
  }, [vehiculos]);
  // Escuchar acelerómetro para detectar movimiento físico del vehículo/celular
  useEffect(() => {
    if (corriendo) {
      Accelerometer.setUpdateInterval(500);
      accelSubscription.current = Accelerometer.addListener(({ x, y, z }) => {
        // Calcular magnitud de fuerza G (Gravedad pura = 1.0)
        const magnitud = Math.sqrt(x * x + y * y + z * z);
        const delta = Math.abs(magnitud - 1.0);
        // Si el delta de aceleración supera 0.08, consideramos que hay vibración/movimiento
        setEstaEnMovimiento(delta > 0.08);
      });
    } else {
      if (accelSubscription.current) {
        accelSubscription.current.remove();
        accelSubscription.current = null;
      }
    }
    return () => {
      if (accelSubscription.current) {
        accelSubscription.current.remove();
      }
    };
  }, [corriendo]);
  // Manejar el rastreo por GPS optimizado
  useEffect(() => {
    let active = true;
    const iniciarRastreoGPS = async () => {
      // 1. Solicitar permisos de ubicación
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permiso Denegado',
          'Se requieren permisos de ubicación para medir el desplazamiento real del vehículo.'
        );
        setCorriendo(false);
        return;
      }
      // 2. Suscribirse con parámetros de alta fidelidad para navegación
      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation, // Máxima precisión GPS posible
          distanceInterval: 3,                          // Intentar capturar tramos de mínimo 3 metros
          timeInterval: 1500,                           // Evaluación cada 1.5s
        },
        (nuevaUbicacion) => {
          if (!active) return;
          // Si tenemos una coordenada previa, aplicamos los filtros de validación
          if (ultimaUbicacion.current) {
            const puntoPrevio = {
              latitude: ultimaUbicacion.current.coords.latitude,
              longitude: ultimaUbicacion.current.coords.longitude,
              accuracy: ultimaUbicacion.current.coords.accuracy,
              timestamp: ultimaUbicacion.current.timestamp,
            };
            const puntoNuevo = {
              latitude: nuevaUbicacion.coords.latitude,
              longitude: nuevaUbicacion.coords.longitude,
              accuracy: nuevaUbicacion.coords.accuracy,
              timestamp: nuevaUbicacion.timestamp,
            };
            // Filtrar ruido/fantasmeo usando geoUtils
            const { esValido, distanciaMetros: metrosTramo } = esMovimientoValido(
              puntoPrevio,
              puntoNuevo,
              {
                distanciaMinimaMetros: 3,  // Ignora fluctuaciones estáticas menores a 3 metros
                precisionMaximaMetros: 20, // Ignora señales GPS distorsionadas (> 20m de margen)
                velocidadMaximaKmH: 200,   // Filtra saltos o teletransportaciones repentinas
              }
            );
            if (esValido) {
              setDistanciaMetros((prev) => prev + metrosTramo);
              ultimaUbicacion.current = nuevaUbicacion; // Solo actualizamos punto previo cuando el movimiento fue válido
            }
          } else {
            // Primera coordenada registrada
            ultimaUbicacion.current = nuevaUbicacion;
          }
        }
      );
    };
    if (corriendo) {
      iniciarRastreoGPS();
    } else {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
        locationSubscription.current = null;
      }
      ultimaUbicacion.current = null;
    }
    return () => {
      active = false;
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, [corriendo]);
  const handleIniciarDetener = () => {
    setCorriendo(!corriendo);
  };
  const handleReiniciar = () => {
    setCorriendo(false);
    setDistanciaMetros(0);
    ultimaUbicacion.current = null;
  };
  const handleAsignarAVehiculo = () => {
    if (!vehiculoSeleccionadoId) {
      Alert.alert('Error', 'Selecciona un vehículo para asignar la distancia.');
      return;
    }
    if (distanciaMetros === 0) {
      Alert.alert('Atención', 'No hay recorrido acumulado para guardar.');
      return;
    }
    const vehiculo = vehiculos.find((v) => v.id === vehiculoSeleccionadoId);
    if (!vehiculo) return;
    // Convertir metros acumulados a kilómetros
    const kmAdicionales = distanciaMetros / 1000;
    const nuevoKm = Math.round(vehiculo.kilometrajeActual + kmAdicionales);
    dispatch(
      actualizarKilometraje({
        id: vehiculoSeleccionadoId,
        nuevoKilometraje: nuevoKm,
      })
    );
    Alert.alert(
      '¡Viaje Asignado!',
      `Se agregaron ${kmAdicionales.toFixed(2)} km a ${vehiculo.marca} ${vehiculo.modelo}.`
    );
    handleReiniciar();
  };
  // Conversiones
  const millas = (distanciaMetros / 1609.34).toFixed(2);
  const metros = Math.round(distanciaMetros).toLocaleString();
  return (
    <View style={commonStyles.containerScreen}>
      {/* Selector de Unidad */}
      <View style={styles.unidadContainer}>
        <TouchableOpacity
          style={[styles.btnUnidad, unidad === 'millas' && styles.btnUnidadActive]}
          onPress={() => setUnidad('millas')}
        >
          <Text style={[styles.textoUnidad, unidad === 'millas' && styles.textoUnidadActive]}>
            Millas (mi)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnUnidad, unidad === 'metros' && styles.btnUnidadActive]}
          onPress={() => setUnidad('metros')}
        >
          <Text style={[styles.textoUnidad, unidad === 'metros' && styles.textoUnidadActive]}>
            Metros (m)
          </Text>
        </TouchableOpacity>
      </View>
      {/* Display Principal */}
      <View style={[commonStyles.surface, styles.displayBox]}>
        <Text style={styles.displayNumero}>
          {unidad === 'millas' ? millas : metros}
        </Text>
        <Text style={styles.displayEtiqueta}>
          {unidad === 'millas' ? 'Millas recorridas (GPS)' : 'Metros recorridos (GPS)'}
        </Text>
        {corriendo && (
          <View style={styles.statusGpsRow}>
            <Circle
              size={11}
              color={estaEnMovimiento ? '#4ADE80' : '#FACC15'}
              fill={estaEnMovimiento ? '#4ADE80' : '#FACC15'}
            />
            <Text style={styles.statusGps}>
              {estaEnMovimiento ? 'Rastreo Activo (En movimiento)' : 'Detenido (Esperando desplazamiento)'}
            </Text>
          </View>
        )}
      </View>
      {/* Controles del Odómetro */}
      <View style={styles.controlesRow}>
        <TouchableOpacity
          style={[styles.btnControl, corriendo ? styles.btnPausar : styles.btnIniciar]}
          onPress={handleIniciarDetener}
          accessibilityRole="button"
          accessibilityLabel={corriendo ? 'Pausar GPS' : 'Iniciar viaje GPS'}
        >
          {corriendo ? <Pause size={24} color="#FFF" /> : <Play size={24} color="#FFF" />}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnControl, styles.btnReiniciar]}
          onPress={handleReiniciar}
          accessibilityRole="button"
          accessibilityLabel="Reiniciar recorrido"
        >
          <RotateCcw size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
      {/* Selector de Vehículo Asignado */}
      <View style={styles.vehiculosSeccion}>
        <Text style={styles.labelVehiculo}>Asignar recorrido a:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.vehiculosScroll}>
          {vehiculos.map((v) => (
            <TouchableOpacity
              key={v.id}
              style={[
                styles.chipVehiculo,
                vehiculoSeleccionadoId === v.id && styles.chipVehiculoActive,
              ]}
              onPress={() => setVehiculoSeleccionadoId(v.id)}
            >
              <Text
                style={[
                  styles.chipTexto,
                  vehiculoSeleccionadoId === v.id && styles.chipTextoActive,
                ]}
              >
                {v.marca} {v.modelo} ({v.placa})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {/* Botón de Confirmación */}
      <TouchableOpacity
        style={[styles.btnGuardar, distanciaMetros === 0 && { opacity: 0.5 }]}
        onPress={handleAsignarAVehiculo}
        disabled={distanciaMetros === 0}
        accessibilityRole="button"
        accessibilityLabel="Finalizar y guardar recorrido en vehículo"
      >
        <Save size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};
export default OdometroScreen;
const styles = StyleSheet.create({
  unidadContainer: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: 4,
    marginVertical: espaciado.sm,
  },
  btnUnidad: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  btnUnidadActive: {
    backgroundColor: colores.primario,
  },
  textoUnidad: {
    color: '#94A3B8',
    fontWeight: '600',
  },
  textoUnidadActive: {
    color: '#FFF',
  },
  displayBox: {
    padding: espaciado.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: espaciado.md,
    borderRadius: 16,
  },
  displayNumero: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colores.primario,
  },
  displayEtiqueta: {
    fontSize: 15,
    color: colores.textoSecundario,
    marginTop: 4,
  },
  statusGpsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  statusGps: {
    color: '#4ADE80',
    fontSize: 12,
    fontWeight: 'bold',
  },
  controlesRow: {
    flexDirection: 'row',
    gap: espaciado.md,
    marginBottom: espaciado.md,
  },
  btnControl: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnIniciar: {
    backgroundColor: '#16A34A',
  },
  btnPausar: {
    backgroundColor: '#D97706',
  },
  btnReiniciar: {
    backgroundColor: '#334155',
  },
  btnContenido: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  btnControlTexto: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  vehiculosSeccion: {
    marginVertical: espaciado.sm,
  },
  labelVehiculo: {
    color: colores.texto,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: espaciado.xs,
  },
  vehiculosScroll: {
    flexDirection: 'row',
  },
  chipVehiculo: {
    backgroundColor: '#1E293B',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  chipVehiculoActive: {
    backgroundColor: colores.primario,
    borderColor: colores.primario,
  },
  chipTexto: {
    color: colores.textoSecundario,
    fontSize: 13,
  },
  chipTextoActive: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  btnGuardar: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: espaciado.md,
  },
  btnGuardarTexto: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
