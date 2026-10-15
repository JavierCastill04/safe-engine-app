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
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { actualizarKilometraje } from '@/redux/slices/vehiculoSlice';
import { esMovimientoValido } from '../utils/geoUtils';
import { commonStyles, colores, espaciado } from '@/theme';
const MAX_INTERVALO_GPS_MS = 15000;
export const OdometroScreen = () => {
  const dispatch = useAppDispatch();
  const { estilos } = useTheme();
  const styles = useStyles(makeStyles);

  const vehiculos = useAppSelector(
    (state) => state.vehiculos.vehiculos
  );

  const [corriendo, setCorriendo] = useState(false);
  const [distanciaMetros, setDistanciaMetros] = useState(0);
  const [unidad, setUnidad] = useState<'metros' | 'millas'>('millas');
  const [vehiculoSeleccionadoId, setVehiculoSeleccionadoId] =
    useState('');
  const [estaEnMovimiento, setEstaEnMovimiento] = useState(false);

  const ultimaUbicacion =
    useRef<Location.LocationObject | null>(null);

  const locationSubscription =
    useRef<Location.LocationSubscription | null>(null);

  const accelSubscription = useRef<any>(null);

  useEffect(() => {
    if (vehiculos.length > 0 && !vehiculoSeleccionadoId) {
      setVehiculoSeleccionadoId(vehiculos[0].id);
    }
  }, [vehiculos, vehiculoSeleccionadoId]);

  useEffect(() => {
    if (corriendo) {
      Accelerometer.setUpdateInterval(500);

      accelSubscription.current = Accelerometer.addListener(
        ({ x, y, z }) => {
          const magnitud = Math.sqrt(x * x + y * y + z * z);
          const delta = Math.abs(magnitud - 1.0);

          setEstaEnMovimiento(delta > 0.08);
        }
      );
    } else if (accelSubscription.current) {
      accelSubscription.current.remove();
      accelSubscription.current = null;
      setEstaEnMovimiento(false);
    }

    return () => {
      if (accelSubscription.current) {
        accelSubscription.current.remove();
        accelSubscription.current = null;
      }
    };
  }, [corriendo]);

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

  if (
    ultimaUbicacion.current &&
    nuevaUbicacion.timestamp -
      ultimaUbicacion.current.timestamp >
      MAX_INTERVALO_GPS_MS
  ) {
    ultimaUbicacion.current = nuevaUbicacion;
    return;
  }
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
            } else {
              ultimaUbicacion.current = nuevaUbicacion;
            }
          }
        );

        if (active) {
          locationSubscription.current = subscription;
        } else {
          subscription.remove();
        }
      } catch (error) {
        if (!active) return;

        console.error('Error al iniciar el GPS:', error);

        Alert.alert(
          'Error de ubicación',
          'No fue posible iniciar el rastreo GPS. Comprueba los permisos y vuelve a intentarlo.'
        );

        setCorriendo(false);
      }
    };

    if (corriendo) {
      iniciarRastreoGPS();
    } else {
      locationSubscription.current?.remove();
      locationSubscription.current = null;
      ultimaUbicacion.current = null;
    }

    return () => {
      active = false;

      locationSubscription.current?.remove();
      locationSubscription.current = null;
    };
  }, [corriendo]);

  const handleIniciarDetener = () => {
    setCorriendo((prev) => !prev);
  };

  const handleReiniciar = () => {
    setCorriendo(false);
    setDistanciaMetros(0);
    ultimaUbicacion.current = null;
  };
const handleAsignarAVehiculo = () => {
  if (corriendo) {
    Alert.alert(
      'Recorrido en curso',
      'Pausa el odómetro antes de guardar el recorrido.'
    );
    return;
  }
    if (distanciaMetros === 0) {
      Alert.alert(
        'Sin recorrido',
        'No hay recorrido acumulado para guardar.'
      );
      return;
    }

    const vehiculo = vehiculos.find(
      (v) => v.id === vehiculoSeleccionadoId
    );

    if (!vehiculo) {
      Alert.alert(
        'Error',
        'No se encontró el vehículo seleccionado.'
      );
      return;
    }

    const kmAdicionales = distanciaMetros / 1000;
    const nuevoKm =
  Math.round(
    (vehiculo.kilometrajeActual + kmAdicionales) * 1000
  ) / 1000;
    dispatch(
      actualizarKilometraje({
        id: vehiculoSeleccionadoId,
        nuevoKilometraje: nuevoKm,
      })
    );

    Alert.alert(
      '¡Viaje asignado!',
      `Se agregaron ${kmAdicionales.toFixed(2)} km a ${vehiculo.marca} ${vehiculo.modelo}.`
    );

    handleReiniciar();
  };

  const millas = (distanciaMetros / 1609.34).toFixed(2);
  const metros = Math.round(distanciaMetros).toLocaleString();

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.titulo}>
          Odómetro GPS
        </Text>

        <Text style={styles.subtitulo}>
          Registra la distancia recorrida y asígnala a un vehículo.
        </Text>
      </View>

      <View style={styles.unidadContainer}>
        <TouchableOpacity
          style={[
            styles.btnUnidad,
            unidad === 'millas' && styles.btnUnidadActive,
          ]}
          onPress={() => setUnidad('millas')}
          accessibilityRole="button"
          accessibilityState={{ selected: unidad === 'millas' }}
        >
          <Text
            style={[
              styles.textoUnidad,
              unidad === 'millas' && styles.textoUnidadActive,
            ]}
          >
            Millas (mi)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.btnUnidad,
            unidad === 'metros' && styles.btnUnidadActive,
          ]}
          onPress={() => setUnidad('metros')}
          accessibilityRole="button"
          accessibilityState={{ selected: unidad === 'metros' }}
        >
          <Text
            style={[
              styles.textoUnidad,
              unidad === 'metros' && styles.textoUnidadActive,
            ]}
          >
            Metros (m)
          </Text>
        </TouchableOpacity>
      </View>
      <View style={[estilos.surface, styles.displayBox]}>
        <View style={styles.gpsIconContainer}>
        </View>

        <Text style={styles.displayNumero}>
          {unidad === 'millas' ? millas : metros}
        </Text>

        <Text style={styles.displayEtiqueta}>
          {unidad === 'millas'
            ? 'Millas recorridas'
            : 'Metros recorridos'}
        </Text>

        <View style={styles.estadoContainer}>
          <View
            style={[
              styles.estadoIndicador,
              corriendo
                ? estaEnMovimiento
                  ? styles.estadoMovimiento
                  : styles.estadoEsperando
                : styles.estadoInactivo,
            ]}
          />

          <Text style={styles.estadoTexto}>
            {!corriendo
              ? 'Rastreo detenido'
              : estaEnMovimiento
                ? 'Movimiento detectado'
                : 'Esperando desplazamiento'}
          </Text>
        </View>
      </View>

      <View style={styles.controlesRow}>
        <TouchableOpacity
          style={[
            styles.btnControl,
            corriendo ? styles.btnPausar : styles.btnIniciar,
          ]}
          onPress={handleIniciarDetener}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={
            corriendo ? 'Pausar GPS' : 'Iniciar viaje GPS'
          }
        >
          <Text style={styles.btnControlTexto}>
            {corriendo ? 'Pausar' : 'Iniciar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.btnControl,
            styles.btnReiniciar,
          ]}
          onPress={handleReiniciar}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Reiniciar recorrido"
        >
          <Text style={[styles.btnControlTexto, styles.btnReiniciarTexto]}>
            Reiniciar
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.vehiculosSeccion}>
        <Text style={styles.labelVehiculo}>
          Asignar recorrido a
        </Text>

        {vehiculos.length === 0 ? (
          <View style={[estilos.surface, styles.emptyBox]}>
            <Text style={styles.emptyTexto}>
              No hay vehículos registrados.
            </Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.vehiculosScroll}
          >
            {vehiculos.map((v) => {
              const seleccionado =
                vehiculoSeleccionadoId === v.id;

              return (
                <TouchableOpacity
                  key={v.id}
                  style={[
                    styles.chipVehiculo,
                    seleccionado && styles.chipVehiculoActive,
                  ]}
                  onPress={() =>
                    setVehiculoSeleccionadoId(v.id)
                  }
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityState={{
                    selected: seleccionado,
                  }}
                >
                  <Text
                    style={[
                      styles.chipTexto,
                      seleccionado && styles.chipTextoActive,
                    ]}
                  >
                    {v.marca} {v.modelo}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>
      <View style={styles.resumenBox}>
        <View style={styles.resumenIcono}>
        </View>
        <View style={styles.resumenTextoContainer}>
          <Text style={styles.resumenTitulo}>
            Distancia por guardar
          </Text>

          <Text style={styles.resumenValor}>
            {(distanciaMetros / 1000).toFixed(2)} km
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={[
          styles.btnGuardar,
          (distanciaMetros === 0 ||
            !vehiculoSeleccionadoId) &&
            styles.btnDeshabilitado,
        ]}
        onPress={handleAsignarAVehiculo}
        disabled={distanciaMetros === 0 || corriendo}
        accessibilityRole="button"
        accessibilityLabel="Finalizar y guardar recorrido en vehículo"
      >
        <Text style={styles.btnGuardarTexto}>
          Guardar recorrido
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default OdometroScreen;

const makeStyles = (t: ThemeContextType) =>
  StyleSheet.create({
    scroll: {
      flex: 1,
      backgroundColor: t.colores.fondo,
    },

    content: {
      flexGrow: 1,
      paddingHorizontal: t.espaciado.md,
      paddingTop: t.espaciado.md,
      paddingBottom: t.espaciado.xl,
    },

    header: {
      marginTop: t.espaciado.sm,
      marginBottom: t.espaciado.md,
    },

    titulo: {
      fontSize: 22,
      fontWeight: 'bold',
      color: t.colores.texto,
      marginBottom: 5,
    },

    subtitulo: {
      fontSize: 13,
      color: t.colores.textoSecundario,
      lineHeight: 19,
    },

    unidadContainer: {
      flexDirection: 'row',
      padding: 4,
      borderRadius: 10,
      backgroundColor: conAlpha(t.colores.texto, 5),
      borderWidth: 1,
      borderColor: conAlpha(t.colores.borde, 30),
      marginBottom: t.espaciado.md,
    },

    btnUnidad: {
      flex: 1,
      paddingVertical: 10,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 7,
    },

    btnUnidadActive: {
      backgroundColor: t.colores.primario,
    },

    textoUnidad: {
      fontSize: 13,
      fontWeight: '600',
      color: t.colores.textoSecundario,
    },

    textoUnidadActive: {
      color: t.colores.textoSobrePrimario, 
    },

    displayBox: {
      padding: t.espaciado.lg,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: conAlpha(t.colores.borde, 35),
      marginBottom: t.espaciado.md,
    },

    gpsIconContainer: {
      width: 56,
      height: 56,
      borderRadius: 18,
      backgroundColor: conAlpha(t.colores.primario, 12),
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: t.espaciado.sm,
    },

    displayNumero: {
      fontSize: 46,
      fontWeight: 'bold',
      color: t.colores.primario,
      fontVariant: ['tabular-nums'],
    },

    displayEtiqueta: {
      fontSize: 14,
      color: t.colores.textoSecundario,
      marginTop: 2,
    },

    estadoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      marginTop: t.espaciado.md,
      paddingHorizontal: t.espaciado.sm,
      paddingVertical: 7,
      borderRadius: 20,
      backgroundColor: conAlpha(t.colores.texto, 5),
    },

    estadoIndicador: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },

    estadoMovimiento: {
      backgroundColor: '#4ADE80',
    },

    estadoEsperando: {
      backgroundColor: '#FACC15',
    },

    estadoInactivo: {
      backgroundColor: t.colores.textoSecundario,
    },

    estadoTexto: {
      fontSize: 11,
      color: t.colores.textoSecundario,
      fontWeight: '600',
    },

    controlesRow: {
      flexDirection: 'row',
      gap: t.espaciado.sm,
      marginBottom: t.espaciado.md,
    },

    btnControl: {
      flex: 1,
      minHeight: 50,
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      borderRadius: 10,
    },

    btnIniciar: {
      backgroundColor: '#16A34A',
    },

    btnPausar: {
      backgroundColor: '#D97706',
    },

    btnReiniciar: {
      backgroundColor: t.colores.superficie,
      borderWidth: 1,
      borderColor: conAlpha(t.colores.borde, 45),
    },

    btnControlTexto: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontSize: 14,
    },

    btnReiniciarTexto: {
      color: t.colores.texto,
    },

    vehiculosSeccion: {
      marginBottom: t.espaciado.md,
    },

    labelVehiculo: {
      fontSize: 14,
      fontWeight: 'bold',
      color: t.colores.texto,
      marginBottom: t.espaciado.sm,
    },

    vehiculosScroll: {
      flexDirection: 'row',
      gap: t.espaciado.sm,
      paddingVertical: 2,
    },

    chipVehiculo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
      paddingVertical: 10,
      paddingHorizontal: t.espaciado.md,
      borderRadius: 10,
      backgroundColor: t.colores.superficie,
      borderWidth: 1,
      borderColor: conAlpha(t.colores.borde, 40),
    },

    chipVehiculoActive: {
      backgroundColor: t.colores.primario,
      borderColor: t.colores.primario,
    },

    chipTexto: {
      fontSize: 12,
      fontWeight: '600',
      color: t.colores.texto,
    },

    chipTextoActive: {
      color: t.colores.textoSobrePrimario,
    },

    emptyBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.espaciado.sm,
      padding: t.espaciado.md,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: conAlpha(t.colores.borde, 35),
    },

    emptyTexto: {
      flex: 1,
      fontSize: 13,
      color: t.colores.textoSecundario,
    },

    resumenBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.espaciado.md,
      padding: t.espaciado.md,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: conAlpha(t.colores.borde, 35),
      backgroundColor: conAlpha(t.colores.primario, 6),
      marginBottom: t.espaciado.md,
    },

    resumenIcono: {
      width: 42,
      height: 42,
      borderRadius: 12,
      backgroundColor: conAlpha(t.colores.primario, 12),
      alignItems: 'center',
      justifyContent: 'center',
    },

    resumenTextoContainer: {
      flex: 1,
    },

    resumenTitulo: {
      fontSize: 12,
      color: t.colores.textoSecundario,
      marginBottom: 3,
    },

    resumenValor: {
      fontSize: 19,
      fontWeight: 'bold',
      color: t.colores.texto,
    },

    btnGuardar: {
      minHeight: 50,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 9,
      paddingVertical: 13,
      paddingHorizontal: t.espaciado.md,
      borderRadius: 10,
      backgroundColor: t.colores.primario,
    },

    btnDeshabilitado: {
      opacity: 0.45,
    },

    btnGuardarTexto: {
      fontSize: 15,
      fontWeight: 'bold',
      color: t.colores.textoSobrePrimario, // antes '#FFFFFF'
    },
  });
