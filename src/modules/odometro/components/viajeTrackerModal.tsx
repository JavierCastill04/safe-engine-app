// src/modules/viajes/components/ViajeTrackerModal.tsx

import React, { useState, useEffect, useRef } from 'react';
import {View, Text,Modal, StyleSheet, TouchableOpacity,Alert,} from 'react-native';
import * as Location from 'expo-location';
import { useAppDispatch } from '@/redux/hooks';
import { actualizarKilometraje } from '@/redux/slices/vehiculoSlice';
import {
  useStyles,
  useTheme,
  type ThemeContextType,
} from '@/hook/hooks';

import { conAlpha } from '@/theme/theme';

import { calcularDistanciaMetros } from '@/modules/odometro/utils/geoUtils';

interface Props {
  visible: boolean;
  vehiculoId: string;
  kilometrajeActual: number;
  onClose: () => void;
}

export const ViajeTrackerModal: React.FC<Props> = ({
  visible,
  vehiculoId,
  kilometrajeActual,
  onClose,
}) => {
  const dispatch = useAppDispatch();

  const { estilos, espaciado } = useTheme();
  const styles = useStyles(makeStyles);

  const [enViaje, setEnViaje] = useState(false);
  const [distanciaRecorrida, setDistanciaRecorrida] = useState(0);
  const [iniciando, setIniciando] = useState(false);

  const ultimaUbicacion =
    useRef<Location.LocationObject | null>(null);

  const subscription =
    useRef<Location.LocationSubscription | null>(null);

  const iniciarViaje = async () => {
    if (iniciando || enViaje) return;

    setIniciando(true);

    try {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permiso denegado',
          'Se requiere acceso a la ubicación para registrar el viaje.'
        );
        return;
      }

      setDistanciaRecorrida(0);
      ultimaUbicacion.current = null;

      const nuevaSubscription =
        await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 10,
          },
          (location) => {
            if (ultimaUbicacion.current) {
              const delta = calcularDistanciaMetros(
                ultimaUbicacion.current.coords.latitude,
                ultimaUbicacion.current.coords.longitude,
                location.coords.latitude,
                location.coords.longitude
              );
              setDistanciaRecorrida(
                (prev) => prev + delta / 1000
              );
            }

            ultimaUbicacion.current = location;
          }
        );

      subscription.current = nuevaSubscription;
      setEnViaje(true);
    } catch (error) {
      console.error('Error al iniciar el viaje:', error);

      Alert.alert(
        'Error de GPS',
        'No fue posible iniciar el seguimiento. Comprueba los permisos y vuelve a intentarlo.'
      );
    } finally {
      setIniciando(false);
    }
  };

  const finalizarViaje = () => {
    subscription.current?.remove();
    subscription.current = null;

    const kmGanados = Math.round(distanciaRecorrida);
    const nuevoKilometraje = kilometrajeActual + kmGanados;

    dispatch(
      actualizarKilometraje({
        id: vehiculoId,
        nuevoKilometraje,
      })
    );

    Alert.alert(
      'Viaje finalizado',
      `Recorriste ${distanciaRecorrida.toFixed(2)} km. El nuevo kilometraje es ${nuevoKilometraje.toLocaleString()} km.`
    );

    setEnViaje(false);
    setDistanciaRecorrida(0);
    ultimaUbicacion.current = null;

    onClose();
  };

  const cancelarViaje = () => {
    subscription.current?.remove();
    subscription.current = null;

    ultimaUbicacion.current = null;
    setDistanciaRecorrida(0);
    setEnViaje(false);
    setIniciando(false);

    onClose();
  };

  useEffect(() => {
    if (!visible) {
      subscription.current?.remove();
      subscription.current = null;
      ultimaUbicacion.current = null;
      setEnViaje(false);
      setIniciando(false);
    }
  }, [visible]);

  useEffect(() => {
    return () => {
      subscription.current?.remove();
      subscription.current = null;
    };
  }, []);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={() => {
        if (enViaje) {
          Alert.alert(
            'Viaje en curso',
            '¿Deseas salir sin guardar el recorrido?',
            [
              {
                text: 'Continuar viaje',
                style: 'cancel',
              },
              {
                text: 'Salir sin guardar',
                style: 'destructive',
                onPress: cancelarViaje,
              },
            ]
          );
        } else {
          cancelarViaje();
        }
      }}
    >
      <View style={styles.overlay}>
        <View
          style={[
            estilos.surface,
            styles.modalContainer,
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.titulo}>
              Registro de viaje
            </Text>

            <Text style={styles.subtitulo}>
              Seguimiento de distancia mediante GPS
            </Text>
          </View>
          <View
            style={[
              styles.estadoBox,
              enViaje
                ? styles.estadoActivo
                : styles.estadoInactivo,
            ]}
          >
            <View
              style={[
                styles.estadoIndicador,
                enViaje
                  ? styles.indicadorActivo
                  : styles.indicadorInactivo,
              ]}
            />

            <Text style={styles.estadoTexto}>
              {enViaje
                ? 'Seguimiento en curso'
                : iniciando
                  ? 'Iniciando GPS...'
                  : 'Viaje sin iniciar'}
            </Text>
          </View>
          <View style={styles.metricsContainer}>
            <Text style={styles.metricaEtiqueta}>
              Distancia recorrida
            </Text>

            <Text style={styles.distanciaText}>
              {distanciaRecorrida.toFixed(2)}
            </Text>

            <Text style={styles.unidadTexto}>
              kilómetros
            </Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoEtiqueta}>
              Kilometraje inicial
            </Text>

            <Text style={styles.infoValor}>
              {kilometrajeActual.toLocaleString()} km
            </Text>
          </View>
          {!enViaje ? (
            <TouchableOpacity
              style={[
                styles.btnPrincipal,
                styles.btnIniciar,
                iniciando && styles.btnDeshabilitado,
              ]}
              onPress={iniciarViaje}
              disabled={iniciando}
              activeOpacity={0.8}
              accessibilityRole="button"
            >
              <Text style={styles.btnTexto}>
                {iniciando
                  ? 'Iniciando GPS...'
                  : 'Iniciar viaje'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.btnPrincipal,
                styles.btnFinalizar,
              ]}
              onPress={finalizarViaje}
              activeOpacity={0.8}
              accessibilityRole="button"
            >
              <Text style={styles.btnTexto}>
                Finalizar y guardar viaje
              </Text>
            </TouchableOpacity>
          )}

          {!enViaje && (
            <TouchableOpacity
              style={styles.btnCancelar}
              onPress={cancelarViaje}
              activeOpacity={0.7}
              accessibilityRole="button"
            >
              <Text style={styles.btnCancelarTexto}>
                Cancelar
              </Text>
            </TouchableOpacity>
          )}

          {enViaje && (
            <TouchableOpacity
              style={styles.btnCancelarViaje}
              onPress={() => {
                Alert.alert(
                  'Cancelar viaje',
                  '¿Deseas descartar el recorrido acumulado?',
                  [
                    {
                      text: 'Continuar viaje',
                      style: 'cancel',
                    },
                    {
                      text: 'Descartar',
                      style: 'destructive',
                      onPress: cancelarViaje,
                    },
                  ]
                );
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.btnCancelarTexto}>
                Descartar recorrido
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const makeStyles = (t: ThemeContextType) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.65)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: t.espaciado.md,
    },

    modalContainer: {
      width: '100%',
      maxWidth: 440,
      padding: t.espaciado.lg,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: conAlpha(t.colores.borde, 40),
    },

    header: {
      alignItems: 'center',
      marginBottom: t.espaciado.md,
    },

    titulo: {
      fontSize: 21,
      fontWeight: 'bold',
      color: t.colores.texto,
      textAlign: 'center',
    },

    subtitulo: {
      fontSize: 12,
      color: t.colores.textoSecundario,
      textAlign: 'center',
      marginTop: 5,
    },

    estadoBox: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
      alignSelf: 'center',
      paddingHorizontal: t.espaciado.md,
      paddingVertical: 8,
      borderRadius: 20,
      marginBottom: t.espaciado.md,
    },

    estadoActivo: {
      backgroundColor: conAlpha('#22C55E', 12),
    },

    estadoInactivo: {
      backgroundColor: conAlpha(t.colores.texto, 6),
    },

    estadoIndicador: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },

    indicadorActivo: {
      backgroundColor: '#22C55E',
    },

    indicadorInactivo: {
      backgroundColor: t.colores.textoSecundario,
    },

    estadoTexto: {
      fontSize: 12,
      fontWeight: '600',
      color: t.colores.texto,
    },

    metricsContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: t.espaciado.lg,
      marginBottom: t.espaciado.md,
      borderRadius: 14,
      backgroundColor: conAlpha(t.colores.primario, 8),
      borderWidth: 1,
      borderColor: conAlpha(t.colores.primario, 20),
    },

    metricaEtiqueta: {
      fontSize: 13,
      color: t.colores.textoSecundario,
      marginBottom: 8,
    },

    distanciaText: {
      fontSize: 46,
      fontWeight: 'bold',
      color: t.colores.primario,
      fontVariant: ['tabular-nums'],
    },

    unidadTexto: {
      fontSize: 13,
      color: t.colores.textoSecundario,
      marginTop: 2,
    },

    infoBox: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: t.espaciado.md,
      marginBottom: t.espaciado.lg,
      borderRadius: 10,
      backgroundColor: conAlpha(t.colores.texto, 5),
      borderWidth: 1,
      borderColor: conAlpha(t.colores.borde, 30),
    },

    infoEtiqueta: {
      fontSize: 12,
      color: t.colores.textoSecundario,
    },

    infoValor: {
      fontSize: 14,
      fontWeight: 'bold',
      color: t.colores.texto,
    },

    btnPrincipal: {
      width: '100%',
      paddingVertical: 14,
      paddingHorizontal: t.espaciado.md,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },

    btnIniciar: {
      backgroundColor: '#16A34A',
    },

    btnFinalizar: {
      backgroundColor: '#DC2626',
    },

    btnDeshabilitado: {
      opacity: 0.6,
    },

    btnTexto: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontSize: 15,
      textAlign: 'center',
    },

    btnCancelar: {
      alignItems: 'center',
      marginTop: t.espaciado.md,
      paddingVertical: t.espaciado.sm,
    },

    btnCancelarViaje: {
      alignItems: 'center',
      marginTop: t.espaciado.md,
      paddingVertical: t.espaciado.sm,
    },

    btnCancelarTexto: {
      fontSize: 13,
      fontWeight: '600',
      color: t.colores.textoSecundario,
    },
  });

export default ViajeTrackerModal;