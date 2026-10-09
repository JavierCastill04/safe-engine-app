import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { shallowEqual } from 'react-redux';
import { useAppSelector } from '@/redux/hooks';
import { commonStyles, colores, espaciado } from '@/theme';

export const HomeScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();

  // Obtener todos los vehículos
  const vehiculos = useAppSelector((state) => state.vehiculos.vehiculos);

  // Obtener los mantenimientos ordenados por fecha descendente (más recientes primero)
  const mantenimientosRecientes = useAppSelector((state) => {
    const lista = [...state.mantenimientos.mantenimientos];
    return lista.sort((a: any, b: any) => {
      const fechaA = new Date(a.fecha || 0).getTime();
      const fechaB = new Date(b.fecha || 0).getTime();
      return fechaB - fechaA;
    }).slice(0, 5); // Mostrar los últimos 5
  }, shallowEqual);

  // Función auxiliar para obtener nombre del vehículo según su ID
  const obtenerNombreVehiculo = (vehiculoId: string) => {
    const vehiculo = vehiculos.find((v) => v.id === vehiculoId);
    return vehiculo ? `${vehiculo.marca} ${vehiculo.modelo}` : 'Vehículo';
  };

  return (
    <View style={[commonStyles.containerScreen, { paddingTop: insets.top + espaciado.sm }]}>
    

      {/* Resumen de Mantenimientos Recientes */}
      <View style={styles.seccionHeader}>
        <Text style={styles.seccionTitulo}>🛠 Mantenimientos Recientes</Text>
      </View>

      <View style={styles.listaContainer}>
        {mantenimientosRecientes.length === 0 ? (
          <View style={[commonStyles.surface, styles.emptyBox]}>
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
                style={[commonStyles.surface, styles.cardRecent]}
                onPress={() => {
                  navigation.getParent()?.navigate('HistorialMantenimientoScreen', {
                    vehiculoId: item.vehiculoId,
                    vehiculoNombre: obtenerNombreVehiculo(item.vehiculoId),
                  });
                }}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.vehiculoNombre}>
                    🚘 {obtenerNombreVehiculo(item.vehiculoId)}
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
                      Costo: <Text style={styles.bold}>\${item.costo}</Text>
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

export default HomeScreen;

const styles = StyleSheet.create({
  seccionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: espaciado.sm,
    marginTop: espaciado.xs,
  },
  seccionTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colores.texto,
  },
  listaContainer: {
    flex: 1,
  },
  listContent: {
    gap: espaciado.md,
    paddingBottom: espaciado.lg,
  },
  emptyBox: {
    padding: espaciado.xl,
    alignItems: 'center',
    borderRadius: 12,
  },
  emptyTexto: {
    color: colores.textoSecundario,
    textAlign: 'center',
    fontSize: 14,
  },
  cardRecent: {
    padding: espaciado.md,
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
    color: colores.primario,
  },
  fecha: {
    fontSize: 12,
    color: colores.textoSecundario,
  },
  tipoMantenimiento: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colores.texto,
    marginBottom: 4,
  },
  descripcion: {
    color: colores.textoSecundario,
    fontSize: 13,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    gap: espaciado.md,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  footerItem: {
    color: '#94A3B8',
    fontSize: 12,
  },
  bold: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});