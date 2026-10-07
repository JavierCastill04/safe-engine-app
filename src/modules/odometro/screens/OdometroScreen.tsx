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
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { actualizarKilometraje } from '@/redux/slices/vehiculoSlice';
import { calcularDistanciaMetros } from '../utils/geoUtils';
import { commonStyles, colores, espaciado } from '@/theme';

export const OdometroScreen = () => {
  const dispatch = useAppDispatch();
  const vehiculos = useAppSelector((state) => state.vehiculos.vehiculos);

  // Estados del rastreador GPS
  const [corriendo, setCorriendo] = useState(false);
  const [distanciaMetros, setDistanciaMetros] = useState(0);
  const [unidad, setUnidad] = useState<'metros' | 'millas'>('millas');
  const [vehiculoSeleccionadoId, setVehiculoSeleccionadoId] = useState<string>('');

  // Referencias para guardar la última ubicación y la suscripción GPS
  const ultimaUbicacion = useRef<Location.LocationObject | null>(null);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);

  // Seleccionar primer vehículo por defecto
  useEffect(() => {
    if (vehiculos.length > 0 && !vehiculoSeleccionadoId) {
      setVehiculoSeleccionadoId(vehiculos[0].id);
    }
  }, [vehiculos]);

  // Manejar el rastreo por GPS
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

      // 2. Suscribirse a los cambios de posición GPS
      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 3, // Actualiza cada vez que el dispositivo se mueva al menos 3 metros
          timeInterval: 1000,   // O mínimo cada 1 segundo
        },
        (nuevaUbicacion) => {
          if (!active) return;

          // Si hay una ubicación previa, calculamos el desplazamiento
          if (ultimaUbicacion.current) {
            const { latitude: lat1, longitude: lon1 } = ultimaUbicacion.current.coords;
            const { latitude: lat2, longitude: lon2 } = nuevaUbicacion.coords;

            const metrosDesplazados = calcularDistanciaMetros(lat1, lon1, lat2, lon2);

            // Filtrar lecturas irrelevantes o imprecisiones de señal (ruido GPS < 1 metro)
            if (metrosDesplazados > 1) {
              setDistanciaMetros((prev) => prev + metrosDesplazados);
            }
          }

          // Guardar última coordenada registrada
          ultimaUbicacion.current = nuevaUbicacion;
        }
      );
    };

    if (corriendo) {
      iniciarRastreoGPS();
    } else {
      // Detener suscripción al pausar
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

    // Despachar a Redux para actualizar la pantalla de vehículos
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
      <Text style={commonStyles.title}>📡 Odómetro GPS en Vivo</Text>

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
          <Text style={styles.statusGps}>🟢 Rastreo GPS Activo</Text>
        )}
      </View>

      {/* Controles del Odómetro */}
      <View style={styles.controlesRow}>
        <TouchableOpacity
          style={[styles.btnControl, corriendo ? styles.btnPausar : styles.btnIniciar]}
          onPress={handleIniciarDetener}
        >
          <Text style={styles.btnControlTexto}>
            {corriendo ? '⏸ Pausar GPS' : '▶ Iniciar Viaje GPS'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnControl, styles.btnReiniciar]}
          onPress={handleReiniciar}
        >
          <Text style={styles.btnControlTexto}>🔄 Reiniciar</Text>
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
      >
        <Text style={styles.btnGuardarTexto}>💾 Finalizar y Guardar en Vehículo</Text>
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
  statusGps: {
    color: '#4ADE80',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 8,
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