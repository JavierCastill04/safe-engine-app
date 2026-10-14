import React from 'react';
import {View,Text, StyleSheet,FlatList,TouchableOpacity,} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { shallowEqual } from 'react-redux';
import { useAppSelector } from '@/redux/hooks';
import {useStyles,useTheme, type ThemeContextType,} from '@/hook/hooks';
import { conAlpha } from '@/theme/theme';

export const HistorialMantenimientoScreen = ({
  route,
  navigation,
}: any) => {
  const insets = useSafeAreaInsets();
  const { estilos, espaciado } = useTheme();
  const styles = useStyles(makeStyles);

  const { vehiculoId, vehiculoNombre } = route.params || {};

  const mantenimientos = useAppSelector(
    (state) =>
      state.mantenimientos.mantenimientos
        .filter((m: any) => m.vehiculoId === vehiculoId)
        .slice()
        .sort((a: any, b: any) => {
          const fechaA = new Date(a.fecha || 0).getTime();
          const fechaB = new Date(b.fecha || 0).getTime();
          return fechaB - fechaA;
        }),
    shallowEqual
  );

  return (
    <View
      style={[
        estilos.containerScreen,
        {
          paddingTop: insets.top + espaciado.sm,
        },
      ]}
    >
      <View style={styles.seccionHeader}>
        <View style={styles.tituloContainer}>
          <View style={styles.tituloTextoContainer}>
            <Text style={styles.seccionTitulo}>
              Historial de Mantenimientos
            </Text>

            {vehiculoNombre ? (
              <Text style={styles.subtitulo}>
                Vehículo: {vehiculoNombre}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={styles.contadorContainer}>
          <Text style={styles.contadorNumero}>
            {mantenimientos.length}
          </Text>
          <Text style={styles.contadorTexto}>
            registros
          </Text>
        </View>
      </View>
      <View style={styles.listaContainer}>
        {mantenimientos.length === 0 ? (
          <View
            style={[
              estilos.surface,
              styles.tarjeta,
              styles.emptyBox,
            ]}
          >
            <Text style={styles.emptyTitulo}>
              Sin mantenimientos
            </Text>

            <Text style={styles.emptyTexto}>
              Todavía no hay registros de mantenimiento guardados
              para este vehículo.
            </Text>
          </View>
        ) : (
          <FlatList
            data={mantenimientos}
            keyExtractor={(item: any) => String(item.id)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }: { item: any }) => {
              const kilometraje =
                item.kilometrajeRealiz ??
                item.kilometrajeActual ??
                item.kilometraje ??
                0;

              return (
                <View
                  style={[
                    estilos.surface,
                    styles.tarjeta,
                    styles.cardHistorial,
                  ]}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.tipoMantenimiento}>
                      {item.tipo ||
                        item.titulo ||
                        'Mantenimiento General'}
                    </Text>

                    <Text style={styles.fecha}>
                      {item.fecha ||
                        new Date().toLocaleDateString()}
                    </Text>
                  </View>

                  <Text style={styles.descripcion}>
                    {item.descripcion ||
                      item.notas ||
                      'Sin detalle registrado.'}
                  </Text>
                  <View style={styles.snapshotBox}>
                    <Text style={styles.snapshotTitulo}>
                      Datos del registro
                    </Text>

                    <View style={styles.datosGrid}>
                      <View style={styles.datoItem}>
                        <Text style={styles.datoEtiqueta}>
                          Kilometraje
                        </Text>

                        <Text style={styles.datoValor}>
                          {Number(kilometraje).toLocaleString()} km
                        </Text>
                      </View>

                      {item.costo != null && item.costo !== '' ? (
                        <View style={styles.datoItem}>
                          <Text style={styles.datoEtiqueta}>
                            Costo
                          </Text>

                          <Text style={styles.datoValor}>
                            ${Number(item.costo).toLocaleString()}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                </View>
              );
            }}
          />
        )}
      </View>
      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom: Math.max(
              insets.bottom,
              espaciado.md
            ),
          },
        ]}
      >
        <TouchableOpacity
          style={styles.btnRegresarBottom}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.btnRegresarTexto}>
            ← Regresar a Vehículos
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const makeStyles = (t: ThemeContextType) =>
  StyleSheet.create({
    seccionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: t.espaciado.xs,
      marginBottom: t.espaciado.md,
      gap: t.espaciado.sm,
    },

    tituloContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },

    tituloTextoContainer: {
      flex: 1,
    },

    seccionTitulo: {
      fontSize: 18,
      fontWeight: 'bold',
      color: t.colores.texto,
    },

    subtitulo: {
      color: t.colores.textoSecundario,
      fontSize: 13,
      marginTop: 4,
    },

    contadorContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 60,
      paddingHorizontal: t.espaciado.sm,
      paddingVertical: t.espaciado.xs,
      borderRadius: 10,
      backgroundColor: conAlpha(t.colores.primario, 12),
    },

    contadorNumero: {
      fontSize: 18,
      fontWeight: 'bold',
      color: t.colores.primario,
    },

    contadorTexto: {
      fontSize: 10,
      color: t.colores.textoSecundario,
    },

    listaContainer: {
      flex: 1,
    },

    listContent: {
      gap: t.espaciado.md,
      paddingBottom: t.espaciado.md,
    },

    tarjeta: {
      borderWidth: 1,
      borderColor: conAlpha(t.colores.borde, 30),
    },

    emptyBox: {
      padding: t.espaciado.xl,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 12,
      marginTop: t.espaciado.sm,
    },

    emptyTitulo: {
      fontSize: 17,
      fontWeight: 'bold',
      color: t.colores.texto,
      marginBottom: t.espaciado.sm,
    },

    emptyTexto: {
      color: t.colores.textoSecundario,
      textAlign: 'center',
      fontSize: 14,
      lineHeight: 21,
    },

    cardHistorial: {
      padding: t.espaciado.md,
      borderRadius: 12,
    },

    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: t.espaciado.sm,
      marginBottom: t.espaciado.sm,
    },

    tipoMantenimiento: {
      flex: 1,
      fontSize: 16,
      fontWeight: 'bold',
      color: t.colores.texto,
    },

    fecha: {
      fontSize: 12,
      color: t.colores.textoSecundario,
    },

    descripcion: {
      color: t.colores.textoSecundario,
      fontSize: 13,
      lineHeight: 19,
      marginBottom: t.espaciado.md,
    },

    snapshotBox: {
      backgroundColor: conAlpha(t.colores.texto, 5),
      padding: t.espaciado.sm,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: conAlpha(t.colores.borde, 25),
    },

    snapshotTitulo: {
      color: t.colores.textoSecundario,
      fontSize: 12,
      fontWeight: '600',
      marginBottom: t.espaciado.sm,
    },

    datosGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: t.espaciado.md,
    },

    datoItem: {
      flex: 1,
      minWidth: 100,
    },

    datoEtiqueta: {
      color: t.colores.textoSecundario,
      fontSize: 11,
      marginBottom: 3,
    },

    datoValor: {
      color: t.colores.texto,
      fontSize: 13,
      fontWeight: 'bold',
    },

    bottomBar: {
      paddingTop: t.espaciado.sm,
      borderTopWidth: 1,
      borderTopColor: conAlpha(t.colores.borde, 30),
      backgroundColor: 'transparent',
    },

    btnRegresarBottom: {
      backgroundColor: t.colores.primario,
      paddingVertical: 14,
      paddingHorizontal: t.espaciado.md,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },

    btnRegresarTexto: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontSize: 15,
    },
  });

export default HistorialMantenimientoScreen;