import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { shallowEqual } from 'react-redux';
import { useAppSelector } from '@/redux/hooks';
import { useStyles, useTheme, type ThemeContextType } from '@/hook/hooks';
import { conAlpha } from '@/theme/theme';

export const HomeScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { estilos, espaciado } = useTheme(); 
  const styles = useStyles(makeStyles);

  const vehiculos = useAppSelector((state) => state.vehiculos.vehiculos);

  const mantenimientosRecientes = useAppSelector((state) => {
    const lista = [...state.mantenimientos.mantenimientos];
    return lista.sort((a: any, b: any) => {
      const fechaA = new Date(a.fecha || 0).getTime();
      const fechaB = new Date(b.fecha || 0).getTime();
      return fechaB - fechaA;
    }).slice(0, 5); 
  }, shallowEqual);

  const obtenerNombreVehiculo = (vehiculoId: string) => {
    const vehiculo = vehiculos.find((v) => v.id === vehiculoId);
    return vehiculo ? `${vehiculo.marca} ${vehiculo.modelo}` : 'Vehículo';
  };

  return (
    <View style={[estilos.containerScreen, { paddingTop: insets.top + espaciado.sm }]}>
      <View style={styles.seccionHeader}>
        <Text style={styles.seccionTitulo}>🛠 Mantenimientos Recientes</Text>
      </View>

      <View style={styles.listaContainer}>
        {mantenimientosRecientes.length === 0 ? (
          <View style={[estilos.surface, styles.tarjeta, styles.emptyBox]}>
            <Text style={styles.emptyTexto}>
              No hay mantenimientos registrados recientemente.
            </Text>
          </View>
        ) : (
          <FlatList
            data={mantenimientosRecientes}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }: { item: any }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                style={[estilos.surface, styles.tarjeta, styles.cardRecent]}
                onPress={() => {
                  navigation.getParent()?.navigate('HistorialMantenimientoScreen', {
                    vehiculoId: item.vehiculoId,
                    vehiculoNombre: obtenerNombreVehiculo(item.vehiculoId),
                  });
                }}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.vehiculoNombre}>
                   {obtenerNombreVehiculo(item.vehiculoId)}
                  </Text>
                  <Text style={styles.fecha}>
                    {item.fecha || new Date().toLocaleDateString()}
                  </Text>
                </View>

                <Text style={styles.tipoMantenimiento}>
                  {item.tipo || item.titulo || 'Mantenimiento General'}
                </Text>

                <Text style={styles.descripcion} numberOfLines={2}>
                  {item.descripcion || item.notas || 'Sin detalle registrado.'}
                </Text>

                <View style={styles.cardFooter}>
                  <Text style={styles.footerItem}>
                    Km: <Text style={styles.bold}>{(item.kilometrajeRealiz ?? item.kilometrajeActual ?? 0).toLocaleString()} km</Text>
                  </Text>
                  {item.costo ? (
                    <Text style={styles.footerItem}>
                      Costo: <Text style={styles.bold}>${item.costo}</Text>
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            )}
          />
        )}
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
      marginBottom: t.espaciado.sm,
      marginTop: t.espaciado.xs,
    },
    seccionTitulo: {
      fontSize: 18,
      fontWeight: 'bold',
      color: t.colores.texto,
    },
    listaContainer: {
      flex: 1,
    },
    listContent: {
      gap: t.espaciado.md,
      paddingBottom: t.espaciado.lg,
    },
    tarjeta: {
      borderWidth: 1,
      borderColor: conAlpha(t.colores.borde, 30),
    },
    emptyBox: {
      padding: t.espaciado.xl,
      alignItems: 'center',
      borderRadius: 12,
    },
    emptyTexto: {
      color: t.colores.textoSecundario,
      textAlign: 'center',
      fontSize: 14,
    },
    cardRecent: {
      padding: t.espaciado.md,
      borderRadius: 12,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    vehiculoNombre: {
      fontSize: 13,
      fontWeight: '600',
      color: t.colores.primario,
    },
    fecha: {
      fontSize: 12,
      color: t.colores.textoSecundario,
    },
    tipoMantenimiento: {
      fontSize: 16,
      fontWeight: 'bold',
      color: t.colores.texto,
      marginBottom: 4,
    },
    descripcion: {
      color: t.colores.textoSecundario,
      fontSize: 13,
      marginBottom: 8,
    },
    cardFooter: {
      flexDirection: 'row',
      gap: t.espaciado.md,
      paddingTop: 6,
      borderTopWidth: 1,
      borderTopColor: conAlpha(t.colores.texto, 15),
    },
    footerItem: {
      color: t.colores.gris,
      fontSize: 12,
    },
    bold: {
      color: t.colores.texto,
      fontWeight: 'bold',
    },
  });

export default HomeScreen;
