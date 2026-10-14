import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { actualizarKilometraje } from '@/redux/slices/vehiculoSlice';
import { VehiculoFormModal } from '@/modules/vehiculos/components/VehiculosFormModal';
import { MantenimientoFormModal } from '@/modules/mantenimientos/components/MantenimientoFormModal';
import { generarHTMLReporte } from '@/modules/reportes/utils/ReportesUtils';

import {
  useStyles,
  useTheme,
  type ThemeContextType,
} from '@/hook/hooks';
import { conAlpha } from '@/theme/theme';

export const VehiculosScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const { estilos, espaciado } = useTheme();
  const styles = useStyles(makeStyles);

  const vehiculos = useAppSelector(
    (state) => state.vehiculos.vehiculos
  );

  const mantenimientos = useAppSelector(
    (state) => state.mantenimientos.mantenimientos
  );

  const [modalAgregarVehiculo, setModalAgregarVehiculo] =
    useState(false);

  const [modalMantenimiento, setModalMantenimiento] = useState<{
    visible: boolean;
    vehiculoId: string;
    kmActual: number;
  }>({
    visible: false,
    vehiculoId: '',
    kmActual: 0,
  });

  const [unidadPrueba, setUnidadPrueba] = useState<
    'metros' | 'millas'
  >('millas');

  const simularIncremento = (
    vehiculoId: string,
    kilometrajeActual: number,
    cantidad: number
  ) => {
    const kmAumento =
      unidadPrueba === 'metros'
        ? cantidad / 1000
        : cantidad * 1.60934;

    const nuevoKm = Math.round(
      kilometrajeActual + kmAumento
    );

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
      console.error(
        'Error al generar el reporte:',
        error
      );

      Alert.alert(
        'Error',
        'No fue posible generar el reporte. Inténtalo nuevamente.'
      );
    }
  };

  return (
    <View
      style={[
        estilos.containerScreen,
        {
          paddingTop: insets.top + espaciado.sm,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <Text style={styles.seccionTitulo}>
          Vehículos Registrados
        </Text>

        <Text style={styles.headerSubtitulo}>
          Administra tus vehículos y mantenimientos
        </Text>
      </View>
      <View
        style={[
          estilos.surface,
          styles.testBar,
        ]}
      >
        <View style={styles.testBarTexto}>
          <Text style={styles.testBarTitulo}>
            Simulación de recorrido
          </Text>

          <Text style={styles.textoSecundario}>
            Selecciona la unidad de incremento
          </Text>
        </View>

        <View style={styles.switchContainer}>
          <TouchableOpacity
            style={[
              styles.switchBtn,
              unidadPrueba === 'millas' &&
                styles.switchBtnActivo,
            ]}
            onPress={() => setUnidadPrueba('millas')}
            accessibilityRole="button"
            accessibilityState={{
              selected: unidadPrueba === 'millas',
            }}
          >
            <Text
              style={[
                styles.switchText,
                unidadPrueba === 'millas' &&
                  styles.switchTextActive,
              ]}
            >
              Millas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.switchBtn,
              unidadPrueba === 'metros' &&
                styles.switchBtnActivo,
            ]}
            onPress={() => setUnidadPrueba('metros')}
            accessibilityRole="button"
            accessibilityState={{
              selected: unidadPrueba === 'metros',
            }}
          >
            <Text
              style={[
                styles.switchText,
                unidadPrueba === 'metros' &&
                  styles.switchTextActive,
              ]}
            >
              Metros
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {vehiculos.length === 0 ? (
          <View
            style={[
              estilos.surface,
              styles.emptyBox,
            ]}
          >
            <Text style={styles.emptyTitulo}>
              No hay vehículos registrados
            </Text>

            <Text style={styles.emptyTexto}>
              Agrega tu primer vehículo para comenzar a gestionar
              sus mantenimientos.
            </Text>

            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => setModalAgregarVehiculo(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.emptyButtonTexto}>
                Agregar vehículo
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          vehiculos.map((v) => (
            <View
              key={v.id}
              style={[
                estilos.surface,
                styles.cardVehiculo,
              ]}
            >
              <View style={styles.cardHeader}>
                <TouchableOpacity
                  style={styles.vehiculoTituloContainer}
                  onPress={() =>
                    navigation.navigate(
                      'VehiculoDetalleScreen',
                      { vehiculoId: v.id }
                    )
                  }
                  activeOpacity={0.7}
                >
                  <Text style={styles.vehiculoNombre}>
                    {v.marca} {v.modelo} ({v.anio || '2020'})
                  </Text>

                  <Text style={styles.textoSecundario}>
                    Toca para ver los detalles
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnReporte}
                  onPress={() => generarReporteVehiculo(v)}
                  accessibilityRole="button"
                  accessibilityLabel={`Generar reporte PDF de ${v.marca} ${v.modelo}`}
                  activeOpacity={0.8}
                  hitSlop={8}
                >
                  <Text style={styles.btnReporteTexto}>
                    PDF
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.separador} />
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(
                    'VehiculoDetalleScreen',
                    { vehiculoId: v.id }
                  )
                }
                activeOpacity={0.8}
              >
                <View style={styles.infoRow}>
                  <Text style={styles.infoEtiqueta}>
                    Placa
                  </Text>

                  <Text style={styles.infoValor}>
                    {v.placa || 'Sin placa'}
                  </Text>
                </View>

                <View style={styles.odometroBox}>
                  <Text style={styles.odometroLabel}>
                    Kilometraje actual
                  </Text>

                  <Text style={styles.odometroText}>
                    {Number(
                      v.kilometrajeActual || 0
                    ).toLocaleString()} km
                  </Text>

                  <Text style={styles.odometroConversion}>
                    {unidadPrueba === 'millas'
                      ? `${(
                          v.kilometrajeActual / 1.60934
                        ).toFixed(1)} mi`
                      : `${(
                          v.kilometrajeActual * 1000
                        ).toLocaleString()} m`}
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={styles.odometroControls}>
                <Text style={styles.controlTitulo}>
                  Simular recorrido
                </Text>

                <View style={styles.btnRow}>
                  <TouchableOpacity
                    style={styles.btnIncremento}
                    accessibilityRole="button"
                    accessibilityLabel={
                      `Agregar ${
                        unidadPrueba === 'metros'
                          ? '100 metros'
                          : '1 milla'
                      } al recorrido simulado`
                    }
                    onPress={() =>
                      simularIncremento(
                        v.id,
                        v.kilometrajeActual,
                        unidadPrueba === 'metros' ? 100 : 1
                      )
                    }
                    activeOpacity={0.8}
                  >
                    <Text style={styles.btnIncrementoTexto}>
                      + {unidadPrueba === 'metros' ? '100 m' : '1 mi'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.btnIncremento}
                    accessibilityRole="button"
                    accessibilityLabel={
                      `Agregar ${
                        unidadPrueba === 'metros'
                          ? '500 metros'
                          : '10 millas'
                      } al recorrido simulado`
                    }
                    onPress={() =>
                      simularIncremento(
                        v.id,
                        v.kilometrajeActual,
                        unidadPrueba === 'metros' ? 500 : 10
                      )
                    }
                    activeOpacity={0.8}
                  >
                    <Text style={styles.btnIncrementoTexto}>
                      + {unidadPrueba === 'metros' ? '500 m' : '10 mi'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.accionesRow}>
                <TouchableOpacity
                  style={[
                    styles.btnAccion,
                    styles.btnRegistrar,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={
                    `Registrar mantenimiento de ${v.marca} ${v.modelo}`
                  }
                  onPress={() =>
                    setModalMantenimiento({
                      visible: true,
                      vehiculoId: v.id,
                      kmActual: v.kilometrajeActual,
                    })
                  }
                  activeOpacity={0.8}
                >
                  <Text style={styles.btnAccionTexto}>
                    Registrar mantenimiento
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.btnAccion,
                    styles.btnHistorial,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={
                    `Ver historial de ${v.marca} ${v.modelo}`
                  }
                  onPress={() => {
                    navigation.getParent()?.navigate(
                      'HistorialMantenimientoScreen',
                      {
                        vehiculoId: v.id,
                        vehiculoNombre: `${v.marca} ${v.modelo}`,
                      }
                    );
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.btnAccionTexto}>
                    Ver historial
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.fab,
          {
            bottom: Math.max(
              insets.bottom,
              espaciado.md
            ) + 12,
          },
        ]}
        onPress={() => setModalAgregarVehiculo(true)}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Agregar vehículo"
      >
        <Text style={styles.fabTexto}>+</Text>
      </TouchableOpacity>

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

const makeStyles = (t: ThemeContextType) =>
  StyleSheet.create({
    headerRow: {
      marginBottom: t.espaciado.md,
      marginTop: t.espaciado.xs,
    },

    seccionTitulo: {
      fontSize: 21,
      fontWeight: 'bold',
      color: t.colores.texto,
    },

    headerSubtitulo: {
      fontSize: 13,
      color: t.colores.textoSecundario,
      marginTop: 4,
    },

    textoSecundario: {
      fontSize: 12,
      color: t.colores.textoSecundario,
    },

    testBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: t.espaciado.md,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: conAlpha(t.colores.borde, 30),
      marginBottom: t.espaciado.md,
      gap: t.espaciado.sm,
    },

    testBarTexto: {
      flex: 1,
    },

    testBarTitulo: {
      fontSize: 13,
      fontWeight: 'bold',
      color: t.colores.texto,
      marginBottom: 3,
    },

    switchContainer: {
      flexDirection: 'row',
      gap: 5,
    },

    switchBtn: {
      paddingVertical: 7,
      paddingHorizontal: 9,
      borderRadius: 7,
      backgroundColor: conAlpha(t.colores.texto, 7),
      borderWidth: 1,
      borderColor: conAlpha(t.colores.borde, 30),
    },

    switchBtnActivo: {
      backgroundColor: t.colores.primario,
      borderColor: t.colores.primario,
    },

    switchText: {
      color: t.colores.textoSecundario,
      fontSize: 12,
      fontWeight: '500',
    },

    switchTextActive: {
      color: '#FFFFFF',
      fontWeight: 'bold',
    },

    scrollView: {
      flex: 1,
    },

    scrollContainer: {
      paddingBottom: 100,
      gap: t.espaciado.md,
    },

    cardVehiculo: {
      padding: t.espaciado.md,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: conAlpha(t.colores.borde, 30),
    },

    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: t.espaciado.sm,
    },

    vehiculoTituloContainer: {
      flex: 1,
    },

    vehiculoNombre: {
      fontSize: 17,
      fontWeight: 'bold',
      color: t.colores.texto,
      marginBottom: 4,
    },

    btnReporte: {
      minWidth: 48,
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 8,
      backgroundColor: conAlpha(t.colores.primario, 13),
      borderWidth: 1,
      borderColor: conAlpha(t.colores.primario, 40),
      alignItems: 'center',
      justifyContent: 'center',
    },

    btnReporteTexto: {
      fontSize: 12,
      fontWeight: 'bold',
      color: t.colores.primario,
    },

    separador: {
      height: 1,
      backgroundColor: conAlpha(t.colores.borde, 30),
      marginVertical: t.espaciado.md,
    },

    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: t.espaciado.sm,
    },

    infoEtiqueta: {
      fontSize: 13,
      color: t.colores.textoSecundario,
    },

    infoValor: {
      fontSize: 13,
      fontWeight: '600',
      color: t.colores.texto,
    },

    odometroBox: {
      padding: t.espaciado.md,
      borderRadius: 10,
      backgroundColor: conAlpha(t.colores.texto, 5),
      borderWidth: 1,
      borderColor: conAlpha(t.colores.borde, 25),
      marginBottom: t.espaciado.sm,
    },

    odometroLabel: {
      fontSize: 12,
      color: t.colores.textoSecundario,
      marginBottom: 5,
    },

    odometroText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: t.colores.primario,
    },

    odometroConversion: {
      fontSize: 12,
      color: t.colores.textoSecundario,
      marginTop: 3,
    },

    odometroControls: {
      backgroundColor: conAlpha(t.colores.texto, 5),
      padding: t.espaciado.sm,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: conAlpha(t.colores.borde, 25),
      marginVertical: t.espaciado.xs,
    },

    controlTitulo: {
      color: t.colores.textoSecundario,
      fontSize: 12,
      fontWeight: '600',
      marginBottom: t.espaciado.sm,
    },

    btnRow: {
      flexDirection: 'row',
      gap: t.espaciado.sm,
    },

    btnIncremento: {
      flex: 1,
      backgroundColor: conAlpha(t.colores.primario, 12),
      borderWidth: 1,
      borderColor: conAlpha(t.colores.primario, 35),
      paddingVertical: 10,
      paddingHorizontal: 8,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },

    btnIncrementoTexto: {
      color: t.colores.primario,
      fontSize: 13,
      fontWeight: 'bold',
    },

    accionesRow: {
      flexDirection: 'row',
      gap: t.espaciado.sm,
      marginTop: t.espaciado.md,
    },

    btnAccion: {
      flex: 1,
      minHeight: 44,
      paddingVertical: 10,
      paddingHorizontal: 8,
      borderRadius: 9,
      alignItems: 'center',
      justifyContent: 'center',
    },

    btnRegistrar: {
      backgroundColor: t.colores.primario,
    },

    btnHistorial: {
      backgroundColor: t.colores.gris,
    },

    btnAccionTexto: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: 'bold',
      textAlign: 'center',
    },

    emptyBox: {
      padding: t.espaciado.xl,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: conAlpha(t.colores.borde, 30),
      alignItems: 'center',
    },

    emptyTitulo: {
      color: t.colores.texto,
      fontSize: 17,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: t.espaciado.sm,
    },

    emptyTexto: {
      color: t.colores.textoSecundario,
      fontSize: 13,
      lineHeight: 20,
      textAlign: 'center',
      marginBottom: t.espaciado.md,
    },

    emptyButton: {
      backgroundColor: t.colores.primario,
      paddingVertical: 11,
      paddingHorizontal: t.espaciado.lg,
      borderRadius: 9,
    },

    emptyButtonTexto: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: 'bold',
    },

    fab: {
      position: 'absolute',
      right: 20,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: t.colores.primario,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 6,
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },

    fabTexto: {
      color: '#FFFFFF',
      fontSize: 32,
      fontWeight: '400',
      lineHeight: 36,
      textAlign: 'center',
    },
  });

export default VehiculosScreen;